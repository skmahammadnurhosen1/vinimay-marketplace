import { Request, Response } from 'express';
import { reviewService } from './review.service.js';
import { reviewRepository } from './review.repository.js';
import { createReviewSchema, moderateReviewSchema } from './review.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function submitReview(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to submit review', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = createReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const review = await reviewService.submitReview({
      customerId: req.user.uid,
      customerName: req.user.displayName || 'Marketplace Customer',
      ...parseResult.data,
    });
    sendSuccess(res, { review }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Review submission failed';
    const isVerifiedPurchaseErr =
      message.includes('verified purchasers') ||
      message.includes('verified purchase') ||
      message.includes('own orders');
    const isDuplicate = message.includes('already reviewed');
    const statusCode = isVerifiedPurchaseErr ? 403 : 400;
    const errorCode = isVerifiedPurchaseErr
      ? 'VERIFIED_PURCHASE_REQUIRED'
      : isDuplicate
      ? 'REVIEW_ALREADY_EXISTS'
      : 'REVIEW_SUBMISSION_FAILED';
    sendError(res, message, statusCode, errorCode);
  }
}

export async function getProductReviews(req: Request, res: Response): Promise<void> {
  const rawId = req.params.productId;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;
  const reviews = await reviewRepository.findByProduct(productId, 'APPROVED');
  const summary = await reviewRepository.getProductReviewSummary(productId);
  sendSuccess(res, { reviews, summary });
}

export async function getSellerReviews(req: Request, res: Response): Promise<void> {
  const rawId = req.params.sellerId;
  const sellerId = Array.isArray(rawId) ? rawId[0] : rawId;
  const reviews = await reviewRepository.findBySeller(sellerId, 'APPROVED');
  const summary = await reviewRepository.getSellerReviewSummary(sellerId);
  sendSuccess(res, { reviews, summary });
}

export async function listReviewsForAdmin(req: Request, res: Response): Promise<void> {
  const { status } = req.query;
  const reviews = await reviewRepository.findAll(status as any);
  sendSuccess(res, { reviews, total: reviews.length });
}

export async function moderateReview(req: Request, res: Response): Promise<void> {
  const rawId = req.params.reviewId;
  const reviewId = Array.isArray(rawId) ? rawId[0] : rawId;
  const parseResult = moderateReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const moderated = await reviewService.moderateReview({
      reviewId,
      status: parseResult.data.status,
      moderatedBy: req.user?.uid || 'admin',
      rejectionReason: parseResult.data.rejectionReason,
      moderationNotes: parseResult.data.moderationNotes,
    });
    sendSuccess(res, { review: moderated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Review moderation failed';
    sendError(res, message, 400, 'MODERATION_FAILED');
  }
}
