import { Request, Response } from 'express';
import { sellerRepository } from '../sellers/seller.repository.js';
import { productRepository } from '../products/product.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import { returnRepository } from '../returns/return.repository.js';
import { refundRepository } from '../refunds/refund.repository.js';
import { warrantyRepository } from '../warranty/warranty.repository.js';
import { userRepository } from '../users/user.repository.js';
import { productVerificationRepository } from '../products/verification.repository.js';
import { financeRepository } from '../finance/finance.repository.js';
import { financeService } from '../finance/finance.service.js';
import { reviewSellerKycSchema } from '../sellers/seller.validation.js';
import { reviewProductSchema } from '../products/product.validation.js';
import { reviewProductVerificationSchema } from '../products/verification.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { SellerKYCStatus, SellerType } from '../../types/seller.js';
import { ProductStatus } from '../../types/product.js';
import { AccountStatus, UserProfile } from '../../types/auth.js';

function getParam(req: Request, key: string): string {
  const val = req.params[key];
  return Array.isArray(val) ? val[0] : (val || '');
}

// ==============================================================================
// 1. SELLER MANAGEMENT
// ==============================================================================

export async function listSellersForAdmin(req: Request, res: Response): Promise<void> {
  const { kycStatus } = req.query;
  const sellers = await sellerRepository.findAll(
    kycStatus ? { kycStatus: kycStatus as SellerKYCStatus } : undefined
  );
  sendSuccess(res, { sellers, total: sellers.length });
}

export async function reviewSellerKyc(req: Request, res: Response): Promise<void> {
  const sellerId = getParam(req, 'sellerId');
  const seller = await sellerRepository.findById(sellerId);
  if (!seller) {
    sendError(res, 'Seller not found', 404, 'SELLER_NOT_FOUND');
    return;
  }

  const parseResult = reviewSellerKycSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const { status, rejectionReason } = parseResult.data;
  const adminUid = req.user?.uid || 'admin';

  const updated = await sellerRepository.updateKycStatus(
    sellerId,
    status,
    adminUid,
    rejectionReason
  );

  sendSuccess(res, { seller: updated });
}

export async function updateSellerStatus(req: Request, res: Response): Promise<void> {
  const sellerId = getParam(req, 'sellerId');
  const { kycStatus, sellerType, rejectionReason } = req.body;

  const seller = await sellerRepository.findById(sellerId);
  if (!seller) {
    sendError(res, 'Seller not found', 404, 'SELLER_NOT_FOUND');
    return;
  }

  const updates: any = {};
  if (kycStatus) updates.kycStatus = kycStatus as SellerKYCStatus;
  if (sellerType) updates.sellerType = sellerType as SellerType;
  if (rejectionReason !== undefined) updates.rejectionReason = rejectionReason;

  const updated = await sellerRepository.update(sellerId, updates);
  sendSuccess(res, { seller: updated });
}

export async function configureSellerCommission(req: Request, res: Response): Promise<void> {
  const sellerId = getParam(req, 'sellerId');
  const { commissionRate } = req.body;

  if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
    sendError(res, 'Commission rate must be a number between 0 and 100', 400, 'VALIDATION_ERROR');
    return;
  }

  const seller = await sellerRepository.findById(sellerId);
  if (!seller) {
    sendError(res, 'Seller not found', 404, 'SELLER_NOT_FOUND');
    return;
  }

  const updatedConfig = await financeRepository.updateCommissionConfig(
    {
      sellerAgreedRates: { [sellerId]: commissionRate },
    },
    req.user?.uid || 'admin'
  );

  sendSuccess(res, { sellerId, agreedCommissionRate: commissionRate, config: updatedConfig });
}

// ==============================================================================
// 2. PRODUCT MANAGEMENT & AUTHENTICITY VERIFICATION
// ==============================================================================

export async function listProductsForAdmin(req: Request, res: Response): Promise<void> {
  const { status } = req.query;
  const result = await productRepository.findBySeller('', {
    status: status as ProductStatus,
    limit: 100,
  });
  sendSuccess(res, result);
}

export async function reviewProduct(req: Request, res: Response): Promise<void> {
  const productId = getParam(req, 'productId');
  const product = await productRepository.findById(productId);
  if (!product) {
    sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return;
  }

  const parseResult = reviewProductSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const { status, rejectionReason } = parseResult.data;
  const adminUid = req.user?.uid || 'admin';

  const updated = await productRepository.update(productId, {
    status,
    reviewedBy: adminUid,
    reviewedAt: new Date().toISOString(),
    rejectionReason: rejectionReason || null,
  });

  sendSuccess(res, { product: updated });
}

export async function reviewProductAuthenticity(req: Request, res: Response): Promise<void> {
  const productId = getParam(req, 'productId');
  const parseResult = reviewProductVerificationSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  let record = await productVerificationRepository.findByProductId(productId);
  const now = new Date().toISOString();
  const adminUid = req.user?.uid || 'admin';

  if (!record) {
    const product = await productRepository.findById(productId);
    if (!product) {
      sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
      return;
    }
    record = await productVerificationRepository.create({
      id: `verif_${productId}`,
      productId,
      sellerId: product.sellerId,
      brand: product.brand,
      productType: product.productType,
      status: parseResult.data.status,
      documents: [],
      rejectionReason: parseResult.data.rejectionReason || null,
      reviewedBy: adminUid,
      reviewedAt: now,
      history: [
        {
          status: parseResult.data.status,
          changedBy: adminUid,
          changedAt: now,
          notes: parseResult.data.notes || 'Admin authenticity determination',
        },
      ],
      createdAt: now,
      updatedAt: now,
    });
  } else {
    record = await productVerificationRepository.update(record.id, {
      status: parseResult.data.status,
      rejectionReason: parseResult.data.rejectionReason || null,
      reviewedBy: adminUid,
      reviewedAt: now,
      history: [
        ...record.history,
        {
          status: parseResult.data.status,
          changedBy: adminUid,
          changedAt: now,
          notes: parseResult.data.notes || 'Admin authenticity status update',
        },
      ],
    });
  }

  sendSuccess(res, { verification: record });
}

// ==============================================================================
// 3. ORDER & SUB-ORDER OVERSIGHT
// ==============================================================================

export async function listOrdersForAdmin(req: Request, res: Response): Promise<void> {
  const { status } = req.query;
  let orders = await orderRepository.findAllParentOrders();

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  // Hydrate all orders with their packages
  const hydratedOrders = await Promise.all(
    orders.map(async (order) => {
      const packages = await orderRepository.findSubOrdersByParentId(order.id);
      return { ...order, packages };
    })
  );

  sendSuccess(res, { orders: hydratedOrders, total: hydratedOrders.length });
}

export async function getOrderDetailsForAdmin(req: Request, res: Response): Promise<void> {
  const orderId = getParam(req, 'orderId');
  const order = await orderRepository.findParentOrderById(orderId);
  if (!order) {
    sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
    return;
  }

  const packages = await orderRepository.findSubOrdersByParentId(orderId);
  sendSuccess(res, { order: { ...order, packages } });
}

// ==============================================================================
// 4. RETURNS, REFUNDS & WARRANTY OVERSIGHT
// ==============================================================================

export async function listReturnsForAdmin(_req: Request, res: Response): Promise<void> {
  const returns = await returnRepository.findAll();
  sendSuccess(res, { returns, total: returns.length });
}

export async function listRefundsForAdmin(_req: Request, res: Response): Promise<void> {
  const refunds = await refundRepository.findAll();
  sendSuccess(res, { refunds, total: refunds.length });
}

export async function listWarrantyClaimsForAdmin(_req: Request, res: Response): Promise<void> {
  const claims = await warrantyRepository.findAll();
  sendSuccess(res, { warrantyClaims: claims, total: claims.length });
}

// ==============================================================================
// 5. CUSTOMER MANAGEMENT
// ==============================================================================

export async function listCustomersForAdmin(req: Request, res: Response): Promise<void> {
  const { search } = req.query;
  let users: UserProfile[] = await userRepository.findAll();
  // Filter for customers
  users = users.filter((u: UserProfile) => u.role === 'CUSTOMER');

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    users = users.filter(
      (u: UserProfile) =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phoneNumber && u.phoneNumber.includes(q))
    );
  }

  // Mask sensitive credentials
  const sanitized = users.map((u: UserProfile) => ({
    uid: u.uid,
    displayName: u.displayName,
    email: u.email,
    phoneNumber: u.phoneNumber,
    accountStatus: u.accountStatus,
    emailVerified: u.emailVerified,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  }));

  sendSuccess(res, { customers: sanitized, total: sanitized.length });
}

export async function getCustomerDetailForAdmin(req: Request, res: Response): Promise<void> {
  const customerId = getParam(req, 'customerId');
  const user = await userRepository.findByUid(customerId);
  if (!user) {
    sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    return;
  }

  const orders = await orderRepository.findByCustomerId(customerId);
  const returns = await returnRepository.findByCustomerId(customerId);
  const warrantyClaims = await warrantyRepository.findByCustomerId(customerId);

  sendSuccess(res, {
    customer: {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountStatus: user.accountStatus,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    },
    orders,
    returns,
    warrantyClaims,
  });
}

export async function updateCustomerStatus(req: Request, res: Response): Promise<void> {
  const customerId = getParam(req, 'customerId');
  const { accountStatus } = req.body;

  if (!accountStatus || !['ACTIVE', 'SUSPENDED', 'DISABLED'].includes(accountStatus)) {
    sendError(res, 'Invalid account status', 400, 'VALIDATION_ERROR');
    return;
  }

  const updated = await userRepository.updateAccountStatus(
    customerId,
    accountStatus as AccountStatus
  );
  if (!updated) {
    sendError(res, 'Customer not found', 404, 'CUSTOMER_NOT_FOUND');
    return;
  }

  sendSuccess(res, {
    customer: {
      uid: updated.uid,
      displayName: updated.displayName,
      email: updated.email,
      accountStatus: updated.accountStatus,
    },
  });
}

// ==============================================================================
// 6. MARKETPLACE REPORTS & FINANCE OVERVIEW
// ==============================================================================

export async function getMarketplaceReports(_req: Request, res: Response): Promise<void> {
  const summary = await financeService.getFinancialSummary();
  const sellers = await sellerRepository.findAll();
  const products = await productRepository.findAll();
  const returns = await returnRepository.findAll();
  const warranty = await warrantyRepository.findAll();

  sendSuccess(res, {
    report: {
      finance: summary,
      counts: {
        totalSellers: sellers.length,
        approvedSellers: sellers.filter((s) => s.kycStatus === 'APPROVED').length,
        totalProducts: products.length,
        approvedProducts: products.filter((p) => p.status === 'APPROVED').length,
        totalReturns: returns.length,
        totalWarrantyClaims: warranty.length,
      },
      generatedAt: new Date().toISOString(),
    },
  });
}
