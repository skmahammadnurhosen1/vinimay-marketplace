import { z } from 'zod';

export const packageDimensionsSchema = z.object({
  weightKg: z.number().positive('Weight must be greater than zero').default(1.5),
  lengthCm: z.number().positive('Length must be greater than zero').default(20),
  widthCm: z.number().positive('Width must be greater than zero').default(15),
  heightCm: z.number().positive('Height must be greater than zero').default(10),
});

export const createShipmentSchema = z.object({
  subOrderId: z.string().trim().min(1, 'Sub-order ID is required'),
  provider: z
    .enum(['shiprocket', 'delhivery', 'bluedart', 'dtdc', 'xpressbees', 'mock_logistics'])
    .default('mock_logistics'),
  dimensions: packageDimensionsSchema.default({
    weightKg: 1.5,
    lengthCm: 20,
    widthCm: 15,
    heightCm: 10,
  }),
});

export const updateShipmentStageSchema = z.object({
  stage: z.enum(['ordered', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'rto']),
  title: z.string().trim().min(2, 'Checkpoint title is required'),
  description: z.string().trim().min(2, 'Checkpoint description is required'),
  location: z.string().trim().min(2, 'Checkpoint location is required'),
});

export const shippingWebhookSchema = z.object({
  eventId: z.string().trim().min(1, 'Webhook event ID is required'),
  awbNumber: z.string().trim().min(1, 'AWB number is required'),
  stage: z.enum(['ordered', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'rto']),
  title: z.string().trim().min(2),
  description: z.string().trim().min(2),
  location: z.string().trim().min(2),
});
