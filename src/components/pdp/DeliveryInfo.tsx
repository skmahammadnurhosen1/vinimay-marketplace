import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface DeliveryInfoProps {
  deliveryTime?: string;
}

export const DeliveryInfo: React.FC<DeliveryInfoProps> = ({
  deliveryTime = 'Free Express Delivery | 2-3 Business Days'
}) => {
  const { showToast } = useToast();
  const [pincode, setPincode] = useState('700001');
  const [checkedPincode, setCheckedPincode] = useState('700001');
  const [isVerified, setIsVerified] = useState(true);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      showToast('Invalid PIN Code', 'Please enter a valid 6-digit Indian PIN code.', 'warning');
      return;
    }
    setCheckedPincode(pincode);
    setIsVerified(true);
    showToast(
      'Delivery Available',
      `Fast courier dispatch available for PIN ${pincode} (2-3 Business Days).`,
      'success'
    );
  };

  return (
    <div className="space-y-2.5 py-3 border-y border-gray-100 text-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <Truck className="w-4 h-4 text-[#0B56D0] shrink-0" />
          <span>{deliveryTime}</span>
        </div>
        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
          Prepaid & COD Available
        </span>
      </div>

      {/* Pincode & City Locator */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <div className="flex items-center gap-1.5 text-gray-500 font-medium shrink-0">
          <MapPin className="w-3.5 h-3.5 text-[#0B56D0]" />
          <span>Deliver to:</span>
        </div>

        <form onSubmit={handleCheckPincode} className="flex items-center gap-1.5 max-w-xs">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="6-digit PIN"
            className="w-28 px-2.5 py-1 text-xs border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-blue-600 font-medium"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Check
          </button>
        </form>

        {isVerified && (
          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Kolkata & Metro Hubs: Delivery by Thursday</span>
          </span>
        )}
      </div>
    </div>
  );
};
