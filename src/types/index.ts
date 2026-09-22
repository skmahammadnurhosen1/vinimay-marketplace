export type VehicleCategoryType = 'passenger' | 'commercial';

export interface VehicleOption {
  id: string;
  name: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  years: number[];
  fuelTypes: string[];
  engines: string[];
  variants: string[];
}

export interface Manufacturer {
  id: string;
  name: string;
  category: VehicleCategoryType;
  logo?: string;
  popularModels: string[];
  models: VehicleModel[];
}

export interface SelectedVehicle {
  vehicleType: VehicleCategoryType;
  manufacturer: string;
  model: string;
  year: number;
  fuelType: string;
  engine: string;
  variant: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
  subcategories: string[];
}

export interface VehicleBrand {
  id: string;
  name: string;
  category: 'passenger' | 'commercial' | 'both';
  origin: string;
  tagline: string;
  logoUrl?: string;
}

export type PartType = 'Genuine' | 'OEM' | 'Aftermarket';

export interface Seller {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  tier: 'Authorized Distributor' | 'OEM Partner' | 'Certified Wholesaler' | 'Verified Retailer';
  city: string;
  state: string;
  verified: boolean;
}

export interface VehicleCompatibility {
  manufacturer: string;
  model: string;
  yearRange: string;
  engine?: string;
  fuelType?: string;
  variant?: string;
  notes?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  verifiedPurchase: boolean;
  rating: number;
  title: string;
  comment: string;
  date: string;
  vehicleUsed?: string;
  helpfulCount: number;
  photos?: string[];
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  manufacturer?: string;
  partNumber: string;
  oemNumber: string;
  category: string;
  subCategory: string;
  partType: PartType;
  price: number;
  mrp: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  deliveryTime: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  compatibility: VehicleCompatibility[];
  seller: Seller;
  warranty: string;
  returnDays: number;
  installationGuidance?: string;
  slug?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  reviews?: Review[];
}

export interface CompareItem {
  id: string;
  title: string;
  brand: string;
  partType: PartType;
  price: number;
  rating: number;
  warranty: string;
  sellerRating: number;
  sellerName: string;
  image: string;
  category: string;
  compatibilityCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductFilterState {
  searchQuery: string;
  category: string;
  subCategories: string[];
  brands: string[];
  partTypes: PartType[];
  priceRange: { min: number; max: number };
  minRating: number;
  partNumberQuery: string;
  inStockOnly: boolean;
  fastDeliveryOnly: boolean;
  sellerTiers: string[];
  compatibleVehicleOnly: boolean;
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'popularity';

export type ViewMode = 'grid' | 'list';

export interface FilterFacets {
  categories: Record<string, number>;
  subCategories: Record<string, number>;
  brands: Record<string, number>;
  partTypes: Record<string, number>;
  sellerTiers: Record<string, number>;
  minPrice: number;
  maxPrice: number;
  totalCount: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export type SuggestionType = 'product' | 'partNumber' | 'brand' | 'vehicle' | 'category';

export interface SearchSuggestionItem {
  id: string;
  title: string;
  subtitle?: string;
  type: SuggestionType;
  category?: string;
  badge?: string;
  targetQuery: string;
}

export interface SearchSuggestionGroup {
  type: SuggestionType;
  label: string;
  items: SearchSuggestionItem[];
}

// -------------------------------------------------------------
// CART, CHECKOUT & ORDER TYPES
// -------------------------------------------------------------
export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  type: 'home' | 'work' | 'garage';
  isDefault?: boolean;
}

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

export interface PaymentDetails {
  method: PaymentMethodType;
  upiId?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  bankName?: string;
  walletProvider?: string;
}

export interface SellerCartGroupData {
  seller: Seller;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  shippingFee: number;
  estimatedDelivery: string;
}

export type OrderStatusStage = 'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface SellerOrderPackage {
  packageId: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerState: string;
  sellerTier: string;
  sellerVerified: boolean;
  trackingId: string;
  courierPartner: string;
  estimatedDelivery: string;
  items: CartItem[];
  packageSubtotal: number;
  packageShipping: number;
  status: OrderStatusStage;
}

export interface ConfirmedOrder {
  orderId: string;
  orderDate: string;
  customerAddress: DeliveryAddress;
  vehicleContext?: SelectedVehicle | null;
  packages: SellerOrderPackage[];
  paymentMethod: PaymentMethodType;
  paymentRef: string;
  paymentStatus: 'Paid' | 'Pending (Cash on Delivery)';
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  gstAmount: number;
  totalPayable: number;
}

// -------------------------------------------------------------
// ORDER HISTORY, TRACKING, RETURNS & WARRANTY
// -------------------------------------------------------------

export interface TrackingCheckpoint {
  stage: OrderStatusStage;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface PackageTrackingInfo {
  packageId: string;
  trackingId: string;
  courierPartner: string;
  currentStage: OrderStatusStage;
  estimatedDelivery: string;
  checkpoints: TrackingCheckpoint[];
}

export type OrderOverallStatus =
  | 'processing'
  | 'shipped'
  | 'partially_delivered'
  | 'delivered'
  | 'returned'
  | 'cancelled';

export interface CustomerOrder {
  id: string;
  date: string;
  overallStatus: OrderOverallStatus;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'Paid' | 'Pending (Cash on Delivery)' | 'Refunded';
  paymentRef: string;
  deliveryAddress: DeliveryAddress;
  vehicleContext?: SelectedVehicle | null;
  packages: (SellerOrderPackage & { trackingInfo?: PackageTrackingInfo })[];
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  gstAmount: number;
  totalPayable: number;
  isReturnEligible: boolean;
  isWarrantyEligible: boolean;
  invoiceUrl?: string;
}

export type ReturnReason =
  | 'Wrong Part'
  | 'Wrong Product Received'
  | 'Damaged Product'
  | 'Defective Product'
  | 'Manufacturing Defect'
  | 'Product Not Compatible'
  | 'Other';

export type ReturnStatus =
  | 'submitted'
  | 'under_verification'
  | 'pickup_scheduled'
  | 'under_inspection'
  | 'approved'
  | 'rejected'
  | 'replacement_initiated'
  | 'refund_initiated'
  | 'additional_info_required';

export interface ReturnStatusHistoryItem {
  status: ReturnStatus;
  title: string;
  date: string;
  notes?: string;
}

export interface CustomerReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  sellerId: string;
  sellerName: string;
  vehicleContext?: SelectedVehicle | null;
  reason: ReturnReason;
  explanation: string;
  submittedDate: string;
  status: ReturnStatus;
  statusHistory: ReturnStatusHistoryItem[];
  evidencePhotos: string[];
  resolutionType: 'refund' | 'replacement';
  pickupDate?: string;
  refundAmount?: number;
  additionalInfoPrompt?: string;
  rejectionReason?: string;
}

export type WarrantyClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'approved'
  | 'rejected'
  | 'resolution_in_progress'
  | 'closed';

export type WarrantyOutcome = 'replacement' | 'repair' | 'credit' | 'refund';

export interface CustomerWarrantyClaim {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  partNumber: string;
  vehicle: SelectedVehicle;
  problemDescription: string;
  photos: string[];
  videoName?: string;
  invoiceNumber: string;
  submittedDate: string;
  status: WarrantyClaimStatus;
  outcome?: WarrantyOutcome;
  outcomeNotes?: string;
  additionalInfoPrompt?: string;
  warrantyPeriod: string;
  resolutionDate?: string;
}

export type NotificationType =
  | 'order_confirmed'
  | 'payment_confirmed'
  | 'order_shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'return_update'
  | 'refund_update'
  | 'warranty_update';

export interface CustomerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  referenceId?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Order' | 'Shipping' | 'Return' | 'Warranty' | 'Technical Fitment' | 'Payment';
  orderId?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  lastUpdate: string;
  messages: {
    sender: 'customer' | 'support';
    text: string;
    timestamp: string;
  }[];
}



