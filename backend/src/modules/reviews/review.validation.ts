import { z } from 'zod';

export const createReviewSchema = z.object({
  orderId: z.string().optional(),
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5).optional(),
  productRating: z.number().int().min(1).max(5).optional(),
  sellerRating: z.number().int().min(1).max(5).optional(),
  deliveryRating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  comment: z.string().min(5, 'Review comment must be at least 5 characters').max(2000),
  photos: z.array(z.string().url()).optional().default([]),
  videos: z.array(z.string().url()).optional().default([]),
  sellerId: z.string().optional(),
});

export const moderateReviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'HIDDEN'] as const),
  rejectionReason: z.string().optional(),
  moderationNotes: z.string().optional(),
});
