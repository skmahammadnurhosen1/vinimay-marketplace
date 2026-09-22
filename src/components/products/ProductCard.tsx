import React from 'react';
import { Heart, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast('Added to Cart', `${product.title} has been added to your cart.`, 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!isFavorited) {
      showToast('Saved to Wishlist', `${product.title} bookmarked.`, 'info');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-[#0B56D0] p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 h-full group min-w-0 overflow-hidden">
      {/* Top Standardized Fixed Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-2.5 sm:mb-3 flex items-center justify-center">
        {/* Yellow Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-[#FFBA00] text-gray-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs">
            {product.discountPercentage}% OFF
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Uniform Sized Product Image */}
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 cursor-pointer"
          onClick={() => onViewDetails(product)}
        />
      </div>

      {/* Product Details Area */}
      <div className="flex-1 flex flex-col justify-between space-y-1.5 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-0.5">
            <span className="truncate mr-1">{product.brand}</span>
            <span className="inline-block bg-[#E9F0FE] text-[#0B56D0] text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">
              {product.partType}
            </span>
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="text-xs sm:text-sm font-bold text-gray-900 leading-snug hover:text-[#0B56D0] cursor-pointer line-clamp-1"
            title={product.title}
          >
            {product.title}
          </h3>

          <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
            Part No: {product.partNumber}
          </div>

          {/* Compatibility Pill */}
          <div className="pt-1 min-w-0">
            <span className="inline-flex items-center gap-1 bg-[#E8F8F2] text-[#00875A] text-[9px] font-semibold px-2 py-0.5 rounded-md w-full truncate">
              <Check className="w-2.5 h-2.5 stroke-[3] shrink-0" />
              <span className="truncate">Compatible with your vehicle</span>
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] pt-1">
            <Star className="w-3 h-3 text-[#FFBA00] fill-[#FFBA00]" />
            <span className="font-bold text-gray-800">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Delivery */}
        <div className="pt-1.5 border-t border-gray-100 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-sm font-extrabold text-gray-950">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[9px] text-emerald-600 font-bold ml-auto shrink-0">
              {product.discountPercentage}% OFF
            </span>
          </div>

          <div className="text-[10px] text-gray-500 mt-0.5 truncate">
            {product.deliveryTime}
          </div>
        </div>
      </div>

      {/* Buttons Row - Responsive Layout */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          className="w-full py-1.5 sm:py-2 px-2 bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold text-[10px] rounded-lg transition-colors cursor-pointer text-center shadow-xs"
        >
          Add to Cart
        </button>

        <button
          onClick={() => onViewDetails(product)}
          className="w-full py-1.5 sm:py-2 px-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-[10px] rounded-lg border border-gray-300 transition-colors cursor-pointer text-center"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
