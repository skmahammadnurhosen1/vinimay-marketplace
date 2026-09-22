# AutoPartsHub Phase 1 — Authentication & User System Specification

This document details the backend authentication architecture, user identity model, role-based access control (RBAC), API endpoints, and frontend integration contract for **Phase 1**.

---

## 1. Authentication Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   CLIENT APPLICATION                     │
│ 1. User signs in via Firebase Client SDK                 │
│    (Email/Password, Phone OTP, Google Auth, etc.)        │
│ 2. Obtains signed Firebase ID Token (JWT)                │
│ 3. Sends HTTPS Request:                                  │
│    Authorization: Bearer <FirebaseIdToken>               │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│               RENDER BACKEND API ENGINE                  │
│ 1. requireAuthentication middleware intercepts request   │
│ 2. Extracts Bearer token from header                     │
│ 3. authService.verifyIdToken(token, checkRevoked=true)   │
│    - Verifies cryptographic signature against Google     │
│    - Checks expiration & revocation                      │
│ 4. Looks up user profile in UserRepository               │
│    - Asserts accountStatus is NOT SUSPENDED or DISABLED  │
│ 5. Attaches server-trusted req.user context              │
│ 6. requireRole / requirePermission evaluates access      │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 PROTECTED ROUTE HANDLER                  │
│ Executes controller logic with verified identity         │
└──────────────────────────────────────────────────────────┘
```

---

## 2. User Identity Model

Each user record is mapped directly to the Firebase Authentication UID (`uid`):

```typescript
export interface UserProfile {
  uid: string;                 // Primary key: Firebase Auth UID
  email: string;               // Primary contact & login identifier
  phoneNumber?: string | null; // Verified Indian mobile number (+91)
  displayName: string;         // Full name or business contact
  photoUrl?: string | null;    // Profile avatar URL
  role: UserRole;              // 'CUSTOMER' | 'SELLER' | 'MANUFACTURER' | 'ADMIN'
  accountStatus: AccountStatus;// 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISABLED'
  emailVerified: boolean;      // Verified via Firebase email link
  phoneVerified: boolean;      // Verified via Firebase Phone OTP
  createdAt: string;           // ISO 8601 creation timestamp
  updatedAt: string;           // ISO 8601 last update timestamp
  lastLoginAt?: string | null; // ISO 8601 last activity timestamp
  twoFactorEnabled?: boolean;  // Admin security / 2FA flag (future-ready)
  twoFactorVerified?: boolean; // Session-level 2FA validation state
}
```

---

## 3. Role-Based Access Control (RBAC) Matrix

Roles are strictly validated server-side. Client-provided role inputs are never trusted.

| Role | Description | Initial Permissions |
| :--- | :--- | :--- |
| **`CUSTOMER`** | Standard automotive buyer (DIY, car owner). | `CATALOG_READ`, `CART_MANAGE`, `ORDER_CREATE`, `ORDER_READ_OWN` |
| **`SELLER`** | Verified parts distributor, wholesaler, or retailer. | `CATALOG_READ`, `CART_MANAGE`, `ORDER_CREATE`, `ORDER_READ_OWN`, `PRODUCT_MANAGE_OWN`, `INVENTORY_MANAGE_OWN`, `SELLER_ORDERS_MANAGE_OWN` |
| **`MANUFACTURER`** | Tier-1 brand manufacturer or authorized OEM. | `CATALOG_READ`, `PRODUCT_MANAGE_OWN`, `INVENTORY_MANAGE_OWN`, `MANUFACTURER_CATALOG_MANAGE` |
| **`ADMIN`** | Platform Super Admin with operational governance. | All permissions + `ADMIN_ACCESS`, `ADMIN_USER_MANAGE`, `ADMIN_SELLER_APPROVE`, `ADMIN_FINANCE_MANAGE` |

---

## 4. Account Status Policy

- **`ACTIVE`**: Full access to authorized portal features.
- **`PENDING`**: Account created but awaiting email/phone verification (read access allowed, ordering blocked).
- **`SUSPENDED`**: Account blocked due to policy violations (returns HTTP 403 `AUTH_ACCOUNT_SUSPENDED`).
- **`DISABLED`**: Account deactivated by user or admin (returns HTTP 403 `AUTH_ACCOUNT_DISABLED`).

*Note: Seller KYC verification status (`Verified`, `Under Review`, `Pending KYC`) is maintained separately in the Seller domain (Phase 3).*

---

## 5. API Endpoints (Phase 1)

All endpoints reside under the `/api/v1` namespace.

### 1. `GET /api/v1/auth/me`
- **Access**: Authenticated (Any role)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "uid": "user_12345",
      "email": "user@example.com",
      "role": "CUSTOMER",
      "accountStatus": "ACTIVE",
      "displayName": "Aarav Sharma",
      "emailVerified": true,
      "phoneVerified": true,
      "permissions": ["CATALOG_READ", "CART_MANAGE", "ORDER_CREATE", "ORDER_READ_OWN"]
    },
    "meta": { "timestamp": "...", "requestId": "...", "version": "v1" }
  }
  ```

### 2. `POST /api/v1/auth/verify-token`
- **Access**: Public
- **Body**: `{ "idToken": "..." }`
- **Response**: Confirms token validity, decoded UID, email, and role.

### 3. `POST /api/v1/auth/sync-profile`
- **Access**: Authenticated
- **Body**: `{ "displayName": "...", "phoneNumber": "..." }`
- **Response**: Updated profile entity.

### 4. `POST /api/v1/auth/logout`
- **Access**: Authenticated
- **Description**: Revokes Firebase Auth refresh tokens, terminating sessions across all devices.

### 5. `GET /api/v1/users/me`
- **Access**: Authenticated
- **Response**: Full database profile record.

### 6. `PATCH /api/v1/users/me`
- **Access**: Authenticated
- **Body**: `{ "displayName": "...", "phoneNumber": "...", "photoUrl": "..." }`
- **Response**: Updated profile record.

### 7. RBAC Verification Endpoints
- `GET /api/v1/auth/admin-check` — Protected by `requireRole('ADMIN')`
- `GET /api/v1/auth/seller-check` — Protected by `requireRole('SELLER', 'ADMIN')`

---

## 6. Frontend Integration Contract

The frontend remains decoupled from backend internals. To authenticate:

1. **Sign In**: Frontend signs the user in via Firebase Client Auth SDK:
   ```typescript
   import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
   const cred = await signInWithEmailAndPassword(auth, email, password);
   const idToken = await cred.user.getIdToken();
   ```
2. **API Request**: Frontend attaches the token in the `Authorization` header:
   ```typescript
   const res = await fetch('https://api.autopartshub.com/api/v1/auth/me', {
     headers: {
       'Authorization': `Bearer ${idToken}`,
       'Content-Type': 'application/json',
     },
   });
   ```
3. **Session Refresh**: When a token expires (default 1 hour in Firebase), frontend calls `user.getIdToken(true)` and retries.
4. **Sign Out**: Frontend calls Firebase client `signOut(auth)` and triggers `POST /api/v1/auth/logout`.

---

## 7. Future Phases Demarcation

- **Phase 2**: Cloud Firestore collection schemas (`/categories`, `/brands`, `/vehicles`, `/products`, `/addresses`).
- **Phase 3**: Seller registration, document upload to Firebase Storage, KYC verification workflow.
- **Phase 4**: Product catalogue & 7-tier vehicle fitment database.
- **Phase 12**: Complete Admin Panel business operations & Admin 2FA enforcement.
