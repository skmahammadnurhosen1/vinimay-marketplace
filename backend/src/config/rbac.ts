import { UserRole, Permission } from '../types/auth.js';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: ['CATALOG_READ', 'CART_MANAGE', 'ORDER_CREATE', 'ORDER_READ_OWN'],
  SELLER: [
    'CATALOG_READ',
    'CART_MANAGE',
    'ORDER_CREATE',
    'ORDER_READ_OWN',
    'PRODUCT_MANAGE_OWN',
    'INVENTORY_MANAGE_OWN',
    'SELLER_ORDERS_MANAGE_OWN',
    'SELLER_KYC_SUBMIT',
  ],
  MANUFACTURER: [
    'CATALOG_READ',
    'PRODUCT_MANAGE_OWN',
    'INVENTORY_MANAGE_OWN',
    'MANUFACTURER_CATALOG_MANAGE',
  ],
  ADMIN: [
    'CATALOG_READ',
    'CART_MANAGE',
    'ORDER_CREATE',
    'ORDER_READ_OWN',
    'PRODUCT_MANAGE_OWN',
    'INVENTORY_MANAGE_OWN',
    'SELLER_ORDERS_MANAGE_OWN',
    'MANUFACTURER_CATALOG_MANAGE',
    'ADMIN_ACCESS',
    'ADMIN_USER_MANAGE',
    'ADMIN_SELLER_APPROVE',
    'ADMIN_PRODUCT_APPROVE',
    'ADMIN_FINANCE_MANAGE',
  ],
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}
