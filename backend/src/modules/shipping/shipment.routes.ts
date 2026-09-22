import { Router } from 'express';
import {
  createShipment,
  trackShipment,
  updateShipmentCheckpoint,
  getSellerShipments,
  handleShippingWebhook,
} from './shipment.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const shippingRouter = Router();

// Public webhook and tracking endpoints
shippingRouter.post('/webhook', handleShippingWebhook);
shippingRouter.get('/track/:identifier', trackShipment);

// Authenticated Shipping Management
shippingRouter.post('/shipments', requireAuthentication, createShipment);
shippingRouter.patch('/shipments/:shipmentId/checkpoint', requireAuthentication, updateShipmentCheckpoint);
shippingRouter.get('/seller/shipments', requireAuthentication, getSellerShipments);
