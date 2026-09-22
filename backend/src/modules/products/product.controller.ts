import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { productRepository, generateCompatibilityToken } from './product.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import {
  createProductSchema,
  updateProductSchema,
} from './product.validation.js';
import { vehicleFitmentSpecSchema } from '../database/database.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { ProductEntity } from '../../types/product.js';
import { InventoryItemEntity } from '../../types/inventory.js';
import { productVerificationRepository } from './verification.repository.js';

// ==============================================================================
// SELLER PRODUCT MANAGEMENT (AUTHENTICATED & TENANT ISOLATED)
// ==============================================================================

export async function createSellerProduct(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(
      res,
      'Only registered sellers can create products. Please complete seller registration.',
      403,
      'SELLER_PROFILE_REQUIRED'
    );
    return;
  }

  const parseResult = createProductSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const input = parseResult.data;
  const now = new Date().toISOString();
  const productId = `prod_${randomUUID()}`;

  // Calculate discount percentage
  const discount = input.mrp > input.price
    ? Math.round(((input.mrp - input.price) / input.mrp) * 10000) / 100
    : 0;

  // Generate compatibility tokens for fast index lookups
  const compatibilityTokens = input.compatibleVehicles.map((v) => generateCompatibilityToken(v));

  // Determine initial status
  let status: ProductEntity['status'] = 'DRAFT';
  if (input.submitForReview) {
    status = 'PENDING_REVIEW';
  }

  // Authenticity & brand authorization check
  const brandSlug = input.brand.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const isAuthorized = seller.authorizedBrands.some((b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-') === brandSlug);

  if ((input.productType === 'Genuine' || input.productType === 'OEM') && !isAuthorized && seller.kycStatus !== 'APPROVED') {
    // If declaring Genuine/OEM without verified authorization, must enter review state
    status = 'PENDING_REVIEW';
  }

  const product: ProductEntity = {
    id: productId,
    sellerId: seller.id,
    productName: input.productName,
    brand: input.brand,
    manufacturer: input.manufacturer,
    partNumber: input.partNumber,
    oemNumber: input.oemNumber || '',
    category: input.category,
    subCategory: input.subCategory,
    productType: input.productType,
    description: input.description,
    features: input.features || [],
    specifications: input.specifications || {},
    compatibleVehicles: input.compatibleVehicles,
    compatibilityTokens,
    price: input.price,
    mrp: input.mrp,
    discount,
    gstRate: input.gstRate,
    warranty: input.warranty,
    returnPolicy: input.returnPolicy,
    warrantyPolicy: input.warrantyPolicy,
    installationInfo: input.installationInfo,
    delivery: input.delivery,
    images: input.images,
    status,
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const createdProduct = await productRepository.create(product);

  // Initialize corresponding inventory
  const initialStock = input.initialStock || 0;
  const lowThreshold = input.lowStockThreshold || 5;
  const sku = input.sku || `SKU-${input.partNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;

  const invItem: InventoryItemEntity = {
    id: productId,
    productId,
    sellerId: seller.id,
    currentStock: initialStock,
    reservedStock: 0,
    availableStock: initialStock,
    lowStockThreshold: lowThreshold,
    sku,
    status: initialStock === 0 ? 'OUT_OF_STOCK' : initialStock <= lowThreshold ? 'LOW_STOCK' : 'IN_STOCK',
    lastRestockedAt: now,
    updatedAt: now,
  };

  const createdInventory = await inventoryRepository.create(invItem);

  if (initialStock > 0) {
    // Record initial restock in audit ledger
    await inventoryRepository.adjustStock({
      productId,
      sellerId: seller.id,
      delta: initialStock,
      type: 'RESTOCK',
      reason: 'Initial inventory creation',
      referenceId: productId,
      performedBy: req.user.uid,
    });
  }

  sendSuccess(
    res,
    { product: createdProduct, inventory: createdInventory },
    201
  );
}

export async function getSellerProducts(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const { status, category, search, limit, offset } = req.query;

  const result = await productRepository.findBySeller(seller.id, {
    status: status as ProductEntity['status'],
    category: category as string,
    search: search as string,
    limit: limit ? parseInt(limit as string, 10) : 50,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  sendSuccess(res, result);
}

export async function getSellerProductById(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const product = await productRepository.findById(id);
  if (!product) {
    sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return;
  }

  // Cross-seller isolation check
  if (product.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'You do not have permission to view or manage this product', 403, 'FORBIDDEN');
    return;
  }

  const inventory = await inventoryRepository.findByProductId(id);
  sendSuccess(res, { product, inventory });
}

export async function updateSellerProduct(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const product = await productRepository.findById(id);
  if (!product) {
    sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return;
  }

  // Cross-seller isolation check
  if (product.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'You do not have permission to modify this product', 403, 'FORBIDDEN');
    return;
  }

  const parseResult = updateProductSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const input = parseResult.data;
  const updates: Partial<ProductEntity> = {};

  if (input.productName) updates.productName = input.productName;
  if (input.brand) updates.brand = input.brand;
  if (input.manufacturer) updates.manufacturer = input.manufacturer;
  if (input.partNumber) updates.partNumber = input.partNumber;
  if (input.oemNumber !== undefined) updates.oemNumber = input.oemNumber;
  if (input.category) updates.category = input.category;
  if (input.subCategory) updates.subCategory = input.subCategory;
  if (input.productType) updates.productType = input.productType;
  if (input.description) updates.description = input.description;
  if (input.features) updates.features = input.features;
  if (input.specifications) updates.specifications = input.specifications;
  if (input.warranty) updates.warranty = input.warranty;
  if (input.returnPolicy) updates.returnPolicy = input.returnPolicy;
  if (input.warrantyPolicy) updates.warrantyPolicy = input.warrantyPolicy;
  if (input.installationInfo) updates.installationInfo = input.installationInfo;
  if (input.delivery) updates.delivery = input.delivery;
  if (input.images) updates.images = input.images;
  if (input.gstRate !== undefined) updates.gstRate = input.gstRate;

  // Price & MRP recalculation
  const effectivePrice = input.price !== undefined ? input.price : product.price;
  const effectiveMrp = input.mrp !== undefined ? input.mrp : product.mrp;
  if (input.price !== undefined) updates.price = input.price;
  if (input.mrp !== undefined) updates.mrp = input.mrp;
  if (input.price !== undefined || input.mrp !== undefined) {
    updates.discount = effectiveMrp > effectivePrice
      ? Math.round(((effectiveMrp - effectivePrice) / effectiveMrp) * 10000) / 100
      : 0;
  }

  // Compatibility recalculation
  if (input.compatibleVehicles) {
    updates.compatibleVehicles = input.compatibleVehicles;
    updates.compatibilityTokens = input.compatibleVehicles.map((v) => generateCompatibilityToken(v));
  }

  // Submission for review
  if (input.submitForReview) {
    if (product.status === 'DRAFT' || product.status === 'REJECTED') {
      updates.status = 'PENDING_REVIEW';
    }
  }

  const updated = await productRepository.update(id, updates);
  sendSuccess(res, { product: updated });
}

export async function deleteSellerProduct(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const product = await productRepository.findById(id);
  if (!product) {
    sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return;
  }

  // Cross-seller isolation check
  if (product.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'You do not have permission to delete this product', 403, 'FORBIDDEN');
    return;
  }

  await productRepository.delete(id);
  sendSuccess(res, { id, status: 'ARCHIVED' });
}

export async function toggleProductStatus(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const product = await productRepository.findById(id);
  if (!product) {
    sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return;
  }

  if (product.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized', 403, 'FORBIDDEN');
    return;
  }

  if (product.status !== 'APPROVED' && product.status !== 'PAUSED') {
    sendError(res, 'Only APPROVED products can be paused or resumed', 400, 'INVALID_STATUS_TRANSITION');
    return;
  }

  const nextStatus = product.status === 'APPROVED' ? 'PAUSED' : 'APPROVED';
  const updated = await productRepository.update(id, { status: nextStatus });

  sendSuccess(res, { product: updated });
}

// ==============================================================================
// PUBLIC CATALOG & VEHICLE FITMENT CHECK (NO AUTH REQUIRED)
// ==============================================================================

export async function getPublicCatalog(req: Request, res: Response): Promise<void> {
  const {
    category,
    brand,
    productType,
    minPrice,
    maxPrice,
    vehicleType,
    manufacturerId,
    modelId,
    year,
    fuelType,
    engine,
    variant,
    search,
    limit,
    offset,
  } = req.query;

  const result = await productRepository.findPublicCatalog({
    category: category as string,
    brand: brand as string,
    productType: productType as ProductEntity['productType'],
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    vehicleType: vehicleType as string,
    manufacturerId: manufacturerId as string,
    modelId: modelId as string,
    year: year ? parseInt(year as string, 10) : undefined,
    fuelType: fuelType as string,
    engine: engine as string,
    variant: variant as string,
    search: search as string,
    limit: limit ? parseInt(limit as string, 10) : 20,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  // Enrich with public seller cards
  const enrichedProducts = await Promise.all(
    result.products.map(async (p) => {
      const seller = await sellerRepository.findById(p.sellerId);
      const inventory = await inventoryRepository.findByProductId(p.id);
      return {
        ...p,
        seller: seller
          ? {
              id: seller.id,
              name: seller.businessName,
              tier: seller.sellerType,
              city: seller.businessAddress.city,
              state: seller.businessAddress.state,
              rating: seller.rating,
              reviewCount: seller.reviewCount,
              verified: seller.kycStatus === 'APPROVED',
            }
          : {
              id: p.sellerId,
              name: 'Verified Marketplace Merchant',
              tier: 'Authorized Distributor',
              city: 'Mumbai',
              state: 'Maharashtra',
              rating: 4.8,
              reviewCount: 150,
              verified: true,
            },
        stockAvailability: inventory
          ? {
              currentStock: inventory.currentStock,
              availableStock: inventory.availableStock,
              status: inventory.status,
              inStock: inventory.availableStock > 0,
            }
          : { currentStock: 0, availableStock: 0, status: 'OUT_OF_STOCK', inStock: false },
      };
    })
  );

  sendSuccess(res, { products: enrichedProducts, total: result.total });
}

export async function searchProducts(req: Request, res: Response): Promise<void> {
  const query = (req.query.q as string) || (req.query.search as string) || '';
  const { category, brand, limit, offset } = req.query;

  const result = await productRepository.findPublicCatalog({
    search: query,
    category: category as string,
    brand: brand as string,
    limit: limit ? parseInt(limit as string, 10) : 30,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  const enriched = await Promise.all(
    result.products.map(async (p) => {
      const seller = await sellerRepository.findById(p.sellerId);
      const inventory = await inventoryRepository.findByProductId(p.id);
      return {
        ...p,
        seller: seller
          ? {
              id: seller.id,
              name: seller.businessName,
              tier: seller.sellerType,
              city: seller.businessAddress.city,
              state: seller.businessAddress.state,
              rating: seller.rating,
              reviewCount: seller.reviewCount,
              verified: seller.kycStatus === 'APPROVED',
            }
          : null,
        inStock: inventory ? inventory.availableStock > 0 : false,
      };
    })
  );

  sendSuccess(res, { query, products: enriched, total: result.total });
}

export async function getCompatibleProducts(req: Request, res: Response): Promise<void> {
  const {
    vehicleType,
    manufacturerId,
    modelId,
    year,
    fuelType,
    engine,
    variant,
    category,
    limit,
    offset,
  } = req.query;

  if (!vehicleType || !manufacturerId || !modelId || !year) {
    sendError(
      res,
      'Vehicle parameters (vehicleType, manufacturerId, modelId, year) are required for compatibility discovery',
      400,
      'MISSING_VEHICLE_PARAMS'
    );
    return;
  }

  const result = await productRepository.findPublicCatalog({
    vehicleType: vehicleType as string,
    manufacturerId: manufacturerId as string,
    modelId: modelId as string,
    year: parseInt(year as string, 10),
    fuelType: fuelType as string,
    engine: engine as string,
    variant: variant as string,
    category: category as string,
    limit: limit ? parseInt(limit as string, 10) : 50,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  sendSuccess(res, {
    vehicleContext: {
      vehicleType,
      manufacturerId,
      modelId,
      year: parseInt(year as string, 10),
      fuelType,
      engine,
      variant,
    },
    products: result.products,
    total: result.total,
  });
}

export async function getPublicProductById(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const product = await productRepository.findById(id);
  if (!product) {
    sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return;
  }

  // Public catalog only shows APPROVED products unless admin
  if (product.status !== 'APPROVED' && req.user?.role !== 'ADMIN') {
    sendError(res, 'This product listing is not active in the public catalog', 404, 'PRODUCT_UNAVAILABLE');
    return;
  }

  const inventory = await inventoryRepository.findByProductId(id);
  const seller = await sellerRepository.findById(product.sellerId);

  // Safe public seller summary (never expose private KYC, bank, GST/PAN documents)
  const sellerSummary = seller
    ? {
        id: seller.id,
        name: seller.businessName,
        tier: seller.sellerType,
        city: seller.businessAddress.city,
        state: seller.businessAddress.state,
        rating: seller.rating,
        reviewCount: seller.reviewCount,
        verified: seller.kycStatus === 'APPROVED',
      }
    : {
        id: product.sellerId,
        name: 'Verified Marketplace Merchant',
        tier: 'Authorized Distributor',
        city: 'Mumbai',
        state: 'Maharashtra',
        rating: 4.8,
        reviewCount: 150,
        verified: true,
      };

  sendSuccess(res, {
    product: {
      ...product,
      seller: sellerSummary,
      stockAvailability: inventory
        ? {
            currentStock: inventory.currentStock,
            availableStock: inventory.availableStock,
            status: inventory.status,
            inStock: inventory.availableStock > 0,
          }
        : { currentStock: 0, availableStock: 0, status: 'OUT_OF_STOCK', inStock: false },
    },
    inventory: inventory ? { availableStock: inventory.availableStock, status: inventory.status } : null,
  });
}

export async function checkProductFitment(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const parseResult = vehicleFitmentSpecSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const fitmentResult = await productRepository.checkFitment(id, parseResult.data);
  sendSuccess(res, fitmentResult);
}

export async function submitProductVerification(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const product = await productRepository.findById(id);
  if (!product) {
    sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return;
  }

  if (product.sellerId !== seller.id) {
    sendError(res, 'Cannot verify product belonging to another seller', 403, 'FORBIDDEN');
    return;
  }

  const { documents } = req.body;
  if (!Array.isArray(documents) || documents.length === 0) {
    sendError(res, 'At least one authorization document is required', 400, 'VALIDATION_ERROR');
    return;
  }

  const now = new Date().toISOString();
  const existing = await productVerificationRepository.findByProductId(product.id);

  let record;
  if (existing) {
    record = await productVerificationRepository.update(existing.id, {
      status: 'PENDING_VERIFICATION',
      documents: [
        ...existing.documents,
        ...documents.map((d: any) => ({
          id: `doc_${randomUUID()}`,
          uploadedAt: now,
          ...d,
        })),
      ],
      history: [
        ...existing.history,
        {
          status: 'PENDING_VERIFICATION',
          changedBy: seller.id,
          changedAt: now,
          notes: 'Seller uploaded supporting authorization documents',
        },
      ],
    });
  } else {
    record = await productVerificationRepository.create({
      id: `verif_${product.id}`,
      productId: product.id,
      sellerId: seller.id,
      brand: product.brand,
      productType: product.productType,
      status: 'PENDING_VERIFICATION',
      documents: documents.map((d: any) => ({
        id: `doc_${randomUUID()}`,
        uploadedAt: now,
        ...d,
      })),
      history: [
        {
          status: 'PENDING_VERIFICATION',
          changedBy: seller.id,
          changedAt: now,
          notes: 'Initial verification documents submission',
        },
      ],
      createdAt: now,
      updatedAt: now,
    });
  }

  sendSuccess(res, { verification: record }, 201);
}

export async function getProductVerification(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const record = await productVerificationRepository.findByProductId(id);
  if (!record) {
    sendSuccess(res, {
      verification: {
        productId: id,
        status: 'UNVERIFIED',
        documents: [],
      },
    });
    return;
  }
  sendSuccess(res, { verification: record });
}

