import React from 'react';
import { Bell, CheckCheck, Package, RotateCcw, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { SellerNotification } from '../../types/seller';

interface SellerNotificationPopoverProps {
  notifications: SellerNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectTab: (tab: any) => void;
}

export const SellerNotificationPopover: React.FC<SellerNotificationPopoverProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onSelectTab
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: SellerNotification['type']) => {
    switch (type) {
      case 'new_order':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'return_request':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      case 'warranty_claim':
        return <ShieldAlert className="w-4 h-4 text-blue-600" />;
      case 'stock_alert':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl border border-stone-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Seller Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-[#C59B27] text-stone-950 px-1.5 py-0.2 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] font-semibold text-[#C59B27] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
              aria-label="Close notifications"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  onMarkRead(n.id);
                  if (n.type === 'new_order') onSelectTab('orders');
                  if (n.type === 'return_request') onSelectTab('returns');
                  if (n.type === 'warranty_claim') onSelectTab('warranty');
                  if (n.type === 'stock_alert') onSelectTab('inventory');
                  if (n.type === 'settlement') onSelectTab('sales_settlement');
                  onClose();
                }}
                className={`p-3.5 hover:bg-stone-50 transition-colors cursor-pointer flex items-start gap-3 ${
                  !n.read ? 'bg-amber-50/40' : 'bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-stone-100 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-stone-900 truncate">{n.title}</h5>
                    <span className="text-[10px] text-stone-400 shrink-0">{n.timestamp.split(',')[0]}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-stone-500">
              No recent notifications
            </div>
          )}
        </div>
      </div>
    </>
  );
};
