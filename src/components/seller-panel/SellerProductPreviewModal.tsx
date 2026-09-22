import React from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Car,
  CheckCircle2,
  Tag,
  Store,
  ArrowRight
} from 'lucide-react';
import { SellerProduct } from '../../types/seller';

interface SellerProductPreviewModalProps {
  product: SellerProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SellerProductPreviewModal: React.FC<SellerProductPreviewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="p-3 bg-amber-500/15 border-b border-amber-300 text-amber-950 text-xs font-bold px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-pulse" />
            <span>Storefront Preview Mode — Customer Perspective</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-600 hover:text-stone-900 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Gallery preview */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-square rounded-2xl bg-stone-50 border border-stone-200 p-6 flex items-center justify-center relative">
                <img
                  src={product.images[0] || '/assets/cat_engine.jpg'}
                  alt=""
                  className="w-full h-full object-contain"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold shadow-2xs">
                  {product.partType} Quality
                </span>
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-xl border-2 border-stone-200 p-1 bg-stone-50 shrink-0"
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider block">
                  {product.brand} Official
                </span>
                <h3 className="text-xl font-extrabold text-stone-950 mt-1 leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Fitment summary badge */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <Car className="w-4 h-4 text-emerald-700" />
                  <span>Guaranteed Direct Fitment ({product.compatibility.length} Vehicles)</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold underline">
                  View Vehicles
                </span>
              </div>

              {/* Pricing */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-stone-950 font-mono">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400 line-through font-mono">
                    MRP ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Save {product.discountPercentage}%
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 block">
                  Inclusive of 18% GST & free Pan-India transit insurance
                </span>
              </div>

              {/* Mock Buy Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="py-3 bg-[#16181D] text-white font-bold text-xs rounded-xl text-center shadow-md">
                  Buy Now (Direct Order)
                </div>
                <div className="py-3 bg-[#C59B27] text-stone-950 font-bold text-xs rounded-xl text-center shadow-md">
                  Add to Cart
                </div>
              </div>

              {/* Part specifications strip */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-400 block">Part Number</span>
                  <span className="font-mono font-bold text-stone-900">{product.partNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">OEM Reference</span>
                  <span className="font-mono font-bold text-stone-900">{product.oemNumber || 'Direct Replacement'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Warranty</span>
                  <span className="font-semibold text-stone-800">{product.warranty}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Returns</span>
                  <span className="font-semibold text-stone-800">{product.returnDays} Days Eligibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-end bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
