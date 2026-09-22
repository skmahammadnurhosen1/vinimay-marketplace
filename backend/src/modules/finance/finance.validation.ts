import { z } from 'zod';

export const updateCommissionConfigSchema = z.object({
  defaultRate: z.number().min(0).max(100).optional(),
  categoryRates: z.record(z.string(), z.number().min(0).max(100)).optional(),
  sellerAgreedRates: z.record(z.string(), z.number().min(0).max(100)).optional(),
});

export const processSettlementSchema = z.object({
  settlementId: z.string().min(1, 'Settlement ID is required'),
  transactionRef: z.string().min(3, 'Transaction reference is required'),
  notes: z.string().optional(),
});
