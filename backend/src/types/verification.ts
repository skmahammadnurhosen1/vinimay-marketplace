export type ProductVerificationStatus =
  | 'UNVERIFIED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'VERIFIED_GENUINE'
  | 'REJECTED';

export interface ProductVerificationDocument {
  id: string;
  type: 'mfg_auth_letter' | 'brand_auth' | 'invoice_proof' | 'iso_cert' | 'other';
  title: string;
  storagePath: string;
  url?: string;
  uploadedAt: string;
  verifiedAt?: string | null;
}

export interface VerificationHistoryEntry {
  status: ProductVerificationStatus;
  changedBy: string;
  changedAt: string;
  notes?: string;
}

export interface ProductVerificationRecord {
  id: string; // usually `verif_${productId}`
  productId: string;
  sellerId: string;
  brand: string;
  productType: 'Genuine' | 'OEM' | 'Aftermarket';
  status: ProductVerificationStatus;
  documents: ProductVerificationDocument[];
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  history: VerificationHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
