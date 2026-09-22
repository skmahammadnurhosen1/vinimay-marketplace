import { Request, Response } from 'express';
import { b2bService } from './b2b.service.js';
import { b2bRepository } from './b2b.repository.js';
import { registerB2BAccountSchema, verifyB2BAccountSchema, bulkOrderSchema } from './b2b.validation.js';
import { orderRepository } from '../orders/order.repository.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function registerB2BAccount(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to register B2B account', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = registerB2BAccountSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const account = await b2bService.registerAccount({
      userId: req.user.uid,
      ...parseResult.data,
    });
    sendSuccess(res, { account }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    sendError(res, message, 400, 'B2B_REGISTRATION_FAILED');
  }
}

export async function getMyB2BAccount(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const account = await b2bRepository.findAccountByUserId(req.user.uid);
  if (!account) {
    sendError(res, 'No B2B account found for current user', 404, 'B2B_ACCOUNT_NOT_FOUND');
    return;
  }

  sendSuccess(res, { account });
}

export async function getB2BPricing(req: Request, res: Response): Promise<void> {
  const rawProductId = req.params.productId;
  const productId = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId;
  const quantity = Number(req.query.quantity) || 1;
  const accountType = (req.query.accountType as any) || 'GARAGE';

  try {
    const pricing = await b2bService.calculateItemB2BPrice(productId, accountType, quantity);
    sendSuccess(res, { productId, quantity, accountType, pricing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Pricing lookup failed';
    sendError(res, message, 404, 'PRODUCT_NOT_FOUND');
  }
}

export async function placeBulkOrder(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const account = await b2bRepository.findAccountByUserId(req.user.uid);
  if (!account) {
    sendError(res, 'B2B account required to place bulk orders', 403, 'B2B_ACCOUNT_REQUIRED');
    return;
  }

  const parseResult = bulkOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const result = await b2bService.executeBulkOrder({
      userId: req.user.uid,
      b2bAccount: account,
      items: parseResult.data.items,
      shippingAddress: parseResult.data.shippingAddress,
      paymentMethod: parseResult.data.paymentMethod,
    });
    sendSuccess(res, result, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bulk order failed';
    sendError(res, message, 400, 'BULK_ORDER_FAILED');
  }
}

export async function getB2BPurchaseHistory(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const orders = await orderRepository.findByCustomerId(req.user.uid);
  // Filter for B2B bulk orders or orders placed with B2B metadata
  const b2bOrders = orders.filter(
    (o) => o.orderNumber.includes('B2B') || !!(o.shippingAddress as any).gstin
  );

  sendSuccess(res, { orders: b2bOrders, total: b2bOrders.length });
}

export async function repeatB2BOrder(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const account = await b2bRepository.findAccountByUserId(req.user.uid);
  if (!account) {
    sendError(res, 'B2B account required', 403, 'B2B_ACCOUNT_REQUIRED');
    return;
  }

  const rawOrderId = req.params.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
  try {
    const result = await b2bService.repeatOrder({
      userId: req.user.uid,
      b2bAccount: account,
      previousOrderId: orderId,
    });
    sendSuccess(res, result, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Repeat order failed';
    const statusCode = message.includes('another user') ? 403 : 400;
    sendError(res, message, statusCode, 'REPEAT_ORDER_FAILED');
  }
}

export async function listB2BAccountsForAdmin(req: Request, res: Response): Promise<void> {
  const { type } = req.query;
  const accounts = await b2bRepository.findAllAccounts(type as any);
  sendSuccess(res, { accounts, total: accounts.length });
}

export async function verifyB2BAccount(req: Request, res: Response): Promise<void> {
  const rawAccountId = req.params.accountId;
  const accountId = Array.isArray(rawAccountId) ? rawAccountId[0] : rawAccountId;
  const parseResult = verifyB2BAccountSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const updated = await b2bRepository.updateAccount(accountId, {
    verificationStatus: parseResult.data.verificationStatus,
    rejectionReason: parseResult.data.rejectionReason || null,
    reviewedBy: req.user?.uid || 'admin',
    verifiedAt: parseResult.data.verificationStatus === 'VERIFIED' ? new Date().toISOString() : null,
  });

  if (!updated) {
    sendError(res, 'B2B account not found', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, { account: updated });
}
