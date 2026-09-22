import { randomUUID } from 'node:crypto';
import {
  ShippingProviderType,
  TrackingCheckpoint,
  PackageDimensions,
} from '../../types/shipping.js';
import { AddressEntity } from '../../types/database.js';
import { SellerSubOrderEntity } from '../../types/order.js';

export interface CreateShipmentResult {
  providerShipmentId: string;
  awbNumber: string;
  courierPartner: string;
  shippingCost: number;
  estimatedDelivery: string;
  trackingUrl: string;
  checkpoints: TrackingCheckpoint[];
}

export interface IShippingProvider {
  readonly providerType: ShippingProviderType;
  createShipment(params: {
    subOrder: SellerSubOrderEntity;
    pickupAddress: AddressEntity;
    deliveryAddress: AddressEntity;
    dimensions: PackageDimensions;
  }): Promise<CreateShipmentResult>;
  trackShipment(awbNumber: string): Promise<TrackingCheckpoint[]>;
  cancelShipment(awbNumber: string): Promise<boolean>;
}

export class MockLogisticsProvider implements IShippingProvider {
  readonly providerType: ShippingProviderType = 'mock_logistics';

  async createShipment(params: {
    subOrder: SellerSubOrderEntity;
    pickupAddress: AddressEntity;
    deliveryAddress: AddressEntity;
    dimensions: PackageDimensions;
  }): Promise<CreateShipmentResult> {
    const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
    const awbNumber = `DEL-${randomSuffix}`;
    const providerShipmentId = `ship_${randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();

    const checkpoints: TrackingCheckpoint[] = [
      {
        stage: 'ordered',
        title: 'Shipment Created',
        description: 'Electronic shipping manifest created by merchant.',
        timestamp: now,
        location: `${params.pickupAddress.city}, ${params.pickupAddress.state}`,
        completed: true,
        current: false,
      },
      {
        stage: 'packed',
        title: 'Package Sealed & Barcode Assigned',
        description: 'Merchant packaged parts and applied AWB barcode.',
        timestamp: now,
        location: `${params.pickupAddress.city} Fulfillment Hub`,
        completed: true,
        current: true,
      },
    ];

    return {
      providerShipmentId,
      awbNumber,
      courierPartner: 'Delhivery Express Direct',
      shippingCost: params.subOrder.shippingFee,
      estimatedDelivery: '3-4 Business Days',
      trackingUrl: `https://track.autopartshub.in/awb/${awbNumber}`,
      checkpoints,
    };
  }

  async trackShipment(awbNumber: string): Promise<TrackingCheckpoint[]> {
    const now = new Date().toISOString();
    return [
      {
        stage: 'ordered',
        title: 'Order Received',
        description: 'Order manifest created.',
        timestamp: now,
        location: 'Merchant Facility',
        completed: true,
        current: false,
      },
      {
        stage: 'packed',
        title: 'Packed',
        description: 'Shipment packaged and labeled.',
        timestamp: now,
        location: 'Merchant Warehouse',
        completed: true,
        current: false,
      },
      {
        stage: 'shipped',
        title: 'In Transit',
        description: `En route with courier tracking AWB: ${awbNumber}.`,
        timestamp: now,
        location: 'Hub Transit Network',
        completed: true,
        current: true,
      },
    ];
  }

  async cancelShipment(_awbNumber: string): Promise<boolean> {
    return true;
  }
}

// Extensible Production Adapters
export class ShiprocketProviderAdapter implements IShippingProvider {
  readonly providerType: ShippingProviderType = 'shiprocket';

  async createShipment(params: {
    subOrder: SellerSubOrderEntity;
    pickupAddress: AddressEntity;
    deliveryAddress: AddressEntity;
    dimensions: PackageDimensions;
  }): Promise<CreateShipmentResult> {
    // Adapter ready for Shiprocket API key integration
    return new MockLogisticsProvider().createShipment(params);
  }

  async trackShipment(awbNumber: string): Promise<TrackingCheckpoint[]> {
    return new MockLogisticsProvider().trackShipment(awbNumber);
  }

  async cancelShipment(awbNumber: string): Promise<boolean> {
    return new MockLogisticsProvider().cancelShipment(awbNumber);
  }
}

export class ShippingProviderFactory {
  static getProvider(type?: ShippingProviderType): IShippingProvider {
    switch (type) {
      case 'shiprocket':
        return new ShiprocketProviderAdapter();
      case 'mock_logistics':
      default:
        return new MockLogisticsProvider();
    }
  }
}
