# AutoPartsHub Backend Architecture Specification (Phase 0)

## 1. System Architecture Overview

```
                               ┌──────────────────────────────────────────────┐
                               │           FRONTEND LAYER (Vite/React)        │
                               │  - Customer Storefront & Catalog             │
                               │  - Seller Merchant Panel                     │
                               │  - Platform Admin Console                    │
                               │  - B2B Workshop & Fleet Hub                  │
                               │  - OEM Brand / Manufacturer Dashboard        │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTPS / JSON
                                                      │ Bearer JWT (Firebase Auth)
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │        BACKEND API ENGINE (Render.com)       │
                               │  - Express.js + TypeScript (Strict ES2022)   │
                               │  - Helmet Security & CORS Whitelist Policy   │
                               │  - Request ID Tracing (X-Request-Id)         │
                               │  - Versioned REST Endpoints (/api/v1/*)      │
                               │  - Zod Request DTO Validation Pipelines      │
                               │  - Centralized Error Enveloping & Logging    │
                               │  - Server-Side Role-Based Access Control     │
                               └──────────────┬───────────────────────────────┘
                                              │ Privileged Firebase Admin SDK
                                              │ External Service Adapters
                        ┌─────────────────────┴─────────────────────────┐
                        ▼                                               ▼
     ┌─────────────────────────────────────┐         ┌─────────────────────────────────────┐
     │          FIREBASE SERVICES          │         │          EXTERNAL INTEGRATIONS      │
     │ - Firebase Auth (Identity Layer)    │         │ - Payment Gateways (Razorpay/Cashfree│
     │ - Cloud Firestore (Core Data Store) │         │ - Logistics Aggregators (Shiprocket)│
     │ - Firebase Storage (KYC/Assets/RMA) │         │ - SMS/WhatsApp Gateway (Twilio/Gupshup│
     └─────────────────────────────────────┘         └─────────────────────────────────────┘
```

---

## 2. Frontend Data Inventory & Backend Entity Mapping

| Frontend Domain | Source Frontend Types | Required Backend Module | Firestore Collection |
| :--- | :--- | :--- | :--- |
| **Authentication & Profiles** | `CustomerUser`, `SellerProfile`, `AdminSeller`, `B2BGarageProfile`, `B2BFleetProfile`, `ManufacturerBrandProfile` | `auth`, `users` | `/users/{uid}`, `/roles/{uid}` |
| **Vehicle Hierarchy** | `SelectedVehicle`, `VehicleModel`, `Manufacturer`, `VehicleCategoryType` | `vehicles` | `/vehicle_manufacturers`, `/vehicle_models`, `/vehicles` |
| **Categories & Brands** | `Category`, `VehicleBrand`, `PartType` | `catalog` | `/categories`, `/brands` |
| **Parts & Compatibility** | `Product`, `VehicleCompatibility`, `ProductSpecs` | `products` | `/products/{productId}` (subcollection: `/products/{productId}/compatibility`) |
| **Seller Operations** | `SellerProduct`, `SellerKPIMetrics`, `SellerDocument`, `SellerSettlement` | `sellers`, `inventory`, `finance` | `/sellers/{sellerId}`, `/sellers/{sellerId}/inventory`, `/settlements` |
| **Multi-Vendor Cart & Orders** | `CartItem`, `SellerCartGroupData`, `ConfirmedOrder`, `SellerOrderPackage`, `CustomerOrder` | `cart`, `orders` | `/orders/{orderId}`, `/sub_orders/{subOrderId}` |
| **Payment Transactions** | `PaymentDetails`, `PaymentMethodType` | `payments` | `/payments/{paymentId}`, `/transactions` |
| **Shipping & Tracking** | `PackageTrackingInfo`, `TrackingCheckpoint`, `SellerShipmentState` | `shipping` | `/shipments/{shipmentId}` |
| **Returns & Warranty** | `ReturnReason`, `ReturnStatus`, `WarrantyClaim`, `WarrantyOutcome` | `returns`, `warranty` | `/returns/{rmaId}`, `/warranty_claims/{claimId}` |
| **B2B Wholesale** | `B2BGSTInvoice`, `B2BBulkTier`, `B2BCreditAccount` | `b2b` | `/b2b_profiles`, `/b2b_invoices`, `/credit_accounts` |
| **Manufacturer Hub** | `ManufacturerProduct`, `ManufacturerDealer`, `CustomerDemandAnalytics`, `RevenueAnalytics` | `manufacturer` | `/manufacturers`, `/oem_consignments`, `/demand_analytics` |
| **Admin Oversight** | `AdminAuditLog`, `AdminSellerApplication`, `AdminModerationProduct` | `admin` | `/admin_audit_logs`, `/platform_settings` |
| **Reviews & Ratings** | `Review`, Verified Purchase badges | `reviews` | `/reviews/{reviewId}` |
| **Notifications** | `CustomerNotification`, `SellerNotification`, `ManufacturerNotification` | `notifications` | `/notifications/{notificationId}` |

---

## 3. Database Schema (Cloud Firestore)

Firestore is structured with dedicated root collections and strict subcollection patterns for high-throughput scaling:

1. **`/users/{uid}`**:
   - `uid`: string (matches Firebase Auth UID)
   - `email`: string
   - `phone`: string
   - `role`: `'customer' | 'seller' | 'admin' | 'b2b' | 'manufacturer'`
   - `status`: `'active' | 'suspended' | 'pending_verification'`
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

2. **`/customers/{uid}`**:
   - `uid`: string
   - `fullName`: string
   - `savedVehicles`: Array of vehicle references
   - `addresses`: Subcollection `/customers/{uid}/addresses/{addressId}`

3. **`/sellers/{sellerId}`**:
   - `sellerId`: string
   - `businessName`: string
   - `sellerType`: `'Manufacturer' | 'Authorized Distributor' | 'Certified Wholesaler' | 'Verified Retailer'`
   - `gstin`: string
   - `pan`: string
   - `kycStatus`: `'Pending' | 'Submitted' | 'Under Review' | 'Verified' | 'Requires Action'`
   - `commissionRate`: number (percentage, default 10%)
   - `bankDetails`: Object (encrypted at rest / masked on reads)
   - `documents`: Subcollection `/sellers/{sellerId}/documents/{docId}`

4. **`/products/{productId}`**:
   - `productId`: string
   - `title`: string
   - `brand`: string
   - `sellerId`: string
   - `partNumber`: string
   - `oemNumber`: string
   - `category`: string
   - `subCategory`: string
   - `partType`: `'Genuine' | 'OEM' | 'Aftermarket'`
   - `price`: number (paise / integer representation for safety)
   - `mrp`: number
   - `stock`: number
   - `inStock`: boolean
   - `compatibilityList`: Array of normalized vehicle fitment tokens
   - `status`: `'active' | 'pending_approval' | 'draft' | 'archived'`

5. **`/orders/{orderId}`** (Parent Marketplace Order):
   - `orderId`: string (e.g. `ORD-2026-98124`)
   - `customerId`: string
   - `orderDate`: Timestamp
   - `overallStatus`: `'processing' | 'shipped' | 'partially_delivered' | 'delivered' | 'cancelled'`
   - `totalAmount`: number
   - `paymentMethod`: string
   - `paymentStatus`: `'Paid' | 'Pending' | 'Refunded'`
   - `deliveryAddress`: Object
   - `subOrderIds`: string[]

6. **`/sub_orders/{subOrderId}`** (Seller Package Consignment):
   - `subOrderId`: string (e.g. `PKG-DEL-77821`)
   - `parentOrderId`: string
   - `sellerId`: string
   - `items`: Array of items
   - `subtotal`: number
   - `shippingFee`: number
   - `status`: `'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'`
   - `trackingId`: string
   - `courierPartner`: string

---

## 4. Authentication & RBAC Strategy

- **Identity Layer**: Firebase Authentication is the sole credential provider.
- **Custom Claims**: Role assertions (`customer`, `seller`, `admin`, `b2b`, `manufacturer`) are stored as Firebase Auth Custom Claims, verified and signed server-side by Firebase Admin.
- **Server-Side Enforcement**:
  Every incoming API request must supply `Authorization: Bearer <FirebaseIDToken>`.
  The backend token verification middleware validates:
  1. Signature validity and token expiration.
  2. Account status (`active` vs `suspended`).
  3. Requested route privilege against user claims.
  4. Ownership checks (e.g. `sellerId === req.user.sellerId` or `req.user.role === 'admin'`).
  *Frontend-supplied roles in headers or request bodies are completely ignored.*

---

## 5. Security Rules Strategy (Firebase Storage & Firestore)

1. **Firestore Client-SDK Rules**:
   - Deny all direct client writes by default (`allow write: if false;`).
   - All state mutations (orders, inventory changes, KYC status, pricing) occur strictly via the Render Backend API using the Firebase Admin SDK.
   - Read permissions for public catalogs (`/products`, `/categories`, `/vehicle_manufacturers`) are permitted with active status filters.
2. **Storage Rules**:
   - `/kyc/{sellerId}/*`: Readable only by Admin and owning Seller; writable only via pre-signed backend upload URLs.
   - `/products/{productId}/*`: Publicly readable; writable only by verified Seller owner and Admin.
   - `/rma/{claimId}/*`: Readable by Customer, Seller, and Admin.

---

## 6. API Architecture & Versioning

- **Root Versioning**: `/api/v1`
- **Standard Success Response Envelope**:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": {
      "timestamp": "2026-09-22T04:00:00.000Z",
      "requestId": "9b3756c8-d421-48b9-bd16-8dc849581c79",
      "version": "v1"
    }
  }
  ```
- **Standard Error Response Envelope**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Validation error: invalid request payload",
      "details": [
        { "field": "email", "message": "Invalid email address format" }
      ]
    },
    "meta": {
      "timestamp": "2026-09-22T04:00:00.000Z",
      "requestId": "9b3756c8-d421-48b9-bd16-8dc849581c79",
      "version": "v1"
    }
  }
  ```

---

## 7. Render Deployment Blueprint

- **Service Type**: Web Service (Node.js LTS)
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` (executes `node dist/index.js`)
- **Health Check Path**: `/health`
- **Port**: Dynamically bound to `process.env.PORT` (defaults to 10000)
- **Zero Downtime Deployments**: Enabled via Render health check probes.
