import { PaymentEntity, WebhookEventRecord } from '../../types/payment.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IPaymentRepository {
  create(payment: PaymentEntity): Promise<PaymentEntity>;
  findById(id: string): Promise<PaymentEntity | null>;
  findByOrderId(orderId: string): Promise<PaymentEntity | null>;
  update(id: string, updates: Partial<PaymentEntity>): Promise<PaymentEntity | null>;
  isWebhookEventProcessed(eventId: string): Promise<boolean>;
  recordWebhookEvent(event: WebhookEventRecord): Promise<void>;
  resetInMemory?(): void;
}

const inMemoryPayments = new Map<string, PaymentEntity>();
const inMemoryWebhookEvents = new Set<string>();

export class PaymentRepository implements IPaymentRepository {
  private collectionName = 'payments';
  private webhookCollection = 'webhook_events';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(payment: PaymentEntity): Promise<PaymentEntity> {
    inMemoryPayments.set(payment.id, { ...payment });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(payment.id).set(payment);
      } catch (error) {
        logger.error('Failed to create payment record in Firestore:', { id: payment.id, error });
      }
    }

    return payment;
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryPayments.get(id) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return doc.data() as PaymentEntity;
    } catch (error) {
      logger.warn('Firestore findById payment fallback to in-memory:', { id, error });
      return inMemoryPayments.get(id) || null;
    }
  }

  async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    const memoryMatch = Array.from(inMemoryPayments.values()).find((p) => p.orderId === orderId);
    if (!this.shouldUseFirestore()) {
      return memoryMatch || null;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('orderId', '==', orderId)
        .limit(1)
        .get();

      if (snapshot.empty) return memoryMatch || null;
      return snapshot.docs[0].data() as PaymentEntity;
    } catch (error) {
      logger.warn('Firestore findByOrderId payment fallback to in-memory:', { orderId, error });
      return memoryMatch || null;
    }
  }

  async update(id: string, updates: Partial<PaymentEntity>): Promise<PaymentEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: PaymentEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemoryPayments.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(id).update({
          ...updates,
          updatedAt: updated.updatedAt,
        });
      } catch (error) {
        logger.error('Failed to update payment in Firestore:', { id, error });
      }
    }

    return updated;
  }

  async isWebhookEventProcessed(eventId: string): Promise<boolean> {
    if (!this.shouldUseFirestore()) {
      return inMemoryWebhookEvents.has(eventId);
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.webhookCollection).doc(eventId).get();
      return doc.exists;
    } catch (error) {
      logger.warn('Firestore webhook check fallback to memory:', { eventId, error });
      return inMemoryWebhookEvents.has(eventId);
    }
  }

  async recordWebhookEvent(event: WebhookEventRecord): Promise<void> {
    inMemoryWebhookEvents.add(event.id);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.webhookCollection).doc(event.id).set(event);
      } catch (error) {
        logger.error('Failed to record webhook event in Firestore:', { id: event.id, error });
      }
    }
  }

  resetInMemory(): void {
    inMemoryPayments.clear();
    inMemoryWebhookEvents.clear();
  }
}

export const paymentRepository = new PaymentRepository();
