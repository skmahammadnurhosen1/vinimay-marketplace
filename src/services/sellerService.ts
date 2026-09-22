import {
  SellerProfile,
  SellerKPIMetrics,
  SellerOrder,
  SellerProduct,
  SellerInventoryItem,
  SellerReturnItem,
  SellerWarrantyClaim,
  SellerSettlement,
  SellerNotification,
  SellerShipmentState,
  SellerReturnWorkflowStatus,
  SellerWarrantyClaimStatus,
  SellerWarrantyOutcome
} from '../types/seller';
import {
  MOCK_SELLER_PROFILE,
  MOCK_SELLER_KPIS,
  MOCK_SELLER_ORDERS,
  MOCK_SELLER_PRODUCTS,
  MOCK_SELLER_INVENTORY,
  MOCK_SELLER_RETURNS,
  MOCK_SELLER_WARRANTIES,
  MOCK_SELLER_SETTLEMENTS,
  MOCK_SELLER_NOTIFICATIONS,
  MOCK_SALES_CHART
} from '../data/mockSellerData';

class SellerService {
  private profile: SellerProfile = { ...MOCK_SELLER_PROFILE };
  private kpis: SellerKPIMetrics = { ...MOCK_SELLER_KPIS };
  private orders: SellerOrder[] = [...MOCK_SELLER_ORDERS];
  private products: SellerProduct[] = [...MOCK_SELLER_PRODUCTS];
  private inventory: SellerInventoryItem[] = [...MOCK_SELLER_INVENTORY];
  private returns: SellerReturnItem[] = [...MOCK_SELLER_RETURNS];
  private warranties: SellerWarrantyClaim[] = [...MOCK_SELLER_WARRANTIES];
  private settlements: SellerSettlement[] = [...MOCK_SELLER_SETTLEMENTS];
  private notifications: SellerNotification[] = [...MOCK_SELLER_NOTIFICATIONS];

  // PROFILE
  getProfile(): SellerProfile {
    return { ...this.profile };
  }

  updateProfile(updates: Partial<SellerProfile>): SellerProfile {
    this.profile = { ...this.profile, ...updates };
    return { ...this.profile };
  }

  // KPIS
  getKPIMetrics(): SellerKPIMetrics {
    return {
      ...this.kpis,
      totalOrders: this.orders.length,
      pendingOrders: this.orders.filter(o => o.shipmentState === 'ordered' || o.shipmentState === 'packed').length,
      completedOrders: this.orders.filter(o => o.shipmentState === 'delivered').length,
      returnRequests: this.returns.length,
      warrantyClaims: this.warranties.length,
      totalProducts: this.products.length,
      lowStockCount: this.inventory.filter(i => i.isLowStock).length
    };
  }

  getSalesChart() {
    return [...MOCK_SALES_CHART];
  }

  // ORDERS
  getOrders(): SellerOrder[] {
    return [...this.orders];
  }

  getOrderById(id: string): SellerOrder | undefined {
    return this.orders.find(o => o.id === id || o.marketplaceOrderId === id);
  }

  updateOrderShipment(
    orderId: string,
    newStatus: SellerShipmentState,
    courier?: string,
    trackingNum?: string
  ): SellerOrder | null {
    const idx = this.orders.findIndex(o => o.id === orderId || o.marketplaceOrderId === orderId);
    if (idx === -1) return null;

    const order = this.orders[idx];
    const updated: SellerOrder = {
      ...order,
      shipmentState: newStatus,
      courierName: courier || order.courierName,
      trackingNumber: trackingNum || order.trackingNumber,
      dispatchDate: newStatus === 'shipped' ? new Date().toLocaleDateString('en-GB') : order.dispatchDate,
      checkpoints: [
        ...order.checkpoints,
        {
          stage: newStatus,
          title: `Status updated to ${newStatus.toUpperCase()}`,
          description: `Consignment marked as ${newStatus} by merchant warehouse.`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          location: 'Merchant Warehouse Mumbai'
        }
      ]
    };

    this.orders[idx] = updated;
    return updated;
  }

  // PRODUCTS
  getProducts(): SellerProduct[] {
    return [...this.products];
  }

  getProductById(id: string): SellerProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(newProd: Omit<SellerProduct, 'id' | 'createdAt'>): SellerProduct {
    const id = `prod-custom-${Date.now()}`;
    const product: SellerProduct = {
      ...newProd,
      id,
      createdAt: new Date().toLocaleDateString('en-GB')
    };
    this.products.unshift(product);

    // Also add to inventory
    const invItem: SellerInventoryItem = {
      productId: id,
      title: product.title,
      partNumber: product.partNumber,
      brand: product.brand,
      category: product.category,
      image: product.images[0] || '/assets/cat_engine.jpg',
      currentStock: product.stockCount,
      reservedStock: 0,
      availableStock: product.stockCount,
      lowStockThreshold: product.lowStockThreshold,
      isLowStock: product.stockCount <= product.lowStockThreshold,
      unitPrice: product.price,
      totalValue: product.stockCount * product.price,
      lastRestocked: new Date().toLocaleDateString('en-GB')
    };
    this.inventory.unshift(invItem);

    return product;
  }

  updateProduct(id: string, updates: Partial<SellerProduct>): SellerProduct | null {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    return this.products[idx];
  }

  toggleProductStatus(id: string): SellerProduct | null {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const current = this.products[idx].status;
    this.products[idx].status = current === 'active' ? 'draft' : 'active';
    return this.products[idx];
  }

  // INVENTORY
  getInventory(): SellerInventoryItem[] {
    return [...this.inventory];
  }

  adjustStock(productId: string, delta: number): SellerInventoryItem | null {
    const idx = this.inventory.findIndex(i => i.productId === productId);
    if (idx === -1) return null;

    const item = this.inventory[idx];
    const newStock = Math.max(0, item.currentStock + delta);
    const available = Math.max(0, newStock - item.reservedStock);
    const isLow = newStock <= item.lowStockThreshold;

    this.inventory[idx] = {
      ...item,
      currentStock: newStock,
      availableStock: available,
      isLowStock: isLow,
      totalValue: newStock * item.unitPrice,
      lastRestocked: delta > 0 ? new Date().toLocaleDateString('en-GB') : item.lastRestocked
    };

    // Sync back to product
    const pIdx = this.products.findIndex(p => p.id === productId);
    if (pIdx !== -1) {
      this.products[pIdx].stockCount = newStock;
    }

    return this.inventory[idx];
  }

  // RETURNS
  getReturns(): SellerReturnItem[] {
    return [...this.returns];
  }

  updateReturnStatus(returnId: string, newStatus: SellerReturnWorkflowStatus, notes?: string): SellerReturnItem | null {
    const idx = this.returns.findIndex(r => r.id === returnId);
    if (idx === -1) return null;
    this.returns[idx] = {
      ...this.returns[idx],
      status: newStatus,
      additionalInfoRequiredNotes: notes || this.returns[idx].additionalInfoRequiredNotes
    };
    return this.returns[idx];
  }

  // WARRANTIES
  getWarranties(): SellerWarrantyClaim[] {
    return [...this.warranties];
  }

  updateWarrantyStatus(
    claimId: string,
    status: SellerWarrantyClaimStatus,
    outcome?: SellerWarrantyOutcome,
    notes?: string
  ): SellerWarrantyClaim | null {
    const idx = this.warranties.findIndex(w => w.id === claimId);
    if (idx === -1) return null;
    this.warranties[idx] = {
      ...this.warranties[idx],
      status,
      outcome: outcome || this.warranties[idx].outcome,
      outcomeNotes: notes || this.warranties[idx].outcomeNotes
    };
    return this.warranties[idx];
  }

  // SETTLEMENTS
  getSettlements(): SellerSettlement[] {
    return [...this.settlements];
  }

  // NOTIFICATIONS
  getNotifications(): SellerNotification[] {
    return [...this.notifications];
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => (n.read = true));
  }
}

export const sellerService = new SellerService();
