import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange
}) => {
  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * limit + 1;
  const endIdx = Math.min(currentPage * limit, totalItems);

  // Generate page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-gray-200 text-xs">
      {/* Items range counter */}
      <div className="text-gray-500 font-medium">
        Showing <strong className="text-gray-900">{startIdx} - {endIdx}</strong> of{' '}
        <strong className="text-gray-900">{totalItems}</strong> spare parts
      </div>

      {/* Center: Pagination controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                currentPage === p
                  ? 'bg-[#0B56D0] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Per Page Selector */}
      {onLimitChange && (
        <div className="flex items-center gap-2 text-gray-500">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
            className="bg-white border border-gray-200 rounded-md px-2 py-1 text-xs font-semibold text-gray-800 cursor-pointer focus:outline-none focus:border-blue-500"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
          </select>
        </div>
      )}
    </div>
  );
};
