import React from 'react';
import {
  CheckCircle2,
  Package,
  Printer,
  ArrowRight,
  ShieldCheck,
  Home,
  MapPin,
  Calendar,
  CreditCard,
  Car
} from 'lucide-react';
import { ConfirmedOrder } from '../../types';
import { SellerPackageCard } from './SellerPackageCard';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface OrderConfirmationPageProps {
  order: ConfirmedOrder | null;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateAccount?: (tab?: 'orders' | 'returns' | 'warranties', orderId?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigateHome,
  onNavigateShop,
  onNavigateAccount
}) => {
  const { showToast } = useToast();

  if (!order) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="text-lg font-bold text-gray-900">No recent order found</h3>
        <p className="text-xs text-gray-500">You haven't placed an order in this demo session yet.</p>
        <Button variant="gold" size="md" onClick={onNavigateShop}>
          Browse Catalog
        </Button>
      </div>
    );
  }

  const handlePrintInvoice = () => {
    window.print();
    showToast('Print Invoice', 'Initiating print dialog for your order summary.', 'info');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Celebratory Banner */}
      <div className="bg-gradient-to-br from-[#071530] via-[#0B56D0] to-blue-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg ring-8 ring-white/10 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#FFBA00] uppercase tracking-wider">
              Order Confirmed • Demo Environment
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Thank You! Your Order Has Been Placed
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              We've notified the verified merchants. Your spare parts will be carefully packed and dispatched with individual tracking numbers.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-2 rounded-2xl text-xs font-mono">
            <span>Order ID: <strong className="text-[#FFBA00]">{order.orderId}</strong></span>
            <span className="text-blue-300">•</span>
            <span>Placed: {order.orderDate}</span>
            <span className="text-blue-300">•</span>
            <span className="text-emerald-300 font-bold">{order.paymentStatus}</span>
          </div>
        </div>
      </div>

      {/* Meta Cards: Payment, Delivery, Vehicle Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Delivery Address */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#0B56D0]" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-xs font-bold text-gray-900">{order.customerAddress.fullName}</div>
          <div className="text-xs text-gray-600 leading-relaxed">
            {order.customerAddress.addressLine1}
            {order.customerAddress.addressLine2 && `, ${order.customerAddress.addressLine2}`}
            <br />
            {order.customerAddress.city}, {order.customerAddress.state} —{' '}
            <strong className="font-mono text-gray-900">{order.customerAddress.pinCode}</strong>
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            Phone: {order.customerAddress.phone}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-[#0B56D0]" />
            <span>Payment Breakdown</span>
          </div>
          <div className="text-xs font-bold text-gray-900 capitalize">
            Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : `${order.paymentMethod.toUpperCase()} (Demo)`}
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-800">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-emerald-700 font-semibold">
                {order.shippingTotal === 0 ? 'FREE' : `₹${order.shippingTotal}`}
              </span>
            </div>
            <div className="flex justify-between font-black text-sm text-gray-950 pt-1 border-t border-gray-100">
              <span>Total Paid:</span>
              <span className="text-[#0B56D0]">₹{order.totalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            Ref: {order.paymentRef}
          </div>
        </div>

        {/* Vehicle Context */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Car className="w-4 h-4 text-[#0B56D0]" />
            <span>Vehicle Protection</span>
          </div>
          {order.vehicleContext ? (
            <>
              <div className="text-xs font-bold text-gray-900">
                {order.vehicleContext.manufacturer} {order.vehicleContext.model}
              </div>
              <div className="text-xs text-gray-600">
                {order.vehicleContext.year} • {order.vehicleContext.fuelType} • {order.vehicleContext.engine}
              </div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Fitment Guarantee Applied</span>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500">
              Universal / Multi-fit order. Covered by 10-day replacement warranty.
            </div>
          )}
        </div>
      </div>

      {/* Multi-Vendor Order Split Explanation */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Package className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-amber-950">
            Multi-Vendor Fulfillment ({order.packages.length} {order.packages.length === 1 ? 'Package' : 'Separate Packages'})
          </h4>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            Your order contains products supplied by <strong>{order.packages.length} different sellers</strong>. Each seller will ship their parts independently from their respective regional warehouse. Below are the consignment packages with their live tracking references.
          </p>
        </div>
      </div>

      {/* Seller Consignment Package Cards */}
      <div className="space-y-4">
        {order.packages.map(pkg => (
          <SellerPackageCard
            key={pkg.packageId}
            pkg={pkg}
            orderDate={order.orderDate}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrintInvoice}
            leftIcon={<Printer className="w-4 h-4" />}
            className="text-xs font-bold"
          >
            Print Receipt / Invoice
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onNavigateHome}
            leftIcon={<Home className="w-4 h-4" />}
            className="text-xs font-bold"
          >
            Home
          </Button>

          {onNavigateAccount && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigateAccount('orders', order.orderId)}
              leftIcon={<Package className="w-4 h-4" />}
              className="text-xs font-bold"
            >
              Track in My Orders
            </Button>
          )}
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={onNavigateShop}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="text-xs font-bold shadow-md"
        >
          Continue Shopping Spare Parts
        </Button>
      </div>
    </div>
  );
};
