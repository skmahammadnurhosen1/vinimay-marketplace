import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Eye,
  Check,
  Copy,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Car
} from 'lucide-react';
import { Product, ViewMode } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useVehicle } from '../../context/VehicleContext';
import { useToast } from '../../context/ToastContext';
import { CompatibilityBadge } from './CompatibilityBadge';

interface DetailedProductCardProps {
  product: Product;
  viewMode?: ViewMode;
  onViewDetails: (product: Product) => void;
  onViewCompatibleVehicles: (product: Product) => void;
}

export const DetailedProductCard: React.FC<DetailedProductCardProps> = ({
  product,
  viewMode = 'grid',
  onViewDetails,
  onViewCompatibleVehicles
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { selectedVehicle, setIsSelectorModalOpen } = useVehicle();
  const { showToast } = useToast();

  const [copiedPartNumber, setCopiedPartNumber] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    showToast('Added to Cart', `${product.brand} ${product.title} added to your cart.`, 'success');
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleCopyPartNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.partNumber);
    setCopiedPartNumber(true);
    showToast('Part Number Copied', `Copied ${product.partNumber} to clipboard`, 'info');
    setTimeout(() => setCopiedPartNumber(false), 2000);
  };

  const partTypeBadgeColor = {
    Genuine: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    OEM: 'bg-blue-50 text-blue-800 border-blue-200/80',
    Aftermarket: 'bg-amber-50 text-amber-800 border-amber-200/80'
  }[product.partType];

  // ==========================================
  // LIST VIEW LAYOUT
  // ==========================================
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-400/80 hover:shadow-md transition-all duration-200 p-4 flex flex-col md:flex-row gap-5 group">
        {/* Left: Image Box */}
        <div className="w-full md:w-56 shrink-0 relative">
          <div className="aspect-[4/3] w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-3 relative cursor-pointer"
               onClick={() => onViewDetails(product)}>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {/* Authenticity Badge */}
            <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md border ${partTypeBadgeColor}`}>
              {product.partType}
            </span>
          </div>

          <div className="mt-2 text-center">
            <button
              onClick={() => onViewCompatibleVehicles(product)}
              className="text-[11px] font-semibold text-[#0B56D0] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Car className="w-3 h-3" />
              <span>Fits {product.compatibility.length} Vehicles</span>
            </button>
          </div>
        </div>

        {/* Center: Details & Fitment */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-bold text-[#0B56D0] uppercase tracking-wider">{product.brand}</span>
            <span>•</span>
            <span>{product.subCategory}</span>
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="text-base font-bold text-gray-900 hover:text-[#0B56D0] cursor-pointer transition-colors leading-snug line-clamp-2"
          >
            {product.title}
          </h3>

          {/* Part & OEM number pill */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded font-mono text-gray-800">
              <span>Part: <strong>{product.partNumber}</strong></span>
              <button
                type="button"
                onClick={handleCopyPartNumber}
                title="Copy part number"
                className="hover:text-[#0B56D0] cursor-pointer"
              >
                {copiedPartNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>
            {product.oemNumber && (
              <span className="px-2 py-0.5 bg-gray-100 rounded font-mono text-gray-700">
                OEM: <strong>{product.oemNumber}</strong>
              </span>
            )}
          </div>

          {/* Compatibility Badge */}
          <div>
            <CompatibilityBadge
              product={product}
              selectedVehicle={selectedVehicle}
              onOpenSelector={() => setIsSelectorModalOpen(true)}
              onViewCompatibleVehicles={() => onViewCompatibleVehicles(product)}
            />
          </div>

          {/* Key Specs Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1 text-gray-600">
            {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
              <div key={key} className="truncate">
                <span className="text-gray-400">{key}:</span> <span className="font-semibold text-gray-800">{val}</span>
              </div>
            ))}
          </div>

          {/* Seller line */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sold by: <strong>{product.seller.name}</strong></span>
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{product.deliveryTime}</span>
          </div>
        </div>

        {/* Right: Price & CTA Column */}
        <div className="w-full md:w-52 shrink-0 md:border-l md:border-gray-100 md:pl-5 flex flex-col justify-between pt-3 md:pt-0">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs mb-3">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-200/80">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400 text-[11px]">({product.reviewCount} reviews)</span>
            </div>

            {/* Price Box */}
            <div className="space-y-0.5">
              <div className="text-2xl font-black text-gray-950 tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="line-through text-gray-400">₹{product.mrp.toLocaleString('en-IN')}</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded text-[11px]">
                  {product.discountPercentage}% OFF
                </span>
              </div>
              <div className="text-[10px] text-gray-400 pt-0.5">Inclusive of all GST taxes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer ${
                isAdding
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFBA00] hover:bg-[#EAA500] active:scale-[0.98] text-gray-950'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewDetails(product)}
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                  showToast(
                    inWishlist ? 'Removed from Wishlist' : 'Saved to Wishlist',
                    `${product.title} ${inWishlist ? 'removed from' : 'saved to'} wishlist`,
                    'info'
                  );
                }}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  inWishlist
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GRID VIEW LAYOUT (Default)
  // ==========================================
  return (
    <div
      onClick={() => onViewDetails(product)}
      className="bg-white rounded-xl border border-gray-200 hover:border-blue-400/80 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer relative"
    >
      {/* Top Image Area */}
      <div className="relative aspect-[4/3] w-full bg-gray-50 border-b border-gray-100 flex items-center justify-center p-3 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
          loading="lazy"
        />

        {/* Authenticity Badge */}
        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold rounded-md border shadow-2xs ${partTypeBadgeColor}`}>
          {product.partType}
        </span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            showToast(
              inWishlist ? 'Removed from Wishlist' : 'Saved to Wishlist',
              `${product.title} ${inWishlist ? 'removed from' : 'saved to'} wishlist`,
              'info'
            );
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center border transition-all duration-150 cursor-pointer shadow-xs ${
            inWishlist
              ? 'border-red-200 text-red-500'
              : 'border-gray-200 text-gray-400 hover:text-red-500 hover:scale-110'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Discount tag */}
        {product.discountPercentage > 0 && (
          <span className="absolute bottom-2.5 right-2.5 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Brand & Category */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span className="font-bold text-[#0B56D0] uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1 font-semibold text-gray-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#0B56D0] transition-colors leading-snug line-clamp-2 h-10">
            {product.title}
          </h3>

          {/* Part & OEM code */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
            <span>Part: {product.partNumber}</span>
            <button
              type="button"
              onClick={handleCopyPartNumber}
              className="text-gray-400 hover:text-[#0B56D0] cursor-pointer"
              title="Copy Part Number"
            >
              {copiedPartNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Compatibility Indicator */}
        <div className="pt-1">
          <CompatibilityBadge
            product={product}
            selectedVehicle={selectedVehicle}
            onOpenSelector={() => setIsSelectorModalOpen(true)}
            onViewCompatibleVehicles={() => onViewCompatibleVehicles(product)}
            compact
          />
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-gray-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-gray-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs line-through text-gray-400">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>2-3 Days</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="py-2 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`py-2 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all duration-200 cursor-pointer ${
                isAdding
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFBA00] hover:bg-[#EAA500] active:scale-[0.98] text-gray-950'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
