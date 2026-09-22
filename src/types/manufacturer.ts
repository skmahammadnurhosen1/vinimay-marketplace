import { PartType } from './index';

export type ManufacturerPortalTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'dealers'
  | 'demand'
  | 'returns-warranty'
  | 'inventory'
  | 'revenue'
  | 'profile'
  | 'notifications';

export interface VehicleCompatibilitySpec {
  vehicleType: 'passenger' | 'commercial';
  manufacturer: string;
  model: string;
  yearRange: string;
  engine?: string;
  fuelType?: string;
  variant?: string;
  notes?: string;
}

export type ManufacturerProductStatus = 'Active' | 'Inactive' | 'Draft' | 'Low Stock' | 'Out of Stock';

export interface ManufacturerProduct {
  id: string;
  title: string;
  brand: string;
  brandId: string;
  partNumber: string;
  oemNumber: string;
  category: 'Brake' | 'Clutch' | 'Suspension' | 'Gearbox/Transmission' | 'Differential/Axle';
  subCategory: string;
  productType: PartType; // 'Genuine' | 'OEM' | 'Aftermarket'
  price: number; // Trade / Wholesale List Price
  mrp: number; // Maximum Retail Price
  stock: {
    current: number;
    reserved: number;
    available: number;
    lowStockThreshold: number;
    warehouseLocation: string;
  };
  warranty: string;
  status: ManufacturerProductStatus;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  compatibility: VehicleCompatibilitySpec[];
  unitsSoldTotal: number;
  activeDealersCount: number;
  rating: number;
  createdAt: string;
}

export interface SellerConsignmentInfo {
  sellerId: string;
  sellerName: string;
  sellerTier: 'Authorized Distributor' | 'OEM Partner' | 'Certified Wholesaler' | 'Verified Retailer';
  sellerLocation: string;
  courierPartner: string;
  trackingNumber: string;
  dispatchStatus: 'Pending' | 'Ready to Ship' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered';
}

export interface ManufacturerOrderItem {
  productId: string;
  productTitle: string;
  partNumber: string;
  oemNumber: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ManufacturerOrder {
  id: string;
  orderDate: string;
  customerName: string;
  customerCity: string;
  customerState: string;
  sellerConsignment: SellerConsignmentInfo;
  items: ManufacturerOrderItem[];
  totalAmount: number;
  totalUnits: number;
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';
  shipmentStatus: 'Pending' | 'Ready to Ship' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  returnStatus: 'None' | 'Requested' | 'Approved' | 'Rejected';
  warrantyStatus: 'None' | 'Active Warranty' | 'Claim Filed' | 'Claim Resolved';
}

export interface ManufacturerDealer {
  id: string;
  dealerName: string;
  dealerType: 'Authorized Distributor' | 'OEM Partner' | 'Certified Wholesaler' | 'Verified Retailer';
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  productsSold: number;
  unitsSold: number;
  revenue: number;
  ordersCount: number;
  returnRate: number; // percentage e.g. 1.4%
  warrantyClaimsCount: number;
  performanceRating: number; // e.g. 4.8
  trend: 'up' | 'down' | 'stable';
  contractStatus: 'Active Authorized' | 'Under Audit' | 'Renewal Pending';
  sinceDate: string;
}

export interface VehicleDemandStat {
  make: string;
  model: string;
  vehicleType: 'passenger' | 'commercial';
  searchCount: number;
  orderCount: number;
  trendPercentage: number;
}

export interface RegionalDemandStat {
  region: string;
  state: string;
  percentage: number;
  activeOrders: number;
}

export interface CategoryDemandStat {
  category: 'Brake' | 'Clutch' | 'Suspension' | 'Gearbox/Transmission' | 'Differential/Axle';
  inquiryCount: number;
  growthMoM: number;
  unfulfilledInquiries: number;
}

export interface CustomerDemandAnalytics {
  topDemandedParts: {
    partNumber: string;
    productTitle: string;
    oemNumber: string;
    category: string;
    searchCount30d: number;
    unitsRequested: number;
    unmetStockDemand: number;
    velocityScore: number;
  }[];
  vehicleDemand: VehicleDemandStat[];
  regionalDemand: RegionalDemandStat[];
  categoryDemand: CategoryDemandStat[];
  monthlyDemandTrend: {
    month: string;
    searchVolume: number;
    inquiries: number;
    convertedOrders: number;
  }[];
}

export type ManufacturerReturnReason =
  | 'Wrong Part'
  | 'Wrong Product Received'
  | 'Damaged Product'
  | 'Defective Product'
  | 'Manufacturing Defect'
  | 'Product Not Compatible'
  | 'Other';

export interface ManufacturerReturnRecord {
  id: string;
  orderId: string;
  productName: string;
  partNumber: string;
  quantity: number;
  amount: number;
  dealerName: string;
  customerName: string;
  customerCity: string;
  reason: ManufacturerReturnReason;
  detailedNotes: string;
  requestDate: string;
  status: 'Under Review' | 'Inspection Scheduled' | 'Approved for Replacement' | 'Approved for Refund' | 'Rejected';
  photoUrls?: string[];
}

export type ManufacturerWarrantyOutcome =
  | 'Under Review'
  | 'Replacement'
  | 'Repair'
  | 'Credit'
  | 'Refund'
  | 'Approved'
  | 'Rejected';

export interface ManufacturerWarrantyClaim {
  id: string;
  // 8 Blueprint Mandatory Fields
  orderId: string;
  productName: string;
  partNumber: string;
  vehicleDetails: string; // e.g. Tata Ace Gold (2022) 700cc Dicor
  problemDescription: string;
  photoEvidence: string[];
  videoEvidence: string;
  invoiceNumber: string;

  // Metadata
  customerName: string;
  customerPhone: string;
  dealerName: string;
  claimDate: string;
  status: 'Submitted' | 'Technical Inspection' | 'Decision Pending' | 'Resolved';
  outcome: ManufacturerWarrantyOutcome;
  technicalFinding?: string;
  resolutionNotes?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'Inward Production' | 'Dealer Dispatch' | 'RMA Return' | 'Stock Adjustment';
  quantity: number;
  balanceAfter: number;
  referenceDoc: string;
  notes: string;
}

export interface ManufacturerInventoryItem {
  productId: string;
  partNumber: string;
  productTitle: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';
  warehouseLocation: string;
  incomingProductionBatch: {
    batchNumber: string;
    expectedUnits: number;
    arrivalDate: string;
  } | null;
  recentMovements: StockMovement[];
}

export type RevenueDateFilter = 'today' | '7d' | '30d' | '90d' | 'year' | 'custom';

export interface RevenueAnalytics {
  dateFilter: RevenueDateFilter;
  totalRevenue: number;
  productSalesAmount: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  revenueByCategory: {
    category: string;
    revenue: number;
    percentage: number;
  }[];
  revenueByTopProducts: {
    partNumber: string;
    productTitle: string;
    units: number;
    revenue: number;
  }[];
  revenueByTopDealers: {
    dealerName: string;
    city: string;
    revenue: number;
    orderCount: number;
  }[];
  monthlyRevenueTrend: {
    month: string;
    revenue: number;
    units: number;
    target: number;
  }[];
}

export interface ManufacturerBrandProfile {
  id: string;
  brandName: string;
  legalEntityName: string;
  shortName: string;
  logo: string;
  tagline: string;
  establishedYear: number;
  cinNumber: string;
  gstin: string;
  pan: string;
  registeredOffice: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  plantLocations: {
    facilityName: string;
    address: string;
    specialization: string;
  }[];
  primaryContact: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  supportContact: {
    oemHelpline: string;
    technicalSupportEmail: string;
    dealerSupportEmail: string;
  };
  verificationStatus: 'Verified OEM Manufacturer' | 'Tier-1 Certified Supplier' | 'Under Audit';
  oemAccreditations: string[];
  certifications: string[]; // e.g. IATF 16949, ISO 9001:2015, ARAI, ECE R90
  warrantyPolicyDoc: string;
}

export interface ManufacturerNotification {
  id: string;
  type: 'order' | 'demand' | 'low_stock' | 'return' | 'warranty' | 'dealer' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
  targetTab?: ManufacturerPortalTab;
}

export interface ManufacturerKPISummary {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  salesRevenue: number;
  unitsSold: number;
  dealerCount: number;
  customerDemandIndex: number;
  pendingReturns: number;
  warrantyClaims: number;
  lowStockProducts: number;
}
