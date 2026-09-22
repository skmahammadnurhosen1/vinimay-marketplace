import { getFirestore } from '../../config/firebase.js';
import { env } from '../../config/environment.js';
import { NotificationEntity, NotificationPreferencesEntity } from '../../types/notification.js';
import { logger } from '../../utils/logger.js';

const NOTIFICATIONS_COLLECTION = 'notifications';
const PREFERENCES_COLLECTION = 'notification_preferences';

export class NotificationRepository {
  private inMemoryNotifications: Map<string, NotificationEntity> = new Map();
  private inMemoryPreferences: Map<string, NotificationPreferencesEntity> = new Map();

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    this.inMemoryNotifications.set(notification.id, { ...notification });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(NOTIFICATIONS_COLLECTION).doc(notification.id).set(notification);
      } catch (error) {
        logger.error('Error creating notification in Firestore:', { error: String(error) });
      }
    }

    return notification;
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const memory = this.inMemoryNotifications.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(NOTIFICATIONS_COLLECTION).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as NotificationEntity;
          this.inMemoryNotifications.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding notification by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findByRecipient(
    recipientId: string,
    options?: { isRead?: boolean; limit?: number; offset?: number }
  ): Promise<{ notifications: NotificationEntity[]; total: number; unreadCount: number }> {
    let list: NotificationEntity[] = [];

    for (const notif of this.inMemoryNotifications.values()) {
      if (notif.recipientId === recipientId) {
        list.push({ ...notif });
      }
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = list.filter((n) => !n.isRead).length;

    if (options?.isRead !== undefined) {
      list = list.filter((n) => n.isRead === options.isRead);
    }

    const total = list.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    const paged = list.slice(offset, offset + limit);

    return { notifications: paged, total, unreadCount };
  }

  async markAsRead(id: string): Promise<NotificationEntity | null> {
    const notif = await this.findById(id);
    if (!notif) return null;

    const now = new Date().toISOString();
    const updated: NotificationEntity = {
      ...notif,
      isRead: true,
      readAt: now,
    };

    this.inMemoryNotifications.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(NOTIFICATIONS_COLLECTION).doc(id).update({
          isRead: true,
          readAt: now,
        });
      } catch (error) {
        logger.error('Error updating notification status in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    const now = new Date().toISOString();
    let updatedCount = 0;

    for (const [id, notif] of this.inMemoryNotifications.entries()) {
      if (notif.recipientId === recipientId && !notif.isRead) {
        this.inMemoryNotifications.set(id, {
          ...notif,
          isRead: true,
          readAt: now,
        });
        updatedCount++;
      }
    }

    if (this.shouldUseFirestore() && updatedCount > 0) {
      try {
        const db = getFirestore();
        const batch = db.batch();
        const snapshot = await db
          .collection(NOTIFICATIONS_COLLECTION)
          .where('recipientId', '==', recipientId)
          .where('isRead', '==', false)
          .get();

        snapshot.docs.forEach((doc) => {
          batch.update(doc.ref, { isRead: true, readAt: now });
        });
        await batch.commit();
      } catch (error) {
        logger.error('Error marking all notifications as read in Firestore:', { error: String(error) });
      }
    }

    return updatedCount;
  }

  async getPreferences(userId: string): Promise<NotificationPreferencesEntity> {
    const memory = this.inMemoryPreferences.get(userId);
    if (memory) return { ...memory };

    const defaults: NotificationPreferencesEntity = {
      userId,
      emailEnabled: true,
      smsEnabled: true,
      whatsappEnabled: true,
      inAppEnabled: true,
      eventOverrides: {},
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryPreferences.set(userId, defaults);
    return defaults;
  }

  async updatePreferences(
    userId: string,
    updates: Partial<Omit<NotificationPreferencesEntity, 'userId' | 'updatedAt'>>
  ): Promise<NotificationPreferencesEntity> {
    const current = await this.getPreferences(userId);
    const updated: NotificationPreferencesEntity = {
      ...current,
      ...updates,
      userId,
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryPreferences.set(userId, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(PREFERENCES_COLLECTION).doc(userId).set(updated, { merge: true });
      } catch (error) {
        logger.error('Error updating notification preferences in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }
}

export const notificationRepository = new NotificationRepository();
