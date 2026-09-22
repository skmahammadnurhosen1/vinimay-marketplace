import React, { useState } from 'react';
import { RotateCcw, Search, Star } from 'lucide-react';
import { ProductFilterState, FilterFacets, PartType } from '../../types';
import { FilterGroup } from './FilterGroup';
import { VehicleFilterWidget } from './VehicleFilterWidget';

interface FilterSidebarProps {
  filters: ProductFilterState;
  facets: FilterFacets;
  onFilterChange: (newFilters: ProductFilterState) => void;
  onResetFilters: () => void;
  onOpenVehicleSelector: () => void;
  activeFilterCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  facets,
  onFilterChange,
  onResetFilters,
  onOpenVehicleSelector,
  activeFilterCount
}) => {
  const [brandSearch, setBrandSearch] = useState('');

  // 1. Categories definition
  const CATEGORIES = [
    { name: 'All Categories', slug: 'all' },
    { name: 'Brake Parts', slug: 'brake-parts' },
    { name: 'Clutch Parts', slug: 'clutch-parts' },
    { name: 'Suspension', slug: 'suspension' },
    { name: 'Gearbox & Transmission', slug: 'gearbox-transmission' },
    { name: 'Differential & Axle', slug: 'differential-axle' },
    { name: 'Engine Parts', slug: 'engine-parts' },
    { name: 'Electrical Parts', slug: 'electrical-parts' }
  ];

  // 2. Part Types definition
  const PART_TYPES: PartType[] = ['Genuine', 'OEM', 'Aftermarket'];

  // 3. Seller Tiers definition
  const SELLER_TIERS = [
    'Authorized Distributor',
    'OEM Partner',
    'Certified Wholesaler',
    'Verified Retailer'
  ];

  // Filter Brand list by brandSearch input
  const allBrandEntries = Object.entries(facets.brands || {});
  const filteredBrands = allBrandEntries.filter(([brand]) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Helper handlers
  const handleCategoryChange = (slug: string) => {
    onFilterChange({
      ...filters,
      category: slug,
      subCategories: [] // reset subcategories when switching category
    });
  };

  const handleBrandToggle = (brand: string) => {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: nextBrands });
  };

  const handlePartTypeToggle = (pt: PartType) => {
    const nextTypes = filters.partTypes.includes(pt)
      ? filters.partTypes.filter(t => t !== pt)
      : [...filters.partTypes, pt];
    onFilterChange({ ...filters, partTypes: nextTypes });
  };

  const handleSellerTierToggle = (tier: string) => {
    const nextTiers = filters.sellerTiers.includes(tier)
      ? filters.sellerTiers.filter(t => t !== tier)
      : [...filters.sellerTiers, tier];
    onFilterChange({ ...filters, sellerTiers: nextTiers });
  };

  const handlePricePreset = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  return (
    <aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-900">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#0B56D0] text-white text-[11px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-[#0B56D0] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1. First-Class Vehicle Filter Widget */}
      <VehicleFilterWidget
        compatibleOnly={filters.compatibleVehicleOnly}
        onToggleCompatibleOnly={(val) =>
          onFilterChange({ ...filters, compatibleVehicleOnly: val })
        }
        onOpenSelectorModal={onOpenVehicleSelector}
      />

      {/* 2. Part Category Filter */}
      <FilterGroup title="Part Categories" defaultExpanded={true}>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.slug;
            const count = cat.slug === 'all'
              ? facets.totalCount
              : facets.categories[cat.slug] || 0;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-[#0B56D0] font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[11px] ${isSelected ? 'text-[#0B56D0] font-bold' : 'text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* 3. Product Type / Authenticity (Genuine, OEM, Aftermarket) */}
      <FilterGroup
        title="Product Type & Quality"
        badgeCount={filters.partTypes.length}
        defaultExpanded={true}
      >
        <div className="space-y-1.5">
          {PART_TYPES.map((pt) => {
            const isChecked = filters.partTypes.includes(pt);
            const count = facets.partTypes[pt] || 0;

            const badgeStyles = {
              Genuine: 'bg-emerald-100 text-emerald-800',
              OEM: 'bg-blue-100 text-blue-800',
              Aftermarket: 'bg-amber-100 text-amber-800'
            }[pt];

            return (
              <label
                key={pt}
                className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handlePartTypeToggle(pt)}
                    className="w-4 h-4 rounded text-[#0B56D0] focus:ring-blue-500 border-gray-300"
                  />
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${badgeStyles}`}>
                    {pt}
                  </span>
                  <span className="font-medium">{pt} Parts</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">({count})</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* 4. Brand Filter */}
      <FilterGroup
        title="Brand"
        badgeCount={filters.brands.length}
        defaultExpanded={true}
      >
        <div className="space-y-2">
          {/* Quick search inside brand filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {filteredBrands.length > 0 ? (
              filteredBrands.map(([brand, count]) => {
                const isChecked = filters.brands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 rounded text-[#0B56D0] focus:ring-blue-500 border-gray-300"
                      />
                      <span className={isChecked ? 'font-bold text-[#0B56D0]' : 'font-medium'}>
                        {brand}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">({count})</span>
                  </label>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 py-1 text-center">No brands found</div>
            )}
          </div>
        </div>
      </FilterGroup>

      {/* 5. Price Range Filter */}
      <FilterGroup title="Price Range (₹)" defaultExpanded={true}>
        <div className="space-y-2.5">
          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handlePricePreset(0, 2000)}
              className="px-2 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#0B56D0] rounded text-[11px] border border-gray-200 text-center font-medium cursor-pointer"
            >
              Under ₹2,000
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(2000, 5000)}
              className="px-2 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#0B56D0] rounded text-[11px] border border-gray-200 text-center font-medium cursor-pointer"
            >
              ₹2,000 - ₹5,000
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(5000, 10000)}
              className="px-2 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#0B56D0] rounded text-[11px] border border-gray-200 text-center font-medium cursor-pointer"
            >
              ₹5,000 - ₹10,000
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(10000, 50000)}
              className="px-2 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#0B56D0] rounded text-[11px] border border-gray-200 text-center font-medium cursor-pointer"
            >
              Above ₹10,000
            </button>
          </div>

          {/* Min & Max Inputs */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 block mb-0.5">Min (₹)</label>
              <input
                type="number"
                value={filters.priceRange.min || ''}
                placeholder="0"
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    priceRange: {
                      ...filters.priceRange,
                      min: parseInt(e.target.value, 10) || 0
                    }
                  })
                }
                className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <span className="text-gray-300 pt-3">-</span>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 block mb-0.5">Max (₹)</label>
              <input
                type="number"
                value={filters.priceRange.max || ''}
                placeholder="25000"
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    priceRange: {
                      ...filters.priceRange,
                      max: parseInt(e.target.value, 10) || 0
                    }
                  })
                }
                className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      </FilterGroup>

      {/* 6. Part Number / OEM Number Search */}
      <FilterGroup title="Part & OEM Reference" defaultExpanded={false}>
        <div className="space-y-1">
          <input
            type="text"
            placeholder="e.g. 0986AB1234 or 55810"
            value={filters.partNumberQuery || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                partNumberQuery: e.target.value
              })
            }
            className="w-full px-3 py-1.5 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="text-[10px] text-gray-400">
            Search direct manufacturer codes or OEM cross-references.
          </p>
        </div>
      </FilterGroup>

      {/* 7. Rating Filter */}
      <FilterGroup title="Customer Rating" defaultExpanded={false}>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <label
              key={stars}
              className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === stars}
                onChange={() => onFilterChange({ ...filters, minRating: stars })}
                className="w-4 h-4 text-[#0B56D0] focus:ring-blue-500 border-gray-300"
              />
              <div className="flex items-center gap-1 font-medium">
                <span className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </span>
                <span>{stars}★ & above</span>
              </div>
            </label>
          ))}
          {filters.minRating > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, minRating: 0 })}
              className="text-[10px] text-[#0B56D0] hover:underline pt-1 cursor-pointer"
            >
              Reset rating filter
            </button>
          )}
        </div>
      </FilterGroup>

      {/* 8. Seller Tier */}
      <FilterGroup
        title="Verified Seller Tier"
        badgeCount={filters.sellerTiers.length}
        defaultExpanded={false}
      >
        <div className="space-y-1.5">
          {SELLER_TIERS.map((tier) => {
            const isChecked = filters.sellerTiers.includes(tier);
            const count = facets.sellerTiers[tier] || 0;
            return (
              <label
                key={tier}
                className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSellerTierToggle(tier)}
                    className="w-4 h-4 rounded text-[#0B56D0] focus:ring-blue-500 border-gray-300"
                  />
                  <span className="font-medium text-[11px]">{tier}</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">({count})</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* 9. Stock & Delivery */}
      <FilterGroup title="Availability & Logistics" defaultExpanded={false}>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                onFilterChange({ ...filters, inStockOnly: e.target.checked })
              }
              className="w-4 h-4 rounded text-[#0B56D0] focus:ring-blue-500 border-gray-300"
            />
            <span className="font-medium">In Stock Only</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.fastDeliveryOnly}
              onChange={(e) =>
                onFilterChange({ ...filters, fastDeliveryOnly: e.target.checked })
              }
              className="w-4 h-4 rounded text-[#0B56D0] focus:ring-blue-500 border-gray-300"
            />
            <span className="font-medium">Fast 2-3 Day Delivery</span>
          </label>
        </div>
      </FilterGroup>
    </aside>
  );
};
