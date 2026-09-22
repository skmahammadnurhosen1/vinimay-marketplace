import { AddressEntity } from './database.js';

export type SellerType =
  | 'Manufacturer'
  | 'Authorized Distributor'
  | 'Wholesaler'
  | 'Retailer';

export type SellerKYCStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type SellerDocumentType =
  | 'gst_certificate'
  | 'pan_card'
  | 'bank_proof'
  | 'mfg_auth_letter'
  | 'brand_auth'
  | 'biz_registration';

export interface SellerDocumentRecord {
  id: string;
  type: SellerDocumentType;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  downloadUrl?: string;
  status: SellerKYCStatus;
  rejectionReason?: string | null;
  uploadedAt: string;
  verifiedAt?: string | null;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
}

export interface SellerProfileEntity {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  mobile: string;
  email: string;
  sellerType: SellerType;
  gstin: string;
  pan: string;
  businessAddress: AddressEntity;
  bankDetails: BankDetails;
  kycStatus: SellerKYCStatus;
  documents: SellerDocumentRecord[];
  authorizedBrands: string[];
  rating: number;
  reviewCount: number;
  isVerified?: boolean;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SellerDashboardMetrics {
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  currentInventoryTotalUnits: number;
  currentInventoryTotalValue: number;
  sellerVerificationStatus: SellerKYCStatus;
}
