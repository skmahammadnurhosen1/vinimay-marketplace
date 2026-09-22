import { AddressEntity, VehicleFitmentSpec } from './database.js';

export type PaymentStatus = 'PENDING' | 'INITIATED' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

export type OrderStatus =
  | 'CREATED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface OrderItemEntity {
  productId: string;
  title: string;
  brand: string;
  partNumber: string;
  oemNumber: string;
  partType: string;
  image: string;
  unitPrice: number;
  mrp: number;
  gstRate: number;
  quantity: number;
  totalPrice: number;
  taxAmount: number;
  sellerId: string;
}

export interface SellerSubOrderEntity {
  id: string; // UUID
  subOrderNumber: string; // e.g. "PKG-SELLER-1234"
  parentOrderId: string;
  orderNumber: string; // e.g. "APH-2026-98421"
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerState: string;
  sellerTier: string;
  sellerVerified: boolean;
  items: OrderItemEntity[];
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ParentOrderEntity {
  id: string; // UUID
  orderNumber: string; // e.g. "APH-2026-98421"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: AddressEntity;
  vehicleContext?: VehicleFitmentSpec | Record<string, unknown> | null;
  subtotal: number;
  discountTotal: number;
  taxAmount: number;
  shippingTotal: number;
  totalPayable: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentRef: string;
  status: OrderStatus;
  sellerCount: number;
  itemCount: number;
  subOrderIds: string[];
  packages?: SellerSubOrderEntity[];
  isB2BOrder?: boolean;
  createdAt: string;
  updatedAt: string;
}
