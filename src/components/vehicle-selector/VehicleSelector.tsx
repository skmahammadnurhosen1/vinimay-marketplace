import React, { useState } from 'react';
import { Car, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { useVehicle } from '../../context/VehicleContext';
import { useToast } from '../../context/ToastContext';
import { VEHICLE_MANUFACTURERS } from '../../data/vehicles';
import { VehicleCategoryType, SelectedVehicle } from '../../types';

interface VehicleSelectorProps {
  onVehicleApplied?: () => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ onVehicleApplied }) => {
  const { setVehicle } = useVehicle();
  const { showToast } = useToast();

  const [vehicleType, setVehicleType] = useState<VehicleCategoryType>('commercial');
  const [selectedMake, setSelectedMake] = useState<string>('tata-cv');
  const [selectedModel, setSelectedModel] = useState<string>('Ace');
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [selectedFuel, setSelectedFuel] = useState<string>('Diesel');
  const [selectedEngine, setSelectedEngine] = useState<string>('700cc');
  const [selectedVariant, setSelectedVariant] = useState<string>('Standard');

  const currentManufacturers = VEHICLE_MANUFACTURERS.filter(m => m.category === vehicleType);
  const currentMakeObj = currentManufacturers.find(m => m.id === selectedMake) || currentManufacturers[0];
  const currentModels = currentMakeObj ? currentMakeObj.models : [];
  const currentModelObj = currentModels.find(m => m.name === selectedModel) || currentModels[0];

  const availableYears = currentModelObj ? currentModelObj.years : [2022, 2023, 2024];
  const availableFuels = currentModelObj ? currentModelObj.fuelTypes : ['Diesel', 'Petrol'];
  const availableEngines = currentModelObj ? currentModelObj.engines : ['700cc'];
  const availableVariants = currentModelObj ? currentModelObj.variants : ['Standard'];

  const handleTypeChange = (newType: VehicleCategoryType) => {
    setVehicleType(newType);
    const makes = VEHICLE_MANUFACTURERS.filter(m => m.category === newType);
    if (makes.length > 0) {
      const firstMake = makes[0];
      setSelectedMake(firstMake.id);
      if (firstMake.models.length > 0) {
        const firstModel = firstMake.models[0];
        setSelectedModel(firstModel.name);
        setSelectedYear(firstModel.years[0] || 2022);
        setSelectedFuel(firstModel.fuelTypes[0] || 'Diesel');
        setSelectedEngine(firstModel.engines[0] || '700cc');
        setSelectedVariant(firstModel.variants[0] || 'Standard');
      }
    }
  };

  const handleMakeChange = (makeId: string) => {
    setSelectedMake(makeId);
    const make = currentManufacturers.find(m => m.id === makeId);
    if (make && make.models.length > 0) {
      const firstModel = make.models[0];
      setSelectedModel(firstModel.name);
      setSelectedYear(firstModel.years[0] || 2022);
      setSelectedFuel(firstModel.fuelTypes[0] || 'Diesel');
      setSelectedEngine(firstModel.engines[0] || '700cc');
      setSelectedVariant(firstModel.variants[0] || 'Standard');
    }
  };

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    const model = currentModels.find(m => m.name === modelName);
    if (model) {
      setSelectedYear(model.years[0] || 2022);
      setSelectedFuel(model.fuelTypes[0] || 'Diesel');
      setSelectedEngine(model.engines[0] || '700cc');
      setSelectedVariant(model.variants[0] || 'Standard');
    }
  };

  const handleApplyVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: SelectedVehicle = {
      vehicleType,
      manufacturer: currentMakeObj ? currentMakeObj.name : 'Tata',
      model: selectedModel,
      year: selectedYear,
      fuelType: selectedFuel,
      engine: selectedEngine,
      variant: selectedVariant
    };

    setVehicle(newVehicle);
    showToast(
      'Compatibility Filter Active',
      `Showing guaranteed compatible parts for ${newVehicle.year} ${newVehicle.manufacturer} ${newVehicle.model}.`,
      'success'
    );

    if (onVehicleApplied) {
      onVehicleApplied();
    }
  };

  return (
    <section id="vehicle-selector" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
        {/* Top title with blue car icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#0B56D0] text-white flex items-center justify-center shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-gray-900 uppercase">
              SELECT YOUR VEHICLE
            </h3>
            <p className="text-xs text-gray-500">Find parts that fit your vehicle</p>
          </div>
        </div>

        {/* Form Controls Row */}
        <form onSubmit={handleApplyVehicle}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 items-end">
            {/* 1. Vehicle Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-500">Vehicle Type</label>
              <div className="relative">
                <select
                  value={vehicleType}
                  onChange={e => handleTypeChange(e.target.value as VehicleCategoryType)}
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-2 appearance-none pr-6 font-medium focus:border-blue-500 focus:outline-none"
                >
                  <option value="commercial">Commercial Vehicle</option>
                  <option value="passenger">Passenger Vehicle</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 2. Manufacturer */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-500">Manufacturer</label>
              <div className="relative">
                <select
                  value={selectedMake}
                  onChange={e => handleMakeChange(e.target.value)}
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-2 appearance-none pr-6 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {currentManufacturers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 3. Model */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-500">Model</label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={e => handleModelChange(e.target.value)}
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-2 appearance-none pr-6 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {currentModels.map(model => (
                    <option key={model.id} value={model.name}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 4. Year */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-500">Year</label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-2 appearance-none pr-6 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {availableYears.map(yr => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 5. Fuel Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-500">Fuel Type</label>
              <div className="relative">
                <select
                  value={selectedFuel}
                  onChange={e => setSelectedFuel(e.target.value)}
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-2 appearance-none pr-6 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {availableFuels.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 6. Engine */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-500">Engine</label>
              <div className="relative">
                <select
                  value={selectedEngine}
                  onChange={e => setSelectedEngine(e.target.value)}
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-2 appearance-none pr-6 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {availableEngines.map(eng => (
                    <option key={eng} value={eng}>
                      {eng}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 7. Variant */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-500">Variant</label>
              <div className="relative">
                <select
                  value={selectedVariant}
                  onChange={e => setSelectedVariant(e.target.value)}
                  className="w-full text-xs text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-2 appearance-none pr-6 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {availableVariants.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Button + Subtitle */}
            <div className="space-y-1 col-span-2 sm:col-span-4 lg:col-span-1">
              <button
                type="submit"
                className="w-full py-2.5 px-3 bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Find Compatible Parts</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <div className="flex items-center gap-1 text-[11px] text-gray-600">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Only compatible parts will be shown</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
