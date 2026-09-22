import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../dist/app.js';

describe('Phase 0 Backend Infrastructure & Health Endpoint Tests', () => {
  let server;
  let baseUrl;
  const PORT = 10099;

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

  test('GET /health returns 200 OK with standard response envelope and health metrics', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data);
    assert.strictEqual(json.data.status, 'UP');
    assert.strictEqual(json.data.service, 'autopartshub-backend-api');
    assert.strictEqual(json.data.version, '1.0.0');
    assert.ok(json.data.uptimeSeconds !== undefined);
    assert.ok(json.data.memory);
    assert.ok(json.data.dependencies.firebase);

    // Meta verification
    assert.ok(json.meta);
    assert.ok(json.meta.timestamp);
    assert.ok(json.meta.requestId);
    assert.strictEqual(json.meta.version, 'v1');

    // Header verification
    assert.ok(res.headers.get('x-request-id'));
  });

  test('GET /api/v1 returns 200 OK with endpoint index map', async () => {
    const res = await fetch(`${baseUrl}/api/v1`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.endpoints);
    assert.strictEqual(json.data.endpoints.health, '/api/v1/health');
  });

  test('GET /api/v1/health returns 200 OK under versioned API router', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'UP');
  });

  test('GET /non-existent-route returns 404 with standard error envelope', async () => {
    const res = await fetch(`${baseUrl}/non-existent-route`);
    assert.strictEqual(res.status, 404);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.error);
    assert.strictEqual(json.error.code, 'RESOURCE_NOT_FOUND');
    assert.ok(json.meta.requestId);
  });
});
