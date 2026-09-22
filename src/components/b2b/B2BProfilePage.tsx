import React, { useState } from 'react';
import {
  Building2,
  Wrench,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Save,
  MapPin,
  Mail,
  Phone,
  FileText,
  CreditCard,
} from 'lucide-react';
import { B2BAccountType } from '../../types/b2b';
import { b2bService } from '../../services/b2bService';

interface B2BProfilePageProps {
  activeAccountType: B2BAccountType;
  onSwitchAccountType: (type: B2BAccountType) => void;
}

export const B2BProfilePage: React.FC<B2BProfilePageProps> = ({
  activeAccountType,
  onSwitchAccountType,
}) => {
  const garageProfile = b2bService.getGarageProfile();
  const fleetProfile = b2bService.getFleetProfile();

  // Garage state
  const [garageName, setGarageName] = useState(garageProfile.businessName);
  const [garageOwner, setGarageOwner] = useState(garageProfile.ownerName);
  const [garageMobile, setGarageMobile] = useState(garageProfile.mobile);
  const [garageEmail, setGarageEmail] = useState(garageProfile.email);
  const [garageAddress, setGarageAddress] = useState(garageProfile.address);
  const [garageCity, setGarageCity] = useState(garageProfile.city);
  const [garageGstin, setGarageGstin] = useState(garageProfile.gstin);
  const [garageBays, setGarageBays] = useState(garageProfile.serviceBays);

  // Fleet state
  const [fleetCompany, setFleetCompany] = useState(fleetProfile.companyName);
  const [fleetManager, setFleetManager] = useState(fleetProfile.managerName);
  const [fleetMobile, setFleetMobile] = useState(fleetProfile.mobile);
  const [fleetEmail, setFleetEmail] = useState(fleetProfile.email);
  const [fleetAddress, setFleetAddress] = useState(fleetProfile.depotAddress);
  const [fleetCity, setFleetCity] = useState(fleetProfile.city);
  const [fleetGstin, setFleetGstin] = useState(fleetProfile.gstin);
  const [fleetSize, setFleetSize] = useState(fleetProfile.fleetSize);

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveGarage = (e: React.FormEvent) => {
    e.preventDefault();
    b2bService.updateGarageProfile({
      businessName: garageName,
      ownerName: garageOwner,
      mobile: garageMobile,
      email: garageEmail,
      address: garageAddress,
      city: garageCity,
      gstin: garageGstin,
      serviceBays: Number(garageBays),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleSaveFleet = (e: React.FormEvent) => {
    e.preventDefault();
    b2bService.updateFleetProfile({
      companyName: fleetCompany,
      managerName: fleetManager,
      mobile: fleetMobile,
      email: fleetEmail,
      depotAddress: fleetAddress,
      city: fleetCity,
      gstin: fleetGstin,
      fleetSize: Number(fleetSize),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#C59B27]" />
            <span>Business Entity & Statutory Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage GST tax credentials, delivery bay instructions, and business account classification.
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => onSwitchAccountType('garage')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeAccountType === 'garage'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Garage Profile</span>
          </button>
          <button
            onClick={() => onSwitchAccountType('fleet')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeAccountType === 'fleet'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Fleet Profile</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Business profile changes successfully updated in local state!</span>
        </div>
      )}

      {activeAccountType === 'garage' ? (
        /* Garage Account Profile Form */
        <form onSubmit={handleSaveGarage} className="bg-white border border-gray-200 rounded-xl shadow-xs p-5 sm:p-6 space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C59B27] flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Garage / Workshop Identification</h3>
                <span className="text-[11px] text-gray-500">Auto-applies to all GST tax invoices</span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Workshop
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Business Legal Name *</label>
              <input
                type="text"
                required
                value={garageName}
                onChange={(e) => setGarageName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Owner / Chief Technician *</label>
              <input
                type="text"
                required
                value={garageOwner}
                onChange={(e) => setGarageOwner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Service Bays Count</label>
              <input
                type="number"
                min="1"
                max="50"
                value={garageBays}
                onChange={(e) => setGarageBays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Mobile Contact (WhatsApp) *</label>
              <input
                type="text"
                required
                value={garageMobile}
                onChange={(e) => setGarageMobile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Procurement Email *</label>
              <input
                type="email"
                required
                value={garageEmail}
                onChange={(e) => setGarageEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">GSTIN Number (REG-06)</label>
              <input
                type="text"
                value={garageGstin}
                onChange={(e) => setGarageGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-gray-800 block mb-1">Workshop Bay Delivery Address</label>
              <input
                type="text"
                value={garageAddress}
                onChange={(e) => setGarageAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">City / State</label>
              <input
                type="text"
                value={garageCity}
                onChange={(e) => setGarageCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-800 block mb-1">Specialized Vehicle Categories:</span>
            <div className="flex flex-wrap gap-1.5">
              {garageProfile.preferredVehicleCategories.map((cat, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-gray-300 text-gray-700 text-[11px] font-medium">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Garage Profile</span>
            </button>
          </div>
        </form>
      ) : (
        /* Fleet Account Profile Form */
        <form onSubmit={handleSaveFleet} className="bg-white border border-gray-200 rounded-xl shadow-xs p-5 sm:p-6 space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Commercial Fleet Entity Information</h3>
                <span className="text-[11px] text-gray-500">Centralized transport logistics depot</span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Fleet Operator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Company / Fleet Name *</label>
              <input
                type="text"
                required
                value={fleetCompany}
                onChange={(e) => setFleetCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Fleet Operations Head *</label>
              <input
                type="text"
                required
                value={fleetManager}
                onChange={(e) => setFleetManager(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Active Fleet Size (Vehicles)</label>
              <input
                type="number"
                min="5"
                max="1000"
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Mobile Contact *</label>
              <input
                type="text"
                required
                value={fleetMobile}
                onChange={(e) => setFleetMobile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Procurement Email *</label>
              <input
                type="email"
                required
                value={fleetEmail}
                onChange={(e) => setFleetEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Company GSTIN (Mandatory) *</label>
              <input
                type="text"
                required
                value={fleetGstin}
                onChange={(e) => setFleetGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-gray-800 block mb-1">Central Depot / Yard Address</label>
              <input
                type="text"
                value={fleetAddress}
                onChange={(e) => setFleetAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Depot City</label>
              <input
                type="text"
                value={fleetCity}
                onChange={(e) => setFleetCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C59B27]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-800 block mb-1">Primary Commercial Fleet Brands:</span>
            <div className="flex flex-wrap gap-1.5">
              {fleetProfile.primaryVehicleBrands.map((b, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-gray-300 text-gray-700 text-[11px] font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Fleet Profile</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
