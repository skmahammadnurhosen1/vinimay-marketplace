import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Globe,
  LogOut,
  ChevronDown,
  Layers,
  Store,
  ExternalLink,
} from 'lucide-react';
import { AdminPortalTab } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onNavigateTab: (tab: AdminPortalTab) => void;
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin') => void;
  pendingTotal: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onNavigateTab,
  onSwitchPortal,
  pendingTotal,
}) => {
  const { currentUser, profile: authProfile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#16181D] border-b border-gray-800 flex items-center justify-between px-3 sm:px-6 shadow-xs text-white">
      {/* Left: Hamburger & Brand Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Platform Core Online</span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-gray-400 font-mono bg-gray-800/60 px-2 py-0.5 rounded border border-gray-700/40">
            <Globe className="w-3 h-3 text-[#C59B27]" />
            admin.autopartshub.com
          </span>
        </div>
      </div>

      {/* Middle: Universal Search */}
      <div className="flex-1 max-w-md mx-2 sm:mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sellers, master orders, SKUs, returns..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121418] border border-gray-700/60 rounded-lg text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#C59B27] transition"
          />
        </div>
      </div>

      {/* Right: Quick Portals & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Portal Switcher */}
        <button
          onClick={() => onSwitchPortal && onSwitchPortal('customer')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 border border-gray-700 transition cursor-pointer"
          title="Switch to Storefront"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 relative transition cursor-pointer"
            aria-label="Platform Alerts"
          >
            <Bell className="w-5 h-5" />
            {pendingTotal > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C59B27] text-gray-950 text-[10px] font-black flex items-center justify-center animate-pulse shadow-sm">
                {pendingTotal > 9 ? '9+' : pendingTotal}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-[#1a1d24] border border-gray-700 rounded-xl shadow-2xl p-3 z-50 text-gray-200 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-gray-700/70">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Action Required Alerts
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  {pendingTotal} pending
                </span>
              </div>

              <div className="py-2 space-y-2 text-xs">
                <div
                  onClick={() => {
                    onNavigateTab('sellers');
                    setShowNotifications(false);
                  }}
                  className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-800 cursor-pointer transition flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Pending Seller KYC Documents</p>
                    <p className="text-[11px] text-gray-400">Metro Shock Absorbers & Kalyan Brake works</p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    onNavigateTab('products');
                    setShowNotifications(false);
                  }}
                  className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-800 cursor-pointer transition flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Genuine / OEM Product Approvals</p>
                    <p className="text-[11px] text-gray-400">Brembo Brake Pads & Valeo Clutch Kits</p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    onNavigateTab('warranty');
                    setShowNotifications(false);
                  }}
                  className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-800 cursor-pointer transition flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Technical Warranty Claims</p>
                    <p className="text-[11px] text-gray-400">Bosch CRDi Injector backleakage evaluation</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C59B27] to-[#E5C158] text-gray-950 font-black text-xs flex items-center justify-center shadow-xs">
              SA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">Super Admin</p>
              <p className="text-[10px] text-[#C59B27] leading-tight">Master Authority</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1a1d24] border border-gray-700 rounded-xl shadow-2xl p-2 z-50 text-gray-200 text-xs animate-in fade-in duration-150">
              <div className="p-2 border-b border-gray-700/60 mb-1">
                <p className="font-bold text-white truncate">{currentUser?.email || authProfile?.email || 'admin@autopartshub.com'}</p>
                <p className="text-[10px] text-emerald-400 font-medium">Session Authenticated ({authProfile?.role || 'ADMIN'})</p>
              </div>

              <button
                onClick={() => {
                  onNavigateTab('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition cursor-pointer"
              >
                Security & RBAC Controls
              </button>

              <button
                onClick={() => onSwitchPortal && onSwitchPortal('seller')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Seller Console</span>
              </button>

              <button
                onClick={() => onSwitchPortal && onSwitchPortal('customer')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Storefront</span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  if (onSwitchPortal) onSwitchPortal('customer');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 transition flex items-center gap-2 cursor-pointer mt-1 border-t border-gray-700/60 pt-2"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out of Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
