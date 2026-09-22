import React from 'react';
import { ShoppingBag, Car, ArrowLeft, RotateCcw, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart, DemoScenarioType } from '../../context/CartContext';
import { useVehicle } from '../../context/VehicleContext';
import { SellerCartGroup } from './SellerCartGroup';
import { CartSummary } from './CartSummary';
import { EmptyCart } from './EmptyCart';
import { Breadcrumbs, BreadcrumbItem } from '../shop/Breadcrumbs';
import { Product } from '../../types';

interface CartPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateCheckout: () => void;
  onSelectProduct: (product: Product) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateCheckout,
  onSelectProduct
}) => {
  const {
    items,
    groupedBySeller,
    totalItems,
    updateQuantity,
    removeFromCart,
    loadDemoScenario,
    clearCart
  } = useCart();

  const { selectedVehicle, setIsSelectorModalOpen } = useVehicle();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Shop', onClick: onNavigateShop },
    { label: 'Shopping Cart', active: true }
  ];

  if (items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={breadcrumbs} />
        <EmptyCart onContinueShopping={onNavigateShop} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Page Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#071530] text-[#FFBA00] flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
              Customer Shopping Cart
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review parts grouped by verified sellers • {totalItems} {totalItems === 1 ? 'item' : 'items'} across {groupedBySeller.length} {groupedBySeller.length === 1 ? 'seller' : 'sellers'}
            </p>
          </div>
        </div>

        {/* Clear cart action */}
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      {/* Vehicle Compatibility Banner */}
      <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-[#071530] to-blue-950 text-white shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFBA00] text-gray-950 flex items-center justify-center font-bold shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-blue-200 uppercase tracking-wider font-bold">
              Active Vehicle Fitment Check
            </div>
            {selectedVehicle ? (
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>
                  {selectedVehicle.manufacturer} {selectedVehicle.model} • {selectedVehicle.year} • {selectedVehicle.fuelType}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Fitment Protected
                </span>
              </div>
            ) : (
              <div className="text-xs sm:text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                No vehicle selected yet. Select car to guarantee 100% part fitment.
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSelectorModalOpen(true)}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          {selectedVehicle ? 'Change Vehicle' : 'Select Vehicle'}
        </button>
      </div>

      {/* Demo Scenario Switcher Strip */}
      <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <Sparkles className="w-4 h-4 text-[#0B56D0]" />
          <span className="font-bold text-gray-900">Demo Scenarios:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => loadDemoScenario('multi-seller')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
          >
            Multi-Seller (3)
          </button>
          <button
            type="button"
            onClick={() => loadDemoScenario('single-seller')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Single Seller
          </button>
          <button
            type="button"
            onClick={() => loadDemoScenario('compatibility-warning')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors border border-amber-300 cursor-pointer"
          >
            Fitment Warning
          </button>
          <button
            type="button"
            onClick={() => loadDemoScenario('low-stock')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Low Stock
          </button>
          <button
            type="button"
            onClick={() => loadDemoScenario('out-of-stock')}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-red-50 text-red-800 hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Main Cart Grid: Seller Groups Left, Summary Right */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Multi-Vendor Seller Containers */}
        <div className="lg:col-span-8 space-y-4">
          {groupedBySeller.map(group => (
            <SellerCartGroup
              key={group.seller.id}
              group={group}
              onUpdateQuantity={(productId, qty) => updateQuantity(productId, qty)}
              onRemoveItem={productId => removeFromCart(productId)}
              onSelectProduct={onSelectProduct}
            />
          ))}

          {/* Continue Shopping Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateShop}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0B56D0] hover:text-blue-800 transition-colors cursor-pointer p-2 rounded-lg hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Browsing Auto Parts</span>
            </button>
          </div>
        </div>

        {/* Right: Cart Summary */}
        <div className="lg:col-span-4">
          <CartSummary onProceedToCheckout={onNavigateCheckout} />
        </div>
      </div>
    </div>
  );
};
