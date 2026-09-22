import { VehicleFitmentSpec } from './database.js';

export type WarrantyClaimStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'RESOLUTION_IN_PROGRESS'
  | 'CLOSED';

export type WarrantyOutcome = 'REPLACEMENT' | 'REPAIR' | 'CREDIT' | 'REFUND';

export interface WarrantyClaimEntity {
  id: string; // UUID
  claimNumber: string; // e.g. "WAR-2026-9281"
  orderId: string;
  subOrderId: string;
  productId: string;
  productTitle: string;
  partNumber: string;
  sellerId: string;
  customerId: string;
  vehicle: VehicleFitmentSpec | Record<string, unknown>;
  problemDescription: string;
  photos: string[];
  videoUrl?: string | null;
  invoiceNumber: string;
  warrantyPeriod: string;
  status: WarrantyClaimStatus;
  outcome?: WarrantyOutcome | null;
  outcomeNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}
