import React from 'react';
import { Store, ShieldCheck, MapPin, PackageCheck, Truck } from 'lucide-react';
import { SellerCartGroupData, Product } from '../../types';
import { CartItemRow } from './CartItem';

interface SellerCartGroupProps {
  group: SellerCartGroupData;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const SellerCartGroup: React.FC<SellerCartGroupProps> = ({
  group,
  onUpdateQuantity,
  onRemoveItem,
  onSelectProduct
}) => {
  const { seller, items, subtotal, itemCount, shippingFee, estimatedDelivery } = group;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden mb-5">
      {/* Seller Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 via-blue-50/20 to-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#071530] text-[#FFBA00] flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <Store className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-950">{seller.name}</h3>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Merchant
                </span>
              )}
              <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md">
                {seller.tier}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {seller.city}, {seller.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-600 font-medium">
                ★ {seller.rating.toFixed(1)} rating ({seller.reviewCount.toLocaleString('en-IN')} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Seller Package Summary */}
        <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="text-xs text-gray-500 font-medium">
            Package Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):
          </div>
          <div className="text-sm font-extrabold text-gray-900">
            ₹{subtotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Multi-Vendor Independent Dispatch Notice */}
      <div className="px-4 py-2.5 bg-blue-50/50 border-b border-blue-100 text-xs text-blue-900 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#0B56D0] shrink-0" />
          <span className="text-[11px] font-medium">
            Dispatched independently from {seller.city} via Express Courier • Estimated Delivery: <strong>{estimatedDelivery}</strong>
          </span>
        </div>
        <span className="text-[11px] font-bold text-gray-700">
          {shippingFee === 0 ? (
            <span className="text-emerald-700 font-bold">FREE Delivery</span>
          ) : (
            `Shipping: ₹${shippingFee}`
          )}
        </span>
      </div>

      {/* Cart Items belonging to this Seller */}
      <div className="p-4 sm:p-5 divide-y divide-gray-100">
        {items.map(item => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onUpdateQuantity={qty => onUpdateQuantity(item.product.id, qty)}
            onRemove={() => onRemoveItem(item.product.id)}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};
