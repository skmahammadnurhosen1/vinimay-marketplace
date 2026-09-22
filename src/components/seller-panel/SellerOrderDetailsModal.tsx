import React, { useState } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { SellerOrder, SellerShipmentState } from '../../types/seller';

interface SellerOrderDetailsModalProps {
  order: SellerOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: SellerShipmentState, courier?: string, trackingNum?: string) => void;
}

export const SellerOrderDetailsModal: React.FC<SellerOrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  if (!isOpen || !order) return null;

  const [courierInput, setCourierInput] = useState(order.courierName || 'Blue Dart Surface Cargo');
  const [trackingInput, setTrackingInput] = useState(
    order.trackingNumber !== 'Pending Allocation' ? order.trackingNumber : 'BD-98214012'
  );
  const [isShippingPromptOpen, setIsShippingPromptOpen] = useState(false);

  const stages: { key: SellerShipmentState; label: string }[] = [
    { key: 'ordered', label: 'Ordered' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === order.shipmentState);

  const handleMarkPacked = () => {
    onUpdateStatus(order.id, 'packed');
  };

  const handleMarkShipped = () => {
    onUpdateStatus(order.id, 'shipped', courierInput, trackingInput);
    setIsShippingPromptOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Consignment Package
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800">
                {order.shipmentState.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-stone-950 font-mono mt-0.5">
              {order.id}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* 5-STAGE SHIPMENT PROGRESS BAR */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
              Shipment Lifecycle Progression
            </span>

            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-[#C59B27] -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(currentStageIndex / (stages.length - 1)) * 100}%`
                }}
              />

              {stages.map((st, i) => {
                const isPassed = i <= currentStageIndex;
                const isCurrent = i === currentStageIndex;

                return (
                  <div key={st.key} className="flex flex-col items-center gap-1 relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                        isPassed
                          ? 'bg-[#16181D] border-[#C59B27] text-[#E8D5A3]'
                          : 'bg-white border-stone-300 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-[#C59B27]/20 scale-110' : ''}`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-[10px] font-semibold text-center whitespace-nowrap ${
                        isPassed ? 'text-stone-950 font-bold' : 'text-stone-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COURIER & LOGISTICS DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-400 text-[10px] block">Logistics Partner</span>
              <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C59B27]" />
                {order.courierName}
              </span>
              <span className="text-stone-500 font-mono text-[11px] block">
                AWB: <strong>{order.trackingNumber}</strong>
              </span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-400 text-[10px] block">Customer Delivery Summary</span>
              <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                {order.customerSummary.maskedName}
              </span>
              <span className="text-stone-500 text-[11px] block">
                {order.customerSummary.city}, {order.customerSummary.state} ({order.customerSummary.pincode})
              </span>
            </div>
          </div>

          {/* ITEM DETAILS */}
          <div className="space-y-2">
            <span className="font-bold text-stone-700 block">Package Items</span>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-contain bg-white border border-stone-200 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-stone-950 truncate">{item.title}</h5>
                    <span className="text-[11px] text-stone-500 font-mono block">
                      Part No: {item.partNumber} • Qty: {item.quantity}
                    </span>
                    {item.vehicleSummary && (
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Vehicle: {item.vehicleSummary}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="font-bold text-stone-950 block">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    (₹{item.unitPrice} each)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* FINANCIAL BREAKDOWN */}
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span>Gross Consignment Value:</span>
              <span className="font-mono font-bold text-stone-950">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span>Platform Commission (10%):</span>
              <span className="font-mono text-rose-600">
                - ₹{order.commissionAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-950 font-bold border-t border-stone-200 pt-2 text-sm">
              <span>Net Seller Payout:</span>
              <span className="font-mono text-emerald-700">
                ₹{order.netPayout.toFixed(2)}
              </span>
            </div>
          </div>

          {/* CHECKPOINT LOG */}
          {order.checkpoints && order.checkpoints.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="font-bold text-stone-700 block">Checkpoint History</span>
              <div className="space-y-2 border-l-2 border-stone-200 pl-3 ml-2">
                {order.checkpoints.map((cp, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{cp.title}</span>
                      <span className="text-[10px] text-stone-400">{cp.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">{cp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHIPPING PROMPT MODAL (INLINE) */}
          {isShippingPromptOpen && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-3 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold text-amber-950">
                Enter Logistics Dispatch Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-amber-900 block mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={e => setCourierInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-stone-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-amber-900 block mb-1">
                    AWB / Consignment Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={e => setTrackingInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono text-stone-900 font-bold"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsShippingPromptOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMarkShipped}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Handover to Courier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {order.shipmentState === 'ordered' && (
              <button
                type="button"
                onClick={handleMarkPacked}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Mark as Packed
              </button>
            )}

            {order.shipmentState === 'packed' && (
              <button
                type="button"
                onClick={() => setIsShippingPromptOpen(true)}
                className="px-4 py-2 bg-[#16181D] hover:bg-stone-800 text-[#E8D5A3] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Mark as Shipped (Courier Handover)
              </button>
            )}

            {order.shipmentState === 'shipped' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Simulate Delivery
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
