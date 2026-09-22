import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  FileText,
  Video,
  Image as ImageIcon,
  ArrowRight,
  X
} from 'lucide-react';
import {
  SellerWarrantyClaim,
  SellerWarrantyClaimStatus,
  SellerWarrantyOutcome
} from '../../types/seller';
import { useToast } from '../../context/ToastContext';

interface SellerWarrantyPageProps {
  claims: SellerWarrantyClaim[];
  onUpdateWarranty: (
    claimId: string,
    status: SellerWarrantyClaimStatus,
    outcome?: SellerWarrantyOutcome,
    notes?: string
  ) => void;
}

export const SellerWarrantyPage: React.FC<SellerWarrantyPageProps> = ({
  claims,
  onUpdateWarranty
}) => {
  const { showToast } = useToast();
  const [selectedClaim, setSelectedClaim] = useState<SellerWarrantyClaim | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<SellerWarrantyOutcome>('replacement');
  const [outcomeNotes, setOutcomeNotes] = useState('');

  const stages = [
    { key: 'submitted', label: 'Claim Submitted' },
    { key: 'under_review', label: 'Technical Review' },
    { key: 'approved', label: 'Outcome Decided' },
    { key: 'resolution_in_progress', label: 'Fulfillment' }
  ];

  const handleResolve = (status: SellerWarrantyClaimStatus) => {
    if (!selectedClaim) return;
    onUpdateWarranty(selectedClaim.id, status, selectedOutcome, outcomeNotes);
    showToast(
      'Warranty Evaluated',
      `Claim ${selectedClaim.id} updated to ${status.toUpperCase()} with resolution ${selectedOutcome.toUpperCase()}.`,
      'success'
    );
    setSelectedClaim(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
        <h2 className="text-base font-bold text-stone-900">
          Warranty Claims Desk ({claims.length})
        </h2>
        <p className="text-xs text-stone-500">
          Review technical defect evidence, lab inspection notes, and approve manufacturer replacements or credits
        </p>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {claims.map(claim => (
          <div
            key={claim.id}
            className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-3 hover:border-stone-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-sm text-stone-950">{claim.id}</span>
                <span className="text-[11px] text-stone-400 font-mono">
                  Order: <strong>{claim.orderId}</strong>
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500">{claim.submittedDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200">
                  {claim.status.replace('_', ' ')}
                </span>
                {claim.outcome && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Resolution: {claim.outcome}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-1.5">
                <h4 className="text-xs font-bold text-stone-950">{claim.productTitle}</h4>
                <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono">
                  <span>Part No: {claim.partNumber}</span>
                  <span>• Invoice: {claim.invoiceNumber}</span>
                  <span>• Policy: {claim.warrantyPeriod}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <strong>Defect Summary:</strong> "{claim.problemDescription}"
                </div>
                <span className="text-[11px] text-stone-500 block">
                  Vehicle: {claim.vehicle.year} {claim.vehicle.manufacturer} {claim.vehicle.model} ({claim.vehicle.engine})
                </span>
              </div>

              <div className="md:col-span-4 flex sm:flex-col items-end justify-between sm:justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-2 md:pt-0 md:pl-4 text-right space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-stone-400" /> {claim.photos.length} Photos
                  </span>
                  {claim.videoName && (
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <Video className="w-3.5 h-3.5" /> Video Proof
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedClaim(claim);
                    if (claim.outcome) setSelectedOutcome(claim.outcome);
                  }}
                  className="px-4 py-1.5 bg-[#16181D] hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Evaluate Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warranty Evidence & Outcome Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedClaim(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 text-xs">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-bold block">
                  Warranty Evaluation Dossier (8 Mandatory Fields)
                </span>
                <h3 className="text-base font-extrabold text-stone-950 font-mono">
                  {selectedClaim.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Field 1 & 2: Order ID & Product */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-400 text-[10px] block">1. Order ID</span>
                  <span className="font-mono font-bold text-stone-950 text-xs">{selectedClaim.orderId}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">2. Product Title</span>
                  <span className="font-bold text-stone-900 text-xs truncate block">{selectedClaim.productTitle}</span>
                </div>
              </div>

              {/* Field 3 & 4: Part Number & Vehicle */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-400 text-[10px] block">3. Part Number</span>
                  <span className="font-mono font-bold text-stone-950 text-xs">{selectedClaim.partNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">4. Vehicle Fitment</span>
                  <span className="font-semibold text-stone-800 text-xs">
                    {selectedClaim.vehicle.year} {selectedClaim.vehicle.manufacturer} {selectedClaim.vehicle.model}
                  </span>
                </div>
              </div>

              {/* Field 5: Problem Description */}
              <div className="space-y-1">
                <span className="font-bold text-stone-700 block">5. Defect Description</span>
                <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 text-red-950 leading-relaxed">
                  {selectedClaim.problemDescription}
                </div>
              </div>

              {/* Field 6, 7, 8: Photos, Video, Invoice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] block">6. Photos</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {selectedClaim.photos.map((p, i) => (
                      <div key={i} className="w-10 h-10 rounded-lg bg-white border p-1">
                        <img src={p} alt="" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] block">7. Video Evidence</span>
                  <span className="font-mono text-[11px] font-bold text-blue-700 block mt-1.5">
                    {selectedClaim.videoName || 'No Video Attached'}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] block">8. Invoice Number</span>
                  <span className="font-mono text-[11px] font-bold text-stone-900 block mt-1.5">
                    {selectedClaim.invoiceNumber}
                  </span>
                </div>
              </div>

              {/* OUTCOME SELECTION */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 pt-3">
                <span className="font-bold text-stone-900 block">
                  Select Warranty Resolution Outcome
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['replacement', 'repair', 'credit', 'refund'] as SellerWarrantyOutcome[]).map(outcome => (
                    <button
                      key={outcome}
                      type="button"
                      onClick={() => setSelectedOutcome(outcome)}
                      className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                        selectedOutcome === outcome
                          ? 'border-[#C59B27] bg-[#16181D] text-[#E8D5A3] shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {outcome}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-stone-600 font-medium">Technical Findings / Outcome Notes</label>
                  <textarea
                    rows={2}
                    value={outcomeNotes}
                    onChange={e => setOutcomeNotes(e.target.value)}
                    placeholder="Enter inspection laboratory notes and courier dispatch directives..."
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="text-stone-500 font-bold hover:underline"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResolve('under_review')}
                  className="px-3.5 py-2 border border-stone-300 text-stone-700 font-bold rounded-xl hover:bg-stone-100"
                >
                  Hold for Inspection
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve('approved')}
                  className="px-4 py-2 bg-[#16181D] hover:bg-stone-800 text-[#E8D5A3] font-bold rounded-xl shadow-xs"
                >
                  Authorize Resolution ({selectedOutcome.toUpperCase()})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
