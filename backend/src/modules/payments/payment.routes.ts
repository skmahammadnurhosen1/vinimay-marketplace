import { Router } from 'express';
import {
  initiatePayment,
  verifyPayment,
  checkCodEligibility,
  getPaymentByOrder,
  handlePaymentWebhook,
} from './payment.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const paymentRouter = Router();

// Public webhook endpoint (authenticaton handled via cryptographic signature)
paymentRouter.post('/webhook', handlePaymentWebhook);

// Authenticated Customer / Admin Payment Routes
paymentRouter.post('/initiate', requireAuthentication, initiatePayment);
paymentRouter.post('/verify', requireAuthentication, verifyPayment);
paymentRouter.post('/check-cod', checkCodEligibility);
paymentRouter.get('/order/:orderId', requireAuthentication, getPaymentByOrder);
