import React from 'react';
import { ShoppingCart, Zap, SlidersHorizontal, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCompare } from '../../context/CompareContext';

interface MobilePurchaseBarProps {
  product: Product;
  onAddToCart: () => void;
  onBuyNow: () => void;
  inStock: boolean;
}

export const MobilePurchaseBar: React.FC<MobilePurchaseBarProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  inStock
}) => {
  const { addToCompare, isInCompare } = useCompare();
  const compared = isInCompare(product.id);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 px-4 shadow-2xl flex items-center justify-between gap-3">
      {/* Price & thumbnail info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
        />
        <div className="min-w-0">
          <div className="text-base font-black text-gray-950 font-mono leading-none">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block truncate">
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Compare Icon Button */}
        <button
          type="button"
          onClick={() => addToCompare(product)}
          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
            compared
              ? 'bg-blue-50 border-[#0B56D0] text-[#0B56D0]'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
          title={compared ? 'In Comparison' : 'Add to Compare'}
        >
          {compared ? <Check className="w-4 h-4 stroke-[3]" /> : <SlidersHorizontal className="w-4 h-4" />}
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!inStock}
          className="py-2.5 px-3.5 bg-[#FFBA00] hover:bg-[#EAA500] disabled:opacity-50 text-gray-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-gray-950" />
          <span>Cart</span>
        </button>

        {/* Buy Now */}
        <button
          type="button"
          onClick={onBuyNow}
          disabled={!inStock}
          className="py-2.5 px-4 bg-[#0B56D0] hover:bg-[#0947AD] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
