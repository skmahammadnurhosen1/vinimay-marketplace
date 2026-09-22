import {
  ProductEntity,
  ProductFilterQuery,
  ProductStatus,
} from '../../types/product.js';
import { VehicleFitmentSpec } from '../../types/database.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IProductRepository {
  findById(id: string): Promise<ProductEntity | null>;
  findBySeller(
    sellerId: string,
    filter?: { status?: ProductStatus; category?: string; search?: string; limit?: number; offset?: number }
  ): Promise<{ products: ProductEntity[]; total: number }>;
  findPublicCatalog(filter?: ProductFilterQuery): Promise<{ products: ProductEntity[]; total: number }>;
  create(product: ProductEntity): Promise<ProductEntity>;
  update(id: string, updates: Partial<ProductEntity>): Promise<ProductEntity | null>;
  delete(id: string): Promise<boolean>;
  checkFitment(
    productId: string,
    spec: VehicleFitmentSpec
  ): Promise<{ compatible: boolean; matchedSpecification?: VehicleFitmentSpec; reason?: string }>;
  findAll(): Promise<ProductEntity[]>;
  resetInMemory?(): void;
}

// In-Memory Product Store
const inMemoryProducts = new Map<string, ProductEntity>();

export function generateCompatibilityToken(spec: VehicleFitmentSpec): string {
  const norm = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  return `${norm(spec.vehicleType)}:${norm(spec.manufacturerId)}:${norm(spec.modelId)}:${spec.year}:${norm(spec.fuelType)}:${norm(spec.engine)}:${norm(spec.variant)}`;
}

// Seed Initial Products
export function seedDefaultProducts(): void {
  inMemoryProducts.clear();

  const mockProducts: ProductEntity[] = [
    {
      id: 'prod_bosch_brake_pad_tata_ace',
      sellerId: 'seller_apex_auto_parts',
      productName: 'Bosch Front Ceramic Brake Pad Set',
      brand: 'Bosch',
      manufacturer: 'Bosch Automotive India Ltd',
      partNumber: 'BP-TATA-ACE-01',
      oemNumber: '2824 4210 0118',
      category: 'Brake',
      subCategory: 'Brake Pads',
      productType: 'OEM',
      description: 'High performance OE-grade ceramic front brake pads for Tata Ace commercial mini-trucks. Low dust, thermal stability up to 650°C.',
      features: ['Anti-squeal shims included', 'OE formulation compound', 'High heat dissipation'],
      specifications: {
        'Position': 'Front Axle',
        'Material': 'Ceramic Composite',
        'Thickness': '15.5 mm',
        'Warranty': '12 Months / 20,000 km',
      },
      compatibleVehicles: [
        {
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2022,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        },
        {
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2021,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        },
        {
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2020,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        },
      ],
      compatibilityTokens: [
        generateCompatibilityToken({
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2022,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        }),
        generateCompatibilityToken({
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2021,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        }),
        generateCompatibilityToken({
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2020,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        }),
      ],
      price: 1250,
      mrp: 1650,
      discount: 24.24,
      gstRate: 18,
      warranty: '12 Months / 20,000 km',
      returnPolicy: '10 Days Returnable if unused in original packaging',
      warrantyPolicy: 'Covers premature friction separation or manufacturing defects',
      installationInfo: 'Professional workshop installation recommended. Clean caliper slides prior to mounting.',
      delivery: {
        weightKg: 1.4,
        dimensionsCm: { length: 15, width: 10, height: 6 },
        estimatedDispatchDays: 1,
      },
      images: [
        {
          id: 'img_bp_01',
          url: '/assets/cat_brakes.jpg',
          storagePath: 'products/seller_apex_auto_parts/prod_bosch_brake_pad_tata_ace/img_bp_01.jpg',
          isPrimary: true,
          displayOrder: 0,
          altText: 'Bosch Front Ceramic Brake Pad Set',
        },
      ],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin_sys_01',
      reviewedAt: '2026-01-05T11:00:00.000Z',
      createdAt: '2026-01-04T10:00:00.000Z',
      updatedAt: '2026-01-05T11:00:00.000Z',
    },
    {
      id: 'prod_valeo_clutch_kit_swift',
      sellerId: 'seller_apex_auto_parts',
      productName: 'Valeo Tri-Pack Heavy Duty Clutch Kit',
      brand: 'Valeo',
      manufacturer: 'Valeo India Pvt Ltd',
      partNumber: 'CK-VAL-MS-04',
      oemNumber: '22100M74LA0',
      category: 'Clutch',
      subCategory: 'Clutch Sets',
      productType: 'Genuine',
      description: 'Complete 3-piece clutch kit consisting of pressure plate, clutch disc, and release bearing. Smooth engagement and extended lifespan.',
      features: ['Includes release bearing', 'Balanced pressure plate', 'Organic friction lining'],
      specifications: {
        'Clutch Diameter': '190 mm',
        'Spline Count': '18 Teeth',
        'Operation': 'Hydraulic / Cable',
      },
      compatibleVehicles: [
        {
          vehicleType: 'passenger',
          manufacturerId: 'maruti-suzuki',
          manufacturerName: 'Maruti Suzuki',
          modelId: 'maruti-swift',
          modelName: 'Swift',
          year: 2022,
          fuelType: 'Petrol',
          engine: '1.2L K12M',
          variant: 'VXI',
        },
        {
          vehicleType: 'passenger',
          manufacturerId: 'maruti-suzuki',
          manufacturerName: 'Maruti Suzuki',
          modelId: 'maruti-swift',
          modelName: 'Swift',
          year: 2021,
          fuelType: 'Petrol',
          engine: '1.2L K12M',
          variant: 'ZXI',
        },
      ],
      compatibilityTokens: [
        generateCompatibilityToken({
          vehicleType: 'passenger',
          manufacturerId: 'maruti-suzuki',
          manufacturerName: 'Maruti Suzuki',
          modelId: 'maruti-swift',
          modelName: 'Swift',
          year: 2022,
          fuelType: 'Petrol',
          engine: '1.2L K12M',
          variant: 'VXI',
        }),
        generateCompatibilityToken({
          vehicleType: 'passenger',
          manufacturerId: 'maruti-suzuki',
          manufacturerName: 'Maruti Suzuki',
          modelId: 'maruti-swift',
          modelName: 'Swift',
          year: 2021,
          fuelType: 'Petrol',
          engine: '1.2L K12M',
          variant: 'ZXI',
        }),
      ],
      price: 3499,
      mrp: 4400,
      discount: 20.48,
      gstRate: 28,
      warranty: '6 Months / 10,000 km',
      returnPolicy: '7 Days Returnable',
      images: [
        {
          id: 'img_ck_01',
          url: '/assets/cat_engine.jpg',
          storagePath: 'products/seller_apex_auto_parts/prod_valeo_clutch_kit_swift/img_ck_01.jpg',
          isPrimary: true,
          displayOrder: 0,
          altText: 'Valeo Clutch Kit for Maruti Swift',
        },
      ],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin_sys_01',
      reviewedAt: '2026-01-06T10:00:00.000Z',
      createdAt: '2026-01-05T09:00:00.000Z',
      updatedAt: '2026-01-06T10:00:00.000Z',
    },
    {
      id: 'prod_gabriel_suspension_strut',
      sellerId: 'seller_apex_auto_parts',
      productName: 'Gabriel Gas-Charged Front Suspension Strut',
      brand: 'Gabriel',
      manufacturer: 'Gabriel India Ltd',
      partNumber: 'GAB-STR-SWF-F',
      oemNumber: '41601M74L00',
      category: 'Suspension',
      subCategory: 'Shock Absorbers & Struts',
      productType: 'OEM',
      description: 'Nitrogen gas-pressurized front suspension strut assembly for superior ride stability and road vibration damping.',
      features: ['Twin-tube gas charged design', 'Hard chromed piston rod', 'Multi-lip oil seal'],
      specifications: {
        'Side': 'Front Right / Left',
        'Type': 'Telescopic Gas Strut',
      },
      compatibleVehicles: [
        {
          vehicleType: 'passenger',
          manufacturerId: 'maruti-suzuki',
          manufacturerName: 'Maruti Suzuki',
          modelId: 'maruti-swift',
          modelName: 'Swift',
          year: 2022,
          fuelType: 'Petrol',
          engine: '1.2L K12M',
          variant: 'VXI',
        },
      ],
      compatibilityTokens: [
        generateCompatibilityToken({
          vehicleType: 'passenger',
          manufacturerId: 'maruti-suzuki',
          manufacturerName: 'Maruti Suzuki',
          modelId: 'maruti-swift',
          modelName: 'Swift',
          year: 2022,
          fuelType: 'Petrol',
          engine: '1.2L K12M',
          variant: 'VXI',
        }),
      ],
      price: 2199,
      mrp: 2750,
      discount: 20.04,
      gstRate: 18,
      warranty: '12 Months / 20,000 km',
      returnPolicy: '10 Days Returnable',
      images: [
        {
          id: 'img_strut_01',
          url: '/assets/cat_body.jpg',
          storagePath: 'products/seller_apex_auto_parts/prod_gabriel_suspension_strut/img_strut_01.jpg',
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin_sys_01',
      reviewedAt: '2026-01-07T10:00:00.000Z',
      createdAt: '2026-01-06T14:00:00.000Z',
      updatedAt: '2026-01-07T10:00:00.000Z',
    },
    {
      id: 'prod_gearbox_synchro_tata_ace',
      sellerId: 'seller_apex_auto_parts',
      productName: 'Tata Motors Genuine 1st/2nd Gear Synchronizer Ring Set',
      brand: 'Tata Motors Genuine',
      manufacturer: 'Tata Motors Ltd',
      partNumber: 'SYN-TATA-ACE-12',
      oemNumber: '2824 2610 0105',
      category: 'Gearbox / Transmission',
      subCategory: 'Synchronizer Rings',
      productType: 'Genuine',
      description: 'Original equipment brass synchronizer ring set for smooth manual gear shifting in 5-speed Tata Ace gearboxes.',
      features: ['High wear-resistant brass alloy', 'Precision machined teeth', 'Factory OEM tolerances'],
      specifications: {
        'Material': 'Moly-coated Brass',
        'Gears': '1st and 2nd Speed',
      },
      compatibleVehicles: [
        {
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2022,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        },
      ],
      compatibilityTokens: [
        generateCompatibilityToken({
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2022,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        }),
      ],
      price: 1850,
      mrp: 2100,
      discount: 11.9,
      gstRate: 28,
      warranty: '6 Months OEM Warranty',
      returnPolicy: 'Non-returnable once seal opened',
      images: [
        {
          id: 'img_gear_01',
          url: '/assets/cat_tools.jpg',
          storagePath: 'products/seller_apex_auto_parts/prod_gearbox_synchro_tata_ace/img_gear_01.jpg',
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin_sys_01',
      reviewedAt: '2026-01-08T10:00:00.000Z',
      createdAt: '2026-01-07T16:00:00.000Z',
      updatedAt: '2026-01-08T10:00:00.000Z',
    },
    {
      id: 'prod_dana_diff_crown_pinion',
      sellerId: 'seller_apex_auto_parts',
      productName: 'Dana Spicer Rear Axle Differential Crown Wheel & Pinion (9x41 Ratio)',
      brand: 'Dana Spicer',
      manufacturer: 'Dana India Pvt Ltd',
      partNumber: 'DIFF-DS-BOL-941',
      oemNumber: '0303BA0111N',
      category: 'Differential / Axle',
      subCategory: 'Crown Wheel & Pinion',
      productType: 'OEM',
      description: 'Heavy duty forged steel crown wheel and pinion gear set for rear drive axles.',
      features: ['Heat treated hypoid gearing', 'Matched set factory lapped', 'High shock load resistance'],
      specifications: {
        'Gear Ratio': '9:41 (4.55)',
        'Ring Gear Diameter': '215 mm',
      },
      compatibleVehicles: [
        {
          vehicleType: 'commercial',
          manufacturerId: 'mahindra',
          manufacturerName: 'Mahindra',
          modelId: 'mahindra-bolero-maxitruck',
          modelName: 'Bolero Maxi Truck Plus',
          year: 2022,
          fuelType: 'Diesel',
          engine: 'm2DiCR',
          variant: 'Standard',
        },
      ],
      compatibilityTokens: [
        generateCompatibilityToken({
          vehicleType: 'commercial',
          manufacturerId: 'mahindra',
          manufacturerName: 'Mahindra',
          modelId: 'mahindra-bolero-maxitruck',
          modelName: 'Bolero Maxi Truck Plus',
          year: 2022,
          fuelType: 'Diesel',
          engine: 'm2DiCR',
          variant: 'Standard',
        }),
      ],
      price: 8900,
      mrp: 10500,
      discount: 15.24,
      gstRate: 28,
      warranty: '12 Months / 50,000 km',
      returnPolicy: '7 Days Returnable',
      images: [
        {
          id: 'img_diff_01',
          url: '/assets/cat_electrical.jpg',
          storagePath: 'products/seller_apex_auto_parts/prod_dana_diff_crown_pinion/img_diff_01.jpg',
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin_sys_01',
      reviewedAt: '2026-01-09T10:00:00.000Z',
      createdAt: '2026-01-08T11:00:00.000Z',
      updatedAt: '2026-01-09T10:00:00.000Z',
    },
  ];

  for (const p of mockProducts) {
    inMemoryProducts.set(p.id, p);
  }
}

seedDefaultProducts();

export class ProductRepository implements IProductRepository {
  private collectionName = 'products';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async findById(id: string): Promise<ProductEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryProducts.get(id) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as ProductEntity;
    } catch (error) {
      logger.warn('Firestore findById product fallback to in-memory:', { id, error });
      return inMemoryProducts.get(id) || null;
    }
  }

  async findBySeller(
    sellerId: string,
    filter?: { status?: ProductStatus; category?: string; search?: string; limit?: number; offset?: number }
  ): Promise<{ products: ProductEntity[]; total: number }> {
    let items = Array.from(inMemoryProducts.values()).filter((p) => p.sellerId === sellerId);

    if (filter?.status) {
      items = items.filter((p) => p.status === filter.status);
    }
    if (filter?.category) {
      items = items.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q) ||
          p.oemNumber.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    const total = items.length;
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 50;
    const paginated = items.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  async findPublicCatalog(
    filter?: ProductFilterQuery
  ): Promise<{ products: ProductEntity[]; total: number }> {
    let items = Array.from(inMemoryProducts.values()).filter((p) => p.status === 'APPROVED');

    if (filter?.category) {
      items = items.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.brand) {
      items = items.filter((p) => p.brand.toLowerCase() === filter.brand!.toLowerCase());
    }
    if (filter?.productType) {
      items = items.filter((p) => p.productType === filter.productType);
    }
    if (filter?.minPrice !== undefined) {
      items = items.filter((p) => p.price >= filter.minPrice!);
    }
    if (filter?.maxPrice !== undefined) {
      items = items.filter((p) => p.price <= filter.maxPrice!);
    }

    // Vehicle Fitment compatibility search
    if (filter?.vehicleType && filter?.manufacturerId && filter?.modelId && filter?.year) {
      const token = `${filter.vehicleType.toLowerCase()}:${filter.manufacturerId.toLowerCase()}:${filter.modelId.toLowerCase()}:${filter.year}:${filter.fuelType ? filter.fuelType.toLowerCase() : ''}`;
      items = items.filter((p) =>
        p.compatibilityTokens.some(
          (t) =>
            t.startsWith(token.replace(/:$/, '')) ||
            t.startsWith('all:universal:universal') ||
            t === 'universal'
        )
      );
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q) ||
          p.oemNumber.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    const total = items.length;
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 20;
    const paginated = items.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    inMemoryProducts.set(product.id, { ...product });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(product.id).set(product);
      } catch (error) {
        logger.error('Failed to create product in Firestore:', { id: product.id, error });
      }
    }

    return product;
  }

  async update(id: string, updates: Partial<ProductEntity>): Promise<ProductEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: ProductEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemoryProducts.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(id).update({
          ...updates,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update product in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;

    // Archive instead of hard delete to maintain order references
    await this.update(id, { status: 'ARCHIVED' });
    return true;
  }

  async checkFitment(
    productId: string,
    spec: VehicleFitmentSpec
  ): Promise<{ compatible: boolean; matchedSpecification?: VehicleFitmentSpec; reason?: string }> {
    const product = await this.findById(productId);
    if (!product) {
      return { compatible: false, reason: 'Product not found' };
    }

    if (
      product.compatibilityTokens.some(
        (t) => t.startsWith('all:universal:universal') || t === 'universal'
      )
    ) {
      return {
        compatible: true,
        reason: 'Universal fitment part compatible with all vehicle models and configurations.',
      };
    }

    const token = generateCompatibilityToken(spec);
    const tokenMatched = product.compatibilityTokens.includes(token);

    if (tokenMatched) {
      const match = product.compatibleVehicles.find(
        (v) => generateCompatibilityToken(v) === token
      );
      return { compatible: true, matchedSpecification: match || spec };
    }

    // Check partial match (same model & year, but check if engine/variant matches)
    const modelMatch = product.compatibleVehicles.find(
      (v) =>
        v.manufacturerId === spec.manufacturerId &&
        v.modelId === spec.modelId &&
        v.year === spec.year
    );

    if (modelMatch) {
      return {
        compatible: false,
        reason: `Compatible with ${modelMatch.modelName} ${modelMatch.year} ${modelMatch.engine} ${modelMatch.variant}, but not your specific configuration (${spec.engine} ${spec.variant}).`,
      };
    }

    return {
      compatible: false,
      reason: `This part is not compatible with ${spec.manufacturerName} ${spec.modelName} (${spec.year}).`,
    };
  }

  async findAll(): Promise<ProductEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemoryProducts.values());
    }

    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.collectionName).get();
      return snapshot.docs.map((doc) => doc.data() as ProductEntity);
    } catch (error) {
      logger.warn('Firestore findAll fallback to in-memory:', { error });
      return Array.from(inMemoryProducts.values());
    }
  }

  resetInMemory(): void {
    seedDefaultProducts();
  }
}

export const productRepository = new ProductRepository();
