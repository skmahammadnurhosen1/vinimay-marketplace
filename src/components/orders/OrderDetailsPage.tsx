import React, { useState } from 'react';
import { CustomerOrder, Product, SellerOrderPackage } from '../../types';
import {
  ArrowLeft,
  Truck,
  Package,
  Printer,
  ShieldCheck,
  RotateCcw,
  Wrench,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Car,
  MapPin,
  CreditCard,
  Store,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../common/Button';
import { OrderTrackingModal } from './OrderTrackingModal';
import { useToast } from '../../context/ToastContext';

interface OrderDetailsPageProps {
  order: CustomerOrder;
  onBack: () => void;
  onRequestReturn: (order: CustomerOrder, product: Product) => void;
  onClaimWarranty: (order: CustomerOrder, product: Product) => void;
  onOpenSupportTicket: (orderId: string) => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  order,
  onBack,
  onRequestReturn,
  onClaimWarranty,
  onOpenSupportTicket
}) => {
  const { showToast } = useToast();
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
    showToast('Print Invoice', 'Initiating print dialog for tax invoice.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Action & Invoice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B56D0] hover:text-blue-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            Download Invoice (Demo)
          </Button>

          {order.overallStatus !== 'cancelled' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsTrackingModalOpen(true)}
              leftIcon={<Truck className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              Track Consignment
            </Button>
          )}
        </div>
      </div>

      {/* Order Summary Header Card */}
      <div className="bg-gradient-to-r from-[#071530] via-blue-950 to-[#071530] text-white rounded-3xl p-5 sm:p-7 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-2xl font-black font-mono text-[#FFBA00]">
              Order #{order.id}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              {order.overallStatus}
            </span>
          </div>
          <p className="text-xs text-blue-200">
            Placed on {order.date} • Paid via {order.paymentMethod.toUpperCase()} (Ref: {order.paymentRef})
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs text-blue-300">Total Paid Amount</div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ₹{order.totalPayable.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Vehicle Compatibility Banner */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B56D0] text-white flex items-center justify-center font-bold shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Vehicle Associated with this Order
            </div>
            {order.vehicleContext ? (
              <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>
                  {order.vehicleContext.manufacturer} {order.vehicleContext.model} ({order.vehicleContext.year}) • {order.vehicleContext.fuelType}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% Fitment Guarantee Applied
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-600 font-medium">
                Universal Fitment / General Auto Spares
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Multi-Vendor Consignments Left, Summary & Support Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Seller Consignments */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Seller Consignments & Spare Parts ({order.packages.length} {order.packages.length === 1 ? 'Package' : 'Packages'})
            </h3>
            <span className="text-xs text-gray-500">
              Each merchant ships independently
            </span>
          </div>

          {order.packages.map((pkg, idx) => (
            <div
              key={pkg.packageId}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden"
            >
              {/* Seller Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 via-blue-50/20 to-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071530] text-[#FFBA00] flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-950">
                        {pkg.sellerName}
                      </h4>
                      <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {pkg.sellerTier}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                      Dispatch Origin: {pkg.sellerCity}, {pkg.sellerState} • Courier: {pkg.courierPartner} (AWB: {pkg.trackingId})
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">
                    Consignment Status
                  </div>
                  <span className="text-xs font-bold text-[#0B56D0] uppercase">
                    {pkg.status}
                  </span>
                </div>
              </div>

              {/* Items in this package */}
              <div className="p-4 sm:p-5 divide-y divide-gray-100">
                {pkg.items.map(item => (
                  <div
                    key={item.product.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h5 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {item.product.title}
                        </h5>
                        <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-gray-500 font-mono">
                          <span>Brand: <strong className="text-gray-700">{item.product.brand}</strong></span>
                          <span>Part No: <strong className="text-gray-700">{item.product.partNumber}</strong></span>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          Warranty: {item.product.warranty || '12 Months'}
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions for this item */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="text-sm font-black text-gray-950">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {order.overallStatus === 'delivered' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onRequestReturn(order, item.product)}
                              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Request Return
                            </button>

                            <button
                              type="button"
                              onClick={() => onClaimWarranty(order, item.product)}
                              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Claim Warranty
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Package Subtotal */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Package Consignment Subtotal:</span>
                <span className="font-extrabold text-gray-900">
                  ₹{pkg.packageSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}

          {/* Need Help With This Order Section */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0B56D0]" />
              <h4 className="text-sm font-bold text-gray-900">
                Need Help With This Order?
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              If you have questions regarding transit delays, wrong part fitment, damaged parcel packaging, or mechanic installation guidelines, our dedicated automotive specialists are ready to assist.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <a
                href={`https://wa.me/919820144556?text=Hi%20AutoPartsHub,%20I%20need%20assistance%20with%20Order%20${order.id}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs font-bold text-center transition-colors flex flex-col items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:18004192886"
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-bold text-center transition-colors flex flex-col items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-[#0B56D0]" />
                <span>Call Helpline</span>
              </a>

              <a
                href="mailto:support@autopartshub.in"
                className="p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold text-center transition-colors flex flex-col items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-gray-600" />
                <span>Email Us</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenSupportTicket(order.id)}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Create Ticket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Address, Payment & Price Breakdown */}
        <div className="lg:col-span-4 space-y-5">
          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#0B56D0]" />
              <span>Delivered To</span>
            </div>
            <div className="text-xs font-bold text-gray-950">
              {order.deliveryAddress.fullName}
            </div>
            <div className="text-xs text-gray-600 leading-relaxed">
              {order.deliveryAddress.addressLine1}
              {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state} —{' '}
              <strong className="font-mono text-gray-900">{order.deliveryAddress.pinCode}</strong>
            </div>
            <div className="text-[11px] text-gray-500 font-mono pt-1">
              Phone: {order.deliveryAddress.phone}
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
              Payment Summary
            </h4>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ₹{order.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {order.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount Savings</span>
                  <span className="font-bold">-₹{order.discountTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className={order.shippingTotal === 0 ? 'text-emerald-700 font-bold' : 'text-gray-900'}>
                  {order.shippingTotal === 0 ? 'FREE' : `₹${order.shippingTotal}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Taxes (GST 18% Included)</span>
                <span>₹{order.gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2.5 border-t border-gray-100 flex items-baseline justify-between text-sm font-black text-gray-950">
                <span>Total Amount</span>
                <span className="text-xl text-[#0B56D0]">
                  ₹{order.totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 text-[11px] text-gray-500 font-mono">
              Payment Ref: {order.paymentRef}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      <OrderTrackingModal
        order={order}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </div>
  );
};
