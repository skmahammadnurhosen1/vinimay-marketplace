# AutoPartsHub Backend Engine

Express.js + TypeScript REST API engine for the AutoPartsHub multi-vendor automotive spare-parts marketplace.

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start Development Server with Hot-Reload
```bash
npm run dev
```

### 4. Build & Run Production Bundle
```bash
npm run build
npm start
```

### 5. Run Test Suite
```bash
npm test
```

---

## Health Check & API Status Endpoints

- **Root Health Check**: `GET /health`
- **Versioned Health Check**: `GET /api/v1/health`
- **API V1 Directory Map**: `GET /api/v1`

---

## Project Structure

```
backend/
├── .env.example               # Environment variables specification
├── package.json               # Backend dependencies and scripts
├── render.yaml                # Render Web Service blueprint
├── tsconfig.json              # TypeScript strict configuration
├── src/
│   ├── index.ts               # Server bootstrap & graceful shutdown
│   ├── app.ts                 # Express factory & middleware pipeline
│   ├── config/
│   │   ├── environment.ts     # Zod validated environment config
│   │   └── firebase.ts        # Firebase Admin SDK initialization
│   ├── middlewares/
│   │   ├── requestId.ts       # UUID Request tracking middleware
│   │   ├── requestLogger.ts   # Structured HTTP request logger
│   │   ├── errorHandler.ts    # Centralized error handler
│   │   └── notFoundHandler.ts # 404 handler
│   ├── modules/
│   │   └── health/            # Health check module
│   │       ├── health.controller.ts
│   │       └── health.routes.ts
│   ├── routes/
│   │   └── index.ts           # Root /api/v1 router
│   └── utils/
│       ├── apiResponse.ts     # Standard JSON response envelope
│       └── logger.ts          # Structured level logger
└── test/
    └── health.test.js         # Automated test suite
```
