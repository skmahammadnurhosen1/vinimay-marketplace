import { z } from 'zod';

export const createWarrantyClaimSchema = z.object({
  orderId: z.string().trim().min(1, 'Order ID is required'),
  subOrderId: z.string().trim().min(1, 'Sub-order ID is required'),
  productId: z.string().trim().min(1, 'Product ID is required'),
  vehicle: z.record(z.string(), z.any()),
  problemDescription: z
    .string()
    .trim()
    .min(10, 'Please describe the engineering defect or failure in at least 10 characters'),
  photos: z.array(z.string().trim().min(1)).min(1, 'At least one photo showing the defect is required'),
  videoUrl: z.string().trim().optional(),
  invoiceNumber: z.string().trim().optional(),
});

export const reviewWarrantyClaimSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'RESOLUTION_IN_PROGRESS', 'CLOSED']),
  notes: z.string().trim().optional(),
});

export const updateWarrantyOutcomeSchema = z.object({
  outcome: z.enum(['REPLACEMENT', 'REPAIR', 'CREDIT', 'REFUND']),
  outcomeNotes: z.string().trim().optional(),
});
