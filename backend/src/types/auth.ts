export type UserRole = 'CUSTOMER' | 'SELLER' | 'MANUFACTURER' | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISABLED';

export type Permission =
  | 'CATALOG_READ'
  | 'CART_MANAGE'
  | 'ORDER_CREATE'
  | 'ORDER_READ_OWN'
  | 'PRODUCT_MANAGE_OWN'
  | 'INVENTORY_MANAGE_OWN'
  | 'SELLER_ORDERS_MANAGE_OWN'
  | 'SELLER_KYC_SUBMIT'
  | 'MANUFACTURER_CATALOG_MANAGE'
  | 'ADMIN_ACCESS'
  | 'ADMIN_USER_MANAGE'
  | 'ADMIN_SELLER_APPROVE'
  | 'ADMIN_PRODUCT_APPROVE'
  | 'ADMIN_FINANCE_MANAGE';

export interface UserProfile {
  uid: string;
  email: string;
  phoneNumber?: string | null;
  displayName: string;
  photoUrl?: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  // Security & 2FA Architecture Foundation
  twoFactorEnabled?: boolean;
  twoFactorVerified?: boolean;
  customClaims?: Record<string, unknown>;
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  displayName: string;
  permissions: Permission[];
  twoFactorEnabled?: boolean;
  twoFactorVerified?: boolean;
  tokenClaims: Record<string, unknown>;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
