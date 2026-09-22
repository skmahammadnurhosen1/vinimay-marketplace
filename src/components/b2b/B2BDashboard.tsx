import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Percent,
  Receipt,
  Layers,
  RotateCcw,
  Wrench,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { B2BPortalTab, B2BAccountType, B2BOrder } from '../../types/b2b';
import { ALL_PRODUCTS } from '../../data/products';
import { b2bService } from '../../services/b2bService';

interface B2BDashboardProps {
  onNavigateTab: (tab: B2BPortalTab) => void;
  activeAccountType: B2BAccountType;
  orders: B2BOrder[];
  onQuickReorder: (order: B2BOrder) => void;
  onOpenOrderModal: (order: B2BOrder) => void;
}

export const B2BDashboard: React.FC<B2BDashboardProps> = ({
  onNavigateTab,
  activeAccountType,
  orders,
  onQuickReorder,
  onOpenOrderModal,
}) => {
  const profile = b2bService.getActiveProfile();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const businessName =
    activeAccountType === 'garage'
      ? (profile as any).businessName
      : (profile as any).companyName;

  const frequentParts = ALL_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Business Profile Summary */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#16181D] via-[#1E222A] to-[#16181D] border border-gray-800 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C59B27] text-gray-950 flex items-center gap-1">
              {activeAccountType === 'garage' ? (
                <>
                  <Wrench className="w-3 h-3" />
                  GARAGE PROCUREMENT ACCOUNT
                </>
              ) : (
                <>
                  <Truck className="w-3 h-3" />
                  COMMERCIAL FLEET ACCOUNT
                </>
              )}
            </span>
            <span className="text-xs text-gray-400">
              GSTIN: <strong className="font-mono text-gray-200">{profile.gstin}</strong>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {businessName}
          </h1>

          <p className="text-xs text-gray-400 mt-0.5">
            {activeAccountType === 'garage' ? (
              <span>{(profile as any).serviceBays} Service Bays • {(profile as any).city}, {(profile as any).state} • Certified Workshop</span>
            ) : (
              <span>{(profile as any).fleetSize} Commercial Vehicles • Primary Hub: {(profile as any).city}</span>
            )}
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('bulk-order')}
            className="px-3.5 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>New Bulk Order</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold border border-gray-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            <span>Browse Trade Catalog</span>
          </button>
        </div>
      </div>

      {/* Operational B2B Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold">Fiscal Procurement Spend</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {formatCurrency(842500)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-bold">
            +32% workshop throughput
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold">B2B Trade Margin Saved</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#C59B27]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#C59B27] tracking-tight">
            {formatCurrency(215600)}
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-bold">
            Avg 28.4% trade discount
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold">GST ITC Tax Credit Saved</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {formatCurrency(128450)}
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-bold">
            100% GSTR-1 matched
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold">Active Consignments</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {orders.length} Dispatches
          </div>
          <div className="mt-2 text-[11px] text-purple-600 font-bold">
            Blue Dart & Delhivery Express
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <button
          onClick={() => onNavigateTab('bulk-order')}
          className="p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-left transition flex items-center gap-3 cursor-pointer group shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#C59B27] flex items-center justify-center font-bold shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-gray-900 block group-hover:text-[#C59B27]">Bulk Order Matrix</strong>
            <span className="text-[11px] text-gray-500">Order 10+ part lines</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('bulk-order')}
          className="p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-left transition flex items-center gap-3 cursor-pointer group shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-gray-900 block group-hover:text-blue-600">Custom Fleet RFQ</strong>
            <span className="text-[11px] text-gray-500">Request pallet quotes</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('invoices')}
          className="p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-left transition flex items-center gap-3 cursor-pointer group shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-gray-900 block group-hover:text-emerald-600">Download Invoices</strong>
            <span className="text-[11px] text-gray-500">GST tax write-offs</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('credit')}
          className="p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-left transition flex items-center gap-3 cursor-pointer group shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-gray-900 block group-hover:text-purple-600">Credit Facility</strong>
            <span className="text-[11px] text-emerald-600 font-bold">Limit: {formatCurrency(profile.creditLimit)}</span>
          </div>
        </button>
      </div>

      {/* Frequently Ordered Parts & Fast Restock */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#C59B27]" />
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Fast Restock & Frequently Ordered Workshop SKUs
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs font-bold text-[#C59B27] hover:underline cursor-pointer"
          >
            View All Parts &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {frequentParts.map((product) => {
            const b2bPrice = b2bService.getBusinessPrice(product);
            return (
              <div
                key={product.id}
                className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <span className="font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                      {product.brand}
                    </span>
                    <span className="font-mono">MPN: {product.partNumber}</span>
                  </div>

                  <h3 className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>

                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                    Fits: {product.compatibility[0]?.model || 'Multi-Vehicle'}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-emerald-600">
                      {formatCurrency(b2bPrice)}
                    </div>
                    <span className="text-[10px] text-gray-400 line-through">
                      MRP {formatCurrency(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      b2bService.addItemToCart(product, 5);
                      alert(`Added 5 units of ${product.title} to B2B Cart.`);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-[#C59B27] hover:text-gray-950 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pack of 5</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent B2B Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
              <span>Recent B2B Orders & Consignment Fulfillment</span>
            </h2>
            <p className="text-xs text-gray-500">Multi-seller dispatches to your designated depot or bay.</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#C59B27] hover:underline cursor-pointer"
          >
            All Orders &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-4">Order Ref</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Consignment Vendors</th>
                <th className="p-3">Total Units</th>
                <th className="p-3">Net Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-gray-50 transition">
                  <td className="p-3 pl-4 font-mono font-bold text-gray-900">
                    {ord.orderId}
                  </td>
                  <td className="p-3 text-gray-600">{ord.orderDate}</td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-800">
                      {ord.consignments.map((c) => c.sellerName.split(' ')[0]).join(', ')}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {ord.consignments.length} Multi-Seller Consignment(s)
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-900">{ord.totalUnits} Units</td>
                  <td className="p-3 font-black text-gray-900 text-sm">
                    {formatCurrency(ord.grandTotal)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right space-x-1.5">
                    <button
                      onClick={() => onOpenOrderModal(ord)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onQuickReorder(ord)}
                      className="px-2.5 py-1 rounded-lg bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold cursor-pointer"
                    >
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
