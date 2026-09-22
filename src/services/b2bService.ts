import {
  B2BAccountType,
  B2BGarageProfile,
  B2BFleetProfile,
  B2BCartItem,
  B2BConsignment,
  B2BOrder,
  B2BGSTInvoice,
  B2BRFQRequest,
  B2BBulkOrderItem,
  B2BBulkTier,
} from '../types/b2b';
import { Product } from '../types';
import { ALL_PRODUCTS } from '../data/products';
import {
  mockGarageProfile,
  mockFleetProfile,
  mockB2BOrders,
  mockB2BInvoices,
  mockB2BRFQs,
} from '../data/mockB2BData';

class B2BService {
  private activeAccountType: B2BAccountType = 'garage';
  private garageProfile: B2BGarageProfile = { ...mockGarageProfile };
  private fleetProfile: B2BFleetProfile = { ...mockFleetProfile };
  private orders: B2BOrder[] = [...mockB2BOrders];
  private invoices: B2BGSTInvoice[] = [...mockB2BInvoices];
  private rfqs: B2BRFQRequest[] = [...mockB2BRFQs];
  private cartItems: B2BCartItem[] = [];

  private listeners: (() => void)[] = [];

  constructor() {
    // Seed sample B2B cart items to give immediate interactive realism
    if (ALL_PRODUCTS.length >= 2) {
      this.addItemToCart(ALL_PRODUCTS[0], 6);
      this.addItemToCart(ALL_PRODUCTS[1], 2);
    }
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  // --- Trade Pricing Calculations ---
  public getBusinessPrice(product: Product): number {
    // Automotive B2B trade discount: 26% - 32% off retail price
    const discountFactor = product.partType === 'Genuine' ? 0.72 : product.partType === 'OEM' ? 0.70 : 0.65;
    return Math.round(product.price * discountFactor);
  }

  public getBulkTiers(product: Product): B2BBulkTier[] {
    const baseB2B = this.getBusinessPrice(product);
    return [
      { minQty: 1, unitPrice: baseB2B, discountPct: 0, label: 'Standard Trade (1-9)' },
      { minQty: 10, unitPrice: Math.round(baseB2B * 0.92), discountPct: 8, label: 'Case Pack (10-24)' },
      { minQty: 25, unitPrice: Math.round(baseB2B * 0.88), discountPct: 12, label: 'Workshop Lot (25-49)' },
      { minQty: 50, unitPrice: Math.round(baseB2B * 0.84), discountPct: 16, label: 'Master Bulk (50+)' },
    ];
  }

  public getUnitPriceForQty(product: Product, quantity: number): number {
    const tiers = this.getBulkTiers(product);
    if (quantity >= 50) return tiers[3].unitPrice;
    if (quantity >= 25) return tiers[2].unitPrice;
    if (quantity >= 10) return tiers[1].unitPrice;
    return tiers[0].unitPrice;
  }

  // --- Account State & Switching ---
  public getActiveAccountType(): B2BAccountType {
    return this.activeAccountType;
  }

  public setActiveAccountType(type: B2BAccountType) {
    this.activeAccountType = type;
    this.notify();
  }

  public getActiveProfile(): B2BGarageProfile | B2BFleetProfile {
    return this.activeAccountType === 'garage' ? this.garageProfile : this.fleetProfile;
  }

  public getGarageProfile(): B2BGarageProfile {
    return { ...this.garageProfile };
  }

  public getFleetProfile(): B2BFleetProfile {
    return { ...this.fleetProfile };
  }

  public updateGarageProfile(updated: Partial<B2BGarageProfile>) {
    this.garageProfile = { ...this.garageProfile, ...updated };
    this.notify();
  }

  public updateFleetProfile(updated: Partial<B2BFleetProfile>) {
    this.fleetProfile = { ...this.fleetProfile, ...updated };
    this.notify();
  }

  // --- Cart Operations ---
  public getCartItems(): B2BCartItem[] {
    return [...this.cartItems];
  }

  public addItemToCart(product: Product, quantity: number = 1) {
    const existingIndex = this.cartItems.findIndex((ci) => ci.product.id === product.id);
    const unitPrice = this.getUnitPriceForQty(product, quantity);

    if (existingIndex > -1) {
      const newQty = this.cartItems[existingIndex].quantity + quantity;
      const recomputedUnitPrice = this.getUnitPriceForQty(product, newQty);
      this.cartItems[existingIndex] = {
        ...this.cartItems[existingIndex],
        quantity: newQty,
        unitBusinessPrice: recomputedUnitPrice,
        lineTotal: recomputedUnitPrice * newQty,
      };
    } else {
      this.cartItems.push({
        product,
        quantity,
        unitRegularPrice: product.price,
        unitBusinessPrice: unitPrice,
        lineTotal: unitPrice * quantity,
        sellerId: product.seller.id,
        sellerName: product.seller.name,
        sellerTier: product.seller.tier,
      });
    }
    this.notify();
  }

  public updateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems = this.cartItems.map((ci) => {
      if (ci.product.id === productId) {
        const unitPrice = this.getUnitPriceForQty(ci.product, quantity);
        return {
          ...ci,
          quantity,
          unitBusinessPrice: unitPrice,
          lineTotal: unitPrice * quantity,
        };
      }
      return ci;
    });
    this.notify();
  }

  public removeFromCart(productId: string) {
    this.cartItems = this.cartItems.filter((ci) => ci.product.id !== productId);
    this.notify();
  }

  public clearCart() {
    this.cartItems = [];
    this.notify();
  }

  // --- Consignments Grouping (Multi-Seller Decomposition) ---
  public getConsignments(): B2BConsignment[] {
    const sellerMap = new Map<string, B2BConsignment>();

    this.cartItems.forEach((ci) => {
      const sellerId = ci.sellerId || 'seller-default';
      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          sellerName: ci.sellerName,
          sellerTier: ci.sellerTier,
          items: [],
          consignmentSubtotal: 0,
          consignmentGST: 0,
          estimatedDispatch: 'Tomorrow, within 24 hours',
          courierPartner: 'Blue Dart / Delhivery Express Heavy Freight',
        });
      }
      const consignment = sellerMap.get(sellerId)!;
      consignment.items.push(ci);
      consignment.consignmentSubtotal += ci.lineTotal;
      consignment.consignmentGST += Math.round(ci.lineTotal * 0.18);
    });

    return Array.from(sellerMap.values());
  }

  public getCartTotals() {
    const consignments = this.getConsignments();
    const totalUnits = this.cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
    const subtotal = this.cartItems.reduce((sum, ci) => sum + ci.lineTotal, 0);
    const retailTotal = this.cartItems.reduce(
      (sum, ci) => sum + ci.unitRegularPrice * ci.quantity,
      0
    );
    const bulkSavings = Math.max(0, retailTotal - subtotal);
    const gstTotal = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gstTotal;

    return {
      totalItems: this.cartItems.length,
      totalUnits,
      subtotal,
      retailTotal,
      bulkSavings,
      gstTotal,
      grandTotal,
      consignmentsCount: consignments.length,
    };
  }

  // --- Reorder Workflow ---
  public reorderItems(order: B2BOrder) {
    order.consignments.forEach((c) => {
      c.items.forEach((item) => {
        this.addItemToCart(item.product, item.quantity);
      });
    });
    this.notify();
  }

  // --- Orders & Invoices ---
  public getOrders(): B2BOrder[] {
    return [...this.orders];
  }

  public getInvoices(): B2BGSTInvoice[] {
    return [...this.invoices];
  }

  public getOrderById(orderId: string): B2BOrder | undefined {
    return this.orders.find((o) => o.orderId === orderId);
  }

  public getInvoiceByNumber(invNum: string): B2BGSTInvoice | undefined {
    return this.invoices.find((i) => i.invoiceNumber === invNum);
  }

  public placeB2BOrder(
    paymentMethod: string,
    shippingAddress: string
  ): { order: B2BOrder; invoice: B2BGSTInvoice } {
    const totals = this.getCartTotals();
    const consignments = this.getConsignments();
    const profile = this.getActiveProfile();
    const orderId = `B2B-PO-${Date.now().toString().slice(-6)}`;
    const invoiceNumber = `INV-APH-B2B-${Date.now().toString().slice(-6)}`;
    const orderDate = new Date().toISOString().slice(0, 10);
    const invoiceDate = orderDate;

    const isInterState = profile.state !== 'Maharashtra';

    // Build Invoice Line Items
    let sno = 1;
    const invoiceLineItems = this.cartItems.map((ci) => {
      const taxable = ci.lineTotal;
      const cgst = isInterState ? 0 : Math.round(taxable * 0.09);
      const sgst = isInterState ? 0 : Math.round(taxable * 0.09);
      const igst = isInterState ? Math.round(taxable * 0.18) : 0;
      return {
        sno: sno++,
        description: `${ci.product.title} (${ci.product.brand})`,
        hsnCode: '87082900',
        partNumber: ci.product.partNumber,
        qty: ci.quantity,
        unitRate: ci.unitBusinessPrice,
        taxableAmount: taxable,
        cgstRate: isInterState ? 0 : 9,
        cgstAmount: cgst,
        sgstRate: isInterState ? 0 : 9,
        sgstAmount: sgst,
        igstRate: isInterState ? 18 : 0,
        igstAmount: igst,
        totalAmount: taxable + (isInterState ? igst : cgst + sgst),
      };
    });

    const newInvoice: B2BGSTInvoice = {
      invoiceNumber,
      invoiceDate,
      orderId,
      sellerName: 'AutoPartsHub Marketplace (Multi-Vendor Consignment Node)',
      sellerGSTIN: '27AAICA9912K1ZT',
      sellerAddress: 'Central Auto Hub, MIDC Phase II, Bhosari, Pune, MH - 411026',
      sellerState: 'Maharashtra (27)',
      buyerName:
        profile.accountType === 'garage'
          ? (profile as B2BGarageProfile).businessName
          : (profile as B2BFleetProfile).companyName,
      buyerGSTIN: profile.gstin,
      buyerAddress:
        shippingAddress ||
        (profile.accountType === 'garage'
          ? (profile as B2BGarageProfile).address
          : (profile as B2BFleetProfile).depotAddress),
      buyerState: `${profile.state}`,
      placeOfSupply: `${profile.state}`,
      isInterState,
      lineItems: invoiceLineItems,
      taxableTotal: totals.subtotal,
      cgstTotal: isInterState ? 0 : Math.round(totals.gstTotal / 2),
      sgstTotal: isInterState ? 0 : Math.round(totals.gstTotal / 2),
      igstTotal: isInterState ? totals.gstTotal : 0,
      grandTotal: totals.grandTotal,
      amountInWords: `INR ${totals.grandTotal.toLocaleString('en-IN')} Only`,
    };

    const newOrder: B2BOrder = {
      orderId,
      orderDate,
      accountType: this.activeAccountType,
      businessName:
        profile.accountType === 'garage'
          ? (profile as B2BGarageProfile).businessName
          : (profile as B2BFleetProfile).companyName,
      gstin: profile.gstin,
      consignments,
      totalUnits: totals.totalUnits,
      subtotal: totals.subtotal,
      bulkSavings: totals.bulkSavings,
      gstTotal: totals.gstTotal,
      grandTotal: totals.grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod.includes('Credit') ? 'Credit Facility' : 'Paid',
      orderStatus: 'Processing',
      shippingAddress,
      invoiceNumber,
    };

    this.orders.unshift(newOrder);
    this.invoices.unshift(newInvoice);

    // If Business Credit used, update available credit limit
    if (paymentMethod.includes('Credit')) {
      if (this.activeAccountType === 'garage') {
        this.garageProfile.creditAvailable = Math.max(
          0,
          this.garageProfile.creditAvailable - totals.grandTotal
        );
      } else {
        this.fleetProfile.creditAvailable = Math.max(
          0,
          this.fleetProfile.creditAvailable - totals.grandTotal
        );
      }
    }

    this.clearCart();
    this.notify();

    return { order: newOrder, invoice: newInvoice };
  }

  // --- RFQs ---
  public getRFQs(): B2BRFQRequest[] {
    return [...this.rfqs];
  }

  public submitRFQ(rfqData: Omit<B2BRFQRequest, 'id' | 'date' | 'status'>): B2BRFQRequest {
    const newRFQ: B2BRFQRequest = {
      ...rfqData,
      id: `RFQ-2026-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Under Review',
      estimatedQuoteAmount: rfqData.estimatedMonthlyVolume * 1850,
    };
    this.rfqs.unshift(newRFQ);
    this.notify();
    return newRFQ;
  }
}

export const b2bService = new B2BService();
