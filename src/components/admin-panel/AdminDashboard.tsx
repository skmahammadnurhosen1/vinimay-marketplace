import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  RotateCcw,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { AdminPortalTab } from '../../types/admin';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminPortalTab) => void;
  metrics: {
    gmv: number;
    totalOrders: number;
    commission: number;
    activeSellers: number;
    totalSellers: number;
    registeredCustomers: number;
    totalCatalogSKUs: number;
    actionRequired: {
      pendingSellers: number;
      pendingProducts: number;
      pendingReturns: number;
      pendingWarranty: number;
      pendingRefunds: number;
      pendingSettlements: number;
    };
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  metrics,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#16181D] via-[#1E222A] to-[#16181D] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/30">
              OPERATIONAL HEALTH: 100%
            </span>
            <span className="text-xs text-gray-400">Realtime Engine Updated</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Marketplace Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Platform governance, seller KYC verification, multi-vendor order routing, and financial reconciliations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('sellers')}
            className="px-3.5 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Verify Sellers ({metrics.actionRequired.pendingSellers})</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold border border-gray-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Approve Catalog ({metrics.actionRequired.pendingProducts})</span>
          </button>
        </div>
      </div>

      {/* High-Level Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: GMV */}
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
            <span className="font-semibold">Gross Merchandise Value</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {formatCurrency(metrics.gmv)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% vs last quarter</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
            <span className="font-semibold">Master Orders Processed</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {metrics.totalOrders.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-gray-500 font-medium">
            Multi-vendor split consignments
          </div>
        </div>

        {/* KPI 3: Platform Commission */}
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
            <span className="font-semibold">Platform Fee Commission</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#C59B27]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {formatCurrency(metrics.commission)}
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-bold">
            Avg 8.5% - 11.5% take rate
          </div>
        </div>

        {/* KPI 4: Active Sellers */}
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
            <span className="font-semibold">Active Merchants</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {metrics.activeSellers} <span className="text-xs text-gray-700 font-normal">/ {metrics.totalSellers} total</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-600 font-bold">
            4 Merchant classifications
          </div>
        </div>
      </div>

      {/* "Action Required" Priority Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Action Required Matrix (Platform Attention Required)
            </h2>
          </div>
          <span className="text-xs text-gray-700 font-medium">Click card to resolve immediately</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Action 1 */}
          <button
            onClick={() => onNavigateTab('sellers')}
            className="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-left transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-amber-200/80 text-amber-900 text-xs font-bold">KYC</span>
                <span className="text-xs font-black text-amber-900 text-base">{metrics.actionRequired.pendingSellers}</span>
              </div>
              <p className="text-xs font-bold text-amber-950 group-hover:text-amber-800">Pending Seller KYC</p>
              <p className="text-[10px] text-amber-800 mt-0.5">Docs awaiting review</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-900">
              <span>Review Now</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => onNavigateTab('products')}
            className="p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 text-left transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-blue-200/80 text-blue-900 text-xs font-bold">SKU</span>
                <span className="text-xs font-black text-blue-900 text-base">{metrics.actionRequired.pendingProducts}</span>
              </div>
              <p className="text-xs font-bold text-blue-950 group-hover:text-blue-800">Catalog Approvals</p>
              <p className="text-[10px] text-blue-800 mt-0.5">OEM / Genuine checks</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-900">
              <span>Inspect SKUs</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => onNavigateTab('returns')}
            className="p-3 rounded-xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/80 text-left transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-rose-200/80 text-rose-900 text-xs font-bold">RMA</span>
                <span className="text-xs font-black text-rose-900 text-base">{metrics.actionRequired.pendingReturns}</span>
              </div>
              <p className="text-xs font-bold text-rose-950 group-hover:text-rose-800">Returns Pending</p>
              <p className="text-[10px] text-rose-800 mt-0.5">Verification required</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-rose-900">
              <span>View Returns</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => onNavigateTab('warranty')}
            className="p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/80 text-left transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-purple-200/80 text-purple-900 text-xs font-bold">WAR</span>
                <span className="text-xs font-black text-purple-900 text-base">{metrics.actionRequired.pendingWarranty}</span>
              </div>
              <p className="text-xs font-bold text-purple-950 group-hover:text-purple-800">Warranty Claims</p>
              <p className="text-[10px] text-purple-800 mt-0.5">Technical evaluation</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-purple-900">
              <span>Inspect Claims</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* Action 5 */}
          <button
            onClick={() => onNavigateTab('refunds')}
            className="p-3 rounded-xl bg-orange-50/70 hover:bg-orange-100/70 border border-orange-200/80 text-left transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-orange-200/80 text-orange-900 text-xs font-bold">PAY</span>
                <span className="text-xs font-black text-orange-900 text-base">{metrics.actionRequired.pendingRefunds}</span>
              </div>
              <p className="text-xs font-bold text-orange-950 group-hover:text-orange-800">Refund Payouts</p>
              <p className="text-[10px] text-orange-800 mt-0.5">Awaiting authorization</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-orange-900">
              <span>Review Queue</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* Action 6 */}
          <button
            onClick={() => onNavigateTab('finance')}
            className="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 text-left transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-emerald-200/80 text-emerald-900 text-xs font-bold">SETL</span>
                <span className="text-xs font-black text-emerald-900 text-base">{metrics.actionRequired.pendingSettlements}</span>
              </div>
              <p className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800">Settlements Due</p>
              <p className="text-[10px] text-emerald-800 mt-0.5">Merchant bank transfers</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-900">
              <span>Execute Payouts</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        </div>
      </div>

      {/* Analytics Charts & Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* GMV Velocity Trajectory */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900">GMV Trajectory & Monthly Revenue Velocity</h3>
              <p className="text-xs text-gray-700">Gross monthly transactions (₹ Lakhs)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              FY 2026 Target: 112%
            </span>
          </div>

          {/* Responsive CSS Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-gray-100">
            {[
              { month: 'Apr', val: 18, gmv: '₹18L' },
              { month: 'May', val: 24, gmv: '₹24L' },
              { month: 'Jun', val: 29, gmv: '₹29L' },
              { month: 'Jul', val: 38, gmv: '₹38L' },
              { month: 'Aug', val: 45, gmv: '₹45L' },
              { month: 'Sep', val: 54, gmv: '₹54L', active: true },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition">
                  {bar.gmv}
                </span>
                <div
                  className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                    bar.active
                      ? 'bg-gradient-to-t from-[#C59B27] to-[#e4be52] shadow-md'
                      : 'bg-gray-200 group-hover:bg-gray-300'
                  }`}
                  style={{ height: `${(bar.val / 60) * 100}%` }}
                />
                <span className={`text-[11px] font-semibold ${bar.active ? 'text-[#C59B27] font-bold' : 'text-gray-700'}`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-700">
            <span>High-velocity months driven by B2B workshops & monsoon service cycles</span>
            <span className="font-bold text-gray-800">Peak Day: ₹2.4 Lakhs</span>
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Catalog Revenue Share</h3>
            <p className="text-xs text-gray-700 mb-4">Volume breakdown across major systems</p>

            <div className="space-y-3">
              {[
                { name: 'Brake Systems', share: 34, color: 'bg-emerald-500' },
                { name: 'Clutch & Flywheel', share: 28, color: 'bg-[#C59B27]' },
                { name: 'Suspension & Steering', share: 22, color: 'bg-blue-500' },
                { name: 'Gearbox & Transmission', share: 10, color: 'bg-purple-500' },
                { name: 'Differential & Axles', share: 6, color: 'bg-orange-500' },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">{cat.name}</span>
                    <span className="font-bold text-gray-900">{cat.share}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-700 flex items-center justify-between">
            <span>Fastest growing: Brake Rotors (+42%)</span>
            <button
              onClick={() => onNavigateTab('products')}
              className="font-bold text-[#C59B27] hover:underline cursor-pointer"
            >
              Manage &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
