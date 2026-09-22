import React from 'react';
import { X, Car, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useVehicle } from '../../context/VehicleContext';

interface CompatibleVehiclesModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompatibleVehiclesModal: React.FC<CompatibleVehiclesModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { selectedVehicle, setVehicle } = useVehicle();

  if (!isOpen || !product) return null;

  const handleSelectCompatibleVehicle = (compat: { manufacturer: string; model: string; yearRange: string; engine?: string }) => {
    // Parse starting year from range like "2018 - 2024"
    const startYear = parseInt(compat.yearRange.split('-')[0].trim(), 10) || 2022;

    setVehicle({
      vehicleType: compat.manufacturer.toLowerCase().includes('tata') || compat.manufacturer.toLowerCase().includes('ashok') ? 'commercial' : 'passenger',
      manufacturer: compat.manufacturer,
      model: compat.model,
      year: startYear,
      fuelType: compat.engine?.toLowerCase().includes('diesel') ? 'Diesel' : 'Petrol',
      engine: compat.engine || 'Standard',
      variant: 'Base / Standard'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0B56D0]">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                Confirmed Compatible Vehicles
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {product.brand} {product.title} • Part #{product.partNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Guarantee Banner */}
        <div className="mt-4 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>100% Zero-Wrong-Fit Guarantee:</strong> If this part doesn't fit a confirmed vehicle listed below, return it within 10 days for a full refund.
          </span>
        </div>

        {/* Compatible Vehicles Table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
          <div className="max-h-72 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700">
                    Manufacturer & Model
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700">
                    Model Years
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700">
                    Engine / Displacement
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-bold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {product.compatibility.map((compat, idx) => {
                  const isCurrentlySelected = selectedVehicle &&
                    compat.manufacturer.toLowerCase().includes(selectedVehicle.manufacturer.toLowerCase()) &&
                    compat.model.toLowerCase().includes(selectedVehicle.model.toLowerCase());

                  return (
                    <tr
                      key={idx}
                      className={isCurrentlySelected ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-gray-50/70 transition-colors'}
                    >
                      <td className="px-4 py-3 text-gray-900 flex items-center gap-2">
                        {isCurrentlySelected ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                        )}
                        <span>{compat.manufacturer} {compat.model}</span>
                        {isCurrentlySelected && (
                          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {compat.yearRange}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {compat.engine || 'All Engine Options'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isCurrentlySelected ? (
                          <span className="text-emerald-700 font-bold text-[11px]">Selected</span>
                        ) : (
                          <button
                            onClick={() => handleSelectCompatibleVehicle(compat)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B56D0] hover:text-blue-800 transition-colors cursor-pointer"
                          >
                            <span>Filter by this</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div>
            OEM Cross-Reference: <code className="font-mono text-gray-800 font-bold">{product.oemNumber}</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
