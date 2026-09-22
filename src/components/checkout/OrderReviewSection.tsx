import React from 'react';
import { Store, ShieldCheck, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import { SellerCartGroupData } from '../../types';
import { CompatibilityNotice } from '../cart/CompatibilityNotice';

interface OrderReviewSectionProps {
  sellerGroups: SellerCartGroupData[];
}

export const OrderReviewSection: React.FC<OrderReviewSectionProps> = ({ sellerGroups }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold text-xs">
          2
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900">
            Order Review & Multi-Vendor Dispatch
          </h3>
          <span className="text-xs text-gray-500">
            Parts are dispatched in {sellerGroups.length} {sellerGroups.length === 1 ? 'consignment' : 'separate consignments'} by verified merchants
          </span>
        </div>
      </div>

      {/* Explanatory Multi-Vendor Dispatch Notice */}
      <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
        <Truck className="w-4 h-4 text-[#0B56D0] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Independent Merchant Dispatch:</strong> Because our marketplace connects you directly to specialized OEM and Aftermarket distributors across India, items from different sellers are packed independently and will arrive with their own tracking numbers.
        </p>
      </div>

      {/* Seller Consignments */}
      <div className="space-y-4 pt-1">
        {sellerGroups.map((group, idx) => (
          <div
            key={group.seller.id}
            className="rounded-xl border border-gray-200 bg-gray-50/30 overflow-hidden"
          >
            {/* Seller Header */}
            <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#0B56D0]" />
                <span className="text-xs font-bold text-gray-900">{group.seller.name}</span>
                <span className="text-[10px] text-gray-500 font-medium">({group.seller.city}, {group.seller.state})</span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-gray-500">
                  Est. Delivery: <strong className="text-gray-900">{group.estimatedDelivery}</strong>
                </span>
                <span className="text-gray-300">•</span>
                <span className="font-bold text-gray-900">
                  Subtotal: ₹{group.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Consignment Items */}
            <div className="p-3.5 divide-y divide-gray-100 bg-white space-y-3">
              {group.items.map(item => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-14 h-14 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-gray-900 truncate">
                        {item.product.title}
                      </h5>
                      <span className="text-xs font-extrabold text-gray-950 shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                      {item.product.brand} • Part: {item.product.partNumber} • Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                    </div>

                    <div className="mt-1.5">
                      <CompatibilityNotice product={item.product} compact />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
