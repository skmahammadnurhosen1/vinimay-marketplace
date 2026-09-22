import React, { useState } from 'react';
import {
  X,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Percent,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Download,
  Clock,
} from 'lucide-react';
import {
  AdminSeller,
  AdminDocumentVerificationStatus,
  AdminSellerStatus,
} from '../../types/admin';

interface AdminSellerReviewModalProps {
  seller: AdminSeller;
  onClose: () => void;
  onUpdateStatus: (sellerId: string, status: AdminSellerStatus) => void;
  onUpdateCommission: (sellerId: string, rate: number) => void;
  onUpdateDocumentStatus: (
    sellerId: string,
    docId: string,
    status: AdminDocumentVerificationStatus,
    notes?: string
  ) => void;
}

export const AdminSellerReviewModal: React.FC<AdminSellerReviewModalProps> = ({
  seller,
  onClose,
  onUpdateStatus,
  onUpdateCommission,
  onUpdateDocumentStatus,
}) => {
  const [commissionInput, setCommissionInput] = useState<number>(seller.commissionRate);
  const [docNotes, setDocNotes] = useState<{ [docId: string]: string }>({});
  const [activeDocForNote, setActiveDocForNote] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getDocStatusBadge = (status: AdminDocumentVerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        );
      case 'Requires Action':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3" />
            Requires Action
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#16181D] text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center text-[#E5C158] shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white">
                  {seller.businessName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C59B27] text-gray-950">
                  {seller.sellerType}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                KYC Dossier ID: <span className="font-mono text-gray-300">{seller.id}</span> • Joined {seller.joinedDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Business & Tax Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div>
              <span className="text-[11px] text-gray-700 uppercase font-semibold">Owner / Signatory</span>
              <p className="text-xs font-bold text-gray-900 mt-0.5">{seller.ownerName}</p>
            </div>
            <div>
              <span className="text-[11px] text-gray-700 uppercase font-semibold">GSTIN (REG-06)</span>
              <p className="text-xs font-mono font-bold text-gray-900 mt-0.5">{seller.gstin}</p>
            </div>
            <div>
              <span className="text-[11px] text-gray-700 uppercase font-semibold">Entity PAN</span>
              <p className="text-xs font-mono font-bold text-gray-900 mt-0.5">{seller.pan}</p>
            </div>
            <div>
              <span className="text-[11px] text-gray-700 uppercase font-semibold">Location</span>
              <p className="text-xs font-bold text-gray-900 mt-0.5">{seller.city}, {seller.state}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C59B27]" />
              {seller.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              {seller.mobile}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              PIN: {seller.pincode}
            </span>
            <span className="ml-auto font-semibold text-gray-900">
              Total Marketplace GMV: {formatCurrency(seller.totalSales)} ({seller.totalOrders} orders)
            </span>
          </div>

          {/* Statutory Documents & KYC Review */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C59B27]" />
                <h3 className="font-bold text-sm text-gray-900">
                  Statutory KYC & Manufacturer Authorization Documents
                </h3>
              </div>
              <span className="text-xs text-gray-700">
                {seller.documents.filter((d) => d.status === 'Verified').length} of {seller.documents.length} verified
              </span>
            </div>

            <div className="space-y-3">
              {seller.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-gray-900">{doc.title}</span>
                      {getDocStatusBadge(doc.status)}
                    </div>
                    <p className="text-[11px] text-gray-500 font-mono">
                      {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedDate}
                    </p>
                    {doc.notes && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block font-medium">
                        Note: {doc.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert(`Simulating download of ${doc.fileName}`)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      title="Download Document"
                    >
                      <Download className="w-3 h-3" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => onUpdateDocumentStatus(seller.id, doc.id, 'Verified')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verify</span>
                    </button>

                    <button
                      onClick={() => {
                        const note = prompt('Enter requirement or reason for action required:');
                        if (note !== null) {
                          onUpdateDocumentStatus(seller.id, doc.id, 'Requires Action', note);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Action Req.</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Overrides */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#C59B27]" />
              <h3 className="font-bold text-sm text-gray-900">
                Commercial Contract & Commission Rate Agreement
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              Standard category take rate is 10.0%. Special negotiated volume tiers can be set below:
            </p>

            <div className="flex items-center gap-3">
              <div className="relative w-36">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(parseFloat(e.target.value) || 0)}
                  className="w-full pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-[#C59B27]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">%</span>
              </div>

              <button
                onClick={() => {
                  onUpdateCommission(seller.id, commissionInput);
                  alert(`Commission rate updated to ${commissionInput}%`);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition cursor-pointer"
              >
                Save Rate Override
              </button>
              <span className="text-xs text-gray-500">
                Current active rate: <strong className="text-gray-900">{seller.commissionRate}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700">Account Lifecycle:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              seller.accountStatus === 'Active'
                ? 'bg-emerald-100 text-emerald-800'
                : seller.accountStatus === 'Under Review'
                ? 'bg-blue-100 text-blue-800'
                : seller.accountStatus === 'Suspended'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {seller.accountStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {seller.accountStatus !== 'Active' && (
              <button
                onClick={() => {
                  onUpdateStatus(seller.id, 'Active');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate Seller</span>
              </button>
            )}

            {seller.accountStatus === 'Active' && (
              <button
                onClick={() => {
                  if (confirm(`Suspend account for ${seller.businessName}?`)) {
                    onUpdateStatus(seller.id, 'Suspended');
                    onClose();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Suspend Account</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
