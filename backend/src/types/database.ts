// ==============================================================================

// 1. VEHICLE HIERARCHY MODELS (7-TIER HIERARCHY)
// ==============================================================================

export type VehicleType = 'passenger' | 'commercial';

export interface VehicleManufacturerEntity {
  id: string; // e.g. 'tata-cv', 'maruti-suzuki'
  name: string; // e.g. 'Tata', 'Maruti Suzuki'
  category: VehicleType | 'both';
  popularModels: string[];
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleModelEntity {
  id: string; // e.g. 'tata-ace', 'maruti-swift'
  manufacturerId: string; // e.g. 'tata-cv'
  name: string; // e.g. 'Ace', 'Swift'
  years: number[]; // e.g. [2018, 2019, 2020, 2021, 2022, 2023, 2024]
  fuelTypes: string[]; // e.g. ['Diesel', 'Petrol', 'CNG']
  engines: string[]; // e.g. ['700cc', '694cc BS6', '800cc']
  variants: string[]; // e.g. ['Standard', 'High Deck', 'Plus']
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFitmentSpec {
  vehicleType: VehicleType;
  manufacturerId: string;
  manufacturerName: string;
  modelId: string;
  modelName: string;
  year: number;
  fuelType: string;
  engine: string;
  variant: string;
}

export interface VehicleCompatibilityRecord {
  id: string; // e.g. 'compat_tata_ace_2022_diesel_700cc'
  compatibilityKey: string; // normalized lookup token: `${vehicleType}:${mfgId}:${modelId}:${year}:${fuel}:${engine}:${variant}`
  vehicleType: VehicleType;
  manufacturerId: string;
  manufacturerName: string;
  modelId: string;
  modelName: string;
  year: number;
  fuelType: string;
  engine: string;
  variant: string;
  notes?: string;
}

// ==============================================================================
// 2. CATEGORIES & BRANDS MODELS
// ==============================================================================

export interface CategoryEntity {
  id: string; // e.g. 'brake-parts'
  name: string; // e.g. 'Brake Parts'
  slug: string; // e.g. 'brake-parts'
  description: string;
  itemCount: number;
  image: string;
  subcategories: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandEntity {
  id: string; // e.g. 'bosch', 'tata-motors'
  name: string; // e.g. 'Bosch'
  category: VehicleType | 'both';
  origin: string; // e.g. 'Germany', 'India'
  tagline?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 3. ADDRESS ENTITY (REUSABLE FOR CUSTOMERS, SELLERS, MANUFACTURERS)
// ==============================================================================

export type AddressType = 'home' | 'work' | 'garage' | 'warehouse' | 'registered_office';

export interface AddressEntity {
  id: string;
  userId: string; // References UserProfile.uid
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string; // 6-digit Indian PIN code
  country: string; // Default: 'India'
  type: AddressType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 4. BUSINESS & SELLER FOUNDATION PROFILES (PHASE 2 FOUNDATIONAL DATA)
// ==============================================================================

export type SellerTier = 'Manufacturer' | 'Authorized Distributor' | 'Wholesaler' | 'Retailer';

export type BusinessVerificationStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected';

export interface BusinessProfileEntity {
  id: string; // e.g. sellerId or b2bProfileId
  userId: string; // References UserProfile.uid
  businessName: string;
  ownerName: string;
  email: string;
  mobile: string;
  gstin: string; // 15-character Indian GSTIN
  pan: string; // 10-character Indian PAN
  businessAddress: AddressEntity;
  bankAccountRef?: string; // Masked / Reference ID to banking record
  sellerType: SellerTier;
  verificationStatus: BusinessVerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfileEntity {
  uid: string; // References UserProfile.uid
  fullName: string;
  email: string;
  mobile?: string | null;
  savedVehicles: VehicleFitmentSpec[];
  defaultAddressId?: string;
  createdAt: string;
  updatedAt: string;
}
