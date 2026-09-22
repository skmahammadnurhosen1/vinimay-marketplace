import React, { useState } from 'react';
import {
  X,
  Package,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Car,
  Tag,
  Store,
} from 'lucide-react';
import {
  AdminProductListing,
  AdminProductApprovalStatus,
} from '../../types/admin';

interface AdminProductReviewModalProps {
  product: AdminProductListing;
  onClose: () => void;
  onUpdateStatus: (productId: string, status: AdminProductApprovalStatus) => void;
}

export const AdminProductReviewModal: React.FC<AdminProductReviewModalProps> = ({
  product,
  onClose,
  onUpdateStatus,
}) => {
  const [activeStatus, setActiveStatus] = useState<AdminProductApprovalStatus>(product.status);
  const [clarificationReason, setClarificationReason] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#16181D] text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  product.qualityTier === 'Genuine'
                    ? 'bg-purple-100 text-purple-900 border border-purple-200'
                    : product.qualityTier === 'OEM'
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {product.qualityTier} Grade
                </span>
                <span className="text-xs text-gray-400 font-mono">SKU ID: {product.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                {product.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Visual and Pricing Overview */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full sm:w-44 h-36 object-cover rounded-xl border border-gray-200 shrink-0"
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-gray-100 font-semibold text-gray-700">
                  Brand: <strong className="text-gray-900">{product.brand}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-gray-100 font-semibold text-gray-700">
                  Category: <strong className="text-gray-900">{product.category}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-gray-100 font-semibold text-gray-700">
                  Sub-System: <strong className="text-gray-900">{product.subCategory}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-700">Marketplace Price</span>
                  <div className="text-base font-black text-emerald-600">{formatCurrency(product.price)}</div>
                  <span className="text-[10px] text-gray-700 line-through">MRP {formatCurrency(product.mrp)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-700">Inventory & Stock</span>
                  <div className="text-base font-black text-gray-900">{product.stock} Units</div>
                  <span className="text-[10px] text-blue-600 font-semibold">{product.fitmentCount} vehicle fits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Part Numbers & Compatibility */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-700 font-semibold block">Manufacturer Part Number (MPN):</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{product.mpn}</span>
            </div>
            <div>
              <span className="text-gray-700 font-semibold block">OEM Factory Cross-Reference:</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{product.oemRef}</span>
            </div>
          </div>

          {/* Anti-Counterfeit Safeguard for Genuine / OEM */}
          {(product.qualityTier === 'Genuine' || product.qualityTier === 'OEM') && (
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-700" />
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Anti-Counterfeit & Authorization Safeguard Check
                </h4>
              </div>
              <p className="text-xs text-purple-900">
                Seller is listing under <strong>{product.qualityTier}</strong> quality tier. Marketplace protocol requires verified manufacturer licensing or authorized channel invoicing.
              </p>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-purple-200 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-700" />
                  <div>
                    <span className="font-bold text-gray-900 block">
                      {product.authProofFileName || 'Direct_Manufacturer_Distribution_License.pdf'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Status: {product.authProofStatus || 'Valid Certificate Attached'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Simulating inspection of manufacturer certificate...')}
                  className="px-3 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Inspect Proof</span>
                </button>
              </div>
            </div>
          )}

          {/* Seller Provenance */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#C59B27]" />
              <div>
                <span className="font-semibold text-gray-700">Submitted by:</span>
                <span className="font-bold text-gray-900 ml-1.5">{product.sellerName}</span>
                <span className="ml-2 text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                  {product.sellerType}
                </span>
              </div>
            </div>
            <span className="text-gray-700">Date: {product.submittedDate}</span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-1">Catalog Description</h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
              {product.description}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700">Listing Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              product.status === 'Approved'
                ? 'bg-emerald-100 text-emerald-800'
                : product.status === 'Rejected'
                ? 'bg-rose-100 text-rose-800'
                : product.status === 'Requires Clarification'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {product.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateStatus(product.id, 'Approved');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Listing</span>
            </button>

            <button
              onClick={() => {
                onUpdateStatus(product.id, 'Requires Clarification');
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Request Clarification</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Reject listing for ${product.title}?`)) {
                  onUpdateStatus(product.id, 'Rejected');
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
