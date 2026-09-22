import {
  CategoryEntity,
  BrandEntity,
  VehicleManufacturerEntity,
  VehicleModelEntity,
  VehicleType,
  VehicleFitmentSpec,
  AddressEntity,
  BusinessProfileEntity,
} from '../../types/database.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

// ==============================================================================
// INITIAL REFERENCE DATA (ALIGNED WITH MARKETPLACE BLUEPRINT)
// ==============================================================================

export const INITIAL_CATEGORIES: CategoryEntity[] = [
  {
    id: 'brake-parts',
    name: 'Brake Parts',
    slug: 'brake-parts',
    description: 'Brake Pads, Discs, Shoes, Drums, Calipers, and Master Cylinders',
    itemCount: 4280,
    image: '/assets/cat_brake.jpg',
    subcategories: ['Brake Pads', 'Brake Discs', 'Brake Shoes', 'Brake Calipers', 'Master Cylinders'],
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'clutch-parts',
    name: 'Clutch Parts',
    slug: 'clutch-parts',
    description: 'Clutch Plates, Pressure Plates, Release Bearings, and Flywheels',
    itemCount: 3140,
    image: '/assets/cat_clutch.jpg',
    subcategories: ['Clutch Plate', 'Pressure Plate', 'Release Bearing', 'Clutch Kit', 'Flywheel'],
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'suspension',
    name: 'Suspension',
    slug: 'suspension',
    description: 'Shock Absorbers, Struts, Coil Springs, Control Arms, and Bushings',
    itemCount: 5620,
    image: '/assets/cat_suspension.jpg',
    subcategories: ['Shock Absorbers', 'Struts', 'Coil Springs', 'Control Arms', 'Tie Rod Ends'],
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gearbox-transmission',
    name: 'Gearbox & Transmission',
    slug: 'gearbox-transmission',
    description: 'Gear Shafts, Synchronizer Rings, Bearings, Shift Cables, and Overhaul Kits',
    itemCount: 2890,
    image: '/assets/cat_gearbox.jpg',
    subcategories: ['Gear Shaft', 'Synchronizer Ring', 'Transmission Bearing', 'Shift Cable'],
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'differential-axle',
    name: 'Differential & Axle',
    slug: 'differential-axle',
    description: 'Crown Wheel & Pinion Sets, Axle Shafts, Universal Joints, and Differential Assemblies',
    itemCount: 1940,
    image: '/assets/cat_differential.jpg',
    subcategories: ['Crown Wheel & Pinion', 'Axle Shaft', 'Universal Joint', 'Carrier Assembly'],
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_BRANDS: BrandEntity[] = [
  { id: 'maruti-suzuki', name: 'Maruti Suzuki', category: 'passenger', origin: 'India', tagline: 'Every Day Journey', logoUrl: '/assets/brand_maruti.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'hyundai', name: 'Hyundai', category: 'passenger', origin: 'South Korea', tagline: 'Beyond Mobility', logoUrl: '/assets/brand_hyundai.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'tata-cv', name: 'Tata Motors', category: 'both', origin: 'India', tagline: 'Connecting Aspirations', logoUrl: '/assets/brand_tata.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mahindra', name: 'Mahindra', category: 'both', origin: 'India', tagline: 'Rise for Good', logoUrl: '/assets/brand_mahindra.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'toyota', name: 'Toyota', category: 'passenger', origin: 'Japan', tagline: 'Quality Revolution', logoUrl: '/assets/brand_toyota.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'kia', name: 'Kia', category: 'passenger', origin: 'South Korea', tagline: 'Movement that Inspires', logoUrl: '/assets/brand_kia.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ashok-leyland', name: 'Ashok Leyland', category: 'commercial', origin: 'India', tagline: 'Aapki Jeet. Hamari Jeet.', logoUrl: '/assets/brand_ashok.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'eicher-motors', name: 'Eicher Motors', category: 'commercial', origin: 'India', tagline: 'Delivering Efficiency', logoUrl: '/assets/brand_eicher.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bharatbenz', name: 'BharatBenz', category: 'commercial', origin: 'Germany / India', tagline: 'Transforming Indian Trucking', logoUrl: '/assets/brand_bharatbenz.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bosch', name: 'Bosch Automotive', category: 'both', origin: 'Germany', tagline: 'Invented for Life', logoUrl: '/assets/brand_bosch.png', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const INITIAL_VEHICLE_MANUFACTURERS: VehicleManufacturerEntity[] = [
  // Commercial
  { id: 'tata-cv', name: 'Tata Commercial', category: 'commercial', popularModels: ['Ace', '407', 'Intra V30', 'Signa'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ashok-leyland', name: 'Ashok Leyland', category: 'commercial', popularModels: ['Dost+', 'Bada Dost', 'Partner'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'eicher-motors', name: 'Eicher', category: 'commercial', popularModels: ['Pro 2049', 'Pro 3015'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bharatbenz', name: 'BharatBenz', category: 'commercial', popularModels: ['1217R', '2823R'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  // Passenger
  { id: 'maruti-suzuki', name: 'Maruti Suzuki', category: 'passenger', popularModels: ['Swift', 'Baleno', 'Brezza', 'Dzire'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mahindra', name: 'Mahindra', category: 'passenger', popularModels: ['Thar', 'Scorpio-N', 'XUV700', 'Bolero'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'hyundai', name: 'Hyundai', category: 'passenger', popularModels: ['Creta', 'Venue', 'i20'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'toyota', name: 'Toyota', category: 'passenger', popularModels: ['Innova Crysta', 'Fortuner'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'kia', name: 'Kia', category: 'passenger', popularModels: ['Seltos', 'Sonet'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const INITIAL_VEHICLE_MODELS: VehicleModelEntity[] = [
  // Commercial Models
  {
    id: 'tata-ace',
    manufacturerId: 'tata-cv',
    name: 'Ace',
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    fuelTypes: ['Diesel', 'Petrol', 'CNG'],
    engines: ['700cc', '694cc BS6', '800cc'],
    variants: ['Standard', 'High Deck', 'Plus'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tata-407',
    manufacturerId: 'tata-cv',
    name: '407',
    years: [2020, 2021, 2022, 2023, 2024],
    fuelTypes: ['Diesel', 'CNG'],
    engines: ['2956cc 4SPCR', '3.8L'],
    variants: ['Standard', 'High Deck'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'al-dost',
    manufacturerId: 'ashok-leyland',
    name: 'Dost+',
    years: [2020, 2021, 2022, 2023, 2024],
    fuelTypes: ['Diesel', 'CNG'],
    engines: ['1.5L Turbo'],
    variants: ['LE', 'LS', 'LX'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'eicher-pro-2049',
    manufacturerId: 'eicher-motors',
    name: 'Pro 2049',
    years: [2021, 2022, 2023, 2024],
    fuelTypes: ['Diesel'],
    engines: ['3.0L Turbo'],
    variants: ['Standard'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Passenger Models
  {
    id: 'maruti-swift',
    manufacturerId: 'maruti-suzuki',
    name: 'Swift',
    years: [2020, 2021, 2022, 2023, 2024],
    fuelTypes: ['Petrol', 'CNG'],
    engines: ['1.2L DualJet'],
    variants: ['LXi', 'VXi', 'ZXi', 'ZXi+'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mahindra-thar',
    manufacturerId: 'mahindra',
    name: 'Thar',
    years: [2021, 2022, 2023, 2024],
    fuelTypes: ['Diesel', 'Petrol'],
    engines: ['2.2L mHawk', '2.0L mStallion'],
    variants: ['AX (Opt)', 'LX Hard Top 4x4 AT'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hyundai-creta',
    manufacturerId: 'hyundai',
    name: 'Creta',
    years: [2021, 2022, 2023, 2024],
    fuelTypes: ['Petrol', 'Diesel'],
    engines: ['1.5L MPi', '1.5L CRDi'],
    variants: ['EX', 'S', 'SX', 'SX(O)'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'toyota-innova',
    manufacturerId: 'toyota',
    name: 'Innova Crysta',
    years: [2021, 2022, 2023, 2024],
    fuelTypes: ['Diesel'],
    engines: ['2.4L Diesel'],
    variants: ['GX', 'VX', 'ZX'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kia-seltos',
    manufacturerId: 'kia',
    name: 'Seltos',
    years: [2022, 2023, 2024],
    fuelTypes: ['Petrol', 'Diesel'],
    engines: ['1.5L Smartstream', '1.5L CRDi'],
    variants: ['HTK', 'HTX', 'GTX+'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ==============================================================================
// IN-MEMORY STORES (DUAL-LAYER ARCHITECTURE)
// ==============================================================================

const inMemoryCategories = new Map<string, CategoryEntity>(
  INITIAL_CATEGORIES.map((c) => [c.id, c])
);
const inMemoryBrands = new Map<string, BrandEntity>(
  INITIAL_BRANDS.map((b) => [b.id, b])
);
const inMemoryManufacturers = new Map<string, VehicleManufacturerEntity>(
  INITIAL_VEHICLE_MANUFACTURERS.map((m) => [m.id, m])
);
const inMemoryModels = new Map<string, VehicleModelEntity>(
  INITIAL_VEHICLE_MODELS.map((m) => [m.id, m])
);
const inMemoryAddresses = new Map<string, AddressEntity>();
const inMemoryBusinessProfiles = new Map<string, BusinessProfileEntity>();

export class DatabaseRepository {
  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  // -------------------------------------------------------------
  // Categories
  // -------------------------------------------------------------
  async getCategories(): Promise<CategoryEntity[]> {
    return Array.from(inMemoryCategories.values())
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryEntity | null> {
    for (const cat of inMemoryCategories.values()) {
      if (cat.slug === slug || cat.id === slug) {
        return cat;
      }
    }
    return null;
  }

  // -------------------------------------------------------------
  // Brands
  // -------------------------------------------------------------
  async getBrands(category?: VehicleType): Promise<BrandEntity[]> {
    return Array.from(inMemoryBrands.values())
      .filter((b) => b.isActive)
      .filter((b) => !category || b.category === category || b.category === 'both');
  }

  async getBrandById(id: string): Promise<BrandEntity | null> {
    return inMemoryBrands.get(id) || null;
  }

  // -------------------------------------------------------------
  // Vehicle Hierarchy (7-Tier Model)
  // -------------------------------------------------------------
  async getVehicleManufacturers(category?: VehicleType): Promise<VehicleManufacturerEntity[]> {
    return Array.from(inMemoryManufacturers.values())
      .filter((m) => m.isActive)
      .filter((m) => !category || m.category === category || m.category === 'both');
  }

  async getVehicleManufacturerById(id: string): Promise<VehicleManufacturerEntity | null> {
    return inMemoryManufacturers.get(id) || null;
  }

  async getModelsByManufacturer(manufacturerId: string): Promise<VehicleModelEntity[]> {
    return Array.from(inMemoryModels.values())
      .filter((m) => m.isActive)
      .filter((m) => m.manufacturerId === manufacturerId);
  }

  async getModelById(modelId: string): Promise<VehicleModelEntity | null> {
    return inMemoryModels.get(modelId) || null;
  }

  /**
   * Validates a complete 7-Tier vehicle fitment specification against the database.
   */
  async validateVehicleFitment(spec: VehicleFitmentSpec): Promise<{ valid: boolean; reason?: string }> {
    // 1. Validate Manufacturer exists and matches type
    const manufacturer = await this.getVehicleManufacturerById(spec.manufacturerId);
    if (!manufacturer) {
      return { valid: false, reason: `Manufacturer "${spec.manufacturerId}" does not exist.` };
    }
    if (manufacturer.category !== 'both' && manufacturer.category !== spec.vehicleType) {
      return {
        valid: false,
        reason: `Manufacturer "${manufacturer.name}" is a ${manufacturer.category} brand, not ${spec.vehicleType}.`,
      };
    }

    // 2. Validate Model exists and belongs to Manufacturer
    const model = await this.getModelById(spec.modelId);
    if (!model) {
      return { valid: false, reason: `Model "${spec.modelId}" does not exist.` };
    }
    if (model.manufacturerId !== spec.manufacturerId) {
      return {
        valid: false,
        reason: `Model "${model.name}" belongs to manufacturer "${model.manufacturerId}", not "${spec.manufacturerId}".`,
      };
    }

    // 3. Validate Year
    if (!model.years.includes(spec.year)) {
      return {
        valid: false,
        reason: `Year "${spec.year}" is not supported for ${model.name}. Supported: [${model.years.join(', ')}]`,
      };
    }

    // 4. Validate Fuel Type
    if (!model.fuelTypes.includes(spec.fuelType)) {
      return {
        valid: false,
        reason: `Fuel type "${spec.fuelType}" not valid for ${model.name}. Supported: [${model.fuelTypes.join(', ')}]`,
      };
    }

    // 5. Validate Engine
    if (!model.engines.includes(spec.engine)) {
      return {
        valid: false,
        reason: `Engine "${spec.engine}" not valid for ${model.name}. Supported: [${model.engines.join(', ')}]`,
      };
    }

    // 6. Validate Variant
    if (!model.variants.includes(spec.variant)) {
      return {
        valid: false,
        reason: `Variant "${spec.variant}" not valid for ${model.name}. Supported: [${model.variants.join(', ')}]`,
      };
    }

    return { valid: true };
  }

  /**
   * Generates a normalized indexed compatibility token for multi-vehicle search.
   * e.g. "commercial:tata-cv:tata-ace:2022:diesel:700cc:standard"
   */
  generateCompatibilityToken(spec: VehicleFitmentSpec): string {
    const sanitize = (str: string | number) =>
      String(str).toLowerCase().trim().replace(/[\s/]+/g, '-');

    return [
      sanitize(spec.vehicleType),
      sanitize(spec.manufacturerId),
      sanitize(spec.modelId),
      sanitize(spec.year),
      sanitize(spec.fuelType),
      sanitize(spec.engine),
      sanitize(spec.variant),
    ].join(':');
  }

  // -------------------------------------------------------------
  // Addresses (Customer / Seller / Manufacturer)
  // -------------------------------------------------------------
  async getAddressesByUser(userId: string): Promise<AddressEntity[]> {
    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection('users')
          .doc(userId)
          .collection('addresses')
          .orderBy('isDefault', 'desc')
          .get();

        return snapshot.docs.map((doc) => doc.data() as AddressEntity);
      } catch (error) {
        logger.warn('Firestore getAddressesByUser fallback to in-memory:', { userId, error });
      }
    }

    return Array.from(inMemoryAddresses.values())
      .filter((addr) => addr.userId === userId)
      .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  }

  async getAddressById(addressId: string, userId: string): Promise<AddressEntity | null> {
    const address = inMemoryAddresses.get(addressId);
    if (!address || address.userId !== userId) {
      return null;
    }
    return address;
  }

  async createAddress(address: AddressEntity): Promise<AddressEntity> {
    // If this address is set to default, unset other defaults for this user
    if (address.isDefault) {
      for (const existing of inMemoryAddresses.values()) {
        if (existing.userId === address.userId && existing.isDefault) {
          existing.isDefault = false;
        }
      }
    }

    inMemoryAddresses.set(address.id, address);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db
          .collection('users')
          .doc(address.userId)
          .collection('addresses')
          .doc(address.id)
          .set(address);
      } catch (error) {
        logger.error('Failed to write address to Firestore:', { error });
      }
    }

    return address;
  }

  async deleteAddress(addressId: string, userId: string): Promise<boolean> {
    const existing = inMemoryAddresses.get(addressId);
    if (!existing || existing.userId !== userId) {
      return false;
    }

    inMemoryAddresses.delete(addressId);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db
          .collection('users')
          .doc(userId)
          .collection('addresses')
          .doc(addressId)
          .delete();
      } catch (error) {
        logger.error('Failed to delete address from Firestore:', { error });
      }
    }

    return true;
  }

  // -------------------------------------------------------------
  // Business Profiles
  // -------------------------------------------------------------
  async getBusinessProfileByUserId(userId: string): Promise<BusinessProfileEntity | null> {
    for (const profile of inMemoryBusinessProfiles.values()) {
      if (profile.userId === userId) {
        return profile;
      }
    }
    return null;
  }

  async createBusinessProfile(profile: BusinessProfileEntity): Promise<BusinessProfileEntity> {
    inMemoryBusinessProfiles.set(profile.id, profile);
    return profile;
  }

  _clearMemory(): void {
    inMemoryAddresses.clear();
    inMemoryBusinessProfiles.clear();
  }
}

export const databaseRepository = new DatabaseRepository();
