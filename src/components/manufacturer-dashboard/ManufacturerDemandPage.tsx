import React from 'react';
import {
  TrendingUp,
  Search,
  MapPin,
  Car,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CustomerDemandAnalytics,
  ManufacturerPortalTab,
} from '../../types/manufacturer';

interface ManufacturerDemandPageProps {
  demand: CustomerDemandAnalytics;
  onNavigateTab: (tab: ManufacturerPortalTab) => void;
  onOpenAddProduct: () => void;
}

export const ManufacturerDemandPage: React.FC<ManufacturerDemandPageProps> = ({
  demand,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#0284C7]" />
            <span>Marketplace Customer & Fleet Demand Intelligence</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Analyze parts search frequency, vehicle-level compatibility inquiries, and regional demand heat maps.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('inventory')}
          className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0284C7] text-xs font-semibold border border-gray-200 transition cursor-pointer flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Production Restock Signals</span>
        </button>
      </div>

      {/* 1. Top Demanded Parts & Search Volume */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-[#0284C7]" />
              <span>Highest Velocity Parts & Search Queries (Last 30 Days)</span>
            </h2>
            <p className="text-xs text-gray-500">High search frequency vs unmet stock demand</p>
          </div>
          <span className="text-xs font-mono text-gray-500">Indexed from Pan-India Search Bar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {demand.topDemandedParts.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80 hover:border-[#0284C7]/60 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0284C7]">{item.partNumber}</span>
                  <span className="text-[10px] text-gray-500 block">OEM: {item.oemNumber}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-mono text-[10px] font-bold border border-sky-200">
                  Index: {item.velocityScore}/100
                </span>
              </div>

              <h3 className="text-xs font-semibold text-gray-900 line-clamp-2">{item.productTitle}</h3>

              <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-white border border-gray-200 text-center text-[10px]">
                <div>
                  <span className="text-gray-500 block">Searches</span>
                  <span className="font-bold text-gray-900 font-mono">{item.searchCount30d.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Units Req.</span>
                  <span className="font-bold text-emerald-600 font-mono">{item.unitsRequested}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Unmet</span>
                  <span className={`font-bold font-mono ${item.unmetStockDemand > 50 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {item.unmetStockDemand}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Grid: Vehicle Demand vs Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Demand */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Demand by Vehicle Fitment Model</span>
              </h2>
              <p className="text-xs text-gray-500">Total vehicle search inquiries and order conversions</p>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Commercial Heavy Surge
            </span>
          </div>

          <div className="space-y-3">
            {demand.vehicleDemand.map((v, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{v.make} {v.model}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-200/80 text-gray-700 capitalize font-medium">
                      {v.vehicleType}
                    </span>
                  </div>
                  <span className="font-mono text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +{v.trendPercentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>{v.searchCount.toLocaleString('en-IN')} vehicle inquiries</span>
                  <span>{v.orderCount.toLocaleString('en-IN')} parts orders</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, Math.round((v.searchCount / 15000) * 100))}%` }}
                    className="h-full bg-gradient-to-r from-[#0284C7] to-emerald-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>Regional Demand Distribution (Pan-India)</span>
              </h2>
              <p className="text-xs text-gray-500">Demand heat map across state industrial clusters</p>
            </div>
          </div>

          <div className="space-y-3">
            {demand.regionalDemand.map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{r.state}</span>
                    <span className="text-gray-500 text-[11px] ml-1.5">({r.region})</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-gray-500 text-[11px]">{r.activeOrders} orders</span>
                    <span className="font-bold text-purple-600 w-12 text-right">{r.percentage}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${r.percentage * 2.5}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Regional Recommendation */}
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 space-y-1">
            <div className="font-bold text-purple-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Logistics Buffer Insight</span>
            </div>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              Western corridor (Maharashtra & Gujarat) accounts for 40.7% of total monthly inquiries. Increasing safety buffer stock in Pune Chakan warehouse recommended.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Category Growth & Monthly Trend */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-xs p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0284C7]" />
              <span>Category Inquiries vs Unfulfilled Demand</span>
            </h2>
            <p className="text-xs text-gray-500">Signals for catalog expansion and OEM tooling allocation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {demand.categoryDemand.map((cat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2"
            >
              <span className="font-bold text-gray-900 text-xs block truncate">{cat.category}</span>
              <div className="text-lg font-black text-[#0284C7] font-mono">
                {cat.inquiryCount.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-gray-200 text-gray-500">
                <span className="text-emerald-600 font-semibold">+{cat.growthMoM}% MoM</span>
                <span className="text-amber-600 font-mono">{cat.unfulfilledInquiries} unmet</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
