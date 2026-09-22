import { Request, Response } from 'express';
import { supportRepository } from './support.repository.js';
import { supportService } from './support.service.js';
import {
  createSupportTicketSchema,
  addSupportReplySchema,
  assignSupportTicketSchema,
  resolveSupportTicketSchema,
} from './support.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { SupportCategory, SupportStatus } from '../../types/support.js';

export async function createTicket(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const parseResult = createSupportTicketSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const userRole = (req.user.role as 'CUSTOMER' | 'SELLER' | 'B2B' | 'MANUFACTURER') || 'CUSTOMER';
  const ticket = await supportService.createTicket({
    userId: req.user.uid,
    userRole,
    userEmail: req.user.email || 'support-user@autopartshub.com',
    userName: req.user.displayName || 'Marketplace User',
    ...parseResult.data,
  });

  sendSuccess(res, { ticket }, 201);
}

export async function listUserTickets(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const { status, category } = req.query;
  const tickets = await supportRepository.findByUserId(req.user.uid, {
    status: status as SupportStatus,
    category: category as SupportCategory,
  });

  sendSuccess(res, { tickets, count: tickets.length });
}

export async function getTicketDetail(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const ticket = await supportRepository.findById(id);
  if (!ticket) {
    sendError(res, 'Support ticket not found', 404, 'TICKET_NOT_FOUND');
    return;
  }

  // Cross-tenant isolation check: Must belong to user unless ADMIN
  if (ticket.userId !== req.user.uid && req.user.role !== 'ADMIN') {
    sendError(res, 'You do not have permission to view this support ticket', 403, 'FORBIDDEN');
    return;
  }

  sendSuccess(res, { ticket });
}

export async function addTicketReply(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const ticket = await supportRepository.findById(id);
  if (!ticket) {
    sendError(res, 'Support ticket not found', 404, 'TICKET_NOT_FOUND');
    return;
  }

  // Cross-tenant isolation check
  if (ticket.userId !== req.user.uid && req.user.role !== 'ADMIN') {
    sendError(res, 'You do not have permission to reply to this ticket', 403, 'FORBIDDEN');
    return;
  }

  const parseResult = addSupportReplySchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const senderRole = req.user.role === 'ADMIN' ? 'ADMIN' : (req.user.role as any) || 'CUSTOMER';
    const updatedTicket = await supportService.addReply({
      ticketId: id,
      senderId: req.user.uid,
      senderRole,
      senderName: req.user.displayName || (req.user.role === 'ADMIN' ? 'AutoPartsHub Support' : 'Customer'),
      ...parseResult.data,
    });
    sendSuccess(res, { ticket: updatedTicket });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add reply';
    sendError(res, message, 400, 'REPLY_FAILED');
  }
}

// ==============================================================================
// ADMIN SUPPORT WORKFLOWS
// ==============================================================================

export async function listAdminTickets(req: Request, res: Response): Promise<void> {
  const { status, category, assignedTo } = req.query;
  const tickets = await supportRepository.findAll({
    status: status as SupportStatus,
    category: category as SupportCategory,
    assignedTo: assignedTo as string,
  });

  sendSuccess(res, { tickets, count: tickets.length });
}

export async function assignTicket(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const parseResult = assignSupportTicketSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const updated = await supportService.assignTicket({
      ticketId: id,
      ...parseResult.data,
    });
    sendSuccess(res, { ticket: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Assignment failed';
    sendError(res, message, 400, 'ASSIGNMENT_FAILED');
  }
}

export async function resolveTicket(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const parseResult = resolveSupportTicketSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const updated = await supportService.resolveTicket({
      ticketId: id,
      resolutionNotes: parseResult.data.resolutionNotes,
      adminId: req.user?.uid || 'admin',
    });
    sendSuccess(res, { ticket: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Resolution failed';
    sendError(res, message, 400, 'RESOLUTION_FAILED');
  }
}
