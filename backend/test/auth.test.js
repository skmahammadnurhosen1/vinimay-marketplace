import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';
import { userRepository } from '../dist/modules/users/user.repository.js';

describe('Phase 1 Firebase Authentication & RBAC Test Suite', () => {
  let server;
  let baseUrl;
  const PORT = 10100;

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
    userRepository._clearMemory();
  });

  test('1. Missing Token: GET /api/v1/auth/me returns 401 AUTH_MISSING_TOKEN', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert.strictEqual(res.status, 401);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'AUTH_MISSING_TOKEN');
  });

  test('2. Invalid Token: GET /api/v1/auth/me with garbage token returns 401 AUTH_INVALID_TOKEN', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: 'Bearer mock-token-INVALID',
      },
    });
    assert.strictEqual(res.status, 401);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'AUTH_INVALID_TOKEN');
  });

  test('3. Expired Token: GET /api/v1/auth/me with expired token returns 401 AUTH_TOKEN_EXPIRED', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: 'Bearer mock-token-EXPIRED',
      },
    });
    assert.strictEqual(res.status, 401);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'AUTH_TOKEN_EXPIRED');
  });

  test('4. Revoked Token: GET /api/v1/auth/me with revoked token returns 401 AUTH_TOKEN_REVOKED', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: 'Bearer mock-token-REVOKED',
      },
    });
    assert.strictEqual(res.status, 401);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'AUTH_TOKEN_REVOKED');
  });

  test('5. Valid Authentication: GET /api/v1/auth/me returns user profile and permissions', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: 'Bearer mock-token-CUSTOMER-cust101-ACTIVE',
      },
    });
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.uid, 'cust101');
    assert.strictEqual(json.data.role, 'CUSTOMER');
    assert.strictEqual(json.data.accountStatus, 'ACTIVE');
    assert.ok(Array.isArray(json.data.permissions));
    assert.ok(json.data.permissions.includes('CATALOG_READ'));
    assert.ok(json.data.permissions.includes('ORDER_CREATE'));
  });

  test('6. Suspended Account: GET /api/v1/auth/me returns 403 AUTH_ACCOUNT_SUSPENDED', async () => {
    // Seed suspended user
    userRepository._seedUser({
      uid: 'baduser1',
      email: 'baduser1@test.com',
      displayName: 'Suspended User',
      role: 'CUSTOMER',
      accountStatus: 'SUSPENDED',
      emailVerified: true,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: 'Bearer mock-token-CUSTOMER-baduser1-SUSPENDED',
      },
    });
    assert.strictEqual(res.status, 403);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'AUTH_ACCOUNT_SUSPENDED');
  });

  test('7. Disabled Account: GET /api/v1/auth/me returns 403 AUTH_ACCOUNT_DISABLED', async () => {
    // Seed disabled user
    userRepository._seedUser({
      uid: 'disableduser1',
      email: 'disableduser1@test.com',
      displayName: 'Disabled User',
      role: 'SELLER',
      accountStatus: 'DISABLED',
      emailVerified: true,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: 'Bearer mock-token-SELLER-disableduser1-DISABLED',
      },
    });
    assert.strictEqual(res.status, 403);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'AUTH_ACCOUNT_DISABLED');
  });

  test('8. Unauthorized Role: CUSTOMER accessing GET /api/v1/auth/admin-check returns 403 AUTH_FORBIDDEN_ROLE', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/admin-check`, {
      headers: {
        Authorization: 'Bearer mock-token-CUSTOMER-cust202-ACTIVE',
      },
    });
    assert.strictEqual(res.status, 403);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'AUTH_FORBIDDEN_ROLE');
  });

  test('9. Authorized Role: ADMIN accessing GET /api/v1/auth/admin-check returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/admin-check`, {
      headers: {
        Authorization: 'Bearer mock-token-ADMIN-superadmin1-ACTIVE',
      },
    });
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.authorized, true);
    assert.strictEqual(json.data.role, 'ADMIN');
  });

  test('10. Authorized Seller Role: SELLER accessing GET /api/v1/auth/seller-check returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/seller-check`, {
      headers: {
        Authorization: 'Bearer mock-token-SELLER-merchant42-ACTIVE',
      },
    });
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.authorized, true);
    assert.strictEqual(json.data.role, 'SELLER');
  });

  test('11. User Profile Management: GET & PATCH /api/v1/users/me updates profile fields', async () => {
    // First call creates user via auth middleware
    const getRes = await fetch(`${baseUrl}/api/v1/users/me`, {
      headers: {
        Authorization: 'Bearer mock-token-CUSTOMER-patchuser-ACTIVE',
      },
    });
    assert.strictEqual(getRes.status, 200);

    // Update display name and phone number
    const patchRes = await fetch(`${baseUrl}/api/v1/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token-CUSTOMER-patchuser-ACTIVE',
      },
      body: JSON.stringify({
        displayName: 'Aarav Sharma Updated',
        phoneNumber: '+919876543210',
      }),
    });
    assert.strictEqual(patchRes.status, 200);

    const patchJson = await patchRes.json();
    assert.strictEqual(patchJson.success, true);
    assert.strictEqual(patchJson.data.displayName, 'Aarav Sharma Updated');
    assert.strictEqual(patchJson.data.phoneNumber, '+919876543210');
  });

  test('12. Token Verification API: POST /api/v1/auth/verify-token confirms valid token', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: 'mock-token-MANUFACTURER-bosch1-ACTIVE' }),
    });
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.valid, true);
    assert.strictEqual(json.data.role, 'MANUFACTURER');
    assert.strictEqual(json.data.accountStatus, 'ACTIVE');
  });

  test('13. Logout & Revocation: POST /api/v1/auth/logout succeeds', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer mock-token-CUSTOMER-cust999-ACTIVE',
      },
    });
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.uid, 'cust999');
  });
});
