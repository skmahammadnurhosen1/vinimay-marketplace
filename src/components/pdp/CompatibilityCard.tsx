import React from 'react';
import {
  Car,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { Product, SelectedVehicle } from '../../types';
import { useVehicle } from '../../context/VehicleContext';

interface CompatibilityCardProps {
  product: Product;
  onOpenCompatibleList: () => void;
}

export const CompatibilityCard: React.FC<CompatibilityCardProps> = ({
  product,
  onOpenCompatibleList
}) => {
  const { selectedVehicle, setIsSelectorModalOpen } = useVehicle();

  // Check compatibility logic against active vehicle
  const isCompatible = selectedVehicle
    ? product.compatibility.some(c => {
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
      })
    : false;

  return (
    <div className="rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/70 via-white to-blue-50/40 p-4 sm:p-5 space-y-4 shadow-xs">
      {/* Header with Title and "Fits X Vehicles" link */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-blue-100/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0B56D0] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Vehicle Fitment & Compatibility
            </h3>
            <span className="text-[11px] text-gray-500">
              Guaranteed Zero-Wrong-Part Protection
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCompatibleList}
          className="text-xs font-bold text-[#0B56D0] hover:text-[#0947AD] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Fits {product.compatibility.length} Vehicles</span>
          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* STATE 1: NO VEHICLE SELECTED */}
      {!selectedVehicle && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-950">
                Vehicle Selection Required
              </h4>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                Automotive spare parts require exact model, year, and engine specification match.
                Select your vehicle to confirm 100% direct fitment before ordering.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <span className="text-[11px] text-amber-800 font-medium">
              Takes 10 seconds (7-Step Selector)
            </span>
            <button
              type="button"
              onClick={() => setIsSelectorModalOpen(true)}
              className="px-4 py-2 bg-[#0B56D0] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Select Your Vehicle</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: VEHICLE SELECTED & COMPATIBLE */}
      {selectedVehicle && isCompatible && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-emerald-950">
                    Compatible with your vehicle
                  </h4>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.2 rounded shadow-2xs">
                    Guaranteed Fit
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-900 mt-1">
                  {selectedVehicle.year} {selectedVehicle.manufacturer} {selectedVehicle.model} ({selectedVehicle.fuelType} • {selectedVehicle.engine})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSelectorModalOpen(true)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Change Car</span>
            </button>
          </div>

          {/* Active Vehicle Specs Pill */}
          <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-100 text-[11px] text-gray-700 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span><strong>Type:</strong> {selectedVehicle.vehicleType === 'commercial' ? 'Commercial Fleet' : 'Passenger Car'}</span>
            <span><strong>Engine:</strong> {selectedVehicle.engine}</span>
            <span><strong>Variant:</strong> {selectedVehicle.variant}</span>
            <span><strong>Fuel:</strong> {selectedVehicle.fuelType}</span>
          </div>
        </div>
      )}

      {/* STATE 3: VEHICLE SELECTED BUT NOT CONFIRMED / INCOMPATIBLE */}
      {selectedVehicle && !isCompatible && (
        <div className="p-4 bg-stone-50 border border-amber-300/80 rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-stone-900">
                    Compatibility Not Confirmed for {selectedVehicle.model}
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.2 rounded">
                    Verify Details
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                  This part has not been confirmed for your {selectedVehicle.year} {selectedVehicle.manufacturer} {selectedVehicle.model}.
                  Please check your chassis/VIN or view confirmed vehicles list before purchasing.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSelectorModalOpen(true)}
              className="text-xs font-semibold text-[#0B56D0] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Change Car</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-stone-500 text-[11px]">Wrong orders cause workshop downtime.</span>
            <button
              type="button"
              onClick={onOpenCompatibleList}
              className="font-bold text-[#0B56D0] hover:underline cursor-pointer"
            >
              View Full Fitment Table →
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Safety Messaging */}
      <div className="flex items-center gap-2 text-[11px] text-blue-900/80 bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100">
        <ShieldCheck className="w-4 h-4 text-[#0B56D0] shrink-0" />
        <span className="font-medium">
          <strong>Safety Protection:</strong> Please verify vehicle compatibility before ordering. Free 10-day return eligibility applies if part does not fit.
        </span>
      </div>
    </div>
  );
};
