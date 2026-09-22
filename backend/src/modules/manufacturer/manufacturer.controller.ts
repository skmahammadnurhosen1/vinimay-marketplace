import { Request, Response } from 'express';
import { manufacturerService } from './manufacturer.service.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function getManufacturerProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  try {
    const profile = await manufacturerService.getManufacturerForUser(req.user.uid);
    sendSuccess(res, { profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Manufacturer profile not found';
    sendError(res, message, 404, 'MANUFACTURER_NOT_FOUND');
  }
}

export async function getManufacturerProducts(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  try {
    const products = await manufacturerService.getManufacturerProducts(req.user.uid);
    sendSuccess(res, { products, total: products.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Product fetch failed';
    sendError(res, message, 400, 'FETCH_FAILED');
  }
}

export async function getManufacturerOrders(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  try {
    const orders = await manufacturerService.getManufacturerOrders(req.user.uid);
    sendSuccess(res, { orders, total: orders.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Order fetch failed';
    sendError(res, message, 400, 'FETCH_FAILED');
  }
}

export async function getManufacturerAnalytics(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  try {
    const report = await manufacturerService.getManufacturerAnalytics(req.user.uid);
    sendSuccess(res, { report, analytics: report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analytics generation failed';
    sendError(res, message, 400, 'ANALYTICS_FAILED');
  }
}
