import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';
import { databaseRepository } from '../dist/modules/database/database.repository.js';
import { userRepository } from '../dist/modules/users/user.repository.js';

describe('Phase 2 Firebase Database Foundation Test Suite', () => {
  let server;
  let baseUrl;
  const PORT = 10101;

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
    databaseRepository._clearMemory();
    userRepository._clearMemory();
  });

  // -------------------------------------------------------------
  // 1. Categories Reference Data Tests
  // -------------------------------------------------------------
  test('1. GET /api/v1/categories returns list of active categories', async () => {
    const res = await fetch(`${baseUrl}/api/v1/categories`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 5);

    const slugs = json.data.map((c) => c.slug);
    assert.ok(slugs.includes('brake-parts'));
    assert.ok(slugs.includes('clutch-parts'));
    assert.ok(slugs.includes('suspension'));
    assert.ok(slugs.includes('gearbox-transmission'));
    assert.ok(slugs.includes('differential-axle'));
  });

  test('2. GET /api/v1/categories/:slug returns single category', async () => {
    const res = await fetch(`${baseUrl}/api/v1/categories/brake-parts`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, 'brake-parts');
    assert.strictEqual(json.data.name, 'Brake Parts');
    assert.ok(Array.isArray(json.data.subcategories));
  });

  test('3. GET /api/v1/categories/:slug for invalid category returns 404', async () => {
    const res = await fetch(`${baseUrl}/api/v1/categories/non-existent-cat`);
    assert.strictEqual(res.status, 404);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'CATEGORY_NOT_FOUND');
  });

  // -------------------------------------------------------------
  // 2. Brands Reference Data Tests
  // -------------------------------------------------------------
  test('4. GET /api/v1/brands returns brands with optional commercial filter', async () => {
    const res = await fetch(`${baseUrl}/api/v1/brands?category=commercial`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));

    const brandIds = json.data.map((b) => b.id);
    assert.ok(brandIds.includes('tata-cv'));
    assert.ok(brandIds.includes('ashok-leyland'));
    assert.ok(brandIds.includes('bharatbenz'));
  });

  // -------------------------------------------------------------
  // 3. Vehicle Hierarchy & Selection Tests (7-Tier)
  // -------------------------------------------------------------
  test('5. GET /api/v1/vehicles/manufacturers returns passenger and commercial makers', async () => {
    const res = await fetch(`${baseUrl}/api/v1/vehicles/manufacturers?category=passenger`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));

    const names = json.data.map((m) => m.id);
    assert.ok(names.includes('maruti-suzuki'));
    assert.ok(names.includes('hyundai'));
    assert.ok(names.includes('mahindra'));
  });

  test('6. GET /api/v1/vehicles/models returns models belonging to manufacturer', async () => {
    const res = await fetch(`${baseUrl}/api/v1/vehicles/models?manufacturerId=tata-cv`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));

    const modelIds = json.data.map((m) => m.id);
    assert.ok(modelIds.includes('tata-ace'));
    assert.ok(modelIds.includes('tata-407'));
  });

  test('7. GET /api/v1/vehicles/variants returns years, fuel types, engines, and variants', async () => {
    const res = await fetch(`${baseUrl}/api/v1/vehicles/variants?modelId=tata-ace`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.modelId, 'tata-ace');
    assert.ok(json.data.years.includes(2022));
    assert.ok(json.data.fuelTypes.includes('Diesel'));
    assert.ok(json.data.engines.includes('700cc'));
    assert.ok(json.data.variants.includes('Standard'));
  });

  // -------------------------------------------------------------
  // 4. Vehicle Fitment Validation Tests
  // -------------------------------------------------------------
  test('8. POST /api/v1/vehicles/validate-fitment verifies valid 7-tier specification', async () => {
    const validSpec = {
      vehicleType: 'commercial',
      manufacturerId: 'tata-cv',
      manufacturerName: 'Tata Commercial',
      modelId: 'tata-ace',
      modelName: 'Ace',
      year: 2022,
      fuelType: 'Diesel',
      engine: '700cc',
      variant: 'Standard',
    };

    const res = await fetch(`${baseUrl}/api/v1/vehicles/validate-fitment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validSpec),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.valid, true);
    assert.ok(json.data.compatibilityToken);
    assert.strictEqual(
      json.data.compatibilityToken,
      'commercial:tata-cv:tata-ace:2022:diesel:700cc:standard'
    );
  });

  test('9. POST /api/v1/vehicles/validate-fitment rejects mismatched vehicle relationship', async () => {
    const invalidSpec = {
      vehicleType: 'passenger', // Error: tata-cv is commercial
      manufacturerId: 'tata-cv',
      manufacturerName: 'Tata',
      modelId: 'tata-ace',
      modelName: 'Ace',
      year: 2022,
      fuelType: 'Diesel',
      engine: '700cc',
      variant: 'Standard',
    };

    const res = await fetch(`${baseUrl}/api/v1/vehicles/validate-fitment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidSpec),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'INVALID_VEHICLE_FITMENT');
  });

  test('10. POST /api/v1/vehicles/validate-fitment rejects unsupported engine for model', async () => {
    const invalidEngineSpec = {
      vehicleType: 'commercial',
      manufacturerId: 'tata-cv',
      manufacturerName: 'Tata Commercial',
      modelId: 'tata-ace',
      modelName: 'Ace',
      year: 2022,
      fuelType: 'Diesel',
      engine: '5.0L V8 NonExistent', // Error: invalid engine
      variant: 'Standard',
    };

    const res = await fetch(`${baseUrl}/api/v1/vehicles/validate-fitment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidEngineSpec),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'INVALID_VEHICLE_FITMENT');
  });

  // -------------------------------------------------------------
  // 5. Addresses Management & User Isolation Tests
  // -------------------------------------------------------------
  test('11. Unauthenticated address access rejected with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/addresses`);
    assert.strictEqual(res.status, 401);
  });

  test('12. User A creates valid Indian delivery address with 6-digit PIN', async () => {
    const addressData = {
      fullName: 'Vikram Mehta',
      phone: '9876543210',
      addressLine1: 'Shop 14, Auto Spare Plaza, Sector 18',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411026',
      type: 'garage',
      isDefault: true,
    };

    const res = await fetch(`${baseUrl}/api/v1/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-userA-ACTIVE',
      },
      body: JSON.stringify(addressData),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.fullName, 'Vikram Mehta');
    assert.strictEqual(json.data.pinCode, '411026');
    assert.strictEqual(json.data.userId, 'userA');
  });

  test('13. Address rejection on malformed Indian PIN code', async () => {
    const invalidAddress = {
      fullName: 'Vikram Mehta',
      phone: '9876543210',
      addressLine1: 'Sector 18',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '01234', // Invalid 5 digits beginning with 0
      type: 'home',
    };

    const res = await fetch(`${baseUrl}/api/v1/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-userA-ACTIVE',
      },
      body: JSON.stringify(invalidAddress),
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
  });

  test('14. Cross-User Data Isolation: User B cannot delete User A address', async () => {
    // 1. User A creates address
    const createRes = await fetch(`${baseUrl}/api/v1/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-userA-ACTIVE',
      },
      body: JSON.stringify({
        fullName: 'User A Address',
        phone: '9876543210',
        addressLine1: 'Plot 10, Bhosari',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411026',
        type: 'home',
      }),
    });
    const createdJson = await createRes.json();
    const addressId = createdJson.data.id;

    // 2. User B attempts to delete User A's address
    const deleteRes = await fetch(`${baseUrl}/api/v1/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer mock-token-CUSTOMER-userB-ACTIVE',
      },
    });

    assert.strictEqual(deleteRes.status, 404); // Returns 404 not found / unauthorized for User B

    // 3. Confirm User A can still view their address
    const getRes = await fetch(`${baseUrl}/api/v1/addresses`, {
      headers: {
        Authorization: 'Bearer mock-token-CUSTOMER-userA-ACTIVE',
      },
    });
    const getJson = await getRes.json();
    assert.strictEqual(getJson.data.length, 1);
    assert.strictEqual(getJson.data[0].id, addressId);
  });
});
