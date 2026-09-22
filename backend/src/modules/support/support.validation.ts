import { z } from 'zod';

export const createSupportTicketSchema = z.object({
  category: z.enum([
    'ORDER_INQUIRY',
    'WRONG_PART_FITMENT',
    'RETURN_REFUND',
    'WARRANTY',
    'PAYMENT',
    'SELLER_ONBOARDING',
    'B2B_CREDIT',
    'TECHNICAL',
    'OTHER',
  ] as const),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  referenceId: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
});

export const addSupportReplySchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  attachments: z.array(z.string().url()).optional(),
});

export const assignSupportTicketSchema = z.object({
  assignedTo: z.string().min(1, 'Assigned staff ID is required'),
  assignedStaffName: z.string().min(1, 'Assigned staff name is required'),
});

export const resolveSupportTicketSchema = z.object({
  resolutionNotes: z.string().min(5, 'Resolution notes must be at least 5 characters'),
});
