import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ProductFilterState, SelectedVehicle, PartType } from '../../types';

interface ActiveFilterChipsProps {
  filters: ProductFilterState;
  selectedVehicle: SelectedVehicle | null;
  onRemoveSearchQuery: () => void;
  onRemoveCategory: () => void;
  onRemoveBrand: (brand: string) => void;
  onRemovePartType: (type: PartType) => void;
  onRemovePriceRange: () => void;
  onRemovePartNumberQuery: () => void;
  onRemoveRating: () => void;
  onRemoveSellerTier: (tier: string) => void;
  onRemoveInStock: () => void;
  onRemoveFastDelivery: () => void;
  onRemoveVehicle: () => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  selectedVehicle,
  onRemoveSearchQuery,
  onRemoveCategory,
  onRemoveBrand,
  onRemovePartType,
  onRemovePriceRange,
  onRemovePartNumberQuery,
  onRemoveRating,
  onRemoveSellerTier,
  onRemoveInStock,
  onRemoveFastDelivery,
  onRemoveVehicle,
  onClearAll
}) => {
  const chips: Array<{ id: string; label: string; onRemove: () => void }> = [];

  // 1. Search Query
  if (filters.searchQuery) {
    chips.push({
      id: 'search',
      label: `"${filters.searchQuery}"`,
      onRemove: onRemoveSearchQuery
    });
  }

  // 2. Category
  if (filters.category && filters.category !== 'all') {
    const catName = filters.category
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    chips.push({
      id: 'category',
      label: `Category: ${catName}`,
      onRemove: onRemoveCategory
    });
  }

  // 3. Brands
  filters.brands.forEach(b => {
    chips.push({
      id: `brand-${b}`,
      label: `Brand: ${b}`,
      onRemove: () => onRemoveBrand(b)
    });
  });

  // 4. Part Types
  filters.partTypes.forEach(pt => {
    chips.push({
      id: `partType-${pt}`,
      label: `Quality: ${pt}`,
      onRemove: () => onRemovePartType(pt)
    });
  });

  // 5. Price Range
  if (filters.priceRange.min > 0 || (filters.priceRange.max > 0 && filters.priceRange.max < 50000)) {
    chips.push({
      id: 'price',
      label: `₹${filters.priceRange.min} - ₹${filters.priceRange.max || 'Any'}`,
      onRemove: onRemovePriceRange
    });
  }

  // 6. Part Number query
  if (filters.partNumberQuery) {
    chips.push({
      id: 'partNo',
      label: `Code: ${filters.partNumberQuery}`,
      onRemove: onRemovePartNumberQuery
    });
  }

  // 7. Rating
  if (filters.minRating > 0) {
    chips.push({
      id: 'rating',
      label: `${filters.minRating}★ & Above`,
      onRemove: onRemoveRating
    });
  }

  // 8. Seller Tiers
  filters.sellerTiers.forEach(st => {
    chips.push({
      id: `sellerTier-${st}`,
      label: st,
      onRemove: () => onRemoveSellerTier(st)
    });
  });

  // 9. In Stock
  if (filters.inStockOnly) {
    chips.push({
      id: 'instock',
      label: 'In Stock Only',
      onRemove: onRemoveInStock
    });
  }

  // 10. Fast Delivery
  if (filters.fastDeliveryOnly) {
    chips.push({
      id: 'fastdelivery',
      label: '2-3 Day Delivery',
      onRemove: onRemoveFastDelivery
    });
  }

  // 11. Vehicle Compatibility Filter
  if (filters.compatibleVehicleOnly && selectedVehicle) {
    chips.push({
      id: 'vehicle',
      label: `Fits: ${selectedVehicle.model} (${selectedVehicle.year})`,
      onRemove: onRemoveVehicle
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-gray-100">
      <span className="text-xs font-semibold text-gray-500 mr-1">Active Filters:</span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#0B56D0] border border-blue-200/80 shadow-2xs"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="w-3.5 h-3.5 rounded-full hover:bg-blue-200/80 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline inline-flex items-center gap-1 ml-1 cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};
