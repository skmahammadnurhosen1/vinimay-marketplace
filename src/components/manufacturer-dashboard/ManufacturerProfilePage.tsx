import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  BadgeCheck,
  Factory,
  Edit,
  CheckCircle2,
  Award,
} from 'lucide-react';
import {
  ManufacturerBrandProfile,
} from '../../types/manufacturer';

interface ManufacturerProfilePageProps {
  brand: ManufacturerBrandProfile;
  onUpdateProfile: (updates: Partial<ManufacturerBrandProfile>) => void;
  onShowToast: (msg: string) => void;
}

export const ManufacturerProfilePage: React.FC<ManufacturerProfilePageProps> = ({
  brand,
  onUpdateProfile,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTagline, setEditTagline] = useState(brand.tagline);
  const [editPocName, setEditPocName] = useState(brand.primaryContact.name);
  const [editPocPhone, setEditPocPhone] = useState(brand.primaryContact.phone);
  const [editPocEmail, setEditPocEmail] = useState(brand.primaryContact.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      tagline: editTagline,
      primaryContact: {
        ...brand.primaryContact,
        name: editPocName,
        phone: editPocPhone,
        email: editPocEmail,
      },
    });
    setIsEditing(false);
    onShowToast('Manufacturer corporate profile successfully updated!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#0284C7]" />
            <span>OEM Corporate Brand Profile & Statutory Dossier</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified corporate entity information, factory manufacturing plants, and automotive compliance certifications.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0284C7] text-xs font-semibold border border-gray-200 transition cursor-pointer flex items-center gap-2"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Brand Details</span>
        </button>
      </div>

      {/* Main Brand Profile Banner */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0 shadow-xs">
            <img src={brand.logo} alt={brand.brandName} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-gray-900">{brand.brandName}</h2>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
                <BadgeCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{brand.verificationStatus}</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium italic">"{brand.tagline}"</p>
            <p className="text-[11px] text-gray-500 font-mono">
              Legal: {brand.legalEntityName} • Est. {brand.establishedYear}
            </p>
          </div>
        </div>
      </div>

      {/* Statutory Details & Contacts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statutory & Tax Info */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Statutory Registrations</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 font-mono block">GSTIN (REG-06)</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{brand.gstin}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Active & Compliant</span>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 font-mono block">Permanent Account Number (PAN)</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{brand.pan}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 font-mono block">Corporate Identity Number (CIN)</span>
              <span className="font-mono font-bold text-gray-900 text-xs">{brand.cinNumber}</span>
            </div>
          </div>
        </div>

        {/* Registered Corporate Office */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0284C7]" />
            <span>Registered Corporate Office</span>
          </h3>

          <div className="space-y-3 text-xs text-gray-700">
            <p className="leading-relaxed">{brand.registeredOffice.address}</p>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div>City: <strong className="text-gray-900">{brand.registeredOffice.city}</strong></div>
              <div>State: <strong className="text-gray-900">{brand.registeredOffice.state} - {brand.registeredOffice.pincode}</strong></div>
              <div>Country: <strong className="text-gray-900">{brand.registeredOffice.country}</strong></div>
            </div>
          </div>
        </div>

        {/* Key Account Contact */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-600" />
            <span>OEM Commercial Representative</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <div className="font-bold text-gray-900 text-sm">{brand.primaryContact.name}</div>
              <div className="text-[11px] text-[#0284C7] font-semibold">{brand.primaryContact.designation}</div>
              <div className="text-gray-700 flex items-center gap-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{brand.primaryContact.email}</span>
              </div>
              <div className="text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{brand.primaryContact.phone}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 space-y-0.5">
              <div>OEM 24x7 Helpline: <strong className="text-gray-900 font-mono">{brand.supportContact.oemHelpline}</strong></div>
              <div>Tech Support: <strong className="text-[#0284C7] font-mono">{brand.supportContact.technicalSupportEmail}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturing Facilities */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Factory className="w-4 h-4 text-amber-500" />
          <span>Active Manufacturing Plants & Precision Foundries</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {brand.plantLocations.map((plant, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs"
            >
              <span className="font-bold text-gray-900 block truncate">{plant.facilityName}</span>
              <p className="text-gray-600 text-[11px] flex items-start gap-1">
                <MapPin className="w-3 h-3 shrink-0 text-gray-400 mt-0.5" />
                <span>{plant.address}</span>
              </p>
              <span className="inline-block text-[10px] text-[#0284C7] font-mono font-medium px-2 py-0.5 rounded bg-sky-50 border border-sky-200 mt-1">
                Spec: {plant.specialization}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & OE Accreditations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0284C7]" />
            <span>Automotive Quality Certifications</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {brand.certifications.map((cert, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{cert}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official OEM Co-Development Accreditations</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {brand.oemAccreditations.map((acc, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{acc}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Edit className="w-4 h-4 text-[#0284C7]" />
              <span>Edit Corporate Brand Profile</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Brand Tagline:</label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={e => setEditTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">POC Name:</label>
                <input
                  type="text"
                  value={editPocName}
                  onChange={e => setEditPocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">POC Phone:</label>
                  <input
                    type="text"
                    value={editPocPhone}
                    onChange={e => setEditPocPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">POC Email:</label>
                  <input
                    type="email"
                    value={editPocEmail}
                    onChange={e => setEditPocEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
