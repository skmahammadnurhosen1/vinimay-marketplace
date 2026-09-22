import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxStock?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxStock = 99,
  onIncrease,
  onDecrease,
  disabled = false
}) => {
  const canDecrease = quantity > 1 && !disabled;
  const canIncrease = quantity < maxStock && !disabled;

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-9 text-center text-xs font-bold text-gray-900 bg-white py-1 select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label="Increase quantity"
        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
