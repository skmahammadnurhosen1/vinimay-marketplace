import { Product, PartType, VehicleCompatibility, SelectedVehicle } from './index';

export type B2BPortalTab =
  | 'dashboard'
  | 'products'
  | 'bulk-order'
  | 'cart'
  | 'orders'
  | 'invoices'
  | 'profile'
  | 'credit'
  | 'support'
  | 'settings';

export type B2BAccountType = 'garage' | 'fleet';

export interface B2BGarageProfile {
  id: string;
  accountType: 'garage';
  businessName: string;
  ownerName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan: string;
  serviceBays: number;
  monthlySpendTier: string;
  preferredVehicleCategories: string[];
  specializations: string[];
  isVerified: boolean;
  creditLimit: number;
  creditAvailable: number;
}

export interface B2BFleetProfile {
  id: string;
  accountType: 'fleet';
  companyName: string;
  managerName: string;
  mobile: string;
  email: string;
  depotAddress: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan: string;
  fleetSize: number;
  commercialVehicleTypes: string[];
  primaryVehicleBrands: string[];
  isVerified: boolean;
  creditLimit: number;
  creditAvailable: number;
}

export interface B2BBulkTier {
  minQty: number;
  unitPrice: number;
  discountPct: number;
  label: string;
}

export interface B2BBulkOrderItem {
  productId: string;
  title: string;
  brand: string;
  partNumber: string;
  oemNumber: string;
  category: string;
  compatibilityInfo: string;
  sellerName: string;
  sellerId: string;
  stock: number;
  quantity: number;
  regularPrice: number;
  businessPrice: number;
  lineTotal: number;
  gstRate: number;
  gstAmount: number;
}

export interface B2BRFQRequest {
  id: string;
  date: string;
  accountName: string;
  accountType: B2BAccountType;
  targetVehicles: string;
  categoriesRequired: string[];
  estimatedMonthlyVolume: number;
  deliveryTimeline: string;
  customNotes: string;
  status: 'Under Review' | 'Quoted' | 'Approved' | 'Declined';
  estimatedQuoteAmount?: number;
}

export interface B2BCartItem {
  product: Product;
  quantity: number;
  unitRegularPrice: number;
  unitBusinessPrice: number;
  lineTotal: number;
  sellerId: string;
  sellerName: string;
  sellerTier: string;
}

export interface B2BConsignment {
  sellerId: string;
  sellerName: string;
  sellerTier: string;
  items: B2BCartItem[];
  consignmentSubtotal: number;
  consignmentGST: number;
  estimatedDispatch: string;
  courierPartner: string;
}

export interface B2BOrder {
  orderId: string;
  orderDate: string;
  accountType: B2BAccountType;
  businessName: string;
  gstin: string;
  consignments: B2BConsignment[];
  totalUnits: number;
  subtotal: number;
  bulkSavings: number;
  gstTotal: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Credit Facility' | 'Pending NEFT';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Partially Shipped';
  shippingAddress: string;
  invoiceNumber: string;
}

export interface B2BInvoiceLineItem {
  sno: number;
  description: string;
  hsnCode: string;
  partNumber: string;
  qty: number;
  unitRate: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
}

export interface B2BGSTInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  orderId: string;
  sellerName: string;
  sellerGSTIN: string;
  sellerAddress: string;
  sellerState: string;
  buyerName: string;
  buyerGSTIN: string;
  buyerAddress: string;
  buyerState: string;
  placeOfSupply: string;
  isInterState: boolean;
  lineItems: B2BInvoiceLineItem[];
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  grandTotal: number;
  amountInWords: string;
}
