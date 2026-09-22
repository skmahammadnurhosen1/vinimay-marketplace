import { manufacturerRepository } from './manufacturer.repository.js';
import { productRepository } from '../products/product.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { returnRepository } from '../returns/return.repository.js';
import { warrantyRepository } from '../warranty/warranty.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { ManufacturerAnalyticsReport } from '../../types/manufacturer.js';

export class ManufacturerService {
  async getManufacturerForUser(userId: string) {
    const mfg = await manufacturerRepository.findByUserId(userId);
    if (!mfg) {
      throw new Error('Manufacturer profile not found for this user account');
    }
    return mfg;
  }

  async getManufacturerProducts(userId: string) {
    const mfg = await this.getManufacturerForUser(userId);
    const brands = mfg.authorizedBrands.map((b) => b.toLowerCase());

    const allProducts = await productRepository.findAll();
    return allProducts.filter((p: any) => brands.includes(p.brand.toLowerCase()));
  }

  async getManufacturerOrders(userId: string) {
    const mfg = await this.getManufacturerForUser(userId);
    const brands = mfg.authorizedBrands.map((b) => b.toLowerCase());

    const allOrders = await orderRepository.findAllParentOrders();
    const matchingOrders: any[] = [];

    for (const order of allOrders) {
      const subOrders = await orderRepository.findSubOrdersByParentId(order.id);
      const mfgItems: any[] = [];

      for (const sub of subOrders) {
        for (const item of sub.items) {
          if (brands.includes(item.brand.toLowerCase())) {
            mfgItems.push({
              ...item,
              sellerName: sub.sellerName,
              subOrderId: sub.id,
            });
          }
        }
      }

      if (mfgItems.length > 0) {
        matchingOrders.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          status: order.status,
          items: mfgItems,
        });
      }
    }

    return matchingOrders;
  }

  async getManufacturerAnalytics(userId: string): Promise<ManufacturerAnalyticsReport> {
    const mfg = await this.getManufacturerForUser(userId);
    const products = await this.getManufacturerProducts(userId);
    const productIds = new Set(products.map((p: any) => p.id));

    const orders = await this.getManufacturerOrders(userId);

    let totalUnitsSold = 0;
    let totalRevenue = 0;
    const productStats = new Map<string, { unitsSold: number; revenue: number; name: string; brand: string }>();
    const dealerMap = new Map<string, { sellerName: string; unitsSold: number; sellerTier: string }>();

    for (const ord of orders) {
      for (const item of ord.items) {
        const itemPrice =
          item.totalPrice !== undefined
            ? item.totalPrice
            : item.unitPrice !== undefined
            ? item.unitPrice * item.quantity
            : (item.price || 0) * item.quantity;
        totalUnitsSold += item.quantity;
        totalRevenue += itemPrice;

        const pStat = productStats.get(item.productId) || {
          unitsSold: 0,
          revenue: 0,
          name: item.title || item.productName || 'Product',
          brand: item.brand,
        };
        pStat.unitsSold += item.quantity;
        pStat.revenue += itemPrice;
        productStats.set(item.productId, pStat);

        const dStat = dealerMap.get(item.sellerId) || {
          sellerName: item.sellerName || 'Auto Parts Dealer',
          unitsSold: 0,
          sellerTier: 'Retailer',
        };
        dStat.unitsSold += item.quantity;
        dealerMap.set(item.sellerId, dStat);
      }
    }

    // Top selling products
    const topSellingProducts = Array.from(productStats.entries())
      .map(([productId, stat]) => ({
        productId,
        productName: stat.name,
        brand: stat.brand,
        unitsSold: stat.unitsSold,
        revenue: stat.revenue,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10);

    // Channel inventory
    let channelStockUnits = 0;
    let channelStockValue = 0;
    for (const p of products) {
      const inv = await inventoryRepository.findByProductId(p.id);
      if (inv) {
        channelStockUnits += inv.availableStock;
        channelStockValue += inv.availableStock * p.price;
      }
    }

    // Dealers with stock
    const dealers = await Promise.all(
      Array.from(dealerMap.entries()).map(async ([sellerId, stat]) => {
        const seller = await sellerRepository.findById(sellerId);
        return {
          sellerId,
          sellerName: seller?.businessName || stat.sellerName,
          sellerTier: seller?.sellerType || stat.sellerTier,
          unitsSold: stat.unitsSold,
          stockUnits: Math.round(channelStockUnits / (dealerMap.size || 1)),
        };
      })
    );

    // Returns
    const allReturns = await returnRepository.findAll();
    const mfgReturns = allReturns.filter((r: any) => productIds.has(r.productId));
    const returnsCount = mfgReturns.length;
    const returnRatePercent =
      totalUnitsSold > 0 ? Math.round((returnsCount / totalUnitsSold) * 1000) / 10 : 0;

    // Warranty
    const allClaims = await warrantyRepository.findAll();
    const mfgClaims = allClaims.filter((w: any) => productIds.has(w.productId));
    const warrantyClaimsCount = mfgClaims.length;
    const warrantyClaimRatePercent =
      totalUnitsSold > 0 ? Math.round((warrantyClaimsCount / totalUnitsSold) * 1000) / 10 : 0;

    // Demand Insights
    const categoriesMap = new Map<string, number>();
    for (const p of products) {
      categoriesMap.set(p.category, (categoriesMap.get(p.category) || 0) + 1);
    }
    const demandInsights = Array.from(categoriesMap.entries()).map(([category, count]) => ({
      category,
      demandLevel: (count > 2 ? 'HIGH' : count > 1 ? 'MEDIUM' : 'EMERGING') as 'HIGH' | 'MEDIUM' | 'EMERGING',
    }));

    return {
      manufacturerId: mfg.id,
      name: mfg.name,
      authorizedBrands: mfg.authorizedBrands,
      totalProducts: products.length,
      totalUnitsSold,
      totalRevenue,
      totalOrders: orders.length,
      topSellingProducts,
      dealers,
      returnsCount,
      returnRatePercent,
      warrantyClaimsCount,
      warrantyClaimRatePercent,
      channelStockUnits,
      channelStockValue,
      demandInsights,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const manufacturerService = new ManufacturerService();
