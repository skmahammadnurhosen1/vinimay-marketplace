import { Router } from 'express';
import {
  createTicket,
  listUserTickets,
  getTicketDetail,
  addTicketReply,
  listAdminTickets,
  assignTicket,
  resolveTicket,
} from './support.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';

export const supportRouter = Router();

// All support endpoints require authentication
supportRouter.use(requireAuthentication);

// User support ticket endpoints
supportRouter.post('/tickets', createTicket);
supportRouter.get('/tickets', listUserTickets);
supportRouter.get('/tickets/:id', getTicketDetail);
supportRouter.post('/tickets/:id/messages', addTicketReply);
supportRouter.post('/tickets/:id/reply', addTicketReply);

// Admin support ticket management
supportRouter.get('/admin/tickets', requireRole('ADMIN'), listAdminTickets);
supportRouter.patch('/admin/tickets/:id/assign', requireRole('ADMIN'), assignTicket);
supportRouter.patch('/admin/tickets/:id/status', requireRole('ADMIN'), resolveTicket);
supportRouter.post('/admin/tickets/:id/resolve', requireRole('ADMIN'), resolveTicket);
