import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { POPULAR_PRODUCTS } from '../../data/products';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';

interface WishlistDrawerProps {
  onViewProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onViewProduct }) => {
  const { wishlistIds, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!isWishlistOpen) return null;

  const savedProducts = POPULAR_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    showToast('Moved to Cart', `${product.title} has been moved to your cart.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C0E11]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E2DDD0] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="text-base font-bold text-stone-900">Saved Spare Parts</h3>
              <span className="text-xs bg-stone-200 px-2 py-0.5 rounded-full font-bold text-stone-700">
                {savedProducts.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {savedProducts.length > 0 ? (
              savedProducts.map(product => (
                <div key={product.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 rounded-xl object-contain bg-[#F8F7F3] border border-stone-200 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          onViewProduct(product);
                          setIsWishlistOpen(false);
                        }}
                        className="text-xs font-bold text-stone-900 hover:text-[#8D6B14] cursor-pointer truncate"
                      >
                        {product.title}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                      {product.brand} • {product.partNumber}
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-xs font-bold text-stone-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="px-2.5 py-1 bg-[#16181D] hover:bg-[#252830] text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#C59B27]" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-stone-500 space-y-3">
                <Heart className="w-12 h-12 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800">No Saved Parts Yet</h4>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Click the heart icon on any product card to bookmark parts for quick reference.
                </p>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-stone-200 bg-[#FAF9F6]">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsWishlistOpen(false)}
              className="w-full"
            >
              Continue Browsing Catalog
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
