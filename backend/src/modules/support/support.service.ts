import { randomUUID } from 'node:crypto';
import {
  SupportTicketEntity,
  SupportMessage,
  SupportCategory,
  SupportPriority,
  SupportStatus,
} from '../../types/support.js';
import { supportRepository } from './support.repository.js';
import { notificationService } from '../notifications/notification.service.js';

export class SupportService {
  async createTicket(params: {
    userId: string;
    userRole: 'CUSTOMER' | 'SELLER' | 'B2B' | 'MANUFACTURER';
    userEmail: string;
    userName: string;
    category: SupportCategory;
    priority?: SupportPriority;
    subject: string;
    description: string;
    referenceId?: string | null;
    attachments?: string[];
  }): Promise<SupportTicketEntity> {
    const now = new Date().toISOString();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const ticketNumber = `TKT-2026-${randomNum}`;

    const initialMessage: SupportMessage = {
      id: `msg_${randomUUID()}`,
      senderId: params.userId,
      senderRole: params.userRole,
      senderName: params.userName,
      message: params.description,
      attachments: params.attachments || [],
      createdAt: now,
    };

    const newTicket: SupportTicketEntity = {
      id: `tkt_${randomUUID()}`,
      ticketNumber,
      userId: params.userId,
      userRole: params.userRole,
      userEmail: params.userEmail,
      userName: params.userName,
      category: params.category,
      priority: params.priority || 'MEDIUM',
      status: 'OPEN',
      referenceId: params.referenceId || null,
      subject: params.subject,
      description: params.description,
      messages: [initialMessage],
      assignedTo: null,
      assignedStaffName: null,
      resolutionNotes: null,
      resolvedAt: null,
      closedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const created = await supportRepository.create(newTicket);

    // Notify user of ticket creation
    await notificationService.sendNotification({
      recipientId: params.userId,
      recipientRole: params.userRole,
      event: 'TICKET_CREATED',
      title: `Support Ticket #${ticketNumber} Created`,
      message: `Your support request regarding "${params.subject}" has been received. Our team will respond shortly.`,
      referenceId: created.id,
      referenceType: 'TICKET',
      recipientEmail: params.userEmail,
    });

    return created;
  }

  async addReply(params: {
    ticketId: string;
    senderId: string;
    senderRole: 'CUSTOMER' | 'SELLER' | 'B2B' | 'MANUFACTURER' | 'ADMIN' | 'SUPPORT_AGENT';
    senderName: string;
    message: string;
    attachments?: string[];
  }): Promise<SupportTicketEntity> {
    const ticket = await supportRepository.findById(params.ticketId);
    if (!ticket) {
      throw new Error('Support ticket not found');
    }

    if (ticket.status === 'CLOSED') {
      throw new Error('Cannot reply to a closed support ticket');
    }

    const now = new Date().toISOString();
    const newMessage: SupportMessage = {
      id: `msg_${randomUUID()}`,
      senderId: params.senderId,
      senderRole: params.senderRole,
      senderName: params.senderName,
      message: params.message,
      attachments: params.attachments || [],
      createdAt: now,
    };

    const isAdminSender = params.senderRole === 'ADMIN' || params.senderRole === 'SUPPORT_AGENT';
    const nextStatus: SupportStatus = isAdminSender ? 'WAITING_ON_USER' : 'IN_PROGRESS';

    const updated = await supportRepository.update(ticket.id, {
      status: nextStatus,
      messages: [...ticket.messages, newMessage],
    });

    // Notify recipient
    const recipientId = isAdminSender ? ticket.userId : (ticket.assignedTo || 'admin');
    const recipientRole = isAdminSender ? ticket.userRole : 'ADMIN';

    await notificationService.sendNotification({
      recipientId,
      recipientRole,
      event: 'TICKET_REPLIED',
      title: `New Reply on Support Ticket #${ticket.ticketNumber}`,
      message: `${params.senderName} replied: "${params.message.slice(0, 80)}${params.message.length > 80 ? '...' : ''}"`,
      referenceId: ticket.id,
      referenceType: 'TICKET',
      recipientEmail: isAdminSender ? ticket.userEmail : undefined,
    });

    return updated!;
  }

  async assignTicket(params: {
    ticketId: string;
    assignedTo: string;
    assignedStaffName: string;
  }): Promise<SupportTicketEntity> {
    const ticket = await supportRepository.findById(params.ticketId);
    if (!ticket) {
      throw new Error('Support ticket not found');
    }

    const updated = await supportRepository.update(ticket.id, {
      assignedTo: params.assignedTo,
      assignedStaffName: params.assignedStaffName,
      status: ticket.status === 'OPEN' ? 'IN_PROGRESS' : ticket.status,
    });

    return updated!;
  }

  async resolveTicket(params: {
    ticketId: string;
    resolutionNotes: string;
    adminId: string;
  }): Promise<SupportTicketEntity> {
    const ticket = await supportRepository.findById(params.ticketId);
    if (!ticket) {
      throw new Error('Support ticket not found');
    }

    const now = new Date().toISOString();
    const updated = await supportRepository.update(ticket.id, {
      status: 'RESOLVED',
      resolutionNotes: params.resolutionNotes,
      resolvedAt: now,
    });

    // Notify user of resolution
    await notificationService.sendNotification({
      recipientId: ticket.userId,
      recipientRole: ticket.userRole,
      event: 'TICKET_RESOLVED',
      title: `Support Ticket #${ticket.ticketNumber} Resolved`,
      message: `Your support ticket has been marked as resolved: ${params.resolutionNotes}`,
      referenceId: ticket.id,
      referenceType: 'TICKET',
      recipientEmail: ticket.userEmail,
    });

    return updated!;
  }
}

export const supportService = new SupportService();
