import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';
import { Product, SelectedVehicle } from '../../types';

interface CompatibilityBadgeProps {
  product: Product;
  selectedVehicle: SelectedVehicle | null;
  onOpenSelector?: () => void;
  onViewCompatibleVehicles?: () => void;
  compact?: boolean;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  product,
  selectedVehicle,
  onOpenSelector,
  onViewCompatibleVehicles,
  compact = false
}) => {
  // If no vehicle is selected
  if (!selectedVehicle) {
    return (
      <div className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-medium">Vehicle selection required</span>
        </div>
        {onOpenSelector && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSelector();
            }}
            className="text-[10px] font-bold text-amber-700 underline hover:text-amber-900 cursor-pointer ml-1"
          >
            Check Fit
          </button>
        )}
      </div>
    );
  }

  // Check compatibility
  const isCompatible = product.compatibility.some(c => {
    const vMake = selectedVehicle.manufacturer.toLowerCase();
    const vModel = selectedVehicle.model.toLowerCase();
    const cMake = c.manufacturer.toLowerCase();
    const cModel = c.model.toLowerCase();
    const matchMake = cMake.includes(vMake) || vMake.includes(cMake) || (vMake.includes('tata') && cMake.includes('tata'));
    const matchModel = cModel.includes(vModel) || vModel.includes(cModel) || (vModel.includes('ace') && cModel.includes('ace'));
    return matchMake && matchModel;
  });

  if (isCompatible) {
    return (
      <div className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/90 text-emerald-800 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <div className="flex items-center gap-1.5 truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold truncate">
            Fits {selectedVehicle.model} ({selectedVehicle.year})
          </span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-emerald-600 text-white rounded shrink-0 ml-1">
          Guaranteed
        </span>
      </div>
    );
  }

  // Not confirmed / Not compatible with currently selected vehicle
  return (
    <div className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-300/80 text-stone-700 ${compact ? 'text-[10px]' : 'text-xs'}`}>
      <div className="flex items-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <span className="font-medium text-stone-600">Compatibility not confirmed</span>
      </div>
      {onViewCompatibleVehicles && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewCompatibleVehicles();
          }}
          className="text-[10px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer ml-1"
        >
          View Fitment
        </button>
      )}
    </div>
  );
};
