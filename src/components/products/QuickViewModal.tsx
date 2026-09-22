import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Car
} from 'lucide-react';
import { Product } from '../../types';
import { useVehicle } from '../../context/VehicleContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { PartTypeBadge } from '../common/Badge';
import { StarRating } from '../common/StarRating';
import { Button } from '../common/Button';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { selectedVehicle, isVehicleCompatible } = useVehicle();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'seller'>('specs');

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);
  const isCompatible = isVehicleCompatible(product);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast('Added to Cart', `${quantity}x ${product.title} added to your cart.`, 'success');
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    if (!isFavorited) {
      showToast('Wishlist Updated', `${product.title} added to your saved parts.`, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C0E11]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-left">
        <div
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E4DFD2] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Left Column: Image Gallery & Badges */}
            <div className="md:col-span-5 p-6 bg-[#FAF9F6] border-b md:border-b-0 md:border-r border-stone-200 flex flex-col justify-between">
              <div>
                {/* Main Large Image */}
                <div className="relative aspect-square w-full rounded-2xl bg-white border border-stone-200 p-6 flex items-center justify-center overflow-hidden mb-4 shadow-xs">
                  <img
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#C59B27] text-white text-xs font-bold shadow-xs">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex items-center gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`w-14 h-14 rounded-xl border p-1 bg-white cursor-pointer transition-all ${
                          activeImageIndex === i
                            ? 'border-[#C59B27] ring-2 ring-[#C59B27]/30'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Trust Badges Strip on Left Column */}
              <div className="mt-6 pt-6 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{product.warranty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{product.returnDays}-Day Easy Return Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{product.deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Product Info */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Badge Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                      {product.brand}
                    </span>
                    <span className="text-stone-300">•</span>
                    <PartTypeBadge type={product.partType} />
                  </div>
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-[#16181D] leading-snug">
                  {product.title}
                </h2>

                {/* Part Codes Pill Box */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <div className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-800">
                    <span className="text-stone-500 font-sans mr-1">Part No:</span>
                    <span className="font-bold">{product.partNumber}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-800">
                    <span className="text-stone-500 font-sans mr-1">OEM Ref:</span>
                    <span className="font-bold">{product.oemNumber}</span>
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E9DFCA] flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-sm text-stone-400 line-through font-medium">
                          MRP ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Price inclusive of all GST taxes & authorized distributor invoice.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    In Stock ({product.stockCount} units)
                  </span>
                </div>

                {/* Active Compatibility Check Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
                    selectedVehicle && isCompatible
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : selectedVehicle && !isCompatible
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <Car className="w-5 h-5 shrink-0 text-[#C59B27]" />
                  <div>
                    {selectedVehicle ? (
                      isCompatible ? (
                        <div>
                          <strong className="font-bold text-emerald-950">
                            ✓ Guaranteed Fitment Confirmed!
                          </strong>
                          <p className="text-[11px] text-emerald-800">
                            This component matches your {selectedVehicle.year} {selectedVehicle.manufacturer} {selectedVehicle.model}.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <strong className="font-bold text-amber-950">
                            Compatibility Warning
                          </strong>
                          <p className="text-[11px] text-amber-800">
                            This part is not matched for your {selectedVehicle.model}. Check compatibility table below.
                          </p>
                        </div>
                      )
                    ) : (
                      <span>Select your vehicle to confirm fitment before ordering.</span>
                    )}
                  </div>
                </div>

                {/* Tabs: Specifications / Compatibility / Seller */}
                <div className="border-b border-stone-200">
                  <div className="flex space-x-6 text-xs font-bold">
                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'specs'
                          ? 'border-[#C59B27] text-stone-900'
                          : 'border-transparent text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => setActiveTab('compatibility')}
                      className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'compatibility'
                          ? 'border-[#C59B27] text-stone-900'
                          : 'border-transparent text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Compatible Vehicles ({product.compatibility.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('seller')}
                      className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'seller'
                          ? 'border-[#C59B27] text-stone-900'
                          : 'border-transparent text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Seller Credentials
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="text-xs text-stone-600 min-h-[120px]">
                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                          <div className="text-[10px] text-stone-400 uppercase font-semibold">{key}</div>
                          <div className="font-semibold text-stone-900 mt-0.5">{val}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'compatibility' && (
                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {product.compatibility.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-stone-900">
                              {item.manufacturer} {item.model}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Years: {item.yearRange} {item.engine && `• ${item.engine}`}
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            Direct Fit
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'seller' && (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-sm">{product.seller.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAD8B1] text-stone-900">
                          {product.seller.tier}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Dispatch location: {product.seller.city}, {product.seller.state}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-xs text-stone-600">
                        <span>★ {product.seller.rating} Rating</span>
                        <span>•</span>
                        <span>{product.seller.reviewCount.toLocaleString()} Verified Orders</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions: Quantity + Add to Cart + Wishlist */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-3">
                {/* Quantity adjuster */}
                <div className="flex items-center rounded-xl border border-stone-300 bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-stone-900 bg-white min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  leftIcon={<ShoppingBag className="w-4 h-4 text-[#C59B27]" />}
                  className="flex-1"
                >
                  Add to Cart • ₹{(product.price * quantity).toLocaleString('en-IN')}
                </Button>

                {/* Wishlist toggle */}
                <button
                  onClick={handleWishlist}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isFavorited
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-stone-50 text-stone-600 hover:text-stone-900 border-stone-200'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
