import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Percent,
} from 'lucide-react';
import { b2bService } from '../../services/b2bService';
import { B2BGarageProfile, B2BFleetProfile } from '../../types/b2b';

interface B2BCreditPageProps {
  onGoToProducts: () => void;
}

export const B2BCreditPage: React.FC<B2BCreditPageProps> = ({ onGoToProducts }) => {
  const [profile, setProfile] = useState<B2BGarageProfile | B2BFleetProfile>(
    b2bService.getActiveProfile()
  );
  const [appliedEarlyAccess, setAppliedEarlyAccess] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState('500000');
  const [selectedCycle, setSelectedCycle] = useState('30');
  const [bankStatementName, setBankStatementName] = useState('');

  useEffect(() => {
    const unsub = b2bService.subscribe(() => {
      setProfile(b2bService.getActiveProfile());
    });
    return unsub;
  }, []);

  const businessName =
    profile.accountType === 'garage'
      ? (profile as B2BGarageProfile).businessName
      : (profile as B2BFleetProfile).companyName;

  const creditLimit = profile.creditLimit || 500000;
  const creditAvailable = profile.creditAvailable || 380000;
  const creditUtilized = Math.max(0, creditLimit - creditAvailable);
  const utilizationPct = Math.round((creditUtilized / creditLimit) * 100);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedEarlyAccess(true);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* Banner / Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-[#071530] to-blue-950 text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-6 hidden md:flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Up to ₹10,00,000 Credit Limit
        </div>

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/20">
            <CreditCard className="w-3.5 h-3.5" />
            Working Capital for Automotive Businesses
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            AutoPartsHub Business Credit Line
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Keep your workshop bays moving and fleet rolling. Procure OEM & genuine parts instantly
            with <strong className="text-white">Net 30, Net 45, or Net 60 days payment terms</strong> at 0% interest on timely settlements.
          </p>
        </div>
      </div>

      {/* Current Facility Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">{businessName}</h2>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {profile.accountType} Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              GSTIN: {profile.gstin} • Verified Enterprise Partner
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Facility
            </span>
          </div>
        </div>

        {/* Credit Meter & Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Available Credit</p>
            <p className="text-3xl font-extrabold text-emerald-600">
              ₹{creditAvailable.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400">Ready to spend immediately at checkout</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Utilized Balance</p>
            <p className="text-3xl font-extrabold text-slate-900">
              ₹{creditUtilized.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400">Due on 15th of next month</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Approved Line</p>
            <p className="text-3xl font-extrabold text-blue-600">
              ₹{creditLimit.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400">Revolving credit limit</p>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-slate-600">Credit Line Utilization ({utilizationPct}%)</span>
            <span className="text-slate-500">₹{creditUtilized.toLocaleString('en-IN')} of ₹{creditLimit.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                utilizationPct > 80 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, utilizationPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Advantages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Net 30/45/60 Terms</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Consolidate all weekly or bi-weekly multi-vendor part orders into a single monthly settlement statement.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">0% Interest Window</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Pay zero interest during your approved credit cycle. Clear dues via NEFT, RTGS, or UPI before statement due dates.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Instant Checkout</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Dispatch parts immediately without waiting for payment gateway approvals or manager credit cards during rush repair jobs.
          </p>
        </div>
      </div>

      {/* Credit Limit Enhancement / Early Access Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-xs font-semibold mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Phase 8 Early Access & Enhancement
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Request Credit Limit Enhancement or Net 60 Terms
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Need a larger limit for seasonal fleet overhaul or multicity workshop expansion? Submit a paperless request.
          </p>
        </div>

        {appliedEarlyAccess ? (
          <div className="mt-6 p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900">Credit Enhancement Request Logged!</h3>
            <p className="text-sm text-emerald-700 max-w-lg mx-auto">
              Your request for ₹{(Number(requestedAmount) || 500000).toLocaleString('en-IN')} with Net {selectedCycle} terms is under review by our credit risk desk. Verification typically completes within 4 business hours.
            </p>
            <button
              onClick={onGoToProducts}
              className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
            >
              Continue Ordering Parts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Desired Credit Limit (₹)
                </label>
                <select
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="500000">₹5,00,000 (Standard Workshop Line)</option>
                  <option value="750000">₹7,50,000 (Multi-Bay Garage Line)</option>
                  <option value="1000000">₹10,00,000 (Commercial Fleet Operator Line)</option>
                  <option value="1500000">₹15,00,000 (Enterprise Multi-Depot Fleet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Payment Term
                </label>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">Net 30 Days (Standard Settlement)</option>
                  <option value="45">Net 45 Days (Extended Terms)</option>
                  <option value="60">Net 60 Days (High-Volume Fleet Terms)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paperless Verification Document (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="file"
                  id="bankFile"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBankStatementName(e.target.files[0].name);
                    }
                  }}
                />
                <label htmlFor="bankFile" className="cursor-pointer block">
                  <div className="text-slate-400 flex justify-center mb-1">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  {bankStatementName ? (
                    <span className="text-xs font-medium text-emerald-600">
                      Uploaded: {bankStatementName}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Click to upload 3-month GST Return or Bank Statement PDF for instant limit approval
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm"
              >
                Submit Facility Application
              </button>
              <span className="text-xs text-slate-400">
                Zero processing fees • Fast digital turnaround
              </span>
            </div>
          </form>
        )}
      </div>

      {/* Eligibility FAQ Table */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Business Credit Facility Eligibility Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Active GSTIN</span>
            <p className="text-slate-500">
              Valid GST registration with at least 6 months of regular filing status in India.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Monthly Procurement</span>
            <p className="text-slate-500">
              Minimum ₹50,000 recurring monthly spare parts demand across workshop or fleet operations.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Clean Settlement History</span>
            <p className="text-slate-500">
              Good commercial payment track record with zero defaults on auto-debit / NACH mandates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
