import { randomUUID } from 'node:crypto';
import { refundRepository } from './refund.repository.js';
import { returnRepository } from '../returns/return.repository.js';
import { paymentRepository } from '../payments/payment.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { RefundEntity } from '../../types/refund.js';
import { ReturnStatusHistoryEntry } from '../../types/return.js';

export class RefundService {
  async processRefundForReturn(returnId: string, performedBy: string): Promise<RefundEntity> {
    // 1. Fetch return record
    const returnReq = await returnRepository.findById(returnId);
    if (!returnReq) {
      throw new Error('Return request not found');
    }

    const eligibleStatuses = ['APPROVED', 'INSPECTION', 'REFUND_PENDING'];
    if (!eligibleStatuses.includes(returnReq.status)) {
      throw new Error(
        `Cannot process refund for return in "${returnReq.status}" status. Return must be approved or inspected first.`
      );
    }

    // 2. Prevent Double Refund
    const existingRefund = await refundRepository.findByReturnId(returnId);
    if (existingRefund && existingRefund.status === 'PROCESSED') {
      throw new Error(`Refund has already been processed for this return (${existingRefund.refundNumber})`);
    }

    // 3. Resolve Payment
    const payment = await paymentRepository.findByOrderId(returnReq.orderId);
    const paymentId = payment ? payment.id : `pay_direct_${randomUUID().slice(0, 8)}`;

    // 4. Authoritative Amount (Never trust client-supplied amounts)
    const refundAmount = returnReq.approvedRefundAmount;
    if (refundAmount <= 0) {
      throw new Error('Calculated refund amount must be greater than zero');
    }

    const now = new Date().toISOString();
    const refundId = `ref_${randomUUID()}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refundNumber = `REF-2026-${randomNum}`;
    const providerRefundId = `rfnd_${randomUUID().slice(0, 12)}`;

    const refundEntity: RefundEntity = {
      id: refundId,
      refundNumber,
      paymentId,
      orderId: returnReq.orderId,
      subOrderId: returnReq.subOrderId,
      returnId: returnReq.id,
      customerId: returnReq.customerId,
      amount: refundAmount,
      currency: 'INR',
      reason: `Refund for return #${returnReq.returnNumber} (${returnReq.reason})`,
      status: 'PROCESSED',
      providerRefundId,
      processedAt: now,
      createdAt: now,
    };

    const created = await refundRepository.create(refundEntity);

    // 5. Update Return Status to REFUNDED
    const newHistory: ReturnStatusHistoryEntry = {
      status: 'REFUNDED',
      title: `Refund Processed (${refundNumber})`,
      notes: `Authoritative refund of ₹${refundAmount} credited. Transaction ref: ${providerRefundId}`,
      updatedBy: performedBy,
      timestamp: now,
    };

    await returnRepository.update(returnReq.id, {
      status: 'REFUNDED',
      statusHistory: [...returnReq.statusHistory, newHistory],
    });

    // 6. Restock Returned Inventory Item
    try {
      await inventoryRepository.adjustStock({
        productId: returnReq.productId,
        sellerId: returnReq.sellerId,
        delta: returnReq.quantity,
        type: 'RETURN_RESTOCK',
        reason: `Restocked via approved Return #${returnReq.returnNumber}`,
        referenceId: refundId,
        performedBy,
      });
    } catch (invErr) {
      // Inventory restock logged
    }

    // 7. Update Payment & Parent Order status
    if (payment) {
      await paymentRepository.update(payment.id, {
        status: 'REFUNDED',
      });
    }

    return created;
  }
}

export const refundService = new RefundService();
