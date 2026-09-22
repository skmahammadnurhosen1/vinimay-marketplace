import { z } from 'zod';
import {
  indianGstinSchema,
  indianPanSchema,
  indianMobileSchema,
  indianPinCodeSchema,
} from '../database/database.validation.js';

export const indianIfscSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid Indian IFSC code format (e.g. HDFC0001234)');

export const sellerTypeSchema = z.enum([
  'Manufacturer',
  'Authorized Distributor',
  'Wholesaler',
  'Retailer',
]);

export const bankDetailsSchema = z.object({
  bankName: z.string().trim().min(2, 'Bank name is required'),
  accountNumber: z.string().trim().min(8, 'Bank account number must be at least 8 digits').max(20),
  ifsc: indianIfscSchema,
  accountHolderName: z.string().trim().min(2, 'Account holder name is required'),
});

export const sellerAddressInputSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: indianMobileSchema,
  addressLine1: z.string().trim().min(5, 'Address Line 1 is required'),
  addressLine2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  pinCode: indianPinCodeSchema,
  country: z.string().trim().default('India'),
  type: z.enum(['registered_office', 'warehouse', 'garage', 'work']).default('registered_office'),
  isDefault: z.boolean().default(true),
});

export const registerSellerSchema = z.object({
  businessName: z.string().trim().min(3, 'Business name must be at least 3 characters'),
  ownerName: z.string().trim().min(2, 'Owner name must be at least 2 characters'),
  mobile: indianMobileSchema,
  email: z.string().trim().email('Invalid email address'),
  sellerType: sellerTypeSchema,
  gstin: indianGstinSchema,
  pan: indianPanSchema,
  businessAddress: sellerAddressInputSchema,
  bankDetails: bankDetailsSchema,
  authorizedBrands: z.array(z.string().trim()).default([]),
});

export const updateSellerProfileSchema = z.object({
  businessName: z.string().trim().min(3).optional(),
  ownerName: z.string().trim().min(2).optional(),
  mobile: indianMobileSchema.optional(),
  email: z.string().trim().email().optional(),
  businessAddress: sellerAddressInputSchema.optional(),
  bankDetails: bankDetailsSchema.optional(),
  authorizedBrands: z.array(z.string().trim()).optional(),
  // Disallow seller directly changing kycStatus, rating, reviewCount, etc.
});

export const uploadSellerDocumentSchema = z.object({
  type: z.enum([
    'gst_certificate',
    'pan_card',
    'bank_proof',
    'mfg_auth_letter',
    'brand_auth',
    'biz_registration',
  ]),
  title: z.string().trim().min(2, 'Document title is required'),
  fileName: z.string().trim().min(1, 'File name is required'),
  fileSize: z.number().int().positive('File size must be positive').max(10 * 1024 * 1024, 'Max 10MB'),
  mimeType: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  storagePath: z.string().trim().min(5, 'Storage path is required'),
  downloadUrl: z.string().url().optional(),
});

export const reviewSellerKycSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'UNDER_REVIEW', 'SUSPENDED']),
  rejectionReason: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});
