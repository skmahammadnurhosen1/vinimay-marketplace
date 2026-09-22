import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Building2,
  CheckCircle2,
  Store,
  ChevronDown
} from 'lucide-react';
import { SellerNavTab, SellerProfile, SellerNotification } from '../../types/seller';
import { SellerNotificationPopover } from './SellerNotificationPopover';

interface SellerHeaderProps {
  onOpenMobileNav: () => void;
  activeTab: SellerNavTab;
  onSelectTab: (tab: SellerNavTab) => void;
  profile: SellerProfile;
  notifications: SellerNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onSwitchToStorefront: () => void;
}

export const SellerHeader: React.FC<SellerHeaderProps> = ({
  onOpenMobileNav,
  activeTab,
  onSelectTab,
  profile,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSwitchToStorefront
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const tabTitles: Record<SellerNavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Merchant Dashboard',
      subtitle: 'Overview of orders, fulfillment, stock metrics, and payouts'
    },
    orders: {
      title: 'Order Fulfillment',
      subtitle: 'Dispatch and track multi-vendor merchant packages'
    },
    products: {
      title: 'Product Catalog',
      subtitle: 'Manage active automotive spare part listings, pricing, and fitment'
    },
    add_product: {
      title: 'Add New Spare Part',
      subtitle: '7-level vehicle fitment, specifications, OEM mapping, and pricing'
    },
    inventory: {
      title: 'Inventory & Stock Management',
      subtitle: 'Real-time warehouse quantities, low-stock alerts, and restocking'
    },
    returns: {
      title: 'Customer Return Requests',
      subtitle: 'Verify return claims, inspection workflow, and resolutions'
    },
    warranty: {
      title: 'Warranty Claims Desk',
      subtitle: 'Technical fault reviews, replacement authorization, and evidence'
    },
    sales_settlement: {
      title: 'Sales, Commission & Settlement',
      subtitle: 'Financial ledger, platform commission deduction, and bank UTR payouts'
    },
    profile_kyc: {
      title: 'Business Profile & KYC Verification',
      subtitle: 'Corporate registration, GSTIN, bank proof, and OEM authorizations'
    },
    settings: {
      title: 'Store Settings',
      subtitle: 'Warehouse dispatch hours, return address, and notification preferences'
    }
  };

  const currentMeta = tabTitles[activeTab] || {
    title: 'Seller Panel',
    subtitle: 'Automotive Marketplace Merchant Portal'
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Hamburger (Mobile) + Breadcrumb / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold text-stone-950 truncate tracking-tight">
              {currentMeta.title}
            </h1>
            <p className="text-[11px] text-stone-500 truncate hidden sm:block">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions (Quick Add + Notifications + KYC Badge + Storefront Switcher) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Add Product Button */}
          {activeTab !== 'add_product' && (
            <button
              type="button"
              onClick={() => onSelectTab('add_product')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16181D] hover:bg-stone-800 text-[#E8D5A3] text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Add Part</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C59B27] text-stone-950 font-black text-[9px] rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <SellerNotificationPopover
              notifications={notifications}
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onMarkRead={onMarkNotificationRead}
              onMarkAllRead={onMarkAllNotificationsRead}
              onSelectTab={onSelectTab}
            />
          </div>

          {/* KYC Status Pill */}
          <button
            type="button"
            onClick={() => onSelectTab('profile_kyc')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
            title="Click to view KYC Details"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>KYC Verified</span>
          </button>

          {/* Storefront Switcher Button */}
          <button
            type="button"
            onClick={onSwitchToStorefront}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors border border-stone-200 cursor-pointer"
            title="Return to Customer Storefront"
          >
            <Store className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="hidden sm:inline">Storefront</span>
          </button>
        </div>
      </div>
    </header>
  );
};
