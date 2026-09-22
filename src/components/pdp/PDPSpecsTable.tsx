import React, { useState } from 'react';
import { Product } from '../../types';
import { CheckCircle2, ShieldCheck, Wrench, Car, FileText, RotateCcw } from 'lucide-react';

interface PDPSpecsTableProps {
  product: Product;
}

export const PDPSpecsTable: React.FC<PDPSpecsTableProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'warranty'>('specs');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs my-8 space-y-6">
      {/* Tabs Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'specs'
              ? 'bg-[#0B56D0] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Technical Specifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compatibility')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'compatibility'
              ? 'bg-[#0B56D0] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Compatible Vehicles ({product.compatibility.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('warranty')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'warranty'
              ? 'bg-[#0B56D0] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Warranty & Returns</span>
        </button>
      </div>

      {/* Tab 1: Technical Specifications */}
      {activeTab === 'specs' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0B56D0]" />
              <span>Engineering & Physical Dimensions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-500 font-medium">{key}</span>
                  <span className="font-bold text-gray-900 text-right">{val}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Part Number</span>
                <span className="font-mono font-bold text-gray-900">{product.partNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">OEM Reference</span>
                <span className="font-mono font-bold text-gray-900">{product.oemNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Product Quality</span>
                <span className="font-bold text-[#0B56D0]">{product.partType} Standard</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Country of Origin</span>
                <span className="font-bold text-gray-900">India</span>
              </div>
            </div>
          </div>

          {/* Key Engineering Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2.5">
                Key Features & Manufacturing Standards
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Vehicle Compatibility Table */}
      {activeTab === 'compatibility' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-[#0B56D0]" />
              <span>Full List of Confirmed Vehicle Fitments</span>
            </h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
              ✓ 100% Zero-Wrong-Fit Guarantee
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Manufacturer</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Model</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Model Years</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Engine / Fuel</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {product.compatibility.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{c.manufacturer}</td>
                    <td className="px-4 py-3 font-bold text-gray-950">{c.model}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono">{c.yearRange}</td>
                    <td className="px-4 py-3 text-gray-600">{c.engine || 'All Available Engines'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Confirmed Fit</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Warranty & Returns */}
      {activeTab === 'warranty' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Manufacturer Warranty</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.warranty}. Covers manufacturing flaws, premature material fatigue, and structural defects.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0B56D0] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">{product.returnDays}-Day Easy Return Policy</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              If the part does not fit your vehicle or arrives damaged, return it within {product.returnDays} days in original packaging for a 100% full refund.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">100% Genuine Guarantee</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sourced directly from authorized distributors. Each unit includes authentic hologram verification and official batch code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
