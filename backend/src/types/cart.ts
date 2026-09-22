export interface CartItemRecord {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface CartEntity {
  id: string; // customerId (Firebase UID)
  customerId: string;
  items: CartItemRecord[];
  updatedAt: string;
}

export interface EnrichedProductSummary {
  id: string;
  title: string;
  brand: string;
  partNumber: string;
  oemNumber: string;
  category: string;
  subCategory: string;
  partType: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  image: string;
  inStock: boolean;
  availableStock: number;
  sellerId: string;
}

export interface EnrichedCartItem {
  productId: string;
  quantity: number;
  product: EnrichedProductSummary;
  itemTotal: number;
  isAvailable: boolean;
  stockMessage?: string;
  addedAt: string;
}

export interface PublicSellerSummary {
  id: string;
  name: string;
  tier: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

export interface SellerCartGroup {
  seller: PublicSellerSummary;
  items: EnrichedCartItem[];
  subtotal: number;
  itemCount: number;
  shippingFee: number;
  estimatedDelivery: string;
}

export interface CustomerCartView {
  customerId: string;
  items: EnrichedCartItem[];
  groups: SellerCartGroup[];
  subtotal: number;
  shippingTotal: number;
  totalPayable: number;
  itemCount: number;
  sellerCount: number;
  hasStockIssues: boolean;
}
