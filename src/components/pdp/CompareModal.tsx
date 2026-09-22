import React from 'react';
import { X, CheckCircle2, AlertCircle, ShoppingCart, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useVehicle } from '../../context/VehicleContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const CompareModal: React.FC = () => {
  const { compareItems, removeFromCompare, isCompareModalOpen, setIsCompareModalOpen } = useCompare();
  const { selectedVehicle } = useVehicle();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!isCompareModalOpen || compareItems.length === 0) return null;

  const handleAddToCart = (product: typeof compareItems[0]) => {
    addToCart(product);
    showToast('Added to Cart', `${product.title} added to your cart.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B56D0] flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Spare Parts Comparison Table
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Side-by-side specifications, compatibility & pricing
                {selectedVehicle && ` for ${selectedVehicle.manufacturer} ${selectedVehicle.model}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCompareModalOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto py-4">
          <table className="w-full text-left text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 bg-gray-50/80 font-bold text-gray-700 w-40">Attribute</th>
                {compareItems.map(item => (
                  <th key={item.id} className="p-3 bg-white font-bold text-gray-900 text-center w-52 align-top">
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="relative w-24 h-24 rounded-xl bg-gray-50 border border-gray-200 p-2 flex items-center justify-center">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="font-bold text-gray-900 text-xs line-clamp-2 text-center h-8">
                        {item.title}
                      </h4>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Price */}
              <tr>
                <td className="p-3 font-semibold text-gray-600 bg-gray-50/50">Selling Price</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center">
                    <span className="text-base font-black text-gray-950 font-mono">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.mrp > item.price && (
                      <span className="block text-[10px] text-gray-400 line-through">
                        MRP ₹{item.mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr>
                <td className="p-3 font-semibold text-gray-600 bg-gray-50/50">Brand & Part #</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center">
                    <span className="font-bold text-[#0B56D0] block">{item.brand}</span>
                    <span className="text-[10px] font-mono text-gray-500">{item.partNumber}</span>
                  </td>
                ))}
              </tr>

              {/* Quality Tier */}
              <tr>
                <td className="p-3 font-semibold text-gray-600 bg-gray-50/50">Quality Tier</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0B56D0]">
                      {item.partType} Standard
                    </span>
                  </td>
                ))}
              </tr>

              {/* Compatibility */}
              <tr>
                <td className="p-3 font-semibold text-gray-600 bg-gray-50/50">Compatibility</td>
                {compareItems.map(item => {
                  const isCompat = selectedVehicle
                    ? item.compatibility.some(c =>
                        c.manufacturer.toLowerCase().includes(selectedVehicle.manufacturer.toLowerCase()) &&
                        c.model.toLowerCase().includes(selectedVehicle.model.toLowerCase())
                      )
                    : false;

                  return (
                    <td key={item.id} className="p-3 text-center">
                      {selectedVehicle ? (
                        isCompat ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Fits {selectedVehicle.model}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Verify Fitment</span>
                          </span>
                        )
                      ) : (
                        <span className="text-gray-500 text-[11px]">
                          Fits {item.compatibility.length} Vehicles
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Warranty */}
              <tr>
                <td className="p-3 font-semibold text-gray-600 bg-gray-50/50">Warranty</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center font-medium text-gray-800">
                    {item.warranty}
                  </td>
                ))}
              </tr>

              {/* Seller */}
              <tr>
                <td className="p-3 font-semibold text-gray-600 bg-gray-50/50">Seller & Rating</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center">
                    <span className="font-bold text-gray-900 block">{item.seller.name}</span>
                    <span className="text-[11px] text-amber-600 font-semibold">
                      ★ {item.seller.rating.toFixed(1)} ({item.seller.city})
                    </span>
                  </td>
                ))}
              </tr>

              {/* Add to cart action */}
              <tr>
                <td className="p-3 font-semibold text-gray-600 bg-gray-50/50">Purchase</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2 px-3 bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
