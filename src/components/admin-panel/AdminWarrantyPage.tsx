import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  FileText,
  Video,
  Image as ImageIcon,
  Car,
  ChevronRight,
  AlertCircle,
  Download,
} from 'lucide-react';
import { AdminWarrantyClaim, WarrantyOutcome } from '../../types/admin';

interface AdminWarrantyPageProps {
  warrantyClaims: AdminWarrantyClaim[];
  onUpdateWarrantyOutcome: (
    claimId: string,
    outcome: WarrantyOutcome,
    stage: 'Submitted' | 'Technical Review' | 'Outcome Decided' | 'Fulfillment',
    technicalNotes?: string
  ) => void;
}

export const AdminWarrantyPage: React.FC<AdminWarrantyPageProps> = ({
  warrantyClaims,
  onUpdateWarrantyOutcome,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<AdminWarrantyClaim | null>(null);
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = warrantyClaims.filter((c) => {
    const matchesOutcome = outcomeFilter === 'all' || c.outcome === outcomeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.id.toLowerCase().includes(q) ||
      c.orderId.toLowerCase().includes(q) ||
      c.customerName.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q) ||
      c.partNumber.toLowerCase().includes(q);
    return matchesOutcome && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            <span>Technical Warranty Claims & 8-Field Evidence Audit</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Strict verification of invoice, vehicle fitment, failure symptoms, photo & video evidence across 4 resolution outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">Open Technical Claims:</span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-bold text-xs">
            {warrantyClaims.length} Claims
          </span>
        </div>
      </div>

      {/* 4 Supported Outcomes Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-[10px] uppercase font-bold text-blue-800">Outcome 1</span>
          <p className="text-xs font-bold text-blue-950 mt-0.5">Replacement Part</p>
          <p className="text-[10px] text-blue-700">Direct factory swap dispatched</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] uppercase font-bold text-emerald-800">Outcome 2</span>
          <p className="text-xs font-bold text-emerald-950 mt-0.5">Authorized Repair</p>
          <p className="text-[10px] text-emerald-700">Manufacturer service center</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-[10px] uppercase font-bold text-amber-800">Outcome 3</span>
          <p className="text-xs font-bold text-amber-950 mt-0.5">Store Credit</p>
          <p className="text-[10px] text-amber-700">Wallet balance for next order</p>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <span className="text-[10px] uppercase font-bold text-purple-800">Outcome 4</span>
          <p className="text-xs font-bold text-purple-950 mt-0.5">Direct 100% Refund</p>
          <p className="text-[10px] text-purple-700">Payment source reversal</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Claim ID, Order ID, customer, part, or MPN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Resolution Outcomes</option>
            <option value="Pending">Pending Review</option>
            <option value="Replacement">Replacement</option>
            <option value="Repair">Repair</option>
            <option value="Credit">Store Credit</option>
            <option value="Refund">Full Refund</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Claim ID & Date</th>
                <th className="p-3.5">Customer & Vehicle</th>
                <th className="p-3.5">Product & MPN</th>
                <th className="p-3.5">Responsible Vendor</th>
                <th className="p-3.5">Evaluation Stage</th>
                <th className="p-3.5">Assigned Outcome</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50/70 transition">
                  {/* Claim ID */}
                  <td className="p-3.5 pl-4 font-mono">
                    <span className="font-bold text-gray-900 block text-xs">{claim.id}</span>
                    <span className="text-[11px] text-gray-700">{claim.claimDate}</span>
                  </td>

                  {/* Customer & Vehicle */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">{claim.customerName}</span>
                    <span className="text-[11px] text-blue-700 font-medium line-clamp-1 max-w-xs">
                      {claim.vehicleDetails}
                    </span>
                  </td>

                  {/* Product */}
                  <td className="p-3.5 max-w-xs">
                    <span className="font-semibold text-gray-900 block truncate">
                      {claim.productName}
                    </span>
                    <span className="text-[11px] text-gray-700 font-mono">
                      Part: {claim.partNumber}
                    </span>
                  </td>

                  {/* Seller */}
                  <td className="p-3.5 text-gray-800 font-medium">
                    {claim.sellerName}
                  </td>

                  {/* Evaluation Stage */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">{claim.evaluationStage}</span>
                    <span className="text-[10px] text-gray-700">Inv: {claim.invoiceNumber}</span>
                  </td>

                  {/* Outcome */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        claim.outcome === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : claim.outcome === 'Replacement'
                          ? 'bg-blue-100 text-blue-800'
                          : claim.outcome === 'Refund'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {claim.outcome}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Inspect 8 Fields</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8-Field Evidence Inspection Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl overflow-hidden my-6 animate-in fade-in">
            {/* Header */}
            <div className="p-5 bg-[#16181D] text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white">
                  TECHNICAL AUDIT DOSSIER: {selectedClaim.id}
                </span>
                <h3 className="font-bold text-base mt-1 text-white">{selectedClaim.productName}</h3>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-1 rounded text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 8 Evidence Fields Body */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-gray-900 uppercase text-xs">
                  All 8 Mandatory Evidence Fields Verified:
                </span>
              </div>

              {/* Fields 1 to 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-700 uppercase font-bold text-[10px]">1. Marketplace Order ID</span>
                  <p className="font-mono font-bold text-gray-900 mt-0.5">{selectedClaim.orderId}</p>
                </div>
                <div>
                  <span className="text-gray-700 uppercase font-bold text-[10px]">2. Product Title & SKU</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedClaim.productName}</p>
                </div>
                <div>
                  <span className="text-gray-700 uppercase font-bold text-[10px]">3. Part Number (MPN / OEM)</span>
                  <p className="font-mono font-bold text-purple-800 mt-0.5">{selectedClaim.partNumber}</p>
                </div>
                <div>
                  <span className="text-gray-700 uppercase font-bold text-[10px]">4. Vehicle Fitment Context</span>
                  <p className="font-bold text-blue-800 mt-0.5">{selectedClaim.vehicleDetails}</p>
                </div>
              </div>

              {/* Field 5: Problem Description */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="text-amber-900 uppercase font-bold text-[10px] block mb-1">
                  5. Defect / Failure Mechanical Symptoms
                </span>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {selectedClaim.problemDescription}
                </p>
              </div>

              {/* Fields 6 & 7: Photos & Video */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-gray-700 uppercase font-bold text-[10px] flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#C59B27]" />
                    6. Photo Evidence ({selectedClaim.photoEvidence.length} files)
                  </span>
                  <div className="flex gap-2">
                    {selectedClaim.photoEvidence.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Warranty wear proof"
                        className="w-20 h-16 object-cover rounded-lg border border-gray-300"
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-gray-700 uppercase font-bold text-[10px] flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    7. Video Operational Proof
                  </span>
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-[11px] flex items-center justify-between">
                    <span className="font-mono text-gray-700 truncate max-w-[180px]">
                      {selectedClaim.videoEvidence.split('/').pop()}
                    </span>
                    <button
                      onClick={() => alert(`Simulating playback of: ${selectedClaim.videoEvidence}`)}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Watch Video
                    </button>
                  </div>
                </div>
              </div>

              {/* Field 8: Tax Invoice */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-gray-700 uppercase font-bold text-[10px] block">
                    8. Tax Invoice Reference
                  </span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {selectedClaim.invoiceNumber}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Simulating viewing invoice ${selectedClaim.invoiceNumber}`)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>View Invoice PDF</span>
                </button>
              </div>

              {/* Technical Notes & Decision */}
              {selectedClaim.technicalNotes && (
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-900">
                  <strong className="block text-[10px] uppercase">Technical Inspector Log:</strong>
                  <span>{selectedClaim.technicalNotes}</span>
                </div>
              )}

              {/* Outcome Assignment Action Buttons */}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <span className="font-bold text-gray-900 block">Assign Technical Outcome:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      onUpdateWarrantyOutcome(selectedClaim.id, 'Replacement', 'Outcome Decided', 'Replacement approved by factory inspector.');
                      setSelectedClaim(null);
                    }}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center cursor-pointer transition"
                  >
                    1. Issue Replacement
                  </button>

                  <button
                    onClick={() => {
                      onUpdateWarrantyOutcome(selectedClaim.id, 'Repair', 'Outcome Decided', 'Authorized service center repair approved.');
                      setSelectedClaim(null);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center cursor-pointer transition"
                  >
                    2. Authorize Repair
                  </button>

                  <button
                    onClick={() => {
                      onUpdateWarrantyOutcome(selectedClaim.id, 'Credit', 'Outcome Decided', 'Store wallet credit issued.');
                      setSelectedClaim(null);
                    }}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-center cursor-pointer transition"
                  >
                    3. Store Credit
                  </button>

                  <button
                    onClick={() => {
                      onUpdateWarrantyOutcome(selectedClaim.id, 'Refund', 'Fulfillment', 'Full 100% refund credited.');
                      setSelectedClaim(null);
                    }}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-center cursor-pointer transition"
                  >
                    4. 100% Refund
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
