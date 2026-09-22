import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  RotateCcw,
  CreditCard,
  ShieldAlert,
  Landmark,
  UserCheck,
  Star,
  Headphones,
  BarChart3,
  ShieldCheck,
  Store,
  ExternalLink,
  X,
  Layers,
} from 'lucide-react';
import { AdminPortalTab } from '../../types/admin';

interface AdminSidebarProps {
  activeTab: AdminPortalTab;
  onSelectTab: (tab: AdminPortalTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin') => void;
  actionCounts: {
    pendingSellers: number;
    pendingProducts: number;
    pendingReturns: number;
    pendingWarranty: number;
    pendingRefunds: number;
    pendingSettlements: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onSwitchPortal,
  actionCounts,
}) => {
  const navItems: {
    id: AdminPortalTab;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'sellers',
      label: 'Sellers',
      icon: Users,
      badgeCount: actionCounts.pendingSellers,
      badgeColor: 'bg-amber-500 text-black',
    },
    {
      id: 'products',
      label: 'Products & SKUs',
      icon: Package,
      badgeCount: actionCounts.pendingProducts,
      badgeColor: 'bg-blue-500 text-white',
    },
    { id: 'orders', label: 'Master Orders', icon: ShoppingBag },
    {
      id: 'returns',
      label: 'Returns Desk',
      icon: RotateCcw,
      badgeCount: actionCounts.pendingReturns,
      badgeColor: 'bg-amber-500 text-black',
    },
    {
      id: 'refunds',
      label: 'Refunds Queue',
      icon: CreditCard,
      badgeCount: actionCounts.pendingRefunds,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'warranty',
      label: 'Warranty Claims',
      icon: ShieldAlert,
      badgeCount: actionCounts.pendingWarranty,
      badgeColor: 'bg-purple-500 text-white',
    },
    {
      id: 'finance',
      label: 'Finance & GST',
      icon: Landmark,
      badgeCount: actionCounts.pendingSettlements,
      badgeColor: 'bg-emerald-500 text-white',
    },
    { id: 'customers', label: 'Customers', icon: UserCheck },
    { id: 'reviews', label: 'Reviews Moderation', icon: Star },
    { id: 'support', label: 'Support Tickets', icon: Headphones },
    { id: 'reports', label: 'Platform Reports', icon: BarChart3 },
    { id: 'settings', label: 'Security & RBAC', icon: ShieldCheck },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#16181D] text-gray-200 select-none">
      {/* Brand Header */}
      <div className="shrink-0 p-4 sm:p-5 flex items-center justify-between border-b border-gray-800/80 bg-[#121418]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#C59B27] to-[#E5C158] flex items-center justify-center text-gray-950 font-black shadow-md shadow-[#C59B27]/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-wider text-white">AutoPartsHub</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40 tracking-wider">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Platform Operations Console</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          aria-label="Close Admin Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Marketplace Governance
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#C59B27] text-gray-950 shadow-md font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gray-950' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badgeCount && item.badgeCount > 0 ? (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs ${
                    isActive ? 'bg-gray-950 text-white' : item.badgeColor || 'bg-gray-700 text-white'
                  }`}
                >
                  {item.badgeCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Footer Switchers */}
      <div className="shrink-0 p-3 border-t border-gray-800/80 bg-[#121418] space-y-2">
        <div className="px-2 py-1 flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-medium">Direct Cross-Portal:</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <button
          onClick={() => onSwitchPortal && onSwitchPortal('seller')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-200 text-xs font-medium border border-gray-700/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Open Seller Portal</span>
          </div>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </button>

        <button
          onClick={() => onSwitchPortal && onSwitchPortal('customer')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/40 hover:bg-gray-800/80 text-gray-300 text-xs font-medium border border-gray-700/30 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            <span>Customer Storefront</span>
          </div>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-gray-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
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
