import { Router } from 'express';
import {
  submitReview,
  getProductReviews,
  getSellerReviews,
  listReviewsForAdmin,
  moderateReview,
} from './review.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';

export const reviewRouter = Router();

// Public Customer-Facing Review Endpoints
reviewRouter.get('/product/:productId', getProductReviews);
reviewRouter.get('/products/:productId', getProductReviews);
reviewRouter.get('/seller/:sellerId', getSellerReviews);
reviewRouter.get('/sellers/:sellerId', getSellerReviews);

// Customer Review Submission (Requires Auth + Verified Purchase Check)
reviewRouter.post('/', requireAuthentication, submitReview);

// Admin Moderation Endpoints
reviewRouter.get('/admin', requireAuthentication, requireRole('ADMIN'), listReviewsForAdmin);
reviewRouter.patch('/admin/:reviewId', requireAuthentication, requireRole('ADMIN'), moderateReview);
reviewRouter.post('/admin/:reviewId/moderate', requireAuthentication, requireRole('ADMIN'), moderateReview);
