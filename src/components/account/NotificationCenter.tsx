import React, { useState } from 'react';
import { CustomerNotification, NotificationType } from '../../types';
import { orderService } from '../../services/orderService';
import {
  Bell,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Check,
  Package
} from 'lucide-react';
import { Button } from '../common/Button';

interface NotificationCenterProps {
  onNavigateOrder?: (orderId: string) => void;
  onNavigateReturn?: (returnId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigateOrder,
  onNavigateReturn
}) => {
  const [notifications, setNotifications] = useState<CustomerNotification[]>(() =>
    orderService.getNotifications()
  );

  const handleMarkAllRead = () => {
    orderService.markAllNotificationsRead();
    setNotifications(orderService.getNotifications());
  };

  const handleItemClick = (n: CustomerNotification) => {
    orderService.markNotificationRead(n.id);
    setNotifications(orderService.getNotifications());
    if (n.orderId && onNavigateOrder) {
      onNavigateOrder(n.orderId);
    } else if (n.referenceId && onNavigateReturn) {
      onNavigateReturn(n.referenceId);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'order_shipped':
      case 'out_for_delivery':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'return_update':
      case 'refund_update':
        return <RotateCcw className="w-4 h-4 text-purple-600" />;
      case 'warranty_update':
        return <ShieldCheck className="w-4 h-4 text-[#FFBA00]" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Notification Center & Consignment Alerts
            </h3>
            <p className="text-xs text-gray-500">
              Real-time dispatches, return pickup notifications, and warranty resolutions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-[#0B56D0] hover:underline cursor-pointer flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      {notifications.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`py-3.5 px-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3.5 ${
                !n.read ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <span>{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#0B56D0] shrink-0" />
                    )}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400 shrink-0">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                  {n.message}
                </p>
                {(n.orderId || n.referenceId) && (
                  <span className="inline-block text-[10px] font-bold text-[#0B56D0] mt-1 hover:underline">
                    View Details →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 text-xs">
          No notifications at this time.
        </div>
      )}
    </div>
  );
};
