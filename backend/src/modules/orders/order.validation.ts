import { z } from 'zod';
import { createAddressSchema } from '../database/database.validation.js';

export const orderVehicleContextSchema = z
  .object({
    vehicleType: z.string().optional(),
    manufacturerId: z.string().optional(),
    manufacturerName: z.string().optional(),
    manufacturer: z.string().optional(),
    modelId: z.string().optional(),
    modelName: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    fuelType: z.string().optional(),
    engine: z.string().optional(),
    variant: z.string().optional(),
  })
  .passthrough();

export const createOrderSchema = z
  .object({
    addressId: z.string().trim().optional(),
    shippingAddress: createAddressSchema.optional(),
    paymentMethod: z.preprocess(
      (val) => (typeof val === 'string' ? val.toLowerCase() : val),
      z.enum(['upi', 'card', 'netbanking', 'wallet', 'cod']).default('upi')
    ),
    vehicleContext: orderVehicleContextSchema.optional(),
  })
  .refine((data) => !!data.addressId || !!data.shippingAddress, {
    message: 'Either addressId or shippingAddress is required for delivery',
    path: ['addressId'],
  });

export const updateSubOrderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'PROCESSING', 'CANCELLED', 'COMPLETED']),
});
