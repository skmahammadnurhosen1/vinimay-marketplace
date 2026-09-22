import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, Home, ShoppingBag, ShieldCheck } from 'lucide-react';
import { OrderData } from './DirectOrderModal';

interface OrderSuccessModalProps {
  order: OrderData | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateShop
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Checkmark badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Order Confirmed & Dispatched
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
            Thank You for Your Order!
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Your spare part order has been verified with <strong>{order.product.seller.name}</strong> and is being prepared for express shipping.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div>
              <span className="text-gray-400 block text-[10px]">Order Reference ID</span>
              <strong className="text-sm font-mono text-gray-900">{order.orderId}</strong>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block text-[10px]">Estimated Delivery</span>
              <strong className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>{order.deliveryDate}</span>
              </strong>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Item:</span>
              <span className="font-bold text-gray-900 text-right truncate max-w-[240px]">
                {order.product.brand} {order.product.title} (Qty: {order.quantity})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Part Number:</span>
              <span className="font-mono text-gray-700">{order.product.partNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment:</span>
              <span className="font-medium text-gray-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Deliver to:</span>
              <span className="font-medium text-gray-800 text-right truncate max-w-[200px]">
                {order.shippingDetails.fullName}, {order.shippingDetails.city} ({order.shippingDetails.pincode})
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
              <span className="font-bold text-gray-900">Total Amount:</span>
              <span className="text-base font-black text-[#0B56D0] font-mono">
                ₹{order.totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp & SMS alert info */}
        <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-left flex items-start gap-2.5 text-[11px] text-blue-900">
          <ShieldCheck className="w-4 h-4 text-[#0B56D0] shrink-0 mt-0.5" />
          <span>
            Order tracking link and digital GST invoice have been dispatched via SMS & WhatsApp to <strong>+91 {order.shippingDetails.phone}</strong>.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateShop();
            }}
            className="py-3 px-4 bg-[#0B56D0] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateHome();
            }}
            className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
