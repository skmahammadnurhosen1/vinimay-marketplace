import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';
import { sellerRepository } from '../dist/modules/sellers/seller.repository.js';
import { productRepository, generateCompatibilityToken } from '../dist/modules/products/product.repository.js';
import { inventoryRepository } from '../dist/modules/inventory/inventory.repository.js';
import { cartRepository } from '../dist/modules/cart/cart.repository.js';
import { orderRepository } from '../dist/modules/orders/order.repository.js';
import { paymentRepository } from '../dist/modules/payments/payment.repository.js';
import { shipmentRepository } from '../dist/modules/shipping/shipment.repository.js';
import { returnRepository } from '../dist/modules/returns/return.repository.js';
import { refundRepository } from '../dist/modules/refunds/refund.repository.js';
import { warrantyRepository } from '../dist/modules/warranty/warranty.repository.js';
import { userRepository } from '../dist/modules/users/user.repository.js';

describe('Phase 5 Payment + Shipping + Returns + Refunds + Warranty Test Suite', () => {
  let server;
  let baseUrl;
  const PORT = 10105;

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
    if (cartRepository.resetInMemory) cartRepository.resetInMemory();
    if (orderRepository.resetInMemory) orderRepository.resetInMemory();
    if (paymentRepository.resetInMemory) paymentRepository.resetInMemory();
    if (shipmentRepository.resetInMemory) shipmentRepository.resetInMemory();
    if (returnRepository.resetInMemory) returnRepository.resetInMemory();
    if (refundRepository.resetInMemory) refundRepository.resetInMemory();
    if (warrantyRepository.resetInMemory) warrantyRepository.resetInMemory();
    userRepository._clearMemory();
  });

  // Helper fixture to register sellers, products, and checkout a test order
  async function setupOrderFixture() {
    const now = new Date().toISOString();

    // 1. Seller A (Wholesaler)
    const sellerARes = await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-sellerA-ACTIVE',
      },
      body: JSON.stringify({
        businessName: 'Apex Brake Tech Solutions',
        ownerName: 'Sunil Rao',
        mobile: '9876543211',
        email: 'sunil@apexbrakes.in',
        sellerType: 'Wholesaler',
        gstin: '07AAAAA0000A1Z5',
        pan: 'AAAAA0000A',
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
      }),
    });
    const sellerAJson = await sellerARes.json();
    const sellerAId = sellerAJson.data.seller.id;
    await sellerRepository.updateKycStatus(sellerAId, 'APPROVED', 'admin01');

    // 2. Seller B (Authorized Distributor)
    const sellerBRes = await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-sellerB-ACTIVE',
      },
      body: JSON.stringify({
        businessName: 'Northern Spares & Electricals',
        ownerName: 'Pooja Mehta',
        mobile: '9876543212',
        email: 'pooja@northernspares.in',
        sellerType: 'Authorized Distributor',
        gstin: '07BBBBB0000B1Z6',
        pan: 'BBBBB0000B',
        businessAddress: {
          fullName: 'Pooja Mehta',
          phone: '9876543212',
          addressLine1: 'B-22, Auto Complex, Okhla',
          city: 'New Delhi',
          state: 'Delhi',
          pinCode: '110025',
          type: 'warehouse',
        },
        bankDetails: {
          bankName: 'ICICI Bank',
          accountNumber: '001105001234',
          ifsc: 'ICIC0000011',
          accountHolderName: 'Northern Spares & Electricals',
        },
        authorizedBrands: ['lumax'],
      }),
    });
    const sellerBJson = await sellerBRes.json();
    const sellerBId = sellerBJson.data.seller.id;
    await sellerRepository.updateKycStatus(sellerBId, 'APPROVED', 'admin01');

    // 3. Product 1 (by Seller A)
    const fitmentP1 = {
      vehicleType: 'passenger',
      manufacturerId: 'maruti-suzuki',
      manufacturerName: 'Maruti Suzuki',
      modelId: 'swift',
      modelName: 'Swift',
      year: 2021,
      fuelType: 'petrol',
      engine: '1.2L K-Series',
      variant: 'ZXi',
    };
    const product1 = await productRepository.create({
      id: 'prod_brake_pad_swift',
      sellerId: sellerAId,
      productName: 'Bosch Front Ceramic Brake Pads (Swift)',
      brand: 'Bosch',
      manufacturer: 'Bosch Automotive India Ltd',
      partNumber: 'BP-SWIFT-01',
      oemNumber: '55810M68P00',
      category: 'Braking System',
      subCategory: 'Brake Pads',
      productType: 'OEM',
      description: 'High performance ceramic brake pads for Swift.',
      features: ['Low dust formulation'],
      specifications: { Position: 'Front' },
      compatibleVehicles: [fitmentP1],
      compatibilityTokens: [generateCompatibilityToken(fitmentP1)],
      price: 1800,
      mrp: 2400,
      discount: 25,
      gstRate: 18,
      warranty: '12 Months',
      returnPolicy: '10 Days Returnable',
      delivery: { weightKg: 1.2, dimensionsCm: { length: 15, width: 10, height: 5 } },
      images: [{ id: 'img_p1', url: '/assets/swift_pads.jpg', storagePath: 'prod_p1.jpg', isPrimary: true, displayOrder: 0 }],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin01',
      reviewedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await inventoryRepository.create({
      id: product1.id,
      productId: product1.id,
      sellerId: sellerAId,
      currentStock: 30,
      reservedStock: 0,
      availableStock: 30,
      lowStockThreshold: 5,
      sku: 'SKU-BP-SWIFT',
      status: 'IN_STOCK',
      lastRestockedAt: now,
      updatedAt: now,
    });

    // 4. Product 2 (by Seller B)
    const fitmentP2 = {
      vehicleType: 'passenger',
      manufacturerId: 'hyundai',
      manufacturerName: 'Hyundai',
      modelId: 'i20',
      modelName: 'i20',
      year: 2021,
      fuelType: 'petrol',
      engine: '1.2L Kappa',
      variant: 'Asta',
    };
    const product2 = await productRepository.create({
      id: 'prod_i20_headlamp',
      sellerId: sellerBId,
      productName: 'Lumax Projector Headlamp Assembly (i20 Left)',
      brand: 'Lumax',
      manufacturer: 'Lumax Industries Ltd',
      partNumber: 'LX-92101-1J000',
      oemNumber: '92101-1J000',
      category: 'Lighting & Electronics',
      subCategory: 'Headlamps',
      productType: 'OEM',
      description: 'Original projector headlamp with LED daylight running lights.',
      features: ['Projector lens'],
      specifications: { Side: 'Left' },
      compatibleVehicles: [fitmentP2],
      compatibilityTokens: [generateCompatibilityToken(fitmentP2)],
      price: 4500,
      mrp: 5800,
      discount: 22.4,
      gstRate: 18,
      warranty: '6 Months',
      returnPolicy: '10 Days Returnable',
      delivery: { weightKg: 3.5, dimensionsCm: { length: 45, width: 30, height: 25 } },
      images: [{ id: 'img_p2', url: '/assets/i20_hl.jpg', storagePath: 'prod_p2.jpg', isPrimary: true, displayOrder: 0 }],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin01',
      reviewedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await inventoryRepository.create({
      id: product2.id,
      productId: product2.id,
      sellerId: sellerBId,
      currentStock: 15,
      reservedStock: 0,
      availableStock: 15,
      lowStockThreshold: 2,
      sku: 'SKU-LX-I20-HL',
      status: 'IN_STOCK',
      lastRestockedAt: now,
      updatedAt: now,
    });

    // 5. Customer creates order with both items
    const customerAuth = 'Bearer mock-token-CUSTOMER-custOrderFixture-ACTIVE';
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: product1.id, quantity: 2 }),
    });
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: product2.id, quantity: 1 }),
    });

    const checkoutRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Vikram Aditya',
          phone: '9876543210',
          addressLine1: 'Plot 45, Sector 14',
          city: 'Gurugram',
          state: 'Haryana',
          pinCode: '122001',
          type: 'home',
        },
        paymentMethod: 'upi',
        vehicleContext: {
          vehicleType: 'passenger',
          manufacturer: 'Maruti Suzuki',
          model: 'Swift',
          year: 2021,
        },
      }),
    });
    const checkoutJson = await checkoutRes.json();
    const parentOrder = checkoutJson.data.order;
    const subOrders = checkoutJson.data.packages;

    const subOrderA = subOrders.find((s) => s.sellerId === sellerAId);
    const subOrderB = subOrders.find((s) => s.sellerId === sellerBId);

    return {
      sellerAId,
      sellerBId,
      product1,
      product2,
      parentOrder,
      subOrderA,
      subOrderB,
      customerAuth,
      sellerAAuth: 'Bearer mock-token-SELLER-sellerA-ACTIVE',
      sellerBAuth: 'Bearer mock-token-SELLER-sellerB-ACTIVE',
    };
  }

  // --------------------------------------------------------------------------
  // 1. PAYMENT GATEWAY & SERVER-SIDE VERIFICATION
  // --------------------------------------------------------------------------

  test('1. Payment initiation creates payment record in INITIATED status', async () => {
    const fixture = await setupOrderFixture();

    const res = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        method: 'upi',
      }),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.payment.orderId, fixture.parentOrder.id);
    assert.strictEqual(json.data.payment.status, 'INITIATED');
    assert.strictEqual(json.data.payment.amount, fixture.parentOrder.totalPayable);
    assert.ok(json.data.payment.providerOrderId);
  });

  test('2. Server-side payment verification marks payment SUCCESS and updates order to PAID', async () => {
    const fixture = await setupOrderFixture();

    // 1. Initiate
    const initRes = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        method: 'card',
      }),
    });
    const initJson = await initRes.json();
    const paymentId = initJson.data.payment.id;

    // 2. Verify with valid signature simulation
    const verifyRes = await fetch(`${baseUrl}/api/v1/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        paymentId,
        providerPaymentId: 'pay_rzp_mock_12345',
        providerSignature: 'mock_valid_sig_abc123',
      }),
    });

    assert.strictEqual(verifyRes.status, 200);
    const verifyJson = await verifyRes.json();
    assert.strictEqual(verifyJson.success, true);
    assert.strictEqual(verifyJson.data.payment.status, 'SUCCESS');

    // 3. Confirm Parent Order reflects PAID
    const orderRes = await fetch(`${baseUrl}/api/v1/orders/${fixture.parentOrder.id}`, {
      headers: { Authorization: fixture.customerAuth },
    });
    const orderJson = await orderRes.json();
    assert.strictEqual(orderJson.data.order.paymentStatus, 'PAID');
  });

  test('3. Payment verification rejected on invalid digital signature', async () => {
    const fixture = await setupOrderFixture();

    const initRes = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        method: 'netbanking',
      }),
    });
    const initJson = await initRes.json();
    const paymentId = initJson.data.payment.id;

    // Tampered signature
    const verifyRes = await fetch(`${baseUrl}/api/v1/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        paymentId,
        providerPaymentId: 'pay_rzp_mock_tampered',
        providerSignature: 'tampered_invalid_signature_404',
      }),
    });

    assert.strictEqual(verifyRes.status, 400);
    const verifyJson = await verifyRes.json();
    assert.strictEqual(verifyJson.error.code, 'PAYMENT_VERIFICATION_FAILED');

    // Payment record reflects FAILED
    const payment = await paymentRepository.findById(paymentId);
    assert.strictEqual(payment.status, 'FAILED');
  });

  test('4. Idempotent payment webhook processing ignores duplicate webhook events', async () => {
    const fixture = await setupOrderFixture();

    const initRes = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        method: 'wallet',
      }),
    });
    const initJson = await initRes.json();
    const paymentId = initJson.data.payment.id;

    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        paymentId,
        providerPaymentId: 'pay_captured_9988',
        amount: fixture.parentOrder.totalPayable,
        status: 'success',
      },
    };

    // First Webhook call
    const hook1Res = await fetch(`${baseUrl}/api/v1/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-id': 'evt_unique_101',
      },
      body: JSON.stringify(webhookPayload),
    });
    assert.strictEqual(hook1Res.status, 200);
    const hook1Json = await hook1Res.json();
    assert.strictEqual(hook1Json.data.duplicate, false);

    // Duplicate Webhook call with identical event ID
    const hook2Res = await fetch(`${baseUrl}/api/v1/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-id': 'evt_unique_101',
      },
      body: JSON.stringify(webhookPayload),
    });
    assert.strictEqual(hook2Res.status, 200);
    const hook2Json = await hook2Res.json();
    assert.strictEqual(hook2Json.data.duplicate, true); // Deduplicated idempotently!
  });

  test('5. COD rules engine enforces ₹10,000 maximum order threshold', async () => {
    const fixture = await setupOrderFixture();

    // Order total is 1800*2 + 4500 = 8100 (< 10000) -> Eligible
    const check1 = await fetch(`${baseUrl}/api/v1/payments/check-cod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: fixture.parentOrder.id, pinCode: '122001' }),
    });
    const json1 = await check1.json();
    assert.strictEqual(json1.data.eligible, true);

    // If order total exceeds ₹10,000 -> Blocked
    const largeOrder = {
      ...fixture.parentOrder,
      id: 'order_large_value',
      totalPayable: 14500,
    };
    await orderRepository.createParentOrder(largeOrder);

    const check2 = await fetch(`${baseUrl}/api/v1/payments/check-cod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: largeOrder.id, pinCode: '122001' }),
    });
    const json2 = await check2.json();
    assert.strictEqual(json2.data.eligible, false);
    assert.ok(json2.data.reason.includes('₹10000'));
  });

  // --------------------------------------------------------------------------
  // 2. SHIPPING & AWB TRACKING
  // --------------------------------------------------------------------------

  test('6. Seller dispatches package, generates AWB, and starts tracking checkpoints', async () => {
    const fixture = await setupOrderFixture();

    const res = await fetch(`${baseUrl}/api/v1/shipping/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({
        subOrderId: fixture.subOrderA.id,
        provider: 'mock_logistics',
        dimensions: { weightKg: 1.8, lengthCm: 22, widthCm: 15, heightCm: 8 },
      }),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.shipment.awbNumber.startsWith('DEL-'));
    assert.strictEqual(json.data.shipment.status, 'packed');
    assert.strictEqual(json.data.shipment.checkpoints.length, 2);
  });

  test('7. Courier updates tracking checkpoints and marks shipment delivered', async () => {
    const fixture = await setupOrderFixture();

    // Create shipment
    const createRes = await fetch(`${baseUrl}/api/v1/shipping/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ subOrderId: fixture.subOrderA.id }),
    });
    const createJson = await createRes.json();
    const shipmentId = createJson.data.shipment.id;
    const awbNumber = createJson.data.shipment.awbNumber;

    // Advance to "shipped"
    const update1 = await fetch(`${baseUrl}/api/v1/shipping/shipments/${shipmentId}/checkpoint`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({
        stage: 'shipped',
        title: 'Departed Sorting Facility',
        description: 'Package departed Delhi sorting facility.',
        location: 'Delhi Sorting Facility',
      }),
    });
    assert.strictEqual(update1.status, 200);

    // Advance to "delivered"
    const update2 = await fetch(`${baseUrl}/api/v1/shipping/shipments/${shipmentId}/checkpoint`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({
        stage: 'delivered',
        title: 'Delivered to Customer',
        description: 'Delivered and signed by Vikram Aditya.',
        location: 'Gurugram, Haryana',
      }),
    });
    assert.strictEqual(update2.status, 200);

    // Public / Customer Tracking Lookup by AWB
    const trackRes = await fetch(`${baseUrl}/api/v1/shipping/track/${awbNumber}`);
    assert.strictEqual(trackRes.status, 200);
    const trackJson = await trackRes.json();
    assert.strictEqual(trackJson.data.tracking.status, 'delivered');
    assert.strictEqual(trackJson.data.tracking.checkpoints.length, 4);

    // Sub-order status is COMPLETED
    const subOrder = await orderRepository.findSubOrderById(fixture.subOrderA.id);
    assert.strictEqual(subOrder.status, 'COMPLETED');
  });

  test('8. Shipping webhook updates tracking checkpoints idempotently', async () => {
    const fixture = await setupOrderFixture();

    const createRes = await fetch(`${baseUrl}/api/v1/shipping/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ subOrderId: fixture.subOrderA.id }),
    });
    const createJson = await createRes.json();
    const awbNumber = createJson.data.shipment.awbNumber;

    const webhookPayload = {
      eventId: 'ship_hook_evt_001',
      awbNumber,
      stage: 'out_for_delivery',
      title: 'Courier Out for Delivery',
      description: 'Van dispatched for doorstep delivery.',
      location: 'Gurugram Delivery Hub',
    };

    // First delivery hook
    const hook1 = await fetch(`${baseUrl}/api/v1/shipping/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });
    assert.strictEqual(hook1.status, 200);
    const hook1Json = await hook1.json();
    assert.strictEqual(hook1Json.data.duplicate, false);

    // Duplicate delivery hook
    const hook2 = await fetch(`${baseUrl}/api/v1/shipping/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });
    assert.strictEqual(hook2.status, 200);
    const hook2Json = await hook2.json();
    assert.strictEqual(hook2Json.data.duplicate, true);
  });

  test('9. Seller tenant isolation: Seller A cannot generate or modify Seller B shipment', async () => {
    const fixture = await setupOrderFixture();

    // Seller A attempts to create shipment for Seller B's subOrderB -> 403 Forbidden
    const breachRes = await fetch(`${baseUrl}/api/v1/shipping/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ subOrderId: fixture.subOrderB.id }),
    });

    assert.strictEqual(breachRes.status, 403);
    const breachJson = await breachRes.json();
    assert.strictEqual(breachJson.error.code, 'FORBIDDEN');
  });

  // --------------------------------------------------------------------------
  // 3. RETURNS & WRONG-PART COMPATIBILITY PROTECTION
  // --------------------------------------------------------------------------

  test('10. Customer submits return request with wrong-part protection & vehicle retention', async () => {
    const fixture = await setupOrderFixture();

    const returnPayload = {
      orderId: fixture.parentOrder.id,
      subOrderId: fixture.subOrderA.id,
      productId: fixture.product1.id,
      quantity: 1,
      reason: 'Not Compatible',
      customerExplanation: 'The brake pad friction curve does not align with the caliper brackets.',
      vehicleConfirmed: true,
      vehicleDetails: {
        vehicleType: 'passenger',
        manufacturer: 'Maruti Suzuki',
        model: 'Swift',
        year: 2021,
      },
      evidencePhotos: ['https://cdn.example.com/return_pad_photo1.jpg'],
      action: 'REFUND',
    };

    const res = await fetch(`${baseUrl}/api/v1/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify(returnPayload),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.returnRequest.returnNumber.startsWith('RET-2026-'));
    assert.strictEqual(json.data.returnRequest.status, 'REQUESTED');
    assert.strictEqual(json.data.returnRequest.sellerId, fixture.sellerAId);
    assert.strictEqual(json.data.returnRequest.vehicleConfirmed, true);
    // Exact refund amount authoritatively calculated: 1800 + 18% GST (324) = 2124
    assert.strictEqual(json.data.returnRequest.approvedRefundAmount, 1800 + Math.round(1800 * 0.18));
  });

  test('11. Return rejected on invalid reason or unauthorized customer order breach', async () => {
    const fixture = await setupOrderFixture();

    // 1. Invalid reason
    const badReasonRes = await fetch(`${baseUrl}/api/v1/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderA.id,
        productId: fixture.product1.id,
        quantity: 1,
        reason: 'Changed My Mind - Don’t Want It Anymore', // Disallowed return reason
        customerExplanation: 'Just returning it because I found it elsewhere cheaper.',
        evidencePhotos: ['https://cdn.example.com/photo.jpg'],
      }),
    });
    assert.strictEqual(badReasonRes.status, 400);

    // 2. Cross-customer breach
    const breachRes = await fetch(`${baseUrl}/api/v1/returns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-custDifferent-ACTIVE',
      },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderA.id,
        productId: fixture.product1.id,
        quantity: 1,
        reason: 'Damaged',
        customerExplanation: 'Box crushed during transit.',
        evidencePhotos: ['https://cdn.example.com/photo.jpg'],
      }),
    });
    assert.strictEqual(breachRes.status, 403);
  });

  test('12. Seller reviews return request and advances reverse logistics stage', async () => {
    const fixture = await setupOrderFixture();

    // 1. Customer creates return
    const retRes = await fetch(`${baseUrl}/api/v1/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderA.id,
        productId: fixture.product1.id,
        quantity: 1,
        reason: 'Defective',
        customerExplanation: 'Friction lining separated from backing plate out of the box.',
        evidencePhotos: ['https://cdn.example.com/defect_photo.jpg'],
      }),
    });
    const retJson = await retRes.json();
    const returnId = retJson.data.returnRequest.id;

    // 2. Seller reviews & approves
    const reviewRes = await fetch(`${baseUrl}/api/v1/sellers/returns/${returnId}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({
        status: 'APPROVED',
        notes: 'Photo evidence verified by engineering team. Approving return.',
      }),
    });
    assert.strictEqual(reviewRes.status, 200);
    const reviewJson = await reviewRes.json();
    assert.strictEqual(reviewJson.data.returnRequest.status, 'APPROVED');

    // 3. Stage update: PICKUP_SCHEDULED
    const stageRes = await fetch(`${baseUrl}/api/v1/sellers/returns/${returnId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({
        status: 'PICKUP_SCHEDULED',
        pickupAwb: 'REV-DEL-889911',
        notes: 'Delhivery reverse courier assigned for doorstep collection.',
      }),
    });
    assert.strictEqual(stageRes.status, 200);
    const stageJson = await stageRes.json();
    assert.strictEqual(stageJson.data.returnRequest.status, 'PICKUP_SCHEDULED');
    assert.strictEqual(stageJson.data.returnRequest.pickupAwb, 'REV-DEL-889911');
  });

  // --------------------------------------------------------------------------
  // 4. REFUNDS & DUPLICATE PREVENTION
  // --------------------------------------------------------------------------

  test('13. Authoritative refund execution credits customer, restocks stock, and updates payment', async () => {
    const fixture = await setupOrderFixture();

    // Create and approve return
    const retRes = await fetch(`${baseUrl}/api/v1/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderA.id,
        productId: fixture.product1.id,
        quantity: 1,
        reason: 'Wrong Product',
        customerExplanation: 'Received wrong part number in sealed box.',
        evidencePhotos: ['https://cdn.example.com/wrong_box.jpg'],
      }),
    });
    const retJson = await retRes.json();
    const returnId = retJson.data.returnRequest.id;

    await fetch(`${baseUrl}/api/v1/sellers/returns/${returnId}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ status: 'APPROVED' }),
    });

    const invBefore = await inventoryRepository.findByProductId(fixture.product1.id);
    const stockBefore = invBefore.availableStock;

    // Process refund
    const refundRes = await fetch(`${baseUrl}/api/v1/refunds/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ returnId }),
    });

    assert.strictEqual(refundRes.status, 201);
    const refundJson = await refundRes.json();
    assert.strictEqual(refundJson.success, true);
    assert.strictEqual(refundJson.data.refund.status, 'PROCESSED');
    assert.strictEqual(refundJson.data.refund.amount, 1800 + Math.round(1800 * 0.18)); // 2124

    // Return status updated to REFUNDED
    const updatedReturn = await returnRepository.findById(returnId);
    assert.strictEqual(updatedReturn.status, 'REFUNDED');

    // Returned item stock restocked in inventory
    const invAfter = await inventoryRepository.findByProductId(fixture.product1.id);
    assert.strictEqual(invAfter.availableStock, stockBefore + 1);
  });

  test('14. Duplicate refund attempt on the same return is strictly prevented', async () => {
    const fixture = await setupOrderFixture();

    const retRes = await fetch(`${baseUrl}/api/v1/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderA.id,
        productId: fixture.product1.id,
        quantity: 1,
        reason: 'Damaged',
        customerExplanation: 'Crushed package.',
        evidencePhotos: ['https://cdn.example.com/photo.jpg'],
      }),
    });
    const retJson = await retRes.json();
    const returnId = retJson.data.returnRequest.id;

    await fetch(`${baseUrl}/api/v1/sellers/returns/${returnId}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ status: 'APPROVED' }),
    });

    // 1st refund succeeds
    const ref1 = await fetch(`${baseUrl}/api/v1/refunds/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ returnId }),
    });
    assert.strictEqual(ref1.status, 201);

    // 2nd refund attempt must fail
    const ref2 = await fetch(`${baseUrl}/api/v1/refunds/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ returnId }),
    });
    assert.strictEqual(ref2.status, 400);
    const ref2Json = await ref2.json();
    assert.strictEqual(ref2Json.error.code, 'REFUND_FAILED');
  });

  // --------------------------------------------------------------------------
  // 5. WARRANTY CLAIMS & RESOLUTION OUTCOMES
  // --------------------------------------------------------------------------

  test('15. Customer submits valid warranty claim with defect details and evidence', async () => {
    const fixture = await setupOrderFixture();

    const claimPayload = {
      orderId: fixture.parentOrder.id,
      subOrderId: fixture.subOrderA.id,
      productId: fixture.product1.id,
      vehicle: {
        vehicleType: 'passenger',
        manufacturer: 'Maruti Suzuki',
        model: 'Swift',
        year: 2021,
      },
      problemDescription: 'Severe rotor scoring and material delamination occurred after 500 km.',
      photos: ['https://cdn.example.com/rotor_score.jpg'],
      videoUrl: 'https://cdn.example.com/rotor_inspection.mp4',
    };

    const res = await fetch(`${baseUrl}/api/v1/warranty/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify(claimPayload),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.warrantyClaim.claimNumber.startsWith('WAR-2026-'));
    assert.strictEqual(json.data.warrantyClaim.status, 'SUBMITTED');
    assert.strictEqual(json.data.warrantyClaim.sellerId, fixture.sellerAId);
    assert.strictEqual(json.data.warrantyClaim.warrantyPeriod, '12 Months');
  });

  test('16. Warranty claim rejected when warranty coverage period has expired', async () => {
    const fixture = await setupOrderFixture();

    // Create past order placed 2 years ago (24 months ago, while product warranty is 6 months)
    const twoYearsAgo = new Date(Date.now() - 24 * 30 * 24 * 60 * 60 * 1000).toISOString();
    const expiredOrder = {
      ...fixture.parentOrder,
      id: 'order_expired_warranty',
      createdAt: twoYearsAgo,
    };
    await orderRepository.createParentOrder(expiredOrder);

    const expiredSubOrder = {
      ...fixture.subOrderB,
      id: 'sub_expired_warranty',
      parentOrderId: expiredOrder.id,
      createdAt: twoYearsAgo,
    };
    await orderRepository.createSubOrder(expiredSubOrder);

    const res = await fetch(`${baseUrl}/api/v1/warranty/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: expiredOrder.id,
        subOrderId: expiredSubOrder.id,
        productId: fixture.product2.id, // 6 months warranty
        vehicle: { model: 'i20' },
        problemDescription: 'Bulb projector failure after 2 years.',
        photos: ['https://cdn.example.com/bulb_fail.jpg'],
      }),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error.code, 'WARRANTY_EXPIRED');
  });

  test('17. Seller reviews warranty claim and executes REPLACEMENT outcome', async () => {
    const fixture = await setupOrderFixture();

    // 1. Submit claim
    const claimRes = await fetch(`${baseUrl}/api/v1/warranty/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderA.id,
        productId: fixture.product1.id,
        vehicle: { model: 'Swift' },
        problemDescription: 'Defective shim clip rattling in caliper bracket.',
        photos: ['https://cdn.example.com/clip_defect.jpg'],
      }),
    });
    const claimJson = await claimRes.json();
    const claimId = claimJson.data.warrantyClaim.id;

    // 2. Seller reviews & approves
    const revRes = await fetch(`${baseUrl}/api/v1/sellers/warranty/${claimId}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({
        status: 'APPROVED',
        notes: 'Engineering inspection confirms defective clip stamping batch.',
      }),
    });
    assert.strictEqual(revRes.status, 200);

    // 3. Seller sets outcome: REPLACEMENT
    const outRes = await fetch(`${baseUrl}/api/v1/sellers/warranty/${claimId}/outcome`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({
        outcome: 'REPLACEMENT',
        outcomeNotes: 'Free OEM replacement unit dispatched under warranty guarantee.',
      }),
    });
    assert.strictEqual(outRes.status, 200);
    const outJson = await outRes.json();
    assert.strictEqual(outJson.data.warrantyClaim.outcome, 'REPLACEMENT');
    assert.strictEqual(outJson.data.warrantyClaim.status, 'CLOSED');
  });

  // --------------------------------------------------------------------------
  // 6. MULTI-TENANT ISOLATION
  // --------------------------------------------------------------------------

  test('18. Multi-tenant isolation: Seller A cannot access Seller B returns or warranty claims', async () => {
    const fixture = await setupOrderFixture();

    // Customer creates return for Seller B's product
    const retRes = await fetch(`${baseUrl}/api/v1/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderB.id,
        productId: fixture.product2.id,
        quantity: 1,
        reason: 'Damaged',
        customerExplanation: 'Headlamp cracked in transit.',
        evidencePhotos: ['https://cdn.example.com/cracked_lens.jpg'],
      }),
    });
    const retJson = await retRes.json();
    const returnIdB = retJson.data.returnRequest.id;

    // Seller A attempts to review Seller B's return -> 403 Forbidden
    const breachReturn = await fetch(`${baseUrl}/api/v1/sellers/returns/${returnIdB}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    assert.strictEqual(breachReturn.status, 403);
    const breachRetJson = await breachReturn.json();
    assert.strictEqual(breachRetJson.error.code, 'FORBIDDEN');

    // Customer creates warranty claim for Seller B's product
    const warRes = await fetch(`${baseUrl}/api/v1/warranty/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.customerAuth },
      body: JSON.stringify({
        orderId: fixture.parentOrder.id,
        subOrderId: fixture.subOrderB.id,
        productId: fixture.product2.id,
        vehicle: { model: 'i20' },
        problemDescription: 'Projector LED flicker.',
        photos: ['https://cdn.example.com/flicker.jpg'],
      }),
    });
    const warJson = await warRes.json();
    const claimIdB = warJson.data.warrantyClaim.id;

    // Seller A attempts to review Seller B's warranty claim -> 403 Forbidden
    const breachWarranty = await fetch(`${baseUrl}/api/v1/sellers/warranty/${claimIdB}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: fixture.sellerAAuth },
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    assert.strictEqual(breachWarranty.status, 403);
    const breachWarJson = await breachWarranty.json();
    assert.strictEqual(breachWarJson.error.code, 'FORBIDDEN');
  });
});
