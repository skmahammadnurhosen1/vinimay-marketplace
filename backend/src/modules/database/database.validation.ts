import { z } from 'zod';

// Indian PIN Code regex: 6 digits, cannot begin with 0
export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

// Indian Mobile Number regex: 10 digits starting with 6,7,8,9, with optional +91 prefix
export const INDIAN_PHONE_REGEX = /^(?:\+91)?[6-9]\d{9}$/;

// Indian GSTIN regex: 15 alphanumeric characters
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Indian PAN Card regex: 5 letters, 4 digits, 1 letter
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const createAddressSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(INDIAN_PHONE_REGEX, 'Valid 10-digit Indian phone number required'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters').max(150),
  addressLine2: z.string().max(150).optional(),
  landmark: z.string().max(100).optional(),
  city: z.string().min(2, 'City is required').max(50),
  district: z.string().max(50).optional(),
  state: z.string().min(2, 'State is required').max(50),
  pinCode: z.string().regex(PINCODE_REGEX, 'Valid 6-digit Indian PIN code required'),
  type: z.enum(['home', 'work', 'garage', 'warehouse', 'registered_office']).default('home'),
  isDefault: z.boolean().optional().default(false),
});

export const vehicleFitmentSchema = z.object({
  vehicleType: z.enum(['passenger', 'commercial']),
  manufacturerId: z.string().min(1, 'Manufacturer ID required'),
  manufacturerName: z.string().min(1, 'Manufacturer name required'),
  modelId: z.string().min(1, 'Model ID required'),
  modelName: z.string().min(1, 'Model name required'),
  year: z.number().int().min(1980).max(2030),
  fuelType: z.string().min(1, 'Fuel type required'),
  engine: z.string().min(1, 'Engine required'),
  variant: z.string().min(1, 'Variant required'),
});

export const indianPinCodeSchema = z.string().regex(PINCODE_REGEX, 'Valid 6-digit Indian PIN code required');
export const indianMobileSchema = z.string().regex(INDIAN_PHONE_REGEX, 'Valid 10-digit Indian phone number required');
export const indianGstinSchema = z.string().regex(GSTIN_REGEX, 'Valid 15-character Indian GSTIN required');
export const indianPanSchema = z.string().regex(PAN_REGEX, 'Valid 10-character Indian PAN required');
export const vehicleFitmentSpecSchema = vehicleFitmentSchema;

export const createBusinessProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(150),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters').max(100),
  email: z.string().email('Valid business email required'),
  mobile: z.string().regex(INDIAN_PHONE_REGEX, 'Valid 10-digit Indian phone number required'),
  gstin: z.string().regex(GSTIN_REGEX, 'Valid 15-character Indian GSTIN required'),
  pan: z.string().regex(PAN_REGEX, 'Valid 10-character Indian PAN required'),
  sellerType: z.enum(['Manufacturer', 'Authorized Distributor', 'Wholesaler', 'Retailer']),
  businessAddress: createAddressSchema,
  bankAccountRef: z.string().optional(),
});

