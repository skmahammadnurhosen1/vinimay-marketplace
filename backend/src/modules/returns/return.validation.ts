import { z } from 'zod';

export const RETURN_REASONS = [
  'Wrong Part',
  'Wrong Product',
  'Damaged',
  'Defective',
  'Manufacturing Defect',
  'Not Compatible',
  'Other',
] as const;

export const createReturnSchema = z.object({
  orderId: z.string().trim().min(1, 'Order ID is required'),
  subOrderId: z.string().trim().min(1, 'Sub-order ID is required'),
  productId: z.string().trim().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
  reason: z.enum(RETURN_REASONS, {
    errorMap: () => ({
      message:
        'Reason must be one of: Wrong Part, Wrong Product, Damaged, Defective, Manufacturing Defect, Not Compatible, Other',
    }),
  }),
  customerExplanation: z
    .string()
    .trim()
    .min(10, 'Customer explanation must provide at least 10 characters detailing the issue'),
  vehicleConfirmed: z.boolean().default(true),
  vehicleDetails: z.record(z.string(), z.any()).optional(),
  evidencePhotos: z.array(z.string().trim().min(1)).min(1, 'At least one evidence photo is required for return verification'),
  action: z.enum(['REFUND', 'REPLACEMENT']).default('REFUND'),
});

export const reviewReturnSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().trim().optional(),
});

export const updateReturnStageSchema = z.object({
  status: z.enum([
    'PICKUP_SCHEDULED',
    'PICKED_UP',
    'INSPECTION',
    'REFUND_PENDING',
    'REPLACEMENT_PENDING',
    'COMPLETED',
    'CANCELLED',
  ]),
  notes: z.string().trim().optional(),
  pickupAwb: z.string().trim().optional(),
});
