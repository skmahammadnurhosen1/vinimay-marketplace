import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Download,
  Eye,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
} from 'lucide-react';
import { B2BGSTInvoice } from '../../types/b2b';
import { B2BInvoiceModal } from './B2BInvoiceModal';

interface B2BInvoicesPageProps {
  invoices: B2BGSTInvoice[];
}

export const B2BInvoicesPage: React.FC<B2BInvoicesPageProps> = ({ invoices }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<B2BGSTInvoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.orderId.toLowerCase().includes(q) ||
      inv.sellerName.toLowerCase().includes(q) ||
      inv.buyerGSTIN.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>GST Tax Invoices & Statutory ITC Archive</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Download 100% compliant automotive spare parts tax invoices for monthly GSTR-2B accounting.
          </p>
        </div>

        <button
          onClick={() => alert('Simulating batch export of all monthly GST invoices in ZIP/Excel format...')}
          className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Batch Download All (ZIP)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice number, order ID, seller, or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Invoice No & Date</th>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Fulfillment Entity / Seller</th>
                <th className="p-3.5">Taxable Value</th>
                <th className="p-3.5">GST (18% ITC)</th>
                <th className="p-3.5">Invoice Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.invoiceNumber} className="hover:bg-gray-50 transition">
                  {/* Invoice No */}
                  <td className="p-3.5 pl-4 font-mono">
                    <span className="font-bold text-gray-900 block text-xs">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-gray-500 font-sans">{inv.invoiceDate}</span>
                  </td>

                  {/* Order Ref */}
                  <td className="p-3.5 font-mono text-[11px] font-bold text-blue-800">
                    {inv.orderId}
                  </td>

                  {/* Seller */}
                  <td className="p-3.5">
                    <span className="font-semibold text-gray-900 block truncate max-w-xs">
                      {inv.sellerName}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      GSTIN: {inv.sellerGSTIN}
                    </span>
                  </td>

                  {/* Taxable */}
                  <td className="p-3.5 text-gray-700 font-mono">
                    {formatCurrency(inv.taxableTotal)}
                  </td>

                  {/* GST */}
                  <td className="p-3.5 text-blue-700 font-bold font-mono">
                    {formatCurrency(inv.isInterState ? inv.igstTotal : inv.cgstTotal + inv.sgstTotal)}
                  </td>

                  {/* Grand Total */}
                  <td className="p-3.5 font-black text-gray-900 text-sm font-mono">
                    {formatCurrency(inv.grandTotal)}
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      GSTR-1 Filed
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => alert(`Simulating download of PDF for invoice ${inv.invoiceNumber}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <B2BInvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
