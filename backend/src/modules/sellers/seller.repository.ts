import {
  SellerProfileEntity,
  SellerKYCStatus,
  SellerDocumentRecord,
} from '../../types/seller.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface ISellerRepository {
  findById(id: string): Promise<SellerProfileEntity | null>;
  findByUserId(userId: string): Promise<SellerProfileEntity | null>;
  findAll(filter?: { kycStatus?: SellerKYCStatus }): Promise<SellerProfileEntity[]>;
  create(seller: SellerProfileEntity): Promise<SellerProfileEntity>;
  update(id: string, updates: Partial<SellerProfileEntity>): Promise<SellerProfileEntity | null>;
  addDocument(id: string, document: SellerDocumentRecord): Promise<SellerProfileEntity | null>;
  updateKycStatus(
    id: string,
    status: SellerKYCStatus,
    reviewedBy?: string,
    rejectionReason?: string
  ): Promise<SellerProfileEntity | null>;
  resetInMemory?(): void;
}

// In-Memory Seller Store (Used for tests and offline development)
const inMemorySellers = new Map<string, SellerProfileEntity>();

// Seed default verified seller (matching frontend mock seller)
export function seedDefaultSellers(): void {
  inMemorySellers.clear();

  const defaultSeller: SellerProfileEntity = {
    id: 'seller_apex_auto_parts',
    userId: 'mock-seller-uid',
    businessName: 'Apex Auto Spares Pvt Ltd',
    ownerName: 'Vikram Malhotra',
    mobile: '9820123456',
    email: 'vikram@apexautospares.in',
    sellerType: 'Authorized Distributor',
    gstin: '27AABCU9603R1ZM',
    pan: 'AABCU9603R',
    businessAddress: {
      id: 'addr_seller_apex',
      userId: 'mock-seller-uid',
      fullName: 'Vikram Malhotra',
      phone: '9820123456',
      addressLine1: 'Plot 42, MIDC Industrial Area, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400093',
      country: 'India',
      type: 'registered_office',
      isDefault: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0000123',
      accountHolderName: 'Apex Auto Spares Pvt Ltd',
    },
    kycStatus: 'APPROVED',
    documents: [
      {
        id: 'doc_gst_01',
        type: 'gst_certificate',
        title: 'GST Registration Certificate',
        fileName: 'gst_reg_27AABCU9603R1ZM.pdf',
        fileSize: 425000,
        mimeType: 'application/pdf',
        storagePath: 'sellers/seller_apex_auto_parts/kyc/gst_reg.pdf',
        status: 'APPROVED',
        uploadedAt: '2026-01-02T10:00:00.000Z',
        verifiedAt: '2026-01-03T14:30:00.000Z',
      },
    ],
    authorizedBrands: ['bosch', 'brembo', 'valeo', 'tata-motors', 'maruti-suzuki'],
    rating: 4.8,
    reviewCount: 342,
    rejectionReason: null,
    reviewedBy: 'admin_sys_01',
    reviewedAt: '2026-01-03T14:30:00.000Z',
    submittedAt: '2026-01-02T10:30:00.000Z',
    createdAt: '2026-01-01T12:00:00.000Z',
    updatedAt: '2026-01-03T14:30:00.000Z',
  };

  inMemorySellers.set(defaultSeller.id, defaultSeller);
}

// Initial seed
seedDefaultSellers();

export class SellerRepository implements ISellerRepository {
  private collectionName = 'sellers';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async findById(id: string): Promise<SellerProfileEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemorySellers.get(id) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as SellerProfileEntity;
    } catch (error) {
      logger.warn('Firestore findById fallback to in-memory:', { id, error });
      return inMemorySellers.get(id) || null;
    }
  }

  async findByUserId(userId: string): Promise<SellerProfileEntity | null> {
    if (!this.shouldUseFirestore()) {
      for (const s of inMemorySellers.values()) {
        if (s.userId === userId) return s;
      }
      return null;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (snapshot.empty) return null;
      return snapshot.docs[0].data() as SellerProfileEntity;
    } catch (error) {
      logger.warn('Firestore findByUserId fallback to in-memory:', { userId, error });
      for (const s of inMemorySellers.values()) {
        if (s.userId === userId) return s;
      }
      return null;
    }
  }

  async findAll(filter?: { kycStatus?: SellerKYCStatus }): Promise<SellerProfileEntity[]> {
    if (!this.shouldUseFirestore()) {
      const all = Array.from(inMemorySellers.values());
      if (filter?.kycStatus) {
        return all.filter((s) => s.kycStatus === filter.kycStatus);
      }
      return all;
    }

    try {
      const db = getFirestore();
      let query: FirebaseFirestore.Query = db.collection(this.collectionName);
      if (filter?.kycStatus) {
        query = query.where('kycStatus', '==', filter.kycStatus);
      }
      const snapshot = await query.get();
      return snapshot.docs.map((doc) => doc.data() as SellerProfileEntity);
    } catch (error) {
      logger.warn('Firestore findAll sellers fallback to in-memory:', { error });
      const all = Array.from(inMemorySellers.values());
      if (filter?.kycStatus) {
        return all.filter((s) => s.kycStatus === filter.kycStatus);
      }
      return all;
    }
  }

  async create(seller: SellerProfileEntity): Promise<SellerProfileEntity> {
    inMemorySellers.set(seller.id, { ...seller });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(seller.id).set(seller);
      } catch (error) {
        logger.error('Failed to create seller in Firestore:', { id: seller.id, error });
      }
    }

    return seller;
  }

  async update(id: string, updates: Partial<SellerProfileEntity>): Promise<SellerProfileEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: SellerProfileEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemorySellers.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(id).update({
          ...updates,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update seller in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async addDocument(id: string, document: SellerDocumentRecord): Promise<SellerProfileEntity | null> {
    const seller = await this.findById(id);
    if (!seller) return null;

    // Replace if document of same type exists, or append
    const docIndex = seller.documents.findIndex((d) => d.type === document.type);
    let newDocs = [...seller.documents];
    if (docIndex >= 0) {
      newDocs[docIndex] = document;
    } else {
      newDocs.push(document);
    }

    return this.update(id, { documents: newDocs });
  }

  async updateKycStatus(
    id: string,
    status: SellerKYCStatus,
    reviewedBy?: string,
    rejectionReason?: string
  ): Promise<SellerProfileEntity | null> {
    const updates: Partial<SellerProfileEntity> = {
      kycStatus: status,
      reviewedBy: reviewedBy || null,
      rejectionReason: rejectionReason || null,
      reviewedAt: new Date().toISOString(),
    };

    if (status === 'SUBMITTED') {
      updates.submittedAt = new Date().toISOString();
    }
    if (status === 'APPROVED') {
      updates.isVerified = true;
    }

    return this.update(id, updates);
  }

  resetInMemory(): void {
    seedDefaultSellers();
  }
}

export const sellerRepository = new SellerRepository();
