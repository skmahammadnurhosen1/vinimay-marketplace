import { WarrantyClaimEntity } from '../../types/warranty.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IWarrantyRepository {
  create(claim: WarrantyClaimEntity): Promise<WarrantyClaimEntity>;
  findById(id: string): Promise<WarrantyClaimEntity | null>;
  findByCustomerId(customerId: string): Promise<WarrantyClaimEntity[]>;
  findBySellerId(sellerId: string): Promise<WarrantyClaimEntity[]>;
  findByOrderId(orderId: string): Promise<WarrantyClaimEntity[]>;
  findByOrderItem(orderId: string, productId: string): Promise<WarrantyClaimEntity | null>;
  update(id: string, updates: Partial<WarrantyClaimEntity>): Promise<WarrantyClaimEntity | null>;
  findAll(): Promise<WarrantyClaimEntity[]>;
  resetInMemory?(): void;
}

const inMemoryWarrantyClaims = new Map<string, WarrantyClaimEntity>();

export class WarrantyRepository implements IWarrantyRepository {
  private collectionName = 'warranty_claims';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(claim: WarrantyClaimEntity): Promise<WarrantyClaimEntity> {
    inMemoryWarrantyClaims.set(claim.id, { ...claim });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(claim.id).set(claim);
      } catch (error) {
        logger.error('Failed to create warranty claim in Firestore:', { id: claim.id, error });
      }
    }

    return claim;
  }

  async findById(id: string): Promise<WarrantyClaimEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryWarrantyClaims.get(id) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as WarrantyClaimEntity;
    } catch (error) {
      logger.warn('Firestore findById warranty claim fallback to in-memory:', { id, error });
      return inMemoryWarrantyClaims.get(id) || null;
    }
  }

  async findByCustomerId(customerId: string): Promise<WarrantyClaimEntity[]> {
    const memoryList = Array.from(inMemoryWarrantyClaims.values())
      .filter((w) => w.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!this.shouldUseFirestore()) {
      return memoryList;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('customerId', '==', customerId)
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) return memoryList;
      return snapshot.docs.map((doc) => doc.data() as WarrantyClaimEntity);
    } catch (error) {
      logger.warn('Firestore findByCustomerId warranty fallback to in-memory:', { customerId, error });
      return memoryList;
    }
  }

  async findBySellerId(sellerId: string): Promise<WarrantyClaimEntity[]> {
    const memoryList = Array.from(inMemoryWarrantyClaims.values())
      .filter((w) => w.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!this.shouldUseFirestore()) {
      return memoryList;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('sellerId', '==', sellerId)
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) return memoryList;
      return snapshot.docs.map((doc) => doc.data() as WarrantyClaimEntity);
    } catch (error) {
      logger.warn('Firestore findBySellerId warranty fallback to in-memory:', { sellerId, error });
      return memoryList;
    }
  }

  async findByOrderId(orderId: string): Promise<WarrantyClaimEntity[]> {
    const memoryList = Array.from(inMemoryWarrantyClaims.values()).filter((w) => w.orderId === orderId);
    if (!this.shouldUseFirestore()) {
      return memoryList;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('orderId', '==', orderId)
        .get();

      if (snapshot.empty) return memoryList;
      return snapshot.docs.map((doc) => doc.data() as WarrantyClaimEntity);
    } catch (error) {
      logger.warn('Firestore findByOrderId warranty fallback to in-memory:', { orderId, error });
      return memoryList;
    }
  }

  async findByOrderItem(orderId: string, productId: string): Promise<WarrantyClaimEntity | null> {
    const match = Array.from(inMemoryWarrantyClaims.values()).find(
      (w) => w.orderId === orderId && w.productId === productId && w.status !== 'CLOSED'
    );
    if (!this.shouldUseFirestore()) {
      return match || null;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('orderId', '==', orderId)
        .where('productId', '==', productId)
        .get();

      if (snapshot.empty) return match || null;
      const found = snapshot.docs.map((doc) => doc.data() as WarrantyClaimEntity);
      const active = found.find((w) => w.status !== 'CLOSED');
      return active || null;
    } catch (error) {
      logger.warn('Firestore findByOrderItem warranty fallback to in-memory:', { orderId, productId, error });
      return match || null;
    }
  }

  async update(id: string, updates: Partial<WarrantyClaimEntity>): Promise<WarrantyClaimEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: WarrantyClaimEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemoryWarrantyClaims.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(id).update({
          ...updates,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update warranty claim in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async findAll(): Promise<WarrantyClaimEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemoryWarrantyClaims.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc) => doc.data() as WarrantyClaimEntity);
    } catch (error) {
      logger.warn('Firestore findAll warranty claims fallback to in-memory:', { error });
      return Array.from(inMemoryWarrantyClaims.values());
    }
  }

  resetInMemory(): void {
    inMemoryWarrantyClaims.clear();
  }
}

export const warrantyRepository = new WarrantyRepository();
