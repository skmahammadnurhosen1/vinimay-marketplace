import React from 'react';
import {
  X,
  ShoppingBag,
  Package,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Receipt,
  FileText,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { B2BOrder, B2BGSTInvoice } from '../../types/b2b';
import { b2bService } from '../../services/b2bService';

interface B2BOrderDetailsModalProps {
  order: B2BOrder;
  onClose: () => void;
  onReorder: (order: B2BOrder) => void;
  onViewInvoice?: (inv: B2BGSTInvoice) => void;
}

export const B2BOrderDetailsModal: React.FC<B2BOrderDetailsModalProps> = ({
  order,
  onClose,
  onReorder,
  onViewInvoice,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const invoice = b2bService.getInvoiceByNumber(order.invoiceNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-in fade-in">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#16181D] text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C59B27] text-gray-950">
                B2B COMMERCIAL PURCHASE ORDER
              </span>
              <span className="text-xs text-gray-400">Date: {order.orderDate}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              {order.orderId}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Buyer: <strong className="text-gray-200">{order.businessName}</strong> • GSTIN: {order.gstin}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onReorder(order);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>1-Click Reorder All</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Top Status & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Fulfillment Status
              </span>
              <span className="font-bold text-gray-900 block text-sm mt-0.5">
                {order.orderStatus}
              </span>
              <span className="text-[11px] text-gray-500">
                {order.totalUnits} Units in {order.consignments.length} Consignment Packages
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Payment & Invoice
              </span>
              <span className="font-semibold text-gray-900 block mt-0.5">{order.paymentMethod}</span>
              <span className="text-emerald-700 font-bold block text-[11px]">{order.paymentStatus}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                GST Tax Invoice Ref
              </span>
              <span className="font-mono font-bold text-blue-900 block mt-0.5">
                {order.invoiceNumber}
              </span>
              {invoice && onViewInvoice && (
                <button
                  onClick={() => onViewInvoice(invoice)}
                  className="text-blue-600 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  View Full Tax Invoice &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Destination */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 block">Delivery Bay / Yard Destination:</span>
              <p className="text-gray-600">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Decomposed Consignments */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <Truck className="w-4 h-4 text-[#C59B27]" />
              <span>Seller Consignments & Dispatches ({order.consignments.length})</span>
            </h3>

            <div className="space-y-4">
              {order.consignments.map((c, idx) => (
                <div key={c.sellerId} className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-xs">
                  {/* Sub-order header */}
                  <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-900 text-white font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 block">{c.sellerName}</span>
                        <span className="text-[10px] text-gray-500">{c.sellerTier}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-gray-600">
                        Carrier: {c.courierPartner}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Dispatched
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="p-3.5 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 text-[10px] uppercase font-bold text-left border-b border-gray-100 pb-1">
                          <th className="pb-1.5">Part Title</th>
                          <th className="pb-1.5">MPN / OEM</th>
                          <th className="pb-1.5">Qty</th>
                          <th className="pb-1.5">Unit B2B Rate</th>
                          <th className="pb-1.5 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {c.items.map((item, iIdx) => (
                          <tr key={iIdx}>
                            <td className="py-2 font-semibold text-gray-900 max-w-xs truncate">
                              {item.product.title}
                            </td>
                            <td className="py-2 font-mono text-gray-600">{item.product.partNumber}</td>
                            <td className="py-2 font-bold text-gray-900">{item.quantity}</td>
                            <td className="py-2 font-mono">{formatCurrency(item.unitBusinessPrice)}</td>
                            <td className="py-2 text-right font-bold text-gray-900">
                              {formatCurrency(item.lineTotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-gray-500 block">Trade Subtotal: {formatCurrency(order.subtotal)}</span>
              <span className="text-amber-700 font-bold block">B2B Margin Saved: -{formatCurrency(order.bulkSavings)}</span>
              <span className="text-blue-700 font-bold block">18% GST (ITC Eligible): +{formatCurrency(order.gstTotal)}</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 block font-semibold">Total Net Amount:</span>
              <strong className="text-xl font-black text-gray-900">{formatCurrency(order.grandTotal)}</strong>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
