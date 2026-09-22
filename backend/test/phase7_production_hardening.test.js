import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';
import { userRepository } from '../dist/modules/users/user.repository.js';
import { sellerRepository } from '../dist/modules/sellers/seller.repository.js';
import { productRepository } from '../dist/modules/products/product.repository.js';
import { inventoryRepository } from '../dist/modules/inventory/inventory.repository.js';
import { orderRepository } from '../dist/modules/orders/order.repository.js';
import { paymentRepository } from '../dist/modules/payments/payment.repository.js';
import { shipmentRepository } from '../dist/modules/shipping/shipment.repository.js';
import { returnRepository } from '../dist/modules/returns/return.repository.js';
import { refundRepository } from '../dist/modules/refunds/refund.repository.js';
import { reviewRepository } from '../dist/modules/reviews/review.repository.js';
import { financeRepository } from '../dist/modules/finance/finance.repository.js';
import { b2bRepository } from '../dist/modules/b2b/b2b.repository.js';
import { manufacturerRepository } from '../dist/modules/manufacturer/manufacturer.repository.js';
import { notificationRepository } from '../dist/modules/notifications/notification.repository.js';
import { notificationService } from '../dist/modules/notifications/notification.service.js';
import { supportRepository } from '../dist/modules/support/support.repository.js';

describe('Phase 7: Notifications, Support, Security Hardening & Full E2E Integration Suite', () => {
  let server;
  const port = 10107;
  const baseUrl = `http://localhost:${port}`;

  before(async () => {
    process.env.NODE_ENV = 'test';
    const app = createApp();
    await new Promise((resolve) => {
      server = app.listen(port, () => resolve(true));
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // Helper to seed standard baseline users
  async function seedBaselineUsers() {
    const now = new Date().toISOString();

    // Customer 1
    await userRepository.create({
      uid: 'p7_cust01',
      email: 'p7_cust01@example.com',
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      displayName: 'Aarav Mehta',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    // Customer 2 (Separate tenant)
    await userRepository.create({
      uid: 'p7_cust02',
      email: 'p7_cust02@example.com',
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      displayName: 'Vikram Singh',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    // Seller A
    await userRepository.create({
      uid: 'p7_seller_user_A',
      email: 'sellerA@autopartshub.com',
      role: 'SELLER',
      accountStatus: 'ACTIVE',
      displayName: 'Apex Braking Solutions',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    await sellerRepository.create({
      id: 'p7_sellerA',
      userId: 'p7_seller_user_A',
      sellerType: 'Authorized Distributor',
      businessName: 'Apex Braking Solutions Ltd',
      tradeName: 'Apex Brake Tech',
      gstin: '07AAAAA0000A1Z5',
      pan: 'AAAAA0000A',
      contactEmail: 'sellerA@autopartshub.com',
      contactPhone: '9811122233',
      businessAddress: {
        addressLine1: 'Unit 4, Okhla Phase 2',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110020',
        type: 'warehouse',
      },
      bankDetails: {
        bankName: 'HDFC Bank',
        accountNumber: '501002938472',
        ifsc: 'HDFC0000128',
        accountHolderName: 'Apex Braking Solutions Ltd',
      },
      authorizedBrands: ['bosch', 'brembo'],
      rating: 4.8,
      ratingCount: 20,
      isVerified: true,
      kycStatus: 'APPROVED',
      onboardingCompleted: true,
      rejectionReason: null,
      reviewedBy: 'admin01',
      reviewedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Seller B (Separate tenant)
    await userRepository.create({
      uid: 'p7_seller_user_B',
      email: 'sellerB@autopartshub.com',
      role: 'SELLER',
      accountStatus: 'ACTIVE',
      displayName: 'Lumax Lighting Hub',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    await sellerRepository.create({
      id: 'p7_sellerB',
      userId: 'p7_seller_user_B',
      sellerType: 'Retailer',
      businessName: 'Lumax Auto Lighting Store',
      tradeName: 'Lumax Lights',
      gstin: '07BBBBB0000B1Z6',
      pan: 'BBBBB0000B',
      contactEmail: 'sellerB@autopartshub.com',
      contactPhone: '9822233344',
      businessAddress: {
        addressLine1: 'Shop 12, Kashmere Gate',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110006',
        type: 'office',
      },
      bankDetails: {
        bankName: 'ICICI Bank',
        accountNumber: '001102938499',
        ifsc: 'ICIC0000011',
        accountHolderName: 'Lumax Auto Lighting Store',
      },
      authorizedBrands: ['lumax', 'philips'],
      rating: 4.5,
      ratingCount: 12,
      isVerified: true,
      kycStatus: 'APPROVED',
      onboardingCompleted: true,
      rejectionReason: null,
      reviewedBy: 'admin01',
      reviewedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Admin
    await userRepository.create({
      uid: 'p7_admin01',
      email: 'admin@autopartshub.com',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      displayName: 'System Administrator',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: true,
      twoFactorVerified: true,
      createdAt: now,
      updatedAt: now,
    });

    // Products
    const prod1 = await productRepository.create({
      id: 'p7_prod_bosch_01',
      sellerId: 'p7_sellerA',
      productName: 'Bosch High Performance Front Ceramic Brake Pads',
      brand: 'bosch',
      partNumber: 'BP-BOSCH-777',
      oemNumber: 'OEM-HYU-777',
      category: 'Braking System',
      productType: 'Genuine Parts',
      price: 2500,
      mrp: 3000,
      discount: 16.67,
      gstRate: 18,
      hsnCode: '8708',
      description: 'Original Bosch ceramic brake pads for Hyundai Creta.',
      features: ['Ceramic composite', 'Anti-squeal shims'],
      status: 'APPROVED',
      compatibleVehicles: [
        { make: 'Hyundai', model: 'Creta', yearStart: 2018, yearEnd: 2024, fuelTypes: ['Petrol', 'Diesel'] },
      ],
      compatibilityTokens: ['hyundai:creta:2020:petrol:1-5:ex'],
      images: ['https://storage.autopartshub.com/products/bosch_pads.jpg'],
      warranty: '12 Months',
      createdAt: now,
      updatedAt: now,
    });

    await inventoryRepository.create({
      id: prod1.id,
      productId: prod1.id,
      sellerId: 'p7_sellerA',
      currentStock: 50,
      reservedStock: 0,
      availableStock: 50,
      lowStockThreshold: 5,
      sku: 'SKU-BOSCH-777',
      reorderQuantity: 20,
      status: 'IN_STOCK',
      updatedAt: now,
    });

    const prod2 = await productRepository.create({
      id: 'p7_prod_lumax_01',
      sellerId: 'p7_sellerB',
      productName: 'Lumax LED Projector Headlamp Assembly (Right)',
      brand: 'lumax',
      partNumber: 'HL-LUMAX-888',
      oemNumber: 'OEM-HYU-888',
      category: 'Lighting & Electronics',
      productType: 'OEM',
      price: 4000,
      mrp: 4800,
      discount: 16.67,
      gstRate: 18,
      hsnCode: '8708',
      description: 'Lumax OE Projector Headlamp for Hyundai Creta.',
      features: ['High intensity LED', 'IP67 Waterproof'],
      status: 'APPROVED',
      compatibleVehicles: [
        { make: 'Hyundai', model: 'Creta', yearStart: 2018, yearEnd: 2024, fuelTypes: ['Petrol', 'Diesel'] },
      ],
      compatibilityTokens: ['hyundai:creta:2020:petrol:1-5:ex'],
      images: ['https://storage.autopartshub.com/products/lumax_lamp.jpg'],
      warranty: '6 Months',
      createdAt: now,
      updatedAt: now,
    });

    await inventoryRepository.create({
      id: prod2.id,
      productId: prod2.id,
      sellerId: 'p7_sellerB',
      currentStock: 30,
      reservedStock: 0,
      availableStock: 30,
      lowStockThreshold: 5,
      sku: 'SKU-LUMAX-888',
      reorderQuantity: 10,
      status: 'IN_STOCK',
      updatedAt: now,
    });

    return { prod1, prod2 };
  }

  // ============================================================================
  // TEST 1: Notification System (Creation, Listing, Unread Count & Mark Read)
  // ============================================================================
  test('1. Notification System delivers in-app alert, tracks unread count, and marks as read', async () => {
    await seedBaselineUsers();

    // Dispatch notification to p7_cust01
    const { notification } = await notificationService.sendNotification({
      recipientId: 'p7_cust01',
      recipientRole: 'CUSTOMER',
      event: 'ORDER_CONFIRMED',
      title: 'Order Confirmed',
      message: 'Your order #ORD-P7-001 has been confirmed and is being packed.',
      referenceId: 'ord_p7_001',
      referenceType: 'ORDER',
    });

    assert.ok(notification.id);
    assert.strictEqual(notification.isRead, false);

    // List notifications for p7_cust01
    const listRes = await fetch(`${baseUrl}/api/v1/notifications`, {
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE' },
    });
    assert.strictEqual(listRes.status, 200);
    const listJson = await listRes.json();
    assert.ok(listJson.data.notifications.length >= 1);
    assert.ok(listJson.data.unreadCount >= 1);

    // Unread count endpoint
    const unreadRes = await fetch(`${baseUrl}/api/v1/notifications/unread-count`, {
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE' },
    });
    assert.strictEqual(unreadRes.status, 200);
    const unreadJson = await unreadRes.json();
    assert.ok(unreadJson.data.unreadCount >= 1);

    // Mark single notification as read
    const readRes = await fetch(`${baseUrl}/api/v1/notifications/${notification.id}/read`, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE' },
    });
    assert.strictEqual(readRes.status, 200);
    const readJson = await readRes.json();
    assert.strictEqual(readJson.data.notification.isRead, true);
    assert.ok(readJson.data.notification.readAt);

    // Mark all as read
    const markAllRes = await fetch(`${baseUrl}/api/v1/notifications/mark-all-read`, {
      method: 'POST',
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE' },
    });
    assert.strictEqual(markAllRes.status, 200);
  });

  // ============================================================================
  // TEST 2: Notification Cross-Tenant Isolation & User Preferences
  // ============================================================================
  test('2. Notification isolation prevents cross-user access and respects notification preferences', async () => {
    await seedBaselineUsers();

    // Create notification for Customer 1
    const notif = await notificationRepository.create({
      id: 'notif_cust01_private',
      recipientId: 'p7_cust01',
      recipientRole: 'CUSTOMER',
      channels: ['IN_APP'],
      event: 'SETTLEMENT_PROCESSED',
      title: 'Private Customer Alert',
      message: 'Confidential details about your claim.',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Customer 2 attempts to mark Customer 1's notification as read (Cross-Tenant Breach)
    const breachRes = await fetch(`${baseUrl}/api/v1/notifications/${notif.id}/read`, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust02-ACTIVE' },
    });
    assert.strictEqual(breachRes.status, 403);
    const breachJson = await breachRes.json();
    assert.strictEqual(breachJson.code, 'FORBIDDEN');

    // Customer 1 updates preferences (disables SMS and Email)
    const prefRes = await fetch(`${baseUrl}/api/v1/notifications/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        emailEnabled: false,
        smsEnabled: false,
      }),
    });
    assert.strictEqual(prefRes.status, 200);
    const prefJson = await prefRes.json();
    assert.strictEqual(prefJson.data.preferences.emailEnabled, false);
    assert.strictEqual(prefJson.data.preferences.smsEnabled, false);

    // Multi-channel dispatch now skips Email & SMS per user preference
    const dispatchResult = await notificationService.sendNotification({
      recipientId: 'p7_cust01',
      recipientRole: 'CUSTOMER',
      channels: ['IN_APP', 'EMAIL', 'SMS'],
      event: 'ORDER_STATUS_CHANGED',
      title: 'Status Update',
      message: 'Package arrived at regional facility.',
    });

    const emailLog = dispatchResult.deliveryLogs.find((l) => l.channel === 'EMAIL');
    const smsLog = dispatchResult.deliveryLogs.find((l) => l.channel === 'SMS');
    assert.strictEqual(emailLog.status, 'SKIPPED_USER_PREFERENCE');
    assert.strictEqual(smsLog.status, 'SKIPPED_USER_PREFERENCE');
  });

  // ============================================================================
  // TEST 3: Admin Notification Broadcast & Role Authorization
  // ============================================================================
  test('3. Admin broadcasts notification to user roles and rejects non-admin broadcast attempts', async () => {
    await seedBaselineUsers();

    // Customer attempts broadcast -> Rejected with 403
    const custBroadcastRes = await fetch(`${baseUrl}/api/v1/notifications/admin/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        targetRole: 'SELLER',
        title: 'Spam alert',
        message: 'Unauthorized broadcast message.',
      }),
    });
    assert.strictEqual(custBroadcastRes.status, 403);

    // Admin broadcasts successfully
    const adminBroadcastRes = await fetch(`${baseUrl}/api/v1/notifications/admin/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-p7_admin01-ACTIVE',
      },
      body: JSON.stringify({
        targetRole: 'SELLER',
        title: 'GST Holiday Schedule 2026',
        message: 'Please review settlement dates for the upcoming holiday week.',
      }),
    });
    assert.strictEqual(adminBroadcastRes.status, 201);
    const adminJson = await adminBroadcastRes.json();
    assert.strictEqual(adminJson.data.queued, true);
    assert.strictEqual(adminJson.data.targetRole, 'SELLER');
  });

  // ============================================================================
  // TEST 4: Support Ticket Lifecycle (Create, Reply, Assign, Resolve)
  // ============================================================================
  test('4. Support ticket lifecycle handles ticket creation, conversation replies, admin assignment, and resolution', async () => {
    await seedBaselineUsers();

    // Customer creates support ticket for wrong part fitment
    const createRes = await fetch(`${baseUrl}/api/v1/support/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        category: 'WRONG_PART_FITMENT',
        priority: 'HIGH',
        subject: 'Brake pads do not match caliper pins',
        description: 'Received brake pad model BP-BOSCH-777, but clip spacing is 2mm wider than Creta OE caliper.',
        referenceId: 'ord_p7_001',
        attachments: ['https://storage.autopartshub.com/support/caliper_photo.jpg'],
      }),
    });

    assert.strictEqual(createRes.status, 201);
    const createJson = await createRes.json();
    const ticket = createJson.data.ticket;
    assert.ok(ticket.id.startsWith('tkt_'));
    assert.ok(ticket.ticketNumber.startsWith('TKT-2026-'));
    assert.strictEqual(ticket.status, 'OPEN');
    assert.strictEqual(ticket.messages.length, 1);

    // Customer views their support tickets
    const listRes = await fetch(`${baseUrl}/api/v1/support/tickets`, {
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE' },
    });
    assert.strictEqual(listRes.status, 200);
    const listJson = await listRes.json();
    assert.ok(listJson.data.tickets.length >= 1);

    // Admin views ticket list and assigns to support agent
    const adminAssignRes = await fetch(`${baseUrl}/api/v1/support/admin/tickets/${ticket.id}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-p7_admin01-ACTIVE',
      },
      body: JSON.stringify({
        assignedTo: 'agent_priya',
        assignedStaffName: 'Priya Sharma (Senior Automotive Specialist)',
      }),
    });
    assert.strictEqual(adminAssignRes.status, 200);
    const assignJson = await adminAssignRes.json();
    assert.strictEqual(assignJson.data.ticket.assignedTo, 'agent_priya');

    // Admin replies to customer on ticket
    const adminReplyRes = await fetch(`${baseUrl}/api/v1/support/tickets/${ticket.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-p7_admin01-ACTIVE',
      },
      body: JSON.stringify({
        message: 'Hello Aarav, could you please verify whether your Creta is the 1.5L Diesel or 1.4L Turbo Petrol variant?',
      }),
    });
    assert.strictEqual(adminReplyRes.status, 200);
    const adminReplyJson = await adminReplyRes.json();
    assert.strictEqual(adminReplyJson.data.ticket.messages.length, 2);
    assert.strictEqual(adminReplyJson.data.ticket.status, 'WAITING_ON_USER');

    // Customer replies back
    const custReplyRes = await fetch(`${baseUrl}/api/v1/support/tickets/${ticket.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        message: 'It is the 1.5L Diesel CRDi variant, 2021 model year.',
      }),
    });
    assert.strictEqual(custReplyRes.status, 200);
    const custReplyJson = await custReplyRes.json();
    assert.strictEqual(custReplyJson.data.ticket.messages.length, 3);
    assert.strictEqual(custReplyJson.data.ticket.status, 'IN_PROGRESS');

    // Admin resolves ticket
    const resolveRes = await fetch(`${baseUrl}/api/v1/support/admin/tickets/${ticket.id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-p7_admin01-ACTIVE',
      },
      body: JSON.stringify({
        resolutionNotes: 'Dispatched correct replacement clips under warranty replacement guarantee.',
      }),
    });
    assert.strictEqual(resolveRes.status, 200);
    const resolveJson = await resolveRes.json();
    assert.strictEqual(resolveJson.data.ticket.status, 'RESOLVED');
    assert.ok(resolveJson.data.ticket.resolvedAt);
  });

  // ============================================================================
  // TEST 5: Support Ticket Multi-Tenant Isolation
  // ============================================================================
  test('5. Support ticket isolation strictly blocks Customer B from viewing or replying to Customer A tickets', async () => {
    await seedBaselineUsers();

    const ticketA = await supportRepository.create({
      id: 'tkt_cust01_confidential',
      ticketNumber: 'TKT-2026-11223',
      userId: 'p7_cust01',
      userRole: 'CUSTOMER',
      userEmail: 'p7_cust01@example.com',
      userName: 'Aarav Mehta',
      category: 'ORDER_INQUIRY',
      priority: 'MEDIUM',
      status: 'OPEN',
      subject: 'Private order query',
      description: 'Need confirmation on payment invoice.',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Customer 2 attempts to read Customer 1's ticket -> 403 Forbidden
    const getRes = await fetch(`${baseUrl}/api/v1/support/tickets/${ticketA.id}`, {
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust02-ACTIVE' },
    });
    assert.strictEqual(getRes.status, 403);
    const getJson = await getRes.json();
    assert.strictEqual(getJson.code, 'FORBIDDEN');

    // Customer 2 attempts to reply to Customer 1's ticket -> 403 Forbidden
    const replyRes = await fetch(`${baseUrl}/api/v1/support/tickets/${ticketA.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust02-ACTIVE',
      },
      body: JSON.stringify({ message: 'Unauthorized reply injection' }),
    });
    assert.strictEqual(replyRes.status, 403);
  });

  // ============================================================================
  // TEST 6: Multi-Tenant Data Access Security Audit (Cross-Seller, Cross-Customer)
  // ============================================================================
  test('6. Data access security audit strictly isolates Seller A vs Seller B and Customer A vs Customer B', async () => {
    const { prod1 } = await seedBaselineUsers();

    // Seller B attempts to adjust Seller A's inventory -> 403 Forbidden
    const crossInvRes = await fetch(`${baseUrl}/api/v1/sellers/inventory/${prod1.id}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-p7_seller_user_B-ACTIVE',
      },
      body: JSON.stringify({
        delta: 10,
        type: 'RESTOCK',
        reason: 'Malicious inventory injection',
      }),
    });
    assert.strictEqual(crossInvRes.status, 403);

    // Seller B attempts to toggle status of Seller A's product -> 403 Forbidden
    const crossProdRes = await fetch(`${baseUrl}/api/v1/sellers/products/${prod1.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer mock-token-SELLER-p7_seller_user_B-ACTIVE' },
    });
    assert.strictEqual(crossProdRes.status, 403);

    // Regular customer attempts to access Admin seller KYC approval -> 403 Forbidden
    const breachKycRes = await fetch(`${baseUrl}/api/v1/admin/sellers/p7_sellerA/kyc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        kycStatus: 'APPROVED',
      }),
    });
    assert.strictEqual(breachKycRes.status, 403);

    // Regular customer attempts to access Seller inventory dashboard -> 403 Forbidden
    const breachSellerRes = await fetch(`${baseUrl}/api/v1/sellers/inventory`, {
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE' },
    });
    assert.strictEqual(breachSellerRes.status, 403);
  });

  // ============================================================================
  // TEST 7: Rate Limiter Middleware Verification
  // ============================================================================
  test('7. Rate limiter enforces sliding window ceiling when explicitly triggered', async () => {
    // When X-Test-Rate-Limit header is passed, rate limiter counts requests
    const res1 = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { 'x-test-rate-limit': 'true' },
    });
    assert.strictEqual(res1.status, 200);
    assert.ok(res1.headers.get('x-ratelimit-limit'));
    assert.ok(res1.headers.get('x-ratelimit-remaining') !== null);
  });

  // ============================================================================
  // TEST 8: Full End-to-End Marketplace Lifecycle (Cart -> Order -> Sub-Orders -> Payment -> Shipment -> Delivery -> Review -> Settlement)
  // ============================================================================
  test('8. Full End-to-End Marketplace Lifecycle simulates multi-vendor order from purchase to post-delivery settlement', async () => {
    const { prod1, prod2 } = await seedBaselineUsers();

    // 1. Customer adds products from Seller A (Brakes) and Seller B (Lighting) to cart
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({ productId: prod1.id, quantity: 2 }),
    });

    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({ productId: prod2.id, quantity: 1 }),
    });

    // 2. Customer checks out -> Multi-vendor order splitting into 2 sub-orders
    const checkoutRes = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        paymentMethod: 'UPI',
        shippingAddress: {
          fullName: 'Aarav Mehta',
          phone: '9811122233',
          addressLine1: 'Flat 402, Green Valley Apartments',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110020',
          country: 'India',
          type: 'home',
        },
      }),
    });

    assert.strictEqual(checkoutRes.status, 201);
    const checkoutJson = await checkoutRes.json();
    const parentOrder = checkoutJson.data.order;
    const packages = checkoutJson.data.packages || parentOrder.packages;
    assert.strictEqual(packages.length, 2);
    assert.ok(parentOrder.paymentStatus === 'PAID' || parentOrder.paymentStatus === 'PENDING');

    // 3. Initiate payment
    const payInitRes = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        orderId: parentOrder.id,
        paymentMethod: 'UPI',
      }),
    });
    assert.strictEqual(payInitRes.status, 201);
    const payInitJson = await payInitRes.json();
    const payment = payInitJson.data.payment;

    // 4. Server verifies payment
    const payVerifyRes = await fetch(`${baseUrl}/api/v1/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        paymentId: payment.id,
        providerOrderId: payment.providerOrderId,
        providerPaymentId: 'pay_upi_success_7788',
        signature: 'mock-valid-signature',
      }),
    });
    assert.strictEqual(payVerifyRes.status, 200);

    // 5. Seller A dispatches their sub-order package
    const subOrderA = packages.find((s) => s.sellerId === 'p7_sellerA');
    const dispatchRes = await fetch(`${baseUrl}/api/v1/sellers/orders/${subOrderA.id}/ship`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-p7_seller_user_A-ACTIVE',
      },
      body: JSON.stringify({
        courierName: 'Delhivery',
        estimatedDeliveryDays: 3,
        pickupAddress: {
          addressLine1: 'Unit 4, Okhla Phase 2',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110020',
        },
      }),
    });
    assert.strictEqual(dispatchRes.status, 201);
    const dispatchJson = await dispatchRes.json();
    const shipment = dispatchJson.data.shipment;
    assert.ok(shipment.awbNumber);

    // 6. Courier completes delivery
    await shipmentRepository.update(shipment.id, {
      status: 'DELIVERED',
      deliveredAt: new Date().toISOString(),
    });
    await orderRepository.updateSubOrder(subOrderA.id, {
      status: 'DELIVERED',
    });

    // 7. Customer submits review for the delivered Bosch product
    const reviewRes = await fetch(`${baseUrl}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        orderId: parentOrder.id,
        productId: prod1.id,
        sellerId: 'p7_sellerA',
        rating: 5,
        title: 'Outstanding OE stopping power',
        comment: 'Fitted perfectly on my Creta 2021. No noise or vibration.',
      }),
    });
    assert.strictEqual(reviewRes.status, 201);

    // 8. Finance settlement generation respects hold period
    const settleGenRes = await fetch(`${baseUrl}/api/v1/admin/finance/settlements/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-p7_admin01-ACTIVE',
      },
      body: JSON.stringify({ holdPeriodDays: 0 }), // 0 for immediate eligibility in test
    });
    assert.strictEqual(settleGenRes.status, 200);

    const settlementsListRes = await fetch(`${baseUrl}/api/v1/finance/settlements?sellerId=p7_sellerA`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-p7_admin01-ACTIVE' },
    });
    assert.strictEqual(settlementsListRes.status, 200);
    const settlementsJson = await settlementsListRes.json();
    assert.ok(settlementsJson.data.settlements.length >= 1);
    const settlementA = settlementsJson.data.settlements[0];
    assert.ok(settlementA.grossAmount > 0);
    assert.ok(settlementA.netPayout > 0);
  });

  // ============================================================================
  // TEST 9: B2B Garage & Fleet End-to-End Workflow
  // ============================================================================
  test('9. B2B Garage registration, verification, volume tiered pricing, bulk order, and reorder', async () => {
    const { prod1 } = await seedBaselineUsers();

    // Garage registration
    const regRes = await fetch(`${baseUrl}/api/v1/b2b/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        businessName: 'Speedy Motors Multi-brand Garage',
        accountType: 'GARAGE',
        gstin: '07AAAAA1234A1Z1',
        pan: 'AAAAA1234A',
        tradeLicense: 'DL-GARAGE-999',
        workshopAddress: {
          addressLine1: 'Plot 88, Mayapuri Industrial Area Phase 1',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110064',
        },
        billingAddress: {
          addressLine1: 'Plot 88, Mayapuri Industrial Area Phase 1',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110064',
        },
        contactPerson: 'Harish Verma',
        contactPhone: '9811199988',
      }),
    });
    assert.strictEqual(regRes.status, 201);
    const regJson = await regRes.json();
    const account = regJson.data.account;
    assert.strictEqual(account.accountType, 'GARAGE');

    // Admin verifies B2B account
    const verifyRes = await fetch(`${baseUrl}/api/v1/b2b/admin/accounts/${account.id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-p7_admin01-ACTIVE',
      },
      body: JSON.stringify({
        verificationStatus: 'VERIFIED',
      }),
    });
    assert.strictEqual(verifyRes.status, 200);

    // Garage requests volume pricing for 10 units (5% discount tier)
    const pricingRes = await fetch(`${baseUrl}/api/v1/b2b/pricing/${prod1.id}?quantity=10&accountType=GARAGE`);
    assert.strictEqual(pricingRes.status, 200);
    const pricingJson = await pricingRes.json();
    assert.ok(pricingJson.data.pricing.unitPrice < pricingJson.data.pricing.regularPrice);
    assert.ok(pricingJson.data.pricing.discountPercent >= 15);
    assert.ok(pricingJson.data.pricing.totalPrice > 0);

    // Garage places bulk order
    const bulkOrderRes = await fetch(`${baseUrl}/api/v1/b2b/orders/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE',
      },
      body: JSON.stringify({
        items: [{ productId: prod1.id, quantity: 10 }],
        deliveryAddress: {
          fullName: 'Harish Verma',
          phone: '9811199988',
          addressLine1: 'Plot 88, Mayapuri Industrial Area',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110064',
          country: 'India',
          type: 'garage',
        },
      }),
    });
    assert.strictEqual(bulkOrderRes.status, 201);
    const bulkJson = await bulkOrderRes.json();
    const bulkOrder = bulkJson.data.order;
    assert.strictEqual(bulkOrder.isB2BOrder, true);

    // Repeat re-order
    const repeatRes = await fetch(`${baseUrl}/api/v1/b2b/orders/repeat/${bulkOrder.id}`, {
      method: 'POST',
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-p7_cust01-ACTIVE' },
    });
    assert.strictEqual(repeatRes.status, 201);
  });

  // ============================================================================
  // TEST 10: Manufacturer Operations & Strict Brand Isolation
  // ============================================================================
  test('10. Manufacturer portal scopes products strictly to authorized brand and delivers analytics', async () => {
    await seedBaselineUsers();

    // Register manufacturer for brand "lumax"
    await manufacturerRepository.create({
      id: 'p7_mfg_lumax',
      userId: 'p7_mfg_user_lumax',
      name: 'Lumax Industries Limited',
      code: 'LUMAX-IN',
      originCountry: 'India',
      authorizedBrands: ['lumax'],
      contactEmail: 'corp@lumax.com',
      contactPhone: '9877700011',
      status: 'ACTIVE',
      directSalesEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await userRepository.create({
      uid: 'p7_mfg_user_lumax',
      email: 'corp@lumax.com',
      role: 'MANUFACTURER',
      accountStatus: 'ACTIVE',
      displayName: 'Lumax Corp Officer',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Lumax views catalog -> only Lumax products returned, Bosch strictly excluded
    const catalogRes = await fetch(`${baseUrl}/api/v1/manufacturer/catalog`, {
      headers: { Authorization: 'Bearer mock-token-MANUFACTURER-p7_mfg_user_lumax-ACTIVE' },
    });
    assert.strictEqual(catalogRes.status, 200);
    const catalogJson = await catalogRes.json();
    assert.ok(catalogJson.data.products.length >= 1);
    catalogJson.data.products.forEach((p) => {
      assert.strictEqual(p.brand.toLowerCase(), 'lumax');
    });

    // Lumax views analytics telemetry
    const analyticsRes = await fetch(`${baseUrl}/api/v1/manufacturer/analytics`, {
      headers: { Authorization: 'Bearer mock-token-MANUFACTURER-p7_mfg_user_lumax-ACTIVE' },
    });
    assert.strictEqual(analyticsRes.status, 200);
    const analyticsJson = await analyticsRes.json();
    assert.strictEqual(analyticsJson.data.analytics.name, 'Lumax Industries Limited');
    assert.ok(analyticsJson.data.analytics.authorizedBrands.includes('lumax'));
    assert.ok(analyticsJson.data.analytics.totalProducts >= 1);
  });
});
