import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';
import { sellerRepository } from '../dist/modules/sellers/seller.repository.js';
import { productRepository, generateCompatibilityToken } from '../dist/modules/products/product.repository.js';
import { inventoryRepository } from '../dist/modules/inventory/inventory.repository.js';
import { cartRepository } from '../dist/modules/cart/cart.repository.js';
import { orderRepository } from '../dist/modules/orders/order.repository.js';
import { userRepository } from '../dist/modules/users/user.repository.js';

describe('Phase 4 Customer Marketplace, Cart & Multi-Vendor Order Test Suite', () => {
  let server;
  let baseUrl;
  const PORT = 10104;

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
    userRepository._clearMemory();
  });

  // Helper to bootstrap verified sellers and products
  async function setupMarketplaceFixture() {
    const now = new Date().toISOString();

    // 1. Register and approve Seller A (Wholesaler)
    const sellerARes = await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-userSellerA-ACTIVE',
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
        authorizedBrands: ['bosch', 'brembo'],
      }),
    });
    const sellerAJson = await sellerARes.json();
    const sellerAId = sellerAJson.data.seller.id;
    await sellerRepository.updateKycStatus(sellerAId, 'APPROVED', 'admin01');

    // 2. Register and approve Seller B (Authorized Distributor)
    const sellerBRes = await fetch(`${baseUrl}/api/v1/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-SELLER-userSellerB-ACTIVE',
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
        authorizedBrands: ['lumax', 'ngk'],
      }),
    });
    const sellerBJson = await sellerBRes.json();
    const sellerBId = sellerBJson.data.seller.id;
    await sellerRepository.updateKycStatus(sellerBId, 'APPROVED', 'admin01');

    // 3. Product 1: Front Brake Pads (by Seller A - Fits Maruti Swift 2021)
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
      id: 'prod_bosch_swift_brake_pads',
      sellerId: sellerAId,
      productName: 'Bosch Front Ceramic Brake Pads (Swift)',
      brand: 'Bosch',
      manufacturer: 'Bosch Automotive India Ltd',
      partNumber: 'BP-SWIFT-01',
      oemNumber: '55810M68P00',
      category: 'Braking System',
      subCategory: 'Brake Pads',
      productType: 'OEM',
      description: 'High performance ceramic brake pads designed specifically for Maruti Suzuki Swift passenger vehicles.',
      features: ['Low dust formulation', 'Anti-squeal shims'],
      specifications: { Position: 'Front Axle', Material: 'Ceramic' },
      compatibleVehicles: [fitmentP1],
      compatibilityTokens: [generateCompatibilityToken(fitmentP1)],
      price: 1800,
      mrp: 2400,
      discount: 25,
      gstRate: 18,
      warranty: '12 Months',
      returnPolicy: '10 Days Replacement',
      warrantyPolicy: 'Standard Manufacturer Warranty',
      delivery: { weightKg: 1.2, dimensionsCm: { length: 15, width: 10, height: 5 } },
      images: [{ id: 'img_p1', url: 'https://cdn.example.com/swift_pads.jpg', storagePath: 'prod_p1.jpg', isPrimary: true, displayOrder: 0 }],
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
      currentStock: 25,
      reservedStock: 0,
      availableStock: 25,
      lowStockThreshold: 5,
      sku: 'SKU-BP-SWIFT',
      status: 'IN_STOCK',
      lastRestockedAt: now,
      updatedAt: now,
    });

    // 4. Product 2: Universal Spark Plug (by Seller B - Fits Any Vehicle)
    const fitmentUniversal = {
      vehicleType: 'passenger',
      manufacturerId: 'universal',
      manufacturerName: 'Universal Fitment',
      modelId: 'universal',
      modelName: 'Universal',
      year: 2021,
      fuelType: 'all',
      engine: 'all',
      variant: 'all',
    };
    const product2 = await productRepository.create({
      id: 'prod_ngk_spark_plug_universal',
      sellerId: sellerBId,
      productName: 'NGK Laser Iridium Spark Plug Universal',
      brand: 'NGK',
      manufacturer: 'NGK Spark Plug Co',
      partNumber: 'ILZKR7B-11',
      oemNumber: '90919-01275',
      category: 'Ignition & Electricals',
      subCategory: 'Spark Plugs',
      productType: 'OEM',
      description: 'Laser Iridium spark plugs provide superior ignitability and long service life across all standard engines.',
      features: ['Iridium tip', 'Platinum ground electrode'],
      specifications: { 'Thread Diameter': '12mm', 'Hex Size': '16mm' },
      compatibleVehicles: [fitmentUniversal],
      compatibilityTokens: ['all:universal:universal', 'universal'],
      price: 850,
      mrp: 1100,
      discount: 22.7,
      gstRate: 18,
      warranty: '6 Months',
      returnPolicy: '7 Days Replacement',
      warrantyPolicy: 'Manufacturer warranty',
      delivery: { weightKg: 0.2, dimensionsCm: { length: 10, width: 3, height: 3 } },
      images: [{ id: 'img_p2', url: 'https://cdn.example.com/spark_plug.jpg', storagePath: 'prod_p2.jpg', isPrimary: true, displayOrder: 0 }],
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
      currentStock: 40,
      reservedStock: 0,
      availableStock: 40,
      lowStockThreshold: 5,
      sku: 'SKU-NGK-PLUG',
      status: 'IN_STOCK',
      lastRestockedAt: now,
      updatedAt: now,
    });

    // 5. Product 3: Hyundai i20 Headlamp (by Seller B - Fits Hyundai i20 only)
    const fitmentP3 = {
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
    const product3 = await productRepository.create({
      id: 'prod_lumax_i20_headlamp',
      sellerId: sellerBId,
      productName: 'Lumax Projector Headlamp Assembly (i20 Left)',
      brand: 'Lumax',
      manufacturer: 'Lumax Industries Ltd',
      partNumber: 'LX-92101-1J000',
      oemNumber: '92101-1J000',
      category: 'Lighting & Electronics',
      subCategory: 'Headlamps',
      productType: 'OEM',
      description: 'Original projector headlamp with LED daylight running lights for Hyundai i20.',
      features: ['Projector lens', 'LED DRL'],
      specifications: { Side: 'Left (LH)', Type: 'Projector' },
      compatibleVehicles: [fitmentP3],
      compatibilityTokens: [generateCompatibilityToken(fitmentP3)],
      price: 4500,
      mrp: 5800,
      discount: 22.4,
      gstRate: 18,
      warranty: '12 Months',
      returnPolicy: '10 Days Return',
      warrantyPolicy: 'Original Lumax replacement warranty',
      delivery: { weightKg: 3.5, dimensionsCm: { length: 45, width: 30, height: 25 } },
      images: [{ id: 'img_p3', url: 'https://cdn.example.com/i20_headlamp.jpg', storagePath: 'prod_p3.jpg', isPrimary: true, displayOrder: 0 }],
      status: 'APPROVED',
      rejectionReason: null,
      reviewedBy: 'admin01',
      reviewedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await inventoryRepository.create({
      id: product3.id,
      productId: product3.id,
      sellerId: sellerBId,
      currentStock: 8,
      reservedStock: 0,
      availableStock: 8,
      lowStockThreshold: 2,
      sku: 'SKU-LX-I20-HL',
      status: 'IN_STOCK',
      lastRestockedAt: now,
      updatedAt: now,
    });

    return {
      sellerAId,
      sellerBId,
      product1,
      product2,
      product3,
    };
  }

  // --------------------------------------------------------------------------
  // 1. MARKETPLACE SEARCH, FILTER & COMPATIBILITY DISCOVERY
  // --------------------------------------------------------------------------

  test('1. Search products by keyword and category returns public listings with seller cards', async () => {
    const fixture = await setupMarketplaceFixture();

    const res = await fetch(`${baseUrl}/api/v1/products/search?q=Ceramic&category=Braking%20System`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.products.length >= 1);

    const hit = json.data.products[0];
    assert.strictEqual(hit.id, fixture.product1.id);
    assert.strictEqual(hit.productName, 'Bosch Front Ceramic Brake Pads (Swift)');
    // Public seller badge
    assert.ok(hit.seller);
    assert.strictEqual(hit.seller.name, 'Apex Brake Tech Solutions');
    assert.strictEqual(hit.seller.city, 'New Delhi');
    assert.strictEqual(hit.seller.verified, true);
    // Crucial: No confidential financial details leaked to public
    assert.strictEqual(hit.seller.gstin, undefined);
    assert.strictEqual(hit.seller.bankDetails, undefined);
  });

  test('2. 7-tier vehicle fitment query matches exact vehicle fitment and universal parts', async () => {
    const fixture = await setupMarketplaceFixture();

    // Query for Maruti Suzuki Swift 2021
    const res = await fetch(
      `${baseUrl}/api/v1/products/compatible?vehicleType=passenger&manufacturerId=maruti-suzuki&modelId=swift&year=2021`
    );
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.vehicleContext.modelId, 'swift');

    const matchedIds = json.data.products.map((p) => p.id);
    // Product 1 (Swift brake pads) must match
    assert.ok(matchedIds.includes(fixture.product1.id));
    // Product 2 (Universal spark plug) must match
    assert.ok(matchedIds.includes(fixture.product2.id));
    // Product 3 (Hyundai i20 headlamp) must NOT match
    assert.ok(!matchedIds.includes(fixture.product3.id));
  });

  test('3. Public product detail endpoint returns live stock availability and seller summary', async () => {
    const fixture = await setupMarketplaceFixture();

    const res = await fetch(`${baseUrl}/api/v1/products/${fixture.product1.id}`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    const prod = json.data.product;
    assert.strictEqual(prod.id, fixture.product1.id);
    assert.strictEqual(prod.seller.name, 'Apex Brake Tech Solutions');
    assert.strictEqual(prod.stockAvailability.inStock, true);
    assert.strictEqual(prod.stockAvailability.availableStock, 25);
  });

  // --------------------------------------------------------------------------
  // 2. CUSTOMER CART OPERATIONS & MULTI-VENDOR GROUPING
  // --------------------------------------------------------------------------

  test('4. Customer adds items to cart, updates quantity, and verifies multi-vendor grouping', async () => {
    const fixture = await setupMarketplaceFixture();
    const customerAuth = 'Bearer mock-token-CUSTOMER-cust001-ACTIVE';

    // Add Product 1 (qty 2)
    const add1 = await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product1.id, quantity: 2 }),
    });
    assert.strictEqual(add1.status, 200);

    // Add Product 2 (qty 3)
    const add2 = await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product2.id, quantity: 3 }),
    });
    assert.strictEqual(add2.status, 200);

    // Fetch Cart
    const getCart = await fetch(`${baseUrl}/api/v1/cart`, {
      headers: { Authorization: customerAuth },
    });
    assert.strictEqual(getCart.status, 200);
    const cartJson = await getCart.json();
    const cart = cartJson.data.cart;

    assert.strictEqual(cart.items.length, 2);
    assert.strictEqual(cart.sellerCount, 2); // 2 distinct sellers
    assert.strictEqual(cart.itemCount, 5); // 2 + 3

    // Verify multi-vendor groups
    const groupA = cart.groups.find((g) => g.seller.id === fixture.sellerAId);
    assert.ok(groupA);
    assert.strictEqual(groupA.seller.name, 'Apex Brake Tech Solutions');
    assert.strictEqual(groupA.items.length, 1);
    assert.strictEqual(groupA.subtotal, 1800 * 2); // 3600
    assert.strictEqual(groupA.shippingFee, 0); // Subtotal >= 1500 -> Free

    const groupB = cart.groups.find((g) => g.seller.id === fixture.sellerBId);
    assert.ok(groupB);
    assert.strictEqual(groupB.seller.name, 'Northern Spares & Electricals');
    assert.strictEqual(groupB.items.length, 1);
    assert.strictEqual(groupB.subtotal, 850 * 3); // 2550
    assert.strictEqual(groupB.shippingFee, 0); // Subtotal >= 1500 -> Free

    // Update quantity of Product 1 from 2 to 4
    const updateRes = await fetch(`${baseUrl}/api/v1/cart/items/${fixture.product1.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ quantity: 4 }),
    });
    assert.strictEqual(updateRes.status, 200);
    const updateJson = await updateRes.json();
    assert.strictEqual(updateJson.data.cart.itemCount, 7); // 4 + 3
  });

  test('5. Cart rejects quantity exceeding live inventory stock', async () => {
    const fixture = await setupMarketplaceFixture();
    const customerAuth = 'Bearer mock-token-CUSTOMER-cust002-ACTIVE';

    // Product 3 has stock = 8. Attempting to add 15 must fail
    const res = await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product3.id, quantity: 15 }),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'INSUFFICIENT_STOCK');
  });

  test('6. Cart item removal and clear cart endpoints succeed', async () => {
    const fixture = await setupMarketplaceFixture();
    const customerAuth = 'Bearer mock-token-CUSTOMER-cust003-ACTIVE';

    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product1.id, quantity: 1 }),
    });
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product2.id, quantity: 1 }),
    });

    // Remove single item
    const removeRes = await fetch(`${baseUrl}/api/v1/cart/items/${fixture.product1.id}`, {
      method: 'DELETE',
      headers: { Authorization: customerAuth },
    });
    assert.strictEqual(removeRes.status, 200);
    const removeJson = await removeRes.json();
    assert.strictEqual(removeJson.data.cart.items.length, 1);

    // Clear entire cart
    const clearRes = await fetch(`${baseUrl}/api/v1/cart`, {
      method: 'DELETE',
      headers: { Authorization: customerAuth },
    });
    assert.strictEqual(clearRes.status, 200);
    const clearJson = await clearRes.json();
    assert.strictEqual(clearJson.data.cart.items.length, 0);
  });

  // --------------------------------------------------------------------------
  // 3. MULTI-VENDOR CHECKOUT & SUB-ORDER SPLITTING
  // --------------------------------------------------------------------------

  test('7. Multi-vendor checkout splits into 1 Parent Order and 2 Seller Sub-Orders', async () => {
    const fixture = await setupMarketplaceFixture();
    const customerAuth = 'Bearer mock-token-CUSTOMER-custCheckout01-ACTIVE';

    // Customer adds Product 1 (Seller A, qty 2 @ 1800) and Product 3 (Seller B, qty 1 @ 4500)
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product1.id, quantity: 2 }),
    });
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product3.id, quantity: 1 }),
    });

    // Execute Checkout
    const checkoutRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Aarav Sharma',
          phone: '9811223344',
          addressLine1: 'Flat 402, Green Valley Heights',
          city: 'Gurugram',
          state: 'Haryana',
          pinCode: '122002',
          type: 'home',
        },
        paymentMethod: 'cod',
        vehicleContext: {
          vehicleType: 'passenger',
          manufacturer: 'Maruti Suzuki',
          model: 'Swift',
          year: 2021,
        },
      }),
    });

    assert.strictEqual(checkoutRes.status, 201);
    const checkoutJson = await checkoutRes.json();
    assert.strictEqual(checkoutJson.success, true);

    const { order, packages } = checkoutJson.data;

    // 1. Validate Parent Order
    assert.ok(order.id.startsWith('order_'));
    assert.ok(order.orderNumber.startsWith('APH-2026-'));
    assert.strictEqual(order.customerId, 'custCheckout01');
    assert.strictEqual(order.paymentStatus, 'PENDING'); // COD
    assert.strictEqual(order.status, 'CREATED');
    assert.strictEqual(order.sellerCount, 2);
    assert.strictEqual(order.itemCount, 3); // 2 + 1
    assert.strictEqual(order.subtotal, 1800 * 2 + 4500 * 1); // 3600 + 4500 = 8100
    assert.strictEqual(order.shippingTotal, 0); // Both packages > 1500 free shipping
    assert.strictEqual(order.totalPayable, 8100);

    // 2. Validate Seller Sub-Orders (Packages)
    assert.strictEqual(packages.length, 2);

    const pkgA = packages.find((p) => p.sellerId === fixture.sellerAId);
    assert.ok(pkgA);
    assert.ok(pkgA.subOrderNumber.includes('PKG'));
    assert.strictEqual(pkgA.sellerName, 'Apex Brake Tech Solutions');
    assert.strictEqual(pkgA.items.length, 1);
    assert.strictEqual(pkgA.items[0].productId, fixture.product1.id);
    assert.strictEqual(pkgA.items[0].quantity, 2);
    assert.strictEqual(pkgA.subtotal, 3600);

    const pkgB = packages.find((p) => p.sellerId === fixture.sellerBId);
    assert.ok(pkgB);
    assert.ok(pkgB.subOrderNumber.includes('PKG'));
    assert.strictEqual(pkgB.sellerName, 'Northern Spares & Electricals');
    assert.strictEqual(pkgB.items.length, 1);
    assert.strictEqual(pkgB.items[0].productId, fixture.product3.id);
    assert.strictEqual(pkgB.items[0].quantity, 1);
    assert.strictEqual(pkgB.subtotal, 4500);

    // 3. Verify Customer Cart is emptied after checkout
    const cartRes = await fetch(`${baseUrl}/api/v1/cart`, {
      headers: { Authorization: customerAuth },
    });
    const cartData = await cartRes.json();
    assert.strictEqual(cartData.data.cart.items.length, 0);

    // 4. Verify Stock Deduction in Inventory Repository
    const inv1 = await inventoryRepository.findByProductId(fixture.product1.id);
    assert.strictEqual(inv1.availableStock, 25 - 2); // 23

    const inv3 = await inventoryRepository.findByProductId(fixture.product3.id);
    assert.strictEqual(inv3.availableStock, 8 - 1); // 7

    // 5. Verify Inventory Movement Audit Records
    const movements = await inventoryRepository.getMovementsByProduct(fixture.product1.id);
    const saleMovement = movements.find((m) => m.referenceId === order.id);
    assert.ok(saleMovement);
    assert.strictEqual(saleMovement.type, 'SALE');
    assert.strictEqual(saleMovement.quantityChanged, -2);
    assert.strictEqual(saleMovement.balanceBefore, 25);
    assert.strictEqual(saleMovement.balanceAfter, 23);
  });

  // --------------------------------------------------------------------------
  // 4. ATOMIC CHECKOUT ROLLBACK ON STOCK INSUFFICIENCY
  // --------------------------------------------------------------------------

  test('8. Checkout fails safely if item goes out of stock before order placement', async () => {
    const fixture = await setupMarketplaceFixture();
    const customerAuth = 'Bearer mock-token-CUSTOMER-custRollback-ACTIVE';

    // Put Product 3 (has 8 stock) in cart
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product3.id, quantity: 5 }),
    });

    // Simulate concurrent purchase draining stock to 2
    await inventoryRepository.adjustStock({
      productId: fixture.product3.id,
      sellerId: fixture.sellerBId,
      delta: -6,
      type: 'SALE',
      reason: 'Concurrent transaction',
      referenceId: 'concurrent_01',
      performedBy: 'other_user',
    });

    // Attempt checkout: requested 5, but available is now only 2
    const checkoutRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Rollback Test',
          phone: '9811223344',
          addressLine1: 'Test Address',
          city: 'Delhi',
          state: 'Delhi',
          pinCode: '110001',
          type: 'home',
        },
        paymentMethod: 'cod',
      }),
    });

    assert.strictEqual(checkoutRes.status, 400);
    const checkoutJson = await checkoutRes.json();
    assert.strictEqual(checkoutJson.error.code, 'INSUFFICIENT_STOCK');

    // Verify stock remains intact at 2
    const inv = await inventoryRepository.findByProductId(fixture.product3.id);
    assert.strictEqual(inv.availableStock, 2);
  });

  // --------------------------------------------------------------------------
  // 5. TENANT ISOLATION (CUSTOMER & SELLER ROLE PRIVACY)
  // --------------------------------------------------------------------------

  test('9. Customer isolation: Customer cannot inspect another customer order', async () => {
    const fixture = await setupMarketplaceFixture();
    const customer1Auth = 'Bearer mock-token-CUSTOMER-custA-ACTIVE';
    const customer2Auth = 'Bearer mock-token-CUSTOMER-custB-ACTIVE';

    // Customer A creates an order
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customer1Auth },
      body: JSON.stringify({ productId: fixture.product1.id, quantity: 1 }),
    });

    const checkoutRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customer1Auth },
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Customer A',
          phone: '9811223344',
          addressLine1: 'Cust A Address',
          city: 'Delhi',
          state: 'Delhi',
          pinCode: '110001',
          type: 'home',
        },
        paymentMethod: 'cod',
      }),
    });
    const orderData = await checkoutRes.json();
    const orderId = orderData.data.order.id;

    // Customer B tries to view Customer A's order
    const breachRes = await fetch(`${baseUrl}/api/v1/orders/${orderId}`, {
      headers: { Authorization: customer2Auth },
    });
    assert.strictEqual(breachRes.status, 403);
    const breachJson = await breachRes.json();
    assert.strictEqual(breachJson.error.code, 'FORBIDDEN');
  });

  test('10. Seller isolation: Seller A cannot view or alter Seller B sub-order', async () => {
    const fixture = await setupMarketplaceFixture();
    const customerAuth = 'Bearer mock-token-CUSTOMER-custMulti-ACTIVE';
    const sellerAAuth = 'Bearer mock-token-SELLER-userSellerA-ACTIVE';

    // Add items from both sellers to trigger 2 sub-orders
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product1.id, quantity: 1 }),
    });
    await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({ productId: fixture.product2.id, quantity: 1 }),
    });

    const checkoutRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: customerAuth },
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Customer Multi',
          phone: '9811223344',
          addressLine1: 'Multi Street',
          city: 'Delhi',
          state: 'Delhi',
          pinCode: '110001',
          type: 'home',
        },
        paymentMethod: 'cod',
      }),
    });
    const orderData = await checkoutRes.json();
    const packages = orderData.data.packages;
    const pkgA = packages.find((p) => p.sellerId === fixture.sellerAId);
    const pkgB = packages.find((p) => p.sellerId === fixture.sellerBId);

    // 1. Seller A views their merchant orders
    const sellerAOrdersRes = await fetch(`${baseUrl}/api/v1/sellers/orders`, {
      headers: { Authorization: sellerAAuth },
    });
    assert.strictEqual(sellerAOrdersRes.status, 200);
    const sellerAOrders = await sellerAOrdersRes.json();
    assert.strictEqual(sellerAOrders.data.subOrders.length, 1);
    assert.strictEqual(sellerAOrders.data.subOrders[0].id, pkgA.id);

    // 2. Seller A attempts to view Seller B's sub-order -> 403 Forbidden
    const crossViewRes = await fetch(`${baseUrl}/api/v1/sellers/orders/${pkgB.id}`, {
      headers: { Authorization: sellerAAuth },
    });
    assert.strictEqual(crossViewRes.status, 403);
    const crossViewJson = await crossViewRes.json();
    assert.strictEqual(crossViewJson.error.code, 'FORBIDDEN');

    // 3. Seller A attempts to update status of Seller B's sub-order -> 403 Forbidden
    const crossUpdateRes = await fetch(`${baseUrl}/api/v1/sellers/orders/${pkgB.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: sellerAAuth },
      body: JSON.stringify({ status: 'CONFIRMED' }),
    });
    assert.strictEqual(crossUpdateRes.status, 403);

    // 4. Seller A successfully updates their OWN sub-order status
    const ownUpdateRes = await fetch(`${baseUrl}/api/v1/sellers/orders/${pkgA.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: sellerAAuth },
      body: JSON.stringify({ status: 'CONFIRMED' }),
    });
    assert.strictEqual(ownUpdateRes.status, 200);
    const ownUpdateJson = await ownUpdateRes.json();
    assert.strictEqual(ownUpdateJson.data.subOrder.status, 'CONFIRMED');
  });
});
