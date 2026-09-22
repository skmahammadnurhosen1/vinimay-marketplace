import { randomUUID } from 'node:crypto';
import { financeRepository } from './finance.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import { refundRepository } from '../refunds/refund.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import {
  SellerSettlementEntity,
  GstInvoiceEntity,
  GstInvoiceItem,
  FinancialSummaryReport,
} from '../../types/finance.js';

export class FinanceService {
  async getEffectiveCommissionRate(sellerId: string, category?: string): Promise<number> {
    const config = await financeRepository.getCommissionConfig();

    if (config.sellerAgreedRates && config.sellerAgreedRates[sellerId] !== undefined) {
      return config.sellerAgreedRates[sellerId];
    }

    if (category && config.categoryRates && config.categoryRates[category] !== undefined) {
      return config.categoryRates[category];
    }

    return config.defaultRate || 10;
  }

  async calculateAndRecordSettlement(subOrderId: string, holdDays = 10): Promise<SellerSettlementEntity> {
    const existing = await financeRepository.findSettlementBySubOrderId(subOrderId);
    if (existing && existing.status === 'SETTLED') {
      return existing;
    }

    const subOrder = await orderRepository.findSubOrderById(subOrderId);
    if (!subOrder) {
      throw new Error(`Sub-order ${subOrderId} not found`);
    }

    const parentOrder = await orderRepository.findParentOrderById(subOrder.parentOrderId);
    const orderNumber = parentOrder ? parentOrder.orderNumber : subOrder.orderNumber;

    // Get dominant category for commission calculation
    const category = subOrder.items[0]?.partType || 'Braking System';
    const commissionRate = await this.getEffectiveCommissionRate(subOrder.sellerId, category);

    const grossAmount = subOrder.totalAmount;
    const commissionAmount = Math.round(grossAmount * (commissionRate / 100));

    // Check for refunds associated with this sub-order
    const allRefunds = await refundRepository.findAll();
    const packageRefunds = allRefunds.filter(
      (r: any) => r.subOrderId === subOrderId && (r.status === 'PROCESSED' || r.status === 'COMPLETED')
    );
    const refundDeductions = packageRefunds.reduce((sum: number, r: any) => sum + r.amount, 0);

    const netPayout = Math.max(0, grossAmount - commissionAmount - refundDeductions);

    const deliveredAt = subOrder.updatedAt || subOrder.createdAt;
    const deliveredTime = new Date(deliveredAt).getTime();
    const holdUntilTime = deliveredTime + holdDays * 24 * 60 * 60 * 1000;
    const holdUntil = new Date(holdUntilTime).toISOString();
    const now = new Date();

    const isEligible = holdDays <= 0 || now.getTime() >= holdUntilTime;
    const status = isEligible ? 'ELIGIBLE' : 'ON_HOLD';

    if (existing) {
      const updated = await financeRepository.updateSettlement(existing.id, {
        grossAmount,
        commissionRate,
        commissionAmount,
        refundDeductions,
        netPayout,
        status: existing.status === 'SETTLED' ? 'SETTLED' : status,
      });
      return updated!;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const settlementNumber = `STL-2026-${randomNum}`;

    const newSettlement: SellerSettlementEntity = {
      id: `stl_${randomUUID()}`,
      settlementNumber,
      sellerId: subOrder.sellerId,
      sellerName: subOrder.sellerName,
      subOrderId: subOrder.id,
      orderId: subOrder.parentOrderId,
      orderNumber,
      grossAmount,
      commissionRate,
      commissionAmount,
      refundDeductions,
      netPayout,
      status,
      holdUntilDate: holdUntil,
      eligibleAt: isEligible ? now.toISOString() : null,
      settledAt: null,
      transactionRef: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    return financeRepository.createSettlement(newSettlement);
  }

  async processSettlementPayout(params: {
    settlementId: string;
    transactionRef: string;
    notes?: string;
  }): Promise<SellerSettlementEntity> {
    const settlement = await financeRepository.findSettlementById(params.settlementId);
    if (!settlement) {
      throw new Error('Settlement record not found');
    }

    if (settlement.status === 'SETTLED' || settlement.status === 'PAID') {
      throw new Error('Settlement has already been processed');
    }

    const now = new Date().toISOString();
    const updated = await financeRepository.updateSettlement(settlement.id, {
      status: 'PAID',
      transactionRef: params.transactionRef,
      notes: params.notes || 'Settlement disbursed to seller registered bank account',
      settledAt: now,
    });

    return updated!;
  }

  async generateEligibleSettlements(
    holdDays = 10
  ): Promise<{ settlements: SellerSettlementEntity[]; count: number }> {
    const parentOrders = await orderRepository.findAllParentOrders();
    const isOrderComplete = (s: string) => s === 'COMPLETED' || s === 'DELIVERED';
    const generated: SellerSettlementEntity[] = [];

    for (const order of parentOrders) {
      const subOrders = await orderRepository.findSubOrdersByParentId(order.id);
      for (const sub of subOrders) {
        if (isOrderComplete(sub.status as string) || isOrderComplete(order.status as string)) {
          const settlement = await this.calculateAndRecordSettlement(sub.id, holdDays);
          generated.push(settlement);
        }
      }
    }

    return { settlements: generated, count: generated.length };
  }

  async generateGstInvoice(orderId: string): Promise<GstInvoiceEntity> {
    const existing = await financeRepository.findInvoiceByOrderId(orderId);
    if (existing) {
      return existing;
    }

    const order = await orderRepository.findParentOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Determine seller and items
    const subOrders = await orderRepository.findSubOrdersByParentId(orderId);
    const firstSub = subOrders[0];
    const seller = firstSub ? await sellerRepository.findById(firstSub.sellerId) : null;

    const sellerState = seller?.businessAddress?.state || 'Delhi';
    const buyerState = order.shippingAddress.state;
    const isInterState = sellerState.trim().toLowerCase() !== buyerState.trim().toLowerCase();

    const invoiceItems: GstInvoiceItem[] = [];
    let taxableTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    for (const sub of subOrders) {
      for (const item of sub.items) {
        const gstRate = item.gstRate || 18;
        const itemPrice = (item as any).unitPrice ?? (item as any).price ?? 0;
        const lineTotal = itemPrice * item.quantity;
        const taxableAmount = Math.round((lineTotal / (1 + gstRate / 100)) * 100) / 100;
        const taxAmount = Math.round((lineTotal - taxableAmount) * 100) / 100;

        let cgstRate = 0;
        let cgstAmount = 0;
        let sgstRate = 0;
        let sgstAmount = 0;
        let igstRate = 0;
        let igstAmount = 0;

        if (isInterState) {
          igstRate = gstRate;
          igstAmount = taxAmount;
          igstTotal += igstAmount;
        } else {
          cgstRate = gstRate / 2;
          cgstAmount = Math.round((taxAmount / 2) * 100) / 100;
          sgstRate = gstRate / 2;
          sgstAmount = Math.round((taxAmount - cgstAmount) * 100) / 100;
          cgstTotal += cgstAmount;
          sgstTotal += sgstAmount;
        }

        taxableTotal += taxableAmount;

        invoiceItems.push({
          productId: item.productId,
          description: item.title || (item as any).productName || 'Spare Part',
          partNumber: item.partNumber || (item as any).sku || 'HSN-8708',
          hsnCode: '8708', // Indian HSN Code for motor vehicle parts & accessories
          quantity: item.quantity,
          unitPrice: itemPrice,
          discount: 0,
          taxableAmount,
          gstRate,
          cgstRate,
          cgstAmount,
          sgstRate,
          sgstAmount,
          igstRate,
          igstAmount,
          totalAmount: lineTotal,
        });
      }
    }

    const totalTax = Math.round((cgstTotal + sgstTotal + igstTotal) * 100) / 100;
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const invoiceNumber = `INV-APH-2026-${randomNum}`;

    const invoice: GstInvoiceEntity = {
      id: `inv_${randomUUID()}`,
      invoiceNumber,
      invoiceDate: new Date().toISOString(),
      orderId: order.id,
      orderNumber: order.orderNumber,
      sellerGst: {
        legalName: seller?.businessName || 'AutoPartsHub Marketplace Sellers',
        tradeName: seller?.businessName,
        gstin: seller?.gstin || '07AAAAA0000A1Z5',
        pan: seller?.pan || 'AAAAA0000A',
        stateCode: isInterState ? '07' : '06',
        addressLine: seller?.businessAddress?.addressLine1 || 'Okhla Industrial Area',
        city: seller?.businessAddress?.city || 'New Delhi',
        state: sellerState,
        pinCode: seller?.businessAddress?.pinCode || '110020',
        isB2B: false,
      },
      buyerGst: {
        legalName: (order as any).customerName || order.shippingAddress.fullName || 'Marketplace Customer',
        gstin: (order.shippingAddress as any).gstin || 'URP', // Unregistered Person
        pan: (order.shippingAddress as any).pan || 'URP',
        stateCode: isInterState ? '27' : '07',
        addressLine: order.shippingAddress.addressLine1,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pinCode: order.shippingAddress.pinCode,
        isB2B: !!(order.shippingAddress as any).gstin,
      },
      items: invoiceItems,
      taxableTotal: Math.round(taxableTotal * 100) / 100,
      cgstTotal: Math.round(cgstTotal * 100) / 100,
      sgstTotal: Math.round(sgstTotal * 100) / 100,
      igstTotal: Math.round(igstTotal * 100) / 100,
      cgst: Math.round(cgstTotal * 100) / 100,
      sgst: Math.round(sgstTotal * 100) / 100,
      igst: Math.round(igstTotal * 100) / 100,
      totalTax,
      shippingFee: (order as any).shippingTotal || (order as any).totalShippingFee || 0,
      grandTotal: (order as any).totalPayable || (order as any).grandTotal || (order as any).totalAmount || 0,
      isInterState,
      createdAt: new Date().toISOString(),
    };

    return financeRepository.saveInvoice(invoice);
  }

  async getFinancialSummary(): Promise<FinancialSummaryReport> {
    const orders = await orderRepository.findAllParentOrders();
    const settlements = await financeRepository.findAllSettlements();
    const refunds = await refundRepository.findAll();

    const gmv = orders.reduce((sum: number, o: any) => sum + (o.totalPayable || 0), 0);
    const totalCommissions = settlements.reduce((sum: number, s: any) => sum + (s.commissionAmount || 0), 0);
    const totalRefunds = refunds
      .filter((r: any) => r.status === 'PROCESSED')
      .reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

    const totalSettled = settlements
      .filter((s: any) => s.status === 'SETTLED')
      .reduce((sum: number, s: any) => sum + (s.netPayout || 0), 0);

    const pendingSettlementAmount = settlements
      .filter((s: any) => s.status === 'ON_HOLD' || s.status === 'ELIGIBLE')
      .reduce((sum: number, s: any) => sum + (s.netPayout || 0), 0);

    const totalGstCollected = orders.reduce((sum: number, o: any) => sum + (o.taxAmount || 0), 0);

    return {
      gmv,
      totalCommissions,
      totalRefunds,
      totalSettled,
      pendingSettlementAmount,
      totalGstCollected,
      orderCount: orders.length,
      settledCount: settlements.filter((s) => s.status === 'SETTLED').length,
      pendingCount: settlements.filter((s) => s.status === 'ON_HOLD' || s.status === 'ELIGIBLE').length,
      reportGeneratedAt: new Date().toISOString(),
    };
  }
}

export const financeService = new FinanceService();
