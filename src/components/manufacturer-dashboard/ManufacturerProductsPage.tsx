import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  Car,
} from 'lucide-react';
import {
  ManufacturerProduct,
} from '../../types/manufacturer';

interface ManufacturerProductsPageProps {
  products: ManufacturerProduct[];
  onOpenAddProduct: () => void;
  onViewProduct: (product: ManufacturerProduct) => void;
  onEditProduct: (product: ManufacturerProduct) => void;
  onToggleStatus: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenStockAdjust: (product: ManufacturerProduct) => void;
}

export const ManufacturerProductsPage: React.FC<ManufacturerProductsPageProps> = ({
  products,
  onOpenAddProduct,
  onViewProduct,
  onEditProduct,
  onToggleStatus,
  onDeleteProduct,
  onOpenStockAdjust,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sales'>('sales');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = [
    'Brake',
    'Clutch',
    'Suspension',
    'Gearbox/Transmission',
    'Differential/Axle',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(query) ||
          p.partNumber.toLowerCase().includes(query) ||
          p.oemNumber.toLowerCase().includes(query) ||
          p.compatibility.some(c => c.model.toLowerCase().includes(query) || c.manufacturer.toLowerCase().includes(query));

        const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
        const matchesType = typeFilter === 'all' || p.productType === typeFilter;
        const matchesStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'low_stock'
            ? p.stock.available <= p.stock.lowStockThreshold
            : p.status === statusFilter;

        return matchesSearch && matchesCat && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') diff = a.title.localeCompare(b.title);
        else if (sortBy === 'price') diff = a.price - b.price;
        else if (sortBy === 'stock') diff = a.stock.available - b.stock.available;
        else if (sortBy === 'sales') diff = a.unitsSoldTotal - b.unitsSoldTotal;
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [products, searchTerm, categoryFilter, typeFilter, statusFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-[#0284C7]" />
            <span>Manufacturer Product Catalogue</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage genuine & OEM catalog, vehicle fitments, trade pricing, and inventory allocations.
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-semibold shadow-md shadow-[#0284C7]/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Part Listing</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Part #, OEM Ref, Title, Vehicle Model..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">All Categories (5 Core)</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">All Tiers</option>
              <option value="Genuine">Genuine OE</option>
              <option value="OEM">OEM Partner</option>
              <option value="Aftermarket">Aftermarket</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive</option>
              <option value="low_stock">Low Stock Alert</option>
            </select>
          </div>
        </div>

        {/* Results count & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
            <span>SKUs listed</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[11px] text-[#0284C7] hover:underline ml-2 cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="py-1 px-2 text-[11px] rounded-lg bg-white border border-gray-300 text-gray-800 focus:outline-none"
            >
              <option value="sales">Sales Volume</option>
              <option value="name">Part Name</option>
              <option value="price">Trade Price</option>
              <option value="stock">Stock Available</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-gray-200 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No Matching Products Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your filters, changing search terms, or add a new part listing to the catalogue.
          </p>
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            + Add Product Now
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Responsive Table */}
          <div className="hidden md:block rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Part / Title</th>
                    <th className="py-3 px-4">Numbers (MPN / OEM)</th>
                    <th className="py-3 px-4">Category / Tier</th>
                    <th className="py-3 px-4">Compatibility</th>
                    <th className="py-3 px-4">Trade Price / MRP</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map(p => {
                    const isLowStock = p.stock.available <= p.stock.lowStockThreshold;
                    const isOutOfStock = p.stock.available === 0;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Title & Image */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 max-w-xs">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <button
                                onClick={() => onViewProduct(p)}
                                className="font-bold text-gray-900 hover:text-[#0284C7] text-left truncate block transition cursor-pointer"
                              >
                                {p.title}
                              </button>
                              <span className="text-[10px] text-gray-500 truncate block">
                                Sold: {p.unitsSoldTotal.toLocaleString('en-IN')} units • {p.activeDealersCount} dealers
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Part Numbers */}
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="font-bold text-[#0284C7]">{p.partNumber}</div>
                          <div className="text-gray-500 text-[10px]">OEM: {p.oemNumber}</div>
                        </td>

                        {/* Category & Tier */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{p.category}</div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              p.productType === 'Genuine'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : p.productType === 'OEM'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {p.productType}
                          </span>
                        </td>

                        {/* Compatibility */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <span className="font-semibold text-gray-900">{p.compatibility.length} Models</span>
                          </div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[130px]">
                            {p.compatibility.map(c => `${c.manufacturer} ${c.model}`).slice(0, 2).join(', ')}
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900 text-xs">₹{p.price.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-gray-400 line-through">MRP: ₹{p.mrp.toLocaleString('en-IN')}</div>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900">{p.stock.available} avail</span>
                            <button
                              onClick={() => onOpenStockAdjust(p)}
                              className="text-[10px] text-[#0284C7] hover:underline cursor-pointer font-medium"
                              title="Adjust stock"
                            >
                              ±Edit
                            </button>
                          </div>
                          <div className="text-[10px]">
                            {isOutOfStock ? (
                              <span className="text-red-600 font-semibold">Out of Stock</span>
                            ) : isLowStock ? (
                              <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> Low Stock
                              </span>
                            ) : (
                              <span className="text-emerald-600 font-medium">In Stock</span>
                            )}
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onToggleStatus(p.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                              p.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                            }`}
                          >
                            {p.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewProduct(p)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                              title="View Technical Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditProduct(p)}
                              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284C7] transition cursor-pointer"
                              title="Edit Part"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                              title="Remove from Catalogue"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map(p => {
              const isLowStock = p.stock.available <= p.stock.lowStockThreshold;

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-[#0284C7] font-mono">{p.partNumber}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <h3
                        onClick={() => onViewProduct(p)}
                        className="font-bold text-xs text-gray-900 line-clamp-2 mt-0.5 hover:text-[#0284C7] cursor-pointer"
                      >
                        {p.title}
                      </h3>
                      <span className="text-[10px] text-gray-500 block font-mono mt-0.5">OEM Ref: {p.oemNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Trade Price</span>
                      <span className="font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400 line-through block">MRP ₹{p.mrp}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Available Stock</span>
                      <span className="font-bold text-gray-900">{p.stock.available} units</span>
                      <span className={`text-[10px] block ${isLowStock ? 'text-amber-600 font-semibold' : 'text-emerald-600'}`}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-gray-500">
                      {p.compatibility.length} Vehicles Compatible
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenStockAdjust(p)}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-[#0284C7] text-[11px] font-medium transition cursor-pointer"
                      >
                        Stock ±
                      </button>
                      <button
                        onClick={() => onViewProduct(p)}
                        className="px-2.5 py-1 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-semibold transition cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
