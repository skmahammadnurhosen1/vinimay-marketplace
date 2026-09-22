export type RefundStatus = 'PENDING' | 'PROCESSED' | 'FAILED';

export interface RefundEntity {
  id: string; // UUID
  refundNumber: string; // e.g. "REF-2026-4819"
  paymentId: string;
  orderId: string;
  subOrderId: string;
  returnId?: string | null;
  customerId: string;
  amount: number; // in INR
  currency: 'INR';
  reason: string;
  status: RefundStatus;
  providerRefundId?: string;
  failureReason?: string | null;
  processedAt: string;
  createdAt: string;
}
