import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { ArrowRight, Star, ShoppingCart, CheckCircle2, SlidersHorizontal, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useVehicle } from '../../context/VehicleContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';

interface RelatedProductsProps {
  currentProduct: Product;
  onSelectProduct: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
  onSelectProduct
}) => {
  const [related, setRelated] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { selectedVehicle } = useVehicle();
  const { addToCompare, isInCompare } = useCompare();
  const { showToast } = useToast();

  useEffect(() => {
    const loadRelated = async () => {
      const all = await productService.getAllProducts();
      // Filter products from same category or same brand, excluding current
      const filtered = all
        .filter(
          p =>
            p.id !== currentProduct.id &&
            (p.category === currentProduct.category || p.brand === currentProduct.brand)
        )
        .slice(0, 4);
      setRelated(filtered);
    };
    loadRelated();
  }, [currentProduct]);

  if (related.length === 0) return null;

  return (
    <div className="my-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Related Spare Parts & Assemblies
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Compatible components and replacement assemblies for {currentProduct.brand} systems
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((prod) => {
          const isCompat = selectedVehicle
            ? prod.compatibility.some(
                c =>
                  c.manufacturer.toLowerCase().includes(selectedVehicle.manufacturer.toLowerCase()) &&
                  c.model.toLowerCase().includes(selectedVehicle.model.toLowerCase())
              )
            : false;

          const compared = isInCompare(prod.id);

          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="bg-white rounded-2xl border border-gray-200 hover:border-[#0B56D0] p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="space-y-2.5">
                {/* Image Box */}
                <div className="aspect-[4/3] w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2 flex items-center justify-center relative">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-white/90 text-gray-800 shadow-2xs border border-gray-100">
                    {prod.partType}
                  </span>

                  {/* Compare Toggle Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCompare(prod);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg border transition-colors ${
                      compared
                        ? 'bg-blue-50 border-[#0B56D0] text-[#0B56D0]'
                        : 'bg-white/90 border-gray-200 text-gray-400 hover:text-gray-700'
                    }`}
                    title={compared ? 'In comparison' : 'Compare part'}
                  >
                    {compared ? <Check className="w-3 h-3 stroke-[3]" /> : <SlidersHorizontal className="w-3 h-3" />}
                  </button>
                </div>

                {/* Brand & Rating */}
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="font-bold text-[#0B56D0] uppercase tracking-wider">{prod.brand}</span>
                  <div className="flex items-center gap-1 font-semibold text-gray-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{prod.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#0B56D0] transition-colors line-clamp-2 leading-snug">
                  {prod.title}
                </h4>

                {/* Compatibility indicator */}
                <div className="pt-0.5">
                  {selectedVehicle ? (
                    isCompat ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded w-full truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">Fits {selectedVehicle.model}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-600 bg-gray-100 px-2 py-0.5 rounded w-full truncate">
                        <span className="truncate">Verify fitment for {selectedVehicle.model}</span>
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] text-gray-400">
                      Fits {prod.compatibility.length} vehicle models
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Cart footer */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-gray-950 font-mono">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>
                  {prod.mrp > prod.price && (
                    <span className="text-[10px] line-through text-gray-400 font-mono">
                      ₹{prod.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(prod);
                    showToast('Added to Cart', `${prod.title} added to cart`, 'success');
                  }}
                  className="p-2 rounded-lg bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold transition-colors shadow-2xs cursor-pointer"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
