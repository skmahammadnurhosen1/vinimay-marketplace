import { ALL_PRODUCTS } from '../data/products';
import {
  Product,
  SelectedVehicle,
  ProductFilterState,
  SortOption,
  PaginationResult,
  FilterFacets,
  SearchSuggestionGroup,
  SearchSuggestionItem
} from '../types';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductByIdOrSlug(identifier: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getCompatibleProducts(vehicle: SelectedVehicle): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  filterProducts(
    filters: ProductFilterState,
    sort: SortOption,
    page: number,
    limit: number,
    selectedVehicle?: SelectedVehicle | null
  ): Promise<PaginationResult<Product>>;
  getFilterFacets(filters?: Partial<ProductFilterState>): Promise<FilterFacets>;
  getSearchSuggestions(query: string): Promise<SearchSuggestionGroup[]>;
}

class MockProductService implements IProductService {
  async getAllProducts(): Promise<Product[]> {
    return ALL_PRODUCTS;
  }

  async getPopularProducts(): Promise<Product[]> {
    return ALL_PRODUCTS.filter(p => p.isPopular || p.isFeatured);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return ALL_PRODUCTS.find(p => p.id === id);
  }

  async getProductByIdOrSlug(identifier: string): Promise<Product | undefined> {
    const clean = identifier.trim().toLowerCase();
    return ALL_PRODUCTS.find(
      p => p.id.toLowerCase() === clean ||
           (p.slug && p.slug.toLowerCase() === clean) ||
           p.partNumber.toLowerCase() === clean
    );
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (!categoryId || categoryId === 'all') return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(p => p.category === categoryId);
  }

  async getCompatibleProducts(vehicle: SelectedVehicle): Promise<Product[]> {
    if (!vehicle || !vehicle.model) return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(product => this.checkCompatibility(product, vehicle));
  }

  private checkCompatibility(product: Product, vehicle: SelectedVehicle): boolean {
    if (!vehicle || !vehicle.model) return false;
    const vMake = vehicle.manufacturer.toLowerCase();
    const vModel = vehicle.model.toLowerCase();

    return product.compatibility.some(c => {
      const cMake = c.manufacturer.toLowerCase();
      const cModel = c.model.toLowerCase();
      const matchMake = cMake.includes(vMake) || vMake.includes(cMake) || (vMake.includes('tata') && cMake.includes('tata'));
      const matchModel = cModel.includes(vModel) || vModel.includes(cModel) || (vModel.includes('ace') && cModel.includes('ace'));
      return matchMake && matchModel;
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.oemNumber.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.compatibility.some(c => c.model.toLowerCase().includes(q) || c.manufacturer.toLowerCase().includes(q))
    );
  }

  async filterProducts(
    filters: ProductFilterState,
    sort: SortOption = 'relevance',
    page: number = 1,
    limit: number = 12,
    selectedVehicle?: SelectedVehicle | null
  ): Promise<PaginationResult<Product>> {
    let filtered = [...ALL_PRODUCTS];

    // 1. Search Query
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.oemNumber.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.compatibility.some(c => c.model.toLowerCase().includes(q) || c.manufacturer.toLowerCase().includes(q))
      );
    }

    // 2. Category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // 3. Subcategories
    if (filters.subCategories && filters.subCategories.length > 0) {
      filtered = filtered.filter(p => filters.subCategories.includes(p.subCategory));
    }

    // 4. Brands
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    // 5. Part Types (Genuine, OEM, Aftermarket)
    if (filters.partTypes && filters.partTypes.length > 0) {
      filtered = filtered.filter(p => filters.partTypes.includes(p.partType));
    }

    // 6. Price Range
    if (filters.priceRange) {
      if (typeof filters.priceRange.min === 'number') {
        filtered = filtered.filter(p => p.price >= filters.priceRange.min);
      }
      if (typeof filters.priceRange.max === 'number' && filters.priceRange.max > 0) {
        filtered = filtered.filter(p => p.price <= filters.priceRange.max);
      }
    }

    // 7. Part Number / OEM exact or partial match
    if (filters.partNumberQuery && filters.partNumberQuery.trim().length > 0) {
      const pn = filters.partNumberQuery.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.partNumber.toLowerCase().includes(pn) ||
        p.oemNumber.toLowerCase().includes(pn)
      );
    }

    // 8. Rating
    if (filters.minRating && filters.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }

    // 9. In Stock Only
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // 10. Fast Delivery Only
    if (filters.fastDeliveryOnly) {
      filtered = filtered.filter(p => p.deliveryTime.toLowerCase().includes('2-3'));
    }

    // 11. Seller Tiers
    if (filters.sellerTiers && filters.sellerTiers.length > 0) {
      filtered = filtered.filter(p => filters.sellerTiers.includes(p.seller.tier));
    }

    // 12. Vehicle Compatibility
    if (filters.compatibleVehicleOnly && selectedVehicle) {
      filtered = filtered.filter(p => this.checkCompatibility(p, selectedVehicle));
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'relevance':
      default:
        // Featured and popular first, then by rating
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validatedPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (validatedPage - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page: validatedPage,
      totalPages,
      limit
    };
  }

  async getFilterFacets(filters: Partial<ProductFilterState> = {}): Promise<FilterFacets> {
    // Calculate counts based on current items
    const baseList = ALL_PRODUCTS;

    const categories: Record<string, number> = {};
    const subCategories: Record<string, number> = {};
    const brands: Record<string, number> = {};
    const partTypes: Record<string, number> = {};
    const sellerTiers: Record<string, number> = {};

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    baseList.forEach(p => {
      // Categories
      categories[p.category] = (categories[p.category] || 0) + 1;

      // Subcategories
      subCategories[p.subCategory] = (subCategories[p.subCategory] || 0) + 1;

      // Brands
      brands[p.brand] = (brands[p.brand] || 0) + 1;

      // Part Types
      partTypes[p.partType] = (partTypes[p.partType] || 0) + 1;

      // Seller Tiers
      sellerTiers[p.seller.tier] = (sellerTiers[p.seller.tier] || 0) + 1;

      // Price limits
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;
    });

    return {
      categories,
      subCategories,
      brands,
      partTypes,
      sellerTiers,
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice: maxPrice === -Infinity ? 25000 : maxPrice,
      totalCount: baseList.length
    };
  }

  async getSearchSuggestions(query: string): Promise<SearchSuggestionGroup[]> {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const groups: SearchSuggestionGroup[] = [];

    // 1. Products (top 3)
    const matchingProducts = ALL_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q)
    ).slice(0, 3);

    if (matchingProducts.length > 0) {
      groups.push({
        type: 'product',
        label: 'Spare Parts',
        items: matchingProducts.map(p => ({
          id: `sug-prod-${p.id}`,
          title: `${p.brand} ${p.title}`,
          subtitle: `Part No: ${p.partNumber} • ₹${p.price.toLocaleString('en-IN')}`,
          type: 'product',
          category: p.category,
          badge: p.partType,
          targetQuery: p.title
        }))
      });
    }

    // 2. Part Numbers / OEM Numbers
    const matchingParts = ALL_PRODUCTS.filter(p =>
      p.partNumber.toLowerCase().includes(q) ||
      p.oemNumber.toLowerCase().includes(q)
    ).slice(0, 3);

    if (matchingParts.length > 0) {
      groups.push({
        type: 'partNumber',
        label: 'Part & OEM Numbers',
        items: matchingParts.map(p => ({
          id: `sug-pn-${p.id}`,
          title: p.partNumber,
          subtitle: `OEM: ${p.oemNumber} (${p.brand} ${p.title})`,
          type: 'partNumber',
          targetQuery: p.partNumber
        }))
      });
    }

    // 3. Brands
    const allBrands = Array.from(new Set(ALL_PRODUCTS.map(p => p.brand)));
    const matchingBrands = allBrands.filter(b => b.toLowerCase().includes(q)).slice(0, 3);

    if (matchingBrands.length > 0) {
      groups.push({
        type: 'brand',
        label: 'Brands',
        items: matchingBrands.map(b => ({
          id: `sug-brand-${b}`,
          title: b,
          subtitle: `View all ${b} spare parts`,
          type: 'brand',
          targetQuery: b
        }))
      });
    }

    // 4. Vehicles
    const vehicleNames = [
      'Tata Ace Gold',
      'Tata Ace',
      'Maruti Suzuki Swift',
      'Hyundai Creta',
      'Mahindra Bolero',
      'Mahindra Thar',
      'Toyota Innova Crysta',
      'Ashok Leyland Dost+',
      'Tata 407 Gold'
    ];
    const matchingVehicles = vehicleNames.filter(v => v.toLowerCase().includes(q)).slice(0, 3);

    if (matchingVehicles.length > 0) {
      groups.push({
        type: 'vehicle',
        label: 'Vehicles',
        items: matchingVehicles.map(v => ({
          id: `sug-veh-${v}`,
          title: v,
          subtitle: `Spare parts compatible with ${v}`,
          type: 'vehicle',
          targetQuery: v
        }))
      });
    }

    // 5. Categories
    const categoryNames = [
      { name: 'Brake Parts', slug: 'brake-parts' },
      { name: 'Clutch Parts', slug: 'clutch-parts' },
      { name: 'Suspension', slug: 'suspension' },
      { name: 'Gearbox & Transmission', slug: 'gearbox-transmission' },
      { name: 'Differential & Axle', slug: 'differential-axle' },
      { name: 'Engine Parts', slug: 'engine-parts' },
      { name: 'Electrical Parts', slug: 'electrical-parts' }
    ];
    const matchingCategories = categoryNames.filter(c => c.name.toLowerCase().includes(q)).slice(0, 2);

    if (matchingCategories.length > 0) {
      groups.push({
        type: 'category',
        label: 'Categories',
        items: matchingCategories.map(c => ({
          id: `sug-cat-${c.slug}`,
          title: c.name,
          subtitle: 'Browse category',
          type: 'category',
          targetQuery: c.name
        }))
      });
    }

    return groups;
  }
}

export const productService = new MockProductService();
