export type InventoryItemStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItemEntity {
  id: string; // matches productId
  productId: string;
  sellerId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number; // currentStock - reservedStock
  lowStockThreshold: number;
  sku: string;
  status: InventoryItemStatus;
  lastRestockedAt: string;
  updatedAt: string;
}

export type InventoryMovementType =
  | 'RESTOCK'
  | 'ADJUSTMENT_ADD'
  | 'ADJUSTMENT_SUBTRACT'
  | 'RESERVATION'
  | 'RELEASE'
  | 'SALE'
  | 'RETURN_RESTOCK';

export interface InventoryMovementEntity {
  id: string;
  productId: string;
  sellerId: string;
  type: InventoryMovementType;
  quantityChanged: number;
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  referenceId?: string | null;
  performedBy: string;
  createdAt: string;
}
