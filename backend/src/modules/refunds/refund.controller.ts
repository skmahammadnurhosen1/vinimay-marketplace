import { Request, Response } from 'express';
import { refundService } from './refund.service.js';
import { refundRepository } from './refund.repository.js';
import { returnRepository } from '../returns/return.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function processRefund(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const { returnId } = req.body;
  if (!returnId || typeof returnId !== 'string') {
    sendError(res, 'Return ID is required to process refund', 400, 'VALIDATION_ERROR');
    return;
  }

  const returnReq = await returnRepository.findById(returnId);
  if (!returnReq) {
    sendError(res, 'Return request not found', 404, 'RETURN_NOT_FOUND');
    return;
  }

  // Tenant authorization: only the merchant of this return or admin can process refund
  const seller = await sellerRepository.findByUserId(req.user.uid);
  if ((!seller || returnReq.sellerId !== seller.id) && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized: you can only process refunds for your own merchandise', 403, 'FORBIDDEN');
    return;
  }

  try {
    const refund = await refundService.processRefundForReturn(returnId, req.user.uid);
    sendSuccess(res, { refund }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Refund processing failed';
    sendError(res, message, 400, 'REFUND_FAILED');
  }
}

export async function getCustomerRefunds(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const refunds = await refundRepository.findByCustomerId(req.user.uid);
  sendSuccess(res, { refunds, total: refunds.length });
}

export async function getRefundById(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const refund = await refundRepository.findById(id);
  if (!refund) {
    sendError(res, 'Refund record not found', 404, 'REFUND_NOT_FOUND');
    return;
  }

  // Tenant check
  const seller = await sellerRepository.findByUserId(req.user.uid);
  const isCustomer = refund.customerId === req.user.uid;
  const isAdmin = req.user.role === 'ADMIN';

  let isSeller = false;
  if (seller && refund.returnId) {
    const ret = await returnRepository.findById(refund.returnId);
    if (ret && ret.sellerId === seller.id) {
      isSeller = true;
    }
  }

  if (!isCustomer && !isSeller && !isAdmin) {
    sendError(res, 'Unauthorized access to this refund transaction', 403, 'FORBIDDEN');
    return;
  }

  sendSuccess(res, { refund });
}
