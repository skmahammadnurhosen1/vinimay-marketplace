import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { databaseRepository } from './database.repository.js';
import { createAddressSchema } from './database.validation.js';
import { AddressEntity } from '../../types/database.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function getAddresses(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const addresses = await databaseRepository.getAddressesByUser(req.user.uid);
  sendSuccess(res, addresses);
}

export async function createAddress(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const parsed = createAddressSchema.safeParse(req.body);
  if (!parsed.success) {
    const errorDetail = parsed.error.errors[0]?.message || 'Validation failed';
    sendError(res, errorDetail, 400, 'VALIDATION_ERROR', [
      { field: parsed.error.errors[0]?.path.join('.'), message: errorDetail },
    ]);
    return;
  }

  const now = new Date().toISOString();
  const newAddress: AddressEntity = {
    id: `addr_${crypto.randomUUID()}`,
    userId: req.user.uid,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    addressLine1: parsed.data.addressLine1,
    addressLine2: parsed.data.addressLine2,
    landmark: parsed.data.landmark,
    city: parsed.data.city,
    district: parsed.data.district,
    state: parsed.data.state,
    pinCode: parsed.data.pinCode,
    country: 'India',
    type: parsed.data.type,
    isDefault: !!parsed.data.isDefault,
    createdAt: now,
    updatedAt: now,
  };

  const created = await databaseRepository.createAddress(newAddress);
  sendSuccess(res, created, 201);
}

export async function deleteAddress(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    sendError(res, 'Address ID required', 400, 'BAD_REQUEST');
    return;
  }

  const success = await databaseRepository.deleteAddress(id, req.user.uid);
  if (!success) {
    sendError(res, 'Address not found or unauthorized to delete', 404, 'ADDRESS_NOT_FOUND');
    return;
  }

  sendSuccess(res, { message: 'Address deleted successfully', id });
}
