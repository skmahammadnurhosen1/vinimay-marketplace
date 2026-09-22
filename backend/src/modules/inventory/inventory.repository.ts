import { randomUUID } from 'node:crypto';
import {
  InventoryItemEntity,
  InventoryMovementEntity,
  InventoryMovementType,
} from '../../types/inventory.js';
import { productRepository } from '../products/product.repository.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IInventoryRepository {
  findByProductId(productId: string): Promise<InventoryItemEntity | null>;
  findBySeller(sellerId: string, filter?: { lowStockOnly?: boolean }): Promise<InventoryItemEntity[]>;
  create(item: InventoryItemEntity): Promise<InventoryItemEntity>;
  adjustStock(params: {
    productId: string;
    sellerId: string;
    delta: number;
    type: InventoryMovementType;
    reason: string;
    referenceId?: string;
    performedBy: string;
  }): Promise<{ inventory: InventoryItemEntity; movement: InventoryMovementEntity }>;
  getMovementsByProduct(productId: string, limit?: number): Promise<InventoryMovementEntity[]>;
  getSellerSummary(sellerId: string): Promise<{
    totalUnits: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  }>;
  resetInMemory?(): void;
}

// In-Memory Stores
const inMemoryInventory = new Map<string, InventoryItemEntity>();
const inMemoryMovements: InventoryMovementEntity[] = [];

// Seed Default Inventory matching mock products
export function seedDefaultInventory(): void {
  inMemoryInventory.clear();
  inMemoryMovements.length = 0;

  const initialItems: InventoryItemEntity[] = [
    {
      id: 'prod_bosch_brake_pad_tata_ace',
      productId: 'prod_bosch_brake_pad_tata_ace',
      sellerId: 'seller_apex_auto_parts',
      currentStock: 48,
      reservedStock: 3,
      availableStock: 45,
      lowStockThreshold: 10,
      sku: 'SKU-BP-TATA-4210',
      status: 'IN_STOCK',
      lastRestockedAt: '2026-01-04T10:00:00.000Z',
      updatedAt: '2026-01-04T10:00:00.000Z',
    },
    {
      id: 'prod_valeo_clutch_kit_swift',
      productId: 'prod_valeo_clutch_kit_swift',
      sellerId: 'seller_apex_auto_parts',
      currentStock: 18,
      reservedStock: 2,
      availableStock: 16,
      lowStockThreshold: 5,
      sku: 'SKU-CK-VAL-2210',
      status: 'IN_STOCK',
      lastRestockedAt: '2026-01-05T09:00:00.000Z',
      updatedAt: '2026-01-05T09:00:00.000Z',
    },
    {
      id: 'prod_gabriel_suspension_strut',
      productId: 'prod_gabriel_suspension_strut',
      sellerId: 'seller_apex_auto_parts',
      currentStock: 4,
      reservedStock: 0,
      availableStock: 4,
      lowStockThreshold: 6,
      sku: 'SKU-GAB-STR-4160',
      status: 'LOW_STOCK',
      lastRestockedAt: '2026-01-06T14:00:00.000Z',
      updatedAt: '2026-01-06T14:00:00.000Z',
    },
    {
      id: 'prod_gearbox_synchro_tata_ace',
      productId: 'prod_gearbox_synchro_tata_ace',
      sellerId: 'seller_apex_auto_parts',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      lowStockThreshold: 5,
      sku: 'SKU-SYN-TATA-2610',
      status: 'OUT_OF_STOCK',
      lastRestockedAt: '2025-12-20T10:00:00.000Z',
      updatedAt: '2026-01-07T16:00:00.000Z',
    },
    {
      id: 'prod_dana_diff_crown_pinion',
      productId: 'prod_dana_diff_crown_pinion',
      sellerId: 'seller_apex_auto_parts',
      currentStock: 9,
      reservedStock: 1,
      availableStock: 8,
      lowStockThreshold: 3,
      sku: 'SKU-DIFF-DS-0303',
      status: 'IN_STOCK',
      lastRestockedAt: '2026-01-08T11:00:00.000Z',
      updatedAt: '2026-01-08T11:00:00.000Z',
    },
  ];

  for (const item of initialItems) {
    inMemoryInventory.set(item.productId, item);
  }
}

seedDefaultInventory();

export class InventoryRepository implements IInventoryRepository {
  private collectionName = 'inventory';
  private movementsCollection = 'inventory_movements';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async findByProductId(productId: string): Promise<InventoryItemEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryInventory.get(productId) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(productId).get();
      if (!doc.exists) return null;
      return doc.data() as InventoryItemEntity;
    } catch (error) {
      logger.warn('Firestore findByProductId inventory fallback to in-memory:', { productId, error });
      return inMemoryInventory.get(productId) || null;
    }
  }

  async findBySeller(sellerId: string, filter?: { lowStockOnly?: boolean }): Promise<InventoryItemEntity[]> {
    let items = Array.from(inMemoryInventory.values()).filter((i) => i.sellerId === sellerId);

    if (filter?.lowStockOnly) {
      items = items.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK');
    }

    return items;
  }

  async create(item: InventoryItemEntity): Promise<InventoryItemEntity> {
    inMemoryInventory.set(item.productId, { ...item });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(item.productId).set(item);
      } catch (error) {
        logger.error('Failed to create inventory in Firestore:', { productId: item.productId, error });
      }
    }

    return item;
  }

  async adjustStock(params: {
    productId: string;
    sellerId: string;
    delta: number;
    type: InventoryMovementType;
    reason: string;
    referenceId?: string;
    performedBy: string;
  }): Promise<{ inventory: InventoryItemEntity; movement: InventoryMovementEntity }> {
    const existing = await this.findByProductId(params.productId);
    if (!existing) {
      throw new Error(`INVENTORY_NOT_FOUND: Product ${params.productId} has no inventory record`);
    }

    if (existing.sellerId !== params.sellerId) {
      throw new Error(`UNAUTHORIZED_SELLER: Seller does not own inventory for product ${params.productId}`);
    }

    const balanceBefore = existing.currentStock;
    const newCurrentStock = balanceBefore + params.delta;

    // Strict negative-stock prevention
    if (newCurrentStock < 0) {
      throw new Error(
        `NEGATIVE_STOCK_NOT_ALLOWED: Cannot decrease stock by ${Math.abs(params.delta)}. Current stock is ${balanceBefore}.`
      );
    }

    const newAvailableStock = newCurrentStock - existing.reservedStock;
    if (newAvailableStock < 0) {
      throw new Error(
        `INSUFFICIENT_AVAILABLE_STOCK: Cannot adjust stock. Reserved stock is ${existing.reservedStock}, available would be negative.`
      );
    }

    // Determine status
    let newStatus: InventoryItemEntity['status'] = 'IN_STOCK';
    if (newCurrentStock === 0) {
      newStatus = 'OUT_OF_STOCK';
    } else if (newCurrentStock <= existing.lowStockThreshold) {
      newStatus = 'LOW_STOCK';
    }

    const now = new Date().toISOString();
    const updated: InventoryItemEntity = {
      ...existing,
      currentStock: newCurrentStock,
      availableStock: newAvailableStock,
      status: newStatus,
      lastRestockedAt: params.delta > 0 ? now : existing.lastRestockedAt,
      updatedAt: now,
    };

    inMemoryInventory.set(params.productId, updated);

    // Create immutable audit ledger movement
    const movement: InventoryMovementEntity = {
      id: `mov_${randomUUID()}`,
      productId: params.productId,
      sellerId: params.sellerId,
      type: params.type,
      quantityChanged: params.delta,
      balanceBefore,
      balanceAfter: newCurrentStock,
      reason: params.reason,
      referenceId: params.referenceId || null,
      performedBy: params.performedBy,
      createdAt: now,
    };

    inMemoryMovements.unshift(movement);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const batch = db.batch();
        const invRef = db.collection(this.collectionName).doc(params.productId);
        const movRef = db.collection(this.movementsCollection).doc(movement.id);

        batch.update(invRef, {
          currentStock: updated.currentStock,
          availableStock: updated.availableStock,
          status: updated.status,
          lastRestockedAt: updated.lastRestockedAt,
          updatedAt: updated.updatedAt,
        });
        batch.set(movRef, movement);

        await batch.commit();
      } catch (error) {
        logger.error('Failed to adjust inventory in Firestore batch:', { params, error });
      }
    }

    return { inventory: updated, movement };
  }

  async getMovementsByProduct(productId: string, limit = 20): Promise<InventoryMovementEntity[]> {
    return inMemoryMovements
      .filter((m) => m.productId === productId)
      .slice(0, limit);
  }

  async getSellerSummary(sellerId: string): Promise<{
    totalUnits: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  }> {
    const items = await this.findBySeller(sellerId);
    let totalUnits = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const item of items) {
      totalUnits += item.currentStock;
      if (item.status === 'LOW_STOCK') lowStockCount++;
      if (item.status === 'OUT_OF_STOCK') outOfStockCount++;

      const prod = await productRepository.findById(item.productId);
      if (prod) {
        totalValue += item.currentStock * prod.price;
      }
    }

    return { totalUnits, totalValue, lowStockCount, outOfStockCount };
  }

  resetInMemory(): void {
    seedDefaultInventory();
  }
}

export const inventoryRepository = new InventoryRepository();
