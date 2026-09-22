import { VehicleFitmentSpec } from './database.js';

export type ReturnReason =
  | 'Wrong Part'
  | 'Wrong Product'
  | 'Damaged'
  | 'Defective'
  | 'Manufacturing Defect'
  | 'Not Compatible'
  | 'Other';

export type ReturnStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'INSPECTION'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'REPLACEMENT_PENDING'
  | 'COMPLETED'
  | 'CANCELLED';

export type ReturnAction = 'REFUND' | 'REPLACEMENT';

export interface ReturnStatusHistoryEntry {
  status: ReturnStatus;
  title: string;
  notes?: string;
  updatedBy: string;
  timestamp: string;
}

export interface ReturnRequestEntity {
  id: string; // UUID
  returnNumber: string; // e.g. "RET-2026-8192"
  orderId: string;
  subOrderId: string;
  customerId: string;
  sellerId: string;
  productId: string;
  productTitle: string;
  partNumber: string;
  productImage: string;
  quantity: number;
  reason: ReturnReason;
  customerExplanation: string;
  vehicleConfirmed: boolean;
  vehicleDetails?: VehicleFitmentSpec | Record<string, unknown> | null;
  evidencePhotos: string[];
  status: ReturnStatus;
  action: ReturnAction;
  approvedRefundAmount: number;
  pickupAwb?: string | null;
  inspectionNotes?: string | null;
  statusHistory: ReturnStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
