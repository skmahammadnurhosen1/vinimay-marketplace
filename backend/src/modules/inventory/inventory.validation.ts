import { z } from 'zod';

export const adjustStockSchema = z.object({
  delta: z.number().int().refine((val) => val !== 0, {
    message: 'Stock adjustment delta cannot be zero',
  }),
  type: z.enum([
    'RESTOCK',
    'ADJUSTMENT_ADD',
    'ADJUSTMENT_SUBTRACT',
    'RESERVATION',
    'RELEASE',
    'SALE',
    'RETURN_RESTOCK',
  ]),
  reason: z.string().trim().min(3, 'Adjustment reason is required'),
  referenceId: z.string().trim().optional(),
});
