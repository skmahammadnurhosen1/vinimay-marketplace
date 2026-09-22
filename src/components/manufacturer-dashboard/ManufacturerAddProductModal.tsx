import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Plus,
  Trash2,
  Car,
  Layers,
  Building2,
} from 'lucide-react';
import {
  ManufacturerProduct,
  VehicleCompatibilitySpec,
  ManufacturerBrandProfile,
} from '../../types/manufacturer';
import { VEHICLE_MANUFACTURERS } from '../../data/vehicles';

interface ManufacturerAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: ManufacturerBrandProfile;
  productToEdit?: ManufacturerProduct | null;
  onSaveProduct: (productData: any) => void;
}

export const ManufacturerAddProductModal: React.FC<ManufacturerAddProductModalProps> = ({
  isOpen,
  onClose,
  brand,
  productToEdit,
  onSaveProduct,
}) => {
  const [title, setTitle] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [oemNumber, setOemNumber] = useState('');
  const [category, setCategory] = useState<'Brake' | 'Clutch' | 'Suspension' | 'Gearbox/Transmission' | 'Differential/Axle'>('Brake');
  const [subCategory, setSubCategory] = useState('Brake Pads');
  const [productType, setProductType] = useState<'Genuine' | 'OEM' | 'Aftermarket'>('Genuine');
  const [price, setPrice] = useState(1850);
  const [mrp, setMrp] = useState(3200);
  const [currentStock, setCurrentStock] = useState(250);
  const [lowStockThreshold, setLowStockThreshold] = useState(50);
  const [warehouseLocation, setWarehouseLocation] = useState('Bengaluru Central Hub (Bin A-04)');
  const [warranty, setWarranty] = useState('12 Months / 20,000 km Warranty');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(['/assets/prod_brakepad.jpg']);

  // Vehicle Compatibility Builder State (7-tier hierarchy)
  const [compatList, setCompatList] = useState<VehicleCompatibilitySpec[]>([
    {
      vehicleType: 'commercial',
      manufacturer: 'Tata',
      model: 'Ace',
      yearRange: '2018 - 2024',
      fuelType: 'Diesel',
      engine: '700cc Dicor',
      variant: 'Standard',
    },
  ]);

  // Compatibility selector state
  const [selVehicleType, setSelVehicleType] = useState<'commercial' | 'passenger'>('commercial');
  const [selMake, setSelMake] = useState('Tata');
  const [selModel, setSelModel] = useState('Ace');
  const [selYear, setSelYear] = useState('2022');
  const [selFuel, setSelFuel] = useState('Diesel');
  const [selEngine, setSelEngine] = useState('700cc Dicor');
  const [selVariant, setSelVariant] = useState('Standard');

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setPartNumber(productToEdit.partNumber);
      setOemNumber(productToEdit.oemNumber);
      setCategory(productToEdit.category);
      setSubCategory(productToEdit.subCategory);
      setProductType(productToEdit.productType);
      setPrice(productToEdit.price);
      setMrp(productToEdit.mrp);
      setCurrentStock(productToEdit.stock.current);
      setLowStockThreshold(productToEdit.stock.lowStockThreshold);
      setWarehouseLocation(productToEdit.stock.warehouseLocation);
      setWarranty(productToEdit.warranty);
      setDescription(productToEdit.description);
      setImages(productToEdit.images);
      setCompatList(productToEdit.compatibility);
    } else {
      setTitle('');
      setPartNumber('');
      setOemNumber('');
      setCategory('Brake');
      setSubCategory('Brake Discs');
      setProductType('Genuine');
      setPrice(2400);
      setMrp(3800);
      setCurrentStock(300);
      setLowStockThreshold(50);
      setWarranty('18 Months / 30,000 km Warranty');
      setDescription('');
    }
  }, [productToEdit, isOpen]);

  // Derived models from vehicle data
  const availableMakes = VEHICLE_MANUFACTURERS.filter(m => m.category === selVehicleType);
  const currentMakeObj = availableMakes.find(m => m.name === selMake) || availableMakes[0];
  const availableModels = currentMakeObj ? currentMakeObj.models : [];
  const currentModelObj = availableModels.find(m => m.name === selModel) || availableModels[0];

  const handleAddCompatibility = () => {
    const newSpec: VehicleCompatibilitySpec = {
      vehicleType: selVehicleType,
      manufacturer: currentMakeObj ? currentMakeObj.name : selMake,
      model: currentModelObj ? currentModelObj.name : selModel,
      yearRange: `${selYear} - Present`,
      fuelType: selFuel,
      engine: selEngine,
      variant: selVariant,
    };

    setCompatList([...compatList, newSpec]);
  };

  const handleRemoveCompat = (index: number) => {
    setCompatList(compatList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      title,
      partNumber,
      oemNumber,
      category,
      subCategory,
      productType,
      price: Number(price),
      mrp: Number(mrp),
      stock: {
        current: Number(currentStock),
        reserved: 0,
        available: Number(currentStock),
        lowStockThreshold: Number(lowStockThreshold),
        warehouseLocation,
      },
      warranty,
      status: 'Active',
      images: images.length > 0 ? images : ['/assets/prod_brakepad.jpg'],
      description: description || `${brand.brandName} certified precision ${category.toLowerCase()} component.`,
      features: ['OEM specification certified', 'Anti-wear coating', 'Precision engineered tolerances'],
      specifications: { 'OE Reference': oemNumber, 'Component Category': category, 'Brand Standard': brand.shortName },
      compatibility: compatList,
    };

    onSaveProduct(productPayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {productToEdit ? 'Edit Part Specification' : 'Add New Automotive Part Listing'}
              </h2>
              <p className="text-xs text-gray-500">
                Authorized Brand: <strong className="text-[#0284C7]">{brand.brandName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 border border-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-gray-700">
          {/* 1. Basic Part Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0284C7]" />
              <span>1. Part Identification & Categorization</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Product Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ventilated High-Carbon Disc Rotor (Front Axle)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Manufacturer Part # (MPN):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09.8968.11"
                  value={partNumber}
                  onChange={e => setPartNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">OEM Cross-Reference #:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 435120K080"
                  value={oemNumber}
                  onChange={e => setOemNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Assembly Category (5 Core):</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="Brake">Brake</option>
                  <option value="Clutch">Clutch</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Gearbox/Transmission">Gearbox/Transmission</option>
                  <option value="Differential/Axle">Differential/Axle</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Quality Tier:</label>
                <select
                  value={productType}
                  onChange={e => setProductType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="Genuine">Genuine OE</option>
                  <option value="OEM">OEM Certified Partner</option>
                  <option value="Aftermarket">Aftermarket High Quality</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Commercial Pricing & Inventory */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>2. Commercial Pricing & Initial Stock</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Wholesale Trade Price (₹):</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">MRP (₹):</label>
                <input
                  type="number"
                  required
                  value={mrp}
                  onChange={e => setMrp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Initial Physical Stock:</label>
                <input
                  type="number"
                  required
                  value={currentStock}
                  onChange={e => setCurrentStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Low-Stock Alert Level:</label>
                <input
                  type="number"
                  required
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Warehouse Bin / Location:</label>
                <input
                  type="text"
                  value={warehouseLocation}
                  onChange={e => setWarehouseLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Warranty Period Terms:</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={e => setWarranty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>
          </div>

          {/* 3. 7-Tier Vehicle Compatibility Matrix */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-purple-600" />
                <span>3. Blueprint Vehicle Compatibility Hierarchy</span>
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">
                Type → Make → Model → Year → Fuel → Engine → Variant
              </span>
            </div>

            {/* Compatibility Selector Row */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">1. Type</label>
                  <select
                    value={selVehicleType}
                    onChange={e => {
                      const vt = e.target.value as 'commercial' | 'passenger';
                      setSelVehicleType(vt);
                      const makes = VEHICLE_MANUFACTURERS.filter(m => m.category === vt);
                      if (makes.length > 0) {
                        setSelMake(makes[0].name);
                        if (makes[0].models.length > 0) setSelModel(makes[0].models[0].name);
                      }
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[11px] focus:outline-none"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="passenger">Passenger</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">2. Make</label>
                  <select
                    value={selMake}
                    onChange={e => {
                      setSelMake(e.target.value);
                      const makeObj = availableMakes.find(m => m.name === e.target.value);
                      if (makeObj && makeObj.models.length > 0) setSelModel(makeObj.models[0].name);
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[11px] focus:outline-none"
                  >
                    {availableMakes.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">3. Model</label>
                  <select
                    value={selModel}
                    onChange={e => setSelModel(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[11px] focus:outline-none"
                  >
                    {availableModels.map(mod => (
                      <option key={mod.id} value={mod.name}>{mod.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">4. Year</label>
                  <select
                    value={selYear}
                    onChange={e => setSelYear(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[11px] focus:outline-none"
                  >
                    {(currentModelObj?.years || [2024, 2023, 2022, 2021, 2020, 2019, 2018]).map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">5. Fuel</label>
                  <select
                    value={selFuel}
                    onChange={e => setSelFuel(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[11px] focus:outline-none"
                  >
                    {(currentModelObj?.fuelTypes || ['Diesel', 'Petrol', 'CNG']).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">6. Engine</label>
                  <select
                    value={selEngine}
                    onChange={e => setSelEngine(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[11px] focus:outline-none"
                  >
                    {(currentModelObj?.engines || ['700cc Dicor', '1.5L Turbo', '2.2L mHawk']).map(eng => (
                      <option key={eng} value={eng}>{eng}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">7. Variant</label>
                  <select
                    value={selVariant}
                    onChange={e => setSelVariant(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[11px] focus:outline-none"
                  >
                    {(currentModelObj?.variants || ['Standard', 'Plus', 'High Deck']).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCompatibility}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Compatibility Fitment</span>
                </button>
              </div>
            </div>

            {/* List of Attached Vehicles */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {compatList.map((c, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-white border border-gray-200 flex items-center justify-between text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{c.manufacturer} {c.model}</span>
                    <span className="text-gray-500 font-mono text-[11px]">• {c.yearRange}</span>
                    <span className="text-[#0284C7] text-[11px]">• {c.engine} ({c.fuelType})</span>
                    <span className="text-gray-400 text-[10px]">[{c.variant}]</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCompat(i)}
                    className="p-1 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove fitment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs cursor-pointer"
            >
              {productToEdit ? 'Save Changes' : 'Publish Part Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
