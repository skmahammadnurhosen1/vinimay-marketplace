import React, { useState } from 'react';
import { CustomerOrder, Product, ReturnReason } from '../../types';
import { orderService } from '../../services/orderService';
import {
  X,
  RotateCcw,
  AlertTriangle,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Car,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface ReturnRequestModalProps {
  order: CustomerOrder | null;
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (returnId: string) => void;
}

const RETURN_REASONS: ReturnReason[] = [
  'Wrong Part',
  'Wrong Product Received',
  'Damaged Product',
  'Defective Product',
  'Manufacturing Defect',
  'Product Not Compatible',
  'Other'
];

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  order,
  product,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [selectedReason, setSelectedReason] = useState<ReturnReason>('Product Not Compatible');
  const [explanation, setExplanation] = useState('');
  const [resolutionType, setResolutionType] = useState<'refund' | 'replacement'>('refund');
  const [demoPhotos, setDemoPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order || !product) return null;

  const pkg = order.packages.find(p => p.items.some(i => i.product.id === product.id)) || order.packages[0];

  const handleAddDemoPhoto = () => {
    // Add product photo as simulated uploaded evidence
    setDemoPhotos(prev => [...prev, product.images[0]]);
    showToast('Photo Attached', 'Evidence photograph attached to return request (demo only).', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newReturn = orderService.submitReturnRequest({
        orderId: order.id,
        productId: product.id,
        product,
        quantity: 1,
        sellerId: pkg.sellerId,
        sellerName: pkg.sellerName,
        vehicleContext: order.vehicleContext,
        reason: selectedReason,
        explanation: explanation.trim() || `Customer reported: ${selectedReason}. Verified under 10-Day Fitment Guarantee.`,
        evidencePhotos: demoPhotos.length > 0 ? demoPhotos : [product.images[0]],
        resolutionType,
        refundAmount: product.price
      });

      setIsSubmitting(false);
      showToast('Return Requested', `Return request #${newReturn.id} logged successfully.`, 'success');
      onSuccess(newReturn.id);
      onClose();
    }, 500);
  };

  const isCompatibilityReason =
    selectedReason === 'Wrong Part' || selectedReason === 'Product Not Compatible';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-950">
                Initiate Return & Replacement Request
              </h3>
              <p className="text-xs text-gray-500">
                10-Day Hassle-Free Returns & 100% Fitment Guarantee Protection
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Selected Part Card */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-3">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-14 h-14 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                {product.title}
              </h4>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                Brand: {product.brand} • Part: {product.partNumber} • Order: #{order.id}
              </div>
              <div className="text-xs font-bold text-gray-950 mt-1">
                ₹{product.price.toLocaleString('en-IN')} (Eligible for Full Refund / Replacement)
              </div>
            </div>
          </div>

          {/* Vehicle Context Pill */}
          {order.vehicleContext && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#0B56D0] shrink-0" />
                <span className="font-semibold text-gray-900">
                  Vehicle: {order.vehicleContext.manufacturer} {order.vehicleContext.model} ({order.vehicleContext.year}) • {order.vehicleContext.fuelType}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                100% Fitment Covered
              </span>
            </div>
          )}

          {/* Reason Selector (Exact 7 reasons) */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Reason for Return <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={e => setSelectedReason(e.target.value as ReturnReason)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0] cursor-pointer"
            >
              {RETURN_REASONS.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Incompatibility Notice */}
          {isCompatibilityReason && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Wrong Part / Vehicle Incompatibility Selected</span>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Our technical fitment team will cross-verify your chassis/model against the OEM catalog. Return doorstep pickup will be scheduled with 100% shipping fee covered.
                </p>
              </div>
            </div>
          )}

          {/* Explanation Textarea */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Detailed Description of Problem / Defect
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="e.g. Dimensions do not align with axle mounting holes; bracket is bent; mechanic reported fitment error..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#0B56D0]"
            />
          </div>

          {/* Evidence Upload Field (Frontend Demo) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-800">
                Attach Photos / Packaging Condition (Demo)
              </label>
              <span className="text-[10px] text-gray-400 font-mono">JPG, PNG (Max 5MB)</span>
            </div>

            <div
              onClick={handleAddDemoPhoto}
              className="p-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-400 transition-colors bg-gray-50/60 cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-bold text-purple-700">
                Click to attach photo evidence (demo)
              </span>
              <span className="text-[11px] text-gray-500">
                Show part defect, packaging label, or unboxing damage
              </span>
            </div>

            {demoPhotos.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {demoPhotos.map((src, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-lg border border-gray-300 p-1 bg-white">
                    <img src={src} alt="Evidence" className="w-full h-full object-contain" />
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 text-[8px]">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resolution Preference */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Resolution Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResolutionType('refund')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  resolutionType === 'refund'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-bold'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <div className="text-xs">Full Refund to Source Account</div>
                <div className="text-[10px] text-gray-500 font-normal mt-0.5">
                  Credited within 3-5 days after warehouse inspection
                </div>
              </button>

              <button
                type="button"
                onClick={() => setResolutionType('replacement')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  resolutionType === 'replacement'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-bold'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <div className="text-xs">Free Replacement Unit</div>
                <div className="text-[10px] text-gray-500 font-normal mt-0.5">
                  Fresh OEM part dispatched immediately upon pickup
                </div>
              </button>
            </div>
          </div>

          {/* 6-Stage Workflow Preview */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
            <span className="font-bold text-gray-800 block">
              Marketplace Return Workflow:
            </span>
            <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] text-gray-500">
              <span>Customer Request</span>
              <span>→</span>
              <span>Merchant Verification</span>
              <span>→</span>
              <span>Doorstep Pickup</span>
              <span>→</span>
              <span>Inspection</span>
              <span>→</span>
              <span className="text-emerald-700 font-bold">Approved Refund/Replacement</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              className="text-xs font-bold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="text-xs font-bold shadow-md bg-purple-700 hover:bg-purple-800 text-white"
            >
              {isSubmitting ? 'Logging Return Request...' : 'Submit Return Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
