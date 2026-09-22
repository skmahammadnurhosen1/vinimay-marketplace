import { getFirestore } from '../../config/firebase.js';
import { env } from '../../config/environment.js';
import { SupportTicketEntity, SupportStatus, SupportCategory } from '../../types/support.js';
import { logger } from '../../utils/logger.js';

const COLLECTION_NAME = 'support_tickets';

export class SupportRepository {
  private inMemoryTickets: Map<string, SupportTicketEntity> = new Map();

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(ticket: SupportTicketEntity): Promise<SupportTicketEntity> {
    this.inMemoryTickets.set(ticket.id, { ...ticket });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(ticket.id).set(ticket);
      } catch (error) {
        logger.error('Error creating support ticket in Firestore:', { error: String(error) });
      }
    }

    return ticket;
  }

  async findById(id: string): Promise<SupportTicketEntity | null> {
    const memory = this.inMemoryTickets.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(COLLECTION_NAME).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as SupportTicketEntity;
          this.inMemoryTickets.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding support ticket by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findByUserId(
    userId: string,
    filter?: { status?: SupportStatus; category?: SupportCategory }
  ): Promise<SupportTicketEntity[]> {
    let list: SupportTicketEntity[] = [];

    for (const ticket of this.inMemoryTickets.values()) {
      if (ticket.userId === userId) {
        if (filter?.status && ticket.status !== filter.status) continue;
        if (filter?.category && ticket.category !== filter.category) continue;
        list.push({ ...ticket });
      }
    }

    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return list;
  }

  async findAll(filter?: {
    status?: SupportStatus;
    category?: SupportCategory;
    assignedTo?: string;
  }): Promise<SupportTicketEntity[]> {
    let list: SupportTicketEntity[] = [];

    for (const ticket of this.inMemoryTickets.values()) {
      if (filter?.status && ticket.status !== filter.status) continue;
      if (filter?.category && ticket.category !== filter.category) continue;
      if (filter?.assignedTo && ticket.assignedTo !== filter.assignedTo) continue;
      list.push({ ...ticket });
    }

    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return list;
  }

  async update(id: string, updates: Partial<SupportTicketEntity>): Promise<SupportTicketEntity | null> {
    const ticket = await this.findById(id);
    if (!ticket) return null;

    const updated: SupportTicketEntity = {
      ...ticket,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryTickets.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(id).update(updated as any);
      } catch (error) {
        logger.error('Error updating support ticket in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }
}

export const supportRepository = new SupportRepository();
