import React from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Percent,
  Receipt,
  Car,
  ShoppingBag,
} from 'lucide-react';
import { b2bService } from '../../services/b2bService';

interface B2BCartPageProps {
  onNavigateCheckout: () => void;
  onNavigateProducts: () => void;
}

export const B2BCartPage: React.FC<B2BCartPageProps> = ({
  onNavigateCheckout,
  onNavigateProducts,
}) => {
  const consignments = b2bService.getConsignments();
  const totals = b2bService.getCartTotals();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (consignments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-10 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C59B27] flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Your B2B Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Add replacement parts with trade pricing from the catalog or build an order via the Bulk Order Matrix.
        </p>
        <button
          onClick={onNavigateProducts}
          className="px-5 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-bold text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Trade Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#C59B27]" />
            <span>B2B Multi-Vendor Cart & Consignments</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {totals.totalUnits} Units across {consignments.length} Independent Seller Fulfillment Consignments.
          </p>
        </div>

        <button
          onClick={() => b2bService.clearCart()}
          className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer self-start sm:self-auto"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Consignments List */}
        <div className="lg:col-span-2 space-y-4">
          {consignments.map((consignment, cIdx) => (
            <div
              key={consignment.sellerId}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden"
            >
              {/* Consignment Header */}
              <div className="p-3.5 sm:p-4 bg-gray-50/80 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white font-black text-xs flex items-center justify-center">
                    {cIdx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-gray-900 block">{consignment.sellerName}</span>
                    <span className="text-[10px] text-gray-500">{consignment.sellerTier}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-blue-700 font-semibold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dispatch: {consignment.estimatedDispatch}</span>
                </div>
              </div>

              {/* Items in this consignment */}
              <div className="p-4 space-y-4 divide-y divide-gray-100">
                {consignment.items.map((ci) => (
                  <div key={ci.product.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <img
                        src={ci.product.images[0] || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'}
                        alt={ci.product.title}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 block line-clamp-1 max-w-sm">
                            {ci.product.title}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-500">
                          MPN: <strong className="text-gray-700">{ci.product.partNumber}</strong> | OEM: {ci.product.oemNumber}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Car className="w-3 h-3 text-[#C59B27]" />
                          <span>Fits: {ci.product.compatibility[0]?.model || 'Multi-Vehicle'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                      {/* Stepper */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => b2bService.updateCartQuantity(ci.product.id, ci.quantity - 1)}
                          className="p-1.5 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900 text-xs bg-white border-x border-gray-300 py-1">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => b2bService.updateCartQuantity(ci.product.id, ci.quantity + 1)}
                          className="p-1.5 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <div className="font-black text-gray-900 text-sm">
                          {formatCurrency(ci.lineTotal)}
                        </div>
                        <span className="text-[10px] text-gray-500 block">
                          @{formatCurrency(ci.unitBusinessPrice)} / unit
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => b2bService.removeFromCart(ci.product.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Consignment Subtotal Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Consignment Subtotal ({consignment.items.reduce((s, i) => s + i.quantity, 0)} units):</span>
                <span className="font-bold text-gray-900">{formatCurrency(consignment.consignmentSubtotal)} + {formatCurrency(consignment.consignmentGST)} GST</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Sticky Financial Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 text-xs sticky top-20">
          <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2.5">
            B2B Procurement Order Summary
          </h2>

          <div className="space-y-2 text-gray-600">
            <div className="flex items-center justify-between">
              <span>Total Spare Parts Volume:</span>
              <strong className="text-gray-900">{totals.totalUnits} Units ({totals.totalItems} SKUs)</strong>
            </div>

            <div className="flex items-center justify-between">
              <span>MRP Retail Benchmark:</span>
              <span className="text-gray-400 line-through">{formatCurrency(totals.retailTotal)}</span>
            </div>

            <div className="flex items-center justify-between text-[#C59B27] font-bold">
              <span className="flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                Wholesale Margin Savings:
              </span>
              <span>-{formatCurrency(totals.bulkSavings)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Trade Net Subtotal:</span>
              <strong className="text-gray-900 font-bold">{formatCurrency(totals.subtotal)}</strong>
            </div>

            <div className="flex items-center justify-between text-blue-700">
              <span className="flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5" />
                Estimated 18% GST (ITC Eligible):
              </span>
              <strong className="font-mono font-bold">+{formatCurrency(totals.gstTotal)}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span>Logistics Heavy Freight:</span>
              <span className="text-emerald-700 font-bold">Free Commercial Transit</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block font-semibold">Total Net Payable (with GST):</span>
              <div className="text-xl font-black text-gray-900">
                {formatCurrency(totals.grandTotal)}
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateCheckout}
            className="w-full py-3 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to B2B Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-gray-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Tax Compliant B2B Procurement</span>
            </div>
            <p>
              Official GST Tax Invoice with HSN codes will be generated automatically upon checkout confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
