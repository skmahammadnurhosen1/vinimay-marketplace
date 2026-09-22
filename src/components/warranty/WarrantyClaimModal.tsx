import React, { useState } from 'react';
import { CustomerOrder, Product, SelectedVehicle } from '../../types';
import { orderService } from '../../services/orderService';
import {
  X,
  ShieldCheck,
  Upload,
  Video,
  FileText,
  Car,
  AlertCircle,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface WarrantyClaimModalProps {
  order: CustomerOrder | null;
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (claimId: string) => void;
}

export const WarrantyClaimModal: React.FC<WarrantyClaimModalProps> = ({
  order,
  product,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [problemDescription, setProblemDescription] = useState('');
  const [demoPhotos, setDemoPhotos] = useState<string[]>([]);
  const [demoVideoName, setDemoVideoName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order || !product) return null;

  const vehicle: SelectedVehicle = order.vehicleContext || {
    vehicleType: 'commercial',
    manufacturer: 'Tata',
    model: 'Ace Gold',
    year: 2022,
    fuelType: 'Diesel',
    engine: '700cc Dicor',
    variant: 'Standard'
  };

  const invoiceNumber = `INV-${order.id}`;
  const warrantyPeriod = product.warranty || '12 Months / 20,000 km Warranty';

  const handleAddPhoto = () => {
    setDemoPhotos(prev => [...prev, product.images[0]]);
    showToast('Photo Evidence Added', 'Part photo attached for manufacturer engineering review.', 'info');
  };

  const handleAddVideo = () => {
    setDemoVideoName('installation_noise_vibration_test.mp4');
    showToast('Video Attached', 'Video file attached: installation_noise_vibration_test.mp4 (demo).', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim()) {
      showToast('Missing Description', 'Please provide a description of the defect.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const claim = orderService.submitWarrantyClaim({
        orderId: order.id,
        productId: product.id,
        product,
        partNumber: product.partNumber,
        vehicle,
        problemDescription: problemDescription.trim(),
        photos: demoPhotos.length > 0 ? demoPhotos : [product.images[0]],
        videoName: demoVideoName || undefined,
        invoiceNumber,
        warrantyPeriod
      });

      setIsSubmitting(false);
      showToast('Claim Registered', `Warranty claim #${claim.id} logged for manufacturer assessment.`, 'success');
      onSuccess(claim.id);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-950">
                Official Manufacturer Warranty Claim
              </h3>
              <p className="text-xs text-gray-500">
                Submit defect report with technical evidence for replacement or repair
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
          {/* Warranty Coverage Panel */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-[#071530] text-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFBA00]">
                Active Warranty Coverage
              </span>
              <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20">
                {warrantyPeriod}
              </span>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Covers manufacturing defects, metallurgical flaws, premature wear, and functional failure under normal vehicle operating conditions.
            </p>
          </div>

          {/* 8 Required Fields Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Order ID */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">1. Order ID</span>
              <div className="font-mono font-bold text-gray-900 mt-0.5">{order.id}</div>
            </div>

            {/* 2. Part Number */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">2. Part Number</span>
              <div className="font-mono font-bold text-gray-900 mt-0.5">{product.partNumber}</div>
            </div>

            {/* 3. Product */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 sm:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">3. Product & Brand</span>
              <div className="font-bold text-gray-900 mt-0.5">
                {product.brand} • {product.title}
              </div>
            </div>

            {/* 4. Vehicle Context */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 sm:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">4. Vehicle Fitment Context</span>
              <div className="font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#0B56D0]" />
                <span>
                  {vehicle.manufacturer} {vehicle.model} ({vehicle.year}) • {vehicle.fuelType} • {vehicle.engine}
                </span>
              </div>
            </div>

            {/* 5. Invoice Reference */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 sm:col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">8. Tax Invoice Reference</span>
                <div className="font-mono font-bold text-gray-900 mt-0.5">{invoiceNumber}</div>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                Verified Purchase
              </span>
            </div>
          </div>

          {/* 5. Problem Description */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              5. Problem Description / Symptoms <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              placeholder="Describe when the defect occurred, kilometers driven, symptoms (e.g. noise, seizure, fluid leak, vibration)..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#0B56D0]"
              required
            />
          </div>

          {/* 6. Photos Attachment (Demo) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-800">
                6. Photographs of Installed / Failed Part
              </label>
              <span className="text-[10px] text-gray-400 font-mono">JPG, PNG</span>
            </div>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 text-xs font-bold text-[#0B56D0] bg-gray-50/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Attach Part Photograph (Demo)</span>
            </button>
            {demoPhotos.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {demoPhotos.map((src, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-lg border border-gray-300 p-1 bg-white">
                    <img src={src} alt="Defect" className="w-full h-full object-contain" />
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 text-[8px]">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. Video Attachment (Demo) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-800">
                7. Diagnostic Video Clip (Optional)
              </label>
              <span className="text-[10px] text-gray-400 font-mono">MP4, MOV (Max 50MB)</span>
            </div>
            <button
              type="button"
              onClick={handleAddVideo}
              className="w-full p-3 border border-gray-300 rounded-xl hover:border-blue-400 text-xs font-bold text-gray-700 bg-gray-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-[#0B56D0]" />
              <span>{demoVideoName ? `Attached: ${demoVideoName}` : 'Attach Video of Part in Operation (Demo)'}</span>
            </button>
          </div>

          {/* Policy Notice */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900">
            <strong>Warranty Outcomes:</strong> Manufacturer assessment will determine outcome: <strong>Replacement</strong> with brand-new unit, professional <strong>Repair</strong>, store <strong>Credit</strong>, or full <strong>Refund</strong> based on engineering terms.
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
              className="text-xs font-bold shadow-md bg-[#0B56D0] hover:bg-blue-800"
            >
              {isSubmitting ? 'Registering Claim...' : 'Submit Warranty Claim'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
