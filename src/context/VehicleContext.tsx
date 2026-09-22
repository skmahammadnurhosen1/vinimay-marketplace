import React, { createContext, useContext, useState } from 'react';
import { SelectedVehicle, Product } from '../types';

interface VehicleContextType {
  selectedVehicle: SelectedVehicle | null;
  setVehicle: (vehicle: SelectedVehicle) => void;
  clearVehicle: () => void;
  isVehicleCompatible: (product: Product) => boolean;
  isSelectorModalOpen: boolean;
  setIsSelectorModalOpen: (open: boolean) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-seed with a realistic commercial vehicle (Tata Ace Gold) or passenger vehicle for instant preview
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>({
    vehicleType: 'commercial',
    manufacturer: 'Tata Motors (Commercial)',
    model: 'Ace Gold',
    year: 2022,
    fuelType: 'Diesel',
    engine: '700cc Dicor',
    variant: 'Standard'
  });

  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);

  const setVehicle = (vehicle: SelectedVehicle) => {
    setSelectedVehicle(vehicle);
  };

  const clearVehicle = () => {
    setSelectedVehicle(null);
  };

  const isVehicleCompatible = (product: Product): boolean => {
    if (!selectedVehicle) return false;
    return product.compatibility.some(c => {
      const matchMake = c.manufacturer.toLowerCase().includes(selectedVehicle.manufacturer.toLowerCase()) ||
                        selectedVehicle.manufacturer.toLowerCase().includes(c.manufacturer.toLowerCase());
      const matchModel = c.model.toLowerCase().includes(selectedVehicle.model.toLowerCase()) ||
                         selectedVehicle.model.toLowerCase().includes(c.model.toLowerCase());
      return matchMake && matchModel;
    });
  };

  return (
    <VehicleContext.Provider
      value={{
        selectedVehicle,
        setVehicle,
        clearVehicle,
        isVehicleCompatible,
        isSelectorModalOpen,
        setIsSelectorModalOpen
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
