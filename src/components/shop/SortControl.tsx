import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../types';

interface SortControlProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControl: React.FC<SortControlProps> = ({
  currentSort,
  onSortChange
}) => {
  const options: Array<{ value: SortOption; label: string }> = [
    { value: 'relevance', label: 'Relevance (Best Match)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'newest', label: 'Newest Arrivals' }
  ];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 font-medium whitespace-nowrap hidden sm:inline">Sort by:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-gray-800 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
