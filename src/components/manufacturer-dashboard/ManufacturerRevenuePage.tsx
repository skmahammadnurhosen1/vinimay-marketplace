import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Users,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import {
  RevenueAnalytics,
  RevenueDateFilter,
} from '../../types/manufacturer';
import { manufacturerService } from '../../services/manufacturerService';

interface ManufacturerRevenuePageProps {
  initialRevenue: RevenueAnalytics;
}

export const ManufacturerRevenuePage: React.FC<ManufacturerRevenuePageProps> = ({
  initialRevenue,
}) => {
  const [dateFilter, setDateFilter] = useState<RevenueDateFilter>(initialRevenue.dateFilter);
  const [revenue, setRevenue] = useState<RevenueAnalytics>(initialRevenue);
  const [customRange, setCustomRange] = useState({ start: '2026-08-01', end: '2026-09-22' });
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleFilterChange = (filter: RevenueDateFilter) => {
    if (filter === 'custom') {
      setShowCustomModal(true);
      return;
    }
    setDateFilter(filter);
    const updated = manufacturerService.getRevenueAnalytics(filter);
    setRevenue(updated);
  };

  const handleApplyCustom = () => {
    setShowCustomModal(false);
    setDateFilter('custom');
    const updated = manufacturerService.getRevenueAnalytics('custom');
    setRevenue(updated);
  };

  const dateFilterButtons: { id: RevenueDateFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#0284C7]" />
            <span>Revenue & Commercial Sales Intelligence</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Gross merchandise value, average order velocity, category profit margin ratios, and top-performing SKUs.
          </p>
        </div>

        {/* Date Filters Strip */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
          {dateFilterButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => handleFilterChange(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                dateFilter === btn.id
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Total Revenue</span>
          <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
            ₹{(revenue.totalRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +16.2% vs prior period
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Product Sales</span>
          <div className="text-xl sm:text-2xl font-black text-[#0284C7] font-mono">
            ₹{(revenue.productSalesAmount / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[10px] text-gray-500">Net after dealer discount</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Units Dispatched</span>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono">
            {revenue.totalUnitsSold.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-500">Fulfilled through certified dealers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Average Order Value (AOV)</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
            ₹{revenue.averageOrderValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-500">Across commercial workshop buyers</span>
        </div>
      </div>

      {/* Breakdown: Top Products vs Top Dealers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Top Products */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0284C7]" />
              <span>Revenue by Top-Performing SKUs</span>
            </h2>
            <span className="text-xs text-gray-500 font-mono">Ranked by GMV</span>
          </div>

          <div className="space-y-3">
            {revenue.revenueByTopProducts.map((prod, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#0284C7] font-bold text-[11px]">{prod.partNumber}</span>
                    <span className="text-[10px] text-gray-400 font-mono">#{idx + 1}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate max-w-xs">{prod.productTitle}</h3>
                  <span className="text-[10px] text-gray-500">{prod.units} units sold</span>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-gray-900 text-sm font-mono">
                    ₹{(prod.revenue / 100000).toFixed(2)}L
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">High Margin</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Top Dealers */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Revenue by Channel Partner Network</span>
            </h2>
            <span className="text-xs text-gray-500 font-mono">Authorized Distributors</span>
          </div>

          <div className="space-y-3">
            {revenue.revenueByTopDealers.map((dealer, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{dealer.dealerName}</div>
                  <span className="text-[10px] text-gray-500 block">{dealer.city} Territory</span>
                  <span className="text-[10px] text-purple-700 font-mono">{dealer.orderCount} master orders</span>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-gray-900 text-sm font-mono">
                    ₹{(dealer.revenue / 100000).toFixed(2)}L
                  </div>
                  <span className="text-[10px] text-[#0284C7] font-medium">Verified Partner</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0284C7]" />
              <span>Select Custom Financial Date Range</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Start Date:</label>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={e => setCustomRange({ ...customRange, start: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">End Date:</label>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={e => setCustomRange({ ...customRange, end: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                className="px-4 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
