import React, { useState } from 'react';
import { Star, Copy, Check, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ProductHeaderProps {
  product: Product;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  const { showToast } = useToast();
  const [copiedField, setCopiedField] = useState<'part' | 'oem' | null>(null);

  const categoryLabel = product.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const handleCopy = (text: string, type: 'part' | 'oem') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    showToast('Copied to Clipboard', text, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Category & Brand Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>{product.brand} Official</span>
          </span>
          <span className="text-xs text-stone-500 font-medium">
            Category: <strong className="text-stone-800">{categoryLabel}</strong>
          </span>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Subcategory: <span className="font-bold text-stone-800">{product.subCategory}</span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-950 leading-snug tracking-tight">
        {product.title}
      </h1>

      {/* Concise Description */}
      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
        {product.description}
      </p>

      {/* Rating & Verified Purchases */}
      <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 text-amber-950 font-bold">
          <Star className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <span className="text-stone-500 font-medium">
          {product.reviewCount.toLocaleString()} Customer Reviews
        </span>
        <span className="text-stone-300">•</span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>100% Verified Purchases</span>
        </span>
      </div>

      {/* Part Identifiers Strip: Part Number, OEM Number, Manufacturer */}
      <div className="bg-stone-50/90 rounded-xl p-3 sm:p-4 border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Manufacturer Part Number */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-[11px] text-gray-500 font-medium block">Manufacturer Part Number</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-gray-950 truncate">{product.partNumber}</span>
            <button
              type="button"
              onClick={() => handleCopy(product.partNumber, 'part')}
              className="text-gray-400 hover:text-[#0B56D0] p-1 cursor-pointer transition-colors shrink-0"
              title="Copy Part Number"
            >
              {copiedField === 'part' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* OEM Cross-Reference */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-[11px] text-gray-500 font-medium block">OEM Cross-Reference</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-gray-950 truncate">{product.oemNumber || 'N/A'}</span>
            {product.oemNumber && (
              <button
                type="button"
                onClick={() => handleCopy(product.oemNumber, 'oem')}
                className="text-gray-400 hover:text-[#0B56D0] p-1 cursor-pointer transition-colors shrink-0"
                title="Copy OEM Number"
              >
                {copiedField === 'oem' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Manufacturer */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-[11px] text-gray-500 font-medium block">OEM Manufacturer</span>
          <div className="font-bold text-gray-900 truncate">
            {product.manufacturer || `${product.brand} Automotive Pvt Ltd`}
          </div>
        </div>
      </div>
    </div>
  );
};
