import { Router } from 'express';
import {
  getCommissionConfig,
  updateCommissionConfig,
  listSettlements,
  processSettlement,
  getGstInvoice,
  getFinancialSummary,
} from './finance.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';

export const financeRouter = Router();

// Public / Authenticated Invoice Lookup
financeRouter.get('/invoices/:orderId', requireAuthentication, getGstInvoice);
financeRouter.get('/invoices/order/:orderId', requireAuthentication, getGstInvoice);

// Admin-only Finance Management
financeRouter.get('/commissions', requireAuthentication, requireRole('ADMIN'), getCommissionConfig);
financeRouter.get('/commission-config', requireAuthentication, requireRole('ADMIN'), getCommissionConfig);
financeRouter.put('/commissions', requireAuthentication, requireRole('ADMIN'), updateCommissionConfig);
financeRouter.put('/commission-config', requireAuthentication, requireRole('ADMIN'), updateCommissionConfig);
financeRouter.get('/settlements', requireAuthentication, requireRole('ADMIN'), listSettlements);
financeRouter.post('/settlements/process', requireAuthentication, requireRole('ADMIN'), processSettlement);
financeRouter.post('/settlements/payout', requireAuthentication, requireRole('ADMIN'), processSettlement);
financeRouter.get('/reports/summary', requireAuthentication, requireRole('ADMIN'), getFinancialSummary);
financeRouter.get('/summary', requireAuthentication, requireRole('ADMIN'), getFinancialSummary);
