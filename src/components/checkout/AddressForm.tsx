import React, { useState } from 'react';
import { DeliveryAddress } from '../../types';
import { X, Check, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface AddressFormProps {
  initialAddress?: DeliveryAddress | null;
  onSave: (address: DeliveryAddress) => void;
  onCancel: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const AddressForm: React.FC<AddressFormProps> = ({
  initialAddress,
  onSave,
  onCancel
}) => {
  const [fullName, setFullName] = useState(initialAddress?.fullName || '');
  const [phone, setPhone] = useState(initialAddress?.phone || '+91 ');
  const [addressLine1, setAddressLine1] = useState(initialAddress?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(initialAddress?.addressLine2 || '');
  const [landmark, setLandmark] = useState(initialAddress?.landmark || '');
  const [city, setCity] = useState(initialAddress?.city || 'Mumbai');
  const [state, setState] = useState(initialAddress?.state || 'Maharashtra');
  const [pinCode, setPinCode] = useState(initialAddress?.pinCode || '400058');
  const [type, setType] = useState<'home' | 'work' | 'garage'>(initialAddress?.type || 'garage');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name or Garage Name is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!addressLine1.trim()) newErrors.addressLine1 = 'House, Shop, or Street Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!pinCode.trim() || !/^\d{6}$/.test(pinCode.trim())) {
      newErrors.pinCode = 'Enter a valid 6-digit postal PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newAddress: DeliveryAddress = {
      id: initialAddress?.id || `addr-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      type,
      isDefault: initialAddress?.isDefault || false
    };

    onSave(newAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h4 className="text-sm font-bold text-gray-900">
          {initialAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Address Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Address Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['garage', 'home', 'work'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer capitalize ${
                type === t
                  ? 'border-[#0B56D0] bg-blue-50/80 text-[#0B56D0] shadow-xs'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t === 'garage' ? 'Garage / Workshop' : t === 'work' ? 'Commercial Depot' : 'Residence'}
            </button>
          ))}
        </div>
      </div>

      {/* Full Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Recipient / Garage Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="e.g. Ramesh Auto Works / John Doe"
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
            } focus:outline-none focus:border-[#0B56D0]`}
          />
          {errors.fullName && (
            <span className="text-[10px] text-red-500 mt-0.5 block">{errors.fullName}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            10-Digit Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
            } focus:outline-none focus:border-[#0B56D0]`}
          />
          {errors.phone && (
            <span className="text-[10px] text-red-500 mt-0.5 block">{errors.phone}</span>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          House / Shop / Flat / Street <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={addressLine1}
          onChange={e => setAddressLine1(e.target.value)}
          placeholder="e.g. Shop 14, Galaxy Automobile Complex, SV Road"
          className={`w-full px-3 py-2 text-xs rounded-xl border ${
            errors.addressLine1 ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
          } focus:outline-none focus:border-[#0B56D0]`}
        />
        {errors.addressLine1 && (
          <span className="text-[10px] text-red-500 mt-0.5 block">{errors.addressLine1}</span>
        )}
      </div>

      {/* Address Line 2 & Landmark */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Area / Locality
          </label>
          <input
            type="text"
            value={addressLine2}
            onChange={e => setAddressLine2(e.target.value)}
            placeholder="e.g. Andheri West"
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B56D0]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Landmark (Optional)
          </label>
          <input
            type="text"
            value={landmark}
            onChange={e => setLandmark(e.target.value)}
            placeholder="e.g. Near Western Express Highway"
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B56D0]"
          />
        </div>
      </div>

      {/* City, State, PIN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="e.g. Mumbai"
            className={`w-full px-3 py-2 text-xs rounded-xl border ${
              errors.city ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
            } focus:outline-none focus:border-[#0B56D0]`}
          />
          {errors.city && (
            <span className="text-[10px] text-red-500 mt-0.5 block">{errors.city}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B56D0] bg-white cursor-pointer"
          >
            {INDIAN_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            PIN Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={6}
            value={pinCode}
            onChange={e => setPinCode(e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 400058"
            className={`w-full px-3 py-2 text-xs font-mono rounded-xl border ${
              errors.pinCode ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
            } focus:outline-none focus:border-[#0B56D0]`}
          />
          {errors.pinCode && (
            <span className="text-[10px] text-red-500 mt-0.5 block">{errors.pinCode}</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          leftIcon={<Check className="w-3.5 h-3.5" />}
        >
          Save Address
        </Button>
      </div>
    </form>
  );
};
