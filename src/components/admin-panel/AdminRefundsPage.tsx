import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowDownRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { AdminRefund } from '../../types/admin';

interface AdminRefundsPageProps {
  refunds: AdminRefund[];
  onUpdateRefundStatus: (
    refundId: string,
    status: 'Pending Approval' | 'Processing' | 'Completed' | 'Rejected' | 'Held',
    utrRef?: string
  ) => void;
}

export const AdminRefundsPage: React.FC<AdminRefundsPageProps> = ({
  refunds,
  onUpdateRefundStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRefunds = refunds.filter((rf) => {
    const matchesStatus = statusFilter === 'all' || rf.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      rf.id.toLowerCase().includes(q) ||
      rf.orderId.toLowerCase().includes(q) ||
      rf.customerName.toLowerCase().includes(q) ||
      rf.sellerName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalRefundsPending = refunds
    .filter((r) => r.status === 'Pending Approval')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-rose-500" />
            <span>Refunds Queue & Payment Disbursals</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Authorize reversed customer payments, banking reversals, and direct UPI credits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">Pending Authorization:</span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-bold text-xs">
            {formatCurrency(totalRefundsPending)}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Refund ID, Order ID, customer, or seller..."
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
            <option value="all">All Refund Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Held">Held</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Refund ID & Order</th>
                <th className="p-3.5">Customer Beneficiary</th>
                <th className="p-3.5">Responsible Seller</th>
                <th className="p-3.5">Payment & Payout Rail</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status & UTR</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRefunds.map((rf) => (
                <tr key={rf.id} className="hover:bg-gray-50/70 transition">
                  {/* ID */}
                  <td className="p-3.5 pl-4 font-mono">
                    <span className="font-bold text-gray-900 block text-xs">{rf.id}</span>
                    <span className="text-[11px] text-gray-700">{rf.orderId}</span>
                  </td>

                  {/* Customer */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">{rf.customerName}</span>
                    <span className="text-[11px] text-gray-700">Ref Date: {rf.requestedDate}</span>
                  </td>

                  {/* Seller */}
                  <td className="p-3.5">
                    <span className="font-semibold text-gray-800 block truncate max-w-xs">
                      {rf.sellerName}
                    </span>
                    <span className="text-[10px] text-gray-700">{rf.reason}</span>
                  </td>

                  {/* Payment */}
                  <td className="p-3.5">
                    <span className="font-semibold text-gray-800 block">{rf.refundMethod}</span>
                    <span className="text-[11px] text-gray-700">Orig: {rf.paymentMethod}</span>
                  </td>

                  {/* Amount */}
                  <td className="p-3.5 font-black text-rose-600 text-sm">
                    {formatCurrency(rf.amount)}
                  </td>

                  {/* Status & UTR */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rf.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rf.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : rf.status === 'Held'
                          ? 'bg-amber-100 text-amber-800'
                          : rf.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {rf.status}
                    </span>
                    {rf.utrRef && (
                      <span className="text-[10px] font-mono text-gray-700 block mt-0.5">
                        {rf.utrRef}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right space-x-1.5">
                    {rf.status === 'Pending Approval' && (
                      <>
                        <button
                          onClick={() => {
                            onUpdateRefundStatus(rf.id, 'Completed');
                            alert(`Refund ${rf.id} approved. Bank UTR generated.`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Payout</span>
                        </button>
                        <button
                          onClick={() => onUpdateRefundStatus(rf.id, 'Held')}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition cursor-pointer"
                        >
                          Hold
                        </button>
                      </>
                    )}

                    {rf.status === 'Held' && (
                      <button
                        onClick={() => onUpdateRefundStatus(rf.id, 'Completed')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Release & Pay
                      </button>
                    )}

                    {rf.status === 'Completed' && (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Disbursed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
