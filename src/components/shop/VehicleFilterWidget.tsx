import React from 'react';
import { Car, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { SelectedVehicle } from '../../types';
import { useVehicle } from '../../context/VehicleContext';

interface VehicleFilterWidgetProps {
  compatibleOnly: boolean;
  onToggleCompatibleOnly: (val: boolean) => void;
  onOpenSelectorModal: () => void;
}

export const VehicleFilterWidget: React.FC<VehicleFilterWidgetProps> = ({
  compatibleOnly,
  onToggleCompatibleOnly,
  onOpenSelectorModal
}) => {
  const { selectedVehicle, clearVehicle, setVehicle } = useVehicle();

  // Quick preset demo vehicles for rapid testing
  const DEMO_PRESETS: SelectedVehicle[] = [
    {
      vehicleType: 'commercial',
      manufacturer: 'Tata Motors (Commercial)',
      model: 'Ace Gold',
      year: 2022,
      fuelType: 'Diesel',
      engine: '700cc Dicor',
      variant: 'Standard'
    },
    {
      vehicleType: 'passenger',
      manufacturer: 'Maruti Suzuki',
      model: 'Swift',
      year: 2021,
      fuelType: 'Petrol',
      engine: '1.2L DualJet',
      variant: 'ZXi'
    },
    {
      vehicleType: 'passenger',
      manufacturer: 'Hyundai',
      model: 'Creta',
      year: 2023,
      fuelType: 'Diesel',
      engine: '1.5L CRDi',
      variant: 'SX (O)'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-xl p-3.5 border border-blue-200/70 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B56D0]">
          <Car className="w-4 h-4" />
          <span>Vehicle Compatibility</span>
        </div>
        {selectedVehicle && (
          <button
            type="button"
            onClick={clearVehicle}
            className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5 cursor-pointer"
            title="Clear vehicle filter"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {selectedVehicle ? (
        <div className="bg-white rounded-lg p-2.5 border border-blue-200/90 shadow-2xs space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Active Fitment Vehicle</span>
              </div>
              <div className="text-xs font-bold text-gray-950 mt-0.5">
                {selectedVehicle.manufacturer} {selectedVehicle.model}
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                {selectedVehicle.year} • {selectedVehicle.fuelType} • {selectedVehicle.engine}
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-blue-100 text-[#0B56D0] rounded shrink-0">
              {selectedVehicle.vehicleType}
            </span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={compatibleOnly}
                onChange={(e) => onToggleCompatibleOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#0B56D0] focus:ring-blue-500 border-gray-300"
              />
              <span className="text-[11px] font-semibold text-gray-800">
                Only compatible parts
              </span>
            </label>
            <button
              type="button"
              onClick={onOpenSelectorModal}
              className="text-[10px] font-bold text-[#0B56D0] hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] text-gray-600 leading-snug">
            Filter 100% compatible parts for your specific car or commercial truck.
          </p>
          <button
            type="button"
            onClick={onOpenSelectorModal}
            className="w-full py-2 px-3 bg-[#0B56D0] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Select Your Vehicle</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Demo Selector Chips */}
      <div className="pt-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Quick Demo Vehicles</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_PRESETS.map((p) => {
            const isActive = selectedVehicle?.model === p.model;
            return (
              <button
                key={p.model}
                type="button"
                onClick={() => setVehicle(p)}
                className={`text-[10px] px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B56D0] text-white font-bold shadow-2xs'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {p.model}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
