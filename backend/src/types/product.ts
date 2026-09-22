import { VehicleFitmentSpec } from './database.js';

export type ProductAuthenticityType = 'Genuine' | 'OEM' | 'Aftermarket';

export type ProductStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAUSED'
  | 'OUT_OF_STOCK'
  | 'ARCHIVED';

export type InitialProductCategory =
  | 'Brake'
  | 'Clutch'
  | 'Suspension'
  | 'Gearbox / Transmission'
  | 'Differential / Axle';

export interface ProductImageMetadata {
  id: string;
  url: string;
  storagePath: string;
  isPrimary: boolean;
  displayOrder: number;
  altText?: string;
}

export interface DeliveryPlaceholder {
  weightKg?: number;
  dimensionsCm?: {
    length: number;
    width: number;
    height: number;
  };
  estimatedDispatchDays?: number;
}

export interface ProductEntity {
  id: string;
  sellerId: string;
  productName: string;
  brand: string;
  manufacturer: string;
  partNumber: string;
  oemNumber: string;
  category: string;
  subCategory: string;
  productType: ProductAuthenticityType;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  compatibleVehicles: VehicleFitmentSpec[];
  compatibilityTokens: string[];
  price: number;
  mrp: number;
  discount: number;
  gstRate: number; // 5, 12, 18, 28
  warranty: string;
  returnPolicy: string;
  warrantyPolicy?: string;
  installationInfo?: string;
  delivery?: DeliveryPlaceholder;
  images: ProductImageMetadata[];
  status: ProductStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterQuery {
  category?: string;
  brand?: string;
  sellerId?: string;
  status?: ProductStatus;
  productType?: ProductAuthenticityType;
  minPrice?: number;
  maxPrice?: number;
  vehicleType?: string;
  manufacturerId?: string;
  modelId?: string;
  year?: number;
  fuelType?: string;
  engine?: string;
  variant?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
