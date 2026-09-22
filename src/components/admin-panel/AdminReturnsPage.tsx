import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Eye,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import {
  AdminReturnRequest,
  ReturnLifecycleStage,
  ReturnStatus,
  ReturnReason,
} from '../../types/admin';

interface AdminReturnsPageProps {
  returns: AdminReturnRequest[];
  onUpdateReturnStage: (
    returnId: string,
    stage: ReturnLifecycleStage,
    status: ReturnStatus,
    adminNote?: string
  ) => void;
}

export const AdminReturnsPage: React.FC<AdminReturnsPageProps> = ({
  returns,
  onUpdateReturnStage,
}) => {
  const [selectedReturn, setSelectedReturn] = useState<AdminReturnRequest | null>(null);
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const stages: ReturnLifecycleStage[] = [
    'Customer Request',
    'Verification',
    'Pickup Scheduled',
    'Inspection',
    'Decision',
    'Resolution',
  ];

  const filteredReturns = returns.filter((r) => {
    const matchesReason = reasonFilter === 'all' || r.reason === reasonFilter;
    const matchesStage = stageFilter === 'all' || r.stage === stageFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q);
    return matchesReason && matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-amber-500" />
            <span>Returns Desk & 6-Stage RMA Governance</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Evaluate customer RMA requests across standard automotive reasons and guide reverse logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">RMA Requests:</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
            {returns.length} Active Cases
          </span>
        </div>
      </div>

      {/* 6-Stage Stepper Banner */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
        <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-3">
          Standard 6-Stage RMA Reverse Lifecycle:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {stages.map((stg, i) => (
            <div
              key={stg}
              className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2 text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="font-semibold text-gray-800 truncate">{stg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search return ID, order ref, customer, or part..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {/* 7 Exact Reasons Filter */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All 7 Return Reasons</option>
            <option value="Wrong Part">1. Wrong Part</option>
            <option value="Wrong Product Received">2. Wrong Product Received</option>
            <option value="Damaged Product">3. Damaged Product</option>
            <option value="Defective Product">4. Defective Product</option>
            <option value="Manufacturing Defect">5. Manufacturing Defect</option>
            <option value="Product Not Compatible">6. Product Not Compatible</option>
            <option value="Other">7. Other</option>
          </select>

          {/* Lifecycle Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Lifecycle Stages</option>
            {stages.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">RMA Case & Order</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Product & Part No</th>
                <th className="p-3.5">Return Reason</th>
                <th className="p-3.5">Current Lifecycle Stage</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReturns.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition">
                  {/* RMA ID & Order */}
                  <td className="p-3.5 pl-4 font-mono">
                    <span className="font-bold text-gray-900 block text-xs">{item.id}</span>
                    <span className="text-[11px] text-gray-700">{item.orderId}</span>
                  </td>

                  {/* Customer */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">{item.customerName}</span>
                    <span className="text-[11px] text-gray-700">{item.customerPhone}</span>
                  </td>

                  {/* Product */}
                  <td className="p-3.5 max-w-xs">
                    <span className="font-semibold text-gray-900 block truncate">
                      {item.productName}
                    </span>
                    <span className="text-[11px] text-gray-700 font-mono">
                      MPN: {item.partNumber} (Qty: {item.quantity})
                    </span>
                  </td>

                  {/* Reason */}
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px]">
                      {item.reason}
                    </span>
                  </td>

                  {/* Lifecycle Stage */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">{item.stage}</span>
                    <span className="text-[10px] text-gray-700">{item.requestedDate}</span>
                  </td>

                  {/* Amount */}
                  <td className="p-3.5 font-bold text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status.includes('Approved')
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => setSelectedReturn(item)}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Advance Stage</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RMA Stage Inspector Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in">
            {/* Header */}
            <div className="p-5 bg-[#16181D] text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-gray-950">
                  RMA RETURN CASE {selectedReturn.id}
                </span>
                <h3 className="font-bold text-base mt-1 text-white">{selectedReturn.productName}</h3>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="p-1 rounded text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-700 font-semibold block">Declared Return Reason:</span>
                  <strong className="text-amber-800 text-sm">{selectedReturn.reason}</strong>
                </div>
                <div>
                  <span className="text-gray-700 font-semibold block">Claim Amount:</span>
                  <strong className="text-emerald-700 text-sm">{formatCurrency(selectedReturn.amount)}</strong>
                </div>
              </div>

              <div>
                <span className="text-gray-700 font-semibold block mb-1">Customer / Garage Remarks:</span>
                <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 italic">
                  "{selectedReturn.notes}"
                </p>
              </div>

              {selectedReturn.imageProofs.length > 0 && (
                <div>
                  <span className="text-gray-700 font-semibold block mb-1.5">Attached Image Evidence:</span>
                  <div className="flex gap-2">
                    {selectedReturn.imageProofs.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="RMA proof"
                        className="w-24 h-20 object-cover rounded-lg border border-gray-300 shadow-xs"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lifecycle Progression Buttons */}
              <div className="pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900 block mb-2">Advance RMA Progression:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onUpdateReturnStage(selectedReturn.id, 'Pickup Scheduled', 'Pickup In Progress', 'Doorstep reverse pickup booked via Delhivery');
                      setSelectedReturn(null);
                    }}
                    className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-left cursor-pointer transition"
                  >
                    1. Schedule Logistics Pickup
                    <span className="block text-[10px] text-blue-700 font-normal">Generate reverse courier AWB</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateReturnStage(selectedReturn.id, 'Inspection', 'Under Inspection', 'Received at hub; physical seal and wear inspection in progress');
                      setSelectedReturn(null);
                    }}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-left cursor-pointer transition"
                  >
                    2. Mark for Hub Inspection
                    <span className="block text-[10px] text-purple-700 font-normal">Verify unused state & packaging</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateReturnStage(selectedReturn.id, 'Resolution', 'Approved for Refund', 'Inspection passed. Authorized 100% refund.');
                      setSelectedReturn(null);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-left cursor-pointer transition"
                  >
                    3. Approve Refund Payout
                    <span className="block text-[10px] text-emerald-700 font-normal">Transfers to Refunds Queue</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateReturnStage(selectedReturn.id, 'Resolution', 'Approved for Replacement', 'Inspection passed. Replacement dispatched.');
                      setSelectedReturn(null);
                    }}
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-left cursor-pointer transition"
                  >
                    4. Dispatch Replacement
                    <span className="block text-[10px] text-amber-700 font-normal">Direct replacement part to buyer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedReturn(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
