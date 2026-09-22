import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ShieldCheck } from 'lucide-react';

interface LightboxModalProps {
  images: string[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  title: string;
  partNumber: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  activeIndex,
  isOpen,
  onClose,
  onSelectIndex,
  title,
  partNumber
}) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onSelectIndex((activeIndex - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        onSelectIndex((activeIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, activeIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((activeIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((activeIndex + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white z-10" onClick={e => e.stopPropagation()}>
        <div className="min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/20">
              OEM High-Res Inspection
            </span>
            <span className="text-xs text-gray-400 font-mono">Part #{partNumber}</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white truncate mt-1">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isZoomed ? "Zoom Out" : "Zoom In"}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer backdrop-blur-xs"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Stage Image */}
        <div className="max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center p-4">
          <img
            src={images[activeIndex]}
            alt={title}
            className={`max-h-full max-w-full object-contain transition-transform duration-300 select-none ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer backdrop-blur-xs"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Counter */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white z-10 max-w-4xl mx-auto w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectIndex(idx);
                setIsZoomed(false);
              }}
              className={`w-14 h-14 rounded-lg bg-white/10 border-2 overflow-hidden p-1 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                activeIndex === idx
                  ? 'border-[#FFBA00] scale-105 shadow-md'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Image {activeIndex + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};
