import { Router } from 'express';
import {
  registerSeller,
  getSellerProfile,
  updateSellerProfile,
  uploadKycDocument,
  submitKycForVerification,
  getSellerDashboardMetrics,
  getStorageUploadPolicy,
} from './seller.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

import { sellerProductRouter } from '../products/product.routes.js';
import { sellerInventoryRouter } from '../inventory/inventory.routes.js';
import { sellerOrderRouter } from '../orders/order.routes.js';
import { getSellerShipments } from '../shipping/shipment.controller.js';
import {
  getSellerReturns,
  reviewReturnRequest,
  updateReturnStage,
} from '../returns/return.controller.js';
import {
  getSellerWarrantyClaims,
  reviewWarrantyClaim,
  updateWarrantyOutcome,
} from '../warranty/warranty.controller.js';

export const sellerRouter = Router();

// Seller Registration & Profile
sellerRouter.post('/register', requireAuthentication, registerSeller);
sellerRouter.get('/profile', requireAuthentication, getSellerProfile);
sellerRouter.get('/me', requireAuthentication, getSellerProfile);
sellerRouter.patch('/profile', requireAuthentication, updateSellerProfile);

// KYC & Document Verification
sellerRouter.post('/kyc/documents', requireAuthentication, uploadKycDocument);
sellerRouter.post('/kyc/submit', requireAuthentication, submitKycForVerification);

// Seller Dashboard Analytics
sellerRouter.get('/dashboard/metrics', requireAuthentication, getSellerDashboardMetrics);

// Storage Upload Policy / Signed URL preparation
sellerRouter.post('/storage/policy', requireAuthentication, getStorageUploadPolicy);

// Nested Product, Inventory, and Order Management
sellerRouter.use('/products', sellerProductRouter);
sellerRouter.use('/inventory', sellerInventoryRouter);
sellerRouter.use('/orders', sellerOrderRouter);

// Nested Shipping, Returns, and Warranty Management
sellerRouter.get('/shipments', requireAuthentication, getSellerShipments);
sellerRouter.get('/returns', requireAuthentication, getSellerReturns);
sellerRouter.patch('/returns/:id/review', requireAuthentication, reviewReturnRequest);
sellerRouter.patch('/returns/:id/stage', requireAuthentication, updateReturnStage);
sellerRouter.get('/warranty', requireAuthentication, getSellerWarrantyClaims);
sellerRouter.patch('/warranty/:id/review', requireAuthentication, reviewWarrantyClaim);
sellerRouter.patch('/warranty/:id/outcome', requireAuthentication, updateWarrantyOutcome);


