import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';
import { OrderStatusStage } from '../../types';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatusStage;
  orderDate: string;
}

const STAGES: { stage: OrderStatusStage; label: string; icon: React.FC<{ className?: string }> }[] = [
  { stage: 'ordered', label: 'Ordered', icon: Clock },
  { stage: 'packed', label: 'Packed', icon: Package },
  { stage: 'shipped', label: 'Shipped', icon: Truck },
  { stage: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { stage: 'delivered', label: 'Delivered', icon: Home }
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
  orderDate
}) => {
  const currentIdx = STAGES.findIndex(s => s.stage === currentStatus);

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 bg-gray-200 z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIdx) / (STAGES.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Stage Nodes */}
        {STAGES.map((s, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = s.icon;

          return (
            <div key={s.stage} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#0B56D0] text-white ring-4 ring-blue-100 shadow-sm'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-bold mt-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'text-[#0B56D0]'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>

              {isCurrent && (
                <span className="text-[9px] text-gray-500 font-mono hidden sm:inline-block">
                  Confirmed
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
