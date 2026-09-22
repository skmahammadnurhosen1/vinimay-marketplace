import { PartType, VehicleCompatibility, SelectedVehicle, TrackingCheckpoint } from './index';

export type SellerType =
  | 'Manufacturer'
  | 'Authorized Distributor'
  | 'Certified Wholesaler'
  | 'Verified Retailer';

export type SellerKYCStatus =
  | 'Pending'
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Requires Action';

export type SellerDocumentType =
  | 'gst_certificate'
  | 'pan_card'
  | 'bank_proof'
  | 'mfg_auth_letter'
  | 'brand_auth'
  | 'biz_registration';

export interface SellerDocument {
  id: string;
  type: SellerDocumentType;
  title: string;
  fileName?: string;
  fileSize?: string;
  uploadedDate?: string;
  status: SellerKYCStatus;
  notes?: string;
  rejectionReason?: string;
}

export interface SellerProfile {
  id: string;
  businessName: string;
  sellerType: SellerType;
  ownerName: string;
  mobile: string;
  email: string;
  gstin: string;
  pan: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rating: number;
  reviewCount: number;
  kycStatus: SellerKYCStatus;
  joinedDate: string;
  documents: SellerDocument[];
}

export interface SellerKPIMetrics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  returnRequests: number;
  warrantyClaims: number;
  totalSales: number;
  platformCommission: number;
  netSettlement: number;
  totalStock: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface SellerOrderItem {
  productId: string;
  title: string;
  partNumber: string;
  oemNumber?: string;
  brand: string;
  partType: PartType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  vehicleSummary?: string;
}

export type SellerShipmentState =
  | 'ordered'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface SellerCheckpoint {
  stage: SellerShipmentState;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed?: boolean;
  current?: boolean;
}

export interface SellerOrder {
  id: string; // e.g. "ORD-APH-98421-PKG1"
  marketplaceOrderId: string; // "APH-2026-98421"
  orderDate: string;
  customerSummary: {
    maskedName: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: SellerOrderItem[];
  totalAmount: number;
  commissionRate: number; // e.g. 0.10 (10%)
  commissionAmount: number;
  netPayout: number;
  paymentState: 'Paid' | 'Pending (COD)' | 'Refunded';
  shipmentState: SellerShipmentState;
  courierName: string;
  trackingNumber: string;
  dispatchDate?: string;
  estimatedDelivery: string;
  checkpoints: SellerCheckpoint[];
}

export interface SellerProduct {
  id: string;
  title: string;
  brand: string;
  manufacturer: string;
  partNumber: string;
  oemNumber: string;
  category: string;
  subCategory: string;
  partType: PartType;
  price: number;
  mrp: number;
  discountPercentage: number;
  stockCount: number;
  lowStockThreshold: number;
  status: 'active' | 'draft' | 'out_of_stock' | 'under_review';
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  compatibility: VehicleCompatibility[];
  warranty: string;
  returnDays: number;
  createdAt: string;
}

export interface SellerInventoryItem {
  productId: string;
  title: string;
  partNumber: string;
  brand: string;
  category: string;
  image: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  unitPrice: number;
  totalValue: number;
  lastRestocked: string;
}

export type SellerReturnReason =
  | 'Wrong Part'
  | 'Wrong Product Received'
  | 'Damaged Product'
  | 'Defective Product'
  | 'Manufacturing Defect'
  | 'Product Not Compatible'
  | 'Other';

export type SellerReturnWorkflowStatus =
  | 'submitted'
  | 'under_verification'
  | 'pickup_scheduled'
  | 'under_inspection'
  | 'approved'
  | 'rejected'
  | 'replacement_initiated'
  | 'refund_initiated'
  | 'additional_info_required';

export interface SellerReturnItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  partNumber: string;
  productImage: string;
  quantity: number;
  reason: SellerReturnReason;
  customerExplanation: string;
  submittedDate: string;
  status: SellerReturnWorkflowStatus;
  refundAmount: number;
  evidencePhotos: string[];
  vehicleDetails?: string;
  additionalInfoRequiredNotes?: string;
}

export type SellerWarrantyClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'approved'
  | 'rejected'
  | 'resolution_in_progress'
  | 'closed';

export type SellerWarrantyOutcome = 'replacement' | 'repair' | 'credit' | 'refund';

export interface SellerWarrantyClaim {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  partNumber: string;
  vehicle: SelectedVehicle;
  problemDescription: string;
  photos: string[];
  videoName?: string;
  invoiceNumber: string;
  submittedDate: string;
  status: SellerWarrantyClaimStatus;
  outcome?: SellerWarrantyOutcome;
  outcomeNotes?: string;
  additionalInfoPrompt?: string;
  warrantyPeriod: string;
}

export interface SellerSettlement {
  id: string; // e.g. "SETTLE-2026-084"
  orderId: string;
  grossSales: number;
  commissionDeducted: number;
  gstOnCommission: number;
  netSettled: number;
  status: 'Settled' | 'Processing' | 'Upcoming';
  settlementDate: string;
  utrReference: string;
  bankAccountSummary: string; // "HDFC Bank •••• 4129"
}

export interface SellerNotification {
  id: string;
  type: 'new_order' | 'return_request' | 'warranty_claim' | 'settlement' | 'stock_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkId?: string;
}

export type SellerNavTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'add_product'
  | 'inventory'
  | 'returns'
  | 'warranty'
  | 'sales_settlement'
  | 'profile_kyc'
  | 'settings';
