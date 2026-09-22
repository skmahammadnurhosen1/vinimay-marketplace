import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Send,
  ShoppingCart,
  Truck,
  Building2,
  Percent,
} from 'lucide-react';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { B2BRFQRequest } from '../../types/b2b';
import { b2bService } from '../../services/b2bService';

interface B2BBulkOrderPageProps {
  onNavigateCart: () => void;
}

interface BulkMatrixRow {
  product: Product;
  quantity: number;
}

export const B2BBulkOrderPage: React.FC<B2BBulkOrderPageProps> = ({ onNavigateCart }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'rfq'>('matrix');

  // Matrix State
  const [selectedProductId, setSelectedProductId] = useState<string>(ALL_PRODUCTS[0]?.id || '');
  const [selectedQty, setSelectedQty] = useState<number>(10);
  const [matrixRows, setMatrixRows] = useState<BulkMatrixRow[]>([
    { product: ALL_PRODUCTS[0], quantity: 12 },
    { product: ALL_PRODUCTS[1], quantity: 6 },
    { product: ALL_PRODUCTS[2] || ALL_PRODUCTS[0], quantity: 8 },
  ]);

  // RFQ State
  const [rfqVehicles, setRfqVehicles] = useState('');
  const [rfqCategories, setRfqCategories] = useState('Brake Systems & Clutch Overhauls');
  const [rfqVolume, setRfqVolume] = useState<number>(80);
  const [rfqTimeline, setRfqTimeline] = useState('Immediate Dispatch (within 7 business days)');
  const [rfqNotes, setRfqNotes] = useState('');
  const [submittedRFQ, setSubmittedRFQ] = useState<B2BRFQRequest | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddRow = () => {
    const product = ALL_PRODUCTS.find((p) => p.id === selectedProductId);
    if (!product) return;
    const existing = matrixRows.findIndex((r) => r.product.id === product.id);
    if (existing > -1) {
      const updated = [...matrixRows];
      updated[existing].quantity += selectedQty;
      setMatrixRows(updated);
    } else {
      setMatrixRows([...matrixRows, { product, quantity: selectedQty }]);
    }
  };

  const handleRemoveRow = (index: number) => {
    setMatrixRows(matrixRows.filter((_, i) => i !== index));
  };

  const handleUpdateRowQty = (index: number, qty: number) => {
    const updated = [...matrixRows];
    updated[index].quantity = Math.max(1, qty);
    setMatrixRows(updated);
  };

  const calculateMatrixTotals = () => {
    let totalUnits = 0;
    let subtotal = 0;
    let retailTotal = 0;

    matrixRows.forEach((r) => {
      const unitB2B = b2bService.getUnitPriceForQty(r.product, r.quantity);
      totalUnits += r.quantity;
      subtotal += unitB2B * r.quantity;
      retailTotal += r.product.price * r.quantity;
    });

    const bulkSavings = Math.max(0, retailTotal - subtotal);
    const gstTotal = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gstTotal;

    return { totalUnits, subtotal, bulkSavings, gstTotal, grandTotal };
  };

  const handleTransferToCart = () => {
    matrixRows.forEach((r) => {
      b2bService.addItemToCart(r.product, r.quantity);
    });
    alert(`Transferred ${matrixRows.length} part lines to B2B Cart.`);
    onNavigateCart();
  };

  const handleSubmitRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = b2bService.getActiveProfile();
    const rfq = b2bService.submitRFQ({
      accountName:
        profile.accountType === 'garage'
          ? (profile as any).businessName
          : (profile as any).companyName,
      accountType: profile.accountType,
      targetVehicles: rfqVehicles || 'Multi-Brand Fleet',
      categoriesRequired: [rfqCategories],
      estimatedMonthlyVolume: Number(rfqVolume),
      deliveryTimeline: rfqTimeline,
      customNotes: rfqNotes || 'Standard pallet delivery with manufacturer COA.',
    });
    setSubmittedRFQ(rfq);
  };

  const totals = calculateMatrixTotals();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#C59B27]" />
            <span>Dedicated Bulk Order Matrix & Custom Fleet RFQ</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Rapid multi-part purchasing matrix and custom wholesale quotes for workshop and fleet lots.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Multi-Part Matrix ({matrixRows.length})
          </button>
          <button
            onClick={() => setActiveTab('rfq')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'rfq'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Custom Fleet RFQ
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        /* Multi-Part Matrix View */
        <div className="space-y-4">
          {/* Add Part Line Toolbar */}
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                Select Replacement Part to Add:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#C59B27]"
              >
                {ALL_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.brand} - {p.partNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-28">
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                Lot Qty:
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={selectedQty}
                onChange={(e) => setSelectedQty(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 text-center focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div className="self-end pt-1">
              <button
                onClick={handleAddRow}
                className="px-4 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Grid</span>
              </button>
            </div>
          </div>

          {/* Matrix Spreadsheet Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 pl-4">Part Description & Brand</th>
                    <th className="p-3">MPN & OEM Ref</th>
                    <th className="p-3">Vendor Origin</th>
                    <th className="p-3">Units</th>
                    <th className="p-3">Unit B2B Price</th>
                    <th className="p-3">18% GST</th>
                    <th className="p-3">Line Total</th>
                    <th className="p-3 pr-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {matrixRows.map((row, idx) => {
                    const unitPrice = b2bService.getUnitPriceForQty(row.product, row.quantity);
                    const lineSubtotal = unitPrice * row.quantity;
                    const lineGST = Math.round(lineSubtotal * 0.18);
                    const lineTotal = lineSubtotal + lineGST;

                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        {/* Part */}
                        <td className="p-3 pl-4">
                          <span className="font-bold text-gray-900 block max-w-xs truncate">
                            {row.product.title}
                          </span>
                          <span className="text-[11px] text-blue-800 font-semibold">
                            Brand: {row.product.brand} ({row.product.partType})
                          </span>
                        </td>

                        {/* Part Numbers */}
                        <td className="p-3 font-mono text-[11px]">
                          <span className="text-gray-900 font-bold block">{row.product.partNumber}</span>
                          <span className="text-gray-500">{row.product.oemNumber}</span>
                        </td>

                        {/* Vendor */}
                        <td className="p-3">
                          <span className="font-semibold text-gray-800 block truncate max-w-[140px]">
                            {row.product.seller.name}
                          </span>
                          <span className="text-[10px] text-gray-500">{row.product.seller.tier}</span>
                        </td>

                        {/* Qty Input */}
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            max="500"
                            value={row.quantity}
                            onChange={(e) => handleUpdateRowQty(idx, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 bg-gray-50 border border-gray-300 rounded font-bold text-center text-xs"
                          />
                        </td>

                        {/* Unit Price */}
                        <td className="p-3 font-black text-emerald-600">
                          {formatCurrency(unitPrice)}
                        </td>

                        {/* GST */}
                        <td className="p-3 font-mono text-gray-600">
                          {formatCurrency(lineGST)}
                        </td>

                        {/* Line Total */}
                        <td className="p-3 font-black text-gray-900 text-sm">
                          {formatCurrency(lineTotal)}
                        </td>

                        {/* Delete */}
                        <td className="p-3 pr-4 text-right">
                          <button
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Aggregate Financial Summary Bar */}
          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-600">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Volume</span>
                <strong className="text-gray-900 text-sm">{totals.totalUnits} Units ({matrixRows.length} parts)</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Trade Subtotal</span>
                <strong className="text-gray-900 text-sm">{formatCurrency(totals.subtotal)}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Wholesale Savings</span>
                <strong className="text-[#C59B27] text-sm font-black">{formatCurrency(totals.bulkSavings)}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 block">18% GST Credit</span>
                <strong className="text-blue-700 text-sm">{formatCurrency(totals.gstTotal)}</strong>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Estimated Net Payable</span>
                <strong className="text-emerald-700 text-base font-black">{formatCurrency(totals.grandTotal)}</strong>
              </div>
            </div>

            <button
              onClick={handleTransferToCart}
              className="px-5 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Transfer All to B2B Cart &rarr;</span>
            </button>
          </div>
        </div>
      ) : (
        /* Custom Fleet RFQ Interface */
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-5 sm:p-6 space-y-5 text-xs">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span>Request Custom Fleet Quotation (RFQ for 50+ Units)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Direct supplier quoting for scheduled maintenance lots, annual procurement contracts, and multi-depot drops.
            </p>
          </div>

          {submittedRFQ ? (
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Quotation Request Generated: {submittedRFQ.id}</span>
              </div>
              <p className="text-xs text-gray-700">
                Your RFQ for <strong>{submittedRFQ.targetVehicles}</strong> ({submittedRFQ.estimatedMonthlyVolume} units) has been recorded under status <strong>{submittedRFQ.status}</strong>.
              </p>
              <div className="p-3 bg-white rounded-lg border border-emerald-300 font-mono text-xs">
                Estimated Commercial Value: {formatCurrency(submittedRFQ.estimatedQuoteAmount || 0)}
              </div>
              <button
                onClick={() => setSubmittedRFQ(null)}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-bold cursor-pointer"
              >
                Submit Another RFQ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRFQ} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Target Fleet Vehicles & Models *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Signa 4825.T, Ashok Leyland 4220, Eicher Pro 3019"
                    value={rfqVehicles}
                    onChange={(e) => setRfqVehicles(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Part Categories Required *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqCategories}
                    onChange={(e) => setRfqCategories(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Estimated Lot Volume (Units) *
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    required
                    value={rfqVolume}
                    onChange={(e) => setRfqVolume(parseInt(e.target.value) || 50)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Target Delivery Timeline
                  </label>
                  <input
                    type="text"
                    value={rfqTimeline}
                    onChange={(e) => setRfqTimeline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-800 block mb-1">
                    Custom Packaging & Inspection Specifications
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify pallet requirements, batch inspection reports (COA), or staggered depot delivery schedule..."
                    value={rfqNotes}
                    onChange={(e) => setRfqNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate Fleet RFQ Quotation</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
