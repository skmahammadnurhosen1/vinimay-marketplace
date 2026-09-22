import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { warrantyRepository } from './warranty.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import { productRepository } from '../products/product.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import {
  createWarrantyClaimSchema,
  reviewWarrantyClaimSchema,
  updateWarrantyOutcomeSchema,
} from './warranty.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { WarrantyClaimEntity } from '../../types/warranty.js';

function parseWarrantyMonths(warrantyStr: string): number {
  const match = warrantyStr.match(/(\d+)\s*(?:month|year|yr)/i);
  if (!match) return 6; // default 6 months
  const val = parseInt(match[1], 10);
  if (/year|yr/i.test(match[0])) {
    return val * 12;
  }
  return val;
}

export async function submitWarrantyClaim(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to submit warranty claim', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = createWarrantyClaimSchema.safeParse(req.body);
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

  // 1. Validate Parent Order
  const order = await orderRepository.findParentOrderById(input.orderId);
  if (!order) {
    sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
    return;
  }

  if (order.customerId !== req.user.uid && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized: you can only submit warranty claims for your own orders', 403, 'FORBIDDEN');
    return;
  }

  // 2. Validate Sub-Order & Item
  const subOrder = await orderRepository.findSubOrderById(input.subOrderId);
  if (!subOrder || subOrder.parentOrderId !== order.id) {
    sendError(res, 'Sub-order not found or mismatched with order', 404, 'SUB_ORDER_NOT_FOUND');
    return;
  }

  const orderItem = subOrder.items.find((i) => i.productId === input.productId);
  if (!orderItem) {
    sendError(res, 'Product was not found in this order package', 400, 'PRODUCT_NOT_IN_ORDER');
    return;
  }

  // 3. Validate Product Warranty & Coverage Window
  const product = await productRepository.findById(input.productId);
  const warrantyPeriod = product?.warranty || '6 Months';

  const orderDate = new Date(order.createdAt).getTime();
  const now = new Date();
  const monthsDiff = (now.getTime() - orderDate) / (1000 * 60 * 60 * 24 * 30.44);
  const maxWarrantyMonths = parseWarrantyMonths(warrantyPeriod);

  if (monthsDiff > maxWarrantyMonths) {
    sendError(
      res,
      `Warranty period has expired for this product. Coverage: ${warrantyPeriod}, but order was placed ${Math.round(monthsDiff)} months ago.`,
      400,
      'WARRANTY_EXPIRED'
    );
    return;
  }

  // 4. Duplicate Active Claim Check
  const existingClaim = await warrantyRepository.findByOrderItem(input.orderId, input.productId);
  if (existingClaim) {
    sendError(
      res,
      `An active warranty claim (${existingClaim.claimNumber}) already exists for this item.`,
      400,
      'DUPLICATE_WARRANTY_CLAIM'
    );
    return;
  }

  const claimId = `war_${randomUUID()}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const claimNumber = `WAR-2026-${randomSuffix}`;
  const nowIso = now.toISOString();

  const claim: WarrantyClaimEntity = {
    id: claimId,
    claimNumber,
    orderId: order.id,
    subOrderId: subOrder.id,
    productId: orderItem.productId,
    productTitle: orderItem.title,
    partNumber: orderItem.partNumber,
    sellerId: subOrder.sellerId,
    customerId: req.user.uid,
    vehicle: input.vehicle,
    problemDescription: input.problemDescription,
    photos: input.photos,
    videoUrl: input.videoUrl || null,
    invoiceNumber: input.invoiceNumber || order.orderNumber,
    warrantyPeriod,
    status: 'SUBMITTED',
    outcome: null,
    outcomeNotes: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const created = await warrantyRepository.create(claim);
  sendSuccess(res, { warrantyClaim: created }, 201);
}

export async function getCustomerWarrantyClaims(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const claims = await warrantyRepository.findByCustomerId(req.user.uid);
  sendSuccess(res, { claims, total: claims.length });
}

export async function getWarrantyClaimById(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const claim = await warrantyRepository.findById(id);
  if (!claim) {
    sendError(res, 'Warranty claim not found', 404, 'WARRANTY_CLAIM_NOT_FOUND');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  const isCustomer = claim.customerId === req.user.uid;
  const isSeller = seller && claim.sellerId === seller.id;
  const isAdmin = req.user.role === 'ADMIN';

  if (!isCustomer && !isSeller && !isAdmin) {
    sendError(res, 'Unauthorized access to this warranty claim', 403, 'FORBIDDEN');
    return;
  }

  sendSuccess(res, { warrantyClaim: claim });
}

export async function getSellerWarrantyClaims(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller && req.user.role !== 'ADMIN') {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const sellerId = seller ? seller.id : (req.query.sellerId as string);
  if (!sellerId) {
    sendError(res, 'Seller ID required', 400, 'SELLER_ID_REQUIRED');
    return;
  }

  const claims = await warrantyRepository.findBySellerId(sellerId);
  sendSuccess(res, { claims, total: claims.length });
}

export async function reviewWarrantyClaim(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const claim = await warrantyRepository.findById(id);
  if (!claim) {
    sendError(res, 'Warranty claim not found', 404, 'WARRANTY_CLAIM_NOT_FOUND');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if ((!seller || claim.sellerId !== seller.id) && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized: you can only review claims for your merchant products', 403, 'FORBIDDEN');
    return;
  }

  const parseResult = reviewWarrantyClaimSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const updated = await warrantyRepository.update(id, {
    status: parseResult.data.status,
    outcomeNotes: parseResult.data.notes || claim.outcomeNotes,
  });

  sendSuccess(res, { warrantyClaim: updated });
}

export async function updateWarrantyOutcome(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const claim = await warrantyRepository.findById(id);
  if (!claim) {
    sendError(res, 'Warranty claim not found', 404, 'WARRANTY_CLAIM_NOT_FOUND');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if ((!seller || claim.sellerId !== seller.id) && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized: you can only set outcomes for your merchant claims', 403, 'FORBIDDEN');
    return;
  }

  const parseResult = updateWarrantyOutcomeSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const updated = await warrantyRepository.update(id, {
    outcome: parseResult.data.outcome,
    outcomeNotes: parseResult.data.outcomeNotes || claim.outcomeNotes,
    status: 'CLOSED',
  });

  sendSuccess(res, { warrantyClaim: updated });
}
