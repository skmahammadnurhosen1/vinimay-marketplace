import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { sellerRepository } from './seller.repository.js';
import { productRepository } from '../products/product.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { userRepository } from '../users/user.repository.js';
import {
  registerSellerSchema,
  updateSellerProfileSchema,
  uploadSellerDocumentSchema,
} from './seller.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { SellerProfileEntity, SellerDocumentRecord } from '../../types/seller.js';
import { env } from '../../config/environment.js';

export async function registerSeller(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required to register as seller', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = registerSellerSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  // Check if seller already exists for this user
  const existing = await sellerRepository.findByUserId(req.user.uid);
  if (existing) {
    sendError(
      res,
      'A seller profile is already registered for this account',
      409,
      'SELLER_ALREADY_EXISTS'
    );
    return;
  }

  const now = new Date().toISOString();
  const sellerId = `seller_${randomUUID()}`;
  const addressId = `addr_${randomUUID()}`;

  const input = parseResult.data;
  const newSeller: SellerProfileEntity = {
    id: sellerId,
    userId: req.user.uid,
    businessName: input.businessName,
    ownerName: input.ownerName,
    mobile: input.mobile,
    email: input.email,
    sellerType: input.sellerType,
    gstin: input.gstin,
    pan: input.pan,
    businessAddress: {
      ...input.businessAddress,
      id: addressId,
      userId: req.user.uid,
      createdAt: now,
      updatedAt: now,
    },
    bankDetails: input.bankDetails,
    kycStatus: 'DRAFT',
    documents: [],
    authorizedBrands: input.authorizedBrands || [],
    rating: 0,
    reviewCount: 0,
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
    submittedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const created = await sellerRepository.create(newSeller);

  // Update user role to SELLER
  await userRepository.update(req.user.uid, { role: 'SELLER' });

  sendSuccess(res, { seller: created }, 201);
}

export async function getSellerProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'No seller profile found for current user', 404, 'SELLER_NOT_FOUND');
    return;
  }

  sendSuccess(res, { seller });
}

export async function updateSellerProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'No seller profile found for current user', 404, 'SELLER_NOT_FOUND');
    return;
  }

  const parseResult = updateSellerProfileSchema.safeParse(req.body);
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
  const updates: Partial<SellerProfileEntity> = {};

  if (input.businessName) updates.businessName = input.businessName;
  if (input.ownerName) updates.ownerName = input.ownerName;
  if (input.mobile) updates.mobile = input.mobile;
  if (input.email) updates.email = input.email;
  if (input.bankDetails) updates.bankDetails = input.bankDetails;
  if (input.authorizedBrands) updates.authorizedBrands = input.authorizedBrands;
  if (input.businessAddress) {
    updates.businessAddress = {
      ...seller.businessAddress,
      ...input.businessAddress,
      updatedAt: new Date().toISOString(),
    };
  }

  const updated = await sellerRepository.update(seller.id, updates);
  sendSuccess(res, { seller: updated });
}

export async function uploadKycDocument(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile not found', 404, 'SELLER_NOT_FOUND');
    return;
  }

  const parseResult = uploadSellerDocumentSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const docData = parseResult.data;
  const docRecord: SellerDocumentRecord = {
    id: `doc_${randomUUID()}`,
    type: docData.type,
    title: docData.title,
    fileName: docData.fileName,
    fileSize: docData.fileSize,
    mimeType: docData.mimeType,
    storagePath: docData.storagePath,
    downloadUrl: docData.downloadUrl,
    status: 'UNDER_REVIEW',
    uploadedAt: new Date().toISOString(),
  };

  const updated = await sellerRepository.addDocument(seller.id, docRecord);
  sendSuccess(res, { seller: updated, document: docRecord });
}

export async function submitKycForVerification(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile not found', 404, 'SELLER_NOT_FOUND');
    return;
  }

  if (seller.kycStatus === 'APPROVED') {
    sendError(res, 'Seller KYC is already verified and approved', 400, 'KYC_ALREADY_APPROVED');
    return;
  }

  if (seller.kycStatus === 'UNDER_REVIEW') {
    sendError(res, 'Seller KYC is currently under review', 400, 'KYC_ALREADY_SUBMITTED');
    return;
  }

  // Check that at least one document exists
  if (!seller.documents || seller.documents.length === 0) {
    sendError(
      res,
      'At least one verification document (e.g. GST Certificate or PAN) must be uploaded before submitting KYC',
      400,
      'DOCUMENTS_REQUIRED'
    );
    return;
  }

  const updated = await sellerRepository.updateKycStatus(seller.id, 'SUBMITTED');
  sendSuccess(res, { seller: updated });
}

export async function getSellerDashboardMetrics(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile not found', 404, 'SELLER_NOT_FOUND');
    return;
  }

  const sellerProducts = await productRepository.findBySeller(seller.id, { limit: 1000 });
  const totalProducts = sellerProducts.total;
  const activeProducts = sellerProducts.products.filter((p) => p.status === 'APPROVED').length;
  const pendingProducts = sellerProducts.products.filter((p) => p.status === 'PENDING_REVIEW').length;

  const invSummary = await inventoryRepository.getSellerSummary(seller.id);

  const metrics = {
    totalProducts,
    activeProducts,
    pendingProducts,
    outOfStockProducts: invSummary.outOfStockCount,
    lowStockProducts: invSummary.lowStockCount,
    currentInventoryTotalUnits: invSummary.totalUnits,
    currentInventoryTotalValue: Math.round(invSummary.totalValue * 100) / 100,
    sellerVerificationStatus: seller.kycStatus,
  };

  sendSuccess(res, { metrics });
}

export async function getStorageUploadPolicy(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const { targetType, fileName } = req.body;
  if (!targetType || !fileName) {
    sendError(res, 'targetType ("kyc" | "product") and fileName are required', 400, 'MISSING_FIELDS');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  const sellerId = seller ? seller.id : req.user.uid;
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();

  let storagePath: string;
  let isPublic: boolean;

  if (targetType === 'kyc') {
    // SENSITIVE KYC DOC: Private path
    storagePath = `sellers/${sellerId}/kyc/${timestamp}_${safeFileName}`;
    isPublic = false;
  } else {
    // Product Image: Public path
    storagePath = `products/${sellerId}/${timestamp}_${safeFileName}`;
    isPublic = true;
  }

  sendSuccess(res, {
    storagePath,
    isPublic,
    uploadUrlPlaceholder: `https://storage.googleapis.com/${env.FIREBASE_STORAGE_BUCKET || 'vinimay-p2p-marketplace.appspot.com'}/${storagePath}`,
    headers: {
      'x-goog-meta-owner': req.user.uid,
      'x-goog-meta-seller-id': sellerId,
    },
  });
}
