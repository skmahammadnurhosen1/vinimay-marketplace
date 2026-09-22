import { Request, Response } from 'express';
import { financeService } from './finance.service.js';
import { financeRepository } from './finance.repository.js';
import { updateCommissionConfigSchema, processSettlementSchema } from './finance.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function getCommissionConfig(_req: Request, res: Response): Promise<void> {
  const config = await financeRepository.getCommissionConfig();
  sendSuccess(res, { config });
}

export async function updateCommissionConfig(req: Request, res: Response): Promise<void> {
  const parseResult = updateCommissionConfigSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const updatedBy = req.user?.uid || 'admin';
  const updated = await financeRepository.updateCommissionConfig(parseResult.data, updatedBy);
  sendSuccess(res, { config: updated });
}

export async function listSettlements(req: Request, res: Response): Promise<void> {
  const { sellerId, status } = req.query;
  let settlements = await financeRepository.findAllSettlements();

  if (sellerId) {
    settlements = settlements.filter((s) => s.sellerId === sellerId);
  }
  if (status) {
    settlements = settlements.filter((s) => s.status === status);
  }

  sendSuccess(res, { settlements, total: settlements.length });
}

export async function processSettlement(req: Request, res: Response): Promise<void> {
  const parseResult = processSettlementSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  try {
    const updated = await financeService.processSettlementPayout({
      settlementId: parseResult.data.settlementId,
      transactionRef: parseResult.data.transactionRef,
      notes: parseResult.data.notes,
    });
    sendSuccess(res, { settlement: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Settlement processing failed';
    sendError(res, message, 400, 'SETTLEMENT_FAILED');
  }
}

export async function generateSettlements(req: Request, res: Response): Promise<void> {
  const holdPeriodDays =
    typeof req.body?.holdPeriodDays === 'number' ? req.body.holdPeriodDays : 10;
  const result = await financeService.generateEligibleSettlements(holdPeriodDays);
  sendSuccess(res, result);
}

export async function getGstInvoice(req: Request, res: Response): Promise<void> {
  const rawOrderId = req.params.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
  try {
    const invoice = await financeService.generateGstInvoice(orderId);
    sendSuccess(res, { invoice });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invoice generation failed';
    sendError(res, message, 404, 'INVOICE_NOT_FOUND');
  }
}

export async function getFinancialSummary(_req: Request, res: Response): Promise<void> {
  const summary = await financeService.getFinancialSummary();
  sendSuccess(res, { summary });
}
