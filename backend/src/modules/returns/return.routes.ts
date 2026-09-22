import { Router } from 'express';
import {
  createReturnRequest,
  getCustomerReturns,
  getReturnById,
  getSellerReturns,
  reviewReturnRequest,
  updateReturnStage,
} from './return.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const returnRouter = Router();

returnRouter.use(requireAuthentication);

// Customer endpoints
returnRouter.post('/', createReturnRequest);
returnRouter.get('/', getCustomerReturns);
returnRouter.get('/:id', getReturnById);

// Seller / Admin management endpoints
returnRouter.get('/seller/list', getSellerReturns);
returnRouter.patch('/:id/review', reviewReturnRequest);
returnRouter.patch('/:id/stage', updateReturnStage);
