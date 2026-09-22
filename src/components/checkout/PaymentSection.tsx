import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Building,
  Wallet,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Info
} from 'lucide-react';
import { PaymentDetails, PaymentMethodType } from '../../types';

interface PaymentSectionProps {
  paymentDetails: PaymentDetails;
  onChangePayment: (details: PaymentDetails) => void;
}

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' }
];

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentDetails,
  onChangePayment
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(paymentDetails.method);
  const [upiId, setUpiId] = useState(paymentDetails.upiId || 'mechanic@okhdfcbank');
  const [isUpiVerified, setIsUpiVerified] = useState(true);

  // Card fields
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardHolder, setCardHolder] = useState('RAJESH SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');

  // Bank & Wallet
  const [bankName, setBankName] = useState(paymentDetails.bankName || 'HDFC Bank');
  const [walletProvider, setWalletProvider] = useState(paymentDetails.walletProvider || 'Paytm');

  const handleMethodChange = (method: PaymentMethodType) => {
    setSelectedMethod(method);
    onChangePayment({
      method,
      upiId,
      cardNumber,
      cardHolder,
      cardExpiry,
      bankName,
      walletProvider
    });
  };

  const handleUpiChange = (val: string) => {
    setUpiId(val);
    setIsUpiVerified(val.includes('@') && val.length > 5);
    onChangePayment({
      ...paymentDetails,
      method: 'upi',
      upiId: val
    });
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('6')) return 'RuPay';
    return 'Card';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-950">
              Payment Method
            </h3>
            <span className="text-xs text-gray-500">
              Encrypted 256-Bit Escrow • Zero Gateway Transaction Fee
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>PCI-DSS Compliant Demo</span>
        </div>
      </div>

      {/* Payment Method Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {/* 1. UPI */}
        <button
          type="button"
          onClick={() => handleMethodChange('upi')}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
            selectedMethod === 'upi'
              ? 'border-[#0B56D0] bg-blue-50/60 shadow-xs'
              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <Smartphone className={`w-5 h-5 ${selectedMethod === 'upi' ? 'text-[#0B56D0]' : 'text-gray-500'}`} />
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 rounded">Fast</span>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">UPI Instant</div>
            <div className="text-[10px] text-gray-400">GPay, PhonePe, QR</div>
          </div>
        </button>

        {/* 2. Credit/Debit Card */}
        <button
          type="button"
          onClick={() => handleMethodChange('card')}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
            selectedMethod === 'card'
              ? 'border-[#0B56D0] bg-blue-50/60 shadow-xs'
              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <CreditCard className={`w-5 h-5 ${selectedMethod === 'card' ? 'text-[#0B56D0]' : 'text-gray-500'}`} />
            <span className="text-[9px] font-mono text-gray-400">Cards</span>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Debit / Credit</div>
            <div className="text-[10px] text-gray-400">Visa, Master, RuPay</div>
          </div>
        </button>

        {/* 3. Net Banking */}
        <button
          type="button"
          onClick={() => handleMethodChange('netbanking')}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
            selectedMethod === 'netbanking'
              ? 'border-[#0B56D0] bg-blue-50/60 shadow-xs'
              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
          }`}
        >
          <Building className={`w-5 h-5 ${selectedMethod === 'netbanking' ? 'text-[#0B56D0]' : 'text-gray-500'}`} />
          <div>
            <div className="text-xs font-bold text-gray-900">Net Banking</div>
            <div className="text-[10px] text-gray-400">All Indian Banks</div>
          </div>
        </button>

        {/* 4. Wallets */}
        <button
          type="button"
          onClick={() => handleMethodChange('wallet')}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
            selectedMethod === 'wallet'
              ? 'border-[#0B56D0] bg-blue-50/60 shadow-xs'
              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
          }`}
        >
          <Wallet className={`w-5 h-5 ${selectedMethod === 'wallet' ? 'text-[#0B56D0]' : 'text-gray-500'}`} />
          <div>
            <div className="text-xs font-bold text-gray-900">Wallets</div>
            <div className="text-[10px] text-gray-400">Paytm, Amazon</div>
          </div>
        </button>

        {/* 5. COD */}
        <button
          type="button"
          onClick={() => handleMethodChange('cod')}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
            selectedMethod === 'cod'
              ? 'border-[#0B56D0] bg-blue-50/60 shadow-xs'
              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
          }`}
        >
          <Banknote className={`w-5 h-5 ${selectedMethod === 'cod' ? 'text-[#0B56D0]' : 'text-gray-500'}`} />
          <div>
            <div className="text-xs font-bold text-gray-900">Cash on Delivery</div>
            <div className="text-[10px] text-gray-400">Pay at Doorstep</div>
          </div>
        </button>
      </div>

      {/* Method Details Form Container */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200">
        {/* UPI VIEW */}
        {selectedMethod === 'upi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Pay with Unified Payments Interface (UPI)
              </h4>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                Instant Verification
              </span>
            </div>

            {/* Popular UPI Apps */}
            <div className="grid grid-cols-4 gap-2">
              {['Google Pay', 'PhonePe', 'Paytm UPI', 'BHIM UPI'].map(app => (
                <button
                  key={app}
                  type="button"
                  onClick={() => handleUpiChange(`user.${app.toLowerCase().replace(/\s/g, '')}@okhdfcbank`)}
                  className="py-2 px-1 text-center bg-white border border-gray-200 rounded-xl hover:border-blue-400 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                >
                  {app}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enter your Virtual Payment Address (VPA / UPI ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={upiId}
                  onChange={e => handleUpiChange(e.target.value)}
                  placeholder="e.g. mobileNumber@upi or garage@okhdfcbank"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0] pr-24 font-mono"
                />
                {isUpiVerified && (
                  <span className="absolute right-3 top-2.5 text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                A payment request notification will appear on your UPI smartphone app upon checkout.
              </p>
            </div>
          </div>
        )}

        {/* CARD VIEW */}
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Enter Debit or Credit Card Information
              </h4>
              <span className="text-[11px] font-bold text-[#0B56D0] bg-blue-100/70 px-2 py-0.5 rounded">
                {getCardBrand(cardNumber)}
              </span>
            </div>

            {/* Demo Notice */}
            <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Frontend Demo:</strong> Card input is for demonstration only. 100% RBI Tokenized; no payment details are transmitted or saved.
              </span>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                maxLength={19}
                placeholder="4532 8901 2345 6789"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0]"
              />
            </div>

            {/* Cardholder, Expiry, CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value)}
                  placeholder="NAME ON CARD"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0] uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value)}
                  maxLength={5}
                  placeholder="08/28"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={e => setCardCvv(e.target.value)}
                  maxLength={4}
                  placeholder="•••"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0]"
                />
              </div>
            </div>
          </div>
        )}

        {/* NET BANKING VIEW */}
        {selectedMethod === 'netbanking' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Select Your Bank
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_BANKS.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBankName(b.name)}
                  className={`p-2.5 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${
                    bankName === b.name
                      ? 'border-[#0B56D0] bg-blue-50 text-[#0B56D0]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Other Supported Banks
              </label>
              <select
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0] cursor-pointer"
              >
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Canara Bank">Canara Bank</option>
                <option value="Union Bank of India">Union Bank of India</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
                <option value="IDBI Bank">IDBI Bank</option>
                <option value="IndusInd Bank">IndusInd Bank</option>
                <option value="Federal Bank">Federal Bank</option>
              </select>
            </div>
          </div>
        )}

        {/* WALLET VIEW */}
        {selectedMethod === 'wallet' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Select Digital Wallet
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet'].map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWalletProvider(w)}
                  className={`p-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    walletProvider === w
                      ? 'border-[#0B56D0] bg-blue-50 text-[#0B56D0]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COD VIEW */}
        {selectedMethod === 'cod' && (
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Cash or UPI on Delivery Available</span>
            </div>
            <p className="leading-relaxed text-gray-500 text-[11px]">
              You can pay via Cash or scan the courier delivery agent's UPI QR code at your doorstep upon inspecting the sealed consignment packaging.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
              ✓ No advance payment needed • 10-day return policy remains fully active.
            </div>
          </div>
        )}
      </div>

      {/* Escrow Disclaimer */}
      <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Payment held in Escrow until parts are delivered and fitment is confirmed.</span>
      </div>
    </div>
  );
};
