import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Tag,
  Car,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { SellerProduct, SellerNavTab } from '../../types/seller';

interface SellerProductsPageProps {
  products: SellerProduct[];
  onSelectTab: (tab: SellerNavTab) => void;
  onToggleStatus: (id: string) => void;
  onPreviewProduct: (product: SellerProduct) => void;
  onEditProduct: (product: SellerProduct) => void;
}

export const SellerProductsPage: React.FC<SellerProductsPageProps> = ({
  products,
  onSelectTab,
  onToggleStatus,
  onPreviewProduct,
  onEditProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'brake-system', name: 'Brake System' },
    { id: 'ignition-system', name: 'Ignition System' },
    { id: 'fuel-system', name: 'Fuel System' },
    { id: 'electrical-system', name: 'Electrical System' },
    { id: 'suspension-steering', name: 'Suspension & Steering' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.oemNumber && p.oemNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuality = selectedQuality === 'all' || p.partType === selectedQuality;

      return matchSearch && matchCat && matchQuality;
    });
  }, [products, searchQuery, selectedCategory, selectedQuality]);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Genuine':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'OEM':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Action & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-stone-900">
            Catalog Listings ({filteredProducts.length})
          </h2>
          <p className="text-xs text-stone-500">
            Automotive spare parts registered under your merchant account
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-stone-50">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-stone-950' : 'text-stone-400 hover:text-stone-700'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-stone-950' : 'text-stone-400 hover:text-stone-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('add_product')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#16181D] hover:bg-stone-800 text-[#E8D5A3] font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C59B27]" />
            <span>Add New Part</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by part title, Part No., or OEM No...."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C59B27] shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:outline-none focus:border-[#C59B27] shadow-2xs cursor-pointer"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quality Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedQuality}
            onChange={e => setSelectedQuality(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:outline-none focus:border-[#C59B27] shadow-2xs cursor-pointer"
          >
            <option value="all">All Quality Tiers</option>
            <option value="Genuine">Genuine Only</option>
            <option value="OEM">OEM Only</option>
            <option value="Aftermarket">Aftermarket Only</option>
          </select>
        </div>
      </div>

      {/* Product Content: Table or Grid */}
      {filteredProducts.length > 0 ? (
        viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200 text-xs">
                <thead className="bg-stone-50 text-stone-700 font-bold">
                  <tr>
                    <th className="px-4 py-3 text-left">Product & Part Details</th>
                    <th className="px-4 py-3 text-left">Quality Tier</th>
                    <th className="px-4 py-3 text-left">Fitment Count</th>
                    <th className="px-4 py-3 text-left">Stock Units</th>
                    <th className="px-4 py-3 text-left">Pricing</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Product details */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || '/assets/cat_engine.jpg'}
                            alt=""
                            className="w-11 h-11 rounded-lg object-contain border border-stone-200 bg-stone-50 p-1 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-stone-950 block truncate">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono mt-0.5">
                              <span>PN: <strong>{p.partNumber}</strong></span>
                              {p.oemNumber && (
                                <span>• OEM: <strong>{p.oemNumber}</strong></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getBadgeColor(
                            p.partType
                          )}`}
                        >
                          {p.partType}
                        </span>
                      </td>

                      {/* Compatibility count */}
                      <td className="px-4 py-3.5 text-stone-600">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Car className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span>{p.compatibility.length} Vehicles</span>
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`font-mono font-bold ${
                            p.stockCount <= p.lowStockThreshold ? 'text-rose-600' : 'text-stone-900'
                          }`}
                        >
                          {p.stockCount} units
                        </span>
                        {p.stockCount <= p.lowStockThreshold && (
                          <span className="text-[10px] text-rose-600 font-semibold block">
                            Low stock alert
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 font-mono">
                        <span className="font-bold text-stone-950 block">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-400 line-through block">
                          MRP: ₹{p.mrp.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(p.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer border ${
                            p.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          {p.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => onPreviewProduct(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Preview Customer Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditProduct(p)}
                          className="p-1.5 text-stone-500 hover:text-[#C59B27] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Part"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Product Cards */}
            <div className="md:hidden divide-y divide-stone-100">
              {filteredProducts.map(p => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.images[0] || '/assets/cat_engine.jpg'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-contain border border-stone-200 bg-stone-50 p-1 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase tracking-wider ${getBadgeColor(
                            p.partType
                          )}`}
                        >
                          {p.partType}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            p.status === 'active' ? 'text-emerald-700' : 'text-stone-400'
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-2">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                        PN: {p.partNumber}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Price</span>
                      <span className="font-mono font-bold text-stone-950">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block">Stock</span>
                      <span
                        className={`font-mono font-bold ${
                          p.stockCount <= p.lowStockThreshold ? 'text-rose-600' : 'text-stone-900'
                        }`}
                      >
                        {p.stockCount} units
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block">Fitment</span>
                      <span className="font-semibold text-stone-800">
                        {p.compatibility.length} Cars
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(p.id)}
                      className="text-xs font-semibold text-stone-600 hover:underline cursor-pointer"
                    >
                      Toggle {p.status === 'active' ? 'to Draft' : 'to Active'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPreviewProduct(p)}
                        className="px-2.5 py-1 text-xs font-bold text-stone-700 bg-stone-100 rounded-lg"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditProduct(p)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-[#16181D] rounded-lg"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl bg-stone-50 border border-stone-100 p-3 mb-3 flex items-center justify-center">
                    <img
                      src={p.images[0] || '/assets/cat_engine.jpg'}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getBadgeColor(
                        p.partType
                      )}`}
                    >
                      {p.partType}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                    {p.title}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-mono mt-1">
                    Part No: {p.partNumber}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-stone-950 font-mono">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-400 line-through font-mono ml-1.5">
                        ₹{p.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold ${
                        p.stockCount <= p.lowStockThreshold ? 'text-rose-600' : 'text-stone-700'
                      }`}
                    >
                      {p.stockCount} in stock
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onPreviewProduct(p)}
                      className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProduct(p)}
                      className="flex-1 py-1.5 px-2 bg-[#16181D] hover:bg-stone-800 text-white text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">No spare parts match your filters</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or register a new part.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedQuality('all');
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
