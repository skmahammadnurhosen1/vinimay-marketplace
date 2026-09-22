import { getFirestore } from '../../config/firebase.js';
import { env } from '../../config/environment.js';
import { ManufacturerEntity } from '../../types/manufacturer.js';
import { logger } from '../../utils/logger.js';

const COLLECTION_NAME = 'manufacturer_profiles';

export class ManufacturerRepository {
  private inMemoryManufacturers: Map<string, ManufacturerEntity> = new Map();
  private userToManufacturerMap: Map<string, string> = new Map();

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(manufacturer: ManufacturerEntity, userId?: string): Promise<ManufacturerEntity> {
    const effectiveUserId = userId || (manufacturer as any).userId;
    this.inMemoryManufacturers.set(manufacturer.id, { ...manufacturer, userId: effectiveUserId });
    if (effectiveUserId) {
      this.userToManufacturerMap.set(effectiveUserId, manufacturer.id);
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(manufacturer.id).set({
          ...manufacturer,
          userId: userId || null,
        });
      } catch (error) {
        logger.error('Error creating manufacturer in Firestore:', { error: String(error) });
      }
    }

    return manufacturer;
  }

  async findById(id: string): Promise<ManufacturerEntity | null> {
    const memory = this.inMemoryManufacturers.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(COLLECTION_NAME).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as ManufacturerEntity;
          this.inMemoryManufacturers.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding manufacturer by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findByUserId(userId: string): Promise<ManufacturerEntity | null> {
    const mfgId = this.userToManufacturerMap.get(userId);
    if (mfgId) {
      return this.findById(mfgId);
    }

    // Direct check if userId matches id
    const direct = await this.findById(userId);
    if (direct) return direct;

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(COLLECTION_NAME)
          .where('userId', '==', userId)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as ManufacturerEntity;
          this.inMemoryManufacturers.set(data.id, data);
          this.userToManufacturerMap.set(userId, data.id);
          return data;
        }
      } catch (error) {
        logger.error('Error finding manufacturer by userId in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findAll(): Promise<ManufacturerEntity[]> {
    return Array.from(this.inMemoryManufacturers.values()).map((m) => ({ ...m }));
  }

  async update(id: string, updates: Partial<ManufacturerEntity>): Promise<ManufacturerEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: ManufacturerEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryManufacturers.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(id).set(updated, { merge: true });
      } catch (error) {
        logger.error('Error updating manufacturer in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }

  resetInMemory(): void {
    this.inMemoryManufacturers.clear();
    this.userToManufacturerMap.clear();
  }
}

export const manufacturerRepository = new ManufacturerRepository();
