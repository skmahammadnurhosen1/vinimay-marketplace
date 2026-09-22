import React, { useState } from 'react';
import { CustomerOrder, PackageTrackingInfo, OrderStatusStage } from '../../types';
import {
  X,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Store,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface OrderTrackingModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const STAGES: { stage: OrderStatusStage; label: string; icon: React.FC<{ className?: string }> }[] = [
  { stage: 'ordered', label: 'Ordered', icon: Clock },
  { stage: 'packed', label: 'Packed', icon: Package },
  { stage: 'shipped', label: 'Shipped', icon: Truck },
  { stage: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { stage: 'delivered', label: 'Delivered', icon: Home }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  // Selected package tab (for multi-vendor tracking)
  const [selectedPkgIdx, setSelectedPkgIdx] = useState(0);

  const currentPkg = order.packages[selectedPkgIdx] || order.packages[0];
  const trackingInfo: PackageTrackingInfo = currentPkg?.trackingInfo || {
    packageId: currentPkg?.packageId || 'PKG-1',
    trackingId: currentPkg?.trackingId || 'TRK-100',
    courierPartner: currentPkg?.courierPartner || 'Express Cargo',
    currentStage: currentPkg?.status || 'ordered',
    estimatedDelivery: currentPkg?.estimatedDelivery || '2-3 Business Days',
    checkpoints: []
  };

  const currentStageIdx = STAGES.findIndex(s => s.stage === trackingInfo.currentStage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-950">
                  Consignment Tracking
                </h3>
                <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  #{order.id}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Live multi-vendor dispatch status across independent carrier networks
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Vendor Seller Consignment Switcher */}
        {order.packages.length > 1 && (
          <div className="pt-3 pb-2">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Select Seller Package Consignment ({order.packages.length} Packages):
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {order.packages.map((pkg, idx) => (
                <button
                  key={pkg.packageId}
                  type="button"
                  onClick={() => setSelectedPkgIdx(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    selectedPkgIdx === idx
                      ? 'border-[#0B56D0] bg-blue-50/80 text-[#0B56D0] shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{pkg.sellerName}</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white border border-gray-200">
                    {pkg.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Consignment Info Strip */}
        <div className="my-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-gray-500 text-[11px]">Courier Logistics Partner:</div>
            <div className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
              <span>{trackingInfo.courierPartner}</span>
              <span className="text-gray-300">•</span>
              <span className="font-mono text-gray-600">AWB: {trackingInfo.trackingId}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-gray-500 text-[11px]">Estimated Arrival:</div>
            <div className="font-extrabold text-emerald-700">
              {trackingInfo.estimatedDelivery}
            </div>
          </div>
        </div>

        {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
        <div className="py-6 px-2 overflow-y-auto flex-1">
          {/* DESKTOP TIMELINE (Hidden on mobile) */}
          <div className="hidden sm:block">
            <div className="relative flex items-center justify-between">
              {/* Line */}
              <div className="absolute top-1/2 left-6 right-6 h-1 -translate-y-1/2 bg-gray-200 z-0">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${(Math.max(0, currentStageIdx) / (STAGES.length - 1)) * 100}%`
                  }}
                />
              </div>

              {/* Stages */}
              {STAGES.map((s, idx) => {
                const isCompleted = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const Icon = s.icon;

                return (
                  <div key={s.stage} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md'
                          : isCurrent
                          ? 'bg-[#0B56D0] text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold mt-2 whitespace-nowrap ${
                        isCurrent
                          ? 'text-[#0B56D0]'
                          : isCompleted
                          ? 'text-emerald-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Checkpoints (Vertical for Mobile & Detailed Log for Desktop) */}
          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Transit Activity & Scan Log
            </h4>

            {trackingInfo.checkpoints && trackingInfo.checkpoints.length > 0 ? (
              <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {trackingInfo.checkpoints.map((cp, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        cp.completed
                          ? 'border-emerald-600 bg-emerald-600'
                          : cp.current
                          ? 'border-[#0B56D0] bg-[#0B56D0] ring-4 ring-blue-100'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {cp.completed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900">
                          {cp.title}
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          {cp.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {cp.description}
                      </p>
                      <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {cp.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Live carrier tracking scans will update once linehaul vehicle departs the regional merchant hub.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Transit Insured by AutoPartsHub Escrow Logistics</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
