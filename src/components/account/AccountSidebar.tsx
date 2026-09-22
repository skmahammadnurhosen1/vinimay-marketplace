import React from 'react';
import {
  Package,
  RotateCcw,
  ShieldCheck,
  Car,
  Bell,
  HelpCircle,
  User,
  LogOut,
  MapPin
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export type AccountTabType =
  | 'orders'
  | 'returns'
  | 'warranties'
  | 'garage'
  | 'notifications'
  | 'support'
  | 'profile';

interface AccountSidebarProps {
  activeTab: AccountTabType;
  onSelectTab: (tab: AccountTabType) => void;
  unreadCount?: number;
  onLogout?: () => void;
  onOpenAuth?: () => void;
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 0,
  onLogout,
  onOpenAuth,
}) => {
  const { currentUser, profile, isAuthenticated, logout } = useAuth();

  const handleLogoutClick = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
    }
  };

  const displayName = profile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Guest Buyer';
  const initials = displayName.slice(0, 2).toUpperCase();

  const menuItems: { id: AccountTabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'returns', label: 'Returns & Replacements', icon: RotateCcw },
    { id: 'warranties', label: 'Warranty Claims', icon: ShieldCheck },
    { id: 'garage', label: 'Vehicle Garage', icon: Car },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'support', label: 'Technical Support', icon: HelpCircle },
    { id: 'profile', label: 'Buyer Profile & Account', icon: User }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-5 space-y-5">
      {/* Customer Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071530] via-blue-950 to-[#071530] text-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FFBA00] text-gray-950 font-black text-sm flex items-center justify-center shadow-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold truncate">
              {displayName}
            </h4>
            <span className="text-[10px] text-blue-200 block truncate">
              {currentUser?.email || 'Sign in to sync your vehicles & orders'}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px]">
          <span className="text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded-full">
            {isAuthenticated ? (profile?.role || 'Verified Buyer') : 'Guest Session'}
          </span>
          {currentUser && (
            <span className="text-gray-300 font-mono text-[9px]">ID: {currentUser.uid.slice(0, 8)}...</span>
          )}
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-[#0B56D0] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFBA00]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#FFBA00] text-gray-950' : 'bg-blue-600 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Auth Action */}
      <div className="pt-2 border-t border-gray-100">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full p-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full p-2.5 rounded-xl text-xs font-bold text-[#0B56D0] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-blue-50/50 border border-blue-200"
          >
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </div>
  );
};
