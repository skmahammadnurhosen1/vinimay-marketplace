# AutoPartsHub Backend Environment Setup & Deployment Guide

This guide details local setup, environment configuration, Firebase provisioning, and Render deployment for the AutoPartsHub / Vinimart multi-vendor automobile spare-parts marketplace backend.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher
- **Firebase Project**:
  - Firebase Authentication (Email/Password, Phone OTP, Google Sign-In)
  - Cloud Firestore (in Native mode)
  - Firebase Storage
- **Render Account**: For independent backend deployment (Web Service)

---

## 2. Environment Variables Reference

Create a `.env` file in the `backend/` root:

```env
# Application Port and Runtime Mode
PORT=5000
NODE_ENV=development

# Frontend CORS Allowed Origins (Comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://autopartshub.web.app

# Firebase Service Account Credentials
# (Can be provided either as individual fields or as a JSON string in FIREBASE_SERVICE_ACCOUNT_KEY)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-firebase-project-id.appspot.com

# Alternatively, in Render, provide single compact JSON string:
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Payment Gateway Secrets (Razorpay / Mock)
PAYMENT_GATEWAY_KEY_ID=rzp_test_mockKeyId
PAYMENT_GATEWAY_KEY_SECRET=rzp_test_mockKeySecret
PAYMENT_SECRET=super_secret_authoritative_marketplace_signing_key_2026

# Logistics Partner Integration Secrets
LOGISTICS_API_KEY=mock_logistics_api_key_delhivery_shiprocket
LOGISTICS_WEBHOOK_SECRET=mock_logistics_webhook_hmac_secret_2026

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
```

---

## 3. Local Development

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start local development server with hot-reload
npm run dev

# 4. Build TypeScript to JavaScript
npm run build

# 5. Run full automated test suite (all 8 phases)
npm test
```

---

## 4. Render Deployment Configuration

The backend is packaged as an independent service on Render.

1. **Service Type**: **Web Service**
2. **Environment**: **Node**
3. **Repository**: Point to repository or monorepo root.
4. **Root Directory**: `backend`
5. **Build Command**:
   ```bash
   npm install && npm run build
   ```
6. **Start Command**:
   ```bash
   npm start
   ```
7. **Health Check Path**:
   ```
   /api/v1/health
   ```
8. **Environment Variables on Render**:
   - Set `NODE_ENV` to `production`.
   - Set `PORT` to `10000` (Render's default port, or use dynamic `$PORT`).
   - Set `FIREBASE_SERVICE_ACCOUNT_KEY` to the complete Firebase Admin Service Account JSON.
   - Set `CORS_ORIGIN` to the deployed frontend domain (e.g. `https://autopartshub.web.app`).
   - Set `PAYMENT_GATEWAY_KEY_ID`, `PAYMENT_GATEWAY_KEY_SECRET`, and `PAYMENT_SECRET`.

---

## 5. Decoupled Frontend Deployment

The frontend (Vite + React) is independently deployable (e.g., on Firebase Hosting, Vercel, or Netlify):

1. Set the frontend environment variable:
   ```env
   VITE_API_URL=https://<your-render-service>.onrender.com/api/v1
   ```
2. Build and deploy frontend:
   ```bash
   # From root workspace
   npm install
   npm run build
   firebase deploy --only hosting
   ```
This cleanly decouples frontend and backend while maintaining contract consistency.
