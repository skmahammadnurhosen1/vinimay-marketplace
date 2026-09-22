import React from 'react';
import { CustomerOrder, OrderOverallStatus } from '../../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  Store,
  ChevronRight,
  ShieldCheck,
  Car
} from 'lucide-react';
import { Button } from '../common/Button';

interface OrderCardProps {
  order: CustomerOrder;
  onViewDetails: (order: CustomerOrder) => void;
  onTrackOrder: (order: CustomerOrder) => void;
  onRequestReturn?: (order: CustomerOrder) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onTrackOrder,
  onRequestReturn
}) => {
  const getStatusBadge = (status: OrderOverallStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Delivered
          </span>
        );
      case 'shipped':
      case 'partially_delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            In Transit / Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Processing
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-full border border-purple-200">
            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
            Returned
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100/80 px-2.5 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
    }
  };

  const totalItems = order.packages.reduce(
    (acc, pkg) => acc + pkg.items.reduce((s, it) => s + it.quantity, 0),
    0
  );

  const distinctSellers = Array.from(new Set(order.packages.map(p => p.sellerName)));

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden">
      {/* Card Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 via-blue-50/20 to-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#071530] text-[#FFBA00] flex items-center justify-center font-bold shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-gray-950 font-mono">
                #{order.id}
              </span>
              {getStatusBadge(order.overallStatus)}
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              Placed on {order.date}
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-[11px] text-gray-500">Total Order Amount</div>
          <div className="text-sm sm:text-base font-black text-[#0B56D0]">
            ₹{order.totalPayable.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Multi-Vendor Indicator & Vehicle Pill */}
      <div className="px-4 sm:px-5 py-2.5 bg-blue-50/40 border-b border-blue-100/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-700">
          <Store className="w-3.5 h-3.5 text-[#0B56D0] shrink-0" />
          <span className="font-semibold text-gray-900">
            {order.packages.length} {order.packages.length === 1 ? 'Seller Consignment' : 'Seller Consignments'}:
          </span>
          <span className="text-gray-600 truncate max-w-xs sm:max-w-md">
            {distinctSellers.join(', ')}
          </span>
        </div>

        {order.vehicleContext && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-900 bg-white border border-blue-200/80 px-2 py-0.5 rounded-md">
            <Car className="w-3 h-3 text-[#0B56D0]" />
            <span>
              {order.vehicleContext.manufacturer} {order.vehicleContext.model} ({order.vehicleContext.year})
            </span>
          </div>
        )}
      </div>

      {/* Products Preview */}
      <div className="p-4 sm:p-5 space-y-3">
        {order.packages.map(pkg => (
          <div key={pkg.packageId} className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pb-1 border-b border-gray-100">
              <span className="font-bold text-gray-700">{pkg.sellerName}</span>
              <span>{pkg.estimatedDelivery}</span>
            </div>

            <div className="space-y-2">
              {pkg.items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {item.product.title}
                    </h4>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {item.product.brand} • Part: {item.product.partNumber} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-950 shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 sm:p-5 bg-gray-50/70 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{totalItems} total {totalItems === 1 ? 'part' : 'parts'}</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Fitment Protected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {order.overallStatus !== 'cancelled' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onTrackOrder(order)}
              leftIcon={<Truck className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              Track Consignment
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewDetails(order)}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            Order Details
          </Button>
        </div>
      </div>
    </div>
  );
};
