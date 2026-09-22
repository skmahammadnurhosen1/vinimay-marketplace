import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Store, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Product } from '../../types';

interface CartDrawerProps {
  onNavigateCart?: () => void;
  onNavigateCheckout?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateCart,
  onNavigateCheckout,
  onSelectProduct
}) => {
  const {
    items,
    groupedBySeller,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalMrp,
    totalSavings,
    freeDeliveryThreshold,
    shippingTotal,
    totalPayable,
    totalItems
  } = useCart();

  if (!isCartOpen) return null;

  const progress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleOpenCartPage = () => {
    setIsCartOpen(false);
    if (onNavigateCart) {
      onNavigateCart();
    }
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    if (onNavigateCheckout) {
      onNavigateCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C0E11]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#071530] text-[#FFBA00] flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Your Shopping Cart</h3>
                <span className="text-[11px] text-gray-500 font-medium">
                  {totalItems} {totalItems === 1 ? 'part' : 'parts'} • {groupedBySeller.length} {groupedBySeller.length === 1 ? 'seller' : 'sellers'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="p-3.5 bg-blue-50/70 border-b border-blue-100 text-xs">
            <div className="flex items-center justify-between text-gray-700 mb-1 font-medium">
              <span className="flex items-center gap-1 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-[#0B56D0]" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-gray-950 font-bold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> for Free Express Delivery
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">You qualify for Free Delivery!</span>
                )}
              </span>
              <span className="font-bold text-blue-900 text-[11px]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-blue-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0B56D0] to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Multi-Vendor Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length > 0 ? (
              groupedBySeller.map(group => (
                <div
                  key={group.seller.id}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 space-y-3"
                >
                  {/* Seller Header in Mini Cart */}
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-gray-200 text-gray-700">
                    <div className="flex items-center gap-1.5 font-bold truncate">
                      <Store className="w-3.5 h-3.5 text-[#0B56D0] shrink-0" />
                      <span className="truncate">{group.seller.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                      {group.seller.city}
                    </span>
                  </div>

                  {/* Items for this seller */}
                  <div className="space-y-3 divide-y divide-gray-200/60">
                    {group.items.map(item => (
                      <div key={item.product.id} className="pt-2.5 first:pt-0 flex gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-14 h-14 rounded-lg object-contain bg-white border border-gray-200 p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4
                              onClick={() => {
                                setIsCartOpen(false);
                                onSelectProduct?.(item.product);
                              }}
                              className="text-xs font-bold text-gray-900 truncate hover:text-[#0B56D0] cursor-pointer"
                            >
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                            {item.product.brand} • {item.product.partNumber}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200 rounded-md bg-white">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 text-xs font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-[11px] font-bold text-gray-900 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 text-xs font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Line Price */}
                            <span className="text-xs font-bold text-gray-950">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-500 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">Your Cart is Empty</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Browse guaranteed-fit spare parts and add them to your multi-vendor cart.
                </p>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-[#FAF9F6] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Total Savings</span>
                    <span className="font-bold">Save ₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingTotal === 0 ? 'text-emerald-700 font-bold' : 'text-gray-900 font-semibold'}>
                    {shippingTotal === 0 ? 'FREE' : `₹${shippingTotal.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-950 pt-2 border-t border-gray-200">
                  <span>Total Payable</span>
                  <span className="text-base text-[#0B56D0]">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons: View Full Cart + Checkout */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleOpenCartPage}
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  className="w-full text-xs font-bold justify-center"
                >
                  View Full Cart
                </Button>

                <Button
                  variant="gold"
                  size="md"
                  onClick={handleOpenCheckout}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="w-full text-xs font-bold justify-center shadow-xs"
                >
                  Checkout
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by 256-Bit Escrow & 100% Fitment Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
