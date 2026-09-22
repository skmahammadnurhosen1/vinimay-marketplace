import React from 'react';
import { Store, Truck, Package, ShieldCheck, ExternalLink } from 'lucide-react';
import { SellerOrderPackage } from '../../types';
import { OrderStatusTimeline } from './OrderStatusTimeline';

interface SellerPackageCardProps {
  pkg: SellerOrderPackage;
  orderDate: string;
}

export const SellerPackageCard: React.FC<SellerPackageCardProps> = ({ pkg, orderDate }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Package Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 via-blue-50/20 to-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#071530] text-[#FFBA00] flex items-center justify-center font-bold">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-bold text-gray-950">{pkg.sellerName}</h4>
              <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {pkg.sellerTier}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-0.5">
              Package ID: <strong className="text-gray-800">{pkg.packageId}</strong> • Origin: {pkg.sellerCity}, {pkg.sellerState}
            </div>
          </div>
        </div>

        {/* Courier & Tracking */}
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
            <Truck className="w-3.5 h-3.5 text-[#0B56D0]" />
            <span>{pkg.courierPartner}</span>
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            AWB: <strong className="text-gray-900">{pkg.trackingId}</strong>
          </div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span className="font-semibold text-gray-800">Shipment Status</span>
          <span className="text-emerald-700 font-bold">
            Expected Delivery: {pkg.estimatedDelivery}
          </span>
        </div>
        <OrderStatusTimeline currentStatus={pkg.status} orderDate={orderDate} />
      </div>

      {/* Package Items List */}
      <div className="p-4 sm:p-5 divide-y divide-gray-100">
        {pkg.items.map(item => (
          <div key={item.product.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
            <img
              src={item.product.images[0]}
              alt={item.product.title}
              className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-bold text-gray-900 truncate">
                  {item.product.title}
                </h5>
                <span className="text-xs font-extrabold text-gray-900 shrink-0">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                {item.product.brand} • Part No: {item.product.partNumber} • Qty: {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Subtotal Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          Package Total ({pkg.items.length} {pkg.items.length === 1 ? 'item' : 'items'}):
        </span>
        <span className="font-extrabold text-gray-950">
          ₹{pkg.packageSubtotal.toLocaleString('en-IN')}
          {pkg.packageShipping === 0 ? (
            <span className="text-emerald-700 text-[10px] font-bold ml-1.5">(Free Shipping)</span>
          ) : (
            <span className="text-gray-500 text-[10px] font-normal ml-1.5">(+₹{pkg.packageShipping} Shipping)</span>
          )}
        </span>
      </div>
    </div>
  );
};
