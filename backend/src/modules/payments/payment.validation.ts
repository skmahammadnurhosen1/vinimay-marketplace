import { z } from 'zod';

export const initiatePaymentSchema = z.preprocess(
  (input: any) => {
    if (typeof input === 'object' && input !== null) {
      const rawMethod = input.method || input.paymentMethod;
      return {
        ...input,
        method: typeof rawMethod === 'string' ? rawMethod.toLowerCase() : rawMethod,
      };
    }
    return input;
  },
  z.object({
    orderId: z.string().trim().min(1, 'Order ID is required'),
    method: z.enum(['upi', 'card', 'netbanking', 'wallet', 'cod']),
  })
);

export const verifyPaymentSchema = z.preprocess(
  (input: any) => {
    if (typeof input === 'object' && input !== null) {
      return {
        ...input,
        providerSignature: input.providerSignature || input.signature,
      };
    }
    return input;
  },
  z.object({
    paymentId: z.string().trim().min(1, 'Payment ID is required'),
    providerPaymentId: z.string().trim().min(1, 'Provider payment ID is required'),
    providerSignature: z.string().trim().min(1, 'Provider signature is required'),
  })
);

export const checkCodEligibilitySchema = z.object({
  orderId: z.string().trim().min(1, 'Order ID is required'),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Valid 6-digit Indian PIN code required').optional(),
});
