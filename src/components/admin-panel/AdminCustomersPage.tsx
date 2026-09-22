import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Car,
  ChevronRight,
} from 'lucide-react';
import { AdminCustomer } from '../../types/admin';
import { AdminCustomerDetailsModal } from './AdminCustomerDetailsModal';

interface AdminCustomersPageProps {
  customers: AdminCustomer[];
  onUpdateCustomerStatus: (id: string, status: 'Active' | 'Suspended' | 'Flagged') => void;
}

export const AdminCustomersPage: React.FC<AdminCustomersPageProps> = ({
  customers,
  onUpdateCustomerStatus,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.primaryVehicle.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#C59B27]" />
            <span>Customer Directory & Garage Fleets</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Registered vehicle owners, workshop mechanics, and commercial fleet buyers across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">Directory Count:</span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-bold text-gray-900 text-xs">
            {customers.length} Profiles
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, mobile, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Account Statuses</option>
            <option value="Active">Active</option>
            <option value="Flagged">Flagged</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Customer Name & ID</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Registered Vehicle</th>
                <th className="p-3.5">Orders & Lifetime Spend</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50/70 transition">
                  {/* Name */}
                  <td className="p-3.5 pl-4">
                    <span className="font-bold text-gray-900 block text-xs">{cust.name}</span>
                    <span className="text-[11px] font-mono text-gray-700">{cust.id}</span>
                  </td>

                  {/* Contact */}
                  <td className="p-3.5">
                    <span className="text-gray-900 block">{cust.email}</span>
                    <span className="text-[11px] text-gray-700">{cust.phone}</span>
                  </td>

                  {/* Location */}
                  <td className="p-3.5 text-gray-700">
                    {cust.city}, {cust.state}
                  </td>

                  {/* Vehicle */}
                  <td className="p-3.5">
                    <span className="font-semibold text-blue-700 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-xs">{cust.primaryVehicle}</span>
                    </span>
                  </td>

                  {/* Spend */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">
                      {formatCurrency(cust.totalSpend)}
                    </span>
                    <span className="text-[11px] text-gray-700">
                      {cust.totalOrders} marketplace orders
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cust.status === 'Flagged'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedCustomer && (
        <AdminCustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdateStatus={(id, status) => {
            onUpdateCustomerStatus(id, status);
            setSelectedCustomer((prev) => (prev ? { ...prev, status } : null));
          }}
        />
      )}
    </div>
  );
};
