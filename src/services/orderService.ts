import {
  CustomerOrder,
  CustomerReturnRequest,
  CustomerWarrantyClaim,
  CustomerNotification,
  SupportTicket,
  ConfirmedOrder
} from '../types';
import {
  INITIAL_MOCK_ORDERS,
  INITIAL_MOCK_RETURNS,
  INITIAL_MOCK_WARRANTIES,
  INITIAL_MOCK_NOTIFICATIONS,
  INITIAL_MOCK_TICKETS
} from '../data/mockOrders';

class OrderService {
  private orders: CustomerOrder[] = [...INITIAL_MOCK_ORDERS];
  private returns: CustomerReturnRequest[] = [...INITIAL_MOCK_RETURNS];
  private warranties: CustomerWarrantyClaim[] = [...INITIAL_MOCK_WARRANTIES];
  private notifications: CustomerNotification[] = [...INITIAL_MOCK_NOTIFICATIONS];
  private tickets: SupportTicket[] = [...INITIAL_MOCK_TICKETS];

  // -----------------------------------------------------------
  // ORDERS
  // -----------------------------------------------------------
  getAllOrders(filter: string = 'all'): CustomerOrder[] {
    if (filter === 'all') return [...this.orders];
    if (filter === 'processing') {
      return this.orders.filter(o => o.overallStatus === 'processing');
    }
    if (filter === 'shipped') {
      return this.orders.filter(
        o => o.overallStatus === 'shipped' || o.overallStatus === 'partially_delivered'
      );
    }
    if (filter === 'delivered') {
      return this.orders.filter(o => o.overallStatus === 'delivered');
    }
    if (filter === 'returned') {
      return this.orders.filter(o => o.overallStatus === 'returned');
    }
    if (filter === 'cancelled') {
      return this.orders.filter(o => o.overallStatus === 'cancelled');
    }
    return [...this.orders];
  }

  getOrderById(id: string): CustomerOrder | undefined {
    return this.orders.find(o => o.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Sync an order placed in the current session into the order history
   */
  addConfirmedOrder(order: ConfirmedOrder): CustomerOrder {
    const customerOrder: CustomerOrder = {
      id: order.orderId,
      date: order.orderDate,
      overallStatus: 'processing',
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus === 'Paid' ? 'Paid' : 'Pending (Cash on Delivery)',
      paymentRef: order.paymentRef,
      deliveryAddress: order.customerAddress,
      vehicleContext: order.vehicleContext,
      packages: order.packages.map(pkg => ({
        ...pkg,
        trackingInfo: {
          packageId: pkg.packageId,
          trackingId: pkg.trackingId,
          courierPartner: pkg.courierPartner,
          currentStage: pkg.status,
          estimatedDelivery: pkg.estimatedDelivery,
          checkpoints: [
            {
              stage: 'ordered',
              title: 'Order Confirmed & Verified',
              description: 'Payment verified and merchant allocation created.',
              timestamp: 'Just now',
              location: 'Central Routing Hub',
              completed: true,
              current: true
            },
            {
              stage: 'packed',
              title: 'Packaging in Progress',
              description: 'Inspection and barcode scan scheduled at merchant warehouse.',
              timestamp: 'Pending',
              location: `${pkg.sellerCity} Facility`,
              completed: false,
              current: false
            },
            {
              stage: 'shipped',
              title: 'Dispatched with Courier',
              description: 'Awaiting linehaul vehicle departure.',
              timestamp: 'Pending',
              location: 'Transit Network',
              completed: false,
              current: false
            },
            {
              stage: 'out_for_delivery',
              title: 'Out for Delivery',
              description: 'Last-mile van delivery.',
              timestamp: 'Pending',
              location: `${order.customerAddress.city} Hub`,
              completed: false,
              current: false
            },
            {
              stage: 'delivered',
              title: 'Delivered',
              description: 'Signed and completed at customer location.',
              timestamp: 'Pending',
              location: `${order.customerAddress.city}`,
              completed: false,
              current: false
            }
          ]
        }
      })),
      subtotal: order.subtotal,
      discountTotal: order.discountTotal,
      shippingTotal: order.shippingTotal,
      gstAmount: order.gstAmount,
      totalPayable: order.totalPayable,
      isReturnEligible: false, // will become eligible when delivered
      isWarrantyEligible: false
    };

    // Prepend to list
    this.orders = [customerOrder, ...this.orders];

    // Add notification
    this.addNotification({
      type: 'order_confirmed',
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderId} containing ${order.packages.length} seller consignments has been confirmed.`,
      orderId: order.orderId
    });

    return customerOrder;
  }

  // -----------------------------------------------------------
  // RETURNS
  // -----------------------------------------------------------
  getReturnRequests(): CustomerReturnRequest[] {
    return [...this.returns];
  }

  getReturnRequestById(id: string): CustomerReturnRequest | undefined {
    return this.returns.find(r => r.id.toLowerCase() === id.toLowerCase());
  }

  submitReturnRequest(
    data: Omit<CustomerReturnRequest, 'id' | 'submittedDate' | 'status' | 'statusHistory'>
  ): CustomerReturnRequest {
    const id = `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newReturn: CustomerReturnRequest = {
      ...data,
      id,
      submittedDate: nowStr,
      status: 'submitted',
      statusHistory: [
        {
          status: 'submitted',
          title: 'Return Request Logged',
          date: `${nowStr}, Just now`,
          notes: `Reason selected: ${data.reason}`
        },
        {
          status: 'under_verification',
          title: 'Merchant Verification in Progress',
          date: 'Expected within 24 hours',
          notes: 'Merchant team verifies part compatibility and reason.'
        }
      ]
    };

    this.returns = [newReturn, ...this.returns];

    this.addNotification({
      type: 'return_update',
      title: `Return Logged • #${id}`,
      message: `Return request for ${data.product.title} has been logged. Pickup will be assigned following verification.`,
      referenceId: id
    });

    return newReturn;
  }

  updateReturnAdditionalInfo(id: string, notes: string): CustomerReturnRequest {
    const req = this.returns.find(r => r.id === id);
    if (!req) throw new Error('Return request not found');

    req.status = 'under_verification';
    req.additionalInfoPrompt = undefined;
    req.statusHistory.push({
      status: 'under_verification',
      title: 'Additional Information Uploaded by Customer',
      date: 'Just now',
      notes
    });

    return req;
  }

  // -----------------------------------------------------------
  // WARRANTY
  // -----------------------------------------------------------
  getWarrantyClaims(): CustomerWarrantyClaim[] {
    return [...this.warranties];
  }

  getWarrantyClaimById(id: string): CustomerWarrantyClaim | undefined {
    return this.warranties.find(w => w.id.toLowerCase() === id.toLowerCase());
  }

  submitWarrantyClaim(
    data: Omit<CustomerWarrantyClaim, 'id' | 'submittedDate' | 'status'>
  ): CustomerWarrantyClaim {
    const id = `WAR-2026-${Math.floor(5000 + Math.random() * 5000)}`;
    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newClaim: CustomerWarrantyClaim = {
      ...data,
      id,
      submittedDate: nowStr,
      status: 'submitted'
    };

    this.warranties = [newClaim, ...this.warranties];

    this.addNotification({
      type: 'warranty_update',
      title: `Warranty Claim Registered • #${id}`,
      message: `Warranty claim for ${data.product.title} (Part ${data.partNumber}) has been submitted for manufacturer inspection.`,
      referenceId: id
    });

    return newClaim;
  }

  updateWarrantyAdditionalInfo(id: string, notes: string): CustomerWarrantyClaim {
    const claim = this.warranties.find(w => w.id === id);
    if (!claim) throw new Error('Warranty claim not found');

    claim.status = 'under_review';
    claim.additionalInfoPrompt = undefined;
    claim.outcomeNotes = `Customer submitted supplemental documentation: ${notes}`;

    return claim;
  }

  // -----------------------------------------------------------
  // NOTIFICATIONS
  // -----------------------------------------------------------
  getNotifications(): CustomerNotification[] {
    return [...this.notifications];
  }

  markNotificationRead(id: string): void {
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
  }

  markAllNotificationsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  private addNotification(n: Omit<CustomerNotification, 'id' | 'timestamp' | 'read'>): void {
    const newNotif: CustomerNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    this.notifications = [newNotif, ...this.notifications];
  }

  // -----------------------------------------------------------
  // SUPPORT TICKETS
  // -----------------------------------------------------------
  getSupportTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  createSupportTicket(
    data: Omit<SupportTicket, 'id' | 'createdAt' | 'lastUpdate' | 'status'>
  ): SupportTicket {
    const id = `TCK-${Math.floor(8000 + Math.random() * 2000)}`;
    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newTicket: SupportTicket = {
      ...data,
      id,
      createdAt: nowStr,
      lastUpdate: 'Just now',
      status: 'Open'
    };

    this.tickets = [newTicket, ...this.tickets];
    return newTicket;
  }

  addTicketMessage(ticketId: string, text: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.messages.push({
      sender: 'customer',
      text,
      timestamp: 'Just now'
    });
    ticket.lastUpdate = 'Just now';

    // Auto simulated agent reply after short delay
    setTimeout(() => {
      ticket.messages.push({
        sender: 'support',
        text: 'Thank you for updating your ticket. Our technical support specialist has received your message and will review the fitment/consignment records shortly.',
        timestamp: 'Just now'
      });
      ticket.lastUpdate = 'Just now';
    }, 1000);
  }
}

export const orderService = new OrderService();
