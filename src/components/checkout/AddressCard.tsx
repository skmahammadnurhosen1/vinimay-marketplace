import React from 'react';
import { DeliveryAddress } from '../../types';
import { Home, Briefcase, Wrench, CheckCircle2, Phone, MapPin } from 'lucide-react';

interface AddressCardProps {
  address: DeliveryAddress;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit
}) => {
  const getIcon = () => {
    switch (address.type) {
      case 'garage':
        return <Wrench className="w-3.5 h-3.5 text-blue-600" />;
      case 'work':
        return <Briefcase className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Home className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getBadgeLabel = () => {
    switch (address.type) {
      case 'garage':
        return 'Garage / Workshop';
      case 'work':
        return 'Commercial / Yard';
      default:
        return 'Home';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-[#0B56D0] bg-blue-50/30 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Custom Radio check */}
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              isSelected ? 'border-[#0B56D0] bg-[#0B56D0]' : 'border-gray-300 bg-white'
            }`}
          >
            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>

          <span className="text-xs font-bold text-gray-950">{address.fullName}</span>

          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
            {getIcon()}
            {getBadgeLabel()}
          </span>

          {address.isDefault && (
            <span className="text-[10px] font-bold text-[#0B56D0] bg-blue-100/70 px-1.5 py-0.5 rounded">
              Default
            </span>
          )}
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-xs font-bold text-[#0B56D0] hover:underline cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>

      <div className="mt-2 pl-7 space-y-1 text-xs text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-800">
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </p>
        {address.landmark && (
          <p className="text-gray-500 text-[11px]">Landmark: {address.landmark}</p>
        )}
        <p className="flex items-center gap-1 text-gray-700 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {address.city}, {address.state} — <span className="font-mono text-gray-900">{address.pinCode}</span>
        </p>
        <p className="flex items-center gap-1 text-gray-600 pt-0.5">
          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {address.phone}
        </p>
      </div>
    </div>
  );
};
