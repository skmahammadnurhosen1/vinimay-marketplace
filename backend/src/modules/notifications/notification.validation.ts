import { z } from 'zod';

export const updateNotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
  whatsappEnabled: z.boolean().optional(),
  inAppEnabled: z.boolean().optional(),
  eventOverrides: z.record(z.boolean()).optional(),
});

export const adminBroadcastNotificationSchema = z.object({
  targetRole: z.enum(['CUSTOMER', 'SELLER', 'ADMIN', 'B2B', 'MANUFACTURER', 'SYSTEM']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  channels: z.array(z.enum(['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'])).optional(),
});
