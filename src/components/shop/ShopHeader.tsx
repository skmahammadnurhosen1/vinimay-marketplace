import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Car, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { SelectedVehicle, SearchSuggestionGroup, SearchSuggestionItem } from '../../types';
import { SearchSuggestions } from './SearchSuggestions';

interface ShopHeaderProps {
  title: string;
  subtitle?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  suggestions: SearchSuggestionGroup[];
  selectedVehicle: SelectedVehicle | null;
  onOpenVehicleSelector: () => void;
  onClearVehicle: () => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  subtitle = 'Discover genuine, OEM, and aftermarket replacement parts for passenger and commercial vehicles across India.',
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  suggestions,
  selectedVehicle,
  onOpenVehicleSelector,
  onClearVehicle,
  onOpenMobileFilters,
  activeFilterCount
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsFocused(false);
      onSearchSubmit(searchQuery);
    }
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    setIsFocused(false);
    onSearchChange(item.targetQuery);
    onSearchSubmit(item.targetQuery);
  };

  return (
    <div className="bg-gradient-to-b from-[#071530] via-[#0A2252] to-[#071530] text-white py-8 px-4 sm:px-6 lg:px-8 rounded-2xl mb-6 shadow-xl border border-blue-900/40 relative overflow-hidden">
      {/* Subtle background glow elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#FFBA00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-5 text-center">
        {/* Title & Description */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Search Field */}
        <div ref={containerRef} className="max-w-2xl mx-auto relative">
          <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent focus-within:border-[#FFBA00] transition-all">
            <div className="pl-4 text-gray-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search by Part Name, Part Number, Brand or Vehicle"
              className="flex-1 px-3 py-3.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  onSearchSubmit('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsFocused(false);
                onSearchSubmit(searchQuery);
              }}
              className="px-5 sm:px-7 py-3.5 bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <span>Search</span>
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isFocused && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 text-left z-50">
              <SearchSuggestions
                groups={suggestions}
                onSelectSuggestion={handleSelectSuggestion}
                query={searchQuery}
              />
            </div>
          )}
        </div>

        {/* Active Vehicle & Mobile Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 max-w-3xl mx-auto text-xs">
          {/* Active Vehicle Pill */}
          <div className="flex flex-wrap items-center gap-2 bg-blue-950/80 border border-blue-800/80 rounded-2xl sm:rounded-full px-3.5 py-1.5 text-blue-100 shadow-inner max-w-full min-w-0">
            <Car className="w-3.5 h-3.5 text-[#FFBA00] shrink-0" />
            {selectedVehicle ? (
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <span className="text-[11px] sm:text-xs">
                  Filtered for: <strong className="text-white">{selectedVehicle.model} ({selectedVehicle.year} {selectedVehicle.fuelType})</strong>
                </span>
                <button
                  type="button"
                  onClick={onOpenVehicleSelector}
                  className="text-[10px] font-bold text-[#FFBA00] hover:underline cursor-pointer ml-1 shrink-0"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={onClearVehicle}
                  className="text-gray-400 hover:text-white cursor-pointer shrink-0"
                  title="Remove vehicle filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <span className="text-[11px] sm:text-xs text-gray-300">No vehicle selected</span>
                <button
                  type="button"
                  onClick={onOpenVehicleSelector}
                  className="text-[10px] font-bold text-[#FFBA00] hover:underline cursor-pointer shrink-0"
                >
                  Select Vehicle to Verify Fitment
                </button>
              </div>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-800/70 hover:bg-blue-700/80 rounded-full text-xs font-semibold text-white border border-blue-600/50 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFBA00]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FFBA00] text-gray-950 font-bold text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
