import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Car,
  Image as ImageIcon,
  ArrowRight,
  X
} from 'lucide-react';
import {
  SellerReturnItem,
  SellerReturnReason,
  SellerReturnWorkflowStatus
} from '../../types/seller';
import { useToast } from '../../context/ToastContext';

interface SellerReturnsPageProps {
  returns: SellerReturnItem[];
  onUpdateReturnStatus: (
    returnId: string,
    status: SellerReturnWorkflowStatus,
    notes?: string
  ) => void;
}

export const SellerReturnsPage: React.FC<SellerReturnsPageProps> = ({
  returns,
  onUpdateReturnStatus
}) => {
  const { showToast } = useToast();
  const [selectedReturn, setSelectedReturn] = useState<SellerReturnItem | null>(null);
  const [additionalNoteInput, setAdditionalNoteInput] = useState('');
  const [showRequestInfoInput, setShowRequestInfoInput] = useState(false);

  const stages: { key: SellerReturnWorkflowStatus; label: string }[] = [
    { key: 'submitted', label: 'Return Request' },
    { key: 'under_verification', label: 'Verification' },
    { key: 'pickup_scheduled', label: 'Pickup' },
    { key: 'under_inspection', label: 'Inspection' },
    { key: 'approved', label: 'Approved' },
    { key: 'refund_initiated', label: 'Refund/Replace' }
  ];

  const handleAction = (status: SellerReturnWorkflowStatus, notes?: string) => {
    if (!selectedReturn) return;
    onUpdateReturnStatus(selectedReturn.id, status, notes);
    showToast('Return Updated', `Return ${selectedReturn.id} updated to ${status.replace('_', ' ')}.`, 'success');
    setSelectedReturn(null);
    setShowRequestInfoInput(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
        <h2 className="text-base font-bold text-stone-900">
          Customer Return Requests ({returns.length})
        </h2>
        <p className="text-xs text-stone-500">
          Manage reverse logistics, product authenticity verification, and customer reimbursement
        </p>
      </div>

      {/* Returns List */}
      <div className="space-y-3">
        {returns.map(ret => {
          const statusColors: Record<string, string> = {
            under_verification: 'bg-amber-50 text-amber-900 border-amber-200',
            pickup_scheduled: 'bg-blue-50 text-blue-900 border-blue-200',
            under_inspection: 'bg-purple-50 text-purple-900 border-purple-200',
            approved: 'bg-emerald-50 text-emerald-900 border-emerald-200',
            rejected: 'bg-rose-50 text-rose-900 border-rose-200'
          };

          return (
            <div
              key={ret.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-3 hover:border-stone-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-stone-950">{ret.id}</span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Order Ref: <strong>{ret.orderId}</strong>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500">{ret.submittedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
                    Reason: {ret.reason}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      statusColors[ret.status] || 'bg-stone-50 text-stone-700'
                    }`}
                  >
                    {ret.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Product and Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 flex items-start gap-3">
                  <img
                    src={ret.productImage}
                    alt=""
                    className="w-12 h-12 rounded-xl object-contain bg-stone-50 border border-stone-200 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-950 truncate">
                      {ret.productTitle}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-mono block">
                      Part No: {ret.partNumber} • Qty: {ret.quantity}
                    </span>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                      <strong>Customer Explanation:</strong> "{ret.customerExplanation}"
                    </p>
                    {ret.vehicleDetails && (
                      <span className="text-[10px] text-stone-500 font-semibold block mt-1">
                        Vehicle Context: {ret.vehicleDetails}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-4 flex sm:flex-col items-end justify-between sm:justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-2 md:pt-0 md:pl-4 text-right space-y-1">
                  <div>
                    <span className="text-stone-400 text-[10px] block">Refund Value</span>
                    <span className="text-base font-extrabold text-stone-950 font-mono">
                      ₹{ret.refundAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedReturn(ret)}
                    className="px-3.5 py-1.5 bg-[#16181D] hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>View Case Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Details & Actions Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedReturn(null)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 text-xs">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-bold block">
                  Return Verification Case
                </span>
                <h3 className="text-base font-extrabold text-stone-950 font-mono">
                  {selectedReturn.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReturn(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <img
                  src={selectedReturn.productImage}
                  alt=""
                  className="w-12 h-12 rounded-lg object-contain bg-white border border-stone-200 p-1 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-stone-950 truncate">{selectedReturn.productTitle}</h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Part No: {selectedReturn.partNumber} • Order: {selectedReturn.orderId}
                  </span>
                </div>
              </div>

              {/* Exact Reason & Customer Notes */}
              <div className="space-y-1.5">
                <span className="font-bold text-stone-700 block">Declared Return Reason</span>
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-950 font-semibold">
                  {selectedReturn.reason}
                </div>
                <p className="text-stone-600 leading-relaxed pt-1">
                  <strong>Customer Explanation:</strong> {selectedReturn.customerExplanation}
                </p>
              </div>

              {/* Evidence Photos */}
              <div className="space-y-1.5">
                <span className="font-bold text-stone-700 block">Submitted Evidence Photos</span>
                <div className="flex items-center gap-3">
                  {selectedReturn.evidencePhotos.map((img, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-xl bg-stone-50 border border-stone-200 p-1 overflow-hidden"
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information Request Box */}
              {showRequestInfoInput ? (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-300 space-y-2">
                  <span className="font-bold text-stone-800 block">
                    Clarification Required from Customer
                  </span>
                  <textarea
                    rows={2}
                    value={additionalNoteInput}
                    onChange={e => setAdditionalNoteInput(e.target.value)}
                    placeholder="e.g. Please upload photo of the caliper mounting holes and chassis VIN plate..."
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRequestInfoInput(false)}
                      className="text-xs text-stone-500 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('additional_info_required', additionalNoteInput)}
                      className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg text-xs"
                    >
                      Send Request to Customer
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50">
              <button
                type="button"
                onClick={() => setSelectedReturn(null)}
                className="text-stone-500 font-bold hover:underline"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestInfoInput(true)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-bold rounded-xl hover:bg-stone-100 cursor-pointer"
                >
                  Request More Info
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('pickup_scheduled')}
                  className="px-4 py-2 bg-[#16181D] hover:bg-stone-800 text-[#E8D5A3] font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Approve Pickup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
