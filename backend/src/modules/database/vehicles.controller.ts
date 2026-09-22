import { Request, Response } from 'express';
import { databaseRepository } from './database.repository.js';
import { vehicleFitmentSchema } from './database.validation.js';
import { VehicleType, VehicleFitmentSpec } from '../../types/database.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function getManufacturers(req: Request, res: Response): Promise<void> {
  const category = req.query.category as VehicleType | undefined;
  const manufacturers = await databaseRepository.getVehicleManufacturers(category);
  sendSuccess(res, manufacturers);
}

export async function getModels(req: Request, res: Response): Promise<void> {
  const manufacturerId = req.query.manufacturerId as string;
  if (!manufacturerId) {
    sendError(res, 'Query parameter "manufacturerId" is required', 400, 'BAD_REQUEST');
    return;
  }

  const models = await databaseRepository.getModelsByManufacturer(manufacturerId);
  sendSuccess(res, models);
}

export async function getModelVariants(req: Request, res: Response): Promise<void> {
  const modelId = req.query.modelId as string;
  if (!modelId) {
    sendError(res, 'Query parameter "modelId" is required', 400, 'BAD_REQUEST');
    return;
  }

  const model = await databaseRepository.getModelById(modelId);
  if (!model) {
    sendError(res, `Vehicle model "${modelId}" not found`, 404, 'MODEL_NOT_FOUND');
    return;
  }

  sendSuccess(res, {
    modelId: model.id,
    modelName: model.name,
    manufacturerId: model.manufacturerId,
    years: model.years,
    fuelTypes: model.fuelTypes,
    engines: model.engines,
    variants: model.variants,
  });
}

export async function validateFitment(req: Request, res: Response): Promise<void> {
  const parsed = vehicleFitmentSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 'Invalid vehicle fitment specification', 400, 'VALIDATION_ERROR', [
      { message: parsed.error.errors[0]?.message || 'Validation failed' },
    ]);
    return;
  }

  const spec: VehicleFitmentSpec = parsed.data;
  const validationResult = await databaseRepository.validateVehicleFitment(spec);

  if (!validationResult.valid) {
    sendError(res, validationResult.reason || 'Vehicle fitment invalid', 400, 'INVALID_VEHICLE_FITMENT');
    return;
  }

  const compatibilityToken = databaseRepository.generateCompatibilityToken(spec);

  sendSuccess(res, {
    valid: true,
    spec,
    compatibilityToken,
    message: 'Vehicle specification verified against database catalog.',
  });
}
