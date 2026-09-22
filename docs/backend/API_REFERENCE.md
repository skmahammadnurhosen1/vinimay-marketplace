# AutoPartsHub / Vinimart API Reference Specification

Comprehensive Master API Reference for the Automobile Spare-Parts Multi-Vendor Marketplace Backend.

**Base URL**: `https://<render-service-name>.onrender.com/api/v1`  
**Local Development**: `http://localhost:5000/api/v1`  
**Authentication**: Bearer Token in `Authorization` header (`Bearer <firebase_id_token>`)

---

## 1. System & Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | System uptime, node environment, memory, and database status |

---

## 2. Authentication & User Profile (`/auth`, `/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/sync` | User | Synchronize Firebase Auth user with backend datastore and retrieve RBAC profile |
| `GET` | `/users/me` | User | Retrieve authenticated user profile |
| `PATCH`| `/users/me` | User | Update profile details (displayName, phone, preferences) |
| `GET` | `/users/addresses` | User | List user shipping addresses |
| `POST` | `/users/addresses` | User | Add new shipping address |
| `DELETE`| `/users/addresses/:id`| User | Remove shipping address |

---

## 3. Marketplace Public Catalog & Fitment (`/products`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | Public | Search catalog with filters (make, model, year, category, brand, price range, inStock) |
| `GET` | `/products/:id` | Public | Detailed product view with specifications, OEM numbers, and seller listings |
| `POST` | `/products/:id/check-fitment` | Public | Check fitment compatibility against vehicle spec (make, model, year, trim, fuel) |

---

## 4. Seller Operations (`/sellers`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/sellers/register` | User | Register seller business profile (GSTIN, PAN, Bank Details) |
| `GET` | `/sellers/profile` | Seller | Get seller profile and onboarding status |
| `PATCH`| `/sellers/profile` | Seller | Update business information |
| `POST` | `/sellers/kyc/documents` | Seller | Upload KYC business documents |
| `POST` | `/sellers/kyc/submit` | Seller | Submit KYC for admin review |
| `GET` | `/sellers/dashboard/metrics`| Seller | Aggregate sales, orders, and inventory metrics |
| `POST` | `/sellers/products` | Seller | Create catalog product listing |
| `PATCH`| `/sellers/products/:id`| Seller | Update product details |
| `DELETE`| `/sellers/products/:id`| Seller | Remove product listing |
| `PATCH`| `/sellers/products/:id/status`| Seller | Toggle product active/paused status |
| `GET` | `/sellers/inventory` | Seller | List seller inventory and stock health |
| `POST` | `/sellers/inventory/:productId/adjust` | Seller | Adjust stock quantity (+restock / -adjustment) |
| `GET` | `/sellers/orders` | Seller | List seller sub-orders |
| `GET` | `/sellers/orders/:subOrderId` | Seller | Get sub-order item and delivery details |
| `PATCH`| `/sellers/orders/:subOrderId/status` | Seller | Advance sub-order status (PROCESSING, COMPLETED) |
| `POST` | `/sellers/orders/:subOrderId/ship` | Seller | Generate courier label and dispatch package |
| `GET` | `/sellers/shipments` | Seller | List dispatched packages |
| `GET` | `/sellers/returns` | Seller | View return requests for seller's packages |
| `PATCH`| `/sellers/returns/:id/review` | Seller | Accept or reject return request |
| `GET` | `/sellers/warranty` | Seller | List warranty claims |
| `PATCH`| `/sellers/warranty/:id/review` | Seller | Review warranty claim |

---

## 5. Cart & Marketplace Orders (`/cart`, `/orders`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cart` | Customer | Get active customer shopping cart |
| `POST` | `/cart/items` | Customer | Add product to cart with quantity validation |
| `PATCH`| `/cart/items/:productId` | Customer | Update item quantity in cart |
| `DELETE`| `/cart/items/:productId` | Customer | Remove product from cart |
| `POST` | `/orders/checkout` | Customer | Split cart items across sellers, reserve stock, and create parent + sub-orders |
| `GET` | `/orders` | Customer | List customer order history |
| `GET` | `/orders/:id` | Customer | Get parent order and packages breakdown |

---

## 6. Payments (`/payments`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/payments/initiate` | Customer | Initiate payment with gateway (UPI, Card, NetBanking, COD) |
| `POST` | `/payments/verify` | Customer | Authoritative cryptographic signature verification |
| `POST` | `/payments/cod-check` | Customer | Check COD eligibility by PIN code and order amount |

---

## 7. Logistics & Tracking (`/shipping`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/shipping/track/:identifier` | Public | Track package status by AWB or Sub-Order ID |
| `POST` | `/shipping/shipments` | Seller/Admin| Create shipment package and generate AWB |
| `PATCH`| `/shipping/shipments/:shipmentId/checkpoint` | Admin/Courier| Append tracking checkpoint |
| `POST` | `/shipping/webhook` | Webhook | Logistics partner webhook (idempotent status updates) |

---

## 8. Returns, Refunds & Warranty (`/returns`, `/refunds`, `/warranty`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/returns` | Customer | Initiate return request within return window |
| `GET` | `/returns/my` | Customer | List customer return requests |
| `GET` | `/returns/:id` | User | Get return request status and timeline |
| `GET` | `/refunds/:id` | User | Check refund status |
| `POST` | `/warranty` | Customer | File warranty claim with proof of defect |
| `GET` | `/warranty/my` | Customer | List customer warranty claims |
| `GET` | `/warranty/:id` | User | Get warranty claim status |

---

## 9. Admin Console (`/admin`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/sellers` | Admin | List all registered sellers with KYC filter |
| `POST` | `/admin/sellers/:sellerId/kyc` | Admin | Approve or reject seller KYC |
| `PATCH`| `/admin/sellers/:sellerId/status` | Admin | Suspend or reactivate seller account |
| `POST` | `/admin/sellers/:sellerId/commission` | Admin | Configure custom seller commission override |
| `GET` | `/admin/products` | Admin | List catalog products for moderation |
| `POST` | `/admin/products/:id/review` | Admin | Approve or reject product listing |
| `POST` | `/admin/products/:id/authenticity` | Admin | Verify product authenticity rating |
| `GET` | `/admin/orders` | Admin | Global view of all marketplace orders |
| `GET` | `/admin/returns` | Admin | Global view of customer return requests |
| `GET` | `/admin/refunds` | Admin | Global view of payment refunds |
| `GET` | `/admin/warranty` | Admin | Global view of warranty claims |
| `GET` | `/admin/customers` | Admin | List customer accounts |
| `PATCH`| `/admin/customers/:id/status` | Admin | Freeze or unfreeze customer account |
| `GET` | `/admin/reports` | Admin | System reports and BI telemetry |

---

## 10. Finance & Settlements (`/finance`, `/admin/finance`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/finance/settlements` | Seller/Admin| List payouts (filtered by sellerId) |
| `GET` | `/finance/invoices/:orderId` | User/Admin| Download Indian GST tax invoice breakdown |
| `GET` | `/admin/finance/summary` | Admin | Platform gross revenue, commission, and payout totals |
| `GET` | `/admin/finance/commissions` | Admin | Get commission rule configuration |
| `PUT` | `/admin/finance/commissions` | Admin | Update default or category commission rates |
| `POST` | `/admin/finance/settlements/generate`| Admin | Scan delivered sub-orders and compute hold settlements |
| `POST` | `/admin/finance/settlements/process` | Admin | Execute net bank payout for eligible settlements |

---

## 11. Customer Reviews (`/reviews`, `/admin/reviews`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/reviews` | Customer | Submit product review (Verified Purchase verified) |
| `GET` | `/reviews/product/:productId` | Public | View approved reviews for a product |
| `GET` | `/admin/reviews` | Admin | Moderation queue for pending reviews |
| `PATCH`| `/admin/reviews/:id/moderate` | Admin | Approve, reject, or flag a review |

---

## 12. B2B Garage & Fleet Platform (`/b2b`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/b2b/register` | Customer | Register garage/fleet account with trade licenses |
| `GET` | `/b2b/account/me` | Customer | Get B2B account profile and credit limit |
| `GET` | `/b2b/pricing/:productId` | Customer | Calculate volume tiered discount price |
| `POST` | `/b2b/orders/bulk` | Customer | Place bulk order with volume discount applied |
| `POST` | `/b2b/orders/repeat/:orderId` | Customer | 1-click repeat reorder of past bulk purchase |
| `GET` | `/b2b/admin/accounts` | Admin | List pending B2B business accounts |
| `POST` | `/b2b/admin/accounts/:id/verify`| Admin | Verify B2B garage/fleet credentials |

---

## 13. Manufacturer Portal (`/manufacturer`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/manufacturer/catalog` | Manufacturer| Brand-scoped product list for authorized manufacturer |
| `GET` | `/manufacturer/analytics` | Manufacturer| Sales volume, dealer distribution, and warranty defect telemetry |

---

## 14. Omnichannel Notifications (`/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/notifications` | User | List user's notifications (paginated) |
| `GET` | `/notifications/unread-count` | User | Get total unread notifications count |
| `PATCH`| `/notifications/:id/read` | User | Mark single notification as read |
| `POST` | `/notifications/mark-all-read` | User | Mark all notifications as read |
| `GET` | `/notifications/preferences` | User | View notification channel opt-ins |
| `PUT` | `/notifications/preferences` | User | Update notification channel opt-ins |
| `POST` | `/notifications/send` | Admin | Manually broadcast/dispatch notification event |

---

## 15. Customer Support Ticketing (`/support`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/support/tickets` | User | Create a new support ticket |
| `GET` | `/support/tickets` | User/Admin | List user's tickets (or all for Admin) |
| `GET` | `/support/tickets/:ticketId` | User/Admin | Get ticket details and conversation thread |
| `POST` | `/support/tickets/:ticketId/messages` | User/Admin | Reply to ticket thread with optional attachments |
| `PATCH`| `/support/tickets/:ticketId/status` | User/Admin | Update ticket status (`OPEN`, `RESOLVED`, `CLOSED`) |
| `PATCH`| `/support/tickets/:ticketId/assign` | Admin | Assign ticket to support admin agent |
