import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  RotateCcw,
  ShieldAlert,
  Users,
  Info,
  CheckCheck,
  ChevronRight,
} from 'lucide-react';
import {
  ManufacturerNotification,
  ManufacturerPortalTab,
} from '../../types/manufacturer';

interface ManufacturerNotificationsPageProps {
  notifications: ManufacturerNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: ManufacturerPortalTab) => void;
}

export const ManufacturerNotificationsPage: React.FC<ManufacturerNotificationsPageProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateTab,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: ManufacturerNotification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-[#0284C7]" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'warranty':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'return':
        return <RotateCcw className="w-4 h-4 text-orange-500" />;
      case 'demand':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'dealer':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0284C7]" />
            <span>Operational Notification Center</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Realtime alerts across marketplace purchase orders, factory stock thresholds, and warranty filings.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 transition cursor-pointer flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'order', label: 'Orders' },
          { id: 'low_stock', label: 'Stock Alerts' },
          { id: 'warranty', label: 'Warranty' },
          { id: 'demand', label: 'Demand Surge' },
          { id: 'dealer', label: 'Dealers' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-gray-200 shadow-xs text-center space-y-2">
            <Bell className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">No Notifications</h3>
            <p className="text-xs text-gray-500">You're all caught up with your operational alerts.</p>
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                !n.read
                  ? 'bg-sky-50/70 border-sky-200 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xs text-gray-900 truncate">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                    )}
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        n.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : n.priority === 'high'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {n.priority}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 font-mono block">{n.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.targetTab && (
                  <button
                    onClick={() => onNavigateTab(n.targetTab!)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[#0284C7] text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                {!n.read && (
                  <button
                    onClick={() => onMarkAsRead(n.id)}
                    className="p-1 text-gray-400 hover:text-emerald-600 transition cursor-pointer"
                    title="Mark as Read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
