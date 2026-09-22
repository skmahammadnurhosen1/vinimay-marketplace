import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';
import { sellerRepository } from '../dist/modules/sellers/seller.repository.js';
import { productRepository } from '../dist/modules/products/product.repository.js';
import { inventoryRepository } from '../dist/modules/inventory/inventory.repository.js';
import { userRepository } from '../dist/modules/users/user.repository.js';

describe('Phase 3 Seller + Product + Inventory System Test Suite', () => {
  let server;
  let baseUrl;
  const PORT = 10102;

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
    userRepository._clearMemory();
  });

  // --------------------------------------------------------------------------
  // 1. SELLER REGISTRATION & ONBOARDING
  // --------------------------------------------------------------------------

  test('1. Valid seller registration creates profile with DRAFT status', async () => {
    const payload = {
      businessName: 'Royal Auto Spares',
      ownerName: 'Sunil Verma',
      mobile: '9876543210',
      email: 'sunil@royalautospares.in',
      sellerType: 'Wholesaler',
      gstin: '07AAAAA0000A1Z5',
      pan: 'AAAAA0000A',
      businessAddress: {
        fullName: 'Sunil Verma',
        phone: '9876543210',
        addressLine1: 'Shop 12, Transport Nagar, Mayapuri',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110064',
        type: 'warehouse',
      },
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: '300123456789',
        ifsc: 'SBIN0001234',
        accountHolderName: 'Royal Auto Spares',
      },
      authorizedBrands: ['bosch', 'tata-motors'],
    };

    const res = await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-sellerUser01-ACTIVE',
      },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.seller.businessName, 'Royal Auto Spares');
    assert.strictEqual(json.data.seller.kycStatus, 'DRAFT');
    assert.strictEqual(json.data.seller.userId, 'sellerUser01');
  });

  test('2. Registration rejected on invalid GSTIN or bad PIN code', async () => {
    const invalidPayload = {
      businessName: 'Bad Auto',
      ownerName: 'Rajesh',
      mobile: '9876543210',
      email: 'bad@auto.in',
      sellerType: 'Retailer',
      gstin: 'INVALID_GSTIN_123', // Malformed GSTIN
      pan: 'ABCDE1234F',
      businessAddress: {
        fullName: 'Rajesh',
        phone: '9876543210',
        addressLine1: 'Shop 1',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '012345', // Error: PIN cannot start with 0
      },
      bankDetails: {
        bankName: 'HDFC Bank',
        accountNumber: '12345678',
        ifsc: 'HDFC0001234',
        accountHolderName: 'Bad Auto',
      },
    };

    const res = await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-badUser-ACTIVE',
      },
      body: JSON.stringify(invalidPayload),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
  });

  test('3. Duplicate seller registration for same account returns 409 Conflict', async () => {
    const payload = {
      businessName: 'Apex Duplicate Attempt',
      ownerName: 'Vikram',
      mobile: '9820123456',
      email: 'vikram@apex.in',
      sellerType: 'Retailer',
      gstin: '27AABCU9603R1ZM',
      pan: 'AABCU9603R',
      businessAddress: {
        fullName: 'Vikram',
        phone: '9820123456',
        addressLine1: 'Plot 42 MIDC',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400093',
      },
      bankDetails: {
        bankName: 'HDFC',
        accountNumber: '50200012345678',
        ifsc: 'HDFC0000123',
        accountHolderName: 'Apex',
      },
    };

    // mock-seller-uid already exists in default seeded data
    const res = await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 409);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'SELLER_ALREADY_EXISTS');
  });

  // --------------------------------------------------------------------------
  // 2. SELLER KYC & VERIFICATION
  // --------------------------------------------------------------------------

  test('4. Seller can upload KYC documents', async () => {
    const docPayload = {
      type: 'gst_certificate',
      title: 'GST Certificate',
      fileName: 'gst_certificate.pdf',
      fileSize: 250000,
      mimeType: 'application/pdf',
      storagePath: 'sellers/seller_apex_auto_parts/kyc/gst_certificate.pdf',
    };

    const res = await fetch(`${baseUrl}/api/v1/sellers/kyc/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify(docPayload),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.document.type, 'gst_certificate');
    assert.strictEqual(json.data.document.status, 'UNDER_REVIEW');
  });

  test('5. Non-admin cannot approve seller KYC (Privilege Escalation Prevention)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/sellers/seller_apex_auto_parts/kyc/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE', // Non-admin attempting admin endpoint
      },
      body: JSON.stringify({ status: 'APPROVED' }),
    });

    assert.strictEqual(res.status, 403);
  });

  test('6. Admin approves seller KYC successfully', async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/sellers/seller_apex_auto_parts/kyc/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-adminUser01-ACTIVE',
      },
      body: JSON.stringify({
        status: 'APPROVED',
        notes: 'All documents verified against GSTN portal',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.seller.kycStatus, 'APPROVED');
    assert.strictEqual(json.data.seller.reviewedBy, 'adminUser01');
  });

  // --------------------------------------------------------------------------
  // 3. PRODUCT CREATION & 7-TIER COMPATIBILITY
  // --------------------------------------------------------------------------

  test('7. Verified seller creates product with 7-tier vehicle compatibility', async () => {
    const productPayload = {
      productName: 'Bosch Rear Brake Shoe Set for Tata Ace',
      brand: 'Bosch',
      manufacturer: 'Bosch Automotive India',
      partNumber: 'BS-TATA-ACE-RR',
      oemNumber: '2824 4220 0119',
      category: 'Brake',
      subCategory: 'Brake Shoes',
      productType: 'OEM',
      description: 'Rear brake shoes with asbestos-free friction lining for Tata Ace commercial vehicles.',
      features: ['High friction coefficient', 'Extended drum life'],
      specifications: { 'Position': 'Rear Axle', 'Diameter': '200 mm' },
      compatibleVehicles: [
        {
          vehicleType: 'commercial',
          manufacturerId: 'tata-cv',
          manufacturerName: 'Tata Motors CV',
          modelId: 'tata-ace',
          modelName: 'Ace',
          year: 2022,
          fuelType: 'Diesel',
          engine: '700cc',
          variant: 'Standard',
        },
      ],
      price: 950,
      mrp: 1200,
      gstRate: 18,
      warranty: '6 Months',
      returnPolicy: '10 Days Returnable',
      images: [
        {
          id: 'img_01',
          url: '/assets/cat_brakes.jpg',
          storagePath: 'products/seller_apex_auto_parts/img_01.jpg',
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      initialStock: 25,
      lowStockThreshold: 5,
    };

    const res = await fetch(`${baseUrl}/api/v1/sellers/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify(productPayload),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.product.productName, 'Bosch Rear Brake Shoe Set for Tata Ace');
    assert.ok(json.data.product.compatibilityTokens.length > 0);
    assert.strictEqual(json.data.inventory.currentStock, 25);
    assert.strictEqual(json.data.inventory.status, 'IN_STOCK');
  });

  test('8. Product creation rejected if MRP is less than Price', async () => {
    const invalidPricingPayload = {
      productName: 'Invalid Price Brake Pad',
      brand: 'Bosch',
      manufacturer: 'Bosch India',
      partNumber: 'BP-INV-01',
      category: 'Brake',
      subCategory: 'Brake Pads',
      productType: 'Aftermarket',
      description: 'Test description with sufficient length for validation.',
      compatibleVehicles: [
        {
          vehicleType: 'passenger',
          manufacturerId: 'maruti-suzuki',
          manufacturerName: 'Maruti Suzuki',
          modelId: 'maruti-swift',
          modelName: 'Swift',
          year: 2022,
          fuelType: 'Petrol',
          engine: '1.2L K12M',
          variant: 'VXI',
        },
      ],
      price: 2000,
      mrp: 1500, // Error: MRP cannot be lower than selling price
      gstRate: 18,
      warranty: '6 Months',
      returnPolicy: '7 Days',
      images: [
        {
          id: 'img_test',
          url: '/test.jpg',
          storagePath: 'products/test.jpg',
          isPrimary: true,
          displayOrder: 0,
        },
      ],
    };

    const res = await fetch(`${baseUrl}/api/v1/sellers/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify(invalidPricingPayload),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
  });

  // --------------------------------------------------------------------------
  // 4. CROSS-SELLER PROTECTION & MULTI-TENANT ISOLATION
  // --------------------------------------------------------------------------

  test('9. Seller B cannot modify or delete Seller A product (Cross-Seller Isolation)', async () => {
    // Register Seller B
    const sellerBPayload = {
      businessName: 'Seller B Motors',
      ownerName: 'Ramesh',
      mobile: '9811223344',
      email: 'ramesh@sellerb.in',
      sellerType: 'Retailer',
      gstin: '06AAAAA0000A1Z5',
      pan: 'AAAAA0000A',
      businessAddress: {
        fullName: 'Ramesh',
        phone: '9811223344',
        addressLine1: 'Sector 29',
        city: 'Gurugram',
        state: 'Haryana',
        pinCode: '122001',
      },
      bankDetails: {
        bankName: 'ICICI Bank',
        accountNumber: '000123456789',
        ifsc: 'ICIC0000001',
        accountHolderName: 'Seller B Motors',
      },
    };

    await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-sellerB-uid-ACTIVE',
      },
      body: JSON.stringify(sellerBPayload),
    });

    // Seller B attempts to modify Seller A's product
    const updateRes = await fetch(`${baseUrl}/api/v1/sellers/products/prod_bosch_brake_pad_tata_ace`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-sellerB-uid-ACTIVE',
      },
      body: JSON.stringify({ price: 500 }),
    });

    assert.strictEqual(updateRes.status, 403);

    // Seller B attempts to delete Seller A's product
    const deleteRes = await fetch(`${baseUrl}/api/v1/sellers/products/prod_bosch_brake_pad_tata_ace`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer mock-token-SELLER-sellerB-uid-ACTIVE',
      },
    });

    assert.strictEqual(deleteRes.status, 403);
  });

  // --------------------------------------------------------------------------
  // 5. INVENTORY MANAGEMENT & NEGATIVE STOCK PREVENTION
  // --------------------------------------------------------------------------

  test('10. Seller adjusts inventory stock (+15 restock)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/sellers/inventory/prod_bosch_brake_pad_tata_ace/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify({
        delta: 15,
        type: 'RESTOCK',
        reason: 'Monthly warehouse delivery',
        referenceId: 'PO-2026-984',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.inventory.currentStock, 63); // Initial was 48 + 15 = 63
    assert.strictEqual(json.data.movement.type, 'RESTOCK');
    assert.strictEqual(json.data.movement.quantityChanged, 15);
  });

  test('11. Negative stock operation is strictly blocked', async () => {
    // Current stock is 48. Attempt to subtract 100.
    const res = await fetch(`${baseUrl}/api/v1/sellers/inventory/prod_bosch_brake_pad_tata_ace/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify({
        delta: -100,
        type: 'ADJUSTMENT_SUBTRACT',
        reason: 'Attempted oversized deduction',
      }),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'INVALID_STOCK_OPERATION');
  });

  // --------------------------------------------------------------------------
  // 6. SELLER DASHBOARD METRICS
  // --------------------------------------------------------------------------

  test('12. Seller dashboard metrics aggregates counts and inventory valuation', async () => {
    const res = await fetch(`${baseUrl}/api/v1/sellers/dashboard/metrics`, {
      headers: {
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.metrics.totalProducts >= 5);
    assert.ok(json.data.metrics.activeProducts >= 4);
    assert.ok(json.data.metrics.currentInventoryTotalUnits > 0);
    assert.ok(json.data.metrics.currentInventoryTotalValue > 0);
    assert.strictEqual(json.data.metrics.sellerVerificationStatus, 'APPROVED');
  });

  // --------------------------------------------------------------------------
  // 7. VEHICLE COMPATIBILITY QUERY ENGINE
  // --------------------------------------------------------------------------

  test('13. POST /api/v1/products/:id/check-fitment validates matching and non-matching vehicle', async () => {
    const matchingSpec = {
      vehicleType: 'commercial',
      manufacturerId: 'tata-cv',
      manufacturerName: 'Tata Motors CV',
      modelId: 'tata-ace',
      modelName: 'Ace',
      year: 2022,
      fuelType: 'Diesel',
      engine: '700cc',
      variant: 'Standard',
    };

    const resMatch = await fetch(`${baseUrl}/api/v1/products/prod_bosch_brake_pad_tata_ace/check-fitment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchingSpec),
    });

    assert.strictEqual(resMatch.status, 200);
    const matchJson = await resMatch.json();
    assert.strictEqual(matchJson.success, true);
    assert.strictEqual(matchJson.data.compatible, true);

    // Non-matching vehicle
    const nonMatchingSpec = {
      vehicleType: 'passenger',
      manufacturerId: 'maruti-suzuki',
      manufacturerName: 'Maruti Suzuki',
      modelId: 'maruti-swift',
      modelName: 'Swift',
      year: 2022,
      fuelType: 'Petrol',
      engine: '1.2L K12M',
      variant: 'VXI',
    };

    const resMismatch = await fetch(`${baseUrl}/api/v1/products/prod_bosch_brake_pad_tata_ace/check-fitment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nonMatchingSpec),
    });

    assert.strictEqual(resMismatch.status, 200);
    const mismatchJson = await resMismatch.json();
    assert.strictEqual(mismatchJson.success, true);
    assert.strictEqual(mismatchJson.data.compatible, false);
    assert.ok(mismatchJson.data.reason.includes('not compatible'));
  });

  // --------------------------------------------------------------------------
  // 8. STORAGE POLICY GENERATION
  // --------------------------------------------------------------------------

  test('14. POST /api/v1/sellers/storage/policy generates isolated paths for KYC and products', async () => {
    // KYC Document Path (Protected)
    const kycRes = await fetch(`${baseUrl}/api/v1/sellers/storage/policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify({
        targetType: 'kyc',
        fileName: 'gst_certificate_doc.pdf',
      }),
    });

    assert.strictEqual(kycRes.status, 200);
    const kycJson = await kycRes.json();
    assert.strictEqual(kycJson.success, true);
    assert.strictEqual(kycJson.data.isPublic, false);
    assert.ok(kycJson.data.storagePath.startsWith('sellers/seller_apex_auto_parts/kyc/'));

    // Product Image Path (Public)
    const prodRes = await fetch(`${baseUrl}/api/v1/sellers/storage/policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
      body: JSON.stringify({
        targetType: 'product',
        fileName: 'brake_pad_angle_1.jpg',
      }),
    });

    assert.strictEqual(prodRes.status, 200);
    const prodJson = await prodRes.json();
    assert.strictEqual(prodJson.success, true);
    assert.strictEqual(prodJson.data.isPublic, true);
    assert.ok(prodJson.data.storagePath.startsWith('products/seller_apex_auto_parts/'));
  });

  // --------------------------------------------------------------------------
  // 9. PUBLIC CATALOG FILTERING & PRODUCT LIFECYCLE
  // --------------------------------------------------------------------------

  test('15. GET /api/v1/products filters by category (Brake)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/products?category=Brake`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.products.length >= 1);
    for (const prod of json.data.products) {
      assert.strictEqual(prod.category.toLowerCase(), 'brake');
      assert.strictEqual(prod.status, 'APPROVED');
    }
  });

  test('16. Seller toggles product status between APPROVED and PAUSED', async () => {
    // Pause
    const pauseRes = await fetch(`${baseUrl}/api/v1/sellers/products/prod_bosch_brake_pad_tata_ace/status`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
    });

    assert.strictEqual(pauseRes.status, 200);
    const pauseJson = await pauseRes.json();
    assert.strictEqual(pauseJson.success, true);
    assert.strictEqual(pauseJson.data.product.status, 'PAUSED');

    // Resume
    const resumeRes = await fetch(`${baseUrl}/api/v1/sellers/products/prod_bosch_brake_pad_tata_ace/status`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer mock-token-SELLER-mock-seller-uid-ACTIVE',
      },
    });

    assert.strictEqual(resumeRes.status, 200);
    const resumeJson = await resumeRes.json();
    assert.strictEqual(resumeJson.success, true);
    assert.strictEqual(resumeJson.data.product.status, 'APPROVED');
  });

  test('17. Unauthenticated request to seller products is rejected with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/sellers/products`);
    assert.strictEqual(res.status, 401);
  });

  test('18. Admin reviews and approves pending product', async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/products/prod_bosch_brake_pad_tata_ace/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-ADMIN-adminUser01-ACTIVE',
      },
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.product.status, 'APPROVED');
    assert.strictEqual(json.data.product.reviewedBy, 'adminUser01');
  });
});
