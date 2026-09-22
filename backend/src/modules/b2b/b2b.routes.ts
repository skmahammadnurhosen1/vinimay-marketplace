import { Router } from 'express';
import {
  registerB2BAccount,
  getMyB2BAccount,
  getB2BPricing,
  placeBulkOrder,
  getB2BPurchaseHistory,
  repeatB2BOrder,
  listB2BAccountsForAdmin,
  verifyB2BAccount,
} from './b2b.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';

export const b2bRouter = Router();

// Pricing inquiry (Public / Authenticated)
b2bRouter.get('/pricing/:productId', getB2BPricing);

// B2B User Endpoints
b2bRouter.post('/register', requireAuthentication, registerB2BAccount);
b2bRouter.post('/accounts/register', requireAuthentication, registerB2BAccount);
b2bRouter.get('/me', requireAuthentication, getMyB2BAccount);
b2bRouter.get('/accounts/me', requireAuthentication, getMyB2BAccount);
b2bRouter.post('/orders/bulk', requireAuthentication, placeBulkOrder);
b2bRouter.post('/bulk-orders', requireAuthentication, placeBulkOrder);
b2bRouter.get('/orders/history', requireAuthentication, getB2BPurchaseHistory);
b2bRouter.get('/purchase-history', requireAuthentication, getB2BPurchaseHistory);
b2bRouter.post('/orders/repeat/:orderId', requireAuthentication, repeatB2BOrder);
b2bRouter.post('/repeat-order/:orderId', requireAuthentication, repeatB2BOrder);

// Admin B2B Oversight
b2bRouter.get('/admin/accounts', requireAuthentication, requireRole('ADMIN'), listB2BAccountsForAdmin);
b2bRouter.post('/admin/accounts/:accountId/verify', requireAuthentication, requireRole('ADMIN'), verifyB2BAccount);
b2bRouter.patch('/admin/accounts/:accountId/verify', requireAuthentication, requireRole('ADMIN'), verifyB2BAccount);
