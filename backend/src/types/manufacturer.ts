export interface ManufacturerEntity {
  id: string; // e.g. 'bosch-india', 'lumax-automotive'
  userId?: string;
  name: string;
  code: string;
  originCountry: string;
  authorizedBrands: string[]; // e.g. ['Bosch', 'Lumax']
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  directSalesEnabled: boolean; // false (future capability placeholder)
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturerAnalyticsReport {
  manufacturerId: string;
  name: string;
  authorizedBrands: string[];
  totalProducts: number;
  totalUnitsSold: number;
  totalRevenue: number;
  totalOrders: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    brand: string;
    unitsSold: number;
    revenue: number;
  }>;
  dealers: Array<{
    sellerId: string;
    sellerName: string;
    sellerTier: string;
    unitsSold: number;
    stockUnits: number;
  }>;
  returnsCount: number;
  returnRatePercent: number;
  warrantyClaimsCount: number;
  warrantyClaimRatePercent: number;
  channelStockUnits: number;
  channelStockValue: number;
  demandInsights: Array<{
    category: string;
    demandLevel: 'HIGH' | 'MEDIUM' | 'EMERGING';
  }>;
  generatedAt: string;
}
