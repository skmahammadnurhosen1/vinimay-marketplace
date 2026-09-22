import { getFirestore } from '../../config/firebase.js';
import { env } from '../../config/environment.js';
import { B2BAccountEntity, ProductB2BPricing } from '../../types/b2b.js';
import { logger } from '../../utils/logger.js';

const ACCOUNTS_COLLECTION = 'b2b_accounts';
const PRICING_COLLECTION = 'b2b_pricing';

export class B2BRepository {
  private inMemoryAccounts: Map<string, B2BAccountEntity> = new Map();
  private inMemoryPricing: Map<string, ProductB2BPricing> = new Map();

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  // --------------------------------------------------------------------------
  // B2B Accounts
  // --------------------------------------------------------------------------

  async createAccount(account: B2BAccountEntity): Promise<B2BAccountEntity> {
    this.inMemoryAccounts.set(account.id, { ...account });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(ACCOUNTS_COLLECTION).doc(account.id).set(account);
      } catch (error) {
        logger.error('Error creating B2B account in Firestore:', { error: String(error) });
      }
    }

    return account;
  }

  async findAccountById(id: string): Promise<B2BAccountEntity | null> {
    const memory = this.inMemoryAccounts.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(ACCOUNTS_COLLECTION).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as B2BAccountEntity;
          this.inMemoryAccounts.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding B2B account by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findAccountByUserId(userId: string): Promise<B2BAccountEntity | null> {
    for (const acc of this.inMemoryAccounts.values()) {
      if (acc.userId === userId) {
        return { ...acc };
      }
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(ACCOUNTS_COLLECTION)
          .where('userId', '==', userId)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as B2BAccountEntity;
          this.inMemoryAccounts.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding B2B account by userId in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findAllAccounts(type?: 'GARAGE' | 'FLEET'): Promise<B2BAccountEntity[]> {
    let list = Array.from(this.inMemoryAccounts.values());
    if (type) {
      list = list.filter((a) => a.accountType === type);
    }
    return list.map((a) => ({ ...a }));
  }

  async updateAccount(
    id: string,
    updates: Partial<B2BAccountEntity>
  ): Promise<B2BAccountEntity | null> {
    const existing = await this.findAccountById(id);
    if (!existing) return null;

    const updated: B2BAccountEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryAccounts.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(ACCOUNTS_COLLECTION).doc(id).set(updated, { merge: true });
      } catch (error) {
        logger.error('Error updating B2B account in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }

  // --------------------------------------------------------------------------
  // B2B Pricing
  // --------------------------------------------------------------------------

  async getProductB2BPricing(productId: string): Promise<ProductB2BPricing | null> {
    const memory = this.inMemoryPricing.get(productId);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(PRICING_COLLECTION).doc(productId).get();
        if (doc.exists) {
          const data = doc.data() as ProductB2BPricing;
          this.inMemoryPricing.set(productId, data);
          return data;
        }
      } catch (error) {
        logger.error('Error fetching B2B pricing in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async setProductB2BPricing(pricing: ProductB2BPricing): Promise<ProductB2BPricing> {
    this.inMemoryPricing.set(pricing.productId, { ...pricing });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(PRICING_COLLECTION).doc(pricing.productId).set(pricing);
      } catch (error) {
        logger.error('Error setting B2B pricing in Firestore:', { error: String(error) });
      }
    }

    return pricing;
  }

  resetInMemory(): void {
    this.inMemoryAccounts.clear();
    this.inMemoryPricing.clear();
  }
}

export const b2bRepository = new B2BRepository();
