import React, { useState } from 'react';
import {
  Landmark,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Percent,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  AdminSettlementLedgerEntry,
  AdminGSTRecord,
} from '../../types/admin';

interface AdminFinancePageProps {
  settlements: AdminSettlementLedgerEntry[];
  gstRecords: AdminGSTRecord[];
  onExecuteSettlement: (settlementId: string) => void;
}

export const AdminFinancePage: React.FC<AdminFinancePageProps> = ({
  settlements,
  gstRecords,
  onExecuteSettlement,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'settlements' | 'gst'>('settlements');
  const [searchQuery, setSearchQuery] = useState('');
  const [settlementFilter, setSettlementFilter] = useState('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalGrossSettlements = settlements.reduce((sum, s) => sum + s.grossAmount, 0);
  const totalPlatformFees = settlements.reduce((sum, s) => sum + s.platformFee, 0);
  const totalTaxOnFees = settlements.reduce((sum, s) => sum + s.taxOnFee, 0);
  const totalNetPayouts = settlements.reduce((sum, s) => sum + s.netPayout, 0);

  const totalGstCollected = gstRecords.reduce((sum, g) => sum + g.totalTax, 0);

  const filteredSettlements = settlements.filter((s) => {
    const matchesFilter = settlementFilter === 'all' || s.status === settlementFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.id.toLowerCase().includes(q) ||
      s.sellerName.toLowerCase().includes(q) ||
      s.orderRef.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-600" />
            <span>Finance, Settlements & Statutory GST Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Automated merchant banking payouts, commission take rates, and state-wise GST compliance.
          </p>
        </div>

        {/* Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('settlements')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'settlements'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settlement Ledger ({settlements.length})
          </button>
          <button
            onClick={() => setActiveSubTab('gst')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'gst'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            GST Statutory Tax ({gstRecords.length})
          </button>
        </div>
      </div>

      {/* Financial Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-700 block">Gross Settled Volume</span>
          <div className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">
            {formatCurrency(totalGrossSettlements + 14200000)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">100% on-cycle dispatch</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-700 block">Net Commission Earned</span>
          <div className="text-lg sm:text-xl font-black text-[#C59B27] mt-0.5">
            {formatCurrency(totalPlatformFees + 1420000)}
          </div>
          <span className="text-[11px] text-gray-700">Platform marketplace fee</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-700 block">18% GST On Fees</span>
          <div className="text-lg sm:text-xl font-black text-blue-600 mt-0.5">
            {formatCurrency(totalTaxOnFees + 255600)}
          </div>
          <span className="text-[11px] text-blue-600 font-bold">CGST + SGST / IGST</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-700 block">Net Merchant Disbursements</span>
          <div className="text-lg sm:text-xl font-black text-emerald-700 mt-0.5">
            {formatCurrency(totalNetPayouts + 12524400)}
          </div>
          <span className="text-[11px] text-gray-700">Via HDFC & ICICI host-to-host</span>
        </div>
      </div>

      {activeSubTab === 'settlements' ? (
        <>
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by settlement ID, seller name, or order ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={settlementFilter}
                onChange={(e) => setSettlementFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
              >
                <option value="all">All Payout Statuses</option>
                <option value="Settled">Settled</option>
                <option value="Processing">Processing</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {/* Settlements Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-4">Payout ID & Date</th>
                    <th className="p-3.5">Order Ref</th>
                    <th className="p-3.5">Seller Beneficiary</th>
                    <th className="p-3.5">Gross Order</th>
                    <th className="p-3.5">Platform Fee</th>
                    <th className="p-3.5">Tax (GST)</th>
                    <th className="p-3.5">Net Payout</th>
                    <th className="p-3.5">Status & UTR</th>
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSettlements.map((st) => (
                    <tr key={st.id} className="hover:bg-gray-50/70 transition">
                      {/* ID */}
                      <td className="p-3.5 pl-4 font-mono">
                        <span className="font-bold text-gray-900 block text-xs">{st.id}</span>
                        <span className="text-[11px] text-gray-700">{st.settlementDate}</span>
                      </td>

                      {/* Order Ref */}
                      <td className="p-3.5 font-mono text-[11px] text-blue-700 font-bold">
                        {st.orderRef}
                      </td>

                      {/* Seller */}
                      <td className="p-3.5 font-semibold text-gray-900">
                        {st.sellerName}
                      </td>

                      {/* Gross */}
                      <td className="p-3.5 text-gray-700">
                        {formatCurrency(st.grossAmount)}
                      </td>

                      {/* Fee */}
                      <td className="p-3.5 text-amber-700 font-bold">
                        {formatCurrency(st.platformFee)}
                      </td>

                      {/* Tax on Fee */}
                      <td className="p-3.5 text-gray-700 font-mono">
                        {formatCurrency(st.taxOnFee)}
                      </td>

                      {/* Net Payout */}
                      <td className="p-3.5 font-black text-emerald-700 text-sm">
                        {formatCurrency(st.netPayout)}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.status === 'Settled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.status}
                        </span>
                        <span className="text-[10px] font-mono text-gray-700 block mt-0.5 truncate max-w-[140px]">
                          {st.utrNumber}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right">
                        {st.status !== 'Settled' ? (
                          <button
                            onClick={() => {
                              onExecuteSettlement(st.id);
                              alert(`Settlement ${st.id} disbursed. UTR generated.`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Execute Payout</span>
                          </button>
                        ) : (
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
        </>
      ) : (
        /* GST Statutory Reports Tab */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                GST Statutory Tax Report (State-Wise IGST vs CGST/SGST Breakdown)
              </h2>
              <p className="text-xs text-gray-700">
                Statutory report aligned with Indian GST Form GSTR-1 and GSTR-8 (TCS by Marketplace Operators).
              </p>
            </div>

            <button
              onClick={() => alert('Exporting complete GST GSTR-1 CSV/Excel report simulation...')}
              className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GSTR-1 File (Excel/CSV)</span>
            </button>
          </div>

          {/* GST Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-4">Invoice No & Date</th>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Place of Supply (Seller &rarr; Buyer)</th>
                    <th className="p-3.5">Tax Type</th>
                    <th className="p-3.5">Taxable Value</th>
                    <th className="p-3.5">IGST (18%)</th>
                    <th className="p-3.5">CGST (9%)</th>
                    <th className="p-3.5">SGST (9%)</th>
                    <th className="p-3.5 pr-4 text-right">Total Tax Liability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gstRecords.map((gst) => (
                    <tr key={gst.id} className="hover:bg-gray-50/70 transition font-mono">
                      {/* Invoice */}
                      <td className="p-3.5 pl-4">
                        <span className="font-bold text-gray-900 block text-xs">{gst.invoiceRef}</span>
                        <span className="text-[11px] text-gray-700 font-sans">{gst.date}</span>
                      </td>

                      {/* Order */}
                      <td className="p-3.5 text-blue-700 font-bold">{gst.orderId}</td>

                      {/* States */}
                      <td className="p-3.5 font-sans">
                        <span className="font-semibold text-gray-800">
                          {gst.sellerState} &rarr; {gst.customerState}
                        </span>
                      </td>

                      {/* Tax Type */}
                      <td className="p-3.5 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            gst.isInterState
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {gst.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST+SGST)'}
                        </span>
                      </td>

                      {/* Taxable */}
                      <td className="p-3.5 font-sans font-bold text-gray-900">
                        {formatCurrency(gst.taxableValue)}
                      </td>

                      {/* IGST */}
                      <td className="p-3.5 font-sans">
                        {gst.igstAmount > 0 ? formatCurrency(gst.igstAmount) : '-'}
                      </td>

                      {/* CGST */}
                      <td className="p-3.5 font-sans">
                        {gst.cgstAmount > 0 ? formatCurrency(gst.cgstAmount) : '-'}
                      </td>

                      {/* SGST */}
                      <td className="p-3.5 font-sans">
                        {gst.sgstAmount > 0 ? formatCurrency(gst.sgstAmount) : '-'}
                      </td>

                      {/* Total */}
                      <td className="p-3.5 pr-4 text-right font-sans font-black text-gray-900 text-sm">
                        {formatCurrency(gst.totalTax)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
