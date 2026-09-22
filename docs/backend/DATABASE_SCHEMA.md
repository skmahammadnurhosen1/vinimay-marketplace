# AutoPartsHub Phase 2 — Firebase Database Foundation Specification

This document details the Cloud Firestore database architecture, entity relationships, vehicle compatibility model, security rules, indexes, and API contracts for **Phase 2**.

---

## 1. Core Data Architecture & Entity Mapping

The database is built on Cloud Firestore with normalized collections and dedicated subcollections designed for scale from 1,000 to 100,000+ sellers and products.

```
/users/{uid}                                (User Account & Auth Link)
   └── /addresses/{addressId}               (Customer Delivery / Seller Business Addresses)
/customers/{uid}                            (Customer Profile & Garage Context)
/sellers/{sellerId}                         (Seller Business Profile & Tier)
/manufacturers/{mfgId}                      (OEM Brand Profiles)
/business_profiles/{b2bId}                  (Garage / Fleet Business Entities)
/categories/{categoryId}                    (Marketplace Part Categories)
/brands/{brandId}                           (Automotive & Aftermarket Brands)
/vehicle_manufacturers/{manufacturerId}     (Vehicle OEMs: PV & CV)
/vehicle_models/{modelId}                   (Vehicle Models with Supported Options)
```

---

## 2. The 17 Foundational Data Entities

| # | Entity | Collection / Subcollection | Key Fields | Purpose |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Users** | `/users/{uid}` | `uid`, `email`, `role`, `accountStatus`, `createdAt` | Root authentication entity linked to Firebase Auth |
| 2 | **Customer Profiles** | `/customers/{uid}` | `uid`, `fullName`, `savedVehicles`, `defaultAddressId` | Passenger & commercial vehicle garage context |
| 3 | **Seller Profiles** | `/sellers/{sellerId}` | `sellerId`, `businessName`, `sellerType`, `kycStatus` | Merchant identity & verification foundation |
| 4 | **Manufacturer Profiles** | `/manufacturers/{mfgId}` | `mfgId`, `brandName`, `gstin`, `tier` | Tier-1 OEM factory profile |
| 5 | **Business Profiles** | `/business_profiles/{b2bId}`| `b2bId`, `businessName`, `gstin`, `pan`, `accountType` | B2B Workshop & Fleet operations |
| 6 | **Addresses** | `/users/{uid}/addresses/{id}`| `fullName`, `phone`, `addressLine1`, `pinCode`, `state` | Unified address entity for delivery and dispatch |
| 7 | **Roles & Permissions** | Hardened server config & `/roles` | `role`, `permissions` | Granular capability enforcement |
| 8 | **Categories** | `/categories/{categoryId}` | `name`, `slug`, `subcategories`, `displayOrder` | Spare part taxonomy (Brake, Clutch, Suspension, etc.) |
| 9 | **Brands** | `/brands/{brandId}` | `name`, `category`, `origin`, `tagline` | Vehicle & spare part manufacturing brands |
| 10 | **Vehicles** | `/vehicles/{vehicleId}` | `type`, `manufacturerId`, `modelId`, `year` | Composite vehicle entity |
| 11 | **Vehicle Manufacturers** | `/vehicle_manufacturers/{id}` | `name`, `category` (PV/CV), `popularModels` | Top-level OEM vehicle makers |
| 12 | **Vehicle Models** | `/vehicle_models/{modelId}` | `manufacturerId`, `name`, `years`, `fuelTypes` | Commercial & passenger vehicle model lines |
| 13 | **Vehicle Years** | Embedded in `/vehicle_models` | `years: [2018, 2019, 2020, ...]` | Manufacturing model years |
| 14 | **Fuel Types** | Embedded in `/vehicle_models` | `fuelTypes: ['Diesel', 'Petrol', 'CNG']` | Engine combustion fuel types |
| 15 | **Engines** | Embedded in `/vehicle_models` | `engines: ['700cc', '1.2L DualJet', ...]` | Engine displacement and codes |
| 16 | **Variants** | Embedded in `/vehicle_models` | `variants: ['Standard', 'VXi', 'SX(O)']` | Trim levels and body configurations |
| 17 | **Vehicle Compatibility** | Indexed composite token array | `compatibilityKey` token | Normalized reusable vehicle fitment mapping |

---

## 3. 7-Tier Vehicle Data Model & Fitment Flow

The vehicle hierarchy enforces the marketplace's 7-tier selection funnel:

$$\text{Vehicle Type} \rightarrow \text{Manufacturer} \rightarrow \text{Model} \rightarrow \text{Year} \rightarrow \text{Fuel Type} \rightarrow \text{Engine} \rightarrow \text{Variant}$$

### Supported Vehicle Segments
1. **Passenger Vehicles (PV)**: Maruti Suzuki, Mahindra, Hyundai, Toyota, Kia, etc.
2. **Commercial Vehicles (CV)**: Tata Commercial, Ashok Leyland, Eicher Motors, BharatBenz, etc.
*(Two-wheelers are excluded as they are outside marketplace scope).*

### Structured Compatibility Relationship
Rather than fragile, unindexed free-text descriptions, compatibility is stored as a normalized, indexed token:

$$\text{Token} = \text{type} : \text{manufacturerId} : \text{modelId} : \text{year} : \text{fuelType} : \text{engine} : \text{variant}$$

*Example*:
`commercial:tata-cv:tata-ace:2022:diesel:700cc:standard`

Products in future phases will store an array of these tokens in `compatibilityList`, enabling instant, high-throughput `array-contains` index queries in Firestore.

---

## 4. Firebase Security Rules (`firestore.rules`)

1. **Anti-Privilege Escalation**:
   - Clients cannot modify their own `role`, `accountStatus`, `kycStatus`, or `permissions`.
   - Users cannot grant themselves `ADMIN`, `SELLER`, or `MANUFACTURER` status.
2. **User Data Isolation**:
   - `/users/{uid}` and `/users/{uid}/addresses/{addressId}` are accessible only by the owning authenticated user and Super Admin.
3. **Public Catalog Read Access**:
   - `/categories`, `/brands`, `/vehicle_manufacturers`, and `/vehicle_models` are publicly readable without requiring authentication.
   - Mutations on reference data require `isAdmin()`.

---

## 5. Firestore Indexes (`firestore.indexes.json`)

1. **`vehicle_models`**: Compound query on `manufacturerId` (ASC) + `name` (ASC).
2. **`vehicle_manufacturers`**: Compound query on `category` (ASC) + `name` (ASC).
3. **`brands`**: Compound query on `category` (ASC) + `name` (ASC).
4. **`categories`**: Compound query on `isActive` (ASC) + `displayOrder` (ASC).
5. **`addresses`**: Collection group query on `userId` (ASC) + `isDefault` (DESC).
6. **`products`** (Prepared for Phase 4): `compatibilityList` (array-contains) + `status` (ASC) + `price` (ASC).

---

## 6. API Endpoints (Phase 2)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | Public | Lists all active categories (Brake, Clutch, Suspension, etc.) |
| `GET` | `/api/v1/categories/:slug` | Public | Returns details and subcategories for a category |
| `GET` | `/api/v1/brands` | Public | Lists automotive brands (optional `?category=passenger\|commercial`) |
| `GET` | `/api/v1/brands/:id` | Public | Retrieves brand profile |
| `GET` | `/api/v1/vehicles/manufacturers` | Public | Lists vehicle OEMs (optional `?category=passenger\|commercial`) |
| `GET` | `/api/v1/vehicles/models` | Public | Lists vehicle models for an OEM (`?manufacturerId=...`) |
| `GET` | `/api/v1/vehicles/variants` | Public | Returns valid years, fuels, engines, and trims for a model |
| `POST` | `/api/v1/vehicles/validate-fitment` | Public | Validates a complete 7-tier specification against the database |
| `GET` | `/api/v1/addresses` | Authenticated | Retrieves saved delivery/business addresses for current user |
| `POST` | `/api/v1/addresses` | Authenticated | Validates and saves a new Indian delivery address |
| `DELETE`| `/api/v1/addresses/:id` | Authenticated | Deletes address owned by current user (cross-user protected) |
