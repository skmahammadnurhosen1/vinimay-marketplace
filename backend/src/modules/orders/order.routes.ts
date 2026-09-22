import { Router } from 'express';
import {
  createMarketplaceOrder,
  getCustomerOrders,
  getCustomerOrderById,
  getSellerSubOrders,
  getSellerSubOrderById,
  updateSellerSubOrderStatus,
} from './order.controller.js';
import { shipSellerSubOrder } from '../shipping/shipment.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

// Customer Marketplace Order Router (/api/v1/orders)
export const orderRouter = Router();
orderRouter.use(requireAuthentication);
orderRouter.post('/', createMarketplaceOrder);
orderRouter.post('/checkout', createMarketplaceOrder);
orderRouter.get('/', getCustomerOrders);
orderRouter.get('/:id', getCustomerOrderById);

// Seller Sub-Order Router (/api/v1/sellers/orders)
export const sellerOrderRouter = Router();
sellerOrderRouter.use(requireAuthentication);
sellerOrderRouter.get('/', getSellerSubOrders);
sellerOrderRouter.get('/:subOrderId', getSellerSubOrderById);
sellerOrderRouter.patch('/:subOrderId/status', updateSellerSubOrderStatus);
sellerOrderRouter.post('/:subOrderId/ship', shipSellerSubOrder);

