import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
  Package,
  IndianRupee
} from 'lucide-react';
import { SellerInventoryItem } from '../../types/seller';
import { useToast } from '../../context/ToastContext';

interface SellerInventoryPageProps {
  inventory: SellerInventoryItem[];
  onAdjustStock: (productId: string, delta: number) => void;
}

export const SellerInventoryPage: React.FC<SellerInventoryPageProps> = ({
  inventory,
  onAdjustStock
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLowStock = !filterLowStockOnly || item.isLowStock;
      return matchSearch && matchLowStock;
    });
  }, [inventory, searchQuery, filterLowStockOnly]);

  const totalValuation = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const totalUnits = inventory.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockCount = inventory.filter(i => i.isLowStock).length;

  const handleStockChange = (productId: string, delta: number, title: string) => {
    onAdjustStock(productId, delta);
    showToast(
      'Stock Updated',
      `${title}: Stock adjusted by ${delta > 0 ? `+${delta}` : delta} units.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Inventory Valuation Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-stone-500 block">Total Inventory Value</span>
          <span className="text-xl font-extrabold text-stone-950 font-mono">
            ₹{totalValuation.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-stone-400 block">Warehouse cost valuation</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-stone-500 block">Total Units in Stock</span>
          <span className="text-xl font-extrabold text-stone-950 font-mono">
            {totalUnits.toLocaleString()} units
          </span>
          <span className="text-[10px] text-stone-400 block">Across {inventory.length} active SKUs</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-stone-500 block">Low-Stock Warnings</span>
          <span
            className={`text-xl font-extrabold font-mono ${
              lowStockCount > 0 ? 'text-rose-600' : 'text-stone-950'
            }`}
          >
            {lowStockCount} SKUs
          </span>
          <span className="text-[10px] text-stone-400 block">Below replenishment safety margin</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-stone-500 block">Audit & Reconciliation</span>
          <span className="text-xl font-extrabold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-5 h-5" /> 100% Synced
          </span>
          <span className="text-[10px] text-stone-400 block">Barcode verified inventory</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search SKU by Part Number or Name..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C59B27]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterLowStockOnly
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Low Stock Only ({lowStockCount})</span>
          </button>
        </div>
      </div>

      {/* Inventory Table / Mobile Cards */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-xs">
            <thead className="bg-stone-50 text-stone-700 font-bold">
              <tr>
                <th className="px-4 py-3 text-left">Product & Part Details</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-center">Available Stock</th>
                <th className="px-4 py-3 text-center">Reserved Units</th>
                <th className="px-4 py-3 text-center">Safety Threshold</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Total Valuation</th>
                <th className="px-4 py-3 text-center">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {filteredItems.map(item => (
                <tr key={item.productId} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-contain bg-stone-50 border border-stone-200 p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 block truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          PN: {item.partNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-stone-600">
                    {item.category}
                  </td>

                  <td className="px-4 py-3.5 text-center font-mono">
                    <span
                      className={`font-extrabold text-sm px-2 py-0.5 rounded ${
                        item.isLowStock ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-stone-950'
                      }`}
                    >
                      {item.availableStock}
                    </span>
                    {item.isLowStock && (
                      <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider block mt-0.5">
                        Low Stock
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-center font-mono text-stone-500">
                    {item.reservedStock}
                  </td>

                  <td className="px-4 py-3.5 text-center font-mono text-stone-500">
                    {item.lowStockThreshold}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-900">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-950">
                    ₹{item.totalValue.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <div className="inline-flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        type="button"
                        onClick={() => handleStockChange(item.productId, -5, item.title)}
                        disabled={item.currentStock <= 0}
                        className="px-2 py-1 hover:bg-stone-200 text-stone-700 disabled:opacity-40 transition-colors cursor-pointer"
                        title="Decrease 5 units"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-[11px] font-bold font-mono text-stone-900">
                        {item.currentStock}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStockChange(item.productId, +10, item.title)}
                        className="px-2 py-1 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                        title="Add 10 units"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked View */}
        <div className="md:hidden divide-y divide-stone-100">
          {filteredItems.map(item => (
            <div key={item.productId} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="w-12 h-12 rounded-xl object-contain bg-stone-50 border border-stone-200 p-1 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                  <span className="text-[10px] text-stone-500 font-mono block">
                    Part No: {item.partNumber}
                  </span>
                  {item.isLowStock && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded inline-block mt-1">
                      Low Stock: {item.availableStock} Available
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] block">Current Stock</span>
                  <span className="font-mono font-bold text-stone-950">{item.currentStock} units</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Threshold</span>
                  <span className="font-mono text-stone-600">{item.lowStockThreshold} units</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Valuation</span>
                  <span className="font-mono font-bold text-stone-950">₹{item.totalValue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-500 font-medium">Quick Restock Adjustment:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStockChange(item.productId, -5, item.title)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStockChange(item.productId, +10, item.title)}
                    className="px-2.5 py-1 bg-[#16181D] hover:bg-stone-800 text-white text-xs font-bold rounded-lg"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStockChange(item.productId, +50, item.title)}
                    className="px-2.5 py-1 bg-[#C59B27] hover:bg-[#B38A22] text-stone-950 text-xs font-bold rounded-lg"
                  >
                    +50
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
