import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Factory,
  BadgeCheck,
} from 'lucide-react';
import { manufacturerService, BRAND_PROFILES } from '../../services/manufacturerService';
import { ManufacturerBrandProfile } from '../../types/manufacturer';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

interface ManufacturerLoginProps {
  onLoginSuccess: () => void;
  onBackToStorefront: () => void;
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin' | 'b2b') => void;
}

export const ManufacturerLogin: React.FC<ManufacturerLoginProps> = ({
  onLoginSuccess,
  onBackToStorefront,
  onSwitchPortal,
}) => {
  const { refreshProfile } = useAuth();
  const brands = Object.values(BRAND_PROFILES);
  const [selectedBrand, setSelectedBrand] = useState<ManufacturerBrandProfile>(brands[0]);
  const [email, setEmail] = useState('corporate.oem@bosch.com');
  const [password, setPassword] = useState('Autoparts@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSelectBrand = (brand: ManufacturerBrandProfile) => {
    setSelectedBrand(brand);
    setEmail(`oem.alliances@${brand.shortName.toLowerCase().replace(/\s+/g, '')}.in`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (email.trim() && password.trim()) {
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (authErr: any) {
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            // Attempt auto-provisioning for OEM testing
            await createUserWithEmailAndPassword(auth, email.trim(), password);
          } else {
            throw authErr;
          }
        }
        await refreshProfile();
      }

      manufacturerService.setActiveBrand(selectedBrand.id);
      onLoginSuccess();
    } catch (err: any) {
      console.warn('OEM Auth notice:', err);
      // Fallback to demo mode for quick brand access
      manufacturerService.setActiveBrand(selectedBrand.id);
      onLoginSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (brand: ManufacturerBrandProfile) => {
    setSelectedBrand(brand);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const demoEmail = `oem.${brand.id}@autopartshub.com`;
      try {
        await signInWithEmailAndPassword(auth, demoEmail, 'Autoparts@2026');
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          await createUserWithEmailAndPassword(auth, demoEmail, 'Autoparts@2026');
        }
      }
      await refreshProfile();
    } catch (e) {
      // Fallback
    }

    manufacturerService.setActiveBrand(brand.id);
    setIsLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-gray-900 flex flex-col justify-between selection:bg-[#0284C7] selection:text-white">
      {/* Top Bar with Brand Badge & Back Link */}
      <header className="h-16 border-b border-gray-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStorefront}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition cursor-pointer group font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#0284C7]" />
            <span>Marketplace Storefront</span>
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white shadow-xs">
              <Factory className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-gray-900 text-sm sm:text-base">
              AutoPartsHub <span className="text-[#0284C7] font-mono text-xs px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200">OEM PORTAL</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OEM Brand Certification Active</span>
          </span>
          {onSwitchPortal && (
            <button
              onClick={() => onSwitchPortal('seller')}
              className="text-xs text-gray-600 hover:text-[#0284C7] font-medium transition cursor-pointer"
            >
              Seller Hub
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12">
        {/* Left Side: Brand Value Proposition & Quick Selector */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Phase 9: Dedicated Enterprise Manufacturer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Direct Marketplace Oversight for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0369A1]">Automotive Brands</span>
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Real-time monitoring of SKU catalog velocity, multi-dealer consignment dispatches, reverse logistics, 8-field warranty claim adjudication, and pan-India customer demand intelligence.
            </p>
          </div>

          {/* 5 Quick Brand Selectors */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Select Demo Manufacturer Account:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {brands.map(b => {
                const isSelected = selectedBrand.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBrand(b)}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#0284C7] shadow-md ring-2 ring-[#0284C7]/20'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-200 flex items-center justify-center">
                        <img src={b.logo} alt={b.brandName} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-900 truncate">{b.shortName}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">{b.establishedYear} • {b.registeredOffice.city}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#0284C7] flex items-center justify-center text-white shrink-0 ml-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick OEM Compliance Strip */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 block font-mono">STANDARDS</span>
              <span className="text-xs font-bold text-[#0284C7]">IATF 16949</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 block font-mono">REGULATORY</span>
              <span className="text-xs font-bold text-emerald-600">ARAI Approved</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 block font-mono">ENCRYPTION</span>
              <span className="text-xs font-bold text-amber-600">256-bit TLS</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#0369A1]" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
              <img src={selectedBrand.logo} alt={selectedBrand.brandName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <span>{selectedBrand.brandName}</span>
              </h2>
              <p className="text-[11px] text-gray-500 font-mono">GSTIN: {selectedBrand.gstin}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Corporate Authorized Email:
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  OEM Security Key:
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Mock Auth Enabled</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-white border-gray-300 text-[#0284C7] focus:ring-0 w-3.5 h-3.5"
                />
                <span>Remember terminal session</span>
              </label>
              <span className="text-[11px] text-[#0284C7] font-semibold">Auto-Renewed SLA</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold text-xs tracking-wide shadow-md shadow-[#0284C7]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying OEM Accreditation...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedBrand.shortName}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Jump Buttons */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <span className="text-[11px] text-gray-500 block mb-2 font-medium text-center">
              Or Launch Instant Brand Workspaces:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {brands.map(b => (
                <button
                  key={`btn-${b.id}`}
                  type="button"
                  onClick={() => handleQuickDemoLogin(b)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition cursor-pointer border border-gray-200"
                >
                  {b.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="h-14 border-t border-gray-200 bg-white px-4 sm:px-8 flex flex-wrap items-center justify-between text-[11px] text-gray-500">
        <div>
          © 2026 AutoPartsHub OEM Platform • Powered by Automotive Tier-1 Brand Network
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBackToStorefront} className="hover:text-gray-900 transition cursor-pointer">
            Customer Storefront
          </button>
          {onSwitchPortal && (
            <>
              <button onClick={() => onSwitchPortal('seller')} className="hover:text-gray-900 transition cursor-pointer">
                Seller Hub
              </button>
              <button onClick={() => onSwitchPortal('admin')} className="hover:text-gray-900 transition cursor-pointer">
                Admin Console
              </button>
              <button onClick={() => onSwitchPortal('b2b')} className="hover:text-gray-900 transition cursor-pointer">
                B2B Wholesale
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};
