import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StockIndicatorProps {
  inStock: boolean;
  stockCount?: number;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({
  inStock,
  stockCount = 24
}) => {
  if (!inStock || stockCount <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-bold">
        <XCircle className="w-3.5 h-3.5 text-red-600" />
        <span>Currently Out of Stock</span>
      </div>
    );
  }

  if (stockCount <= 5) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>Low Stock — Only {stockCount} units remaining in distributor hub</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      <span className="w-2 h-2 rounded-full bg-emerald-600 -ml-4" />
      <span>In Stock ({stockCount} Units Ready for Immediate Dispatch)</span>
    </div>
  );
};
