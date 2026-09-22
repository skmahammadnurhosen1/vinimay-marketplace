import React, { useState, useMemo } from 'react';
import { Car, CheckCircle2, Search, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { VehicleCompatibility } from '../../types';
import { useVehicle } from '../../context/VehicleContext';
import { useToast } from '../../context/ToastContext';

interface CompatibilityTableProps {
  compatibilityList: VehicleCompatibility[];
  productTitle: string;
}

export const CompatibilityTable: React.FC<CompatibilityTableProps> = ({
  compatibilityList,
  productTitle
}) => {
  const { setVehicle, selectedVehicle } = useVehicle();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return compatibilityList;
    const q = searchQuery.toLowerCase();
    return compatibilityList.filter(
      c =>
        c.manufacturer.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        (c.engine && c.engine.toLowerCase().includes(q)) ||
        c.yearRange.includes(q)
    );
  }, [compatibilityList, searchQuery]);

  const displayedList = isExpanded ? filteredList : filteredList.slice(0, 5);

  const handleSelectThisVehicle = (c: VehicleCompatibility) => {
    const startYear = parseInt(c.yearRange.split('-')[0].trim(), 10) || 2022;
    const isCV =
      c.manufacturer.toLowerCase().includes('tata') ||
      c.manufacturer.toLowerCase().includes('ashok') ||
      c.manufacturer.toLowerCase().includes('mahindra cv');

    setVehicle({
      vehicleType: isCV ? 'commercial' : 'passenger',
      manufacturer: c.manufacturer,
      model: c.model,
      year: startYear,
      fuelType: c.engine?.toLowerCase().includes('diesel') ? 'Diesel' : 'Petrol',
      engine: c.engine || 'Standard',
      variant: 'Standard OEM'
    });

    showToast(
      'Active Vehicle Updated',
      `Filter set to ${c.manufacturer} ${c.model} (${c.yearRange}).`,
      'success'
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs my-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 text-[#0B56D0]" />
            <span>Full List of Compatible Vehicles ({compatibilityList.length})</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified model lines, generation years, and engine displacements
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by Make, Model or Engine..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Mobile Card List (Screen < 640px) */}
      <div className="block sm:hidden space-y-2.5">
        {displayedList.length > 0 ? (
          displayedList.map((c, idx) => {
            const isActive =
              selectedVehicle &&
              selectedVehicle.manufacturer.toLowerCase().includes(c.manufacturer.toLowerCase()) &&
              selectedVehicle.model.toLowerCase().includes(c.model.toLowerCase());

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      {c.manufacturer}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-0.5">{c.model}</h4>
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectThisVehicle(c)}
                      className="text-xs font-bold text-[#C59B27] hover:text-[#9E7A1C] hover:underline cursor-pointer shrink-0"
                    >
                      Select Vehicle →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-stone-100 text-[11px] text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Years</span>
                    <span className="font-mono font-semibold text-stone-800">{c.yearRange}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Engine / Fuel</span>
                    <span className="font-semibold text-stone-800 truncate block">
                      {c.engine || 'All Codes'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block text-[10px]">Fitment</span>
                    <span className="text-stone-700">{c.notes || 'Direct Axle OEM Fitment'}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
            No compatible vehicles matched "{searchQuery}".
          </div>
        )}
      </div>

      {/* Desktop / Tablet Table Container (Screen >= 640px) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-stone-200 shadow-2xs">
        <table className="min-w-full divide-y divide-stone-200 text-xs">
          <thead className="bg-stone-50 text-stone-700">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Manufacturer</th>
              <th className="px-4 py-3 text-left font-bold">Model & Series</th>
              <th className="px-4 py-3 text-left font-bold">Model Years</th>
              <th className="px-4 py-3 text-left font-bold">Engine / Fuel</th>
              <th className="px-4 py-3 text-left font-bold">Fitment Position</th>
              <th className="px-4 py-3 text-right font-bold">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {displayedList.length > 0 ? (
              displayedList.map((c, idx) => {
                const isActive =
                  selectedVehicle &&
                  selectedVehicle.manufacturer.toLowerCase().includes(c.manufacturer.toLowerCase()) &&
                  selectedVehicle.model.toLowerCase().includes(c.model.toLowerCase());

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isActive ? 'bg-emerald-50/70 hover:bg-emerald-50' : 'hover:bg-stone-50/60'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-stone-900">
                      {c.manufacturer}
                    </td>
                    <td className="px-4 py-3 font-bold text-stone-950">
                      {c.model}
                    </td>
                    <td className="px-4 py-3 font-mono text-stone-600">
                      {c.yearRange}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {c.engine || 'All Engine Codes'}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {c.notes || 'Direct Front Axle OEM'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Currently Selected</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectThisVehicle(c)}
                          className="text-[11px] font-bold text-[#C59B27] hover:text-[#9E7A1C] hover:underline cursor-pointer"
                        >
                          Select This Vehicle →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                  No compatible vehicles matched "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expand / Collapse Button */}
      {filteredList.length > 5 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Show Less Vehicles' : `Show All ${filteredList.length} Compatible Vehicles`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};
