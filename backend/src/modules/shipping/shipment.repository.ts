import { ShipmentEntity, TrackingCheckpoint } from '../../types/shipping.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IShipmentRepository {
  create(shipment: ShipmentEntity): Promise<ShipmentEntity>;
  findById(id: string): Promise<ShipmentEntity | null>;
  findBySubOrderId(subOrderId: string): Promise<ShipmentEntity | null>;
  findByAwb(awbNumber: string): Promise<ShipmentEntity | null>;
  findBySellerId(sellerId: string): Promise<ShipmentEntity[]>;
  findByParentOrderId(parentOrderId: string): Promise<ShipmentEntity[]>;
  update(id: string, updates: Partial<ShipmentEntity>): Promise<ShipmentEntity | null>;
  addCheckpoint(id: string, checkpoint: TrackingCheckpoint): Promise<ShipmentEntity | null>;
  isWebhookProcessed(eventId: string): Promise<boolean>;
  recordWebhook(eventId: string): Promise<void>;
  resetInMemory?(): void;
}

const inMemoryShipments = new Map<string, ShipmentEntity>();
const inMemoryShippingWebhooks = new Set<string>();

export class ShipmentRepository implements IShipmentRepository {
  private collectionName = 'shipments';
  private webhookCollection = 'shipping_webhook_events';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(shipment: ShipmentEntity): Promise<ShipmentEntity> {
    inMemoryShipments.set(shipment.id, { ...shipment });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(shipment.id).set(shipment);
      } catch (error) {
        logger.error('Failed to create shipment in Firestore:', { id: shipment.id, error });
      }
    }

    return shipment;
  }

  async findById(id: string): Promise<ShipmentEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryShipments.get(id) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as ShipmentEntity;
    } catch (error) {
      logger.warn('Firestore findById shipment fallback to in-memory:', { id, error });
      return inMemoryShipments.get(id) || null;
    }
  }

  async findBySubOrderId(subOrderId: string): Promise<ShipmentEntity | null> {
    const memoryMatch = Array.from(inMemoryShipments.values()).find((s) => s.subOrderId === subOrderId);
    if (!this.shouldUseFirestore()) {
      return memoryMatch || null;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('subOrderId', '==', subOrderId)
        .limit(1)
        .get();

      if (snapshot.empty) return memoryMatch || null;
      return snapshot.docs[0].data() as ShipmentEntity;
    } catch (error) {
      logger.warn('Firestore findBySubOrderId shipment fallback to in-memory:', { subOrderId, error });
      return memoryMatch || null;
    }
  }

  async findByAwb(awbNumber: string): Promise<ShipmentEntity | null> {
    const memoryMatch = Array.from(inMemoryShipments.values()).find((s) => s.awbNumber === awbNumber);
    if (!this.shouldUseFirestore()) {
      return memoryMatch || null;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('awbNumber', '==', awbNumber)
        .limit(1)
        .get();

      if (snapshot.empty) return memoryMatch || null;
      return snapshot.docs[0].data() as ShipmentEntity;
    } catch (error) {
      logger.warn('Firestore findByAwb shipment fallback to in-memory:', { awbNumber, error });
      return memoryMatch || null;
    }
  }

  async findBySellerId(sellerId: string): Promise<ShipmentEntity[]> {
    const memoryList = Array.from(inMemoryShipments.values()).filter((s) => s.sellerId === sellerId);
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
      return snapshot.docs.map((doc) => doc.data() as ShipmentEntity);
    } catch (error) {
      logger.warn('Firestore findBySellerId shipment fallback to in-memory:', { sellerId, error });
      return memoryList;
    }
  }

  async findByParentOrderId(parentOrderId: string): Promise<ShipmentEntity[]> {
    const memoryList = Array.from(inMemoryShipments.values()).filter((s) => s.parentOrderId === parentOrderId);
    if (!this.shouldUseFirestore()) {
      return memoryList;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('parentOrderId', '==', parentOrderId)
        .get();

      if (snapshot.empty) return memoryList;
      return snapshot.docs.map((doc) => doc.data() as ShipmentEntity);
    } catch (error) {
      logger.warn('Firestore findByParentOrderId shipment fallback to in-memory:', { parentOrderId, error });
      return memoryList;
    }
  }

  async update(id: string, updates: Partial<ShipmentEntity>): Promise<ShipmentEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: ShipmentEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemoryShipments.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(id).update({
          ...updates,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update shipment in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async addCheckpoint(id: string, checkpoint: TrackingCheckpoint): Promise<ShipmentEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    // Set all previous checkpoints completed = true, current = false
    const updatedCheckpoints = existing.checkpoints.map((c) => ({
      ...c,
      completed: true,
      current: false,
    }));
    updatedCheckpoints.push(checkpoint);

    return this.update(id, {
      status: checkpoint.stage,
      checkpoints: updatedCheckpoints,
    });
  }

  async isWebhookProcessed(eventId: string): Promise<boolean> {
    if (!this.shouldUseFirestore()) {
      return inMemoryShippingWebhooks.has(eventId);
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.webhookCollection).doc(eventId).get();
      return doc.exists;
    } catch (error) {
      logger.warn('Firestore isWebhookProcessed shipping fallback to in-memory:', { eventId, error });
      return inMemoryShippingWebhooks.has(eventId);
    }
  }

  async recordWebhook(eventId: string): Promise<void> {
    inMemoryShippingWebhooks.add(eventId);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.webhookCollection).doc(eventId).set({
          id: eventId,
          processedAt: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Failed to record shipping webhook event in Firestore:', { eventId, error });
      }
    }
  }

  resetInMemory(): void {
    inMemoryShipments.clear();
    inMemoryShippingWebhooks.clear();
  }
}

export const shipmentRepository = new ShipmentRepository();
