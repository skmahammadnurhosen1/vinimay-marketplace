import React, { useState } from 'react';
import { DeliveryAddress } from '../../types';
import { DEMO_ADDRESSES } from '../../data/mockAddresses';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface AddressSectionProps {
  selectedAddress: DeliveryAddress;
  onSelectAddress: (address: DeliveryAddress) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  selectedAddress,
  onSelectAddress
}) => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(DEMO_ADDRESSES);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  const handleSaveAddress = (address: DeliveryAddress) => {
    if (editingAddress) {
      setAddresses(prev =>
        prev.map(a => (a.id === address.id ? address : a))
      );
      setEditingAddress(null);
    } else {
      setAddresses(prev => [address, ...prev]);
      setIsAddingNew(false);
    }
    onSelectAddress(address);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Delivery Address
            </h3>
            <span className="text-xs text-gray-500">
              Select where the auto parts should be delivered (Workshop / Residence)
            </span>
          </div>
        </div>

        {!isAddingNew && !editingAddress && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-bold shrink-0"
          >
            Add Address
          </Button>
        )}
      </div>

      {isAddingNew || editingAddress ? (
        <AddressForm
          initialAddress={editingAddress}
          onSave={handleSaveAddress}
          onCancel={() => {
            setIsAddingNew(false);
            setEditingAddress(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress.id === address.id}
              onSelect={() => onSelectAddress(address)}
              onEdit={() => setEditingAddress(address)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
