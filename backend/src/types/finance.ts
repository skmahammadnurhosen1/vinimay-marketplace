export interface MarketplaceCommissionConfig {
  id: string; // 'commission_config_global'
  defaultRate: number; // e.g. 10 (%)
  categoryRates: Record<string, number>; // e.g. { 'Braking System': 8, 'Lighting & Electronics': 12 }
  sellerAgreedRates: Record<string, number>; // e.g. { 'sellerA': 7 }
  updatedAt: string;
  updatedBy: string;
}

export type SettlementStatus = 'ON_HOLD' | 'ELIGIBLE' | 'SETTLED' | 'PAID' | 'CANCELLED';

export interface SellerSettlementEntity {
  id: string; // e.g. `stl_${uuid}`
  settlementNumber: string; // e.g. `STL-2026-98124`
  sellerId: string;
  sellerName: string;
  subOrderId: string;
  orderId: string;
  orderNumber: string;
  grossAmount: number; // package subtotal + tax
  commissionRate: number; // percentage
  commissionAmount: number; // grossAmount * (commissionRate / 100)
  refundDeductions: number; // total refunded for this package
  netPayout: number; // grossAmount - commissionAmount - refundDeductions
  status: SettlementStatus;
  holdUntilDate: string; // ISO date string after which funds can be released
  eligibleAt?: string | null;
  settledAt?: string | null;
  transactionRef?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GstPartyDetails {
  legalName: string;
  tradeName?: string;
  gstin: string;
  pan: string;
  stateCode: string; // e.g. '07' for Delhi, '06' for Haryana
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  isB2B: boolean;
}

export interface GstInvoiceItem {
  productId: string;
  description: string;
  partNumber: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxableAmount: number;
  gstRate: number; // 18 (%)
  cgstRate: number; // 9 (%) if intra-state, 0 if inter-state
  cgstAmount: number;
  sgstRate: number; // 9 (%) if intra-state, 0 if inter-state
  sgstAmount: number;
  igstRate: number; // 18 (%) if inter-state, 0 if intra-state
  igstAmount: number;
  totalAmount: number;
}

export interface GstInvoiceEntity {
  id: string; // e.g. `inv_${uuid}`
  invoiceNumber: string; // e.g. `INV-APH-2026-10492`
  invoiceDate: string;
  orderId: string;
  orderNumber: string;
  subOrderId?: string | null;
  sellerGst: GstPartyDetails;
  buyerGst: GstPartyDetails;
  items: GstInvoiceItem[];
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTax: number;
  shippingFee: number;
  grandTotal: number;
  isInterState: boolean;
  createdAt: string;
}

export interface FinancialSummaryReport {
  gmv: number;
  totalCommissions: number;
  totalRefunds: number;
  totalSettled: number;
  pendingSettlementAmount: number;
  totalGstCollected: number;
  orderCount: number;
  settledCount: number;
  pendingCount: number;
  reportGeneratedAt: string;
}
