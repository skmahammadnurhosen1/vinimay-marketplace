import { randomUUID } from 'node:crypto';
import {
  NotificationEntity,
  NotificationChannel,
  NotificationEventType,
  NotificationReferenceType,
  NotificationRole,
} from '../../types/notification.js';
import { notificationRepository } from './notification.repository.js';
import { logger } from '../../utils/logger.js';

export interface SendNotificationPayload {
  recipientId: string;
  recipientRole: NotificationRole;
  channels?: NotificationChannel[];
  event: NotificationEventType;
  title: string;
  message: string;
  referenceId?: string | null;
  referenceType?: NotificationReferenceType | null;
  data?: Record<string, unknown>;
  recipientEmail?: string;
  recipientPhone?: string;
}

export interface NotificationDeliveryLog {
  channel: NotificationChannel;
  status: 'DELIVERED' | 'FAILED' | 'SKIPPED_USER_PREFERENCE';
  provider: string;
  reference?: string;
}

export class NotificationService {
  // Provider name holders (configurable via env)
  private emailProvider: string = process.env.NOTIFICATION_EMAIL_PROVIDER || 'mock';
  private smsProvider: string = process.env.NOTIFICATION_SMS_PROVIDER || 'mock';
  private whatsappProvider: string = process.env.NOTIFICATION_WHATSAPP_PROVIDER || 'mock';

  async sendNotification(payload: SendNotificationPayload): Promise<{
    notification: NotificationEntity;
    deliveryLogs: NotificationDeliveryLog[];
  }> {
    const requestedChannels = payload.channels || ['IN_APP', 'EMAIL', 'SMS'];
    const prefs = await notificationRepository.getPreferences(payload.recipientId);

    const deliveryLogs: NotificationDeliveryLog[] = [];
    const activeChannels: NotificationChannel[] = [];

    // 1. In-App Notification (Always enabled if preferred)
    if (requestedChannels.includes('IN_APP') && prefs.inAppEnabled !== false) {
      activeChannels.push('IN_APP');
      deliveryLogs.push({
        channel: 'IN_APP',
        status: 'DELIVERED',
        provider: 'firestore_feed',
      });
    }

    // 2. Email Notification
    if (requestedChannels.includes('EMAIL')) {
      if (prefs.emailEnabled) {
        activeChannels.push('EMAIL');
        logger.info(`[Email Notification Dispatched] to: ${payload.recipientEmail || payload.recipientId} | Event: ${payload.event} | Provider: ${this.emailProvider}`);
        deliveryLogs.push({
          channel: 'EMAIL',
          status: 'DELIVERED',
          provider: this.emailProvider,
          reference: `email_tx_${randomUUID().slice(0, 8)}`,
        });
      } else {
        deliveryLogs.push({
          channel: 'EMAIL',
          status: 'SKIPPED_USER_PREFERENCE',
          provider: this.emailProvider,
        });
      }
    }

    // 3. SMS Notification
    if (requestedChannels.includes('SMS')) {
      if (prefs.smsEnabled) {
        activeChannels.push('SMS');
        logger.info(`[SMS Notification Dispatched] to: ${payload.recipientPhone || payload.recipientId} | Event: ${payload.event} | Provider: ${this.smsProvider}`);
        deliveryLogs.push({
          channel: 'SMS',
          status: 'DELIVERED',
          provider: this.smsProvider,
          reference: `sms_tx_${randomUUID().slice(0, 8)}`,
        });
      } else {
        deliveryLogs.push({
          channel: 'SMS',
          status: 'SKIPPED_USER_PREFERENCE',
          provider: this.smsProvider,
        });
      }
    }

    // 4. WhatsApp Notification
    if (requestedChannels.includes('WHATSAPP')) {
      if (prefs.whatsappEnabled) {
        activeChannels.push('WHATSAPP');
        logger.info(`[WhatsApp Notification Dispatched] to: ${payload.recipientPhone || payload.recipientId} | Event: ${payload.event} | Provider: ${this.whatsappProvider}`);
        deliveryLogs.push({
          channel: 'WHATSAPP',
          status: 'DELIVERED',
          provider: this.whatsappProvider,
          reference: `wa_msg_${randomUUID().slice(0, 8)}`,
        });
      } else {
        deliveryLogs.push({
          channel: 'WHATSAPP',
          status: 'SKIPPED_USER_PREFERENCE',
          provider: this.whatsappProvider,
        });
      }
    }

    const newNotification: NotificationEntity = {
      id: `notif_${randomUUID()}`,
      recipientId: payload.recipientId,
      recipientRole: payload.recipientRole,
      channels: activeChannels,
      event: payload.event,
      title: payload.title,
      message: payload.message,
      referenceId: payload.referenceId || null,
      referenceType: payload.referenceType || null,
      data: payload.data || {},
      isRead: false,
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    const saved = await notificationRepository.create(newNotification);

    return {
      notification: saved,
      deliveryLogs,
    };
  }

  // Convenience helper for order events
  async notifyOrderEvent(params: {
    recipientId: string;
    recipientRole: NotificationRole;
    event: NotificationEventType;
    orderNumber: string;
    orderId: string;
    subOrderNumber?: string;
    amount?: number;
    recipientEmail?: string;
    recipientPhone?: string;
  }): Promise<void> {
    const titles: Record<string, string> = {
      ORDER_CREATED: `Order #${params.orderNumber} Placed Successfully`,
      ORDER_CONFIRMED: `Order #${params.orderNumber} Confirmed`,
      ORDER_STATUS_CHANGED: `Order #${params.orderNumber} Status Updated`,
      SHIPMENT_UPDATED: `Package for Order #${params.orderNumber} Shipped`,
      DELIVERY_COMPLETED: `Package for Order #${params.orderNumber} Delivered`,
      RETURN_REQUESTED: `Return Initiated for Order #${params.orderNumber}`,
      RETURN_STATUS_CHANGED: `Return Status Updated for Order #${params.orderNumber}`,
      REFUND_PROCESSED: `Refund Cleared for Order #${params.orderNumber}`,
    };

    const title = titles[params.event] || `Notification regarding Order #${params.orderNumber}`;
    const message = params.amount
      ? `${title}. Total value: ₹${params.amount.toLocaleString('en-IN')}.`
      : `${title}.`;

    await this.sendNotification({
      recipientId: params.recipientId,
      recipientRole: params.recipientRole,
      event: params.event,
      title,
      message,
      referenceId: params.orderId,
      referenceType: 'ORDER',
      data: {
        orderNumber: params.orderNumber,
        subOrderNumber: params.subOrderNumber,
        amount: params.amount,
      },
      recipientEmail: params.recipientEmail,
      recipientPhone: params.recipientPhone,
    });
  }

  // Convenience helper for admin broadcast
  async broadcastToRole(params: {
    targetRole: NotificationRole;
    title: string;
    message: string;
    adminId: string;
  }): Promise<{ queued: boolean; targetRole: string }> {
    logger.info(`[Admin Broadcast] to role: ${params.targetRole} | Title: ${params.title} | By: ${params.adminId}`);
    return { queued: true, targetRole: params.targetRole };
  }
}

export const notificationService = new NotificationService();
