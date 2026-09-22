import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { shipmentRepository } from './shipment.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { ShippingProviderFactory } from './shipping.provider.js';
import {
  createShipmentSchema,
  updateShipmentStageSchema,
  shippingWebhookSchema,
} from './shipping.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';
import { ShipmentEntity, TrackingCheckpoint } from '../../types/shipping.js';

export async function createShipment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller && req.user.role !== 'ADMIN') {
    sendError(res, 'Seller profile required to generate shipment labels', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const parseResult = createShipmentSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const { subOrderId, provider: providerType, dimensions } = parseResult.data;

  // 1. Fetch sub-order
  const subOrder = await orderRepository.findSubOrderById(subOrderId);
  if (!subOrder) {
    sendError(res, 'Sub-order not found', 404, 'SUB_ORDER_NOT_FOUND');
    return;
  }

  // 2. Ownership check
  if (seller && subOrder.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access: you cannot dispatch packages for other sellers', 403, 'FORBIDDEN');
    return;
  }

  // 3. Check if shipment already exists
  const existingShipment = await shipmentRepository.findBySubOrderId(subOrderId);
  if (existingShipment) {
    sendSuccess(res, { shipment: existingShipment, alreadyExisted: true });
    return;
  }

  // 4. Fetch parent order to obtain delivery address
  const parentOrder = await orderRepository.findParentOrderById(subOrder.parentOrderId);
  if (!parentOrder) {
    sendError(res, 'Parent order not found for this package', 404, 'PARENT_ORDER_NOT_FOUND');
    return;
  }

  // 5. Delegate to logistics provider
  const provider = ShippingProviderFactory.getProvider(providerType);
  const shipmentResult = await provider.createShipment({
    subOrder,
    pickupAddress: seller ? seller.businessAddress : parentOrder.shippingAddress,
    deliveryAddress: parentOrder.shippingAddress,
    dimensions,
  });

  const now = new Date().toISOString();
  const shipmentId = `ship_${randomUUID()}`;

  const shipment: ShipmentEntity = {
    id: shipmentId,
    subOrderId,
    parentOrderId: parentOrder.id,
    sellerId: subOrder.sellerId,
    provider: providerType,
    providerShipmentId: shipmentResult.providerShipmentId,
    awbNumber: shipmentResult.awbNumber,
    trackingUrl: shipmentResult.trackingUrl,
    status: 'packed',
    courierPartner: shipmentResult.courierPartner,
    shippingCost: shipmentResult.shippingCost,
    pickupAddress: seller ? seller.businessAddress : parentOrder.shippingAddress,
    deliveryAddress: parentOrder.shippingAddress,
    dimensions,
    estimatedDelivery: shipmentResult.estimatedDelivery,
    checkpoints: shipmentResult.checkpoints,
    createdAt: now,
    updatedAt: now,
  };

  const created = await shipmentRepository.create(shipment);

  // Advance sub-order status to PROCESSING
  await orderRepository.updateSubOrderStatus(subOrderId, 'PROCESSING');

  sendSuccess(res, { shipment: created }, 201);
}

export async function trackShipment(req: Request, res: Response): Promise<void> {
  const rawIdentifier = req.params.identifier;
  const identifier = Array.isArray(rawIdentifier) ? rawIdentifier[0] : rawIdentifier;

  let shipment = await shipmentRepository.findByAwb(identifier);
  if (!shipment) {
    shipment = await shipmentRepository.findBySubOrderId(identifier);
  }

  if (!shipment) {
    sendError(res, 'Shipment tracking information not found for given AWB or Sub-Order', 404, 'NOT_FOUND');
    return;
  }

  sendSuccess(res, {
    tracking: {
      awbNumber: shipment.awbNumber,
      courierPartner: shipment.courierPartner,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
      trackingUrl: shipment.trackingUrl,
      checkpoints: shipment.checkpoints,
      subOrderId: shipment.subOrderId,
      parentOrderId: shipment.parentOrderId,
    },
  });
}

export async function updateShipmentCheckpoint(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawId = req.params.shipmentId;
  const shipmentId = Array.isArray(rawId) ? rawId[0] : rawId;

  const shipment = await shipmentRepository.findById(shipmentId);
  if (!shipment) {
    sendError(res, 'Shipment not found', 404, 'SHIPMENT_NOT_FOUND');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (seller && shipment.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access to this shipment', 403, 'FORBIDDEN');
    return;
  }

  const parseResult = updateShipmentStageSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const input = parseResult.data;
  const newCheckpoint: TrackingCheckpoint = {
    stage: input.stage,
    title: input.title,
    description: input.description,
    location: input.location,
    timestamp: new Date().toISOString(),
    completed: true,
    current: true,
  };

  const updated = await shipmentRepository.addCheckpoint(shipmentId, newCheckpoint);

  // If delivered, update sub-order status
  if (input.stage === 'delivered') {
    await orderRepository.updateSubOrderStatus(shipment.subOrderId, 'COMPLETED');
  }

  sendSuccess(res, { shipment: updated });
}

export async function getSellerShipments(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const shipments = await shipmentRepository.findBySellerId(seller.id);
  sendSuccess(res, { shipments, total: shipments.length });
}

export async function handleShippingWebhook(req: Request, res: Response): Promise<void> {
  const parseResult = shippingWebhookSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const { eventId, awbNumber, stage, title, description, location } = parseResult.data;

  // 1. Idempotency Check
  const alreadyHandled = await shipmentRepository.isWebhookProcessed(eventId);
  if (alreadyHandled) {
    sendSuccess(res, { status: 'already_processed', duplicate: true });
    return;
  }

  // 2. Find shipment
  const shipment = await shipmentRepository.findByAwb(awbNumber);
  if (!shipment) {
    sendError(res, 'Shipment not found for AWB', 404, 'SHIPMENT_NOT_FOUND');
    return;
  }

  // 3. Add Checkpoint
  const checkpoint: TrackingCheckpoint = {
    stage,
    title,
    description,
    location,
    timestamp: new Date().toISOString(),
    completed: true,
    current: true,
  };

  await shipmentRepository.addCheckpoint(shipment.id, checkpoint);

  if (stage === 'delivered') {
    await orderRepository.updateSubOrderStatus(shipment.subOrderId, 'COMPLETED');
  }

  // 4. Record event
  await shipmentRepository.recordWebhook(eventId);

  sendSuccess(res, { status: 'processed', duplicate: false });
}

export async function shipSellerSubOrder(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const rawSubOrderId = req.params.subOrderId;
  const subOrderId = Array.isArray(rawSubOrderId) ? rawSubOrderId[0] : rawSubOrderId;

  const subOrder = await orderRepository.findSubOrderById(subOrderId);
  if (!subOrder) {
    sendError(res, 'Sub-order not found', 404, 'SUB_ORDER_NOT_FOUND');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (seller && subOrder.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access: you cannot dispatch packages for other sellers', 403, 'FORBIDDEN');
    return;
  }

  const parentOrder = await orderRepository.findParentOrderById(subOrder.parentOrderId);
  if (!parentOrder) {
    sendError(res, 'Parent order not found for this package', 404, 'PARENT_ORDER_NOT_FOUND');
    return;
  }

  const courierName = req.body?.courierName || 'Delhivery';
  const pickupAddress = req.body?.pickupAddress || (seller ? seller.businessAddress : parentOrder.shippingAddress);
  const awbNumber = `AWB-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const now = new Date().toISOString();
  const shipmentId = `ship_${randomUUID()}`;

  const shipment: ShipmentEntity = {
    id: shipmentId,
    subOrderId,
    parentOrderId: parentOrder.id,
    sellerId: subOrder.sellerId,
    provider: 'delhivery',
    providerShipmentId: `dlhv_${randomUUID().slice(0, 8)}`,
    awbNumber,
    trackingUrl: `https://track.autopartshub.com/${awbNumber}`,
    status: 'IN_TRANSIT',
    courierPartner: courierName,
    shippingCost: subOrder.shippingFee || 0,
    pickupAddress,
    deliveryAddress: parentOrder.shippingAddress,
    dimensions: { lengthCm: 30, widthCm: 20, heightCm: 15, weightKg: 2.5 },
    estimatedDelivery: new Date(Date.now() + (req.body?.estimatedDeliveryDays || 3) * 86400000).toISOString(),
    checkpoints: [
      {
        stage: 'shipped',
        title: 'Package Dispatched',
        description: `Package picked up by courier partner ${courierName}`,
        timestamp: now,
        location: `${pickupAddress.city || 'Hub'}, ${pickupAddress.state || 'IN'}`,
        completed: true,
        current: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const created = await shipmentRepository.create(shipment);
  await orderRepository.updateSubOrderStatus(subOrderId, 'SHIPPED');

  sendSuccess(res, { shipment: created }, 201);
}

