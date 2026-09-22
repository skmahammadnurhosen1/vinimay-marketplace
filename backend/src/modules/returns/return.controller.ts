import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { returnRepository } from './return.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import {
  createReturnSchema,
  reviewReturnSchema,
  updateReturnStageSchema,
} from './return.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { ReturnRequestEntity, ReturnStatusHistoryEntry } from '../../types/return.js';

export async function createReturnRequest(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to submit return request', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = createReturnSchema.safeParse(req.body);
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

  // Ownership check
  if (order.customerId !== req.user.uid && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized: you can only request returns for your own orders', 403, 'FORBIDDEN');
    return;
  }

  // 2. Validate Sub-Order
  const subOrder = await orderRepository.findSubOrderById(input.subOrderId);
  if (!subOrder || subOrder.parentOrderId !== order.id) {
    sendError(res, 'Sub-order not found or does not belong to this parent order', 404, 'SUB_ORDER_NOT_FOUND');
    return;
  }

  // 3. Validate Product in Sub-Order
  const orderItem = subOrder.items.find((i) => i.productId === input.productId);
  if (!orderItem) {
    sendError(res, 'The specified product does not exist in this order package', 400, 'PRODUCT_NOT_IN_ORDER');
    return;
  }

  if (input.quantity > orderItem.quantity) {
    sendError(
      res,
      `Requested return quantity (${input.quantity}) exceeds purchased quantity (${orderItem.quantity})`,
      400,
      'INVALID_RETURN_QUANTITY'
    );
    return;
  }

  // 4. Duplicate Active Return Check
  const existingActiveReturn = await returnRepository.findByOrderItem(input.orderId, input.productId);
  if (existingActiveReturn) {
    sendError(
      res,
      `An active return request (${existingActiveReturn.returnNumber}) already exists for this item.`,
      400,
      'DUPLICATE_RETURN_REQUEST'
    );
    return;
  }

  // 5. Wrong-Part Compatibility Protection
  const vehicleContext = input.vehicleDetails || order.vehicleContext;

  // 6. Calculate Authoritative Refund Amount
  const unitRefund = orderItem.unitPrice * input.quantity;
  const taxRefund = Math.round(unitRefund * ((orderItem.gstRate || 18) / 100));
  const approvedRefundAmount = unitRefund + taxRefund;

  const now = new Date().toISOString();
  const returnId = `ret_${randomUUID()}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const returnNumber = `RET-2026-${randomSuffix}`;

  const initialHistory: ReturnStatusHistoryEntry = {
    status: 'REQUESTED',
    title: 'Return Request Created by Customer',
    notes: `Reason: ${input.reason}. Explanation: ${input.customerExplanation}`,
    updatedBy: req.user.uid,
    timestamp: now,
  };

  const returnEntity: ReturnRequestEntity = {
    id: returnId,
    returnNumber,
    orderId: order.id,
    subOrderId: subOrder.id,
    customerId: req.user.uid,
    sellerId: subOrder.sellerId,
    productId: orderItem.productId,
    productTitle: orderItem.title,
    partNumber: orderItem.partNumber,
    productImage: orderItem.image,
    quantity: input.quantity,
    reason: input.reason,
    customerExplanation: input.customerExplanation,
    vehicleConfirmed: input.vehicleConfirmed,
    vehicleDetails: vehicleContext || null,
    evidencePhotos: input.evidencePhotos,
    status: 'REQUESTED',
    action: input.action,
    approvedRefundAmount,
    statusHistory: [initialHistory],
    createdAt: now,
    updatedAt: now,
  };

  const created = await returnRepository.create(returnEntity);
  sendSuccess(res, { returnRequest: created }, 201);
}

export async function getCustomerReturns(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const returns = await returnRepository.findByCustomerId(req.user.uid);
  sendSuccess(res, { returns, total: returns.length });
}

export async function getReturnById(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const returnReq = await returnRepository.findById(id);
  if (!returnReq) {
    sendError(res, 'Return request not found', 404, 'RETURN_NOT_FOUND');
    return;
  }

  // Tenant isolation: customer owns or seller owns or admin
  const seller = await sellerRepository.findByUserId(req.user.uid);
  const isCustomer = returnReq.customerId === req.user.uid;
  const isSeller = seller && returnReq.sellerId === seller.id;
  const isAdmin = req.user.role === 'ADMIN';

  if (!isCustomer && !isSeller && !isAdmin) {
    sendError(res, 'Unauthorized access to this return request', 403, 'FORBIDDEN');
    return;
  }

  sendSuccess(res, { returnRequest: returnReq });
}

export async function getSellerReturns(req: Request, res: Response): Promise<void> {
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

  const returns = await returnRepository.findBySellerId(sellerId);
  sendSuccess(res, { returns, total: returns.length });
}

export async function reviewReturnRequest(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const returnReq = await returnRepository.findById(id);
  if (!returnReq) {
    sendError(res, 'Return request not found', 404, 'RETURN_NOT_FOUND');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if ((!seller || returnReq.sellerId !== seller.id) && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized: you can only review returns for your own merchant products', 403, 'FORBIDDEN');
    return;
  }

  if (returnReq.status === 'COMPLETED' || returnReq.status === 'CANCELLED' || returnReq.status === 'REJECTED') {
    sendError(res, `Cannot alter return in finalized status: ${returnReq.status}`, 400, 'RETURN_ALREADY_FINALIZED');
    return;
  }

  const parseResult = reviewReturnSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const now = new Date().toISOString();
  const nextStatus = parseResult.data.status;
  const newHistory: ReturnStatusHistoryEntry = {
    status: nextStatus,
    title: `Return ${nextStatus} by Merchant`,
    notes: parseResult.data.notes || `Review completed by merchant.`,
    updatedBy: req.user.uid,
    timestamp: now,
  };

  const updated = await returnRepository.update(id, {
    status: nextStatus,
    statusHistory: [...returnReq.statusHistory, newHistory],
  });

  sendSuccess(res, { returnRequest: updated });
}

export async function updateReturnStage(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const returnReq = await returnRepository.findById(id);
  if (!returnReq) {
    sendError(res, 'Return request not found', 404, 'RETURN_NOT_FOUND');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if ((!seller || returnReq.sellerId !== seller.id) && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access to update return logistics', 403, 'FORBIDDEN');
    return;
  }

  const parseResult = updateReturnStageSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const now = new Date().toISOString();
  const { status, notes, pickupAwb } = parseResult.data;

  const newHistory: ReturnStatusHistoryEntry = {
    status,
    title: `Return Stage Updated: ${status.replace(/_/g, ' ')}`,
    notes: notes || `Updated stage to ${status}`,
    updatedBy: req.user.uid,
    timestamp: now,
  };

  const updated = await returnRepository.update(id, {
    status,
    pickupAwb: pickupAwb || returnReq.pickupAwb,
    statusHistory: [...returnReq.statusHistory, newHistory],
  });

  sendSuccess(res, { returnRequest: updated });
}
