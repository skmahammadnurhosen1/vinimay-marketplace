import React from 'react';
import {
  X,
  Car,
  MapPin,
} from 'lucide-react';
import { ManufacturerProduct } from '../../types/manufacturer';

interface ManufacturerProductDetailsModalProps {
  product: ManufacturerProduct | null;
  onClose: () => void;
  onEdit: (product: ManufacturerProduct) => void;
}

export const ManufacturerProductDetailsModal: React.FC<ManufacturerProductDetailsModalProps> = ({
  product,
  onClose,
  onEdit,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0284C7]">{product.partNumber}</span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] text-gray-500 font-mono">OEM: {product.oemNumber}</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 line-clamp-1">{product.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 border border-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-gray-700">
          {/* Commercial & Stock Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 block font-mono">TRADE PRICE</span>
              <span className="text-base font-bold text-gray-900 font-mono">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-gray-400 line-through block">MRP ₹{product.mrp}</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 block font-mono">AVAILABLE STOCK</span>
              <span className="text-base font-bold text-emerald-600 font-mono">{product.stock.available}</span>
              <span className="text-[10px] text-gray-500 block">{product.stock.reserved} reserved</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 block font-mono">QUALITY TIER</span>
              <span className="text-sm font-bold text-[#0284C7] block mt-0.5">{product.productType}</span>
              <span className="text-[10px] text-gray-500 block">{product.category}</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] text-gray-500 block font-mono">WARRANTY</span>
              <span className="text-xs font-semibold text-gray-900 block mt-0.5">{product.warranty}</span>
            </div>
          </div>

          {/* Warehouse & Description */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <span className="text-[10px] text-gray-500 font-mono uppercase block">Warehouse Location & Description:</span>
            <div className="text-gray-900 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>{product.stock.warehouseLocation}</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-xs">{product.description}</p>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-2">
            <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px] block">
              Technical Specifications:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">{key}</span>
                  <span className="font-semibold text-gray-900 block">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Compatibility Hierarchy Matrix */}
          <div className="space-y-2">
            <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Car className="w-4 h-4 text-purple-600" />
              <span>Vehicle Fitment List ({product.compatibility.length} Vehicles)</span>
            </span>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-[11px] text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-mono uppercase text-[9px]">
                  <tr>
                    <th className="py-2 px-3">Make & Model</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Years</th>
                    <th className="py-2 px-3">Engine & Fuel</th>
                    <th className="py-2 px-3">Variant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.compatibility.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50/80">
                      <td className="py-2 px-3 font-bold text-gray-900">{c.manufacturer} {c.model}</td>
                      <td className="py-2 px-3 capitalize text-gray-500">{c.vehicleType}</td>
                      <td className="py-2 px-3 font-mono">{c.yearRange}</td>
                      <td className="py-2 px-3">{c.engine} ({c.fuelType})</td>
                      <td className="py-2 px-3 text-[#0284C7] font-mono">{c.variant || 'Standard'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-gray-500 font-mono">SKU ID: {product.id}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0284C7] font-semibold text-xs transition cursor-pointer"
            >
              Edit Part
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
