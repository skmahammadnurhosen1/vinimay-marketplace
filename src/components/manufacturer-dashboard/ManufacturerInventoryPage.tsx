import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  History,
} from 'lucide-react';
import {
  ManufacturerInventoryItem,
} from '../../types/manufacturer';

interface ManufacturerInventoryPageProps {
  inventory: ManufacturerInventoryItem[];
  onOpenStockAdjust: (item: any) => void;
}

export const ManufacturerInventoryPage: React.FC<ManufacturerInventoryPageProps> = ({
  inventory,
  onOpenStockAdjust,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<ManufacturerInventoryItem | null>(null);

  const filteredItems = inventory.filter(item => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.partNumber.toLowerCase().includes(q) ||
      item.productTitle.toLowerCase().includes(q) ||
      item.warehouseLocation.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCurrent = inventory.reduce((acc, i) => acc + i.currentStock, 0);
  const totalReserved = inventory.reduce((acc, i) => acc + i.reservedStock, 0);
  const totalAvailable = inventory.reduce((acc, i) => acc + i.availableStock, 0);
  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-[#0284C7]" />
            <span>Plant Warehouses & Inventory Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor real-time warehouse bins, dealer reserved stock, and factory production inward lots.
          </p>
        </div>

        <button
          onClick={() => onOpenStockAdjust(inventory[0])}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-semibold shadow-md shadow-[#0284C7]/20 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Batch Stock Adjustment</span>
        </button>
      </div>

      {/* 4 Summary Strip Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Current Physical Stock</span>
          <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono mt-1">
            {totalCurrent.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-500">Total units across all bins</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Reserved for Orders</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono mt-1">
            {totalReserved.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-500">Allocated to active dispatches</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Available to Promise</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono mt-1">
            {totalAvailable.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-500">Ready for instant dealer restock</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Low Stock Alerts</span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono mt-1">
            {lowStockCount}
          </div>
          <span className="text-[10px] text-gray-500">SKUs below safety threshold</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Part #, Title, Warehouse Location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
        >
          <option value="all">All Inventory Statuses</option>
          <option value="In Stock">In Stock Only</option>
          <option value="Low Stock">Low Stock Alert</option>
          <option value="Critical">Critical</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Part / Title</th>
                <th className="py-3 px-4">Warehouse Bin</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Reserved</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Scheduled Inward</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map(item => {
                return (
                  <tr key={item.productId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#0284C7] block">{item.partNumber}</span>
                      <div className="font-medium text-gray-900 truncate max-w-[220px]">{item.productTitle}</div>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-gray-500">
                      {item.warehouseLocation}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {item.currentStock}
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-600">
                      {item.reservedStock}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 text-sm">
                      {item.availableStock}
                    </td>

                    <td className="py-3 px-4 font-mono text-gray-500">
                      {item.lowStockThreshold} units
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px]">
                      {item.incomingProductionBatch ? (
                        <div>
                          <span className="text-[#0284C7] font-semibold block">
                            +{item.incomingProductionBatch.expectedUnits} units
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            ETA: {item.incomingProductionBatch.arrivalDate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-mono">None scheduled</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItemForHistory(item)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                          title="View Stock Movement Audit Trail"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenStockAdjust(item)}
                          className="px-2.5 py-1 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-semibold transition cursor-pointer shadow-xs"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Audit Trail Modal */}
      {selectedItemForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#0284C7]" />
                  <span>Stock Movement Audit Log: [{selectedItemForHistory.partNumber}]</span>
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">{selectedItemForHistory.productTitle}</p>
              </div>
              <button
                onClick={() => setSelectedItemForHistory(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {selectedItemForHistory.recentMovements.map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{m.type}</span>
                      <span className="text-[10px] font-mono text-gray-500">Ref: {m.referenceDoc}</span>
                    </div>
                    <p className="text-gray-600 text-[11px] mt-0.5">{m.notes}</p>
                    <span className="text-[10px] text-gray-400">{m.date}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-mono font-extrabold ${
                        m.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </span>
                    <span className="text-[10px] text-gray-500 block">Balance: {m.balanceAfter}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedItemForHistory(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
