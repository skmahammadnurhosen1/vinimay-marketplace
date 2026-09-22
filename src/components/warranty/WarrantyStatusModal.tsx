import React, { useState } from 'react';
import { CustomerWarrantyClaim, WarrantyClaimStatus } from '../../types';
import { orderService } from '../../services/orderService';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Car,
  RotateCcw,
  Send,
  HelpCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface WarrantyStatusModalProps {
  claim: CustomerWarrantyClaim | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const WARRANTY_STEPS: { id: WarrantyClaimStatus; label: string }[] = [
  { id: 'submitted', label: 'Claim Submitted' },
  { id: 'under_review', label: 'Engineering Review' },
  { id: 'approved', label: 'Claim Assessment' },
  { id: 'resolution_in_progress', label: 'Resolution (Replacement/Refund)' }
];

export const WarrantyStatusModal: React.FC<WarrantyStatusModalProps> = ({
  claim,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { showToast } = useToast();
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !claim) return null;

  const handleProvideAdditionalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalDetails.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      orderService.updateWarrantyAdditionalInfo(claim.id, additionalDetails.trim());
      setIsSubmitting(false);
      setAdditionalDetails('');
      showToast('Information Updated', 'Diagnostic technical notes transmitted to manufacturer.', 'success');
      onUpdate();
    }, 400);
  };

  const getStepIndex = (status: WarrantyClaimStatus) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'under_review':
      case 'additional_info_required':
        return 1;
      case 'approved':
      case 'rejected':
        return 2;
      case 'resolution_in_progress':
      case 'closed':
        return 3;
      default:
        return 1;
    }
  };

  const activeIdx = getStepIndex(claim.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-950">
                  Warranty Claim Status & Assessment
                </h3>
                <span className="text-xs font-mono font-bold bg-blue-100 text-[#0B56D0] px-2 py-0.5 rounded">
                  #{claim.id}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Order #{claim.orderId} • Part: {claim.partNumber} • Registered on {claim.submittedDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Part & Vehicle Details Card */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={claim.product.images[0]}
                alt={claim.product.title}
                className="w-14 h-14 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  {claim.product.title}
                </h4>
                <div className="text-[11px] text-gray-500 font-mono">
                  Brand: {claim.product.brand} • Part: {claim.partNumber} • Coverage: {claim.warrantyPeriod}
                </div>
                <div className="text-[11px] text-gray-700 mt-0.5">
                  Invoice: <strong className="font-mono">{claim.invoiceNumber}</strong>
                </div>
              </div>
            </div>

            <div className="text-[11px] bg-white border border-gray-200 p-2.5 rounded-xl shrink-0">
              <span className="text-gray-400 block font-semibold">Vehicle Fitment:</span>
              <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                <Car className="w-3.5 h-3.5 text-[#0B56D0]" />
                {claim.vehicle.manufacturer} {claim.vehicle.model} ({claim.vehicle.year})
              </span>
            </div>
          </div>

          {/* Stepper Status Flow */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50/20 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Warranty Evaluation Lifecycle
            </h4>

            <div className="hidden sm:block">
              <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 left-6 right-6 h-1 -translate-y-1/2 bg-gray-200 z-0">
                  <div
                    className="h-full bg-[#0B56D0] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, activeIdx) / (WARRANTY_STEPS.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {WARRANTY_STEPS.map((s, idx) => {
                  const isCompleted = idx < activeIdx;
                  const isCurrent = idx === activeIdx;

                  return (
                    <div key={s.id} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isCurrent
                            ? 'bg-[#0B56D0] text-white ring-4 ring-blue-100 shadow-sm'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] font-bold mt-1.5 whitespace-nowrap ${
                          isCurrent
                            ? 'text-[#0B56D0]'
                            : isCompleted
                            ? 'text-emerald-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sm:hidden flex items-center justify-between text-xs font-bold">
              <span className="text-gray-500">Current Phase:</span>
              <span className="text-blue-800 uppercase bg-blue-100 px-2 py-0.5 rounded font-mono">
                {claim.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Interactive "Additional Information Required" State */}
          {claim.status === 'additional_info_required' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    Additional Technical Diagnostic Information Required
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {claim.additionalInfoPrompt ||
                      'Please provide mechanic dial gauge measurement reading or installation certificate.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleProvideAdditionalInfo} className="space-y-2 pt-2 border-t border-amber-200">
                <textarea
                  rows={2}
                  value={additionalDetails}
                  onChange={e => setAdditionalDetails(e.target.value)}
                  placeholder="e.g. Workshop dial gauge runout measured at 0.08 mm; mechanic noted brake shudder under light pedal load..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-amber-600"
                  required
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={isSubmitting}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  {isSubmitting ? 'Submitting Notes...' : 'Update Technical Information'}
                </Button>
              </form>
            </div>
          )}

          {/* Potential Outcomes Banner */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Possible Warranty Resolutions
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div
                className={`p-2.5 rounded-xl border ${
                  claim.outcome === 'replacement'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <div className="font-bold">1. Replacement</div>
                <div className="text-[10px] text-gray-500">Brand new OEM unit</div>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  claim.outcome === 'repair'
                    ? 'border-blue-500 bg-blue-50 text-blue-950 font-bold'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <div className="font-bold">2. Repair</div>
                <div className="text-[10px] text-gray-500">Factory reconditioning</div>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  claim.outcome === 'credit'
                    ? 'border-purple-500 bg-purple-50 text-purple-950 font-bold'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <div className="font-bold">3. Store Credit</div>
                <div className="text-[10px] text-gray-500">Instant credit balance</div>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  claim.outcome === 'refund'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <div className="font-bold">4. Bank Refund</div>
                <div className="text-[10px] text-gray-500">Credited to source account</div>
              </div>
            </div>

            {claim.outcomeNotes && (
              <div className="text-[11px] text-gray-600 pt-1">
                <strong>Manufacturer Engineering Notes:</strong> {claim.outcomeNotes}
              </div>
            )}
          </div>

          {/* Evidence Submitted Preview */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-gray-800">Submitted Defect Evidence</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
              "{claim.problemDescription}"
            </p>
            {claim.photos && claim.photos.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {claim.photos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Evidence"
                    className="w-12 h-12 rounded-lg border border-gray-300 p-1 object-contain bg-white"
                  />
                ))}
                {claim.videoName && (
                  <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    🎥 {claim.videoName}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Helpline: 1800-419-AUTO • Dedicated Warranty Concierge Support
          </span>
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs font-bold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
