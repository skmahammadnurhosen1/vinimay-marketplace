import { getFirestore } from '../../config/firebase.js';
import { env } from '../../config/environment.js';
import {
  MarketplaceCommissionConfig,
  SellerSettlementEntity,
  GstInvoiceEntity,
} from '../../types/finance.js';
import { logger } from '../../utils/logger.js';

const SETTLEMENTS_COLLECTION = 'settlements';
const INVOICES_COLLECTION = 'invoices';
const COMMISSIONS_COLLECTION = 'commissions';

export class FinanceRepository {
  private inMemoryCommissionConfig: MarketplaceCommissionConfig = {
    id: 'commission_config_global',
    defaultRate: 10,
    categoryRates: {
      'Braking System': 8,
      'Lighting & Electronics': 12,
      'Clutch & Transmission': 10,
      'Engine Parts': 10,
      'Suspension': 9,
    },
    sellerAgreedRates: {},
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  };

  private inMemorySettlements: Map<string, SellerSettlementEntity> = new Map();
  private inMemoryInvoices: Map<string, GstInvoiceEntity> = new Map();

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  // --------------------------------------------------------------------------
  // Commission Configuration
  // --------------------------------------------------------------------------

  async getCommissionConfig(): Promise<MarketplaceCommissionConfig> {
    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db
          .collection(COMMISSIONS_COLLECTION)
          .doc('commission_config_global')
          .get();
        if (doc.exists) {
          const data = doc.data() as MarketplaceCommissionConfig;
          this.inMemoryCommissionConfig = data;
          return data;
        }
      } catch (error) {
        logger.error('Error fetching commission config from Firestore:', { error: String(error) });
      }
    }
    return { ...this.inMemoryCommissionConfig };
  }

  async updateCommissionConfig(
    updates: Partial<MarketplaceCommissionConfig>,
    updatedBy: string
  ): Promise<MarketplaceCommissionConfig> {
    const existing = await this.getCommissionConfig();
    const updated: MarketplaceCommissionConfig = {
      ...existing,
      ...updates,
      categoryRates: {
        ...existing.categoryRates,
        ...(updates.categoryRates || {}),
      },
      sellerAgreedRates: {
        ...existing.sellerAgreedRates,
        ...(updates.sellerAgreedRates || {}),
      },
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    this.inMemoryCommissionConfig = updated;

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db
          .collection(COMMISSIONS_COLLECTION)
          .doc('commission_config_global')
          .set(updated, { merge: true });
      } catch (error) {
        logger.error('Error updating commission config in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }

  // --------------------------------------------------------------------------
  // Settlements
  // --------------------------------------------------------------------------

  async createSettlement(settlement: SellerSettlementEntity): Promise<SellerSettlementEntity> {
    this.inMemorySettlements.set(settlement.id, { ...settlement });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(SETTLEMENTS_COLLECTION).doc(settlement.id).set(settlement);
      } catch (error) {
        logger.error('Error creating settlement in Firestore:', { error: String(error) });
      }
    }

    return settlement;
  }

  async findSettlementById(id: string): Promise<SellerSettlementEntity | null> {
    const memory = this.inMemorySettlements.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(SETTLEMENTS_COLLECTION).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as SellerSettlementEntity;
          this.inMemorySettlements.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding settlement by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findSettlementBySubOrderId(subOrderId: string): Promise<SellerSettlementEntity | null> {
    for (const stl of this.inMemorySettlements.values()) {
      if (stl.subOrderId === subOrderId) {
        return { ...stl };
      }
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(SETTLEMENTS_COLLECTION)
          .where('subOrderId', '==', subOrderId)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as SellerSettlementEntity;
          this.inMemorySettlements.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding settlement by subOrderId in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findSettlementsBySeller(sellerId: string): Promise<SellerSettlementEntity[]> {
    const results: SellerSettlementEntity[] = [];
    for (const stl of this.inMemorySettlements.values()) {
      if (stl.sellerId === sellerId) {
        results.push({ ...stl });
      }
    }
    return results;
  }

  async findAllSettlements(): Promise<SellerSettlementEntity[]> {
    return Array.from(this.inMemorySettlements.values()).map((s) => ({ ...s }));
  }

  async updateSettlement(
    id: string,
    updates: Partial<SellerSettlementEntity>
  ): Promise<SellerSettlementEntity | null> {
    const existing = await this.findSettlementById(id);
    if (!existing) return null;

    const updated: SellerSettlementEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.inMemorySettlements.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(SETTLEMENTS_COLLECTION).doc(id).set(updated, { merge: true });
      } catch (error) {
        logger.error('Error updating settlement in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }

  // --------------------------------------------------------------------------
  // GST Invoices
  // --------------------------------------------------------------------------

  async saveInvoice(invoice: GstInvoiceEntity): Promise<GstInvoiceEntity> {
    this.inMemoryInvoices.set(invoice.id, { ...invoice });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(INVOICES_COLLECTION).doc(invoice.id).set(invoice);
      } catch (error) {
        logger.error('Error saving GST invoice in Firestore:', { error: String(error) });
      }
    }

    return invoice;
  }

  async findInvoiceById(id: string): Promise<GstInvoiceEntity | null> {
    const memory = this.inMemoryInvoices.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(INVOICES_COLLECTION).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as GstInvoiceEntity;
          this.inMemoryInvoices.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding invoice by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findInvoiceByOrderId(orderId: string): Promise<GstInvoiceEntity | null> {
    for (const inv of this.inMemoryInvoices.values()) {
      if (inv.orderId === orderId) {
        return { ...inv };
      }
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(INVOICES_COLLECTION)
          .where('orderId', '==', orderId)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as GstInvoiceEntity;
          this.inMemoryInvoices.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding invoice by orderId in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findAllInvoices(): Promise<GstInvoiceEntity[]> {
    return Array.from(this.inMemoryInvoices.values()).map((i) => ({ ...i }));
  }

  resetInMemory(): void {
    this.inMemorySettlements.clear();
    this.inMemoryInvoices.clear();
    this.inMemoryCommissionConfig = {
      id: 'commission_config_global',
      defaultRate: 10,
      categoryRates: {
        'Braking System': 8,
        'Lighting & Electronics': 12,
        'Clutch & Transmission': 10,
        'Engine Parts': 10,
        'Suspension': 9,
      },
      sellerAgreedRates: {},
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    };
  }
}

export const financeRepository = new FinanceRepository();
