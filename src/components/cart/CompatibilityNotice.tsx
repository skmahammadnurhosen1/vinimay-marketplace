import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Car } from 'lucide-react';
import { Product } from '../../types';
import { useVehicle } from '../../context/VehicleContext';

interface CompatibilityNoticeProps {
  product: Product;
  compact?: boolean;
}

export const CompatibilityNotice: React.FC<CompatibilityNoticeProps> = ({
  product,
  compact = false
}) => {
  const { selectedVehicle, setIsSelectorModalOpen } = useVehicle();

  if (!selectedVehicle) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-[11px] font-medium">Vehicle fitment not checked.</span>
        <button
          type="button"
          onClick={() => setIsSelectorModalOpen(true)}
          className="text-[11px] font-bold text-[#0B56D0] hover:underline ml-auto cursor-pointer shrink-0"
        >
          Select Car
        </button>
      </div>
    );
  }

  // Check if compatible
  const isCompatible = product.compatibility.some(c => {
    const vMake = selectedVehicle.manufacturer.toLowerCase();
    const vModel = selectedVehicle.model.toLowerCase();
    const cMake = c.manufacturer.toLowerCase();
    const cModel = c.model.toLowerCase();
    const matchMake =
      cMake.includes(vMake) ||
      vMake.includes(cMake) ||
      (vMake.includes('tata') && cMake.includes('tata'));
    const matchModel =
      cModel.includes(vModel) ||
      vModel.includes(cModel) ||
      (vModel.includes('ace') && cModel.includes('ace'));
    return matchMake && matchModel;
  });

  if (isCompatible) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="text-[11px] font-semibold truncate">
          Fits your {selectedVehicle.manufacturer} {selectedVehicle.model} ({selectedVehicle.year})
        </span>
        {!compact && (
          <span className="hidden sm:inline-block ml-auto text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 px-1.5 py-0.5 rounded">
            Guaranteed Fit
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start sm:items-center gap-1.5 text-amber-900 bg-amber-50/90 border border-amber-300/80 px-2.5 py-1.5 rounded-lg">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-medium leading-tight block sm:inline">
          Not verified for {selectedVehicle.manufacturer} {selectedVehicle.model}.
        </span>
        <span className="text-[10px] text-amber-800 block sm:inline sm:ml-1">
          Please confirm part compatibility before ordering.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsSelectorModalOpen(true)}
        className="text-[11px] font-bold text-[#0B56D0] hover:underline ml-auto cursor-pointer shrink-0"
      >
        Change Car
      </button>
    </div>
  );
};
