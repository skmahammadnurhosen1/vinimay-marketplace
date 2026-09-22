export type SupportCategory =
  | 'ORDER_INQUIRY'
  | 'WRONG_PART_FITMENT'
  | 'RETURN_REFUND'
  | 'WARRANTY'
  | 'PAYMENT'
  | 'SELLER_ONBOARDING'
  | 'B2B_CREDIT'
  | 'TECHNICAL'
  | 'OTHER';

export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SupportStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_USER' | 'RESOLVED' | 'CLOSED';

export interface SupportMessage {
  id: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'SELLER' | 'B2B' | 'MANUFACTURER' | 'ADMIN' | 'SUPPORT_AGENT';
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface SupportTicketEntity {
  id: string; // e.g. `tkt_${uuid}`
  ticketNumber: string; // e.g. `TKT-2026-98124`
  userId: string;
  userRole: 'CUSTOMER' | 'SELLER' | 'B2B' | 'MANUFACTURER';
  userEmail: string;
  userName: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportStatus;
  referenceId?: string | null;
  subject: string;
  description: string;
  messages: SupportMessage[];
  assignedTo?: string | null;
  assignedStaffName?: string | null;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
