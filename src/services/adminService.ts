import {
  AdminSeller,
  AdminSellerStatus,
  AdminDocumentVerificationStatus,
  AdminProductListing,
  AdminProductApprovalStatus,
  AdminCategory,
  AdminMasterOrder,
  AdminReturnRequest,
  ReturnLifecycleStage,
  ReturnStatus,
  AdminRefund,
  AdminWarrantyClaim,
  WarrantyOutcome,
  AdminSettlementLedgerEntry,
  AdminGSTRecord,
  AdminCustomer,
  AdminReviewItem,
  AdminSupportTicket,
  AdminUser,
  AdminRole,
  AdminAuditLog,
} from '../types/admin';

import {
  mockAdminSellers,
  mockAdminCategories,
  mockAdminProductListings,
  mockAdminMasterOrders,
  mockAdminReturns,
  mockAdminRefunds,
  mockAdminWarrantyClaims,
  mockAdminSettlementLedger,
  mockAdminGSTRecords,
  mockAdminCustomers,
  mockAdminReviews,
  mockAdminSupportTickets,
  mockAdminUsers,
  mockAdminAuditLogs,
} from '../data/mockAdminData';

class AdminService {
  private sellers: AdminSeller[] = [...mockAdminSellers];
  private categories: AdminCategory[] = [...mockAdminCategories];
  private products: AdminProductListing[] = [...mockAdminProductListings];
  private orders: AdminMasterOrder[] = [...mockAdminMasterOrders];
  private returns: AdminReturnRequest[] = [...mockAdminReturns];
  private refunds: AdminRefund[] = [...mockAdminRefunds];
  private warrantyClaims: AdminWarrantyClaim[] = [...mockAdminWarrantyClaims];
  private settlements: AdminSettlementLedgerEntry[] = [...mockAdminSettlementLedger];
  private gstRecords: AdminGSTRecord[] = [...mockAdminGSTRecords];
  private customers: AdminCustomer[] = [...mockAdminCustomers];
  private reviews: AdminReviewItem[] = [...mockAdminReviews];
  private tickets: AdminSupportTicket[] = [...mockAdminSupportTickets];
  private users: AdminUser[] = [...mockAdminUsers];
  private auditLogs: AdminAuditLog[] = [...mockAdminAuditLogs];

  private listeners: (() => void)[] = [];

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // --- KPI & Dashboard Metrics ---
  public getDashboardKPIs() {
    const gmv = this.orders.reduce((sum, o) => sum + o.totalAmount, 0) + 18400000;
    const totalOrders = 5420 + this.orders.length;
    const commission = this.orders.reduce((sum, o) => sum + o.platformCommissionTotal, 0) + 1842000;
    const activeSellers = this.sellers.filter((s) => s.accountStatus === 'Active').length;
    const pendingSellers = this.sellers.filter((s) => s.accountStatus === 'Pending' || s.accountStatus === 'Under Review').length;
    const pendingProducts = this.products.filter((p) => p.status === 'Pending Review').length;
    const pendingReturns = this.returns.filter((r) => r.status === 'Pending Review' || r.stage === 'Verification').length;
    const pendingWarranty = this.warrantyClaims.filter((w) => w.outcome === 'Pending').length;
    const pendingRefunds = this.refunds.filter((rf) => rf.status === 'Pending Approval').length;
    const pendingSettlements = this.settlements.filter((st) => st.status === 'Processing' || st.status === 'Upcoming').length;

    return {
      gmv,
      totalOrders,
      commission,
      activeSellers,
      totalSellers: this.sellers.length,
      registeredCustomers: 18950 + this.customers.length,
      totalCatalogSKUs: 3840 + this.products.length,
      actionRequired: {
        pendingSellers,
        pendingProducts,
        pendingReturns,
        pendingWarranty,
        pendingRefunds,
        pendingSettlements,
      },
    };
  }

  // --- Seller Operations ---
  public getSellers(): AdminSeller[] {
    return [...this.sellers];
  }

  public getSellerById(id: string): AdminSeller | undefined {
    return this.sellers.find((s) => s.id === id);
  }

  public updateSellerStatus(id: string, status: AdminSellerStatus) {
    this.sellers = this.sellers.map((s) =>
      s.id === id
        ? {
            ...s,
            accountStatus: status,
            kycStatus: status === 'Active' ? 'Verified' : status === 'Rejected' ? 'Rejected' : s.kycStatus,
          }
        : s
    );
    this.logAction('Seller Status Updated', 'Sellers', id, `Updated account status to ${status}`);
    this.notify();
  }

  public updateSellerCommission(id: string, newRate: number) {
    this.sellers = this.sellers.map((s) => (s.id === id ? { ...s, commissionRate: newRate } : s));
    this.logAction('Commission Override', 'Sellers', id, `Commission rate set to ${newRate}%`);
    this.notify();
  }

  public updateDocumentStatus(sellerId: string, docId: string, status: AdminDocumentVerificationStatus, notes?: string) {
    this.sellers = this.sellers.map((s) => {
      if (s.id !== sellerId) return s;
      const updatedDocs = s.documents.map((d) =>
        d.id === docId
          ? {
              ...d,
              status,
              verifiedDate: status === 'Verified' ? new Date().toISOString().slice(0, 10) : undefined,
              notes: notes || d.notes,
            }
          : d
      );
      const allVerified = updatedDocs.every((d) => d.status === 'Verified');
      return {
        ...s,
        documents: updatedDocs,
        kycStatus: allVerified ? 'Verified' : status === 'Requires Action' ? 'Requires Action' : s.kycStatus,
      };
    });
    this.logAction('KYC Document Verified', 'Sellers', `${sellerId}/${docId}`, `Doc status changed to ${status}`);
    this.notify();
  }

  // --- Product & Category Operations ---
  public getProducts(): AdminProductListing[] {
    return [...this.products];
  }

  public getCategories(): AdminCategory[] {
    return [...this.categories];
  }

  public updateProductStatus(productId: string, status: AdminProductApprovalStatus) {
    this.products = this.products.map((p) =>
      p.id === productId ? { ...p, status } : p
    );
    this.logAction('Product Approval Updated', 'Products', productId, `Status changed to ${status}`);
    this.notify();
  }

  public addCategory(name: string, subcategories: string[]) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: AdminCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      partCount: 0,
      sellerCount: 0,
      subcategories,
      iconName: 'Boxes',
    };
    this.categories.push(newCategory);
    this.logAction('New Category Created', 'Products', newCategory.id, `Category "${name}" added`);
    this.notify();
  }

  // --- Order Operations ---
  public getMasterOrders(): AdminMasterOrder[] {
    return [...this.orders];
  }

  public getMasterOrderById(orderId: string): AdminMasterOrder | undefined {
    return this.orders.find((o) => o.orderId === orderId);
  }

  // --- Return Operations ---
  public getReturns(): AdminReturnRequest[] {
    return [...this.returns];
  }

  public updateReturnStage(
    returnId: string,
    stage: ReturnLifecycleStage,
    status: ReturnStatus,
    adminNote?: string
  ) {
    this.returns = this.returns.map((r) =>
      r.id === returnId
        ? {
            ...r,
            stage,
            status,
            notes: adminNote ? `${r.notes ? r.notes + ' | ' : ''}${adminNote}` : r.notes,
          }
        : r
    );
    this.logAction('Return Lifecycle Advanced', 'Returns', returnId, `Stage: ${stage} | Status: ${status}`);
    this.notify();
  }

  // --- Refund Operations ---
  public getRefunds(): AdminRefund[] {
    return [...this.refunds];
  }

  public updateRefundStatus(
    refundId: string,
    status: 'Pending Approval' | 'Processing' | 'Completed' | 'Rejected' | 'Held',
    utrRef?: string
  ) {
    this.refunds = this.refunds.map((rf) =>
      rf.id === refundId
        ? {
            ...rf,
            status,
            processedDate: status === 'Completed' ? new Date().toISOString().slice(0, 10) : rf.processedDate,
            utrRef: utrRef || rf.utrRef || (status === 'Completed' ? `UTR-${Date.now().toString().slice(-8)}` : undefined),
          }
        : rf
    );
    this.logAction('Refund Status Updated', 'Refunds', refundId, `Refund marked as ${status}`);
    this.notify();
  }

  // --- Warranty Operations ---
  public getWarrantyClaims(): AdminWarrantyClaim[] {
    return [...this.warrantyClaims];
  }

  public updateWarrantyOutcome(
    claimId: string,
    outcome: WarrantyOutcome,
    stage: 'Submitted' | 'Technical Review' | 'Outcome Decided' | 'Fulfillment',
    technicalNotes?: string
  ) {
    this.warrantyClaims = this.warrantyClaims.map((wc) =>
      wc.id === claimId
        ? {
            ...wc,
            outcome,
            evaluationStage: stage,
            technicalNotes: technicalNotes || wc.technicalNotes,
          }
        : wc
    );
    this.logAction('Warranty Outcome Assigned', 'Warranty', claimId, `Outcome: ${outcome} (${stage})`);
    this.notify();
  }

  // --- Finance & GST Operations ---
  public getSettlements(): AdminSettlementLedgerEntry[] {
    return [...this.settlements];
  }

  public getGSTRecords(): AdminGSTRecord[] {
    return [...this.gstRecords];
  }

  public executeSettlement(settlementId: string) {
    const generatedUTR = `UTR-APH-${Date.now().toString().slice(-8)}`;
    this.settlements = this.settlements.map((st) =>
      st.id === settlementId
        ? {
            ...st,
            status: 'Settled',
            utrNumber: generatedUTR,
            settlementDate: new Date().toISOString().slice(0, 10),
          }
        : st
    );
    this.logAction('Settlement Disbursed', 'Finance', settlementId, `Disbursed with UTR ${generatedUTR}`);
    this.notify();
  }

  // --- Customers ---
  public getCustomers(): AdminCustomer[] {
    return [...this.customers];
  }

  public updateCustomerStatus(customerId: string, status: 'Active' | 'Suspended' | 'Flagged') {
    this.customers = this.customers.map((c) =>
      c.id === customerId ? { ...c, status } : c
    );
    this.logAction('Customer Status Changed', 'Customers', customerId, `Status: ${status}`);
    this.notify();
  }

  // --- Reviews ---
  public getReviews(): AdminReviewItem[] {
    return [...this.reviews];
  }

  public updateReviewStatus(
    reviewId: string,
    status: 'Pending Moderation' | 'Approved' | 'Flagged' | 'Spam/Hidden'
  ) {
    this.reviews = this.reviews.map((rv) => (rv.id === reviewId ? { ...rv, status } : rv));
    this.logAction('Review Moderated', 'Reviews', reviewId, `Status: ${status}`);
    this.notify();
  }

  // --- Support Tickets ---
  public getTickets(): AdminSupportTicket[] {
    return [...this.tickets];
  }

  public sendTicketReply(ticketId: string, adminReplyText: string, newStatus?: 'Open' | 'In Progress' | 'Resolved' | 'Closed') {
    this.tickets = this.tickets.map((t) => {
      if (t.id !== ticketId) return t;
      const newMessages = [
        ...t.messages,
        {
          sender: 'admin' as const,
          senderName: 'Platform Support Specialist',
          text: adminReplyText,
          timestamp: new Date().toLocaleString(),
        },
      ];
      return {
        ...t,
        status: newStatus || t.status,
        messages: newMessages,
      };
    });
    this.logAction('Ticket Reply Sent', 'Support', ticketId, `Admin reply added`);
    this.notify();
  }

  // --- Security, Users & RBAC ---
  public getUsers(): AdminUser[] {
    return [...this.users];
  }

  public toggleTwoFactor(userId: string) {
    this.users = this.users.map((u) =>
      u.id === userId ? { ...u, twoFactorEnabled: !u.twoFactorEnabled } : u
    );
    this.logAction('2FA Toggled', 'Security', userId, `Admin 2FA setting modified`);
    this.notify();
  }

  public updateUserRole(userId: string, newRole: AdminRole) {
    this.users = this.users.map((u) =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    this.logAction('RBAC Role Changed', 'Security', userId, `Role changed to ${newRole}`);
    this.notify();
  }

  // --- Audit Logs ---
  public getAuditLogs(): AdminAuditLog[] {
    return [...this.auditLogs];
  }

  private logAction(action: string, module: string, targetId: string, details: string) {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      adminName: 'Super Administrator',
      action,
      module,
      targetId,
      details,
    };
    this.auditLogs.unshift(newLog);
  }
}

export const adminService = new AdminService();
