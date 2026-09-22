import { z } from 'zod';

const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const pinCodeRegex = /^[1-9][0-9]{5}$/;

const addressSchema = z.object({
  fullName: z.string().optional().default('B2B Client'),
  phone: z.string().optional().default('9999999999'),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().regex(pinCodeRegex, 'Invalid 6-digit PIN code'),
  type: z.enum(['garage', 'warehouse', 'work', 'registered_office', 'home'] as const).default('garage'),
});

export const registerB2BAccountSchema = z.object({
  accountType: z.enum(['GARAGE', 'FLEET'] as const),
  businessName: z.string().min(2, 'Business name is required'),
  tradeLicense: z.string().optional(),
  tradeLicenseNumber: z.string().optional(),
  gstin: z.string().regex(gstinRegex, 'Invalid 15-character GSTIN format'),
  pan: z.string().regex(panRegex, 'Invalid 10-character PAN format'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  mobile: z.string().min(10).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email('Valid email is required').optional().default('b2b@example.com'),
  businessAddress: addressSchema.optional(),
  address: addressSchema.optional(),
  fleetSize: z.number().int().positive().optional(),
  bayCount: z.number().int().positive().optional(),
});

export const verifyB2BAccountSchema = z.object({
  verificationStatus: z.enum(['VERIFIED', 'REJECTED'] as const),
  rejectionReason: z.string().optional(),
});

const bulkAddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().regex(pinCodeRegex),
  country: z.string().optional().default('India'),
  type: z.enum(['garage', 'warehouse', 'work', 'registered_office', 'home'] as const).default('garage'),
});

export const bulkOrderSchema = z
  .object({
    items: z
      .array(
        z.object({
          productId: z.string().min(1, 'Product ID is required'),
          quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        })
      )
      .min(1, 'At least one item is required for bulk order'),
    shippingAddress: bulkAddressSchema.optional(),
    deliveryAddress: bulkAddressSchema.optional(),
    paymentMethod: z.preprocess(
      (val) => (typeof val === 'string' ? val.toLowerCase().replace('_', '') : val),
      z.enum(['upi', 'card', 'netbanking', 'wallet', 'cod'] as const).default('netbanking')
    ),
  })
  .transform((data) => ({
    ...data,
    shippingAddress: data.shippingAddress || data.deliveryAddress!,
  }))
  .refine((data) => !!data.shippingAddress, {
    message: 'shippingAddress or deliveryAddress is required',
    path: ['shippingAddress'],
  });
