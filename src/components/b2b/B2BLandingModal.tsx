import React, { useState } from 'react';
import {
  Wrench,
  Truck,
  CheckCircle2,
  Percent,
  Receipt,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  X,
  Building2,
  Sparkles,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
} from 'lucide-react';
import { B2BAccountType } from '../../types/b2b';
import { b2bService } from '../../services/b2bService';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { apiClient } from '../../services/apiClient';

interface B2BLandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (type: B2BAccountType) => void;
}

export const B2BLandingModal: React.FC<B2BLandingModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const { currentUser, profile: userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'intro' | 'garage-form' | 'fleet-form'>('intro');

  // Common Auth State
  const [email, setEmail] = useState(userProfile?.email || currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Garage Registration State
  const [garageName, setGarageName] = useState('');
  const [garageOwner, setGarageOwner] = useState(userProfile?.displayName || '');
  const [garageMobile, setGarageMobile] = useState(userProfile?.phoneNumber?.replace('+91', '') || '');
  const [garageGstin, setGarageGstin] = useState('');
  const [garageCity, setGarageCity] = useState('');

  // Fleet Registration State
  const [fleetCompany, setFleetCompany] = useState('');
  const [fleetManager, setFleetManager] = useState(userProfile?.displayName || '');
  const [fleetMobile, setFleetMobile] = useState(userProfile?.phoneNumber?.replace('+91', '') || '');
  const [fleetGstin, setFleetGstin] = useState('');
  const [fleetSize, setFleetSize] = useState('25-50 Vehicles');

  if (!isOpen) return null;

  const handleRegisterGarage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!garageName.trim() || !garageOwner.trim() || !garageMobile.trim()) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let activeUser = auth.currentUser;
      if (!activeUser) {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please provide an email and password to create your Garage account.');
        }
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        activeUser = cred.user;
      }

      const cleanGstin = (garageGstin.trim() || '27AAECP4412F1Z8').toUpperCase();
      const cleanPan = cleanGstin.substring(2, 12) || 'AAECP4412F';

      await apiClient.post('/b2b/register', {
        accountType: 'GARAGE',
        businessName: garageName.trim(),
        contactPerson: garageOwner.trim(),
        mobile: garageMobile.trim(),
        email: email.trim() || activeUser.email || 'garage@autopartshub.com',
        gstin: cleanGstin,
        pan: cleanPan,
        businessAddress: {
          addressLine1: garageCity || 'MIDC Auto Cluster',
          city: garageCity || 'Pune',
          state: 'Maharashtra',
          pinCode: '411019',
        },
        bayCount: 4,
      });

      b2bService.updateGarageProfile({
        businessName: garageName.trim(),
        ownerName: garageOwner.trim(),
        mobile: garageMobile.trim(),
        gstin: cleanGstin,
        city: garageCity || 'Pune',
      });
      b2bService.setActiveAccountType('garage');
      await refreshProfile();
      onSelectAccount('garage');
      onClose();
    } catch (err: any) {
      console.error('Garage registration failed:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to register garage account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterFleet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fleetCompany.trim() || !fleetManager.trim() || !fleetMobile.trim()) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let activeUser = auth.currentUser;
      if (!activeUser) {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please provide an email and password to create your Fleet account.');
        }
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        activeUser = cred.user;
      }

      const cleanGstin = (fleetGstin.trim() || '24AABCT9981K1Z4').toUpperCase();
      const cleanPan = cleanGstin.substring(2, 12) || 'AABCT9981K';

      await apiClient.post('/b2b/register', {
        accountType: 'FLEET',
        businessName: fleetCompany.trim(),
        contactPerson: fleetManager.trim(),
        mobile: fleetMobile.trim(),
        email: email.trim() || activeUser.email || 'fleet@autopartshub.com',
        gstin: cleanGstin,
        pan: cleanPan,
        businessAddress: {
          addressLine1: 'Depot 12 Logistics Park',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pinCode: '380001',
        },
        fleetSize: 35,
      });

      b2bService.updateFleetProfile({
        companyName: fleetCompany.trim(),
        managerName: fleetManager.trim(),
        mobile: fleetMobile.trim(),
        gstin: cleanGstin,
      });
      b2bService.setActiveAccountType('fleet');
      await refreshProfile();
      onSelectAccount('fleet');
      onClose();
    } catch (err: any) {
      console.error('Fleet registration failed:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to register fleet account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-in fade-in">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#16181D] text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C59B27] to-[#E5C158] text-gray-950 flex items-center justify-center font-black shadow-md mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#E5C158] tracking-wider uppercase">
                  AutoPartsHub Professional
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40">
                  B2B Trade Program
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Automotive Wholesale for Garages & Fleets
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Direct trade pricing, bulk case-pack discounts, and 100% GST ITC compliant procurement.
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
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'intro' && (
            <>
              {/* 4 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
                    <Percent className="w-4 h-4" />
                  </div>
                  <strong className="text-gray-900 block text-xs">Trade Discount Pricing</strong>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Save 25% to 45% compared to retail counter MRP across all 5 core systems.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-2">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <strong className="text-gray-900 block text-xs">GST Input Tax Credit</strong>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Automated GSTR-1 matching with HSN 8708 codes and state-wise CGST/SGST/IGST breakdown.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <strong className="text-gray-900 block text-xs">Fast 1-Click Reorder</strong>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Instant restocking of regular maintenance parts (brake pads, clutch sets, shock absorbers).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <strong className="text-gray-900 block text-xs">Trade Quality Guarantee</strong>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Genuine and OEM quality verification with 100% manufacturer warranty.
                  </p>
                </div>
              </div>

              {/* Two Account Classifications Selection */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">
                  Select Your Business Account Type to Proceed
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Garage Account */}
                  <div className="p-5 rounded-xl border-2 border-amber-500/40 hover:border-amber-500 bg-amber-50/30 transition flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-900">
                        <Wrench className="w-5 h-5 text-[#C59B27]" />
                        <h4 className="font-bold text-base">Garage / Workshop Account</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Tailored for multi-brand workshops, car service stations, and repair garages.
                      </p>

                      <ul className="space-y-1.5 text-xs text-gray-700 pt-1">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Vehicle-wise exact compatibility check</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Delivery directly to workshop service bay</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Credit limit up to ₹5,00,000 (Coming Soon)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => {
                          b2bService.setActiveAccountType('garage');
                          onSelectAccount('garage');
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Sign In as Demo Garage (Apex Auto Works)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveTab('garage-form')}
                        className="w-full py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-semibold text-xs transition cursor-pointer"
                      >
                        Create New Garage Account
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Fleet Account */}
                  <div className="p-5 rounded-xl border-2 border-blue-500/40 hover:border-blue-500 bg-blue-50/30 transition flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-900">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-base">Fleet Operator Account</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Tailored for logistics hauliers, corporate taxi fleets, and commercial vehicle transport companies.
                      </p>

                      <ul className="space-y-1.5 text-xs text-gray-700 pt-1">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Heavy truck & LCV parts specialization</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Master bulk case-pack pricing & custom RFQs</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Multi-depot drop shipping & central invoicing</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => {
                          b2bService.setActiveAccountType('fleet');
                          onSelectAccount('fleet');
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Sign In as Demo Fleet (TransIndia Logistics)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveTab('fleet-form')}
                        className="w-full py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-semibold text-xs transition cursor-pointer"
                      >
                        Create New Fleet Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Garage Registration Form */}
          {activeTab === 'garage-form' && (
            <form onSubmit={handleRegisterGarage} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#C59B27]" />
                  <span>Garage / Workshop Account Registration</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('intro')}
                  className="text-gray-500 hover:text-gray-800 font-medium"
                >
                  &larr; Back to Account Options
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Workshop / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Motors Multi-Brand Garage"
                    value={garageName}
                    onChange={(e) => setGarageName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Proprietor / Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Patil"
                    value={garageOwner}
                    onChange={(e) => setGarageOwner(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Mobile Number (WhatsApp Enabled) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={garageMobile}
                    onChange={(e) => setGarageMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">GSTIN (Optional for Unregistered Garages)</label>
                  <input
                    type="text"
                    placeholder="27AXXXX0000X1ZX"
                    value={garageGstin}
                    onChange={(e) => setGarageGstin(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-800 block mb-1">City / Workshop Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bhosari Industrial Area, Pune"
                    value={garageCity}
                    onChange={(e) => setGarageCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                {!currentUser && (
                  <>
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Account Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="garage@autopartshub.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Create Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                Note: Immediate B2B access activated with wholesale trade pricing and GST ITC invoicing.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('intro')}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] disabled:opacity-60 text-gray-950 font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Garage Account...</span>
                    </>
                  ) : (
                    <span>Activate Garage Account & Enter Portal</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Fleet Registration Form */}
          {activeTab === 'fleet-form' && (
            <form onSubmit={handleRegisterFleet} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Commercial Fleet Account Registration</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('intro')}
                  className="text-gray-500 hover:text-gray-800 font-medium"
                >
                  &larr; Back to Account Options
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Transport / Fleet Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Freight Logistics Pvt Ltd"
                    value={fleetCompany}
                    onChange={(e) => setFleetCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Fleet Operations Head *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={fleetManager}
                    onChange={(e) => setFleetManager(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={fleetMobile}
                    onChange={(e) => setFleetMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Company GSTIN (Mandatory for Fleet ITC) *</label>
                  <input
                    type="text"
                    required
                    placeholder="24AABCT9981K1Z4"
                    value={fleetGstin}
                    onChange={(e) => setFleetGstin(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-800 block mb-1">Fleet Size</label>
                  <select
                    value={fleetSize}
                    onChange={(e) => setFleetSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  >
                    <option value="5-20 Vehicles">5 - 20 Commercial Vehicles</option>
                    <option value="21-50 Vehicles">21 - 50 Commercial Vehicles</option>
                    <option value="51-100 Vehicles">51 - 100 Commercial Vehicles</option>
                    <option value="100+ Commercial Prime Movers">100+ Commercial Prime Movers</option>
                  </select>
                </div>

                {!currentUser && (
                  <>
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Account Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="fleet@autopartshub.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-800 block mb-1">Create Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 text-[11px]">
                Fleet Accounts qualify for dedicated depot drops, volume pallet pricing, and consolidated billing.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('intro')}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Fleet Account...</span>
                    </>
                  ) : (
                    <span>Activate Fleet Account & Enter Portal</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
