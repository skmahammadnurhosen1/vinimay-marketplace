import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Building2,
  Settings,
  X,
  Store,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { SellerNavTab, SellerProfile } from '../../types/seller';
import { useAuth } from '../../context/AuthContext';

interface SellerSidebarProps {
  activeTab: SellerNavTab;
  onSelectTab: (tab: SellerNavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  profile: SellerProfile;
  pendingOrdersCount: number;
  returnsCount: number;
  warrantyCount: number;
  lowStockCount: number;
  onSwitchToStorefront: () => void;
}

export const SellerSidebar: React.FC<SellerSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  profile,
  pendingOrdersCount,
  returnsCount,
  warrantyCount,
  lowStockCount,
  onSwitchToStorefront
}) => {
  const { logout } = useAuth();
  const navItems = [
    {
      id: 'dashboard' as SellerNavTab,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'orders' as SellerNavTab,
      label: 'Orders',
      icon: Package,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-stone-950 font-bold'
    },
    {
      id: 'products' as SellerNavTab,
      label: 'Products',
      icon: ShoppingBag
    },
    {
      id: 'add_product' as SellerNavTab,
      label: 'Add Product',
      icon: PlusCircle,
      isSub: true
    },
    {
      id: 'inventory' as SellerNavTab,
      label: 'Inventory / Stock',
      icon: Layers,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    {
      id: 'returns' as SellerNavTab,
      label: 'Return Requests',
      icon: RotateCcw,
      badge: returnsCount > 0 ? returnsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'warranty' as SellerNavTab,
      label: 'Warranty Claims',
      icon: ShieldCheck,
      badge: warrantyCount > 0 ? warrantyCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    },
    {
      id: 'sales_settlement' as SellerNavTab,
      label: 'Sales & Settlement',
      icon: TrendingUp
    },
    {
      id: 'profile_kyc' as SellerNavTab,
      label: 'Business Profile & KYC',
      icon: Building2,
      tag: profile.kycStatus === 'Verified' ? 'Verified' : 'Pending',
      tagColor:
        profile.kycStatus === 'Verified'
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'settings' as SellerNavTab,
      label: 'Store Settings',
      icon: Settings
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#16181D] text-stone-300 border-r border-stone-800 select-none">
      {/* Brand Header */}
      <div className="shrink-0 p-5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C59B27] to-[#E8D5A3] flex items-center justify-center text-stone-950 font-black text-xl shadow-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">AutoPartsHub</span>
              <span className="text-[10px] font-bold text-[#E8D5A3] uppercase tracking-wider bg-[#C59B27]/20 border border-[#C59B27]/40 px-1.5 py-0.2 rounded">
                Seller
              </span>
            </div>
            <p className="text-[11px] text-stone-400 truncate max-w-[170px] font-medium">
              Merchant Operations Hub
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
          Operations & Catalog
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                item.isSub ? 'pl-7' : ''
              } ${
                isActive
                  ? 'bg-gradient-to-r from-[#C59B27] to-[#B38A22] text-stone-950 font-bold shadow-md shadow-[#C59B27]/10'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-stone-950' : 'text-stone-400 group-hover:text-stone-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {item.tag && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${item.tagColor}`}>
                    {item.tag}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Seller Quick Profile & Switcher Footer */}
      <div className="shrink-0 p-3 border-t border-stone-800 bg-stone-900/60 space-y-2">
        <div className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/50 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <h5 className="text-xs font-bold text-white truncate">{profile.businessName}</h5>
            <span className="text-[10px] text-[#E8D5A3] block truncate">
              {profile.sellerType} • ★ {profile.rating}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 shrink-0" title="Online" />
        </div>

        <button
          type="button"
          onClick={onSwitchToStorefront}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-stone-700"
        >
          <Store className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Switch to Customer Storefront</span>
          <ExternalLink className="w-3 h-3 text-stone-400 ml-auto" />
        </button>

        <button
          type="button"
          onClick={async () => {
            await logout();
            onSwitchToStorefront();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 text-xs font-semibold transition-colors cursor-pointer border border-rose-900/40"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Sign Out of Merchant Hub</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
