import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  ArrowRight,
  Car,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useVehicle } from '../../context/VehicleContext';
import { useToast } from '../../context/ToastContext';
import { CheckoutService } from '../../services/checkoutService';
import { ConfirmedOrder, DeliveryAddress, PaymentDetails } from '../../types';
import { AddressSection } from './AddressSection';
import { OrderReviewSection } from './OrderReviewSection';
import { PaymentSection } from './PaymentSection';
import { Breadcrumbs, BreadcrumbItem } from '../shop/Breadcrumbs';
import { Button } from '../common/Button';

interface CheckoutPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateCart: () => void;
  onOrderSuccess: (order: ConfirmedOrder) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateCart,
  onOrderSuccess
}) => {
  const {
    items,
    groupedBySeller,
    subtotal,
    totalMrp,
    totalSavings,
    shippingTotal,
    gstAmount,
    totalPayable,
    clearCart,
    setConfirmedOrder
  } = useCart();

  const { selectedVehicle, setIsSelectorModalOpen } = useVehicle();
  const { showToast } = useToast();

  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(() =>
    CheckoutService.getDefaultAddress()
  );

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'upi',
    upiId: 'mechanic@okhdfcbank'
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Shop', onClick: onNavigateShop },
    { label: 'Cart', onClick: onNavigateCart },
    { label: 'Checkout', active: true }
  ];

  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Package className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="text-lg font-bold text-gray-900">No items to checkout</h3>
        <p className="text-xs text-gray-500">Your cart is currently empty.</p>
        <Button variant="gold" size="md" onClick={onNavigateShop}>
          Browse Spare Parts
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);

    setTimeout(() => {
      const order = CheckoutService.createMockConfirmedOrder({
        items,
        address: selectedAddress,
        paymentDetails,
        vehicleContext: selectedVehicle
      });

      setConfirmedOrder(order);
      clearCart();
      setIsPlacingOrder(false);
      showToast('Order Placed!', `Order #${order.orderId} placed successfully.`, 'success');
      onOrderSuccess(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
            Checkout & Order Review
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Confirm your delivery address, verify parts by seller, and choose payment method
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateCart}
          className="text-xs font-bold text-[#0B56D0] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>
      </div>

      {/* Vehicle Context Banner in Checkout */}
      <div className="mt-4 p-3 sm:p-4 rounded-2xl bg-[#071530] text-white flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FFBA00] text-gray-950 flex items-center justify-center font-bold shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
              Parts Fitting For Vehicle
            </div>
            {selectedVehicle ? (
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>
                  {selectedVehicle.manufacturer} {selectedVehicle.model} ({selectedVehicle.year}) • {selectedVehicle.fuelType}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Fitment Guaranteed
                </span>
              </div>
            ) : (
              <div className="text-xs text-amber-300 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                No vehicle selected. Verify vehicle compatibility to avoid wrong orders.
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSelectorModalOpen(true)}
          className="text-xs font-bold text-[#FFBA00] hover:text-amber-300 underline cursor-pointer"
        >
          {selectedVehicle ? 'Change Vehicle' : 'Select Vehicle'}
        </button>
      </div>

      {/* Main Checkout Grid: 3 Steps Left, Summary Right */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3 Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Address Section */}
          <AddressSection
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
          />

          {/* Step 2: Multi-Vendor Order Review */}
          <OrderReviewSection sellerGroups={groupedBySeller} />

          {/* Step 3: Payment Section */}
          <PaymentSection
            paymentDetails={paymentDetails}
            onChangePayment={setPaymentDetails}
          />
        </div>

        {/* Right Column: Sticky Payment Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-5 sticky top-24">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-950">Payment Summary</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {items.length} {items.length === 1 ? 'part' : 'parts'} from {groupedBySeller.length} {groupedBySeller.length === 1 ? 'seller' : 'sellers'}
              </p>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Total (MRP)</span>
                <span className="font-semibold text-gray-800">₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Total Discount</span>
                  <span className="font-bold">-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className={shippingTotal === 0 ? 'text-emerald-700 font-bold' : 'text-gray-900 font-semibold'}>
                  {shippingTotal === 0 ? 'FREE' : `₹${shippingTotal.toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>GST (18% Included)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between text-base font-black text-gray-950">
                <div>
                  <span>Total Payable</span>
                  <div className="text-[10px] text-gray-400 font-normal">All taxes & insurance included</div>
                </div>
                <span className="text-2xl text-[#0B56D0]">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Selected Address Preview */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Delivering to:
              </div>
              <div className="font-bold text-gray-900">{selectedAddress.fullName}</div>
              <div className="text-gray-600 truncate">
                {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pinCode}
              </div>
            </div>

            {/* Desktop Place Order Button */}
            <Button
              variant="gold"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full shadow-md text-sm font-bold justify-center"
            >
              {isPlacingOrder ? 'Processing Order...' : `Place Order • ₹${totalPayable.toLocaleString('en-IN')}`}
            </Button>

            {/* Trust Points */}
            <div className="space-y-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Fitment Guarantee & Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0B56D0] shrink-0" />
                <span>10-Day Free Return Policy on All Parts</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>256-Bit SSL Encrypted Demo Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Place Order Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3.5 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase">Total Payable</div>
            <div className="text-lg font-black text-[#0B56D0]">
              ₹{totalPayable.toLocaleString('en-IN')}
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 shadow-md text-xs font-bold justify-center"
          >
            {isPlacingOrder ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};
