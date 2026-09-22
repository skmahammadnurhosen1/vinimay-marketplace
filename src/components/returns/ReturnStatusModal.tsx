import React, { useState } from 'react';
import { CustomerReturnRequest, ReturnStatus } from '../../types';
import { orderService } from '../../services/orderService';
import {
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  HelpCircle,
  Car,
  Package,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface ReturnStatusModalProps {
  returnRequest: CustomerReturnRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const WORKFLOW_STEPS = [
  { id: 'submitted', label: 'Request Submitted' },
  { id: 'under_verification', label: 'Seller Verification' },
  { id: 'pickup_scheduled', label: 'Doorstep Pickup' },
  { id: 'under_inspection', label: 'Warehouse Inspection' },
  { id: 'approved', label: 'Decision (Approved)' },
  { id: 'refund_initiated', label: 'Refund / Replacement' }
];

export const ReturnStatusModal: React.FC<ReturnStatusModalProps> = ({
  returnRequest,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { showToast } = useToast();
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);

  if (!isOpen || !returnRequest) return null;

  const handleProvideInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalNotes.trim()) return;

    setIsSubmittingInfo(true);
    setTimeout(() => {
      orderService.updateReturnAdditionalInfo(returnRequest.id, additionalNotes.trim());
      setIsSubmittingInfo(false);
      setAdditionalNotes('');
      showToast('Information Updated', 'Your supplemental photo/notes have been transmitted to the merchant.', 'success');
      onUpdate();
    }, 400);
  };

  const getActiveStepIndex = (status: ReturnStatus) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'under_verification':
      case 'additional_info_required':
        return 1;
      case 'pickup_scheduled':
        return 2;
      case 'under_inspection':
        return 3;
      case 'approved':
      case 'rejected':
        return 4;
      case 'refund_initiated':
      case 'replacement_initiated':
        return 5;
      default:
        return 1;
    }
  };

  const activeIdx = getActiveStepIndex(returnRequest.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-950">
                  Return Request Status
                </h3>
                <span className="text-xs font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  #{returnRequest.id}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Order #{returnRequest.orderId} • Logged on {returnRequest.submittedDate}
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
          {/* Part & Reason summary card */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={returnRequest.product.images[0]}
                alt={returnRequest.product.title}
                className="w-14 h-14 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  {returnRequest.product.title}
                </h4>
                <div className="text-[11px] text-gray-500 font-mono">
                  Reason: <strong className="text-purple-700">{returnRequest.reason}</strong> • Merchant: {returnRequest.sellerName}
                </div>
                <div className="text-[11px] text-gray-700 mt-0.5">
                  Resolution: <strong className="capitalize">{returnRequest.resolutionType}</strong>
                  {returnRequest.refundAmount && ` (₹${returnRequest.refundAmount.toLocaleString('en-IN')})`}
                </div>
              </div>
            </div>

            {returnRequest.vehicleContext && (
              <div className="text-[11px] bg-white border border-gray-200 p-2 rounded-xl shrink-0">
                <span className="text-gray-400 block font-semibold">Vehicle:</span>
                <span className="font-bold text-gray-900">
                  {returnRequest.vehicleContext.manufacturer} {returnRequest.vehicleContext.model}
                </span>
              </div>
            )}
          </div>

          {/* Workflow Progress Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-purple-50/20 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Return & Replacement Lifecycle Workflow
            </h4>

            {/* Desktop Stepper */}
            <div className="hidden sm:block">
              <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-gray-200 z-0">
                  <div
                    className="h-full bg-purple-600 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, activeIdx) / (WORKFLOW_STEPS.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {WORKFLOW_STEPS.map((s, idx) => {
                  const isCompleted = idx < activeIdx;
                  const isCurrent = idx === activeIdx;

                  return (
                    <div key={s.id} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-purple-700 text-white shadow-xs'
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
                            ? 'text-purple-900'
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

            {/* Mobile Status Tag */}
            <div className="sm:hidden flex items-center justify-between text-xs font-bold">
              <span className="text-gray-500">Current Phase:</span>
              <span className="text-purple-800 uppercase bg-purple-100 px-2 py-0.5 rounded font-mono">
                {returnRequest.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Interactive "Additional Information Required" State */}
          {returnRequest.status === 'additional_info_required' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    Additional Information Required by Verified Merchant
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {returnRequest.additionalInfoPrompt ||
                      'Please provide a clearer photo of the part barcode or describe the fitment mismatch.'}
                  </p>
                </div>
              </div>

              {/* Action: Update Information */}
              <form onSubmit={handleProvideInfo} className="space-y-2 pt-2 border-t border-amber-200">
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Type additional details or paste barcode reference..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-amber-600"
                  required
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={isSubmittingInfo}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  {isSubmittingInfo ? 'Submitting...' : 'Update Information'}
                </Button>
              </form>
            </div>
          )}

          {/* Status Activity Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Verification & Activity History
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {returnRequest.statusHistory.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-purple-600 bg-purple-600 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-gray-900">{item.title}</span>
                      <span className="text-[11px] font-mono text-gray-400">{item.date}</span>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-gray-600 leading-relaxed">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Pickup Partner: Delhivery Reverse Express • Zero Return Shipping Fee
          </span>
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs font-bold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
