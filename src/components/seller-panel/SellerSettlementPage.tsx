import React, { useState } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  Download,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  ArrowUpRight
} from 'lucide-react';
import { SellerSettlement } from '../../types/seller';
import { useToast } from '../../context/ToastContext';

interface SellerSettlementPageProps {
  settlements: SellerSettlement[];
}

export const SellerSettlementPage: React.FC<SellerSettlementPageProps> = ({ settlements }) => {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const grossTotal = settlements.reduce((sum, s) => sum + s.grossSales, 0);
  const commissionTotal = settlements.reduce((sum, s) => sum + s.commissionDeducted, 0);
  const netTotal = settlements.reduce((sum, s) => sum + s.netSettled, 0);

  const filteredSettlements = settlements.filter(
    s => filterStatus === 'all' || s.status.toLowerCase() === filterStatus.toLowerCase()
  );

  const handleExportStatement = () => {
    showToast(
      'Report Downloaded',
      'Merchant Settlement Statement (PDF / Excel) generated successfully.',
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-stone-500 block">Total Gross Merchandise Value</span>
          <div className="text-2xl font-extrabold text-stone-950 font-mono">
            ₹{grossTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-stone-400 block">Consolidated customer payments</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-stone-500 block">Platform Commission & Tax</span>
          <div className="text-2xl font-extrabold text-rose-600 font-mono">
            - ₹{commissionTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-stone-400 block">10% Platform fee + 18% GST</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-stone-500 block">Net Transferred to Bank</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            ₹{netTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct NEFT / RTGS Payouts
          </span>
        </div>
      </div>

      {/* Linked Bank Account Banner */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#C59B27] shrink-0 shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-stone-900">Verified Payout Account</h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono mt-0.5">
              HDFC Bank Ltd • Current A/c •••••••• 2041 (IFSC: HDFC0000129)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportStatement}
          className="px-4 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-stone-600" />
          <span>Download Ledger Statement</span>
        </button>
      </div>

      {/* Settlement Transactions Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Settlement Ledger & UTR Details</h3>
            <p className="text-xs text-stone-500">
              Each delivery payout cycle clears automatically within 7 days of verified customer delivery
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-stone-200 rounded-xl text-xs text-stone-800 font-semibold cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="settled">Settled Only</option>
              <option value="processing">Processing / Upcoming</option>
            </select>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-xs">
            <thead className="bg-stone-50 text-stone-700 font-bold">
              <tr>
                <th className="px-4 py-3 text-left">Settlement ID</th>
                <th className="px-4 py-3 text-left">Consignment Ref</th>
                <th className="px-4 py-3 text-right">Gross Sale</th>
                <th className="px-4 py-3 text-right">Commission (10%)</th>
                <th className="px-4 py-3 text-right">Net Payout</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payout Date</th>
                <th className="px-4 py-3 text-left">Bank UTR Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {filteredSettlements.map(s => (
                <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-stone-950">
                    {s.id}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-stone-600">
                    {s.orderId}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-900">
                    ₹{s.grossSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-rose-600">
                    - ₹{s.commissionDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-extrabold text-emerald-700">
                    ₹{s.netSettled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        s.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-stone-600">
                    {s.settlementDate}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-stone-700 font-semibold">
                    {s.utrReference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-stone-100">
          {filteredSettlements.map(s => (
            <div key={s.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-stone-950">{s.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    s.status === 'Settled' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-stone-100">
                <div>
                  <span className="text-stone-400 text-[10px] block">Gross Consignment</span>
                  <span className="font-mono font-bold text-stone-900">₹{s.grossSales.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">Net Credited</span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    ₹{s.netSettled.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 font-mono">
                <div>Date: {s.settlementDate}</div>
                <div>UTR: {s.utrReference}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
