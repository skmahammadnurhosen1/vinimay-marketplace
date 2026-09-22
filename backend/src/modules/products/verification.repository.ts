import { getFirestore } from '../../config/firebase.js';
import { env } from '../../config/environment.js';
import { ProductVerificationRecord, ProductVerificationStatus } from '../../types/verification.js';
import { logger } from '../../utils/logger.js';

const COLLECTION_NAME = 'product_verifications';

export class ProductVerificationRepository {
  private inMemoryVerifications: Map<string, ProductVerificationRecord> = new Map();

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(record: ProductVerificationRecord): Promise<ProductVerificationRecord> {
    this.inMemoryVerifications.set(record.id, { ...record });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(record.id).set(record);
      } catch (error) {
        logger.error('Error creating product verification in Firestore:', { error: String(error) });
      }
    }

    return record;
  }

  async findById(id: string): Promise<ProductVerificationRecord | null> {
    const memory = this.inMemoryVerifications.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(COLLECTION_NAME).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as ProductVerificationRecord;
          this.inMemoryVerifications.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding product verification by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findByProductId(productId: string): Promise<ProductVerificationRecord | null> {
    for (const record of this.inMemoryVerifications.values()) {
      if (record.productId === productId) {
        return { ...record };
      }
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(COLLECTION_NAME)
          .where('productId', '==', productId)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as ProductVerificationRecord;
          this.inMemoryVerifications.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding product verification by product ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findBySeller(sellerId: string): Promise<ProductVerificationRecord[]> {
    const results: ProductVerificationRecord[] = [];
    for (const record of this.inMemoryVerifications.values()) {
      if (record.sellerId === sellerId) {
        results.push({ ...record });
      }
    }

    if (results.length === 0 && this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(COLLECTION_NAME)
          .where('sellerId', '==', sellerId)
          .get();
        snapshot.forEach((doc: any) => {
          const data = doc.data() as ProductVerificationRecord;
          this.inMemoryVerifications.set(data.id, data);
          results.push(data);
        });
      } catch (error) {
        logger.error('Error finding product verifications by seller in Firestore:', { error: String(error) });
      }
    }

    return results;
  }

  async findAll(status?: ProductVerificationStatus): Promise<ProductVerificationRecord[]> {
    let records = Array.from(this.inMemoryVerifications.values());
    if (status) {
      records = records.filter((r) => r.status === status);
    }
    return records.map((r) => ({ ...r }));
  }

  async update(id: string, updates: Partial<ProductVerificationRecord>): Promise<ProductVerificationRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: ProductVerificationRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryVerifications.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(id).set(updated, { merge: true });
      } catch (error) {
        logger.error('Error updating product verification in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }

  resetInMemory(): void {
    this.inMemoryVerifications.clear();
  }
}

export const productVerificationRepository = new ProductVerificationRepository();
