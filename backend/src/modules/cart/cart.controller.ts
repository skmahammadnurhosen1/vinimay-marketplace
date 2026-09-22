import { Request, Response } from 'express';
import { cartRepository } from './cart.repository.js';
import { productRepository } from '../products/product.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { addCartItemSchema, updateCartItemSchema } from './cart.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import {
  CustomerCartView,
  EnrichedCartItem,
  SellerCartGroup,
  PublicSellerSummary,
} from '../../types/cart.js';

export async function hydrateCustomerCart(customerId: string): Promise<CustomerCartView> {
  const cart = await cartRepository.findByCustomerId(customerId);

  const enrichedItems: EnrichedCartItem[] = [];
  let hasStockIssues = false;

  for (const item of cart.items) {
    const product = await productRepository.findById(item.productId);
    const inventory = await inventoryRepository.findByProductId(item.productId);

    if (!product || product.status !== 'APPROVED') {
      hasStockIssues = true;
      continue;
    }

    const availableStock = inventory ? inventory.availableStock : 0;
    const isSufficient = availableStock >= item.quantity;
    if (!isSufficient) {
      hasStockIssues = true;
    }

    const itemTotal = product.price * item.quantity;
    const enriched: EnrichedCartItem = {
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: product.id,
        title: product.productName,
        brand: product.brand,
        partNumber: product.partNumber,
        oemNumber: product.oemNumber,
        category: product.category,
        subCategory: product.subCategory,
        partType: product.productType,
        price: product.price,
        mrp: product.mrp,
        discountPercentage: product.discount,
        image: product.images.length > 0 ? product.images[0].url : '/assets/cat_engine.jpg',
        inStock: availableStock > 0,
        availableStock,
        sellerId: product.sellerId,
      },
      itemTotal,
      isAvailable: isSufficient,
      stockMessage: isSufficient
        ? undefined
        : availableStock > 0
        ? `Only ${availableStock} units remaining in stock`
        : 'Out of stock',
      addedAt: item.addedAt,
    };

    enrichedItems.push(enriched);
  }

  // Group by seller
  const sellerMap = new Map<string, SellerCartGroup>();

  for (const item of enrichedItems) {
    const sellerId = item.product.sellerId;
    if (!sellerMap.has(sellerId)) {
      const sellerProfile = await sellerRepository.findById(sellerId);
      const sellerSummary: PublicSellerSummary = sellerProfile
        ? {
            id: sellerProfile.id,
            name: sellerProfile.businessName,
            tier: sellerProfile.sellerType,
            city: sellerProfile.businessAddress.city,
            state: sellerProfile.businessAddress.state,
            rating: sellerProfile.rating,
            reviewCount: sellerProfile.reviewCount,
            verified: sellerProfile.kycStatus === 'APPROVED',
          }
        : {
            id: sellerId,
            name: 'Verified Marketplace Merchant',
            tier: 'Authorized Distributor',
            city: 'Mumbai',
            state: 'Maharashtra',
            rating: 4.8,
            reviewCount: 120,
            verified: true,
          };

      sellerMap.set(sellerId, {
        seller: sellerSummary,
        items: [],
        subtotal: 0,
        itemCount: 0,
        shippingFee: 0,
        estimatedDelivery: '2-3 Business Days',
      });
    }

    const group = sellerMap.get(sellerId)!;
    group.items.push(item);
    group.subtotal += item.itemTotal;
    group.itemCount += item.quantity;
  }

  // Compute shipping fee per seller group (Free if group subtotal >= 1500, else 99)
  const groups: SellerCartGroup[] = [];
  let subtotal = 0;
  let shippingTotal = 0;
  let itemCount = 0;

  for (const group of sellerMap.values()) {
    group.shippingFee = group.subtotal >= 1500 ? 0 : 99;
    groups.push(group);
    subtotal += group.subtotal;
    shippingTotal += group.shippingFee;
    itemCount += group.itemCount;
  }

  return {
    customerId,
    items: enrichedItems,
    groups,
    subtotal,
    shippingTotal,
    totalPayable: subtotal + shippingTotal,
    itemCount,
    sellerCount: groups.length,
    hasStockIssues,
  };
}

export async function getCustomerCart(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to access cart', 401, 'AUTH_REQUIRED');
    return;
  }

  const cartView = await hydrateCustomerCart(req.user.uid);
  sendSuccess(res, { cart: cartView });
}

export async function addCartItem(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to modify cart', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = addCartItemSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const { productId, quantity } = parseResult.data;

  // Validate product exists & approved
  const product = await productRepository.findById(productId);
  if (!product || product.status !== 'APPROVED') {
    sendError(res, 'Product is currently unavailable or inactive', 400, 'PRODUCT_UNAVAILABLE');
    return;
  }

  // Validate stock
  const inventory = await inventoryRepository.findByProductId(productId);
  const currentAvailable = inventory ? inventory.availableStock : 0;
  if (currentAvailable < quantity) {
    sendError(
      res,
      `Insufficient stock available. Requested ${quantity}, but only ${currentAvailable} in stock.`,
      400,
      'INSUFFICIENT_STOCK'
    );
    return;
  }

  await cartRepository.addItem(req.user.uid, productId, quantity);
  const updatedCart = await hydrateCustomerCart(req.user.uid);
  sendSuccess(res, { cart: updatedCart });
}

export async function updateCartItem(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to modify cart', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.productId;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;

  const parseResult = updateCartItemSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const { quantity } = parseResult.data;

  // Validate stock
  const inventory = await inventoryRepository.findByProductId(productId);
  const currentAvailable = inventory ? inventory.availableStock : 0;
  if (currentAvailable < quantity) {
    sendError(
      res,
      `Insufficient stock available. Requested ${quantity}, but only ${currentAvailable} in stock.`,
      400,
      'INSUFFICIENT_STOCK'
    );
    return;
  }

  await cartRepository.updateQuantity(req.user.uid, productId, quantity);
  const updatedCart = await hydrateCustomerCart(req.user.uid);
  sendSuccess(res, { cart: updatedCart });
}

export async function removeCartItem(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to modify cart', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.productId;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;

  await cartRepository.removeItem(req.user.uid, productId);
  const updatedCart = await hydrateCustomerCart(req.user.uid);
  sendSuccess(res, { cart: updatedCart });
}

export async function clearCustomerCart(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to modify cart', 401, 'AUTH_REQUIRED');
    return;
  }

  await cartRepository.clearCart(req.user.uid);
  const updatedCart = await hydrateCustomerCart(req.user.uid);
  sendSuccess(res, { cart: updatedCart });
}
