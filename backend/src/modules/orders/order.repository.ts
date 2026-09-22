import {
  ParentOrderEntity,
  SellerSubOrderEntity,
  OrderStatus,
} from '../../types/order.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IOrderRepository {
  createParentOrder(order: ParentOrderEntity): Promise<ParentOrderEntity>;
  createSubOrder(subOrder: SellerSubOrderEntity): Promise<SellerSubOrderEntity>;
  findParentOrderById(id: string): Promise<ParentOrderEntity | null>;
  findParentOrdersByCustomer(customerId: string): Promise<ParentOrderEntity[]>;
  findSubOrdersByParentId(parentOrderId: string): Promise<SellerSubOrderEntity[]>;
  findSubOrderById(subOrderId: string): Promise<SellerSubOrderEntity | null>;
  findSubOrdersBySeller(sellerId: string): Promise<SellerSubOrderEntity[]>;
  updateParentOrderStatus(id: string, status: OrderStatus): Promise<ParentOrderEntity | null>;
  updateSubOrderStatus(id: string, status: OrderStatus): Promise<SellerSubOrderEntity | null>;
  updateSubOrder(id: string, updates: Partial<SellerSubOrderEntity>): Promise<SellerSubOrderEntity | null>;
  findAllParentOrders(): Promise<ParentOrderEntity[]>;
  findByCustomerId(customerId: string): Promise<ParentOrderEntity[]>;
  resetInMemory?(): void;
}

// In-Memory Stores
const inMemoryParentOrders = new Map<string, ParentOrderEntity>();
const inMemorySubOrders = new Map<string, SellerSubOrderEntity>();

export class OrderRepository implements IOrderRepository {
  private parentCollection = 'orders';
  private subOrderCollection = 'sub_orders';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async createParentOrder(order: ParentOrderEntity): Promise<ParentOrderEntity> {
    inMemoryParentOrders.set(order.id, { ...order });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.parentCollection).doc(order.id).set(order);
      } catch (error) {
        logger.error('Failed to create parent order in Firestore:', { orderId: order.id, error });
      }
    }

    return order;
  }

  async createSubOrder(subOrder: SellerSubOrderEntity): Promise<SellerSubOrderEntity> {
    inMemorySubOrders.set(subOrder.id, { ...subOrder });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.subOrderCollection).doc(subOrder.id).set(subOrder);
      } catch (error) {
        logger.error('Failed to create sub-order in Firestore:', { subOrderId: subOrder.id, error });
      }
    }

    return subOrder;
  }

  async findParentOrderById(id: string): Promise<ParentOrderEntity | null> {
    if (!this.shouldUseFirestore()) {
      const order = inMemoryParentOrders.get(id) || null;
      if (!order) {
        // Try searching by orderNumber
        for (const o of inMemoryParentOrders.values()) {
          if (o.orderNumber === id) return o;
        }
        return null;
      }
      return order;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.parentCollection).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as ParentOrderEntity;
    } catch (error) {
      logger.warn('Firestore findParentOrderById fallback to in-memory:', { id, error });
      return inMemoryParentOrders.get(id) || null;
    }
  }

  async findParentOrdersByCustomer(customerId: string): Promise<ParentOrderEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemoryParentOrders.values())
        .filter((o) => o.customerId === customerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.parentCollection)
        .where('customerId', '==', customerId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc) => doc.data() as ParentOrderEntity);
    } catch (error) {
      logger.warn('Firestore findParentOrdersByCustomer fallback to in-memory:', { customerId, error });
      return Array.from(inMemoryParentOrders.values()).filter((o) => o.customerId === customerId);
    }
  }

  async findSubOrdersByParentId(parentOrderId: string): Promise<SellerSubOrderEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemorySubOrders.values()).filter((s) => s.parentOrderId === parentOrderId);
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.subOrderCollection)
        .where('parentOrderId', '==', parentOrderId)
        .get();

      return snapshot.docs.map((doc) => doc.data() as SellerSubOrderEntity);
    } catch (error) {
      logger.warn('Firestore findSubOrdersByParentId fallback to in-memory:', { parentOrderId, error });
      return Array.from(inMemorySubOrders.values()).filter((s) => s.parentOrderId === parentOrderId);
    }
  }

  async findSubOrderById(subOrderId: string): Promise<SellerSubOrderEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemorySubOrders.get(subOrderId) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.subOrderCollection).doc(subOrderId).get();
      if (!doc.exists) return null;
      return doc.data() as SellerSubOrderEntity;
    } catch (error) {
      logger.warn('Firestore findSubOrderById fallback to in-memory:', { subOrderId, error });
      return inMemorySubOrders.get(subOrderId) || null;
    }
  }

  async findSubOrdersBySeller(sellerId: string): Promise<SellerSubOrderEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemorySubOrders.values())
        .filter((s) => s.sellerId === sellerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.subOrderCollection)
        .where('sellerId', '==', sellerId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc) => doc.data() as SellerSubOrderEntity);
    } catch (error) {
      logger.warn('Firestore findSubOrdersBySeller fallback to in-memory:', { sellerId, error });
      return Array.from(inMemorySubOrders.values()).filter((s) => s.sellerId === sellerId);
    }
  }

  async updateParentOrderStatus(id: string, status: OrderStatus): Promise<ParentOrderEntity | null> {
    const existing = await this.findParentOrderById(id);
    if (!existing) return null;

    const updated: ParentOrderEntity = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };

    inMemoryParentOrders.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.parentCollection).doc(id).update({
          status,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update parent order status in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async updateSubOrderStatus(id: string, status: OrderStatus): Promise<SellerSubOrderEntity | null> {
    const existing = await this.findSubOrderById(id);
    if (!existing) return null;

    const updated: SellerSubOrderEntity = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };

    inMemorySubOrders.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.subOrderCollection).doc(id).update({
          status,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update sub-order status in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async updateSubOrder(id: string, updates: Partial<SellerSubOrderEntity>): Promise<SellerSubOrderEntity | null> {
    const existing = await this.findSubOrderById(id);
    if (!existing) return null;

    const updated: SellerSubOrderEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemorySubOrders.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.subOrderCollection).doc(id).update({
          ...updates,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update sub-order in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async findAllParentOrders(): Promise<ParentOrderEntity[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemoryParentOrders.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.parentCollection).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc) => doc.data() as ParentOrderEntity);
    } catch (error) {
      logger.warn('Firestore findAllParentOrders fallback to in-memory:', { error });
      return Array.from(inMemoryParentOrders.values());
    }
  }

  async findByCustomerId(customerId: string): Promise<ParentOrderEntity[]> {
    return this.findParentOrdersByCustomer(customerId);
  }

  resetInMemory(): void {
    inMemoryParentOrders.clear();
    inMemorySubOrders.clear();
  }
}

export const orderRepository = new OrderRepository();
