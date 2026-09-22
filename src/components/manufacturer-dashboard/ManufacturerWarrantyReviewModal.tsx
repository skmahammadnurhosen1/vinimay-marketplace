import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import {
  ManufacturerWarrantyClaim,
  ManufacturerWarrantyOutcome,
} from '../../types/manufacturer';

interface ManufacturerWarrantyReviewModalProps {
  claim: ManufacturerWarrantyClaim | null;
  onClose: () => void;
  onUpdateOutcome: (
    id: string,
    outcome: ManufacturerWarrantyOutcome,
    notes?: string,
    finding?: string
  ) => void;
}

export const ManufacturerWarrantyReviewModal: React.FC<ManufacturerWarrantyReviewModalProps> = ({
  claim,
  onClose,
  onUpdateOutcome,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<ManufacturerWarrantyOutcome>(
    claim ? claim.outcome : 'Under Review'
  );
  const [notes, setNotes] = useState(claim?.resolutionNotes || '');
  const [finding, setFinding] = useState(claim?.technicalFinding || '');

  if (!claim) return null;

  const handleSave = () => {
    onUpdateOutcome(claim.id, selectedOutcome, notes, finding);
    onClose();
  };

  const outcomes: { id: ManufacturerWarrantyOutcome; label: string; desc: string }[] = [
    { id: 'Under Review', label: 'Under Review', desc: 'Awaiting laboratory / plant metallurgy report' },
    { id: 'Replacement', label: 'Authorize Replacement', desc: 'Dispatch fresh OE part directly to customer/dealer' },
    { id: 'Repair', label: 'Authorized Repair', desc: 'Repair at certified OEM technical service center' },
    { id: 'Credit', label: 'Commercial Credit Note', desc: 'Issue credit note to selling dealer / customer' },
    { id: 'Refund', label: 'Full Refund', desc: '100% financial refund authorized' },
    { id: 'Approved', label: 'Approve Claim', desc: 'Approve claim for warranty processing' },
    { id: 'Rejected', label: 'Reject Claim', desc: 'Failure determined to be improper installation / wear & tear' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 font-mono">{claim.id}</h2>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-rose-600 font-bold">8-Field Engineering Dossier</span>
              </div>
              <p className="text-xs text-gray-500">Claim Date: {claim.claimDate} • Order #{claim.orderId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 border border-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-gray-700">
          {/* 8 Mandatory Fields Display Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">1. Part Title & MPN</span>
              <div className="font-bold text-gray-900 text-xs">{claim.productName}</div>
              <span className="text-[#0284C7] font-mono text-[11px] block">{claim.partNumber}</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">2. Vehicle Fitment Application</span>
              <div className="font-bold text-gray-900 text-xs">{claim.vehicleDetails}</div>
              <span className="text-gray-500 text-[10px] block">Buyer: {claim.customerName} ({claim.customerPhone})</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">3. Selling Channel Dealer</span>
              <div className="font-bold text-gray-900 text-xs">{claim.dealerName}</div>
              <span className="text-gray-500 text-[10px] block">Tax Invoice: {claim.invoiceNumber}</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">4. Multi-Media Evidence</span>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[#0284C7] font-medium flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> {claim.photoEvidence.length} Photos Attached
                </span>
                {claim.videoEvidence && (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Video Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mechanical Failure Symptom */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <span className="text-[10px] text-rose-700 uppercase font-mono font-bold block">
              Mechanical Defect / Failure Symptoms Description:
            </span>
            <p className="text-gray-900 text-xs leading-relaxed italic">
              "{claim.problemDescription}"
            </p>
          </div>

          {/* Engineering Finding */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              OEM Engineering Assessment Finding:
            </label>
            <textarea
              rows={2}
              value={finding}
              onChange={e => setFinding(e.target.value)}
              placeholder="e.g. Microscopic burr confirmed in secondary piston seal groove. Thermal stress analysis variance..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* 7 Outcome Decisions */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Adjudicate Warranty Resolution Outcome (7 Blueprint Outcomes):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {outcomes.map(out => (
                <label
                  key={out.id}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start gap-2.5 ${
                    selectedOutcome === out.id
                      ? 'bg-sky-50 border-[#0284C7] ring-1 ring-[#0284C7]/30'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="outcome"
                    value={out.id}
                    checked={selectedOutcome === out.id}
                    onChange={() => setSelectedOutcome(out.id)}
                    className="mt-0.5 text-[#0284C7] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">{out.label}</span>
                    <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">{out.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Resolution Notes */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Resolution Memo / Document Reference:
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Dispatched replacement pair via Blue Dart AWB #BLR-889124..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-gray-500">Logged under ISO / ARAI warranty records</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold cursor-pointer shadow-xs"
            >
              Confirm Adjudication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
