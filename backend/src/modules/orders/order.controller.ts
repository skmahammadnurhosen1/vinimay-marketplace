import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { orderRepository } from './order.repository.js';
import { cartRepository } from '../cart/cart.repository.js';
import { productRepository } from '../products/product.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { databaseRepository } from '../database/database.repository.js';
import { createOrderSchema, updateSubOrderStatusSchema } from './order.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import {
  ParentOrderEntity,
  SellerSubOrderEntity,
  OrderItemEntity,
} from '../../types/order.js';
import { AddressEntity } from '../../types/database.js';

// ==============================================================================
// CUSTOMER ORDER CREATION & CHECKOUT
// ==============================================================================

export async function createMarketplaceOrder(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to checkout', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = createOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const input = parseResult.data;

  // 1. Resolve Delivery Address
  let shippingAddress: AddressEntity;
  if (input.addressId) {
    const matched = await databaseRepository.getAddressById(input.addressId, req.user.uid);
    if (!matched) {
      sendError(res, 'Delivery address not found', 404, 'ADDRESS_NOT_FOUND');
      return;
    }
    shippingAddress = matched;
  } else if (input.shippingAddress) {
    const now = new Date().toISOString();
    shippingAddress = {
      ...input.shippingAddress,
      country: 'India',
      id: `addr_${randomUUID()}`,
      userId: req.user.uid,
      createdAt: now,
      updatedAt: now,
    };
  } else {
    sendError(res, 'A valid delivery address is required for order creation', 400, 'MISSING_ADDRESS');
    return;
  }

  // 2. Fetch Customer Cart
  const cart = await cartRepository.findByCustomerId(req.user.uid);
  if (!cart.items || cart.items.length === 0) {
    sendError(res, 'Shopping cart is empty. Please add products before checking out.', 400, 'EMPTY_CART');
    return;
  }

  // 3. Pre-Order Authoritative Verification
  interface ValidatedItem {
    productId: string;
    product: Awaited<ReturnType<typeof productRepository.findById>> extends null ? never : NonNullable<Awaited<ReturnType<typeof productRepository.findById>>>;
    seller: Awaited<ReturnType<typeof sellerRepository.findById>> extends null ? never : NonNullable<Awaited<ReturnType<typeof sellerRepository.findById>>>;
    quantity: number;
    unitPrice: number;
    mrp: number;
    gstRate: number;
  }

  const validatedItems: ValidatedItem[] = [];

  for (const item of cart.items) {
    const product = await productRepository.findById(item.productId);
    if (!product || product.status !== 'APPROVED') {
      sendError(
        res,
        `Product "${product ? product.productName : item.productId}" is no longer available for purchase.`,
        400,
        'PRODUCT_UNAVAILABLE'
      );
      return;
    }

    const seller = await sellerRepository.findById(product.sellerId);
    if (!seller || seller.kycStatus !== 'APPROVED') {
      sendError(
        res,
        `Merchant for "${product.productName}" is currently unverified or suspended.`,
        400,
        'SELLER_UNAVAILABLE'
      );
      return;
    }

    const inventory = await inventoryRepository.findByProductId(item.productId);
    const available = inventory ? inventory.availableStock : 0;
    if (available < item.quantity) {
      sendError(
        res,
        `Insufficient stock for "${product.productName}". Requested: ${item.quantity}, Available: ${available}.`,
        400,
        'INSUFFICIENT_STOCK'
      );
      return;
    }

    validatedItems.push({
      productId: item.productId,
      product,
      seller,
      quantity: item.quantity,
      unitPrice: product.price,
      mrp: product.mrp,
      gstRate: product.gstRate || 18,
    });
  }

  // 4. Atomic Inventory Decrement Loop with Rollback Guard
  const decrementedItems: { productId: string; sellerId: string; quantity: number }[] = [];
  const now = new Date().toISOString();
  const parentOrderId = `order_${randomUUID()}`;
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `APH-2026-${randomSuffix}`;

  try {
    for (const vItem of validatedItems) {
      await inventoryRepository.adjustStock({
        productId: vItem.productId,
        sellerId: vItem.seller.id,
        delta: -vItem.quantity,
        type: 'SALE',
        reason: `Order #${orderNumber}`,
        referenceId: parentOrderId,
        performedBy: req.user.uid,
      });

      decrementedItems.push({
        productId: vItem.productId,
        sellerId: vItem.seller.id,
        quantity: vItem.quantity,
      });
    }
  } catch (error: unknown) {
    // Rollback any items that were decremented before the failure
    for (const dItem of decrementedItems) {
      try {
        await inventoryRepository.adjustStock({
          productId: dItem.productId,
          sellerId: dItem.sellerId,
          delta: dItem.quantity,
          type: 'RETURN_RESTOCK',
          reason: `Rollback failed Order #${orderNumber}`,
          referenceId: parentOrderId,
          performedBy: req.user.uid,
        });
      } catch (rollbackErr) {
        // Log rollback error
      }
    }

    const message = error instanceof Error ? error.message : 'Inventory allocation failed during checkout';
    sendError(res, message, 400, 'INVENTORY_ALLOCATION_FAILED');
    return;
  }

  // 5. Multi-Vendor Grouping & Sub-Order Creation
  const sellerGroups = new Map<string, ValidatedItem[]>();
  for (const vItem of validatedItems) {
    const sId = vItem.seller.id;
    if (!sellerGroups.has(sId)) {
      sellerGroups.set(sId, []);
    }
    sellerGroups.get(sId)!.push(vItem);
  }

  const createdSubOrders: SellerSubOrderEntity[] = [];
  let parentSubtotal = 0;
  let parentTaxAmount = 0;
  let parentShippingTotal = 0;
  let totalMRP = 0;

  let pkgIndex = 1;
  for (const [sellerId, items] of sellerGroups.entries()) {
    const seller = items[0].seller;
    const subOrderId = `sub_${randomUUID()}`;
    const subOrderNumber = `ORD-${orderNumber}-PKG${pkgIndex++}`;

    const orderItems: OrderItemEntity[] = items.map((i) => {
      const totalPrice = i.unitPrice * i.quantity;
      const taxAmount = Math.round(totalPrice * (i.gstRate / 100));
      return {
        productId: i.productId,
        title: i.product.productName,
        brand: i.product.brand,
        partNumber: i.product.partNumber,
        oemNumber: i.product.oemNumber,
        partType: i.product.productType,
        image: i.product.images.length > 0 ? i.product.images[0].url : '/assets/cat_engine.jpg',
        unitPrice: i.unitPrice,
        mrp: i.mrp,
        gstRate: i.gstRate,
        quantity: i.quantity,
        totalPrice,
        taxAmount,
        sellerId,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = orderItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const shippingFee = subtotal >= 1500 ? 0 : 99;
    const totalAmount = subtotal + shippingFee;

    const groupMRP = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
    totalMRP += groupMRP;

    parentSubtotal += subtotal;
    parentTaxAmount += taxAmount;
    parentShippingTotal += shippingFee;

    const subOrder: SellerSubOrderEntity = {
      id: subOrderId,
      subOrderNumber,
      parentOrderId,
      orderNumber,
      sellerId,
      sellerName: seller.businessName,
      sellerCity: seller.businessAddress.city,
      sellerState: seller.businessAddress.state,
      sellerTier: seller.sellerType,
      sellerVerified: seller.kycStatus === 'APPROVED',
      items: orderItems,
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
      status: 'CREATED',
      createdAt: now,
      updatedAt: now,
    };

    await orderRepository.createSubOrder(subOrder);
    createdSubOrders.push(subOrder);
  }

  // 6. Parent Marketplace Order Creation
  const discountTotal = Math.max(0, totalMRP - parentSubtotal);
  const totalPayable = parentSubtotal + parentShippingTotal;
  const paymentRef = `${input.paymentMethod.toUpperCase()}-${randomUUID().slice(0, 8).toUpperCase()}`;

  const parentOrder: ParentOrderEntity = {
    id: parentOrderId,
    orderNumber,
    customerId: req.user.uid,
    customerName: req.user.displayName || 'Marketplace Customer',
    customerEmail: req.user.email,
    customerPhone: shippingAddress.phone,
    shippingAddress,
    vehicleContext: input.vehicleContext || null,
    subtotal: parentSubtotal,
    discountTotal,
    taxAmount: parentTaxAmount,
    shippingTotal: parentShippingTotal,
    totalPayable,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === 'cod' ? 'PENDING' : 'PAID',
    paymentRef,
    status: 'CREATED',
    sellerCount: createdSubOrders.length,
    itemCount: validatedItems.reduce((sum, i) => sum + i.quantity, 0),
    subOrderIds: createdSubOrders.map((s) => s.id),
    packages: createdSubOrders,
    createdAt: now,
    updatedAt: now,
  };

  await orderRepository.createParentOrder(parentOrder);

  // 7. Clear Customer Cart Upon Successful Checkout
  await cartRepository.clearCart(req.user.uid);

  sendSuccess(
    res,
    {
      order: parentOrder,
      packages: createdSubOrders,
    },
    201
  );
}

export async function getCustomerOrders(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const orders = await orderRepository.findParentOrdersByCustomer(req.user.uid);

  // Hydrate packages
  const hydrated = await Promise.all(
    orders.map(async (order) => {
      const packages = await orderRepository.findSubOrdersByParentId(order.id);
      return {
        ...order,
        packages,
      };
    })
  );

  sendSuccess(res, { orders: hydrated, total: hydrated.length });
}

export async function getCustomerOrderById(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const order = await orderRepository.findParentOrderById(id);
  if (!order) {
    sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
    return;
  }

  // Cross-customer isolation
  if (order.customerId !== req.user.uid && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access to order', 403, 'FORBIDDEN');
    return;
  }

  const packages = await orderRepository.findSubOrdersByParentId(order.id);
  sendSuccess(res, { order: { ...order, packages } });
}

// ==============================================================================
// SELLER SUB-ORDER MANAGEMENT (TENANT ISOLATED BY SELLER ID)
// ==============================================================================

export async function getSellerSubOrders(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required to access merchant orders', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const subOrders = await orderRepository.findSubOrdersBySeller(seller.id);
  sendSuccess(res, { subOrders, total: subOrders.length });
}

export async function getSellerSubOrderById(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.subOrderId;
  const subOrderId = Array.isArray(rawId) ? rawId[0] : rawId;

  const subOrder = await orderRepository.findSubOrderById(subOrderId);
  if (!subOrder) {
    sendError(res, 'Sub-order not found', 404, 'SUB_ORDER_NOT_FOUND');
    return;
  }

  // Multi-tenant check: Seller can only see its own sub-order
  if (subOrder.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access to this merchant package', 403, 'FORBIDDEN');
    return;
  }

  sendSuccess(res, { subOrder });
}

export async function updateSellerSubOrderStatus(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.subOrderId;
  const subOrderId = Array.isArray(rawId) ? rawId[0] : rawId;

  const subOrder = await orderRepository.findSubOrderById(subOrderId);
  if (!subOrder) {
    sendError(res, 'Sub-order not found', 404, 'SUB_ORDER_NOT_FOUND');
    return;
  }

  if (subOrder.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access to this merchant package', 403, 'FORBIDDEN');
    return;
  }

  const parseResult = updateSubOrderStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const updated = await orderRepository.updateSubOrderStatus(subOrderId, parseResult.data.status);
  sendSuccess(res, { subOrder: updated });
}
