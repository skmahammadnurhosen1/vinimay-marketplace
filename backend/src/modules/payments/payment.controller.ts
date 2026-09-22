import { Request, Response } from 'express';
import { paymentService } from './payment.service.js';
import { paymentRepository } from './payment.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import {
  initiatePaymentSchema,
  verifyPaymentSchema,
  checkCodEligibilitySchema,
} from './payment.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function initiatePayment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to initiate payment', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = initiatePaymentSchema.safeParse(req.body);
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
    const payment = await paymentService.initiatePayment({
      orderId: parseResult.data.orderId,
      customerId: req.user.uid,
      method: parseResult.data.method,
    });

    sendSuccess(res, { payment }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment initiation failed';
    sendError(res, message, 400, 'PAYMENT_INITIATION_FAILED');
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to verify payment', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = verifyPaymentSchema.safeParse(req.body);
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
    const result = await paymentService.verifyPayment({
      paymentId: parseResult.data.paymentId,
      providerPaymentId: parseResult.data.providerPaymentId,
      providerSignature: parseResult.data.providerSignature,
      customerId: req.user.role === 'ADMIN' ? undefined : req.user.uid,
    });

    if (!result.success) {
      sendError(res, result.message, 400, 'PAYMENT_VERIFICATION_FAILED');
      return;
    }

    sendSuccess(res, { payment: result.payment, message: result.message });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment verification failed';
    sendError(res, message, 400, 'PAYMENT_VERIFICATION_FAILED');
  }
}

export async function checkCodEligibility(req: Request, res: Response): Promise<void> {
  const parseResult = checkCodEligibilitySchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const order = await orderRepository.findParentOrderById(parseResult.data.orderId);
  if (!order) {
    sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
    return;
  }

  const result = paymentService.checkCodEligibility(order.totalPayable, parseResult.data.pinCode);
  sendSuccess(res, result);
}

export async function getPaymentByOrder(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.orderId;
  const orderId = Array.isArray(rawId) ? rawId[0] : rawId;

  const order = await orderRepository.findParentOrderById(orderId);
  if (!order) {
    sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
    return;
  }

  // Tenant isolation
  if (order.customerId !== req.user.uid && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access to order payment', 403, 'FORBIDDEN');
    return;
  }

  const payment = await paymentRepository.findByOrderId(orderId);
  if (!payment) {
    sendError(res, 'No payment record found for this order', 404, 'PAYMENT_NOT_FOUND');
    return;
  }

  sendSuccess(res, { payment });
}

export async function handlePaymentWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['x-razorpay-signature'] || req.headers['x-webhook-signature'];
  const eventId = (req.headers['x-webhook-id'] as string) || req.body?.id || req.body?.eventId;

  if (!eventId) {
    sendError(res, 'Missing webhook event identifier header or body attribute', 400, 'MISSING_EVENT_ID');
    return;
  }

  try {
    const result = await paymentService.processWebhook({
      eventId: String(eventId),
      eventType: req.body.event || req.body.type || 'payment.captured',
      payload: req.body.payload || req.body,
      signature: typeof signature === 'string' ? signature : undefined,
    });

    sendSuccess(res, { status: 'processed', duplicate: result.duplicate });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook processing error';
    sendError(res, message, 400, 'WEBHOOK_VERIFICATION_FAILED');
  }
}
