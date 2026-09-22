import React, { useState } from 'react';
import { Building2, ShieldCheck, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellerModal: React.FC<SellerModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [sellerType, setSellerType] = useState('distributor');
  const [formData, setFormData] = useState({
    businessName: '',
    gstin: '',
    contactName: '',
    phone: '',
    email: '',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Seller Application Submitted',
      'Our Partner Onboarding Specialist will contact you within 24 business hours.',
      'success'
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join India’s Premier Auto Parts Network"
      subtitle="Register your business as an Authorized Distributor, Manufacturer, Wholesaler, or Specialist Retailer."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tier selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Select Your Business Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'manufacturer', label: 'Manufacturer', icon: Building2 },
              { id: 'distributor', label: 'Authorized Dist.', icon: ShieldCheck },
              { id: 'wholesaler', label: 'Wholesaler', icon: TrendingUp },
              { id: 'retailer', label: 'Retailer', icon: Users }
            ].map(tier => {
              const Icon = tier.icon;
              return (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setSellerType(tier.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    sellerType === tier.id
                      ? 'border-[#C59B27] bg-[#FAF4E6] text-[#866311] ring-1 ring-[#C59B27]'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1 text-[#C59B27]" />
                  <span className="text-xs font-bold block">{tier.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Business / Registered Enterprise Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Auto Spares Pvt. Ltd."
              value={formData.businessName}
              onChange={e => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              GSTIN Registration Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={formData.gstin}
              onChange={e => setFormData({ ...formData, gstin: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Authorized Contact Person *
            </label>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.contactName}
              onChange={e => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mobile / WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Official Business Email *
            </label>
            <input
              type="email"
              required
              placeholder="distributor@apexauto.in"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Warehouse Operating City & State *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pune, Maharashtra"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#C59B27]"
            />
          </div>
        </div>

        {/* Requirements info */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="font-bold text-stone-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Seller Onboarding Standards</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Valid GSTIN certificate, PAN card, authorized dealership agreement (for OEM/Genuine lines), and active warehouse facilities are verified prior to account activation on seller subdomain.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Submit Seller Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
