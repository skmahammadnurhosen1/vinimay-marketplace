import React from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldAlert,
  IndianRupee,
  Layers,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Truck,
  TrendingUp,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { SellerKPIMetrics, SellerOrder, SellerNavTab, SellerReturnItem, SellerWarrantyClaim } from '../../types/seller';

interface SellerDashboardProps {
  metrics: SellerKPIMetrics;
  recentOrders: SellerOrder[];
  pendingReturns: SellerReturnItem[];
  pendingWarranties: SellerWarrantyClaim[];
  salesChart: { month: string; gross: number; commission: number; net: number }[];
  onSelectTab: (tab: SellerNavTab) => void;
  onSelectOrder: (order: SellerOrder) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  metrics,
  recentOrders,
  pendingReturns,
  pendingWarranties,
  salesChart,
  onSelectTab,
  onSelectOrder
}) => {
  // Pending actions
  const pendingOrders = recentOrders.filter(
    o => o.shipmentState === 'ordered' || o.shipmentState === 'packed'
  );

  return (
    <div className="space-y-6">
      {/* 1. TOP KPI METRICS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Performance Metrics & Summary
          </h2>
          <span className="text-[11px] text-stone-400 font-medium">Real-time sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {/* Total Sales */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[11px] font-medium text-stone-500">Gross Sales</span>
              <IndianRupee className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-stone-950 font-mono">
              ₹{(metrics.totalSales / 100000).toFixed(2)}L
            </div>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +18.4% this month
            </span>
          </div>

          {/* Net Settlement */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[11px] font-medium text-stone-500">Net Settlement</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono">
              ₹{(metrics.netSettlement / 100000).toFixed(2)}L
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              After 10% platform fee
            </span>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[11px] font-medium text-stone-500">Total Orders</span>
              <Package className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-stone-950 font-mono">
              {metrics.totalOrders.toLocaleString()}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">All consignments</span>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/40 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-[11px] font-bold text-amber-900">Pending Dispatch</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-amber-950 font-mono">
              {metrics.pendingOrders}
            </div>
            <span className="text-[10px] text-amber-800 font-bold">Action required</span>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[11px] font-medium text-stone-500">Active SKUs</span>
              <ShoppingBag className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-stone-950 font-mono">
              {metrics.totalProducts}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">100% verified</span>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[11px] font-medium text-stone-500">Low Stock SKUs</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-rose-600 font-mono">
              {metrics.lowStockCount}
            </div>
            <span className="text-[10px] text-rose-600 font-semibold">Restock alert</span>
          </div>
        </div>
      </div>

      {/* 2. ACTION REQUIRED SECTION */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950">
              Action Required Items ({pendingOrders.length + pendingReturns.length + pendingWarranties.length})
            </h3>
          </div>
          <span className="text-[11px] text-amber-800 font-medium hidden sm:inline">
            Fulfill quickly to maintain 98.6% dispatch rating
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Pending Dispatches */}
          <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Orders to Pack / Dispatch</span>
              </span>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                {pendingOrders.length}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Consignments awaiting packing slip generation and courier pickup allocation.
            </p>
            <button
              type="button"
              onClick={() => onSelectTab('orders')}
              className="text-xs font-bold text-[#C59B27] hover:text-[#9E7A1C] hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Process Orders</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Pending Returns */}
          <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                <span>Return Requests</span>
              </span>
              <span className="text-xs font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full font-mono">
                {pendingReturns.length}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Customer returns awaiting merchant verification before courier reverse pickup.
            </p>
            <button
              type="button"
              onClick={() => onSelectTab('returns')}
              className="text-xs font-bold text-[#C59B27] hover:text-[#9E7A1C] hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Review Returns</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Warranty Claims */}
          <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Warranty Claims</span>
              </span>
              <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-mono">
                {pendingWarranties.length}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Technical defect reviews with uploaded inspection photos and video evidence.
            </p>
            <button
              type="button"
              onClick={() => onSelectTab('warranty')}
              className="text-xs font-bold text-[#C59B27] hover:text-[#9E7A1C] hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Evaluate Claims</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SALES OVERVIEW CHART & SETTLEMENT SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sales Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C59B27]" />
                <span>Monthly Revenue & Commission Trends</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Gross sales volume vs 10% marketplace commission & net payout
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16181D]" /> Gross
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C59B27]" /> Net Payout
              </span>
            </div>
          </div>

          {/* Responsive Bar Chart */}
          <div className="pt-2">
            <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 border-b border-stone-200 pb-2">
              {salesChart.map((c, idx) => {
                const maxGross = 700000;
                const grossHeightPct = (c.gross / maxGross) * 100;
                const netHeightPct = (c.net / maxGross) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-full">
                      {/* Gross Bar */}
                      <div
                        className="w-1/2 bg-[#16181D] rounded-t-sm transition-all group-hover:opacity-80"
                        style={{ height: `${grossHeightPct}%` }}
                        title={`Gross: ₹${c.gross.toLocaleString('en-IN')}`}
                      />
                      {/* Net Bar */}
                      <div
                        className="w-1/2 bg-[#C59B27] rounded-t-sm transition-all group-hover:opacity-80"
                        style={{ height: `${netHeightPct}%` }}
                        title={`Net Payout: ₹${c.net.toLocaleString('en-IN')}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-stone-500 truncate text-center">
                      {c.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2">
              <span>Standard 7-day settlement cycle after verified delivery</span>
              <button
                type="button"
                onClick={() => onSelectTab('sales_settlement')}
                className="font-bold text-[#C59B27] hover:underline"
              >
                View Detailed Ledger →
              </button>
            </div>
          </div>
        </div>

        {/* Right: Settlement Snapshot (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>Settlement Account</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified
              </span>
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-stone-400 text-[10px] block">Primary Bank</span>
                <span className="font-bold text-stone-900 block">HDFC Bank Ltd</span>
                <span className="font-mono text-stone-600 block">A/c: •••••••• 2041</span>
                <span className="text-stone-500 font-mono text-[10px]">IFSC: HDFC0000129</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Upcoming Settlement:</span>
                  <span className="font-bold text-stone-950 font-mono">₹3,748.50</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Scheduled Date:</span>
                  <span className="font-semibold text-stone-800">23 Sep 2026</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Last UTR:</span>
                  <span className="font-mono text-stone-700 text-[10px]">HDFC262640192841</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('sales_settlement')}
            className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Manage Settlement & Invoices
          </button>
        </div>
      </div>

      {/* 4. RECENT ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Recent Customer Consignments</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Orders containing items from your store catalog
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('orders')}
            className="text-xs font-bold text-[#C59B27] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-xs">
            <thead className="bg-stone-50 text-stone-700 font-bold">
              <tr>
                <th className="px-4 py-3 text-left">Package / Order ID</th>
                <th className="px-4 py-3 text-left">Customer Destination</th>
                <th className="px-4 py-3 text-left">Spare Part Items</th>
                <th className="px-4 py-3 text-left">Order Value</th>
                <th className="px-4 py-3 text-left">Shipment Progress</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {recentOrders.map(order => {
                const statusStyles: Record<string, string> = {
                  ordered: 'bg-amber-50 text-amber-900 border-amber-200',
                  packed: 'bg-blue-50 text-blue-900 border-blue-200',
                  shipped: 'bg-purple-50 text-purple-900 border-purple-200',
                  out_for_delivery: 'bg-indigo-50 text-indigo-900 border-indigo-200',
                  delivered: 'bg-emerald-50 text-emerald-900 border-emerald-200'
                };

                return (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-stone-950 block">{order.id}</span>
                      <span className="text-[10px] text-stone-400 block">{order.orderDate}</span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-700">
                      <span className="font-semibold block">{order.customerSummary.maskedName}</span>
                      <span className="text-[11px] text-stone-500">
                        {order.customerSummary.city}, {order.customerSummary.state}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-700">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.items[0]?.image}
                          alt=""
                          className="w-7 h-7 rounded-md object-contain border border-stone-200 bg-stone-50 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-semibold text-stone-900 truncate block">
                            {order.items[0]?.title}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            Qty: {order.items[0]?.quantity} • PN: {order.items[0]?.partNumber}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span className="font-bold text-stone-950 block">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Net: ₹{order.netPayout.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          statusStyles[order.shipmentState] || 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {order.shipmentState.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5 truncate max-w-[140px]">
                        {order.courierName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden divide-y divide-stone-100">
          {recentOrders.map(order => (
            <div key={order.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-xs text-stone-950 block">
                    {order.id}
                  </span>
                  <span className="text-[10px] text-stone-400">{order.orderDate}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800">
                  {order.shipmentState.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <img
                  src={order.items[0]?.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-contain border border-stone-200 bg-stone-50 p-1 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-stone-900 line-clamp-1 block">
                    {order.items[0]?.title}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Destination: {order.customerSummary.city} ({order.customerSummary.state})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] block">Order Amount</span>
                  <span className="font-mono font-bold text-stone-950">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectOrder(order)}
                  className="px-3 py-1.5 bg-[#16181D] text-white text-xs font-bold rounded-lg"
                >
                  Manage Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
