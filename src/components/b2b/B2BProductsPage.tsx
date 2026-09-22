import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Car,
  CheckCircle2,
  Plus,
  Minus,
  ShoppingCart,
  Layers,
  ChevronDown,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { ALL_PRODUCTS } from '../../data/products';
import { Product, PartType } from '../../types';
import { b2bService } from '../../services/b2bService';

interface B2BProductsPageProps {
  onNavigateBulkOrder?: () => void;
  onNavigateCart?: () => void;
  initialSearchQuery?: string;
}

export const B2BProductsPage: React.FC<B2BProductsPageProps> = ({
  onNavigateBulkOrder,
  onNavigateCart,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');

  // Local state for product card quantity inputs
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
  const [addedToast, setAddedToast] = useState<{ id: string; title: string; qty: number } | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getQty = (productId: string) => quantities[productId] || 1;

  const setQty = (productId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, Math.min(500, val)),
    }));
  };

  const categories = [
    { id: 'all', name: 'All 5 Core Systems' },
    { id: 'brake-parts', name: 'Brake Systems' },
    { id: 'clutch-parts', name: 'Clutch & Drivetrain' },
    { id: 'suspension', name: 'Suspension & Steering' },
    { id: 'gearbox-transmission', name: 'Gearbox & Transmission' },
    { id: 'differential-axle', name: 'Differential & Axle' },
  ];

  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesTier = selectedTier === 'all' || p.partType === selectedTier;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.oemNumber.toLowerCase().includes(q) ||
      p.compatibility.some((c) => c.model.toLowerCase().includes(q));
    return matchesCat && matchesTier && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id);
    b2bService.addItemToCart(product, qty);
    setAddedToast({ id: product.id, title: product.title, qty });
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-[#C59B27]" />
            <span>Automotive Trade Parts Catalog & Wholesale Pricing</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Verified Passenger & Commercial Vehicle replacement parts with guaranteed OE fitment.
          </p>
        </div>

        {onNavigateBulkOrder && (
          <button
            onClick={onNavigateBulkOrder}
            className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Layers className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Open Bulk Order Matrix</span>
          </button>
        )}
      </div>

      {/* Floating Add Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16181D] text-white px-4 py-3 rounded-xl shadow-2xl border border-gray-700 text-xs flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-white block truncate max-w-xs">
              Added {addedToast.qty} units to B2B Cart
            </span>
            <span className="text-[10px] text-gray-400">{addedToast.title}</span>
          </div>
          {onNavigateCart && (
            <button
              onClick={onNavigateCart}
              className="ml-2 px-2.5 py-1 rounded bg-[#C59B27] text-gray-950 font-bold text-[10px] cursor-pointer"
            >
              View Cart
            </button>
          )}
        </div>
      )}

      {/* Category Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
              selectedCategory === c.id
                ? 'bg-[#16181D] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by part name, brand, MPN, OEM cross-ref, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Quality Tiers</option>
            <option value="Genuine">Genuine Grade</option>
            <option value="OEM">OEM Factory Grade</option>
            <option value="Aftermarket">Aftermarket Grade</option>
          </select>
        </div>
      </div>

      {/* B2B Enhanced Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const qty = getQty(product.id);
          const baseB2BPrice = b2bService.getBusinessPrice(product);
          const activeUnitPrice = b2bService.getUnitPriceForQty(product, qty);
          const bulkTiers = b2bService.getBulkTiers(product);
          const tradeDiscountPct = Math.round(((product.price - baseB2BPrice) / product.price) * 100);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image & Quality Pill */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                        product.partType === 'Genuine'
                          ? 'bg-purple-900 text-white'
                          : product.partType === 'OEM'
                          ? 'bg-blue-900 text-white'
                          : 'bg-emerald-900 text-white'
                      }`}
                    >
                      {product.partType}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C59B27] text-gray-950 shadow-xs">
                      Save {tradeDiscountPct}%
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {product.brand}
                    </span>
                    <span className="font-mono text-gray-600">MPN: {product.partNumber}</span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>

                  {/* Compatibility Pill */}
                  <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Car className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                    <span className="truncate">
                      OE Fit: {product.compatibility.map((c) => c.model).slice(0, 2).join(', ')}
                      {product.compatibility.length > 2 && ` +${product.compatibility.length - 2} more`}
                    </span>
                  </div>

                  {/* Pricing Overview */}
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-900">
                        B2B Trade Price
                      </span>
                      <span className="text-[11px] text-gray-400 line-through">
                        MRP {formatCurrency(product.price)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="text-lg font-black text-emerald-600">
                        {formatCurrency(activeUnitPrice)}
                        <span className="text-[10px] font-medium text-gray-500 ml-1">/ unit</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                        18% GST ITC Ready
                      </span>
                    </div>

                    {/* Bulk Tiers Matrix */}
                    <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-amber-200/60 text-[10px]">
                      <div className="text-center p-1 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block">10+ pcs</span>
                        <strong className="text-gray-900">{formatCurrency(bulkTiers[1].unitPrice)}</strong>
                      </div>
                      <div className="text-center p-1 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block">25+ pcs</span>
                        <strong className="text-gray-900">{formatCurrency(bulkTiers[2].unitPrice)}</strong>
                      </div>
                      <div className="text-center p-1 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block">50+ pcs</span>
                        <strong className="text-emerald-700">{formatCurrency(bulkTiers[3].unitPrice)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quantity Stepper & Add to Cart */}
              <div className="p-4 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="p-2 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={qty}
                      onChange={(e) => setQty(product.id, parseInt(e.target.value) || 1)}
                      className="w-12 text-center text-xs font-bold text-gray-900 bg-white border-x border-gray-300 py-1.5 focus:outline-none"
                    />
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="p-2 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add {qty} to B2B Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
