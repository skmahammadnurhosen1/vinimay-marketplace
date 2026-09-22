import { Router } from 'express';
import {
  processRefund,
  getCustomerRefunds,
  getRefundById,
} from './refund.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const refundRouter = Router();

refundRouter.use(requireAuthentication);

refundRouter.post('/process', processRefund);
refundRouter.get('/', getCustomerRefunds);
refundRouter.get('/:id', getRefundById);
