import { Router } from 'express';
import { healthRouter } from '../modules/health/health.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';
import { userRouter } from '../modules/users/user.routes.js';
import {
  categoriesRouter,
  brandsRouter,
  vehiclesRouter,
  addressesRouter,
} from '../modules/database/database.routes.js';
import { sellerRouter } from '../modules/sellers/seller.routes.js';
import { publicProductRouter } from '../modules/products/product.routes.js';
import { cartRouter } from '../modules/cart/cart.routes.js';
import { orderRouter } from '../modules/orders/order.routes.js';
import { paymentRouter } from '../modules/payments/payment.routes.js';
import { shippingRouter } from '../modules/shipping/shipment.routes.js';
import { returnRouter } from '../modules/returns/return.routes.js';
import { refundRouter } from '../modules/refunds/refund.routes.js';
import { warrantyRouter } from '../modules/warranty/warranty.routes.js';
import { adminRouter } from '../modules/admin/admin.routes.js';
import { financeRouter } from '../modules/finance/finance.routes.js';
import { reviewRouter } from '../modules/reviews/review.routes.js';
import { b2bRouter } from '../modules/b2b/b2b.routes.js';
import { manufacturerRouter } from '../modules/manufacturer/manufacturer.routes.js';
import { notificationRouter } from '../modules/notifications/notification.routes.js';
import { supportRouter } from '../modules/support/support.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const apiRouter = Router();

// API Root descriptor
apiRouter.get('/', (_req, res) => {
  sendSuccess(res, {
    message: 'AutoPartsHub Backend API Engine — Active',
    version: 'v1',
    documentation: '/docs',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      categories: '/api/v1/categories',
      brands: '/api/v1/brands',
      vehicles: '/api/v1/vehicles',
      addresses: '/api/v1/addresses',
      sellers: '/api/v1/sellers',
      products: '/api/v1/products',
      search: '/api/v1/products/search',
      compatible: '/api/v1/products/compatible',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      sellerOrders: '/api/v1/sellers/orders',
      payments: '/api/v1/payments',
      shipping: '/api/v1/shipping',
      returns: '/api/v1/returns',
      refunds: '/api/v1/refunds',
      warranty: '/api/v1/warranty',
      inventory: '/api/v1/sellers/inventory',
      admin: '/api/v1/admin',
      finance: '/api/v1/finance',
      reviews: '/api/v1/reviews',
      b2b: '/api/v1/b2b',
      manufacturer: '/api/v1/manufacturer',
      notifications: '/api/v1/notifications',
      support: '/api/v1/support',
    },
  });
});

// Mount module routes
apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/brands', brandsRouter);
apiRouter.use('/vehicles', vehiclesRouter);
apiRouter.use('/addresses', addressesRouter);
apiRouter.use('/sellers', sellerRouter);
apiRouter.use('/products', publicProductRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/shipping', shippingRouter);
apiRouter.use('/returns', returnRouter);
apiRouter.use('/refunds', refundRouter);
apiRouter.use('/warranty', warrantyRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/finance', financeRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/b2b', b2bRouter);
apiRouter.use('/manufacturer', manufacturerRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/support', supportRouter);





