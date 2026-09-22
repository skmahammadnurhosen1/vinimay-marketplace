import { z } from 'zod';
import { vehicleFitmentSpecSchema } from '../database/database.validation.js';

export const productImageSchema = z.object({
  id: z.string().trim().min(1),
  url: z.string().trim().min(1),
  storagePath: z.string().trim().min(1),
  isPrimary: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  altText: z.string().trim().optional(),
});

export const deliveryPlaceholderSchema = z.object({
  weightKg: z.number().positive().optional(),
  dimensionsCm: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  estimatedDispatchDays: z.number().int().positive().optional(),
});

export const createProductSchema = z
  .object({
    productName: z.string().trim().min(3, 'Product name must be at least 3 characters'),
    brand: z.string().trim().min(2, 'Brand is required'),
    manufacturer: z.string().trim().min(2, 'Manufacturer is required'),
    partNumber: z.string().trim().min(2, 'Part number is required'),
    oemNumber: z.string().trim().default(''),
    category: z.string().trim().min(2, 'Product category is required'),
    subCategory: z.string().trim().min(2, 'Sub-category is required'),
    productType: z.enum(['Genuine', 'OEM', 'Aftermarket']),
    description: z.string().trim().min(10, 'Description must be at least 10 characters'),
    features: z.array(z.string().trim()).default([]),
    specifications: z.record(z.string(), z.string()).default({}),
    compatibleVehicles: z.array(vehicleFitmentSpecSchema).min(1, 'At least one compatible vehicle specification is required'),
    price: z.number().positive('Selling price must be greater than zero'),
    mrp: z.number().positive('MRP must be greater than zero'),
    gstRate: z.number().refine((val) => [0, 5, 12, 18, 28].includes(val), {
      message: 'GST rate must be 0, 5, 12, 18, or 28%',
    }),
    warranty: z.string().trim().min(2, 'Warranty information is required'),
    returnPolicy: z.string().trim().min(2, 'Return policy is required'),
    warrantyPolicy: z.string().trim().optional(),
    installationInfo: z.string().trim().optional(),
    delivery: deliveryPlaceholderSchema.optional(),
    images: z.array(productImageSchema).min(1, 'At least one product image is required'),
    initialStock: z.number().int().min(0, 'Initial stock cannot be negative').default(0),
    lowStockThreshold: z.number().int().min(0, 'Low-stock threshold cannot be negative').default(5),
    sku: z.string().trim().optional(),
    submitForReview: z.boolean().default(false),
  })
  .refine((data) => data.mrp >= data.price, {
    message: 'MRP must be greater than or equal to selling price',
    path: ['mrp'],
  });

export const updateProductSchema = z
  .object({
    productName: z.string().trim().min(3).optional(),
    brand: z.string().trim().min(2).optional(),
    manufacturer: z.string().trim().min(2).optional(),
    partNumber: z.string().trim().min(2).optional(),
    oemNumber: z.string().trim().optional(),
    category: z.string().trim().min(2).optional(),
    subCategory: z.string().trim().min(2).optional(),
    productType: z.enum(['Genuine', 'OEM', 'Aftermarket']).optional(),
    description: z.string().trim().min(10).optional(),
    features: z.array(z.string().trim()).optional(),
    specifications: z.record(z.string(), z.string()).optional(),
    compatibleVehicles: z.array(vehicleFitmentSpecSchema).optional(),
    price: z.number().positive().optional(),
    mrp: z.number().positive().optional(),
    gstRate: z
      .number()
      .refine((val) => [0, 5, 12, 18, 28].includes(val), {
        message: 'GST rate must be 0, 5, 12, 18, or 28%',
      })
      .optional(),
    warranty: z.string().trim().min(2).optional(),
    returnPolicy: z.string().trim().min(2).optional(),
    warrantyPolicy: z.string().trim().optional(),
    installationInfo: z.string().trim().optional(),
    delivery: deliveryPlaceholderSchema.optional(),
    images: z.array(productImageSchema).optional(),
    lowStockThreshold: z.number().int().min(0).optional(),
    sku: z.string().trim().optional(),
    submitForReview: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.price !== undefined && data.mrp !== undefined) {
        return data.mrp >= data.price;
      }
      return true;
    },
    {
      message: 'MRP must be greater than or equal to selling price',
      path: ['mrp'],
    }
  );

export const reviewProductSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().trim().optional(),
});
