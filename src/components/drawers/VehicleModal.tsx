import React from 'react';
import { Modal } from '../common/Modal';
import { VehicleSelector } from '../vehicle-selector/VehicleSelector';
import { useVehicle } from '../../context/VehicleContext';

export const VehicleModal: React.FC = () => {
  const { isSelectorModalOpen, setIsSelectorModalOpen } = useVehicle();

  if (!isSelectorModalOpen) return null;

  return (
    <Modal
      isOpen={isSelectorModalOpen}
      onClose={() => setIsSelectorModalOpen(false)}
      title="Select Your Vehicle"
      subtitle="Ensure 100% direct fitment for passenger cars and commercial utility fleets."
      maxWidth="4xl"
    >
      <div className="-mt-6 -mx-6 -mb-6">
        <VehicleSelector onVehicleApplied={() => setIsSelectorModalOpen(false)} />
      </div>
    </Modal>
  );
};
