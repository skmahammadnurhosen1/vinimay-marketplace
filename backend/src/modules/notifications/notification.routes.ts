import { Router } from 'express';
import {
  listNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  adminBroadcastNotification,
} from './notification.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';

export const notificationRouter = Router();

// All notification routes require authentication
notificationRouter.use(requireAuthentication);

// User notification endpoints
notificationRouter.get('/', listNotifications);
notificationRouter.get('/unread-count', getUnreadCount);
notificationRouter.patch('/:id/read', markNotificationRead);
notificationRouter.post('/mark-all-read', markAllNotificationsRead);
notificationRouter.get('/preferences', getNotificationPreferences);
notificationRouter.put('/preferences', updateNotificationPreferences);

// Admin notification broadcast
notificationRouter.post('/admin/broadcast', requireRole('ADMIN'), adminBroadcastNotification);
