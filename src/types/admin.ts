export type AdminPortalTab =
  | 'dashboard'
  | 'sellers'
  | 'products'
  | 'orders'
  | 'returns'
  | 'refunds'
  | 'warranty'
  | 'finance'
  | 'customers'
  | 'reviews'
  | 'support'
  | 'reports'
  | 'settings';

export type AdminSellerType =
  | 'Manufacturer'
  | 'Authorized Distributor'
  | 'Certified Wholesaler'
  | 'Verified Retailer';

export type AdminSellerStatus =
  | 'Active'
  | 'Under Review'
  | 'Suspended'
  | 'Pending'
  | 'Rejected';

export type AdminDocumentVerificationStatus =
  | 'Verified'
  | 'Under Review'
  | 'Pending'
  | 'Requires Action'
  | 'Rejected';

export interface AdminSellerDocument {
  id: string;
  type:
    | 'gst_certificate'
    | 'pan_card'
    | 'bank_proof'
    | 'mfg_auth_letter'
    | 'brand_auth'
    | 'biz_registration';
  title: string;
  fileName: string;
  fileSize: string;
  status: AdminDocumentVerificationStatus;
  uploadedDate: string;
  verifiedDate?: string;
  notes?: string;
}

export interface AdminSeller {
  id: string;
  businessName: string;
  sellerType: AdminSellerType;
  ownerName: string;
  email: string;
  mobile: string;
  gstin: string;
  pan: string;
  city: string;
  state: string;
  pincode: string;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  totalSales: number;
  commissionRate: number; // in percentage e.g. 10 for 10%
  accountStatus: AdminSellerStatus;
  kycStatus: AdminDocumentVerificationStatus;
  joinedDate: string;
  documents: AdminSellerDocument[];
}

export type AdminQualityTier = 'Genuine' | 'OEM' | 'Aftermarket';

export type AdminProductApprovalStatus =
  | 'Approved'
  | 'Pending Review'
  | 'Rejected'
  | 'Requires Clarification';

export interface AdminProductListing {
  id: string;
  title: string;
  brand: string;
  sellerId: string;
  sellerName: string;
  sellerType: AdminSellerType;
  category: string;
  subCategory: string;
  mpn: string;
  oemRef: string;
  qualityTier: AdminQualityTier;
  price: number;
  mrp: number;
  stock: number;
  fitmentCount: number;
  status: AdminProductApprovalStatus;
  submittedDate: string;
  authProofFileName?: string;
  authProofStatus?: 'Valid' | 'Missing' | 'Under Review';
  imageUrl: string;
  description: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  partCount: number;
  sellerCount: number;
  subcategories: string[];
  iconName: string;
}

export interface AdminSubOrderItem {
  productId: string;
  title: string;
  brand: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  qualityTier: AdminQualityTier;
}

export type AdminSubOrderShipmentStatus =
  | 'Pending'
  | 'Ready to Ship'
  | 'Shipped'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface AdminSubOrder {
  subOrderId: string;
  sellerId: string;
  sellerName: string;
  sellerType: AdminSellerType;
  items: AdminSubOrderItem[];
  subTotal: number;
  commissionAmount: number;
  netSellerPayout: number;
  courierPartner: string;
  trackingNumber: string;
  dispatchStatus: AdminSubOrderShipmentStatus;
  settlementStatus: 'Pending' | 'Processing' | 'Settled';
  estimatedDelivery: string;
}

export interface AdminMasterOrder {
  orderId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
  };
  orderDate: string;
  totalAmount: number;
  platformCommissionTotal: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus:
    | 'Processing'
    | 'Partially Shipped'
    | 'Shipped'
    | 'Delivered'
    | 'Returned'
    | 'Cancelled';
  shippingAddress: string;
  subOrders: AdminSubOrder[];
}

export type ReturnReason =
  | 'Wrong Part'
  | 'Wrong Product Received'
  | 'Damaged Product'
  | 'Defective Product'
  | 'Manufacturing Defect'
  | 'Product Not Compatible'
  | 'Other';

export type ReturnLifecycleStage =
  | 'Customer Request'
  | 'Verification'
  | 'Pickup Scheduled'
  | 'Inspection'
  | 'Decision'
  | 'Resolution';

export type ReturnStatus =
  | 'Pending Review'
  | 'Pickup In Progress'
  | 'Under Inspection'
  | 'Approved for Refund'
  | 'Approved for Replacement'
  | 'Rejected';

export interface AdminReturnRequest {
  id: string;
  orderId: string;
  subOrderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  sellerName: string;
  productName: string;
  partNumber: string;
  quantity: number;
  amount: number;
  reason: ReturnReason;
  requestedDate: string;
  stage: ReturnLifecycleStage;
  status: ReturnStatus;
  notes: string;
  imageProofs: string[];
}

export interface AdminRefund {
  id: string;
  returnId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  sellerName: string;
  amount: number;
  paymentMethod: string;
  refundMethod: string;
  status: 'Pending Approval' | 'Processing' | 'Completed' | 'Rejected' | 'Held';
  requestedDate: string;
  processedDate?: string;
  utrRef?: string;
  reason: string;
}

export type WarrantyOutcome =
  | 'Pending'
  | 'Replacement'
  | 'Repair'
  | 'Credit'
  | 'Refund'
  | 'Rejected';

export interface AdminWarrantyClaim {
  id: string;
  // 8 Mandatory Evidence Fields
  orderId: string;
  productName: string;
  partNumber: string;
  vehicleDetails: string;
  problemDescription: string;
  photoEvidence: string[];
  videoEvidence: string;
  invoiceNumber: string;

  // Metadata & Status
  customerName: string;
  customerPhone: string;
  sellerName: string;
  claimDate: string;
  evaluationStage:
    | 'Submitted'
    | 'Technical Review'
    | 'Outcome Decided'
    | 'Fulfillment';
  outcome: WarrantyOutcome;
  technicalNotes?: string;
}

export interface AdminSettlementLedgerEntry {
  id: string;
  settlementDate: string;
  orderRef: string;
  sellerId: string;
  sellerName: string;
  grossAmount: number;
  platformFee: number;
  taxOnFee: number;
  netPayout: number;
  utrNumber: string;
  status: 'Settled' | 'Processing' | 'Upcoming';
}

export interface AdminGSTRecord {
  id: string;
  invoiceRef: string;
  orderId: string;
  date: string;
  sellerState: string;
  customerState: string;
  isInterState: boolean;
  taxableValue: number;
  igstRate: number;
  igstAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalTax: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  primaryVehicle: string;
  totalOrders: number;
  totalSpend: number;
  status: 'Active' | 'Suspended' | 'Flagged';
  joinedDate: string;
  address: string;
  lastOrderDate: string;
}

export interface AdminReviewItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  customerName: string;
  sellerName: string;
  productRating: number;
  sellerRating: number;
  deliveryRating: number;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  status: 'Pending Moderation' | 'Approved' | 'Flagged' | 'Spam/Hidden';
}

export interface AdminSupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  category:
    | 'Order'
    | 'Shipping'
    | 'Return'
    | 'Warranty'
    | 'Technical Fitment'
    | 'Payment';
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  messages: {
    sender: 'customer' | 'admin';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export type AdminRole =
  | 'Super Admin'
  | 'Catalog Operations Admin'
  | 'Finance & Settlements Admin'
  | 'Customer Support Admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  twoFactorEnabled: boolean;
  lastActive: string;
  permissions: string[];
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  module: string;
  targetId: string;
  details: string;
}
