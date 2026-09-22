import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  ChevronDown,
  Building2,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ManufacturerBrandProfile, ManufacturerPortalTab } from '../../types/manufacturer';
import { BRAND_PROFILES } from '../../services/manufacturerService';

interface ManufacturerHeaderProps {
  brand: ManufacturerBrandProfile;
  onOpenMobileMenu: () => void;
  onOpenAddProduct: () => void;
  onNavigateTab: (tab: ManufacturerPortalTab) => void;
  unreadNotifsCount: number;
  onSwitchBrand: (brandId: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export const ManufacturerHeader: React.FC<ManufacturerHeaderProps> = ({
  brand,
  onOpenMobileMenu,
  onOpenAddProduct,
  onNavigateTab,
  unreadNotifsCount,
  onSwitchBrand,
  onSearchSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const allBrands = Object.values(BRAND_PROFILES);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0B132B] border-b border-gray-800/80 text-white flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-xs">
      {/* Left: Mobile Toggle & Brand Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#111D38] border border-sky-600/30 hover:border-sky-500/60 transition cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-md overflow-hidden bg-gray-800 shrink-0">
              <img src={brand.logo} alt={brand.shortName} className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs text-white">{brand.shortName}</span>
                <BadgeCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <span className="text-[10px] text-gray-400 block font-mono -mt-0.5">OEM Console</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>

          {/* Dropdown Menu */}
          {showBrandDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowBrandDropdown(false)}
              />
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-gray-200 shadow-xl z-40 p-2 space-y-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1">
                  Switch Active OEM Brand:
                </div>
                {allBrands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSwitchBrand(b.id);
                      setShowBrandDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition cursor-pointer ${
                      b.id === brand.id
                        ? 'bg-sky-50 text-[#0284C7] border border-sky-200 font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img src={b.logo} alt={b.shortName} className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate">{b.brandName}</span>
                    </div>
                    {b.id === brand.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Universal Search */}
      <div className="flex-1 max-w-md mx-2 sm:mx-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Part #, OEM Ref, Orders, Dealers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs rounded-xl bg-gray-900/80 border border-gray-700/80 text-white placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Product Button */}
        <button
          onClick={onOpenAddProduct}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-semibold text-xs tracking-wide shadow-md shadow-[#0284C7]/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Part Listing</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => onNavigateTab('notifications')}
          className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Brand Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Production Hub Sync Online</span>
        </div>
      </div>
    </header>
  );
};
