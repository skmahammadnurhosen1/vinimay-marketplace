import {
  CartItem,
  ConfirmedOrder,
  DeliveryAddress,
  PaymentDetails,
  Product,
  SelectedVehicle,
  SellerCartGroupData,
  SellerOrderPackage
} from '../types';
import { ALL_PRODUCTS } from '../data/products';
import { DEMO_ADDRESSES } from '../data/mockAddresses';

export class CheckoutService {
  /**
   * Group cart items by seller
   */
  static groupItemsBySeller(items: CartItem[]): SellerCartGroupData[] {
    const map = new Map<string, SellerCartGroupData>();

    items.forEach(item => {
      const seller = item.product.seller;
      const sellerId = seller.id;

      if (!map.has(sellerId)) {
        map.set(sellerId, {
          seller,
          items: [],
          subtotal: 0,
          itemCount: 0,
          shippingFee: 0,
          estimatedDelivery: item.product.deliveryTime || '2-3 Business Days'
        });
      }

      const group = map.get(sellerId)!;
      group.items.push(item);
      group.subtotal += item.product.price * item.quantity;
      group.itemCount += item.quantity;
    });

    // Determine shipping fee per seller group (Free if group subtotal >= 1500 or items >= 2, else 99)
    const result: SellerCartGroupData[] = [];
    map.forEach(group => {
      group.shippingFee = group.subtotal >= 1500 ? 0 : 99;
      result.push(group);
    });

    return result;
  }

  /**
   * Load mock items for specific customer scenarios
   */
  static getDemoScenarioItems(
    scenario:
      | 'multi-seller'
      | 'single-seller'
      | 'compatibility-warning'
      | 'low-stock'
      | 'out-of-stock'
      | 'empty'
  ): CartItem[] {
    if (scenario === 'empty') return [];

    const p1 = ALL_PRODUCTS.find(p => p.id === 'prod-001') || ALL_PRODUCTS[0]; // Bosch Brake Pad Set (Seller: Apex Mobility)
    const p2 = ALL_PRODUCTS.find(p => p.id === 'prod-004') || ALL_PRODUCTS[1]; // Brembo Disc Rotor (Seller: EuroPerformance)
    const p3 = ALL_PRODUCTS.find(p => p.id === 'prod-007') || ALL_PRODUCTS[2]; // TVS Girling Caliper (Seller: Sundaram Brakes)

    switch (scenario) {
      case 'multi-seller':
        return [
          { product: { ...p1 }, quantity: 1 },
          { product: { ...p2 }, quantity: 2 },
          { product: { ...p3 }, quantity: 1 }
        ];

      case 'single-seller':
        return [
          { product: { ...p1 }, quantity: 2 }
        ];

      case 'compatibility-warning':
        // Product compatible only with BMW or Mercedes, or with explicit warning
        const unverifiedProduct: Product = {
          ...p2,
          id: 'prod-unverified-demo',
          title: 'High-Performance Track Disc Rotor (BMW / Audi Spec)',
          compatibility: [
            { manufacturer: 'BMW', model: '3 Series (G20)', yearRange: '2019 - 2024' },
            { manufacturer: 'Audi', model: 'A4', yearRange: '2018 - 2024' }
          ]
        };
        return [
          { product: { ...p1 }, quantity: 1 },
          { product: unverifiedProduct, quantity: 1 }
        ];

      case 'low-stock':
        const lowStockProduct: Product = {
          ...p1,
          id: 'prod-low-stock-demo',
          title: 'Genuine Clutch Release Bearing (Limited Quantity)',
          inStock: true,
          stockCount: 2
        };
        return [
          { product: lowStockProduct, quantity: 2 },
          { product: { ...p2 }, quantity: 1 }
        ];

      case 'out-of-stock':
        const oosProduct: Product = {
          ...p3,
          id: 'prod-oos-demo',
          title: 'Front Hydraulic Caliper Assembly (Backordered)',
          inStock: false,
          stockCount: 0
        };
        return [
          { product: { ...p1 }, quantity: 1 },
          { product: oosProduct, quantity: 1 }
        ];

      default:
        return [{ product: p1, quantity: 1 }];
    }
  }

  /**
   * Create mock order confirmation object
   */
  static createMockConfirmedOrder(params: {
    items: CartItem[];
    address: DeliveryAddress;
    paymentDetails: PaymentDetails;
    vehicleContext?: SelectedVehicle | null;
  }): ConfirmedOrder {
    const { items, address, paymentDetails, vehicleContext } = params;
    const sellerGroups = this.groupItemsBySeller(items);

    const now = new Date();
    const orderDateStr = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `APH-2026-${randomSuffix}`;

    const courierPartners = ['Blue Dart Express', 'Delhivery Surface', 'DTDC Prime AutoLogistics'];

    const packages: SellerOrderPackage[] = sellerGroups.map((group, idx) => {
      const courier = courierPartners[idx % courierPartners.length];
      const trackingSuffix = Math.floor(1000000 + Math.random() * 9000000);
      const trackingId = `${courier.slice(0, 4).toUpperCase()}-${trackingSuffix}`;

      // Estimated delivery 2-4 days ahead
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2 + idx);
      const estDeliveryStr = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      return {
        packageId: `PKG-${group.seller.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        sellerId: group.seller.id,
        sellerName: group.seller.name,
        sellerCity: group.seller.city,
        sellerState: group.seller.state,
        sellerTier: group.seller.tier,
        sellerVerified: group.seller.verified,
        trackingId,
        courierPartner: courier,
        estimatedDelivery: estDeliveryStr,
        items: group.items,
        packageSubtotal: group.subtotal,
        packageShipping: group.shippingFee,
        status: 'ordered'
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalMRP = items.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
    const discountTotal = Math.max(0, totalMRP - subtotal);
    const shippingTotal = packages.reduce((acc, p) => acc + p.packageShipping, 0);
    const gstAmount = Math.round(subtotal * 0.18);
    const totalPayable = subtotal + shippingTotal;

    const paymentRef =
      paymentDetails.method === 'upi'
        ? `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`
        : paymentDetails.method === 'card'
        ? `TXN-CARD-${Math.floor(10000000 + Math.random() * 90000000)}`
        : paymentDetails.method === 'cod'
        ? `COD-PENDING-${Math.floor(10000 + Math.random() * 90000)}`
        : `NETBK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    return {
      orderId,
      orderDate: orderDateStr,
      customerAddress: address,
      vehicleContext: vehicleContext || null,
      packages,
      paymentMethod: paymentDetails.method,
      paymentRef,
      paymentStatus: paymentDetails.method === 'cod' ? 'Pending (Cash on Delivery)' : 'Paid',
      subtotal,
      discountTotal,
      shippingTotal,
      gstAmount,
      totalPayable
    };
  }

  static getDefaultAddress(): DeliveryAddress {
    return DEMO_ADDRESSES[0];
  }
}
