import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductFilterState, FilterFacets } from '../../types';
import { FilterSidebar } from './FilterSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilterState;
  facets: FilterFacets;
  onFilterChange: (filters: ProductFilterState) => void;
  onResetFilters: () => void;
  onOpenVehicleSelector: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  facets,
  onFilterChange,
  onResetFilters,
  onOpenVehicleSelector,
  activeFilterCount,
  totalFilteredCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-[#071530] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#FFBA00]" />
              <h2 className="text-sm font-bold tracking-tight">Filter Spare Parts</h2>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FFBA00] text-gray-950 text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filter Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <FilterSidebar
              filters={filters}
              facets={facets}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
              onOpenVehicleSelector={() => {
                onClose();
                onOpenVehicleSelector();
              }}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-2 py-3 px-4 bg-[#0B56D0] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Apply Filters ({totalFilteredCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
