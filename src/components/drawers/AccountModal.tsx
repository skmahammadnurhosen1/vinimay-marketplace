import React, { useState } from 'react';
import { Car, MapPin } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'garage' | 'orders'>('profile');

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Marketplace Account"
      subtitle="Manage your personal profile, vehicle garage, and order dispatches."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#16181D] to-[#2B2F38] text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#C59B27] text-[#16181D] font-bold text-lg flex items-center justify-center">
              AK
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Anil Kulkarni (Fleet Operator)</h4>
              <p className="text-xs text-stone-300">anil.kulkarni@autotrans.in • +91 98230 45678</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-[#E8D5A3] px-2.5 py-1 rounded-full border border-stone-700">
            Verified Buyer
          </span>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-stone-200 text-xs font-bold space-x-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#C59B27] text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Buyer Profile
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'garage'
                ? 'border-[#C59B27] text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            My Vehicle Garage
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#C59B27] text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Recent Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Account Type</span>
                <p className="font-bold text-stone-900 mt-0.5">Commercial Fleet & Workshop Account</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">GSTIN Registered</span>
                <p className="font-bold text-stone-900 mt-0.5">27AABCU9603R1ZM (Input Credit Active)</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <MapPin className="w-4 h-4 text-[#C59B27]" />
                <span>Primary Workshop & Delivery Address</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-xs">
                Plot No. 44, MIDC Industrial Area, Bhosari, Pune, Maharashtra 411026
              </p>
            </div>
          </div>
        )}

        {activeTab === 'garage' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-emerald-700" />
                <div>
                  <div className="font-bold text-emerald-950">
                    2022 Tata Ace Gold (Diesel 700cc Standard)
                  </div>
                  <div className="text-[11px] text-emerald-700">Currently Active Compatibility Filter</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-stone-600" />
                <div>
                  <div className="font-bold text-stone-800">
                    2023 Mahindra Thar (Diesel 2.2L mHawk LX 4x4 AT)
                  </div>
                  <div className="text-[11px] text-stone-500">Saved Passenger Vehicle</div>
                </div>
              </div>
              <button
                onClick={() => {
                  showToast('Switched Active Vehicle', 'Compatibility set to Mahindra Thar 2023', 'info');
                  onClose();
                }}
                className="text-xs font-semibold text-[#C59B27] hover:underline"
              >
                Set Active
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">Order #APH-84920</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Delivered
                </span>
              </div>
              <div className="text-stone-500 text-[11px]">
                Valeo Heavy Duty Clutch Kit • Dispatched via Express Air Cargo
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-stone-200 font-semibold text-stone-900">
                <span>Total: ₹8,499</span>
                <span className="text-stone-500 font-normal">Delivered on Sept 14, 2026</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="md" onClick={onClose}>
            Close Account View
          </Button>
        </div>
      </div>
    </Modal>
  );
};
