import { Request, Response } from 'express';
import { notificationRepository } from './notification.repository.js';
import { notificationService } from './notification.service.js';
import {
  updateNotificationPreferencesSchema,
  adminBroadcastNotificationSchema,
} from './notification.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function listNotifications(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const { isRead, limit, offset } = req.query;
  const isReadBool = isRead !== undefined ? isRead === 'true' : undefined;
  const parsedLimit = limit ? parseInt(limit as string, 10) : 50;
  const parsedOffset = offset ? parseInt(offset as string, 10) : 0;

  const result = await notificationRepository.findByRecipient(req.user.uid, {
    isRead: isReadBool,
    limit: parsedLimit,
    offset: parsedOffset,
  });

  sendSuccess(res, result);
}

export async function getUnreadCount(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const result = await notificationRepository.findByRecipient(req.user.uid, { limit: 1 });
  sendSuccess(res, { unreadCount: result.unreadCount });
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const notification = await notificationRepository.findById(id);
  if (!notification) {
    sendError(res, 'Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
    return;
  }

  // Cross-tenant isolation check: Must belong to requesting user unless ADMIN
  if (notification.recipientId !== req.user.uid && req.user.role !== 'ADMIN') {
    sendError(res, 'You do not have permission to access this notification', 403, 'FORBIDDEN');
    return;
  }

  const updated = await notificationRepository.markAsRead(id);
  sendSuccess(res, { notification: updated });
}

export async function markAllNotificationsRead(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const updatedCount = await notificationRepository.markAllAsRead(req.user.uid);
  sendSuccess(res, { updatedCount, message: 'All notifications marked as read' });
}

export async function getNotificationPreferences(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const preferences = await notificationRepository.getPreferences(req.user.uid);
  sendSuccess(res, { preferences });
}

export async function updateNotificationPreferences(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = updateNotificationPreferencesSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const preferences = await notificationRepository.updatePreferences(req.user.uid, parseResult.data);
  sendSuccess(res, { preferences });
}

export async function adminBroadcastNotification(req: Request, res: Response): Promise<void> {
  const parseResult = adminBroadcastNotificationSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const result = await notificationService.broadcastToRole({
    ...parseResult.data,
    adminId: req.user?.uid || 'admin',
  });

  sendSuccess(res, result, 201);
}
