export type PaymentStatus =
  | 'PENDING'
  | 'INITIATED'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

export type PaymentProvider = 'razorpay' | 'cashfree' | 'cod' | 'mock_gateway';

export interface PaymentEntity {
  id: string; // UUID
  paymentNumber: string; // e.g. "PAY-2026-98124"
  orderId: string;
  orderNumber: string;
  customerId: string;
  amount: number; // in INR rupees
  currency: 'INR';
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  failureReason?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CodEligibilityResult {
  eligible: boolean;
  maxCodAmount: number;
  reason?: string;
}

export interface WebhookEventRecord {
  id: string; // provider event id / hash
  provider: PaymentProvider | string;
  eventType: string;
  processedAt: string;
}
