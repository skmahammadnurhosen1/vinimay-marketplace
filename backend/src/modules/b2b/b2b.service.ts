import { randomUUID } from 'node:crypto';
import { b2bRepository } from './b2b.repository.js';
import { productRepository } from '../products/product.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import {
  B2BAccountEntity,
  B2BAccountType,
  BulkOrderItemRequest,
  BulkOrderQuote,
  BulkOrderQuoteItem,
} from '../../types/b2b.js';
import { ParentOrderEntity, SellerSubOrderEntity, OrderItemEntity } from '../../types/order.js';

export class B2BService {
  async registerAccount(params: {
    userId: string;
    accountType: B2BAccountType;
    businessName: string;
    tradeLicenseNumber?: string;
    tradeLicense?: string;
    gstin: string;
    pan: string;
    contactPerson: string;
    mobile?: string;
    phone?: string;
    email?: string;
    businessAddress?: any;
    address?: any;
    fleetSize?: number;
    bayCount?: number;
  }): Promise<B2BAccountEntity> {
    const existing = await b2bRepository.findAccountByUserId(params.userId);
    if (existing) {
      throw new Error('B2B account already registered for this user');
    }

    const now = new Date().toISOString();

    const mobile = params.mobile || (params as any).phone || '9999999999';
    const email = params.email || 'b2b@example.com';
    const rawAddress = params.businessAddress || (params as any).address || {
      addressLine1: 'Industrial Area',
      city: 'Delhi',
      state: 'Delhi',
      pinCode: '110001',
      type: 'garage',
    };
    const tradeLicenseNumber = params.tradeLicenseNumber || (params as any).tradeLicense;

    const creditObj = {
      creditStatus: 'FUTURE_CREDIT_UNAVAILABLE' as const,
      status: 'NOT_ELIGIBLE',
      availableCredit: 0,
      requestedLimit: 500000,
      notice: 'B2B credit lines are a future marketplace capability and currently inactive.',
    };

    const account: any = {
      id: `b2b_${randomUUID()}`,
      userId: params.userId,
      accountType: params.accountType,
      businessName: params.businessName,
      tradeLicenseNumber,
      gstin: params.gstin,
      pan: params.pan,
      contactPerson: params.contactPerson,
      mobile,
      email,
      businessAddress: {
        id: `addr_${randomUUID()}`,
        userId: params.userId,
        country: 'India',
        isDefault: true,
        createdAt: now,
        updatedAt: now,
        ...rawAddress,
      },
      fleetSize: params.fleetSize,
      bayCount: params.bayCount,
      verificationStatus: 'PENDING',
      rejectionReason: null,
      credit: creditObj,
      creditStatus: creditObj,
      createdAt: now,
      updatedAt: now,
    };

    return b2bRepository.createAccount(account);
  }

  async calculateItemB2BPrice(
    productId: string,
    accountType: B2BAccountType = 'GARAGE',
    quantity = 1
  ): Promise<{
    unitPrice: number;
    regularPrice: number;
    discountPercent: number;
    discountPercentage?: number;
    totalPrice?: number;
  }> {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const regularPrice = product.price;
    const pricingConfig = await b2bRepository.getProductB2BPricing(productId);

    if (pricingConfig) {
      let tierPrice = pricingConfig.baseB2BPrice;
      const sortedTiers = [...pricingConfig.tiers].sort((a, b) => b.minQuantity - a.minQuantity);
      for (const tier of sortedTiers) {
        if (quantity >= tier.minQuantity) {
          tierPrice = tier.price;
          break;
        }
      }

      const extraDiscountPercent =
        accountType === 'GARAGE'
          ? pricingConfig.garageDiscountPercent || 0
          : pricingConfig.fleetDiscountPercent || 0;

      const finalPrice = Math.round(tierPrice * (1 - extraDiscountPercent / 100));
      const discountPercent = Math.round(((regularPrice - finalPrice) / regularPrice) * 100);
      return {
        unitPrice: finalPrice,
        regularPrice,
        discountPercent,
        discountPercentage: discountPercent,
        totalPrice: finalPrice * quantity,
      };
    }

    // Default dynamic B2B pricing model:
    // Base 15% trade discount, + 5% for volume >= 10, + 10% for volume >= 25
    let b2bDiscount = 15;
    if (quantity >= 25) {
      b2bDiscount = 25;
    } else if (quantity >= 10) {
      b2bDiscount = 20;
    }

    if (accountType === 'FLEET' && quantity >= 10) {
      b2bDiscount += 2; // Extra 2% incentive for fleet commercial vehicles
    }

    const unitPrice = Math.round(regularPrice * (1 - b2bDiscount / 100));
    return {
      unitPrice,
      regularPrice,
      discountPercent: b2bDiscount,
      discountPercentage: b2bDiscount,
      totalPrice: unitPrice * quantity,
    };
  }

  async createBulkOrderQuote(
    items: BulkOrderItemRequest[],
    accountType: B2BAccountType = 'GARAGE'
  ): Promise<BulkOrderQuote> {
    const quoteItems: BulkOrderQuoteItem[] = [];
    let subtotal = 0;
    let totalTax = 0;
    let totalRegular = 0;

    for (const req of items) {
      const product = await productRepository.findById(req.productId);
      if (!product) {
        throw new Error(`Product ${req.productId} not found`);
      }

      const inv = await inventoryRepository.findByProductId(req.productId);
      const availableStock = inv ? inv.availableStock : 0;

      if (availableStock < req.quantity) {
        throw new Error(
          `Insufficient stock for ${product.productName}. Requested: ${req.quantity}, Available: ${availableStock}`
        );
      }

      const seller = await sellerRepository.findById(product.sellerId);
      const { unitPrice, regularPrice } = await this.calculateItemB2BPrice(
        req.productId,
        accountType,
        req.quantity
      );

      const lineTotal = unitPrice * req.quantity;
      const gstRate = product.gstRate || 18;
      const taxable = Math.round((lineTotal / (1 + gstRate / 100)) * 100) / 100;
      const tax = Math.round((lineTotal - taxable) * 100) / 100;

      subtotal += taxable;
      totalTax += tax;
      totalRegular += regularPrice * req.quantity;

      quoteItems.push({
        productId: product.id,
        productName: product.productName,
        sellerId: product.sellerId,
        sellerName: seller?.businessName || 'Auto Parts Seller',
        brand: product.brand,
        partNumber: product.partNumber,
        quantity: req.quantity,
        unitPrice,
        regularPrice,
        gstRate,
        taxableAmount: taxable,
        taxAmount: tax,
        totalAmount: lineTotal,
        availableStock,
      });
    }

    const shippingTotal = 0; // Free shipping for all B2B bulk orders
    const grandTotal = Math.round((subtotal + totalTax + shippingTotal) * 100) / 100;
    const totalSavings = Math.round((totalRegular - (subtotal + totalTax)) * 100) / 100;

    return {
      items: quoteItems,
      subtotal: Math.round(subtotal * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      shippingTotal,
      grandTotal,
      totalSavings: Math.max(0, totalSavings),
    };
  }

  async executeBulkOrder(params: {
    userId: string;
    b2bAccount: B2BAccountEntity;
    items: BulkOrderItemRequest[];
    shippingAddress: any;
    paymentMethod: any;
  }): Promise<{
    order: ParentOrderEntity;
    parentOrder: ParentOrderEntity;
    packages: SellerSubOrderEntity[];
    subOrders: SellerSubOrderEntity[];
  }> {
    const quote = await this.createBulkOrderQuote(params.items, params.b2bAccount.accountType);

    // Group quote items by seller
    const sellerMap = new Map<string, BulkOrderQuoteItem[]>();
    for (const item of quote.items) {
      if (!sellerMap.has(item.sellerId)) {
        sellerMap.set(item.sellerId, []);
      }
      sellerMap.get(item.sellerId)!.push(item);
    }

    const parentOrderId = `ord_bulk_${randomUUID()}`;
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `B2B-${randomNum}`;
    const now = new Date().toISOString();

    const subOrders: SellerSubOrderEntity[] = [];
    const subOrderIds: string[] = [];

    let pkgIndex = 1;
    for (const [sellerId, items] of sellerMap.entries()) {
      const subOrderId = `sub_bulk_${randomUUID()}`;
      const subOrderNumber = `${orderNumber}-PKG${pkgIndex++}`;

      const seller = await sellerRepository.findById(sellerId);
      const pkgSubtotal = items.reduce((sum, i) => sum + i.taxableAmount, 0);
      const pkgTax = items.reduce((sum, i) => sum + i.taxAmount, 0);
      const pkgTotal = items.reduce((sum, i) => sum + i.totalAmount, 0);

      const orderItems: OrderItemEntity[] = items.map((i) => ({
        productId: i.productId,
        title: i.productName,
        brand: i.brand,
        partNumber: i.partNumber,
        oemNumber: '',
        partType: 'B2B Bulk Spares',
        image: '',
        unitPrice: i.unitPrice,
        mrp: i.regularPrice,
        gstRate: i.gstRate,
        quantity: i.quantity,
        totalPrice: i.totalAmount,
        taxAmount: i.taxAmount,
        sellerId: i.sellerId,
      }));

      const subOrder: SellerSubOrderEntity = {
        id: subOrderId,
        subOrderNumber,
        parentOrderId,
        orderNumber,
        sellerId,
        sellerName: seller?.businessName || 'Auto Parts Seller',
        sellerCity: seller?.businessAddress.city || 'Delhi',
        sellerState: seller?.businessAddress.state || 'Delhi',
        sellerTier: seller?.sellerType || 'Wholesaler',
        sellerVerified: seller?.kycStatus === 'APPROVED',
        items: orderItems,
        subtotal: Math.round(pkgSubtotal * 100) / 100,
        taxAmount: Math.round(pkgTax * 100) / 100,
        shippingFee: 0,
        totalAmount: Math.round(pkgTotal * 100) / 100,
        status: 'CONFIRMED',
        createdAt: now,
        updatedAt: now,
      };

      await orderRepository.createSubOrder(subOrder);
      subOrders.push(subOrder);
      subOrderIds.push(subOrderId);

      // Decrement inventory atomically
      for (const item of items) {
        await inventoryRepository.adjustStock({
          productId: item.productId,
          sellerId: item.sellerId,
          delta: -item.quantity,
          type: 'SALE',
          reason: `B2B Order #${orderNumber}`,
          referenceId: parentOrderId,
          performedBy: params.userId,
        });
      }
    }

    const shippingAddress = {
      ...params.shippingAddress,
      gstin: params.b2bAccount.gstin,
      pan: params.b2bAccount.pan,
      companyName: params.b2bAccount.businessName,
    };

    const parentOrder: ParentOrderEntity = {
      id: parentOrderId,
      orderNumber,
      customerId: params.userId,
      customerName: `${params.b2bAccount.businessName} (${params.b2bAccount.contactPerson})`,
      customerEmail: params.b2bAccount.email,
      customerPhone: params.b2bAccount.mobile,
      shippingAddress,
      subtotal: quote.subtotal,
      discountTotal: quote.totalSavings,
      taxAmount: quote.totalTax,
      shippingTotal: 0,
      totalPayable: quote.grandTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'PAID',
      paymentRef: `PAY-B2B-${randomNum}`,
      status: 'CONFIRMED',
      sellerCount: sellerMap.size,
      itemCount: quote.items.reduce((sum, i) => sum + i.quantity, 0),
      subOrderIds,
      packages: subOrders,
      isB2BOrder: true,
      createdAt: now,
      updatedAt: now,
    };

    await orderRepository.createParentOrder(parentOrder);
    return { order: parentOrder, parentOrder, packages: subOrders, subOrders };
  }

  async repeatOrder(params: {
    userId: string;
    b2bAccount: B2BAccountEntity;
    previousOrderId: string;
  }): Promise<{
    order: ParentOrderEntity;
    parentOrder: ParentOrderEntity;
    packages: SellerSubOrderEntity[];
    subOrders: SellerSubOrderEntity[];
  }> {
    const previousOrder = await orderRepository.findParentOrderById(params.previousOrderId);
    if (!previousOrder) {
      throw new Error('Previous order not found');
    }

    if (previousOrder.customerId !== params.userId) {
      throw new Error('Cannot re-order past orders belonging to another user');
    }

    const previousSubs = await orderRepository.findSubOrdersByParentId(params.previousOrderId);
    const itemsToOrder: BulkOrderItemRequest[] = [];

    for (const sub of previousSubs) {
      for (const item of sub.items) {
        itemsToOrder.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    // Re-validate and execute order
    return this.executeBulkOrder({
      userId: params.userId,
      b2bAccount: params.b2bAccount,
      items: itemsToOrder,
      shippingAddress: previousOrder.shippingAddress,
      paymentMethod: previousOrder.paymentMethod,
    });
  }
}

export const b2bService = new B2BService();
