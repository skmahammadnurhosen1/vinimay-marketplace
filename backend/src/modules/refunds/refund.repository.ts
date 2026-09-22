import { RefundEntity } from '../../types/refund.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IRefundRepository {
  create(refund: RefundEntity): Promise<RefundEntity>;
  findById(id: string): Promise<RefundEntity | null>;
  findByReturnId(returnId: string): Promise<RefundEntity | null>;
  findByOrderId(orderId: string): Promise<RefundEntity[]>;
  findByCustomerId(customerId: string): Promise<RefundEntity[]>;
  findAll(): Promise<RefundEntity[]>;
  resetInMemory?(): void;
}

const inMemoryRefunds = new Map<string, RefundEntity>();

export class RefundRepository implements IRefundRepository {
  private collectionName = 'refunds';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(refund: RefundEntity): Promise<RefundEntity> {
    inMemoryRefunds.set(refund.id, { ...refund });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(refund.id).set(refund);
      } catch (error) {
        logger.error('Failed to create refund in Firestore:', { id: refund.id, error });
      }
    }

    return refund;
  }

  async findById(id: string): Promise<RefundEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryRefunds.get(id) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as RefundEntity;
    } catch (error) {
      logger.warn('Firestore findById refund fallback to in-memory:', { id, error });
      return inMemoryRefunds.get(id) || null;
    }
  }

  async findByReturnId(returnId: string): Promise<RefundEntity | null> {
    const memoryMatch = Array.from(inMemoryRefunds.values()).find((r) => r.returnId === returnId);
    if (!this.shouldUseFirestore()) {
      return memoryMatch || null;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('returnId', '==', returnId)
        .limit(1)
        .get();

      if (snapshot.empty) return memoryMatch || null;
      return snapshot.docs[0].data() as RefundEntity;
    } catch (error) {
      logger.warn('Firestore findByReturnId refund fallback to in-memory:', { returnId, error });
      return memoryMatch || null;
    }
  }

  async findByOrderId(orderId: string): Promise<RefundEntity[]> {
    const memoryList = Array.from(inMemoryRefunds.values()).filter((r) => r.orderId === orderId);
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
      return snapshot.docs.map((doc) => doc.data() as RefundEntity);
    } catch (error) {
      logger.warn('Firestore findByOrderId refund fallback to in-memory:', { orderId, error });
      return memoryList;
    }
  }

  async findByCustomerId(customerId: string): Promise<RefundEntity[]> {
    const memoryList = Array.from(inMemoryRefunds.values()).filter((r) => r.customerId === customerId);
    if (!this.shouldUseFirestore()) {
      return memoryList;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('customerId', '==', customerId)
        .get();

      if (snapshot.empty) return memoryList;
      return snapshot.docs.map((doc) => doc.data() as RefundEntity);
    } catch (error) {
      logger.warn('Firestore findByCustomerId refund fallback to in-memory:', { customerId, error });
      return memoryList;
    }
  }

  async findAll(): Promise<RefundEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemoryRefunds.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc) => doc.data() as RefundEntity);
    } catch (error) {
      logger.warn('Firestore findAll refunds fallback to in-memory:', { error });
      return Array.from(inMemoryRefunds.values());
    }
  }

  resetInMemory(): void {
    inMemoryRefunds.clear();
  }
}

export const refundRepository = new RefundRepository();
