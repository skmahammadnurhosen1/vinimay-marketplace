import React, { useState } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Search,
  Eye,
  FileCheck,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import {
  ManufacturerReturnRecord,
  ManufacturerWarrantyClaim,
  ManufacturerWarrantyOutcome,
} from '../../types/manufacturer';

interface ManufacturerReturnsWarrantyPageProps {
  returns: ManufacturerReturnRecord[];
  warrantyClaims: ManufacturerWarrantyClaim[];
  onInspectWarrantyClaim: (claim: ManufacturerWarrantyClaim) => void;
  onUpdateReturnStatus: (id: string, status: ManufacturerReturnRecord['status']) => void;
}

export const ManufacturerReturnsWarrantyPage: React.FC<ManufacturerReturnsWarrantyPageProps> = ({
  returns,
  warrantyClaims,
  onInspectWarrantyClaim,
  onUpdateReturnStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'warranty' | 'returns'>('warranty');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReturns = returns.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.partNumber.toLowerCase().includes(q) ||
      r.dealerName.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    );
  });

  const filteredWarranty = warrantyClaims.filter(w => {
    const q = searchTerm.toLowerCase();
    return (
      w.id.toLowerCase().includes(q) ||
      w.orderId.toLowerCase().includes(q) ||
      w.productName.toLowerCase().includes(q) ||
      w.partNumber.toLowerCase().includes(q) ||
      w.vehicleDetails.toLowerCase().includes(q) ||
      w.dealerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#0284C7]" />
            <span>Returns & Warranty Quality Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Adjudicate 8-field technical warranty claims and audit marketplace reverse logistics return reasons.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200">
          <button
            onClick={() => setActiveTab('warranty')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'warranty'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Warranty Claims ({warrantyClaims.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Marketplace Returns ({returns.length})</span>
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'warranty'
                ? 'Search Claim #, Order ID, Part #, Vehicle...'
                : 'Search Return #, Order ID, Part #, Reason...'
            }
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
          />
        </div>

        <span className="text-xs text-gray-500 hidden sm:inline">
          {activeTab === 'warranty' ? `${filteredWarranty.length} Claims Indexed` : `${filteredReturns.length} Records`}
        </span>
      </div>

      {/* TAB 1: WARRANTY CLAIMS DESK (8 BLUEPRINT FIELDS & 7 OUTCOMES) */}
      {activeTab === 'warranty' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#0284C7]" />
              <span className="font-semibold text-gray-900">8-Field Engineering Evidence Standard Active:</span>
              <span className="hidden md:inline text-gray-600">Order ID, Part Number, Vehicle Fitment, Mechanical Symptoms, Photos, Video, Invoice.</span>
            </div>
            <span className="text-[10px] font-mono text-sky-800 font-bold px-2 py-0.5 rounded bg-sky-100 border border-sky-300">
              7 OUTCOME STATES SUPPORTED
            </span>
          </div>

          <div className="space-y-3">
            {filteredWarranty.map(claim => {
              const outcomeColors: Record<ManufacturerWarrantyOutcome, string> = {
                'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
                Replacement: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                Repair: 'bg-sky-50 text-sky-700 border-sky-200',
                Credit: 'bg-purple-50 text-purple-700 border-purple-200',
                Refund: 'bg-rose-50 text-rose-700 border-rose-200',
                Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                Rejected: 'bg-gray-100 text-gray-600 border-gray-200',
              };

              return (
                <div
                  key={claim.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition shadow-xs space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-gray-900 text-sm">{claim.id}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-mono text-gray-500">Order #{claim.orderId}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{claim.claimDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          outcomeColors[claim.outcome] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Outcome: {claim.outcome}
                      </span>
                      <button
                        onClick={() => onInspectWarrantyClaim(claim)}
                        className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Adjudicate</span>
                      </button>
                    </div>
                  </div>

                  {/* 8 Mandatory Fields Preview Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">1. Part & MPN</span>
                      <div className="font-bold text-gray-900 truncate">{claim.productName}</div>
                      <span className="text-[11px] font-mono text-[#0284C7] font-semibold">{claim.partNumber}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">2. Vehicle Application</span>
                      <div className="font-semibold text-gray-900 truncate">{claim.vehicleDetails}</div>
                      <span className="text-[10px] text-gray-500">Customer: {claim.customerName}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">3. Selling Dealer</span>
                      <div className="font-semibold text-gray-900 truncate">{claim.dealerName}</div>
                      <span className="text-[10px] font-mono text-gray-500">Invoice: {claim.invoiceNumber}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">4. Multi-Media Evidence</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-[#0284C7] font-medium">
                          <ImageIcon className="w-3.5 h-3.5" /> {claim.photoEvidence.length} Photos
                        </span>
                        {claim.videoEvidence && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                            <Video className="w-3.5 h-3.5" /> Video Proof
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mechanical Symptoms & Finding */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono block">
                      Mechanical Defect / Failure Symptoms:
                    </span>
                    <p className="text-gray-700 leading-relaxed italic">"{claim.problemDescription}"</p>
                    {claim.technicalFinding && (
                      <div className="pt-2 border-t border-gray-200 text-[11px] text-[#0284C7]">
                        <strong>Engineering Finding:</strong> {claim.technicalFinding}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MARKETPLACE RETURNS (7 AUTOMOTIVE REASONS) */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
            <span className="font-semibold text-gray-900">7 Supported Automotive Reverse Reasons: </span>
            <span className="text-gray-600">
              Wrong Part, Wrong Product Received, Damaged Product, Defective Product, Manufacturing Defect, Product Not Compatible, Other.
            </span>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Return ID & Date</th>
                    <th className="py-3 px-4">Order ID & Part</th>
                    <th className="py-3 px-4">Selling Dealer</th>
                    <th className="py-3 px-4">Customer Reason (7 Reasons)</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReturns.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0284C7]">
                        {r.id}
                        <span className="text-[10px] text-gray-500 block font-sans font-normal">{r.requestDate}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-gray-500 text-[10px]">Order: {r.orderId}</span>
                        <div className="font-semibold text-gray-900 truncate max-w-[200px]">{r.productName}</div>
                        <span className="text-[10px] font-mono text-[#0284C7]">MPN: {r.partNumber}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-gray-900">{r.dealerName}</td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold">
                          {r.reason}
                        </span>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{r.detailedNotes}</p>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-gray-900">₹{r.amount.toLocaleString('en-IN')}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status.startsWith('Approved')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : r.status === 'Rejected'
                              ? 'bg-gray-100 text-gray-600 border border-gray-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {r.status === 'Under Review' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onUpdateReturnStatus(r.id, 'Approved for Replacement')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold cursor-pointer shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onUpdateReturnStatus(r.id, 'Rejected')}
                              className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-mono">Disposed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
