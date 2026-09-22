import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';
import { sellerRepository } from '../dist/modules/sellers/seller.repository.js';
import { productRepository } from '../dist/modules/products/product.repository.js';
import { inventoryRepository } from '../dist/modules/inventory/inventory.repository.js';
import { orderRepository } from '../dist/modules/orders/order.repository.js';
import { paymentRepository } from '../dist/modules/payments/payment.repository.js';
import { shipmentRepository } from '../dist/modules/shipping/shipment.repository.js';
import { returnRepository } from '../dist/modules/returns/return.repository.js';
import { refundRepository } from '../dist/modules/refunds/refund.repository.js';
import { warrantyRepository } from '../dist/modules/warranty/warranty.repository.js';
import { userRepository } from '../dist/modules/users/user.repository.js';
import { financeRepository } from '../dist/modules/finance/finance.repository.js';
import { reviewRepository } from '../dist/modules/reviews/review.repository.js';
import { b2bRepository } from '../dist/modules/b2b/b2b.repository.js';
import { productVerificationRepository } from '../dist/modules/products/verification.repository.js';
import { manufacturerRepository } from '../dist/modules/manufacturer/manufacturer.repository.js';

describe('Phase 6 Admin + Finance + Reviews + B2B + Manufacturer Test Suite', () => {
  let server;
  let baseUrl;
  const PORT = 10106;

  before((_, done) => {
    process.env.PORT = String(PORT);
    process.env.NODE_ENV = 'test';
    const app = createApp();
    server = app.listen(PORT, () => {
      baseUrl = `http://localhost:${PORT}`;
      done();
    });
  });

  after((_, done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(() => {
    if (sellerRepository.resetInMemory) sellerRepository.resetInMemory();
    if (productRepository.resetInMemory) productRepository.resetInMemory();
    if (inventoryRepository.resetInMemory) inventoryRepository.resetInMemory();
    if (orderRepository.resetInMemory) orderRepository.resetInMemory();
    if (paymentRepository.resetInMemory) paymentRepository.resetInMemory();
    if (shipmentRepository.resetInMemory) shipmentRepository.resetInMemory();
    if (returnRepository.resetInMemory) returnRepository.resetInMemory();
    if (refundRepository.resetInMemory) refundRepository.resetInMemory();
    if (warrantyRepository.resetInMemory) warrantyRepository.resetInMemory();
    if (financeRepository.resetInMemory) financeRepository.resetInMemory();
    if (reviewRepository.resetInMemory) reviewRepository.resetInMemory();
    if (b2bRepository.resetInMemory) b2bRepository.resetInMemory();
    if (productVerificationRepository.resetInMemory) productVerificationRepository.resetInMemory();
    if (manufacturerRepository.resetInMemory) manufacturerRepository.resetInMemory();
    userRepository._clearMemory();
  });

  // Seed fixture for testing
  async function seedTestFixture() {
    const now = new Date().toISOString();

    // 1. Seller A (Delhi)
    const sellerA = await sellerRepository.create({
      id: 'sellerA',
      userId: 'seller_user_A',
      businessName: 'Apex Brake Tech Solutions',
      ownerName: 'Sunil Rao',
      mobile: '9876543211',
      email: 'sunil@apexbrakes.in',
      sellerType: 'Wholesaler',
      gstin: '07AAAAA0000A1Z5',
      pan: 'AAAAA0000A',
      kycStatus: 'APPROVED',
      businessAddress: {
        fullName: 'Sunil Rao',
        phone: '9876543211',
        addressLine1: 'Unit 4, Industrial Area Phase 2',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110020',
        type: 'warehouse',
      },
      bankDetails: {
        bankName: 'HDFC Bank',
        accountNumber: '501002938472',
        ifsc: 'HDFC0000128',
        accountHolderName: 'Apex Brake Tech Solutions',
      },
      authorizedBrands: ['bosch'],
      rating: 4.8,
      ratingCount: 15,
      isVerified: true,
      onboardingCompleted: true,
      rejectionReason: null,
      reviewedBy: 'admin01',
      reviewedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Product 1 (Bosch Brake Pads)
    const product1 = await productRepository.create({
      id: 'prod_bosch_01',
      sellerId: 'sellerA',
      productName: 'Bosch High Performance Front Brake Pads',
      brand: 'bosch',
      partNumber: 'BP-BOSCH-001',
      oemNumber: 'OEM-DEL-101',
      category: 'Braking System',
      productType: 'Genuine Parts',
      price: 2000,
      mrp: 2500,
      discount: 20,
      gstRate: 18,
      hsnCode: '8708',
      description: 'Original Bosch ceramic composite front brake pads.',
      features: ['Low noise', 'High thermal stability'],
      status: 'APPROVED',
      compatibleVehicles: [
        { make: 'Hyundai', model: 'Creta', yearStart: 2018, yearEnd: 2024, fuelTypes: ['Petrol', 'Diesel'] },
      ],
      compatibilityTokens: ['hyundai_creta_2020'],
      images: ['https://example.com/bosch_pads.jpg'],
      warranty: '6 months manufacturer warranty',
      createdAt: now,
      updatedAt: now,
    });

    await inventoryRepository.create({
      id: product1.id,
      productId: product1.id,
      sellerId: sellerA.id,
      currentStock: 100,
      reservedStock: 0,
      availableStock: 100,
      lowStockThreshold: 10,
      sku: 'SKU-BOSCH-001',
      status: 'IN_STOCK',
      lastRestockedAt: now,
      updatedAt: now,
    });

    // 3. User profiles (Customer, Seller, Admin)
    await userRepository.create({
      uid: 'cust01',
      email: 'customer01@example.com',
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      displayName: 'Rahul Sharma',
      phoneNumber: '+919999911111',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    await userRepository.create({
      uid: 'admin01',
      email: 'admin01@autopartshub.com',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      displayName: 'Platform Admin',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    return { sellerA, product1 };
  }

  // ============================================================================
  // TEST 1: Admin Authorization Guards (401/403)
  // ============================================================================
  test('1. Admin Authorization Guards reject unauthorized or non-admin users', async () => {
    // A: 401 without auth
    const resNoAuth = await fetch(`${baseUrl}/api/v1/admin/sellers`);
    assert.strictEqual(resNoAuth.status, 401, 'Should return 401 when token is missing');

    // B: 403 for CUSTOMER role
    const resCust = await fetch(`${baseUrl}/api/v1/admin/sellers`, {
      headers: { Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE' },
    });
    assert.strictEqual(resCust.status, 403, 'Should return 403 when customer tries to access admin endpoint');

    // C: 403 for SELLER role
    const resSeller = await fetch(`${baseUrl}/api/v1/admin/sellers`, {
      headers: { Authorization: 'Bearer mock-token-SELLER-seller01-ACTIVE' },
    });
    assert.strictEqual(resSeller.status, 403, 'Should return 403 when seller tries to access admin endpoint');

    // D: 200 for ADMIN role
    const resAdmin = await fetch(`${baseUrl}/api/v1/admin/sellers`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE' },
    });
    assert.strictEqual(resAdmin.status, 200, 'Should return 200 for admin user');
    const jsonAdmin = await resAdmin.json();
    assert.strictEqual(jsonAdmin.success, true);
    assert.ok(Array.isArray(jsonAdmin.data.sellers));
  });

  // ============================================================================
  // TEST 2: Admin Seller KYC Approval & Commission Rate Configuration
  // ============================================================================
  test('2. Admin approves seller KYC and configures negotiated commission rate', async () => {
    const now = new Date().toISOString();
    // Create pending seller
    const seller = await sellerRepository.create({
      id: 'seller_pending_1',
      userId: 'user_pending_1',
      businessName: 'Sharma Auto Spares',
      ownerName: 'Vikas Sharma',
      mobile: '9811223344',
      email: 'vikas@sharmaauto.com',
      sellerType: 'Retailer',
      gstin: '07BBBBB1111B1Z1',
      pan: 'BBBBB1111B',
      kycStatus: 'PENDING_VERIFICATION',
      businessAddress: {
        fullName: 'Vikas Sharma',
        phone: '9811223344',
        addressLine1: 'Shop 12, Kashmere Gate',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110006',
        type: 'warehouse',
      },
      bankDetails: {
        bankName: 'SBI',
        accountNumber: '1122334455',
        ifsc: 'SBIN0001234',
        accountHolderName: 'Sharma Auto Spares',
      },
      authorizedBrands: ['bosch'],
      rating: 0,
      ratingCount: 0,
      isVerified: false,
      onboardingCompleted: true,
      rejectionReason: null,
      createdAt: now,
      updatedAt: now,
    });

    // Admin approves seller KYC
    const kycRes = await fetch(`${baseUrl}/api/v1/admin/sellers/${seller.id}/kyc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });
    assert.strictEqual(kycRes.status, 200);
    const kycJson = await kycRes.json();
    assert.strictEqual(kycJson.data.seller.kycStatus, 'APPROVED');
    assert.strictEqual(kycJson.data.seller.isVerified, true);

    // Admin sets agreed commission rate override (e.g. 6.5%)
    const commRes = await fetch(`${baseUrl}/api/v1/admin/sellers/${seller.id}/commission`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({
        commissionRate: 6.5,
      }),
    });
    assert.strictEqual(commRes.status, 200);
    const commJson = await commRes.json();
    assert.strictEqual(commJson.data.agreedCommissionRate, 6.5);
  });

  // ============================================================================
  // TEST 3: Product Authenticity Verification Workflow
  // ============================================================================
  test('3. Product Authenticity Verification workflow (submission and admin approval)', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // Seller submits verification documents for Genuine Part
    const submitRes = await fetch(`${baseUrl}/api/v1/sellers/products/${product1.id}/verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer mock-token-SELLER-${sellerA.userId}-ACTIVE`,
      },
      body: JSON.stringify({
        documents: [
          {
            type: 'BRAND_AUTHORIZATION_LETTER',
            documentUrl: 'https://storage.autopartshub.com/verif/bosch_auth_letter.pdf',
            documentName: 'Bosch Authorized Dealership Letter 2026',
          },
          {
            type: 'OEM_CERTIFICATE',
            documentUrl: 'https://storage.autopartshub.com/verif/oem_cert.pdf',
            documentName: 'OEM Supply Certificate',
          },
        ],
      }),
    });
    assert.strictEqual(submitRes.status, 201);
    const submitJson = await submitRes.json();
    assert.strictEqual(submitJson.data.verification.status, 'PENDING_VERIFICATION');
    assert.strictEqual(submitJson.data.verification.documents.length, 2);

    // Admin reviews and approves authenticity
    const reviewRes = await fetch(`${baseUrl}/api/v1/admin/products/${product1.id}/authenticity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({
        status: 'VERIFIED_GENUINE',
        notes: 'Verified against Bosch India distributor registry',
      }),
    });
    assert.strictEqual(reviewRes.status, 200);
    const reviewJson = await reviewRes.json();
    assert.strictEqual(reviewJson.data.verification.status, 'VERIFIED_GENUINE');
    assert.strictEqual(reviewJson.data.verification.reviewedBy, 'admin01');

    // Verification details can be fetched
    const getRes = await fetch(`${baseUrl}/api/v1/sellers/products/${product1.id}/verification`, {
      headers: { Authorization: `Bearer mock-token-SELLER-${sellerA.userId}-ACTIVE` },
    });
    assert.strictEqual(getRes.status, 200);
    const getJson = await getRes.json();
    assert.strictEqual(getJson.data.verification.status, 'VERIFIED_GENUINE');
  });

  // ============================================================================
  // TEST 4: Commission Calculation (Category Default vs Seller Agreement)
  // ============================================================================
  test('4. Commission calculation with category default vs seller agreement override', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // Default rate for 'Braking System' is 8% in system config
    const calcCategory = await fetch(`${baseUrl}/api/v1/finance/commission-config`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE' },
    });
    const calcCategoryJson = await calcCategory.json();
    assert.strictEqual(calcCategoryJson.data.config.categoryRates['Braking System'], 8);

    // Override Seller A agreed rate to 5%
    await fetch(`${baseUrl}/api/v1/admin/sellers/${sellerA.id}/commission`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({ commissionRate: 5 }),
    });

    const updatedConfigRes = await fetch(`${baseUrl}/api/v1/finance/commission-config`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE' },
    });
    const updatedConfigJson = await updatedConfigRes.json();
    assert.strictEqual(updatedConfigJson.data.config.sellerAgreedRates[sellerA.id], 5);
  });

  // ============================================================================
  // TEST 5: Seller Settlement Lifecycle (Hold Period, Refunds, Payout)
  // ============================================================================
  test('5. Seller settlement lifecycle respects hold period, refund deductions, and payout', async () => {
    const { sellerA, product1 } = await seedTestFixture();
    const now = new Date();

    // Create a delivered order that was delivered 15 days ago (past standard 7-day return window)
    const orderDeliveredDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString();
    const parentOrderId = 'order_parent_settle_01';
    const subOrderId = 'pkg_settle_01';

    await orderRepository.createParentOrder({
      id: parentOrderId,
      orderNumber: 'ORD-SETTLE-001',
      customerId: 'cust01',
      subOrderIds: [subOrderId],
      totalAmount: 4000,
      totalTax: 720,
      totalShippingFee: 100,
      grandTotal: 4820,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9999911111',
        addressLine1: 'Flat 101, Delhi Heights',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
        country: 'India',
        type: 'home',
      },
      createdAt: orderDeliveredDate,
      updatedAt: orderDeliveredDate,
    });

    await orderRepository.createSubOrder({
      id: subOrderId,
      parentOrderId,
      subOrderNumber: 'PKG-SETTLE-001',
      sellerId: sellerA.id,
      items: [
        {
          productId: product1.id,
          sellerId: sellerA.id,
          productName: product1.productName,
          sku: 'SKU-BOSCH-001',
          price: 2000,
          quantity: 2,
          itemTotal: 4000,
          taxAmount: 720,
          shippingFee: 100,
        },
      ],
      packageTotal: 4000,
      subtotal: 4000,
      totalAmount: 4000,
      taxTotal: 720,
      shippingTotal: 100,
      grandTotal: 4820,
      status: 'DELIVERED',
      createdAt: orderDeliveredDate,
      updatedAt: orderDeliveredDate,
    });

    // Create a partial refund of 500 on this subOrder
    await refundRepository.create({
      id: 'ref_settle_01',
      orderId: parentOrderId,
      subOrderId,
      returnId: null,
      customerId: 'cust01',
      sellerId: sellerA.id,
      amount: 500,
      reason: 'Partial goodwill refund for delayed transit',
      status: 'COMPLETED',
      refundMethod: 'ORIGINAL_PAYMENT',
      transactionReference: 'REF_TXN_999',
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Run settlement generation
    const genRes = await fetch(`${baseUrl}/api/v1/admin/finance/settlements/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({ holdPeriodDays: 7 }),
    });
    assert.strictEqual(genRes.status, 200);
    const genJson = await genRes.json();
    assert.strictEqual(genJson.success, true);
    assert.ok(genJson.data.count >= 1);

    // List settlements
    const listRes = await fetch(`${baseUrl}/api/v1/finance/settlements?sellerId=${sellerA.id}`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE' },
    });
    assert.strictEqual(listRes.status, 200);
    const listJson = await listRes.json();
    const settlement = listJson.data.settlements[0];
    assert.ok(settlement, 'Settlement should be generated');
    assert.strictEqual(settlement.grossAmount, 4000);
    assert.strictEqual(settlement.refundDeductions, 500);
    assert.ok((settlement.netPayout || settlement.netPayable) < settlement.grossAmount);
    assert.strictEqual(settlement.status, 'ELIGIBLE');

    // Admin processes payout
    const payoutRes = await fetch(`${baseUrl}/api/v1/finance/settlements/payout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({
        settlementId: settlement.id,
        transactionRef: 'NEFT_AXIS_BANK_778899',
        notes: 'Monthly batch settlement cleared via NEFT',
      }),
    });
    assert.strictEqual(payoutRes.status, 200);
    const payoutJson = await payoutRes.json();
    assert.strictEqual(payoutJson.data.settlement.status, 'PAID');
    assert.strictEqual(payoutJson.data.settlement.transactionRef, 'NEFT_AXIS_BANK_778899');
  });

  // ============================================================================
  // TEST 6: Admin Customer Management Without Credential Leakage
  // ============================================================================
  test('6. Admin Customer Management lists users and modifies status safely', async () => {
    await seedTestFixture();

    const listRes = await fetch(`${baseUrl}/api/v1/admin/customers`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE' },
    });
    assert.strictEqual(listRes.status, 200);
    const listJson = await listRes.json();
    assert.ok(listJson.data.customers.length >= 1);

    const cust = listJson.data.customers.find((c) => c.uid === 'cust01');
    assert.ok(cust);
    assert.strictEqual(cust.displayName, 'Rahul Sharma');
    assert.strictEqual(cust.accountStatus, 'ACTIVE');
    assert.strictEqual(cust.password, undefined, 'Sensitive passwords must never leak');

    // Update customer status to SUSPENDED
    const patchRes = await fetch(`${baseUrl}/api/v1/admin/customers/cust01/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({ accountStatus: 'SUSPENDED' }),
    });
    assert.strictEqual(patchRes.status, 200);
    const patchJson = await patchRes.json();
    assert.strictEqual(patchJson.data.customer.accountStatus, 'SUSPENDED');
  });

  // ============================================================================
  // TEST 7: Review Verified Purchase Enforcement (403 for Non-Purchaser)
  // ============================================================================
  test('7. Review submission requires verified purchase (rejects non-purchaser with 403)', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // cust01 has NOT purchased product1 yet
    const reviewRes = await fetch(`${baseUrl}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
      body: JSON.stringify({
        productId: product1.id,
        sellerId: sellerA.id,
        rating: 5,
        title: 'Super fast braking!',
        comment: 'Installed on my Creta, completely eliminated squealing noises.',
      }),
    });

    assert.strictEqual(reviewRes.status, 403);
    const reviewJson = await reviewRes.json();
    assert.strictEqual(reviewJson.code, 'VERIFIED_PURCHASE_REQUIRED');
  });

  // ============================================================================
  // TEST 8: Review Submission, Moderation & Public Visibility
  // ============================================================================
  test('8. Verified Customer submits review, Admin approves, and public can view', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // Create delivered order for cust01 containing product1
    await orderRepository.createParentOrder({
      id: 'order_review_01',
      orderNumber: 'ORD-REV-001',
      customerId: 'cust01',
      subOrderIds: ['pkg_rev_01'],
      totalAmount: 2000,
      totalTax: 360,
      totalShippingFee: 50,
      grandTotal: 2410,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9999911111',
        addressLine1: 'Flat 101',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110001',
        country: 'India',
        type: 'home',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await orderRepository.createSubOrder({
      id: 'pkg_rev_01',
      parentOrderId: 'order_review_01',
      subOrderNumber: 'PKG-REV-001',
      sellerId: sellerA.id,
      items: [
        {
          productId: product1.id,
          sellerId: sellerA.id,
          productName: product1.productName,
          sku: 'SKU-BOSCH-001',
          price: 2000,
          quantity: 1,
          itemTotal: 2000,
          taxAmount: 360,
          shippingFee: 50,
        },
      ],
      packageTotal: 2000,
      taxTotal: 360,
      shippingTotal: 50,
      grandTotal: 2410,
      status: 'DELIVERED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 1. Submit review
    const submitRes = await fetch(`${baseUrl}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
      body: JSON.stringify({
        productId: product1.id,
        sellerId: sellerA.id,
        orderId: 'order_review_01',
        rating: 5,
        title: 'Authentic Bosch Pads',
        comment: 'Arrived with hologram intact. Excellent bite force and quality.',
        sellerRating: 5,
      }),
    });
    assert.strictEqual(submitRes.status, 201);
    const submitJson = await submitRes.json();
    const reviewId = submitJson.data.review.id;
    assert.strictEqual(submitJson.data.review.status, 'PENDING');
    assert.strictEqual(submitJson.data.review.verifiedPurchase, true);

    // 2. Public view should NOT show unapproved pending review
    const publicRes1 = await fetch(`${baseUrl}/api/v1/reviews/products/${product1.id}`);
    assert.strictEqual(publicRes1.status, 200);
    const publicJson1 = await publicRes1.json();
    assert.strictEqual(publicJson1.data.reviews.length, 0);

    // 3. Admin moderates and approves review
    const modRes = await fetch(`${baseUrl}/api/v1/admin/reviews/${reviewId}/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    assert.strictEqual(modRes.status, 200);

    // 4. Public view now shows approved review with updated rating summary
    const publicRes2 = await fetch(`${baseUrl}/api/v1/reviews/products/${product1.id}`);
    const publicJson2 = await publicRes2.json();
    assert.strictEqual(publicJson2.data.reviews.length, 1);
    assert.strictEqual(publicJson2.data.summary.averageRating, 5);
    assert.strictEqual(publicJson2.data.summary.totalReviews, 1);
  });

  // ============================================================================
  // TEST 9: Duplicate Review Prevention
  // ============================================================================
  test('9. Prevents duplicate review submission for the same product', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    await orderRepository.createParentOrder({
      id: 'order_dup_01',
      orderNumber: 'ORD-DUP-001',
      customerId: 'cust01',
      subOrderIds: ['pkg_dup_01'],
      totalAmount: 2000,
      totalTax: 360,
      totalShippingFee: 50,
      grandTotal: 2410,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9999911111',
        addressLine1: 'Flat 101',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110001',
        country: 'India',
        type: 'home',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await orderRepository.createSubOrder({
      id: 'pkg_dup_01',
      parentOrderId: 'order_dup_01',
      subOrderNumber: 'PKG-DUP-001',
      sellerId: sellerA.id,
      items: [
        {
          productId: product1.id,
          sellerId: sellerA.id,
          productName: product1.productName,
          sku: 'SKU-BOSCH-001',
          price: 2000,
          quantity: 1,
          itemTotal: 2000,
          taxAmount: 360,
          shippingFee: 50,
        },
      ],
      packageTotal: 2000,
      taxTotal: 360,
      shippingTotal: 50,
      grandTotal: 2410,
      status: 'DELIVERED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // First review
    const firstRes = await fetch(`${baseUrl}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
      body: JSON.stringify({
        productId: product1.id,
        sellerId: sellerA.id,
        rating: 4,
        title: 'Good parts',
        comment: 'Delivered promptly.',
      }),
    });
    assert.strictEqual(firstRes.status, 201);

    // Attempt second review for same product by same user
    const secondRes = await fetch(`${baseUrl}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
      body: JSON.stringify({
        productId: product1.id,
        sellerId: sellerA.id,
        rating: 5,
        title: 'Trying again',
        comment: 'Should be rejected as duplicate.',
      }),
    });
    assert.strictEqual(secondRes.status, 400);
    const secondJson = await secondRes.json();
    assert.strictEqual(secondJson.code, 'REVIEW_ALREADY_EXISTS');
  });

  // ============================================================================
  // TEST 10: B2B Account Registration & Verification
  // ============================================================================
  test('10. B2B Garage and Fleet account registration with GST/PAN and credit placeholder', async () => {
    // Register Garage B2B Account
    const regRes = await fetch(`${baseUrl}/api/v1/b2b/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
      body: JSON.stringify({
        accountType: 'GARAGE',
        businessName: 'Apex Motor Works & Tuning',
        tradeLicense: 'TRD-DL-2026-9988',
        gstin: '07AAAAA1111A1Z9',
        pan: 'AAAAA1111A',
        contactPerson: 'Sunil Verma',
        phone: '9876500001',
        address: {
          addressLine1: 'Plot 55, Okhla Industrial Area Phase 3',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110020',
        },
      }),
    });
    assert.strictEqual(regRes.status, 201);
    const regJson = await regRes.json();
    assert.strictEqual(regJson.data.account.accountType, 'GARAGE');
    assert.strictEqual(regJson.data.account.verificationStatus, 'PENDING');
    assert.strictEqual(regJson.data.account.creditStatus.status, 'NOT_ELIGIBLE');

    const accountId = regJson.data.account.id;

    // Admin verifies the B2B account
    const verifRes = await fetch(`${baseUrl}/api/v1/b2b/admin/accounts/${accountId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE',
      },
      body: JSON.stringify({
        verificationStatus: 'VERIFIED',
      }),
    });
    assert.strictEqual(verifRes.status, 200);
    const verifJson = await verifRes.json();
    assert.strictEqual(verifJson.data.account.verificationStatus, 'VERIFIED');
  });

  // ============================================================================
  // TEST 11: Dynamic B2B Volume Pricing Tiers
  // ============================================================================
  test('11. Dynamic B2B Tiered Pricing calculations for Garage and Fleet accounts', async () => {
    const { product1 } = await seedTestFixture();

    // Default base price: 2000
    // Configure tiered pricing for product1:
    // Quantity 1-4: 5% discount
    // Quantity 5-19: 10% discount
    // Quantity 20+: 15% discount
    await b2bRepository.setProductB2BPricing({
      productId: product1.id,
      baseB2BPrice: 2000,
      tiers: [
        { minQuantity: 5, price: 1800 },
        { minQuantity: 20, price: 1640 },
      ],
      garageDiscountPercent: 0,
      fleetDiscountPercent: 0,
    });

    // Lookup pricing for Garage account purchasing 10 units (should get 10% off)
    const garageRes = await fetch(
      `${baseUrl}/api/v1/b2b/pricing/${product1.id}?quantity=10&accountType=GARAGE`
    );
    assert.strictEqual(garageRes.status, 200);
    const garageJson = await garageRes.json();
    assert.strictEqual(garageJson.data.pricing.unitPrice, 1800, 'Price should be 2000 - 10% = 1800');
    assert.strictEqual(garageJson.data.pricing.totalPrice, 18000);

    // Lookup pricing for Fleet account purchasing 25 units (15% + 3% = 18% off)
    const fleetRes = await fetch(
      `${baseUrl}/api/v1/b2b/pricing/${product1.id}?quantity=25&accountType=FLEET`
    );
    assert.strictEqual(fleetRes.status, 200);
    const fleetJson = await fleetRes.json();
    assert.strictEqual(fleetJson.data.pricing.discountPercentage, 18);
    assert.strictEqual(fleetJson.data.pricing.unitPrice, 1640);
  });

  // ============================================================================
  // TEST 12: B2B Bulk Order Placement & Inventory Decrement
  // ============================================================================
  test('12. B2B Bulk Order creation generates sub-orders and decrements inventory', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // Create verified B2B account
    const b2bAccount = await b2bRepository.createAccount({
      id: 'b2b_acc_cust01',
      userId: 'cust01',
      accountType: 'GARAGE',
      businessName: 'Express Fleet Care',
      tradeLicense: 'TRD-998877',
      gstin: '07AAAAA2222A1Z3',
      pan: 'AAAAA2222A',
      contactPerson: 'Harish Mehta',
      phone: '9811002233',
      address: {
        addressLine1: 'B-12 Phase 1',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110020',
      },
      verificationStatus: 'VERIFIED',
      creditStatus: { status: 'NOT_ELIGIBLE', creditLimit: 0, availableCredit: 0, creditPeriodDays: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const stockBefore = (await inventoryRepository.findByProductId(product1.id)).availableStock;
    assert.strictEqual(stockBefore, 100);

    // Place bulk order of 20 units
    const bulkRes = await fetch(`${baseUrl}/api/v1/b2b/orders/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
      body: JSON.stringify({
        items: [
          {
            productId: product1.id,
            quantity: 20,
          },
        ],
        shippingAddress: {
          fullName: 'Harish Mehta',
          phone: '9811002233',
          addressLine1: 'B-12 Phase 1',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110020',
          country: 'India',
          type: 'warehouse',
        },
        paymentMethod: 'NET_BANKING',
      }),
    });

    assert.strictEqual(bulkRes.status, 201);
    const bulkJson = await bulkRes.json();
    assert.strictEqual(bulkJson.success, true);
    assert.ok(bulkJson.data.parentOrder.orderNumber.startsWith('B2B-'));
    assert.strictEqual(bulkJson.data.subOrders.length, 1);

    // Check inventory decreased from 100 to 80
    const stockAfter = (await inventoryRepository.findByProductId(product1.id)).availableStock;
    assert.strictEqual(stockAfter, 80);
  });

  // ============================================================================
  // TEST 13: B2B Repeat Order Flow with Stock Validation
  // ============================================================================
  test('13. B2B Repeat order re-validates stock and places new order successfully', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    const b2bAccount = await b2bRepository.createAccount({
      id: 'b2b_acc_repeat',
      userId: 'cust01',
      accountType: 'GARAGE',
      businessName: 'Express Fleet Care',
      tradeLicense: 'TRD-998877',
      gstin: '07AAAAA2222A1Z3',
      pan: 'AAAAA2222A',
      contactPerson: 'Harish Mehta',
      phone: '9811002233',
      address: {
        addressLine1: 'B-12 Phase 1',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110020',
      },
      verificationStatus: 'VERIFIED',
      creditStatus: { status: 'NOT_ELIGIBLE', creditLimit: 0, availableCredit: 0, creditPeriodDays: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Place initial bulk order of 10 units
    const firstBulk = await fetch(`${baseUrl}/api/v1/b2b/orders/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
      body: JSON.stringify({
        items: [{ productId: product1.id, quantity: 10 }],
        shippingAddress: {
          fullName: 'Harish Mehta',
          phone: '9811002233',
          addressLine1: 'B-12 Phase 1',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110020',
          country: 'India',
          type: 'warehouse',
        },
        paymentMethod: 'UPI',
      }),
    });
    const firstJson = await firstBulk.json();
    const prevOrderId = firstJson.data.parentOrder.id;

    // Trigger repeat order
    const repeatRes = await fetch(`${baseUrl}/api/v1/b2b/orders/repeat/${prevOrderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-cust01-ACTIVE',
      },
    });

    assert.strictEqual(repeatRes.status, 201);
    const repeatJson = await repeatRes.json();
    assert.strictEqual(repeatJson.success, true);
    assert.notStrictEqual(repeatJson.data.parentOrder.id, prevOrderId, 'Must generate fresh order ID');
  });

  // ============================================================================
  // TEST 14: GST Invoice Generation (Intra-state CGST+SGST vs Inter-state IGST)
  // ============================================================================
  test('14. GST Invoice generation produces tax breakdown (intra-state CGST/SGST vs inter-state IGST)', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // Case A: Intra-state (Seller in Delhi, Customer in Delhi) -> 9% CGST + 9% SGST
    const parentOrderDelhi = await orderRepository.createParentOrder({
      id: 'ord_gst_delhi',
      orderNumber: 'ORD-GST-DL-01',
      customerId: 'cust01',
      subOrderIds: ['pkg_gst_delhi'],
      totalAmount: 2000,
      totalTax: 360,
      totalShippingFee: 0,
      grandTotal: 2360,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9999911111',
        addressLine1: 'Flat 101',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
        country: 'India',
        type: 'home',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await orderRepository.createSubOrder({
      id: 'pkg_gst_delhi',
      parentOrderId: parentOrderDelhi.id,
      subOrderNumber: 'PKG-GST-DL-01',
      sellerId: sellerA.id,
      items: [
        {
          productId: product1.id,
          sellerId: sellerA.id,
          productName: product1.productName,
          sku: 'SKU-BOSCH-001',
          price: 2000,
          quantity: 1,
          itemTotal: 2000,
          taxAmount: 360,
          shippingFee: 0,
        },
      ],
      packageTotal: 2000,
      taxTotal: 360,
      shippingTotal: 0,
      grandTotal: 2360,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const invoiceRes = await fetch(`${baseUrl}/api/v1/finance/invoices/order/${parentOrderDelhi.id}`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE' },
    });
    assert.strictEqual(invoiceRes.status, 200);
    const invoiceJson = await invoiceRes.json();
    const invoice = invoiceJson.data.invoice;
    assert.strictEqual(invoice.isInterState, false);
    assert.ok(invoice.cgst > 0, 'Intra-state invoice must have CGST');
    assert.ok(invoice.sgst > 0, 'Intra-state invoice must have SGST');
    assert.strictEqual(invoice.igst, 0, 'Intra-state invoice must have zero IGST');
    assert.strictEqual(invoice.items[0].hsnCode, '8708');

    // Case B: Inter-state (Seller in Delhi, Customer in Maharashtra) -> 18% IGST
    const parentOrderMumbai = await orderRepository.createParentOrder({
      id: 'ord_gst_mumbai',
      orderNumber: 'ORD-GST-MH-01',
      customerId: 'cust01',
      subOrderIds: ['pkg_gst_mumbai'],
      totalAmount: 2000,
      totalTax: 360,
      totalShippingFee: 0,
      grandTotal: 2360,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      shippingAddress: {
        fullName: 'Amit Deshmukh',
        phone: '9822001122',
        addressLine1: 'Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400053',
        country: 'India',
        type: 'home',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await orderRepository.createSubOrder({
      id: 'pkg_gst_mumbai',
      parentOrderId: parentOrderMumbai.id,
      subOrderNumber: 'PKG-GST-MH-01',
      sellerId: sellerA.id,
      items: [
        {
          productId: product1.id,
          sellerId: sellerA.id,
          productName: product1.productName,
          sku: 'SKU-BOSCH-001',
          price: 2000,
          quantity: 1,
          itemTotal: 2000,
          taxAmount: 360,
          shippingFee: 0,
        },
      ],
      packageTotal: 2000,
      taxTotal: 360,
      shippingTotal: 0,
      grandTotal: 2360,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const invoiceResB = await fetch(`${baseUrl}/api/v1/finance/invoices/order/${parentOrderMumbai.id}`, {
      headers: { Authorization: 'Bearer mock-token-ADMIN-admin01-ACTIVE' },
    });
    assert.strictEqual(invoiceResB.status, 200);
    const invoiceJsonB = await invoiceResB.json();
    const invoiceB = invoiceJsonB.data.invoice;
    assert.strictEqual(invoiceB.isInterState, true);
    assert.strictEqual(invoiceB.cgst, 0, 'Inter-state invoice must have zero CGST');
    assert.strictEqual(invoiceB.sgst, 0, 'Inter-state invoice must have zero SGST');
    assert.ok(invoiceB.igst > 0, 'Inter-state invoice must have IGST');
  });

  // ============================================================================
  // TEST 15: Manufacturer Profile & Brand Data Isolation
  // ============================================================================
  test('15. Manufacturer portal data is strictly isolated to authorized brand', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // Seed a second product from a different brand (e.g. Brembo)
    const productBrembo = await productRepository.create({
      id: 'prod_brembo_01',
      sellerId: sellerA.id,
      productName: 'Brembo Ceramic Disc Rotors',
      brand: 'brembo',
      partNumber: 'BRM-001',
      category: 'Braking System',
      productType: 'OEM Parts',
      price: 6000,
      mrp: 7500,
      discount: 20,
      gstRate: 18,
      hsnCode: '8708',
      description: 'Brembo high performance rotors.',
      features: ['Ventilated'],
      status: 'APPROVED',
      compatibleVehicles: [],
      compatibilityTokens: [],
      images: ['https://example.com/brembo.jpg'],
      warranty: '1 year warranty',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create Manufacturer entity for Bosch (brand: 'bosch')
    await manufacturerRepository.create({
      id: 'mfg_bosch',
      userId: 'mfg_bosch_user',
      name: 'Bosch Automotive India',
      code: 'BOSCH-IN',
      originCountry: 'India',
      authorizedBrands: ['bosch'],
      contactEmail: 'automotive@in.bosch.com',
      contactPhone: '+918022220000',
      status: 'ACTIVE',
      directSalesEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Register user profile
    await userRepository.create({
      uid: 'mfg_bosch_user',
      email: 'automotive@in.bosch.com',
      role: 'MANUFACTURER',
      accountStatus: 'ACTIVE',
      displayName: 'Bosch India OEM Division',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Manufacturer queries their brand catalog
    const catalogRes = await fetch(`${baseUrl}/api/v1/manufacturer/catalog`, {
      headers: { Authorization: 'Bearer mock-token-MANUFACTURER-mfg_bosch_user-ACTIVE' },
    });
    assert.strictEqual(catalogRes.status, 200);
    const catalogJson = await catalogRes.json();
    assert.strictEqual(catalogJson.success, true);
    // Should contain Bosch product but NOT Brembo product
    const brands = catalogJson.data.products.map((p) => p.brand.toLowerCase());
    assert.ok(brands.includes('bosch'), 'Catalog must include Bosch products');
    assert.ok(!brands.includes('brembo'), 'Catalog must NOT include non-authorized Brembo products');
  });

  // ============================================================================
  // TEST 16: Manufacturer Analytics (Sales, Dealer Network, Defect/Warranty)
  // ============================================================================
  test('16. Manufacturer analytics aggregates sales, dealers, and warranty defect telemetry', async () => {
    const { sellerA, product1 } = await seedTestFixture();

    // Seed manufacturer
    await manufacturerRepository.create({
      id: 'mfg_bosch_analytics',
      userId: 'mfg_user_analytics',
      name: 'Bosch Automotive India',
      code: 'BOSCH-IN',
      originCountry: 'India',
      authorizedBrands: ['bosch'],
      contactEmail: 'analytics@bosch.com',
      contactPhone: '9900011223',
      status: 'ACTIVE',
      directSalesEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await userRepository.create({
      uid: 'mfg_user_analytics',
      email: 'analytics@bosch.com',
      role: 'MANUFACTURER',
      accountStatus: 'ACTIVE',
      displayName: 'Bosch Analytics',
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add a warranty claim for the Bosch product
    await warrantyRepository.create({
      id: 'claim_mfg_01',
      orderId: 'ord_warr_01',
      subOrderId: 'pkg_warr_01',
      productId: product1.id,
      customerId: 'cust01',
      sellerId: sellerA.id,
      brand: 'bosch',
      issueDescription: 'Minor hairline fissure noticed after 200km',
      images: ['https://example.com/defect.jpg'],
      status: 'APPROVED',
      resolution: 'REPLACEMENT',
      sellerComments: 'Warranty claim approved for defect analysis',
      resolvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Request analytics
    const analyticsRes = await fetch(`${baseUrl}/api/v1/manufacturer/analytics`, {
      headers: { Authorization: 'Bearer mock-token-MANUFACTURER-mfg_user_analytics-ACTIVE' },
    });
    assert.strictEqual(analyticsRes.status, 200);
    const analyticsJson = await analyticsRes.json();
    const analytics = analyticsJson.data.analytics;

    assert.strictEqual(analytics.name, 'Bosch Automotive India');
    assert.ok(analytics.authorizedBrands.includes('bosch'));
    assert.ok(analytics.totalProducts >= 1);
    assert.strictEqual(analytics.warrantyClaimsCount, 1);
    assert.ok(Array.isArray(analytics.dealers));
  });
});
