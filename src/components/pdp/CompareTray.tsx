import React from 'react';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export const CompareTray: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare, setIsCompareModalOpen } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <aside
      aria-label="Product comparison dock"
      className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 bg-[#071530] text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-blue-900/60 max-w-sm sm:max-w-md w-full animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFBA00] text-gray-950 flex items-center justify-center font-bold text-xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight">
              Compare Spare Parts ({compareItems.length}/4)
            </h4>
            <span className="text-[10px] text-gray-400">Specifications & Fitment</span>
          </div>
        </div>

        <button
          type="button"
          onClick={clearCompare}
          className="text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Thumbnails of compared products */}
      <div className="flex items-center justify-between gap-2 pt-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {compareItems.map(item => (
            <div
              key={item.id}
              className="relative w-11 h-11 rounded-lg bg-white p-1 border border-gray-700 shrink-0 group"
              title={item.title}
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => removeFromCompare(item.id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer hover:bg-red-700"
                aria-label={`Remove ${item.title} from compare`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsCompareModalOpen(true)}
          className="px-3.5 py-2 bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
};
