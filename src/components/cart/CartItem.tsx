import React from 'react';
import { Trash2, Heart, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { CartItem as CartItemType, Product } from '../../types';
import { QuantitySelector } from './QuantitySelector';
import { CompatibilityNotice } from './CompatibilityNotice';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const CartItemRow: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onSelectProduct
}) => {
  const { product, quantity } = item;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isSaved = isInWishlist(product.id);
  const maxStock = product.stockCount ?? 99;
  const isOutOfStock = !product.inStock || maxStock === 0;
  const isLowStock = product.inStock && maxStock <= 3;

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    showToast(
      isSaved ? 'Removed from Wishlist' : 'Saved to Wishlist',
      `${product.title} has been ${isSaved ? 'removed from' : 'saved to'} your wishlist.`,
      'info'
    );
  };

  const lineTotal = product.price * quantity;
  const lineMrp = product.mrp * quantity;
  const lineSavings = Math.max(0, lineMrp - lineTotal);

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0 space-y-3">
      <div className="flex gap-3 sm:gap-4 items-start">
        {/* Product Thumbnail */}
        <div
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 border border-gray-200 p-2 shrink-0 cursor-pointer hover:border-blue-300 transition-colors flex items-center justify-center"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply"
          />
          {product.partType && (
            <span
              className={`absolute top-1 left-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs ${
                product.partType === 'Genuine'
                  ? 'bg-emerald-600 text-white'
                  : product.partType === 'OEM'
                  ? 'bg-[#0B56D0] text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {product.partType}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {product.brand}
              </span>
              <h4
                onClick={() => onSelectProduct && onSelectProduct(product)}
                className="text-xs sm:text-sm font-bold text-gray-900 leading-snug hover:text-[#0B56D0] transition-colors cursor-pointer line-clamp-2"
              >
                {product.title}
              </h4>
            </div>

            {/* Remove item button */}
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove item"
              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer shrink-0"
              title="Remove from cart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Part Numbers */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 font-mono mt-1">
            <span>Part: <strong className="text-gray-700">{product.partNumber}</strong></span>
            {product.oemNumber && (
              <span>OEM: <strong className="text-gray-700">{product.oemNumber}</strong></span>
            )}
          </div>

          {/* Stock state pills */}
          <div className="mt-1.5 flex items-center gap-2">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" />
                Temporarily Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                <Clock className="w-3 h-3" />
                Only {maxStock} units left in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                In Stock & Ready to Dispatch
              </span>
            )}
          </div>

          {/* Compatibility Notice */}
          <div className="mt-2">
            <CompatibilityNotice product={product} />
          </div>

          {/* Pricing & Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 border-t border-gray-50">
            {/* Quantity Controls & Wishlist */}
            <div className="flex items-center gap-3">
              <QuantitySelector
                quantity={quantity}
                maxStock={maxStock}
                onIncrease={() => onUpdateQuantity(quantity + 1)}
                onDecrease={() => onUpdateQuantity(quantity - 1)}
                disabled={isOutOfStock}
              />

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  isSaved
                    ? 'text-red-600 hover:text-red-700 font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save for later'}</span>
              </button>
            </div>

            {/* Price block */}
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-sm sm:text-base font-extrabold text-gray-950">
                  ₹{lineTotal.toLocaleString('en-IN')}
                </span>
                {lineMrp > lineTotal && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{lineMrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {lineSavings > 0 && (
                <div className="text-[10px] font-bold text-emerald-600">
                  Save ₹{lineSavings.toLocaleString('en-IN')} ({product.discountPercentage}% off)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
