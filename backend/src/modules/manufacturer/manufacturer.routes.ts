import { Router } from 'express';
import {
  getManufacturerProfile,
  getManufacturerProducts,
  getManufacturerOrders,
  getManufacturerAnalytics,
} from './manufacturer.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { manufacturerService } from './manufacturer.service.js';

export const manufacturerRouter = Router();

// Enforce MANUFACTURER role
manufacturerRouter.use(requireAuthentication, requireRole('MANUFACTURER'));

manufacturerRouter.get('/profile', getManufacturerProfile);
manufacturerRouter.get('/products', getManufacturerProducts);
manufacturerRouter.get('/catalog', getManufacturerProducts);
manufacturerRouter.get('/orders', getManufacturerOrders);

// Detailed Analytics Sub-endpoints mapped from comprehensive aggregation
manufacturerRouter.get('/sales', async (req, res) => {
  const analytics = await manufacturerService.getManufacturerAnalytics(req.user!.uid);
  sendSuccess(res, {
    totalUnitsSold: analytics.totalUnitsSold,
    totalRevenue: analytics.totalRevenue,
    topSellingProducts: analytics.topSellingProducts,
  });
});

manufacturerRouter.get('/dealers', async (req, res) => {
  const analytics = await manufacturerService.getManufacturerAnalytics(req.user!.uid);
  sendSuccess(res, { dealers: analytics.dealers, total: analytics.dealers.length });
});

manufacturerRouter.get('/demand', async (req, res) => {
  const analytics = await manufacturerService.getManufacturerAnalytics(req.user!.uid);
  sendSuccess(res, { demandInsights: analytics.demandInsights });
});

manufacturerRouter.get('/returns', async (req, res) => {
  const analytics = await manufacturerService.getManufacturerAnalytics(req.user!.uid);
  sendSuccess(res, {
    returnsCount: analytics.returnsCount,
    returnRatePercent: analytics.returnRatePercent,
  });
});

manufacturerRouter.get('/warranty', async (req, res) => {
  const analytics = await manufacturerService.getManufacturerAnalytics(req.user!.uid);
  sendSuccess(res, {
    warrantyClaimsCount: analytics.warrantyClaimsCount,
    warrantyClaimRatePercent: analytics.warrantyClaimRatePercent,
  });
});

manufacturerRouter.get('/inventory', async (req, res) => {
  const analytics = await manufacturerService.getManufacturerAnalytics(req.user!.uid);
  sendSuccess(res, {
    channelStockUnits: analytics.channelStockUnits,
    channelStockValue: analytics.channelStockValue,
  });
});

manufacturerRouter.get('/revenue', async (req, res) => {
  const analytics = await manufacturerService.getManufacturerAnalytics(req.user!.uid);
  sendSuccess(res, {
    totalRevenue: analytics.totalRevenue,
    totalOrders: analytics.totalOrders,
  });
});

manufacturerRouter.get('/analytics', getManufacturerAnalytics);
