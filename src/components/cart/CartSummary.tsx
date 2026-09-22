import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Package, Info, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';

interface CartSummaryProps {
  onProceedToCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onProceedToCheckout }) => {
  const {
    totalItems,
    subtotal,
    totalMrp,
    totalSavings,
    freeDeliveryThreshold,
    shippingTotal,
    gstAmount,
    totalPayable,
    groupedBySeller
  } = useCart();

  const progress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);
  const sellerCount = groupedBySeller.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 space-y-5 sticky top-24">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-base font-bold text-gray-950">Order Summary</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {totalItems} {totalItems === 1 ? 'spare part' : 'spare parts'} from {sellerCount} {sellerCount === 1 ? 'seller' : 'sellers'}
        </p>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/80 text-xs">
        <div className="flex items-center justify-between text-gray-700 mb-1.5 font-medium">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#0B56D0]" />
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-gray-900 font-bold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for FREE Pan-India Delivery
              </span>
            ) : (
              <span className="text-emerald-700 font-bold">You qualify for FREE Delivery!</span>
            )}
          </span>
          <span className="font-bold text-blue-900">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-blue-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0B56D0] to-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Itemized Price Breakdown */}
      <div className="space-y-2.5 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Items Total (MRP)</span>
          <span className="font-semibold text-gray-800">
            ₹{totalMrp.toLocaleString('en-IN')}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Direct Product Discount</span>
            <span className="font-bold">-₹{totalSavings.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            Estimated Shipping
            <span title="Calculated based on seller dispatch locations">
              <Info className="w-3 h-3 text-gray-400" />
            </span>
          </span>
          <span className={shippingTotal === 0 ? 'text-emerald-700 font-bold' : 'text-gray-900 font-semibold'}>
            {shippingTotal === 0 ? 'FREE' : `₹${shippingTotal.toLocaleString('en-IN')}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Taxes (GST 18% Included)</span>
          <span>₹{gstAmount.toLocaleString('en-IN')}</span>
        </div>

        {/* Total Payable */}
        <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between text-base font-extrabold text-gray-950">
          <div>
            <span>Total Payable</span>
            <div className="text-[10px] text-gray-400 font-normal">All taxes & packaging included</div>
          </div>
          <span className="text-xl sm:text-2xl text-[#0B56D0]">
            ₹{totalPayable.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Multi-Vendor Packaging Disclaimer */}
      {sellerCount > 1 && (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
          <Package className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-tight">
            <strong>Multi-Seller Order:</strong> Your order will be fulfilled in <strong>{sellerCount} separate packages</strong> dispatched directly by the respective verified merchants.
          </p>
        </div>
      )}

      {/* Checkout Button */}
      <Button
        variant="gold"
        size="lg"
        onClick={onProceedToCheckout}
        disabled={totalItems === 0}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="w-full shadow-md text-sm font-bold justify-center"
      >
        Proceed to Checkout
      </Button>

      {/* Trust Badges */}
      <div className="space-y-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Genuine Auto Parts with Escrow Protection</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#0B56D0] shrink-0" />
          <span>10-Day Hassle-Free Returns & Fitment Guarantee</span>
        </div>
      </div>
    </div>
  );
};
