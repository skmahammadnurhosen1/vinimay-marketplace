import React from 'react';
import {
  X,
  ShoppingBag,
  Package,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  CreditCard,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { AdminMasterOrder, AdminSubOrder } from '../../types/admin';

interface AdminOrderDetailsModalProps {
  order: AdminMasterOrder;
  onClose: () => void;
}

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#16181D] text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C59B27] text-gray-950">
                MASTER MARKETPLACE ORDER
              </span>
              <span className="text-xs text-gray-400">Placed on {order.orderDate}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              {order.orderId}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Split Consignment Architecture: {order.subOrders.length} Seller Fulfillment Packages
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            {/* Customer */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3 text-[#C59B27]" />
                Customer Details
              </span>
              <p className="font-bold text-gray-900">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
              <p className="text-gray-600 truncate">{order.customer.email}</p>
            </div>

            {/* Shipping Destination */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                Shipping Destination
              </span>
              <p className="text-gray-700 leading-relaxed font-medium">
                {order.shippingAddress}
              </p>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-emerald-600" />
                Payment & Take Rate
              </span>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Charged:</span>
                <strong className="text-gray-900 text-sm">{formatCurrency(order.totalAmount)}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-700">Platform Commission:</span>
                <strong className="text-amber-700">{formatCurrency(order.platformCommissionTotal)}</strong>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {order.paymentMethod} • {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-orders Decomposed Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C59B27]" />
                <span>Consignment Decomposition (Multi-Vendor Sub-Orders)</span>
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                Each vendor dispatches independently
              </span>
            </div>

            <div className="space-y-4">
              {order.subOrders.map((sub, idx) => (
                <div
                  key={sub.subOrderId}
                  className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-xs"
                >
                  {/* Sub-order Header */}
                  <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-900 text-white font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">{sub.subOrderId}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-gray-200 text-gray-800">
                            {sub.sellerType}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-600 font-semibold">
                          Seller: {sub.sellerName}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-mono text-[11px]">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold text-gray-800">{sub.courierPartner}:</span>
                        <span className="text-blue-700">{sub.trackingNumber}</span>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {sub.dispatchStatus}
                      </span>
                    </div>
                  </div>

                  {/* Sub-order Items Table */}
                  <div className="p-3.5 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 text-[10px] uppercase font-bold text-left border-b border-gray-100 pb-1">
                          <th className="pb-1.5">Item Description</th>
                          <th className="pb-1.5">MPN</th>
                          <th className="pb-1.5">Quality</th>
                          <th className="pb-1.5">Qty</th>
                          <th className="pb-1.5">Unit Price</th>
                          <th className="pb-1.5 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sub.items.map((item, itemIdx) => (
                          <tr key={itemIdx}>
                            <td className="py-2 font-semibold text-gray-900 max-w-xs">
                              {item.title}
                              <span className="text-[10px] text-gray-500 block">Brand: {item.brand}</span>
                            </td>
                            <td className="py-2 font-mono text-gray-700">{item.partNumber}</td>
                            <td className="py-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                {item.qualityTier}
                              </span>
                            </td>
                            <td className="py-2 text-gray-700">{item.quantity}</td>
                            <td className="py-2 text-gray-700">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-2 text-right font-bold text-gray-900">
                              {formatCurrency(item.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Sub-order Financial Settlement Footer */}
                  <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-700">
                    <div className="flex items-center gap-3">
                      <span>Package Value: <strong className="text-gray-900">{formatCurrency(sub.subTotal)}</strong></span>
                      <span>•</span>
                      <span className="text-amber-700">Fee: {formatCurrency(sub.commissionAmount)}</span>
                      <span>•</span>
                      <span>Net Vendor Payout: <strong className="text-emerald-700">{formatCurrency(sub.netSellerPayout)}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span>Settlement State:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        sub.settlementStatus === 'Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.settlementStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Automated courier tracking sync with Blue Dart, Delhivery, and DTDC APIs
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Close Order
          </button>
        </div>
      </div>
    </div>
  );
};
