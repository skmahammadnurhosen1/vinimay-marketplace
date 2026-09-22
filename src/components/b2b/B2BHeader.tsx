import React, { useState } from 'react';
import {
  Menu,
  Search,
  ShoppingCart,
  Building2,
  Wrench,
  Truck,
  CreditCard,
  User,
  LogOut,
  ExternalLink,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { B2BAccountType, B2BPortalTab } from '../../types/b2b';
import { useAuth } from '../../context/AuthContext';

interface B2BHeaderProps {
  onOpenMobileMenu: () => void;
  onNavigateTab: (tab: B2BPortalTab) => void;
  cartItemCount: number;
  activeAccountType: B2BAccountType;
  onSwitchAccountType: (type: B2BAccountType) => void;
  onOpenOnboardingModal: () => void;
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin' | 'b2b') => void;
  businessName: string;
  creditAvailable: number;
  onSearchSubmit?: (query: string) => void;
}

export const B2BHeader: React.FC<B2BHeaderProps> = ({
  onOpenMobileMenu,
  onNavigateTab,
  cartItemCount,
  activeAccountType,
  onSwitchAccountType,
  onOpenOnboardingModal,
  onSwitchPortal,
  businessName,
  creditAvailable,
  onSearchSubmit,
}) => {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      onNavigateTab('products');
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#16181D] border-b border-gray-800 flex items-center justify-between px-3 sm:px-6 shadow-xs text-white">
      {/* Left: Hamburger & Account Persona */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Business Account Tag */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            onClick={onOpenOnboardingModal}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-800/80 hover:bg-gray-800 border border-gray-700/60 text-xs font-semibold cursor-pointer transition"
            title="Click to switch or manage business account"
          >
            {activeAccountType === 'garage' ? (
              <Wrench className="w-3.5 h-3.5 text-[#C59B27]" />
            ) : (
              <Truck className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span className="text-white max-w-[160px] truncate">{businessName}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <CreditCard className="w-3 h-3" />
            Line: {formatCurrency(creditAvailable)}
          </span>
        </div>
      </div>

      {/* Middle: Fast MPN & Part Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2 sm:mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Part Number, MPN, OEM, Brake, Clutch..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121418] border border-gray-700/60 rounded-lg text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#C59B27] transition"
          />
        </div>
      </form>

      {/* Right: Quick Portals & Cart */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Bulk Order Shortcut */}
        <button
          onClick={() => onNavigateTab('bulk-order')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 border border-gray-700 transition cursor-pointer"
          title="Open Multi-Part Bulk Order Grid"
        >
          <Layers className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Bulk Matrix</span>
        </button>

        {/* B2B Cart Button */}
        <button
          onClick={() => onNavigateTab('cart')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-bold text-xs shadow-md transition cursor-pointer"
          title="View B2B Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gray-950 text-white text-[9px] font-black flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">B2B Cart</span>
        </button>

        {/* Storefront Exit */}
        <button
          onClick={() => onSwitchPortal && onSwitchPortal('customer')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          title="Exit to Consumer Storefront"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Sign Out Button */}
        <button
          onClick={async () => {
            await logout();
            if (onSwitchPortal) onSwitchPortal('customer');
          }}
          className="p-2 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition cursor-pointer"
          title="Sign Out of B2B Account"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
