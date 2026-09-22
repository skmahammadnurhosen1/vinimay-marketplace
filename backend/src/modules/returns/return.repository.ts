import { ReturnRequestEntity } from '../../types/return.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IReturnRepository {
  create(returnReq: ReturnRequestEntity): Promise<ReturnRequestEntity>;
  findById(id: string): Promise<ReturnRequestEntity | null>;
  findByCustomerId(customerId: string): Promise<ReturnRequestEntity[]>;
  findBySellerId(sellerId: string): Promise<ReturnRequestEntity[]>;
  findByOrderId(orderId: string): Promise<ReturnRequestEntity[]>;
  findByOrderItem(orderId: string, productId: string): Promise<ReturnRequestEntity | null>;
  update(id: string, updates: Partial<ReturnRequestEntity>): Promise<ReturnRequestEntity | null>;
  findAll(): Promise<ReturnRequestEntity[]>;
  resetInMemory?(): void;
}

const inMemoryReturns = new Map<string, ReturnRequestEntity>();

export class ReturnRepository implements IReturnRepository {
  private collectionName = 'returns';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(returnReq: ReturnRequestEntity): Promise<ReturnRequestEntity> {
    inMemoryReturns.set(returnReq.id, { ...returnReq });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(returnReq.id).set(returnReq);
      } catch (error) {
        logger.error('Failed to create return in Firestore:', { id: returnReq.id, error });
      }
    }

    return returnReq;
  }

  async findById(id: string): Promise<ReturnRequestEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryReturns.get(id) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as ReturnRequestEntity;
    } catch (error) {
      logger.warn('Firestore findById return fallback to in-memory:', { id, error });
      return inMemoryReturns.get(id) || null;
    }
  }

  async findByCustomerId(customerId: string): Promise<ReturnRequestEntity[]> {
    const memoryList = Array.from(inMemoryReturns.values())
      .filter((r) => r.customerId === customerId)
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
      return snapshot.docs.map((doc) => doc.data() as ReturnRequestEntity);
    } catch (error) {
      logger.warn('Firestore findByCustomerId return fallback to in-memory:', { customerId, error });
      return memoryList;
    }
  }

  async findBySellerId(sellerId: string): Promise<ReturnRequestEntity[]> {
    const memoryList = Array.from(inMemoryReturns.values())
      .filter((r) => r.sellerId === sellerId)
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
      return snapshot.docs.map((doc) => doc.data() as ReturnRequestEntity);
    } catch (error) {
      logger.warn('Firestore findBySellerId return fallback to in-memory:', { sellerId, error });
      return memoryList;
    }
  }

  async findByOrderId(orderId: string): Promise<ReturnRequestEntity[]> {
    const memoryList = Array.from(inMemoryReturns.values()).filter((r) => r.orderId === orderId);
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
      return snapshot.docs.map((doc) => doc.data() as ReturnRequestEntity);
    } catch (error) {
      logger.warn('Firestore findByOrderId return fallback to in-memory:', { orderId, error });
      return memoryList;
    }
  }

  async findByOrderItem(orderId: string, productId: string): Promise<ReturnRequestEntity | null> {
    const match = Array.from(inMemoryReturns.values()).find(
      (r) => r.orderId === orderId && r.productId === productId && r.status !== 'CANCELLED'
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
      const found = snapshot.docs.map((doc) => doc.data() as ReturnRequestEntity);
      const active = found.find((r) => r.status !== 'CANCELLED');
      return active || null;
    } catch (error) {
      logger.warn('Firestore findByOrderItem return fallback to in-memory:', { orderId, productId, error });
      return match || null;
    }
  }

  async update(id: string, updates: Partial<ReturnRequestEntity>): Promise<ReturnRequestEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: ReturnRequestEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemoryReturns.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(id).update({
          ...updates,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update return in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async findAll(): Promise<ReturnRequestEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemoryReturns.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc) => doc.data() as ReturnRequestEntity);
    } catch (error) {
      logger.warn('Firestore findAll returns fallback to in-memory:', { error });
      return Array.from(inMemoryReturns.values());
    }
  }

  resetInMemory(): void {
    inMemoryReturns.clear();
  }
}

export const returnRepository = new ReturnRepository();
