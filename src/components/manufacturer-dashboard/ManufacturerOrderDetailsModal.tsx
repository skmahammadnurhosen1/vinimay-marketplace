import React from 'react';
import {
  X,
  ShoppingCart,
  Truck,
  MapPin,
} from 'lucide-react';
import { ManufacturerOrder } from '../../types/manufacturer';

interface ManufacturerOrderDetailsModalProps {
  order: ManufacturerOrder | null;
  onClose: () => void;
}

export const ManufacturerOrderDetailsModal: React.FC<ManufacturerOrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 font-mono">{order.id}</h2>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-emerald-600 font-bold">{order.orderStatus}</span>
              </div>
              <p className="text-xs text-gray-500">{order.orderDate}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 border border-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-gray-700">
          {/* Seller Consignment Box */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Multi-Vendor Consignment Package</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300 font-bold">
                {order.sellerConsignment.dispatchStatus}
              </span>
            </div>

            <div className="font-bold text-gray-900 text-sm">{order.sellerConsignment.sellerName}</div>
            <p className="text-gray-500 text-[11px]">{order.sellerConsignment.sellerLocation}</p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-200/80 text-[11px]">
              <div>
                <span className="text-gray-500 block">Courier Partner:</span>
                <strong className="text-gray-900">{order.sellerConsignment.courierPartner}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">AWB Tracking Reference:</span>
                <strong className="text-[#0284C7] font-mono">{order.sellerConsignment.trackingNumber}</strong>
              </div>
            </div>
          </div>

          {/* Customer Destination */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <span className="text-[10px] text-gray-500 uppercase font-mono block">Delivery Destination:</span>
            <div className="font-semibold text-gray-900">{order.customerName}</div>
            <div className="text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.customerCity}, {order.customerState}</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px] block">
              Manufacturer Order Items:
            </span>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-[11px] text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-mono uppercase text-[9px]">
                  <tr>
                    <th className="py-2.5 px-3">Part Details</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{it.productTitle}</div>
                        <span className="text-[10px] font-mono text-[#0284C7]">MPN: {it.partNumber}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{it.quantity}</td>
                      <td className="py-2.5 px-3 font-mono">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900 text-right">
                        ₹{it.subtotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between font-mono">
              <span className="font-bold text-gray-700">Total Consignment Value:</span>
              <span className="text-base font-black text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs cursor-pointer shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
