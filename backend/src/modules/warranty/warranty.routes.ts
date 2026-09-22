import { Router } from 'express';
import {
  submitWarrantyClaim,
  getCustomerWarrantyClaims,
  getWarrantyClaimById,
  getSellerWarrantyClaims,
  reviewWarrantyClaim,
  updateWarrantyOutcome,
} from './warranty.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const warrantyRouter = Router();

warrantyRouter.use(requireAuthentication);

// Customer endpoints
warrantyRouter.post('/claims', submitWarrantyClaim);
warrantyRouter.get('/claims', getCustomerWarrantyClaims);
warrantyRouter.get('/claims/:id', getWarrantyClaimById);

// Seller endpoints
warrantyRouter.get('/seller/claims', getSellerWarrantyClaims);
warrantyRouter.patch('/claims/:id/review', reviewWarrantyClaim);
warrantyRouter.patch('/claims/:id/outcome', updateWarrantyOutcome);
