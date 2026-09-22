import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Product } from '../../types';

export interface OrderData {
  orderId: string;
  product: Product;
  quantity: number;
  totalPrice: number;
  shippingDetails: {
    fullName: string;
    phone: string;
    pincode: string;
    address: string;
    city: string;
    state: string;
  };
  paymentMethod: string;
  orderDate: string;
  deliveryDate: string;
}

interface DirectOrderModalProps {
  product: Product | null;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: OrderData) => void;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  product,
  quantity,
  isOpen,
  onClose,
  onOrderPlaced
}) => {
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [pincode, setPincode] = useState('400001');
  const [address, setAddress] = useState('Shop 12, Auto Complex, MG Road');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const subtotal = product.price * quantity;
  const deliveryFee = 0; // Free delivery
  const totalPayable = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomId = `APH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const deliveryDays = 3;
    const now = new Date();
    const deliveryDateObj = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    const deliveryDateStr = deliveryDateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const orderData: OrderData = {
      orderId: randomId,
      product,
      quantity,
      totalPrice: totalPayable,
      shippingDetails: {
        fullName,
        phone,
        pincode,
        address,
        city,
        state
      },
      paymentMethod: {
        cod: 'Cash on Delivery (Pay upon delivery)',
        upi: 'UPI (GPay / PhonePe / Paytm)',
        card: 'Credit / Debit Card (Visa, Mastercard, RuPay)',
        netbanking: 'Internet Banking'
      }[paymentMethod],
      orderDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      deliveryDate: deliveryDateStr
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(orderData);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#071530] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFBA00]" />
              <h2 className="text-base font-bold tracking-tight">Direct Order Checkout</h2>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Instant order placement without adding to cart
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 1. Item Preview Summary */}
          <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-200/80 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold uppercase">
                <span className="text-[#0B56D0] font-bold">{product.brand}</span>
                <span>•</span>
                <span className="font-mono">Part #{product.partNumber}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-950 truncate mt-0.5">
                {product.title}
              </h3>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-gray-600">
                  Qty: <strong className="text-gray-900">{quantity}</strong> × ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-black text-gray-950">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Customer & Shipping Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#0B56D0]" />
                <span>Delivery Address</span>
              </h4>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Pan-India Free Express
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 font-medium font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-medium mb-1">Street Address / Workshop / Landmark *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method Selection */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0B56D0]" />
              <span>Select Payment Method</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Cash on Delivery */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#0B56D0] bg-blue-50/70 text-gray-900 shadow-2xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-[#0B56D0] focus:ring-blue-500"
                />
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Cash on Delivery (COD)</div>
                  <div className="text-[10px] text-gray-500">Pay cash upon delivery</div>
                </div>
              </label>

              {/* UPI */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#0B56D0] bg-blue-50/70 text-gray-900 shadow-2xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="w-4 h-4 text-[#0B56D0] focus:ring-blue-500"
                />
                <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold">Instant UPI</div>
                  <div className="text-[10px] text-gray-500">GPay, PhonePe, Paytm, QR</div>
                </div>
              </label>

              {/* Cards */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#0B56D0] bg-blue-50/70 text-gray-900 shadow-2xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="w-4 h-4 text-[#0B56D0] focus:ring-blue-500"
                />
                <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold">Debit / Credit Card</div>
                  <div className="text-[10px] text-gray-500">Visa, Mastercard, RuPay</div>
                </div>
              </label>

              {/* Net Banking */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#0B56D0] bg-blue-50/70 text-gray-900 shadow-2xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="w-4 h-4 text-[#0B56D0] focus:ring-blue-500"
                />
                <Building className="w-4 h-4 text-gray-600 shrink-0" />
                <div>
                  <div className="font-bold">Net Banking</div>
                  <div className="text-[10px] text-gray-500">All major Indian banks</div>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Price Breakdown & Order Total */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Item Subtotal ({quantity} {quantity === 1 ? 'part' : 'parts'}):</span>
              <span className="font-mono font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery & Shipping Fee:</span>
              <span className="text-emerald-700 font-bold uppercase">FREE</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated GST (18% included):</span>
              <span className="text-gray-500 font-mono">₹{Math.round((subtotal * 0.18) / 1.18).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-gray-900">
              <span className="font-bold text-sm">Total Payable:</span>
              <span className="text-xl font-black text-gray-950 font-mono">₹{totalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Trust Guarantee Note */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Genuine Part Guarantee with 10-Day Easy Returns.</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-[#FFBA00] hover:bg-[#EAA500] active:scale-[0.98] text-gray-950 font-black text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Place Order • ₹{totalPayable.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
