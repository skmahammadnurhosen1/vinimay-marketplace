import React from 'react';
import {
  LayoutDashboard,
  PackageCheck,
  ShoppingCart,
  Users,
  TrendingUp,
  ShieldAlert,
  Boxes,
  BarChart3,
  Building2,
  Bell,
  LogOut,
  ArrowLeft,
  X,
  BadgeCheck,
  ExternalLink,
  Store,
  Layers,
} from 'lucide-react';
import { ManufacturerPortalTab, ManufacturerBrandProfile } from '../../types/manufacturer';

interface ManufacturerSidebarProps {
  activeTab: ManufacturerPortalTab;
  onSelectTab: (tab: ManufacturerPortalTab) => void;
  brand: ManufacturerBrandProfile;
  unreadNotifsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin' | 'b2b') => void;
  onLogout: () => void;
}

export const ManufacturerSidebar: React.FC<ManufacturerSidebarProps> = ({
  activeTab,
  onSelectTab,
  brand,
  unreadNotifsCount,
  isOpenMobile,
  onCloseMobile,
  onSwitchPortal,
  onLogout,
}) => {
  const navItems: {
    id: ManufacturerPortalTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Product Catalogue', icon: PackageCheck },
    { id: 'orders', label: 'Marketplace Orders', icon: ShoppingCart },
    { id: 'dealers', label: 'Dealer Performance', icon: Users },
    { id: 'demand', label: 'Customer Demand', icon: TrendingUp },
    { id: 'returns-warranty', label: 'Returns & Warranty', icon: ShieldAlert },
    { id: 'inventory', label: 'Stock & Inventory', icon: Boxes },
    { id: 'revenue', label: 'Revenue & Sales', icon: BarChart3 },
    { id: 'profile', label: 'Brand Profile', icon: Building2 },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
  ];

  const handleTabClick = (tab: ManufacturerPortalTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#0B132B] text-gray-200 border-r border-gray-800/80 w-64 lg:w-72 select-none">
      {/* 1. Brand Header (shrink-0) */}
      <div className="p-4 border-b border-gray-800/80 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-[#38BDF8]">
              OEM PORTAL
            </span>
            <span className="text-[10px] font-mono text-gray-400">v2.4</span>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Brand Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#111D38] border border-sky-600/30 shadow-xs">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 border border-gray-700/80 shrink-0">
            <img src={brand.logo} alt={brand.brandName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white truncate">{brand.shortName}</span>
              <BadgeCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
            </div>
            <p className="text-[10px] text-gray-400 truncate">{brand.verificationStatus}</p>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Navigation List (flex-1 min-h-0 overflow-y-auto) */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5">
          Workspaces
        </div>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md shadow-[#0284C7]/20 font-semibold'
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-sky-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Footer Operations (shrink-0) */}
      <div className="p-3 border-t border-gray-800/80 shrink-0 space-y-2 text-xs">
        {/* Switch Portal Links */}
        <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Marketplace Hubs:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {onSwitchPortal && (
              <>
                <button
                  onClick={() => onSwitchPortal('customer')}
                  className="px-2 py-1 text-[10px] rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  Storefront
                </button>
                <button
                  onClick={() => onSwitchPortal('seller')}
                  className="px-2 py-1 text-[10px] rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  Seller Hub
                </button>
                <button
                  onClick={() => onSwitchPortal('admin')}
                  className="px-2 py-1 text-[10px] rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  Admin Console
                </button>
                <button
                  onClick={() => onSwitchPortal('b2b')}
                  className="px-2 py-1 text-[10px] rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  B2B Portal
                </button>
              </>
            )}
          </div>
        </div>

        {/* Logout / Switch Brand */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition text-xs cursor-pointer border border-gray-800"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Brand / Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-30 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 max-w-[85vw] h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
