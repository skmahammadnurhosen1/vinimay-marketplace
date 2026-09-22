import { AddressEntity } from './database.js';

export type B2BAccountType = 'GARAGE' | 'FLEET';

export type B2BVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type B2BCreditStatus = 'FUTURE_CREDIT_UNAVAILABLE' | 'INACTIVE_PLACEHOLDER';

export interface B2BCreditPlaceholder {
  creditStatus: B2BCreditStatus;
  availableCredit: number; // 0
  requestedLimit: number;
  notice: string;
}

export interface B2BAccountEntity {
  id: string; // e.g. `b2b_${uuid}`
  userId: string;
  accountType: B2BAccountType;
  businessName: string;
  tradeLicenseNumber?: string;
  gstin: string;
  pan: string;
  contactPerson: string;
  mobile: string;
  email: string;
  businessAddress: AddressEntity;
  fleetSize?: number; // for FLEET
  bayCount?: number; // for GARAGE
  verificationStatus: B2BVerificationStatus;
  rejectionReason?: string | null;
  credit: B2BCreditPlaceholder;
  verifiedAt?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface B2BPricingTier {
  minQuantity: number;
  price: number;
}

export interface ProductB2BPricing {
  productId: string;
  baseB2BPrice: number;
  tiers: B2BPricingTier[];
  garageDiscountPercent: number; // additional discount % for garage
  fleetDiscountPercent: number; // additional discount % for fleet
}

export interface BulkOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface BulkOrderQuoteItem {
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  brand: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  regularPrice: number;
  gstRate: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  availableStock: number;
}

export interface BulkOrderQuote {
  items: BulkOrderQuoteItem[];
  subtotal: number;
  totalTax: number;
  shippingTotal: number;
  grandTotal: number;
  totalSavings: number;
}
