import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Car,
  Image as ImageIcon,
  Shield,
  Eye,
  Info,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { SellerProduct, SellerNavTab } from '../../types/seller';
import { PartType, VehicleCompatibility } from '../../types';
import { useToast } from '../../context/ToastContext';

interface SellerAddProductPageProps {
  onSelectTab: (tab: SellerNavTab) => void;
  onSaveProduct: (product: Omit<SellerProduct, 'id' | 'createdAt'>) => void;
  onPreviewProduct: (product: SellerProduct) => void;
}

export const SellerAddProductPage: React.FC<SellerAddProductPageProps> = ({
  onSelectTab,
  onSaveProduct,
  onPreviewProduct
}) => {
  const { showToast } = useToast();

  // Section 1: Basic Info
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Bosch');
  const [manufacturer, setManufacturer] = useState('Bosch Automotive Aftermarket');
  const [category, setCategory] = useState('brake-system');
  const [subCategory, setSubCategory] = useState('Brake Pads');
  const [partType, setPartType] = useState<PartType>('OEM');
  const [description, setDescription] = useState('');
  const [authDocName, setAuthDocName] = useState<string | null>(null);

  // Section 2: Identification
  const [partNumber, setPartNumber] = useState('');
  const [oemNumber, setOemNumber] = useState('');

  // Section 3: Compatibility List
  const [compatibilityList, setCompatibilityList] = useState<VehicleCompatibility[]>([
    {
      manufacturer: 'Tata',
      model: 'Ace Gold',
      yearRange: '2018-2026',
      fuelType: 'Diesel',
      engine: '700cc Dicor',
      variant: 'Standard OEM'
    }
  ]);

  // Section 4: Pricing & Tax
  const [mrp, setMrp] = useState<number>(2499);
  const [price, setPrice] = useState<number>(1849);

  // Section 5: Inventory
  const [stockCount, setStockCount] = useState<number>(50);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);

  // Section 6: Warranty & Returns
  const [warranty, setWarranty] = useState('12 Months / 20,000 KM Manufacturer Warranty');
  const [returnDays, setReturnDays] = useState(10);

  // Section 7: Media & Images
  const [images, setImages] = useState<string[]>([
    '/assets/cat_brake.jpg',
    '/assets/cat_suspension.jpg'
  ]);
  const [primaryImageIdx, setPrimaryImageIdx] = useState(0);

  // Auto discount
  const discountPercentage = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // New compatibility builder state
  const [newMake, setNewMake] = useState('Mahindra');
  const [newModel, setNewModel] = useState('Bolero Maxi Truck');
  const [newYears, setNewYears] = useState('2019-2026');
  const [newFuel, setNewFuel] = useState('Diesel');
  const [newEngine, setNewEngine] = useState('m2DiCR 2.5L');

  const handleAddCompatibility = () => {
    if (!newMake.trim() || !newModel.trim()) return;
    setCompatibilityList(prev => [
      ...prev,
      {
        manufacturer: newMake,
        model: newModel,
        yearRange: newYears,
        fuelType: newFuel,
        engine: newEngine,
        variant: 'Standard'
      }
    ]);
    showToast('Fitment Added', `Added ${newMake} ${newModel} to compatibility list.`, 'success');
  };

  const handleRemoveCompatibility = (idx: number) => {
    setCompatibilityList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleImageAddMock = () => {
    const defaultImages = [
      '/assets/cat_spark.jpg',
      '/assets/cat_engine.jpg',
      '/assets/prod_bearing.jpg',
      '/assets/cat_airfilter.jpg'
    ];
    const nextImg = defaultImages[images.length % defaultImages.length];
    setImages(prev => [...prev, nextImg]);
    showToast('Photo Uploaded', 'Product image added to gallery preview.', 'info');
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length <= 1) {
      showToast('Minimum Images', 'At least 1 product image is required.', 'warning');
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== idx));
    if (primaryImageIdx >= idx && primaryImageIdx > 0) {
      setPrimaryImageIdx(primaryImageIdx - 1);
    }
  };

  const handleSubmit = (status: 'active' | 'draft') => {
    if (!title.trim()) {
      showToast('Validation Error', 'Product title is required.', 'error');
      return;
    }
    if (!partNumber.trim()) {
      showToast('Validation Error', 'Manufacturer Part Number is mandatory.', 'error');
      return;
    }
    if (price <= 0 || mrp <= 0) {
      showToast('Validation Error', 'Price and MRP must be greater than zero.', 'error');
      return;
    }
    if (compatibilityList.length === 0) {
      showToast('Fitment Required', 'Please add at least one compatible vehicle model.', 'error');
      return;
    }

    const newProduct: Omit<SellerProduct, 'id' | 'createdAt'> = {
      title,
      brand,
      manufacturer,
      partNumber,
      oemNumber,
      category,
      subCategory,
      partType,
      price,
      mrp,
      discountPercentage,
      stockCount,
      lowStockThreshold,
      status,
      images,
      description:
        description ||
        `High-grade ${partType} specification ${title} designed for maximum durability and thermal efficiency.`,
      features: [
        'OEM precision tolerances for zero fitment vibration',
        'Anti-corrosion electrophoretic coating',
        'ISO/TS 16949 compliant manufacturing'
      ],
      specifications: {
        'Part Classification': `${partType} Grade`,
        Brand: brand,
        'Part Number': partNumber,
        'OEM Cross Ref': oemNumber || 'Direct Replacement'
      },
      compatibility: compatibilityList,
      warranty,
      returnDays
    };

    onSaveProduct(newProduct);
    showToast(
      'Product Saved',
      `"${title}" has been added to your catalog as ${status.toUpperCase()}.`,
      'success'
    );
    onSelectTab('products');
  };

  const handleTriggerPreview = () => {
    const previewMock: SellerProduct = {
      id: 'preview-temp',
      title: title || 'Bosch Heavy-Duty Commercial Spare Part (Preview)',
      brand,
      manufacturer,
      partNumber: partNumber || '0986-PART-001',
      oemNumber: oemNumber || 'OEM-REF-992',
      category,
      subCategory,
      partType,
      price,
      mrp,
      discountPercentage,
      stockCount,
      lowStockThreshold,
      status: 'draft',
      images,
      description: description || 'High-grade precision engineered automotive spare part.',
      features: ['Direct OEM Replacement', 'Rigorous factory testing'],
      specifications: { Brand: brand, 'Part Number': partNumber },
      compatibility: compatibilityList,
      warranty,
      returnDays,
      createdAt: 'Just now'
    };
    onPreviewProduct(previewMock);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onSelectTab('products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerPreview}
            className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Listing</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="px-3.5 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('active')}
            className="px-4 py-1.5 bg-[#16181D] hover:bg-stone-800 text-[#E8D5A3] text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Publish Part
          </button>
        </div>
      </div>

      {/* SECTION 1: BASIC PRODUCT INFO */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            <span>Basic Product Information</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Title, brand, quality classification, and catalog categorization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-stone-700">Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Bosch QuietCast Premium Front Ceramic Brake Pad Set"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C59B27] font-medium text-stone-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Brand Name</label>
            <input
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder="e.g. Bosch, Valeo, TVS"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C59B27] text-stone-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Manufacturer</label>
            <input
              type="text"
              value={manufacturer}
              onChange={e => setManufacturer(e.target.value)}
              placeholder="e.g. Bosch Automotive India Ltd"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C59B27] text-stone-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C59B27] text-stone-900 font-medium cursor-pointer"
            >
              <option value="brake-system">Brake System</option>
              <option value="ignition-system">Ignition System</option>
              <option value="fuel-system">Fuel System</option>
              <option value="electrical-system">Electrical System</option>
              <option value="engine-components">Engine Components</option>
              <option value="suspension-steering">Suspension & Steering</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Subcategory</label>
            <input
              type="text"
              value={subCategory}
              onChange={e => setSubCategory(e.target.value)}
              placeholder="e.g. Brake Pads, Calipers"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C59B27] text-stone-900 font-medium"
            />
          </div>

          {/* Product Quality Tier */}
          <div className="sm:col-span-2 space-y-2 pt-1">
            <label className="font-bold text-stone-700 block">
              Product Quality Tier *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Genuine', 'OEM', 'Aftermarket'] as PartType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPartType(type)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    partType === type
                      ? 'border-[#C59B27] bg-amber-50/60 font-bold text-stone-950 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <span className="block text-xs font-bold">{type}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {type === 'Genuine'
                      ? 'Factory OE Brand'
                      : type === 'OEM'
                      ? 'Tier-1 Supplier'
                      : 'Certified Aftermarket'}
                  </span>
                </button>
              ))}
            </div>

            {/* Authorization Document Upload (Placeholder for Genuine/OEM) */}
            {(partType === 'Genuine' || partType === 'OEM') && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#C59B27]" />
                    <span className="font-semibold text-stone-900">
                      Brand Authorization / Invoice Proof (Mandatory for {partType})
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Verification Pending
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthDocName('Bosch_Authorised_Distributor_Certificate.pdf');
                      showToast('Document Attached', 'Authorization certificate attached for review.', 'info');
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold hover:bg-stone-50 cursor-pointer"
                  >
                    {authDocName ? 'Change Attached File' : 'Attach Brand Authorization PDF'}
                  </button>
                  {authDocName && (
                    <span className="font-mono text-[11px] text-stone-600 font-semibold truncate">
                      {authDocName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-stone-700">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Engineering specifications, metallurgy, thermal ratings, and road-use characteristics..."
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C59B27] text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: PRODUCT IDENTIFICATION */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>Product Identification & Part Codes</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Crucial for direct OEM lookup, catalog cross-referencing, and anti-counterfeit checks
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">Manufacturer Part Number (MPN) *</label>
            <input
              type="text"
              value={partNumber}
              onChange={e => setPartNumber(e.target.value)}
              placeholder="e.g. 0986AB1234"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-[#C59B27] text-stone-900 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">OEM Cross-Reference Number</label>
            <input
              type="text"
              value={oemNumber}
              onChange={e => setOemNumber(e.target.value)}
              placeholder="e.g. 2813-4210-01 / FR7DC+"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-[#C59B27] text-stone-900 font-bold"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: 7-LEVEL VEHICLE COMPATIBILITY */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            <span>7-Level Vehicle Fitment & Compatibility</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Zero-wrong-fit guarantee relies on accurate Make, Model, Year, Fuel, Engine, and Variant mapping
          </p>
        </div>

        {/* Existing Compatibility Badges */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block">
            Confirmed Vehicle Models ({compatibilityList.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {compatibilityList.map((c, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-950 block">
                    {c.manufacturer} {c.model}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {c.yearRange} • {c.fuelType} • {c.engine}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCompatibility(idx)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove vehicle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Add Vehicle Row */}
        <div className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200 space-y-3">
          <span className="text-xs font-bold text-stone-800 block">
            Add Another Compatible Vehicle
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <input
              type="text"
              value={newMake}
              onChange={e => setNewMake(e.target.value)}
              placeholder="Make (e.g. Tata)"
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900"
            />
            <input
              type="text"
              value={newModel}
              onChange={e => setNewModel(e.target.value)}
              placeholder="Model (e.g. 407 Gold)"
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900"
            />
            <input
              type="text"
              value={newYears}
              onChange={e => setNewYears(e.target.value)}
              placeholder="Years (2018-2026)"
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 font-mono"
            />
            <input
              type="text"
              value={newFuel}
              onChange={e => setNewFuel(e.target.value)}
              placeholder="Fuel (Diesel/Petrol)"
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900"
            />
            <button
              type="button"
              onClick={handleAddCompatibility}
              className="col-span-2 sm:col-span-1 px-3 py-1.5 bg-[#16181D] hover:bg-stone-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: PRICING, TAX & INVENTORY */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
              4
            </span>
            <span>Pricing, Tax & Inventory Quantities</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            All prices are in Indian Rupees (INR) and inclusive of 18% GST
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">MRP (₹) *</label>
            <input
              type="number"
              value={mrp}
              onChange={e => setMrp(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono text-stone-900 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Selling Price (₹) *</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono text-stone-900 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Calculated Discount</label>
            <div className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold text-emerald-700">
              {discountPercentage}% OFF
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">GST Rate</label>
            <div className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-600 font-medium">
              18% GST (Included)
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-stone-700">Initial Stock Quantity *</label>
            <input
              type="number"
              value={stockCount}
              onChange={e => setStockCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono text-stone-900 font-bold"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-stone-700">Low Stock Alert Threshold</label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={e => setLowStockThreshold(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl font-mono text-stone-900 font-bold"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: WARRANTY & RETURNS */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
              5
            </span>
            <span>Warranty & Return Terms</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">Warranty Term</label>
            <input
              type="text"
              value={warranty}
              onChange={e => setWarranty(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Return Window (Days)</label>
            <select
              value={returnDays}
              onChange={e => setReturnDays(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-stone-900 font-medium cursor-pointer"
            >
              <option value={7}>7 Days Easy Return</option>
              <option value={10}>10 Days Easy Return (Recommended)</option>
              <option value={15}>15 Days Easy Return</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 6: PRODUCT IMAGES & MEDIA */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
                6
              </span>
              <span>Images & Media Gallery ({images.length})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              High-resolution product angles, packaging stamps, and barcode photos (Recommended: 1000x1000px)
            </p>
          </div>

          <button
            type="button"
            onClick={handleImageAddMock}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Mock Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl border-2 p-2 aspect-square flex items-center justify-center bg-stone-50 group ${
                primaryImageIdx === idx ? 'border-[#C59B27] bg-amber-50/30' : 'border-stone-200'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-contain" />
              {primaryImageIdx === idx && (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#C59B27] text-stone-950 text-[9px] font-bold rounded">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-stone-950/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrimaryImageIdx(idx)}
                  className="p-1.5 bg-white text-stone-900 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Set Primary
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 bg-rose-600 text-white rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL SUBMIT ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={() => onSelectTab('products')}
          className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          className="px-5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('active')}
          className="px-6 py-2.5 bg-[#16181D] hover:bg-stone-800 text-[#E8D5A3] text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
        >
          Publish Part Listing
        </button>
      </div>
    </div>
  );
};
