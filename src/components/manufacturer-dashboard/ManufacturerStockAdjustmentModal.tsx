import React, { useState } from 'react';
import {
  X,
  Boxes,
  Plus,
  Minus,
} from 'lucide-react';
import { ManufacturerProduct, ManufacturerInventoryItem } from '../../types/manufacturer';

interface ManufacturerStockAdjustmentModalProps {
  item: ManufacturerProduct | ManufacturerInventoryItem | null;
  onClose: () => void;
  onAdjustStock: (
    productId: string,
    delta: number,
    type: 'Inward Production' | 'Stock Adjustment',
    notes: string,
    refDoc?: string
  ) => void;
}

export const ManufacturerStockAdjustmentModal: React.FC<ManufacturerStockAdjustmentModalProps> = ({
  item,
  onClose,
  onAdjustStock,
}) => {
  const [delta, setDelta] = useState(50);
  const [isAddition, setIsAddition] = useState(true);
  const [movementType, setMovementType] = useState<'Inward Production' | 'Stock Adjustment'>('Inward Production');
  const [reasonNotes, setReasonNotes] = useState('Factory scheduled production batch intake');
  const [refDoc, setRefDoc] = useState('MFG-INW-2026-09');

  if (!item) return null;

  const currentStock = 'stock' in item ? item.stock.current : item.currentStock;
  const partNumber = item.partNumber;
  const title = 'title' in item ? item.title : item.productTitle;
  const productId = 'id' in item ? item.id : item.productId;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDelta = isAddition ? Math.abs(delta) : -Math.abs(delta);
    onAdjustStock(productId, finalDelta, movementType, reasonNotes, refDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white shadow-xs">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Warehouse Stock Adjustment</h3>
              <p className="text-[11px] font-mono text-[#0284C7]">MPN: {partNumber}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-5 space-y-4 text-xs text-gray-700">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <span className="text-[10px] text-gray-500 uppercase font-mono block">Product Under Adjustment:</span>
            <div className="font-bold text-gray-900 text-xs line-clamp-1">{title}</div>
            <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
              <span>Current Physical Inventory:</span>
              <strong className="text-gray-900 font-mono">{currentStock} units</strong>
            </div>
          </div>

          {/* Increment or Decrement Mode */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddition(true);
                setMovementType('Inward Production');
              }}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                isAddition
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-400/40'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Inward Restock (+)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAddition(false);
                setMovementType('Stock Adjustment');
              }}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                !isAddition
                  ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-400/40'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Minus className="w-4 h-4 text-rose-600" />
              <span>Reduction / Audit (-)</span>
            </button>
          </div>

          {/* Delta Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Adjustment Quantity Units:
            </label>
            <input
              type="number"
              required
              min={1}
              value={delta}
              onChange={e => setDelta(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono text-sm font-bold focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Reference Doc */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reference Inward Batch / Audit Number:
            </label>
            <input
              type="text"
              required
              value={refDoc}
              onChange={e => setRefDoc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Movement Reason & Warehouse Notes:
            </label>
            <input
              type="text"
              required
              value={reasonNotes}
              onChange={e => setReasonNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Preview Calculated Balance */}
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between font-mono text-xs">
            <span className="text-gray-700">New Resulting Stock:</span>
            <span className="font-extrabold text-gray-900 text-sm">
              {Math.max(0, currentStock + (isAddition ? delta : -delta))} units
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold cursor-pointer shadow-xs"
            >
              Commit Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
