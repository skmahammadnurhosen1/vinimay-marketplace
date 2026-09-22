import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  ProductFilterState,
  SortOption,
  ViewMode,
  FilterFacets,
  SearchSuggestionGroup,
  PartType
} from '../../types';
import { productService } from '../../services/productService';
import { useVehicle } from '../../context/VehicleContext';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { ShopHeader } from './ShopHeader';
import { FilterSidebar } from './FilterSidebar';
import { ActiveFilterChips } from './ActiveFilterChips';
import { SortControl } from './SortControl';
import { ViewToggle } from './ViewToggle';
import { ProductGrid } from './ProductGrid';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { CompatibleVehiclesModal } from './CompatibleVehiclesModal';

interface ShopPageProps {
  initialCategory?: string;
  initialQuery?: string;
  onNavigateHome: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  initialQuery = '',
  onNavigateHome,
  onSelectProduct
}) => {
  const { selectedVehicle, clearVehicle, setIsSelectorModalOpen } = useVehicle();

  // -------------------------------------------------------------
  // Filter & Listing State
  // -------------------------------------------------------------
  const [filters, setFilters] = useState<ProductFilterState>({
    searchQuery: initialQuery,
    category: initialCategory,
    subCategories: [],
    brands: [],
    partTypes: [],
    priceRange: { min: 0, max: 25000 },
    minRating: 0,
    partNumberQuery: '',
    inStockOnly: false,
    fastDeliveryOnly: false,
    sellerTiers: [],
    compatibleVehicleOnly: false
  });

  const [sort, setSort] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);

  // Products & Facets
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [facets, setFacets] = useState<FilterFacets>({
    categories: {},
    subCategories: {},
    brands: {},
    partTypes: {},
    sellerTiers: {},
    minPrice: 0,
    maxPrice: 25000,
    totalCount: 0
  });

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<SearchSuggestionGroup[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [compatibleModalProduct, setCompatibleModalProduct] = useState<Product | null>(null);

  const topAnchorRef = useRef<HTMLDivElement>(null);

  // Update filters if initial props change
  useEffect(() => {
    if (initialCategory && initialCategory !== filters.category) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
      setPage(1);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== filters.searchQuery) {
      setFilters(prev => ({ ...prev, searchQuery: initialQuery }));
      setPage(1);
    }
  }, [initialQuery]);

  // Load Search Suggestions on query change
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (filters.searchQuery.trim().length >= 2) {
        const groups = await productService.getSearchSuggestions(filters.searchQuery);
        setSuggestions(groups);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [filters.searchQuery]);

  // Execute Search & Filtering
  useEffect(() => {
    let isCancelled = false;

    const executeFilter = async () => {
      setIsLoading(true);

      try {
        const [result, facetData] = await Promise.all([
          productService.filterProducts(filters, sort, page, limit, selectedVehicle),
          productService.getFilterFacets(filters)
        ]);

        if (!isCancelled) {
          setProducts(result.items);
          setTotalItems(result.total);
          setTotalPages(result.totalPages);
          setFacets(facetData);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    executeFilter();

    return () => {
      isCancelled = true;
    };
  }, [filters, sort, page, limit, selectedVehicle]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.partTypes.length > 0) count += filters.partTypes.length;
    if (filters.priceRange.min > 0 || (filters.priceRange.max > 0 && filters.priceRange.max < 25000)) count++;
    if (filters.partNumberQuery) count++;
    if (filters.minRating > 0) count++;
    if (filters.sellerTiers.length > 0) count += filters.sellerTiers.length;
    if (filters.inStockOnly) count++;
    if (filters.fastDeliveryOnly) count++;
    if (filters.compatibleVehicleOnly && selectedVehicle) count++;
    return count;
  }, [filters, selectedVehicle]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      subCategories: [],
      brands: [],
      partTypes: [],
      priceRange: { min: 0, max: 25000 },
      minRating: 0,
      partNumberQuery: '',
      inStockOnly: false,
      fastDeliveryOnly: false,
      sellerTiers: [],
      compatibleVehicleOnly: false
    });
    setPage(1);
  };

  // Scroll to top of results on page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic Page Title
  const pageTitle = useMemo(() => {
    if (filters.searchQuery) {
      return `Results for "${filters.searchQuery}"`;
    }
    if (filters.category && filters.category !== 'all') {
      return filters.category
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return 'Shop Spare Parts';
  }, [filters.searchQuery, filters.category]);

  // Dynamic Breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', onClick: onNavigateHome },
      {
        label: 'Shop',
        onClick: filters.category !== 'all' || filters.searchQuery ? handleResetFilters : undefined,
        active: filters.category === 'all' && !filters.searchQuery
      }
    ];

    if (filters.category && filters.category !== 'all') {
      const catLabel = filters.category
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      items.push({
        label: catLabel,
        active: !filters.searchQuery
      });
    }

    if (filters.searchQuery) {
      items.push({
        label: `Search: "${filters.searchQuery}"`,
        active: true
      });
    }

    return items;
  }, [filters.category, filters.searchQuery, onNavigateHome]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* 2. Page Introduction Banner & Hero Search */}
      <ShopHeader
        title={pageTitle}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
        onSearchSubmit={(q) => {
          setFilters(prev => ({ ...prev, searchQuery: q }));
          setPage(1);
        }}
        suggestions={suggestions}
        selectedVehicle={selectedVehicle}
        onOpenVehicleSelector={() => setIsSelectorModalOpen(true)}
        onClearVehicle={clearVehicle}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Anchor point for pagination scroll */}
      <div ref={topAnchorRef} className="scroll-mt-24" />

      {/* 3. Main Two-Column Listing Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Desktop Filter Sidebar */}
        <div className="w-72 xl:w-80 shrink-0 hidden lg:block sticky top-24">
          <FilterSidebar
            filters={filters}
            facets={facets}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
            onResetFilters={handleResetFilters}
            onOpenVehicleSelector={() => setIsSelectorModalOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Right Column: Results & Products */}
        <main className="flex-1 min-w-0 w-full space-y-4">
          {/* Active Filter Removable Tags */}
          <ActiveFilterChips
            filters={filters}
            selectedVehicle={selectedVehicle}
            onRemoveSearchQuery={() => {
              setFilters(prev => ({ ...prev, searchQuery: '' }));
              setPage(1);
            }}
            onRemoveCategory={() => {
              setFilters(prev => ({ ...prev, category: 'all' }));
              setPage(1);
            }}
            onRemoveBrand={(brand) => {
              setFilters(prev => ({
                ...prev,
                brands: prev.brands.filter(b => b !== brand)
              }));
              setPage(1);
            }}
            onRemovePartType={(pt: PartType) => {
              setFilters(prev => ({
                ...prev,
                partTypes: prev.partTypes.filter(t => t !== pt)
              }));
              setPage(1);
            }}
            onRemovePriceRange={() => {
              setFilters(prev => ({ ...prev, priceRange: { min: 0, max: 25000 } }));
              setPage(1);
            }}
            onRemovePartNumberQuery={() => {
              setFilters(prev => ({ ...prev, partNumberQuery: '' }));
              setPage(1);
            }}
            onRemoveRating={() => {
              setFilters(prev => ({ ...prev, minRating: 0 }));
              setPage(1);
            }}
            onRemoveSellerTier={(tier) => {
              setFilters(prev => ({
                ...prev,
                sellerTiers: prev.sellerTiers.filter(t => t !== tier)
              }));
              setPage(1);
            }}
            onRemoveInStock={() => {
              setFilters(prev => ({ ...prev, inStockOnly: false }));
              setPage(1);
            }}
            onRemoveFastDelivery={() => {
              setFilters(prev => ({ ...prev, fastDeliveryOnly: false }));
              setPage(1);
            }}
            onRemoveVehicle={() => {
              setFilters(prev => ({ ...prev, compatibleVehicleOnly: false }));
              setPage(1);
            }}
            onClearAll={handleResetFilters}
          />

          {/* Results Summary & Controls Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3.5 sm:px-5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            {/* Left: Summary Count */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-900 font-black tracking-tight text-sm">
                {totalItems} Spare Parts Found
              </span>
              {selectedVehicle && (
                <span className="hidden md:inline-block text-[11px] text-gray-500 truncate max-w-xs">
                  • showing parts compatible with <strong>{selectedVehicle.model}</strong>
                </span>
              )}
            </div>

            {/* Right: Sort and View Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <SortControl
                currentSort={sort}
                onSortChange={setSort}
              />
              <div className="h-4 w-px bg-gray-200" />
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>

          {/* Product Cards Grid / List / Skeletons */}
          {isLoading ? (
            <LoadingSkeleton count={limit} viewMode={viewMode} />
          ) : products.length === 0 ? (
            <EmptyState
              searchQuery={filters.searchQuery}
              hasFilters={activeFilterCount > 0}
              onClearFilters={handleResetFilters}
              onResetSearch={() => {
                setFilters(prev => ({ ...prev, searchQuery: '' }));
                setPage(1);
              }}
              onSelectSuggestionQuery={(q) => {
                setFilters(prev => ({ ...prev, searchQuery: q }));
                setPage(1);
              }}
              onOpenVehicleSelector={() => setIsSelectorModalOpen(true)}
            />
          ) : (
            <>
              <ProductGrid
                products={products}
                viewMode={viewMode}
                onViewDetails={(p) => {
                  if (onSelectProduct) onSelectProduct(p);
                }}
                onViewCompatibleVehicles={(p) => setCompatibleModalProduct(p)}
              />

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </>
          )}
        </main>
      </div>

      {/* 4. Modals & Drawers */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        facets={facets}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        onOpenVehicleSelector={() => setIsSelectorModalOpen(true)}
        activeFilterCount={activeFilterCount}
        totalFilteredCount={totalItems}
      />

      <CompatibleVehiclesModal
        product={compatibleModalProduct}
        isOpen={!!compatibleModalProduct}
        onClose={() => setCompatibleModalProduct(null)}
      />
    </div>
  );
};
