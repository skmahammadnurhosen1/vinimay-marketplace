import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  ShoppingBag,
  Receipt,
  RotateCcw,
  CreditCard,
  Building2,
  Headphones,
  Settings,
  Wrench,
  Truck,
  ExternalLink,
  X,
  ShieldCheck,
} from 'lucide-react';
import { B2BPortalTab, B2BAccountType } from '../../types/b2b';

interface B2BSidebarProps {
  activeTab: B2BPortalTab;
  onSelectTab: (tab: B2BPortalTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  cartItemCount: number;
  activeAccountType: B2BAccountType;
  onSwitchAccountType: (type: B2BAccountType) => void;
  onSwitchPortal?: (portal: 'customer' | 'seller' | 'admin' | 'b2b') => void;
  businessName: string;
}

export const B2BSidebar: React.FC<B2BSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  cartItemCount,
  activeAccountType,
  onSwitchAccountType,
  onSwitchPortal,
  businessName,
}) => {
  const navItems: {
    id: B2BPortalTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'B2B Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Trade Parts Catalog', icon: Package },
    { id: 'bulk-order', label: 'Bulk Order & RFQ', icon: Layers },
    {
      id: 'cart',
      label: 'B2B Cart',
      icon: ShoppingCart,
      badge: cartItemCount > 0 ? cartItemCount : undefined,
      badgeColor: 'bg-[#C59B27] text-gray-950',
    },
    { id: 'orders', label: 'Purchase History', icon: ShoppingBag },
    { id: 'invoices', label: 'GST Tax Invoices', icon: Receipt },
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    {
      id: 'credit',
      label: 'Business Credit Line',
      icon: CreditCard,
      badge: 'Soon',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    },
    { id: 'support', label: 'Priority Support', icon: Headphones },
    { id: 'settings', label: 'Settings & Preferences', icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#16181D] text-gray-200 select-none">
      {/* Brand & Account Summary */}
      <div className="shrink-0">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-800/80 bg-[#121418]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#C59B27] to-[#E5C158] flex items-center justify-center text-gray-950 font-black shadow-md shadow-[#C59B27]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wider text-white">AutoPartsHub</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40 tracking-wider">
                  B2B
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Workshop & Fleet Procurement</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
            aria-label="Close B2B Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Account Persona Quick Switcher */}
        <div className="p-3 border-b border-gray-800/60 bg-[#14171d]">
          <div className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 flex items-center justify-between">
            <span>Active Business Account:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          </div>

          <p className="text-xs font-bold text-white truncate mb-2" title={businessName}>
            {businessName}
          </p>

          <div className="grid grid-cols-2 gap-1.5 bg-gray-900 p-1 rounded-lg border border-gray-800 text-[11px] font-semibold">
            <button
              onClick={() => onSwitchAccountType('garage')}
              className={`py-1 rounded flex items-center justify-center gap-1 transition cursor-pointer ${
                activeAccountType === 'garage'
                  ? 'bg-[#C59B27] text-gray-950 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3 h-3" />
              <span>Garage</span>
            </button>

            <button
              onClick={() => onSwitchAccountType('fleet')}
              className={`py-1 rounded flex items-center justify-center gap-1 transition cursor-pointer ${
                activeAccountType === 'fleet'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>Fleet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Purchasing Workspaces
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
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs ${
                    isActive
                      ? 'bg-gray-950 text-white'
                      : item.badgeColor || 'bg-gray-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Switchers */}
      <div className="shrink-0 p-3 border-t border-gray-800/80 bg-[#121418] space-y-2">
        <div className="px-2 py-0.5 flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-medium">Direct Cross-Portal:</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <button
          onClick={() => onSwitchPortal && onSwitchPortal('customer')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-200 text-xs font-medium border border-gray-700/50 transition cursor-pointer"
        >
          <span>Retail Storefront</span>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </button>

        <button
          onClick={() => onSwitchPortal && onSwitchPortal('seller')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/40 hover:bg-gray-800/80 text-gray-300 text-xs font-medium border border-gray-700/30 transition cursor-pointer"
        >
          <span>Seller Merchant Hub</span>
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
