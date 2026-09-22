import React from 'react';
import {
  X,
  User,
  Car,
  ShoppingBag,
  RotateCcw,
  ShieldAlert,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AdminCustomer } from '../../types/admin';

interface AdminCustomerDetailsModalProps {
  customer: AdminCustomer;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'Active' | 'Suspended' | 'Flagged') => void;
}

export const AdminCustomerDetailsModal: React.FC<AdminCustomerDetailsModalProps> = ({
  customer,
  onClose,
  onUpdateStatus,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#16181D] text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center text-[#E5C158] shrink-0 mt-0.5">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white">
                  {customer.name}
                </h2>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  customer.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : customer.status === 'Flagged'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {customer.status} Account
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Customer ID: <span className="font-mono text-gray-300">{customer.id}</span> • Member since {customer.joinedDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Contact and Lifetime Value Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-[#C59B27]" />
                <span className="font-medium">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{customer.address}</span>
              </div>
            </div>

            <div className="space-y-2 sm:border-l sm:border-gray-200 sm:pl-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Lifetime Spend</span>
                <div className="text-lg font-black text-gray-900">{formatCurrency(customer.totalSpend)}</div>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Completed Orders:</span>
                <strong className="text-gray-900">{customer.totalOrders}</strong>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Last Activity:</span>
                <strong className="text-gray-900">{customer.lastOrderDate}</strong>
              </div>
            </div>
          </div>

          {/* Registered Vehicle Garage */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-900 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-blue-600" />
              Primary Workshop / Garage Vehicle
            </span>
            <p className="text-sm font-bold text-blue-950">
              {customer.primaryVehicle}
            </p>
            <p className="text-gray-600 text-[11px]">
              Exact OE fitment filters auto-applied across marketplace catalog.
            </p>
          </div>

          {/* Status Controls */}
          <div className="pt-2 border-t border-gray-200 space-y-2">
            <span className="font-bold text-gray-900 block">Account Safety & Fraud Action:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(customer.id, 'Active');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer"
              >
                Mark Active
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(customer.id, 'Flagged');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition cursor-pointer"
              >
                Flag Suspicious
              </button>
              <button
                onClick={() => {
                  if (confirm(`Suspend account for ${customer.name}?`)) {
                    onUpdateStatus(customer.id, 'Suspended');
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer"
              >
                Suspend Account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
