import React from 'react';
import {
  X,
  Printer,
  Download,
  Receipt,
  Building2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { B2BGSTInvoice } from '../../types/b2b';

interface B2BInvoiceModalProps {
  invoice: B2BGSTInvoice;
  onClose: () => void;
}

export const B2BInvoiceModal: React.FC<B2BInvoiceModalProps> = ({
  invoice,
  onClose,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-in fade-in">
        {/* Modal Bar */}
        <div className="p-4 bg-[#16181D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#E5C158]" />
            <span className="font-bold text-sm text-white">GST Tax Invoice Viewer</span>
            <span className="text-xs font-mono text-gray-400">({invoice.invoiceNumber})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Simulating PDF download for invoice ${invoice.invoiceNumber}`)}
              className="px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Tax Invoice Sheet */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-gray-800 bg-white font-sans">
          {/* Invoice Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-gray-900 pb-4 gap-4">
            <div>
              <span className="text-lg font-black tracking-tight text-gray-900">
                TAX INVOICE
              </span>
              <p className="text-[11px] text-gray-500">
                Issued in accordance with Section 31 of the Central Goods & Services Tax Act, 2017
              </p>
            </div>
            <div className="text-right sm:text-right">
              <div className="font-mono font-black text-sm text-gray-900">
                {invoice.invoiceNumber}
              </div>
              <p className="text-[11px] text-gray-600">Date: <strong>{invoice.invoiceDate}</strong></p>
              <p className="text-[11px] text-gray-600">Order ID: <strong>{invoice.orderId}</strong></p>
            </div>
          </div>

          {/* Supplier & Recipient 2-Column Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-gray-300 bg-gray-50/50">
            {/* Supplier / Marketplace */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Details of Supplier / E-Commerce Operator:
              </span>
              <strong className="text-gray-900 text-xs block">{invoice.sellerName}</strong>
              <p className="text-gray-600 text-[11px]">{invoice.sellerAddress}</p>
              <p className="font-mono font-bold text-gray-900 text-[11px]">
                GSTIN: {invoice.sellerGSTIN}
              </p>
              <p className="text-gray-600 text-[11px]">State: {invoice.sellerState}</p>
            </div>

            {/* Buyer / Recipient */}
            <div className="space-y-1 sm:border-l sm:border-gray-300 sm:pl-4">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Details of Recipient / Billed To:
              </span>
              <strong className="text-gray-900 text-xs block">{invoice.buyerName}</strong>
              <p className="text-gray-600 text-[11px]">{invoice.buyerAddress}</p>
              <p className="font-mono font-bold text-blue-900 text-[11px]">
                GSTIN: {invoice.buyerGSTIN}
              </p>
              <p className="text-gray-600 text-[11px]">
                Place of Supply: <strong>{invoice.placeOfSupply}</strong> ({invoice.isInterState ? 'Inter-State IGST' : 'Intra-State CGST+SGST'})
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-[10px] uppercase font-bold text-gray-700">
                  <th className="p-2.5 pl-3">#</th>
                  <th className="p-2.5">Description of Goods</th>
                  <th className="p-2.5">HSN Code</th>
                  <th className="p-2.5">Part No</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">Taxable Val</th>
                  {!invoice.isInterState ? (
                    <>
                      <th className="p-2.5 text-right">CGST (9%)</th>
                      <th className="p-2.5 text-right">SGST (9%)</th>
                    </>
                  ) : (
                    <th className="p-2.5 text-right">IGST (18%)</th>
                  )}
                  <th className="p-2.5 pr-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.lineItems.map((item) => (
                  <tr key={item.sno} className="hover:bg-gray-50">
                    <td className="p-2.5 pl-3 font-mono">{item.sno}</td>
                    <td className="p-2.5 font-semibold text-gray-900 max-w-xs">{item.description}</td>
                    <td className="p-2.5 font-mono text-gray-600">{item.hsnCode}</td>
                    <td className="p-2.5 font-mono text-gray-600">{item.partNumber}</td>
                    <td className="p-2.5 text-center font-bold text-gray-900">{item.qty}</td>
                    <td className="p-2.5 text-right font-mono">{formatCurrency(item.unitRate)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                      {formatCurrency(item.taxableAmount)}
                    </td>
                    {!invoice.isInterState ? (
                      <>
                        <td className="p-2.5 text-right font-mono text-gray-600">{formatCurrency(item.cgstAmount)}</td>
                        <td className="p-2.5 text-right font-mono text-gray-600">{formatCurrency(item.sgstAmount)}</td>
                      </>
                    ) : (
                      <td className="p-2.5 text-right font-mono text-gray-600">{formatCurrency(item.igstAmount)}</td>
                    )}
                    <td className="p-2.5 pr-3 text-right font-mono font-bold text-gray-900">
                      {formatCurrency(item.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals & Legal Declarations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-2">
            <div className="space-y-2 text-[11px] text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block">Total Amount in Words:</span>
              <p className="italic font-semibold text-gray-800">{invoice.amountInWords}</p>
              <div className="pt-2 border-t border-gray-200 text-[10px] space-y-0.5">
                <p>Reverse Charge Applicable (RCM): <strong>NO</strong></p>
                <p>E-Invoice IRN: <strong>7890123456789abcdef0123456789abcdef0123456789abcdef</strong></p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-700 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <span>Total Taxable Value:</span>
                <strong className="font-mono">{formatCurrency(invoice.taxableTotal)}</strong>
              </div>
              {!invoice.isInterState ? (
                <>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Central GST (CGST 9%):</span>
                    <span className="font-mono">+{formatCurrency(invoice.cgstTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>State GST (SGST 9%):</span>
                    <span className="font-mono">+{formatCurrency(invoice.sgstTotal)}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-gray-600">
                  <span>Integrated GST (IGST 18%):</span>
                  <span className="font-mono">+{formatCurrency(invoice.igstTotal)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-300 flex items-center justify-between text-sm">
                <strong className="text-gray-900">Grand Total (INR):</strong>
                <strong className="font-black text-gray-900 text-base font-mono">
                  {formatCurrency(invoice.grandTotal)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs cursor-pointer"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
