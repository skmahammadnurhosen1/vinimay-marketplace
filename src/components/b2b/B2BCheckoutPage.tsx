import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Receipt,
  ArrowRight,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { b2bService } from '../../services/b2bService';
import { B2BGSTInvoice, B2BOrder, B2BGarageProfile, B2BFleetProfile } from '../../types/b2b';

interface B2BCheckoutPageProps {
  onOrderSuccess: (order: B2BOrder, invoice: B2BGSTInvoice) => void;
  onNavigateCart: () => void;
}

export const B2BCheckoutPage: React.FC<B2BCheckoutPageProps> = ({
  onOrderSuccess,
  onNavigateCart,
}) => {
  const profile = b2bService.getActiveProfile();
  const consignments = b2bService.getConsignments();
  const totals = b2bService.getCartTotals();

  const initialAddress =
    profile.accountType === 'garage'
      ? (profile as B2BGarageProfile).address
      : (profile as B2BFleetProfile).depotAddress;

  // Form State
  const [shippingAddress, setShippingAddress] = useState(
    initialAddress || 'Plot 42, Sector 10, Bhosari MIDC, Pune - 411026'
  );
  const [selectedPayment, setSelectedPayment] = useState<string>('neft');
  const [purchaseOrderRef, setPurchaseOrderRef] = useState(`PO-INT-${Date.now().toString().slice(-4)}`);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let paymentLabel = 'Corporate NEFT / RTGS';
      if (selectedPayment === 'credit') paymentLabel = 'Business Credit Facility (Net 30 Days)';
      if (selectedPayment === 'netbanking') paymentLabel = 'Corporate Net Banking (HDFC / ICICI)';
      if (selectedPayment === 'upi') paymentLabel = 'Business UPI Instant Gateway';

      const result = b2bService.placeB2BOrder(paymentLabel, shippingAddress);
      setIsProcessing(false);
      onOrderSuccess(result.order, result.invoice);
    }, 800);
  };

  if (consignments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-xs text-gray-500">
        Cart is empty. Please add items before checking out.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#C59B27]" />
          <span>B2B Commercial Procurement Checkout</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Statutory GST Tax Invoice and multi-vendor shipment consignment dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: 4 Structured Steps */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step 1: Business Identification & GST */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C59B27]" />
                <span>1. Business Entity & GSTIN Credentials</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                GST Registered & Validated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Buyer Legal Name:</span>
                <strong className="text-gray-900 block text-xs mt-0.5">
                  {profile.accountType === 'garage'
                    ? (profile as any).businessName
                    : (profile as any).companyName}
                </strong>
                <span className="text-gray-500 text-[11px] block">{profile.email} • {profile.mobile}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">GSTIN for 100% Tax Credit:</span>
                <span className="font-mono font-bold text-blue-900 text-xs mt-0.5 block">{profile.gstin}</span>
                <span className="text-emerald-700 text-[10px] font-semibold">
                  Eligible for Form GSTR-2B Input Tax Credit (ITC)
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Bay / Depot Address */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>2. Delivery Bay / Depot Address</span>
              </span>
              <span className="text-gray-500">Commercial Cargo Access</span>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                Primary Consignment Delivery Destination:
              </label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C59B27]"
              />
              <span className="text-[10px] text-gray-400 block mt-1">
                Designated heavy freight drop zone for pallet unloads and tail-lift trucks.
              </span>
            </div>
          </div>

          {/* Step 3: Multi-Seller Consignment Dispatches */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>3. Multi-Seller Consignment Routing ({consignments.length} Packages)</span>
              </span>
              <span className="text-gray-500 font-medium">Independent Vendor Shipments</span>
            </div>

            <div className="space-y-2.5">
              {consignments.map((c, idx) => (
                <div key={c.sellerId} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-900 block text-xs">
                      Consignment {idx + 1}: {c.sellerName}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {c.items.length} SKUs ({c.items.reduce((s, i) => s + i.quantity, 0)} Units) • {c.courierPartner}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 block">{formatCurrency(c.consignmentSubtotal)}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Free Commercial Transit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Business Payment Placeholders */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>4. Business Commercial Payment Method</span>
              </span>
              <span className="text-gray-500">Mock Integration Mode</span>
            </div>

            <div className="space-y-2">
              {/* Payment Option A */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  selectedPayment === 'credit'
                    ? 'bg-amber-50 border-[#C59B27]'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={selectedPayment === 'credit'}
                    onChange={() => setSelectedPayment('credit')}
                  />
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">
                      Trade Credit Line (Net 30 Days)
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Available Credit: {formatCurrency(profile.creditAvailable)} • Zero Interest
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#C59B27] text-gray-950 px-2 py-0.5 rounded">
                  B2B PREFERRED
                </span>
              </label>

              {/* Payment Option B */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  selectedPayment === 'neft'
                    ? 'bg-amber-50 border-[#C59B27]'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="neft"
                    checked={selectedPayment === 'neft'}
                    onChange={() => setSelectedPayment('neft')}
                  />
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">
                      Corporate NEFT / RTGS Bank Transfer
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Virtual Account Number (VAN) generated upon order placement
                    </span>
                  </div>
                </div>
              </label>

              {/* Payment Option C */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  selectedPayment === 'netbanking'
                    ? 'bg-amber-50 border-[#C59B27]'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={selectedPayment === 'netbanking'}
                    onChange={() => setSelectedPayment('netbanking')}
                  />
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">
                      Corporate Net Banking (HDFC / ICICI / SBI)
                    </span>
                    <span className="text-[10px] text-gray-500">Direct business gateway authentication</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Sticky Checkout Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 text-xs sticky top-20">
          <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2">
            Order & Tax Invoice Breakdown
          </h2>

          <div className="space-y-2 text-gray-600">
            <div className="flex items-center justify-between">
              <span>Total Spare Parts Volume:</span>
              <strong className="text-gray-900">{totals.totalUnits} Units</strong>
            </div>

            <div className="flex items-center justify-between">
              <span>Trade Subtotal:</span>
              <strong className="text-gray-900">{formatCurrency(totals.subtotal)}</strong>
            </div>

            <div className="flex items-center justify-between text-blue-700 font-bold">
              <span>18% GST (ITC Eligible):</span>
              <span className="font-mono">+{formatCurrency(totals.gstTotal)}</span>
            </div>

            <div className="flex items-center justify-between text-emerald-700 font-semibold">
              <span>Commercial Freight:</span>
              <span>FREE</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block font-semibold">Final B2B Invoice Total:</span>
              <div className="text-xl font-black text-gray-900">
                {formatCurrency(totals.grandTotal)}
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Generating GST Tax Invoice...</span>
            ) : (
              <>
                <span>Authorize & Place B2B Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={onNavigateCart}
            className="w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            &larr; Back to B2B Cart
          </button>
        </div>
      </div>
    </div>
  );
};
