import React from 'react';
import { ShoppingBag, ArrowRight, Car, Wrench, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useVehicle } from '../../context/VehicleContext';

interface EmptyCartProps {
  onContinueShopping: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping }) => {
  const { loadDemoScenario } = useCart();
  const { setIsSelectorModalOpen } = useVehicle();

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-8 sm:p-14 text-center max-w-2xl mx-auto my-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Automotive Cart Illustration */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-50 animate-ping opacity-25" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#071530] to-[#0B56D0] text-[#FFBA00] flex items-center justify-center shadow-xl">
          <ShoppingBag className="w-11 h-11" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#FFBA00] text-gray-950 flex items-center justify-center shadow-md font-bold">
          <Wrench className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Your Spare Parts Cart is Empty
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any automotive parts yet. Select your vehicle to browse guaranteed-fit brakes, clutches, suspension kits, and engine spares.
        </p>
      </div>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="gold"
          size="lg"
          onClick={onContinueShopping}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-md"
        >
          Browse Spare Parts
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => setIsSelectorModalOpen(true)}
          leftIcon={<Car className="w-4 h-4" />}
          className="w-full sm:w-auto border-gray-300"
        >
          Select Your Vehicle
        </Button>
      </div>

      {/* Demo Scenario Quick-Loader Box */}
      <div className="mt-8 pt-6 border-t border-gray-100 bg-gray-50/70 rounded-2xl p-4 sm:p-5 text-left">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Interactive Demo Scenarios
            </h4>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Frontend Only</span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Instantly populate the cart with multi-vendor automotive spare parts for testing:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadDemoScenario('multi-seller')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            ⚡ Load Multi-Seller Cart (3 Sellers)
          </button>
          <button
            type="button"
            onClick={() => loadDemoScenario('compatibility-warning')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors border border-amber-300 cursor-pointer"
          >
            ⚠️ Incompatible Part Warning Demo
          </button>
          <button
            type="button"
            onClick={() => loadDemoScenario('low-stock')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            📦 Low Stock Cart Demo
          </button>
        </div>
      </div>

      {/* Assurance footer */}
      <div className="flex items-center justify-center gap-6 pt-3 text-xs text-gray-400 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          100% Genuine Auto Spares
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5">
          <Car className="w-4 h-4 text-[#0B56D0]" />
          Zero Wrong Part Risk
        </span>
      </div>
    </div>
  );
};
