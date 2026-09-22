import React from 'react';
import {
  PackageCheck,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Compass,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Sparkles,
  Layers,
  Wrench,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  ManufacturerKPISummary,
  ManufacturerPortalTab,
  CustomerDemandAnalytics,
  RevenueAnalytics,
  ManufacturerBrandProfile,
} from '../../types/manufacturer';

interface ManufacturerOverviewPageProps {
  kpis: ManufacturerKPISummary;
  brand: ManufacturerBrandProfile;
  demand: CustomerDemandAnalytics;
  revenue: RevenueAnalytics;
  onNavigateTab: (tab: ManufacturerPortalTab) => void;
  onOpenAddProduct: () => void;
}

export const ManufacturerOverviewPage: React.FC<ManufacturerOverviewPageProps> = ({
  kpis,
  brand,
  demand,
  revenue,
  onNavigateTab,
  onOpenAddProduct,
}) => {
  const kpiCards = [
    {
      label: 'Total Products',
      value: kpis.totalProducts.toString(),
      sub: `${kpis.activeProducts} active in catalogue`,
      icon: Package,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      tab: 'products' as ManufacturerPortalTab,
    },
    {
      label: 'Active Products',
      value: kpis.activeProducts.toString(),
      sub: '98.5% uptime listing SLA',
      icon: PackageCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      tab: 'products' as ManufacturerPortalTab,
    },
    {
      label: 'Total Orders',
      value: kpis.totalOrders.toLocaleString('en-IN'),
      sub: '+14% vs last quarter',
      icon: ShoppingCart,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      tab: 'orders' as ManufacturerPortalTab,
    },
    {
      label: 'Sales Revenue',
      value: `₹${(kpis.salesRevenue / 100000).toFixed(2)} L`,
      sub: 'Gross GMV generated',
      icon: DollarSign,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      tab: 'revenue' as ManufacturerPortalTab,
    },
    {
      label: 'Units Sold',
      value: kpis.unitsSold.toLocaleString('en-IN'),
      sub: 'Pan-India dispatches',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      tab: 'orders' as ManufacturerPortalTab,
    },
    {
      label: 'Dealer / Seller Count',
      value: kpis.dealerCount.toString(),
      sub: 'Certified authorized partners',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      tab: 'dealers' as ManufacturerPortalTab,
    },
    {
      label: 'Customer Demand',
      value: `${kpis.customerDemandIndex}/100`,
      sub: 'High regional inquiry score',
      icon: Compass,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      tab: 'demand' as ManufacturerPortalTab,
    },
    {
      label: 'Pending Returns',
      value: kpis.pendingReturns.toString(),
      sub: 'Requires RMA disposition',
      icon: RotateCcw,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      tab: 'returns-warranty' as ManufacturerPortalTab,
    },
    {
      label: 'Warranty Claims',
      value: kpis.warrantyClaims.toString(),
      sub: '8-field dossier awaiting decision',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      tab: 'returns-warranty' as ManufacturerPortalTab,
    },
    {
      label: 'Low Stock Products',
      value: kpis.lowStockProducts.toString(),
      sub: 'Stock below safety threshold',
      icon: AlertTriangle,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      tab: 'inventory' as ManufacturerPortalTab,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Brand Executive Welcome Banner (Consistent with Admin/B2B top hero cards) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#16181D] via-[#1E222A] to-[#16181D] border border-gray-800 p-4 sm:p-6 shadow-sm relative overflow-hidden text-white">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-[#38BDF8]">
                {brand.verificationStatus}
              </span>
              <span className="text-xs text-gray-400 font-mono">CIN: {brand.cinNumber}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {brand.brandName} • Operational Console
            </h1>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
              {brand.tagline} Registered plant facilities active across {brand.plantLocations.map(p => p.facilityName.split('-')[0]).join(', ')}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onOpenAddProduct}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-semibold shadow-md shadow-[#0284C7]/20 transition cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>+ Add Part Listing</span>
            </button>
            <button
              onClick={() => onNavigateTab('revenue')}
              className="px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>View Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Priority Action Matrix Strip (Clean White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-amber-300 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alert</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">1 Item</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">Synchronizer Ring #0986TC7712 down to 15 available units.</p>
          <span className="text-xs text-amber-600 font-bold group-hover:underline flex items-center gap-1 mt-3">
            Schedule production batch <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('returns-warranty')}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-rose-300 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-rose-600 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Warranty Adjudication</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">1 Claim</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">Claim #WAR-MFG-504 on Tata Ace brake cylinder awaiting verdict.</p>
          <span className="text-xs text-rose-600 font-bold group-hover:underline flex items-center gap-1 mt-3">
            Inspect evidence dossier <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('demand')}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-sky-300 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-sky-600 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Demand Surge (MH)</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">+34% WoW</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">Over 8,420 monthly searches for Front Brake Pads in Western corridor.</p>
          <span className="text-xs text-sky-600 font-bold group-hover:underline flex items-center gap-1 mt-3">
            View vehicle demand <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('dealers')}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-300 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-purple-600 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Top Performer SLA</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">4.95 ★</span>
          </div>
          <p className="text-xs text-gray-700 font-medium">Northern Fleet Spares processed 4,200 units with 1.1% return rate.</p>
          <span className="text-xs text-purple-600 font-bold group-hover:underline flex items-center gap-1 mt-3">
            Review dealer performance <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 3. 10 Core KPI Cards Grid (Clean White Style) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span>Marketplace Performance Metrics</span>
            <span className="text-[11px] font-normal text-gray-500 capitalize">(Realtime Engine Updated)</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateTab(kpi.tab)}
                className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-[#0284C7]/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600 truncate">{kpi.label}</span>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-gray-500 truncate mt-1">
                  {kpi.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Responsive Analytics & Charts Section (Clean White Surfaces) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sales & Orders Velocity */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BarChart3Icon className="w-4 h-4 text-[#0284C7]" />
                <span>Monthly Sales & Order Trend</span>
              </h3>
              <p className="text-xs text-gray-500">Past 6 months revenue vs target trajectory</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              +18.4% YoY
            </span>
          </div>

          {/* Bar Chart */}
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-gray-200 pb-2">
              {revenue.monthlyRevenueTrend.map((m, i) => {
                const heightPct = Math.round((m.revenue / 2500000) * 100);
                const targetPct = Math.round((m.target / 2500000) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg border border-gray-700 whitespace-nowrap z-20 pointer-events-none">
                      ₹{(m.revenue / 100000).toFixed(2)}L ({m.units} units)
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[22px] bg-gradient-to-t from-[#0284C7] to-[#38BDF8] rounded-t-sm group-hover:brightness-110 transition-all shadow-xs"
                      />
                      <div
                        style={{ height: `${targetPct}%` }}
                        className="w-1.5 bg-gray-300 rounded-full"
                        title={`Target: ₹${(m.target / 100000).toFixed(2)}L`}
                      />
                    </div>
                    <span className="text-[11px] text-gray-600 font-semibold">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#0284C7]" />
                  <span className="text-gray-700 font-medium">Actual Revenue</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 rounded bg-gray-300" />
                  <span className="text-gray-500">Target</span>
                </span>
              </div>
              <span className="font-mono text-gray-800 font-bold">Peak: ₹22.8 Lakhs (Mar)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Category Revenue Breakdown */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Revenue by Mechanical Assembly</span>
              </h3>
              <p className="text-xs text-gray-500">Distribution across 5 Core Phase-1 Categories</p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#0284C7] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Catalogue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {revenue.revenueByCategory.map((cat, i) => {
              const colors = [
                'bg-sky-500',
                'bg-indigo-500',
                'bg-emerald-500',
                'bg-amber-500',
                'bg-rose-500',
              ];
              const color = colors[i % colors.length];
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-800">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-mono">₹{(cat.revenue / 100000).toFixed(2)}L</span>
                      <span className="font-bold text-gray-900 w-8 text-right">{cat.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className={`h-full ${color} rounded-full transition-all duration-300`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Customer Demand by Vehicle Model */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Customer Demand by Vehicle Application</span>
              </h3>
              <p className="text-xs text-gray-500">Highest search & order conversions by model</p>
            </div>
            <button
              onClick={() => onNavigateTab('demand')}
              className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {demand.vehicleDemand.slice(0, 5).map((v, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs hover:bg-gray-100/70 transition"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 truncate">{v.make} {v.model}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-200 text-gray-700 capitalize font-medium">
                        {v.vehicleType}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {v.searchCount.toLocaleString('en-IN')} inquiries • {v.orderCount.toLocaleString('en-IN')} orders
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs shrink-0 ml-2">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{v.trendPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Quality & Returns Ratio Stability */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-600" />
                <span>Quality & Reverse Logistics Oversight</span>
              </h3>
              <p className="text-xs text-gray-500">RMA Returns rate vs technical warranty frequency</p>
            </div>
            <button
              onClick={() => onNavigateTab('returns-warranty')}
              className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Claims</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] text-gray-500 font-mono block">PLATFORM RETURN RATE</span>
              <div className="text-2xl font-black text-emerald-600">1.42%</div>
              <span className="text-[11px] text-gray-500 block">SLA Threshold &lt; 2.50%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] text-gray-500 font-mono block">WARRANTY INCIDENCE</span>
              <div className="text-2xl font-black text-sky-600">0.28%</div>
              <span className="text-[11px] text-gray-500 block">3 active claims in review</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-gray-800 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>OEM Quality Assurance Passed</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              All 5 mechanical categories comply with IATF 16949 / CMVR automotive manufacturing standards. Counterfeit inspection active on genuine & OEM parts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function ArrowRight(props: { className?: string }) {
  return (
    <svg className={props.className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function BarChart3Icon(props: { className?: string }) {
  return (
    <svg className={props.className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
