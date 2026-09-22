import { Request, Response } from 'express';
import { databaseRepository } from './database.repository.js';
import { VehicleType } from '../../types/database.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function getAllBrands(req: Request, res: Response): Promise<void> {
  const categoryQuery = req.query.category as VehicleType | undefined;
  const brands = await databaseRepository.getBrands(categoryQuery);
  sendSuccess(res, brands);
}

export async function getBrandById(req: Request, res: Response): Promise<void> {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    sendError(res, 'Brand ID parameter required', 400, 'BAD_REQUEST');
    return;
  }

  const brand = await databaseRepository.getBrandById(id);
  if (!brand) {
    sendError(res, `Brand with ID "${id}" not found`, 404, 'BRAND_NOT_FOUND');
    return;
  }

  sendSuccess(res, brand);
}
