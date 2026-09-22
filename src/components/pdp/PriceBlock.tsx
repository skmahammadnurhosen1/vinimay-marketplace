import React from 'react';
import { Tag, Shield } from 'lucide-react';

interface PriceBlockProps {
  price: number;
  mrp: number;
  discountPercentage: number;
}

export const PriceBlock: React.FC<PriceBlockProps> = ({
  price,
  mrp,
  discountPercentage
}) => {
  const savings = mrp > price ? mrp - price : 0;

  return (
    <div className="p-4 sm:p-5 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-2">
      <div className="flex flex-wrap items-baseline gap-3">
        {/* Main Selling Price */}
        <span className="text-3xl sm:text-4xl font-extrabold text-stone-950 font-mono tracking-tight">
          ₹{price.toLocaleString('en-IN')}
        </span>

        {/* MRP */}
        {mrp > price && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-400 font-medium">MRP:</span>
            <span className="text-sm sm:text-base text-stone-400 line-through font-mono">
              ₹{mrp.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Discount Savings Tag */}
        {discountPercentage > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
            <Tag className="w-3 h-3" />
            <span>Save ₹{savings.toLocaleString('en-IN')} ({discountPercentage}% OFF)</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
        <Shield className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
        <span>Inclusive of 18% GST & complimentary Pan-India transit insurance</span>
      </div>
    </div>
  );
};
