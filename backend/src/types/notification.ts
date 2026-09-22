export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP';

export type NotificationRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'B2B' | 'MANUFACTURER' | 'SYSTEM';

export type NotificationEventType =
  | 'ORDER_CREATED'
  | 'ORDER_CONFIRMED'
  | 'ORDER_STATUS_CHANGED'
  | 'SHIPMENT_UPDATED'
  | 'DELIVERY_COMPLETED'
  | 'RETURN_REQUESTED'
  | 'RETURN_STATUS_CHANGED'
  | 'REFUND_PROCESSED'
  | 'WARRANTY_CLAIM_SUBMITTED'
  | 'WARRANTY_STATUS_CHANGED'
  | 'SELLER_APPROVED'
  | 'SELLER_REJECTED'
  | 'PRODUCT_APPROVED'
  | 'PRODUCT_REJECTED'
  | 'LOW_STOCK_ALERT'
  | 'SETTLEMENT_PROCESSED'
  | 'REVIEW_SUBMITTED'
  | 'REVIEW_MODERATED'
  | 'TICKET_CREATED'
  | 'TICKET_REPLIED'
  | 'TICKET_RESOLVED'
  | 'ADMIN_BROADCAST';

export type NotificationReferenceType =
  | 'ORDER'
  | 'SUB_ORDER'
  | 'SHIPMENT'
  | 'RETURN'
  | 'REFUND'
  | 'WARRANTY'
  | 'PRODUCT'
  | 'SETTLEMENT'
  | 'TICKET'
  | 'SELLER'
  | 'SYSTEM';

export interface NotificationEntity {
  id: string; // e.g. `notif_${uuid}`
  recipientId: string; // User UID
  recipientRole: NotificationRole;
  channels: NotificationChannel[];
  event: NotificationEventType;
  title: string;
  message: string;
  referenceId?: string | null;
  referenceType?: NotificationReferenceType | null;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationPreferencesEntity {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  inAppEnabled: boolean;
  eventOverrides?: Record<string, boolean>;
  updatedAt: string;
}
