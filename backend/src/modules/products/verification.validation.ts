import { z } from 'zod';

export const submitProductVerificationSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productType: z.enum(['Genuine', 'OEM', 'Aftermarket'] as const),
  brand: z.string().min(1, 'Brand is required'),
  documents: z.array(
    z.object({
      type: z.enum(['mfg_auth_letter', 'brand_auth', 'invoice_proof', 'iso_cert', 'other'] as const),
      title: z.string().min(2, 'Document title is required'),
      storagePath: z.string().min(1, 'Storage path is required'),
      url: z.string().url().optional(),
    })
  ).min(1, 'At least one authorization document is required for Genuine/OEM verification'),
});

export const reviewProductVerificationSchema = z.object({
  status: z.enum(['VERIFIED', 'VERIFIED_GENUINE', 'REJECTED'] as const),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
});
