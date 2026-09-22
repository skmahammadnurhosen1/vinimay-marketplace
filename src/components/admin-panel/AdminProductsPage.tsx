import React, { useState } from 'react';
import {
  Package,
  Layers,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Tag,
  ChevronRight,
  FolderPlus,
} from 'lucide-react';
import {
  AdminProductListing,
  AdminCategory,
  AdminProductApprovalStatus,
  AdminQualityTier,
} from '../../types/admin';
import { AdminProductReviewModal } from './AdminProductReviewModal';

interface AdminProductsPageProps {
  products: AdminProductListing[];
  categories: AdminCategory[];
  onUpdateProductStatus: (productId: string, status: AdminProductApprovalStatus) => void;
  onAddCategory: (name: string, subcategories: string[]) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({
  products,
  categories,
  onUpdateProductStatus,
  onAddCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'categories'>('queue');
  const [selectedProduct, setSelectedProduct] = useState<AdminProductListing | null>(null);

  // Filters
  const [qualityFilter, setQualityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category modal
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSubs, setNewCatSubs] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredProducts = products.filter((p) => {
    const matchesQuality = qualityFilter === 'all' || p.qualityTier === qualityFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.mpn.toLowerCase().includes(query) ||
      p.sellerName.toLowerCase().includes(query);
    return matchesQuality && matchesStatus && matchesSearch;
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const subs = newCatSubs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onAddCategory(newCatName.trim(), subs.length > 0 ? subs : ['General Replacement Parts']);
    setNewCatName('');
    setNewCatSubs('');
    setIsAddCategoryModalOpen(false);
    alert(`Category "${newCatName}" created successfully.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span>Product Catalog & Quality Governance</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Audit merchant submissions, verify OEM / Genuine certifications, and structure catalog hierarchies.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approval Queue ({products.filter((p) => p.status === 'Pending Review').length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Category Management ({categories.length})
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <>
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by part name, brand, MPN, seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
              >
                <option value="all">All Quality Tiers</option>
                <option value="Genuine">Genuine Grade</option>
                <option value="OEM">OEM Grade</option>
                <option value="Aftermarket">Aftermarket Grade</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
              >
                <option value="all">All Approval Statuses</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Requires Clarification">Requires Clarification</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-4">Product Part Details</th>
                    <th className="p-3.5">Quality Tier</th>
                    <th className="p-3.5">Category & System</th>
                    <th className="p-3.5">Seller Origin</th>
                    <th className="p-3.5">Part Numbers</th>
                    <th className="p-3.5">Price & Stock</th>
                    <th className="p-3.5">Review Status</th>
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition">
                      {/* Product Thumbnail & Title */}
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-gray-900 text-xs block line-clamp-1 max-w-xs">
                              {product.title}
                            </span>
                            <span className="text-[11px] text-gray-700">
                              Brand: <strong className="text-gray-800">{product.brand}</strong>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Quality Tier */}
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            product.qualityTier === 'Genuine'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : product.qualityTier === 'OEM'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {product.qualityTier}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 text-gray-700">
                        <span className="font-semibold text-gray-900 block">{product.category}</span>
                        <span className="text-[11px] text-gray-700">{product.subCategory}</span>
                      </td>

                      {/* Seller */}
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-900 block line-clamp-1 max-w-[150px]">
                          {product.sellerName}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-medium">
                          {product.sellerType}
                        </span>
                      </td>

                      {/* Part Numbers */}
                      <td className="p-3.5 font-mono text-[11px]">
                        <span className="text-gray-900 font-bold block">MPN: {product.mpn}</span>
                        <span className="text-gray-700">OEM: {product.oemRef}</span>
                      </td>

                      {/* Price & Stock */}
                      <td className="p-3.5">
                        <span className="font-bold text-emerald-600 block">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-[11px] text-gray-700">
                          {product.stock} units ({product.fitmentCount} fits)
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            product.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : product.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : product.status === 'Requires Clarification'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {product.status === 'Approved' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{product.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span>Review SKU</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Category Management Tab */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Marketplace Parts Taxonomy & Category Tree
              </h2>
              <p className="text-xs text-gray-700">
                Configure automotive part categories, sub-system groupings, and compatibility hierarchies.
              </p>
            </div>

            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-lg bg-gray-100 text-gray-800 font-black">
                      <Layers className="w-5 h-5 text-[#C59B27]" />
                    </span>
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                      slug: /{cat.slug}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 mb-1">{cat.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
                    <span>
                      <strong className="text-gray-900">{cat.partCount}</strong> Active SKUs
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-gray-900">{cat.sellerCount}</strong> Vendors
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      Sub-assemblies & Subcategories ({cat.subcategories.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-bold">Active in Catalog</span>
                  <button
                    onClick={() => {
                      const newSub = prompt(`Add a new sub-category to ${cat.name}:`);
                      if (newSub && newSub.trim()) {
                        cat.subcategories.push(newSub.trim());
                        alert(`Added "${newSub}" to ${cat.name}`);
                      }
                    }}
                    className="text-[#C59B27] font-bold hover:underline cursor-pointer"
                  >
                    + Add Sub-group
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Review Modal */}
      {selectedProduct && (
        <AdminProductReviewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdateStatus={(id, status) => {
            onUpdateProductStatus(id, status);
            setSelectedProduct((prev) => (prev ? { ...prev, status } : null));
          }}
        />
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#C59B27]" />
              <span>Define New Marketplace Category</span>
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Add major vehicle subsystem taxonomy.
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engine Components, Exhaust & Emission"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Subcategories (comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Timing Belts, Piston Rings, Head Gaskets, Oil Filters"
                  value={newCatSubs}
                  onChange={(e) => setNewCatSubs(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-bold cursor-pointer shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
