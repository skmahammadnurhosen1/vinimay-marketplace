import React, { useState } from 'react';
import { Maximize2, ShieldCheck, Check } from 'lucide-react';
import { PartType } from '../../types';
import { LightboxModal } from './LightboxModal';

interface ProductGalleryProps {
  images: string[];
  title: string;
  partNumber: string;
  partType: PartType;
  discountPercentage: number;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  title,
  partNumber,
  partType,
  discountPercentage
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Provide multi-angle fallbacks if product only has 1 image
  const displayImages = images.length > 1
    ? images
    : [
        images[0],
        '/assets/cat_brake.jpg',
        '/assets/prod_bearing.jpg'
      ];

  const partTypeBadgeColor = {
    Genuine: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    OEM: 'bg-blue-50 text-blue-800 border-blue-300',
    Aftermarket: 'bg-amber-50 text-amber-800 border-amber-300'
  }[partType];

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div
        className="relative aspect-[4/3] w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-6 group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={displayImages[activeIdx] || images[0]}
          alt={title}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 select-none"
        />

        {/* Authenticity Badge */}
        <span className={`absolute top-3.5 left-3.5 px-3 py-1 text-xs font-bold rounded-lg border shadow-xs ${partTypeBadgeColor}`}>
          {partType} Quality
        </span>

        {/* Discount Tag */}
        {discountPercentage > 0 && (
          <span className="absolute top-3.5 right-3.5 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-xs">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Fullscreen Trigger Hover Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-3.5 right-3.5 bg-white/90 backdrop-blur-xs hover:bg-white text-stone-800 p-2 rounded-xl border border-stone-200 shadow-sm opacity-80 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-xs font-semibold"
          title="Click to view full-screen high-res preview"
        >
          <Maximize2 className="w-3.5 h-3.5 text-stone-700" />
          <span className="hidden sm:inline">Enlarge</span>
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`w-20 h-20 rounded-xl bg-stone-50 border-2 overflow-hidden p-1.5 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              activeIdx === idx
                ? 'border-[#C59B27] shadow-sm scale-102 bg-amber-50/30'
                : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-contain" />
          </button>
        ))}
      </div>

      {/* Zero-Wrong-Fit Guarantee Banner */}
      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold text-emerald-950">100% Zero-Wrong-Fit Guarantee</strong>
          <span>Every spare part is backed by exact OEM fitment validation and our 10-day no-questions return policy.</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={displayImages}
        activeIndex={activeIdx}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={setActiveIdx}
        title={title}
        partNumber={partNumber}
      />
    </div>
  );
};
