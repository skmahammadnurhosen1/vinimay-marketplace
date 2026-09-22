import { AddressEntity } from './database.js';

export type ShipmentStatus =
  | 'ordered'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rto'
  | 'DELIVERED'
  | 'SHIPPED'
  | 'IN_TRANSIT';

export type ShippingProviderType =
  | 'shiprocket'
  | 'delhivery'
  | 'bluedart'
  | 'dtdc'
  | 'xpressbees'
  | 'mock_logistics';

export interface TrackingCheckpoint {
  stage: ShipmentStatus;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface PackageDimensions {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface ShipmentEntity {
  id: string; // UUID
  subOrderId: string;
  parentOrderId: string;
  sellerId: string;
  provider: ShippingProviderType;
  providerShipmentId: string;
  awbNumber: string;
  trackingUrl?: string;
  status: ShipmentStatus;
  courierPartner: string;
  shippingCost: number;
  pickupAddress: AddressEntity;
  deliveryAddress: AddressEntity;
  dimensions: PackageDimensions;
  estimatedDelivery: string;
  checkpoints: TrackingCheckpoint[];
  createdAt: string;
  updatedAt: string;
}
