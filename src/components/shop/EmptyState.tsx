import React from 'react';
import { SearchX, RotateCcw, Wrench, Sparkles, Car } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onResetSearch: () => void;
  onSelectSuggestionQuery: (q: string) => void;
  onOpenVehicleSelector: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  hasFilters,
  onClearFilters,
  onResetSearch,
  onSelectSuggestionQuery,
  onOpenVehicleSelector
}) => {
  const POPULAR_SUGGESTIONS = [
    'Brake Pad Set',
    'Clutch Kit',
    'Shock Absorber',
    'Brake Disc',
    'SKF Bearings',
    'Tata Ace'
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs my-6 space-y-6 max-w-2xl mx-auto">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mx-auto flex items-center justify-center text-[#0B56D0] shadow-sm">
        <SearchX className="w-8 h-8" />
      </div>

      {/* Heading & Text */}
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          {searchQuery
            ? `No matching parts found for "${searchQuery}"`
            : 'No spare parts match your selected filters'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          We couldn't find exact matches for your criteria. Try adjusting your brand, category, price range, or vehicle filters.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2.5 bg-[#0B56D0] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenVehicleSelector}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Car className="w-3.5 h-3.5 text-[#0B56D0]" />
          <span>Change Vehicle</span>
        </button>

        {searchQuery && (
          <button
            type="button"
            onClick={onResetSearch}
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <span>Show All Parts</span>
          </button>
        )}
      </div>

      {/* Popular alternative keywords */}
      <div className="pt-4 border-t border-gray-100">
        <div className="text-xs font-semibold text-gray-400 mb-2.5 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FFBA00]" />
          <span>Try searching for common automotive parts:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => onSelectSuggestionQuery(sug)}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#0B56D0] border border-gray-200 transition-colors font-medium cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
