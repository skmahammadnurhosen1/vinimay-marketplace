import { Router } from 'express';
import {
  listSellersForAdmin,
  reviewSellerKyc,
  updateSellerStatus,
  configureSellerCommission,
  listProductsForAdmin,
  reviewProduct,
  reviewProductAuthenticity,
  listOrdersForAdmin,
  getOrderDetailsForAdmin,
  listReturnsForAdmin,
  listRefundsForAdmin,
  listWarrantyClaimsForAdmin,
  listCustomersForAdmin,
  getCustomerDetailForAdmin,
  updateCustomerStatus,
  getMarketplaceReports,
} from './admin.controller.js';
import {
  getCommissionConfig,
  updateCommissionConfig,
  listSettlements,
  processSettlement,
  generateSettlements,
  getFinancialSummary,
} from '../finance/finance.controller.js';
import { listReviewsForAdmin, moderateReview } from '../reviews/review.controller.js';
import { listB2BAccountsForAdmin, verifyB2BAccount } from '../b2b/b2b.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';

export const adminRouter = Router();

// Enforce ADMIN role on all admin endpoints
adminRouter.use(requireAuthentication, requireRole('ADMIN'));

// 1. Seller Management
adminRouter.get('/sellers', listSellersForAdmin);
adminRouter.post('/sellers/:sellerId/kyc', reviewSellerKyc);
adminRouter.post('/sellers/:sellerId/kyc/review', reviewSellerKyc);
adminRouter.patch('/sellers/:sellerId/status', updateSellerStatus);
adminRouter.post('/sellers/:sellerId/commission', configureSellerCommission);
adminRouter.put('/sellers/:sellerId/commission', configureSellerCommission);

// 2. Product Management & Authenticity
adminRouter.get('/products', listProductsForAdmin);
adminRouter.post('/products/:productId/review', reviewProduct);
adminRouter.post('/products/:productId/authenticity', reviewProductAuthenticity);
adminRouter.post('/products/:productId/verify-authenticity', reviewProductAuthenticity);

// 3. Order Oversight (Parent Orders + Hydrated Sub-Orders)
adminRouter.get('/orders', listOrdersForAdmin);
adminRouter.get('/orders/:orderId', getOrderDetailsForAdmin);

// 4. Returns, Refunds & Warranty Claims
adminRouter.get('/returns', listReturnsForAdmin);
adminRouter.get('/refunds', listRefundsForAdmin);
adminRouter.get('/warranty', listWarrantyClaimsForAdmin);

// 5. Customer Management
adminRouter.get('/customers', listCustomersForAdmin);
adminRouter.get('/customers/:customerId', getCustomerDetailForAdmin);
adminRouter.patch('/customers/:customerId/status', updateCustomerStatus);

// 6. Finance & Settlements
adminRouter.get('/finance', getFinancialSummary);
adminRouter.get('/finance/summary', getFinancialSummary);
adminRouter.get('/finance/commissions', getCommissionConfig);
adminRouter.put('/finance/commissions', updateCommissionConfig);
adminRouter.get('/finance/settlements', listSettlements);
adminRouter.post('/finance/settlements/generate', generateSettlements);
adminRouter.post('/finance/settlements/process', processSettlement);
adminRouter.post('/finance/settlements/payout', processSettlement);

// 7. Review Moderation
adminRouter.get('/reviews', listReviewsForAdmin);
adminRouter.patch('/reviews/:reviewId', moderateReview);
adminRouter.post('/reviews/:reviewId/moderate', moderateReview);

// 8. B2B Account Verification
adminRouter.get('/b2b/accounts', listB2BAccountsForAdmin);
adminRouter.patch('/b2b/accounts/:accountId/verify', verifyB2BAccount);
adminRouter.post('/b2b/accounts/:accountId/verify', verifyB2BAccount);

// 9. Marketplace Reports
adminRouter.get('/reports', getMarketplaceReports);
