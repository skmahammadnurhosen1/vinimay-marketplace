import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Upload,
  Clock,
  AlertTriangle,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  Landmark
} from 'lucide-react';
import { SellerProfile, SellerDocument, SellerKYCStatus, SellerType } from '../../types/seller';
import { useToast } from '../../context/ToastContext';

interface SellerProfileKYCPageProps {
  profile: SellerProfile;
  onUpdateProfile: (updates: Partial<SellerProfile>) => void;
}

export const SellerProfileKYCPage: React.FC<SellerProfileKYCPageProps> = ({
  profile,
  onUpdateProfile
}) => {
  const { showToast } = useToast();

  const [businessName, setBusinessName] = useState(profile.businessName);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [mobile, setMobile] = useState(profile.mobile);
  const [email, setEmail] = useState(profile.email);
  const [gstin, setGstin] = useState(profile.gstin);
  const [pan, setPan] = useState(profile.pan);
  const [sellerType, setSellerType] = useState<SellerType>(profile.sellerType);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [pincode, setPincode] = useState(profile.pincode);

  const [documents, setDocuments] = useState<SellerDocument[]>(profile.documents);

  const handleDocumentUploadMock = (docId: string) => {
    setDocuments(prev =>
      prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'Under Review' as SellerKYCStatus,
            fileName: `${d.title.replace(/\s+/g, '_').substring(0, 20)}_Updated.pdf`,
            uploadedDate: new Date().toLocaleDateString('en-GB')
          };
        }
        return d;
      })
    );
    showToast(
      'Document Submitted',
      'Document uploaded for compliance review by marketplace operations team.',
      'info'
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      businessName,
      ownerName,
      mobile,
      email,
      gstin,
      pan,
      sellerType,
      address,
      city,
      state,
      pincode,
      documents
    });
    showToast('Profile Saved', 'Merchant business profile updated successfully.', 'success');
  };

  const getKYCBadge = (status: SellerKYCStatus) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Under Review':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Submitted':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Requires Action':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#16181D] border border-stone-700 flex items-center justify-center text-[#C59B27] shrink-0 shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-stone-950">{profile.businessName}</h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                Verified Merchant
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {profile.sellerType} • Registered since {profile.joinedDate} • Member ID: {profile.id}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-stone-600">
          <span className="font-bold text-stone-900 block">Trust & Quality Score: 99.4%</span>
          <span className="text-[11px] text-stone-400">Zero counterfeit complaints</span>
        </div>
      </div>

      {/* KYC DOCUMENTS & VERIFICATION DOSSIER */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
              <span>Mandatory KYC & Regulatory Documents</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Statutory verification for automotive spare parts merchant onboarding under Indian commercial law
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-stone-200 shrink-0 text-stone-700 mt-0.5 shadow-2xs">
                  <FileText className="w-5 h-5 text-[#C59B27]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-950 text-xs">{doc.title}</h4>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider border ${getKYCBadge(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono mt-0.5">
                    <span>File: {doc.fileName || 'Not uploaded'}</span>
                    {doc.fileSize && <span>• Size: {doc.fileSize}</span>}
                    {doc.uploadedDate && <span>• Uploaded: {doc.uploadedDate}</span>}
                  </div>
                  {doc.notes && (
                    <p className="text-[11px] text-emerald-800 font-medium mt-1">
                      ✓ {doc.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDocumentUploadMock(doc.id)}
                className="px-3.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                <span>{doc.fileName ? 'Replace Document' : 'Upload File'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BUSINESS PROFILE FORM */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#C59B27]" />
            <span>Company & Commercial Registration Details</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Legal identity, GSTIN tax credentials, and warehouse dispatch address
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">Registered Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Authorized Representative / Owner</label>
            <input
              type="text"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Seller Classification</label>
            <select
              value={sellerType}
              onChange={e => setSellerType(e.target.value as SellerType)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-semibold cursor-pointer"
            >
              <option value="Manufacturer">Manufacturer</option>
              <option value="Authorized Distributor">Authorized Distributor</option>
              <option value="Certified Wholesaler">Certified Wholesaler</option>
              <option value="Verified Retailer">Verified Retailer</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">GSTIN (15 Digits)</label>
            <input
              type="text"
              value={gstin}
              onChange={e => setGstin(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono text-stone-900 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Business PAN (10 Digits)</label>
            <input
              type="text"
              value={pan}
              onChange={e => setPan(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono text-stone-900 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Contact Mobile</label>
            <input
              type="text"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Business Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-semibold"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-stone-700">Warehouse Dispatch Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">City</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">State</label>
            <input
              type="text"
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">PIN Code</label>
            <input
              type="text"
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-stone-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#16181D] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Business Profile
          </button>
        </div>
      </form>
    </div>
  );
};
