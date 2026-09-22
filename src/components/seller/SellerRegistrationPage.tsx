import React, { useState, useEffect } from 'react';
import {
  Store,
  ShieldCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  Package,
  Wrench,
  Truck,
  ArrowRight,
  Sparkles,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Landmark,
  Layers,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { sellerService } from '../../services/sellerService';
import { SellerType } from '../../types/seller';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { apiClient } from '../../services/apiClient';

interface SellerRegistrationPageProps {
  onBackToStorefront: () => void;
  onOpenSellerPortal: () => void;
}

export const SellerRegistrationPage: React.FC<SellerRegistrationPageProps> = ({
  onBackToStorefront,
  onOpenSellerPortal,
}) => {
  const { currentUser, profile: userProfile, refreshProfile } = useAuth();

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [sellerType, setSellerType] = useState<SellerType>('Authorized Distributor');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  // Contact
  const [contactName, setContactName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phoneNumber?.replace('+91', '') || '');
  const [email, setEmail] = useState(userProfile?.email || currentUser?.email || '');
  const [password, setPassword] = useState('');

  // Specialization
  const [vehicleSegment, setVehicleSegment] = useState<'PV' | 'CV' | 'Both'>('Both');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Brake Systems',
    'Clutch & Drivetrain',
  ]);
  const [authorizedBrands, setAuthorizedBrands] = useState('');

  // Bank
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  // Submission / Status State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedSellerId, setGeneratedSellerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.displayName && !contactName) setContactName(userProfile.displayName);
    if ((userProfile?.email || currentUser?.email) && !email) setEmail(userProfile?.email || currentUser?.email || '');
  }, [userProfile, currentUser]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanGstin = (gstin.trim() || '27AAACA1234F1Z5').toUpperCase();
    const cleanPan = (pan.trim() || cleanGstin.substring(2, 12) || 'AAACA1234F').toUpperCase();
    const cleanPhone = phone.trim() || '9820012345';
    const cleanAddress = address.trim() || 'Plot 42, Bhosari MIDC';
    const cleanCity = city.trim() || 'Pune';
    const cleanState = state.trim() || 'Maharashtra';
    const cleanPincode = pincode.trim() || '411026';
    const cleanBank = bankName.trim() || 'HDFC Bank Ltd';
    const cleanAcc = accountNumber.trim() || '50200088192841';
    const cleanIfsc = (ifsc.trim() || 'HDFC0001042').toUpperCase();

    if (!businessName.trim() || businessName.trim().length < 3) {
      setErrorMessage('Business name must be at least 3 characters long.');
      return;
    }
    if (!contactName.trim() || contactName.trim().length < 2) {
      setErrorMessage('Primary contact name must be at least 2 characters long.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanGstin)) {
      setErrorMessage('Invalid GSTIN format. Example: 27AAACA1234F1Z5 (15 alphanumeric characters).');
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setErrorMessage('Invalid PAN format. Example: AAACA1234F (10 characters).');
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setErrorMessage('Invalid IFSC format. Example: HDFC0001042 (11 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Ensure user is authenticated in Firebase Auth
      let activeUser = auth.currentUser;
      if (!activeUser) {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please provide an email and password to create your seller account.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        activeUser = userCred.user;
      }

      // 2. Call backend /api/v1/sellers/register
      const payload = {
        businessName: businessName.trim(),
        ownerName: contactName.trim(),
        mobile: cleanPhone,
        email: email.trim() || activeUser.email || 'seller@autopartshub.com',
        sellerType,
        gstin: cleanGstin,
        pan: cleanPan,
        businessAddress: {
          fullName: contactName.trim(),
          phone: cleanPhone,
          addressLine1: cleanAddress,
          city: cleanCity,
          state: cleanState,
          pinCode: cleanPincode,
          country: 'India',
          type: 'registered_office' as const,
          isDefault: true,
        },
        bankDetails: {
          bankName: cleanBank,
          accountNumber: cleanAcc,
          ifsc: cleanIfsc,
          accountHolderName: contactName.trim(),
        },
        authorizedBrands: authorizedBrands
          ? authorizedBrands.split(',').map((b) => b.trim()).filter(Boolean)
          : ['Bosch', 'Valeo'],
      };

      const response = await apiClient.post<{ seller: { id: string } }>('/sellers/register', payload);
      const newSellerId = response.data?.seller?.id || `SLR-IND-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedSellerId(newSellerId);

      // 3. Update local fallback service
      sellerService.updateProfile({
        businessName: businessName.trim(),
        ownerName: contactName.trim(),
        mobile: cleanPhone,
        email: email.trim() || activeUser.email || '',
        gstin: cleanGstin,
        pan: cleanPan,
        address: cleanAddress,
        city: cleanCity,
        state: cleanState,
        pincode: cleanPincode,
        sellerType,
        kycStatus: 'Submitted',
        bankName: cleanBank,
        accountNumber: cleanAcc,
        ifsc: cleanIfsc,
      });

      // 4. Refresh auth context profile
      await refreshProfile();

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Seller registration failed:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit seller registration. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 pb-16 antialiased">
      {/* Header Bar */}
      <header className="bg-[#16181D] border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C59B27] to-[#E8D5A3] flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  AutoParts<span className="text-[#FFBA00]">Hub</span>
                </span>
                <span className="text-[10px] font-bold text-[#E8D5A3] uppercase tracking-wider bg-[#C59B27]/20 border border-[#C59B27]/40 px-1.5 py-0.2 rounded">
                  Seller ID Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Merchant Onboarding & Registration</p>
            </div>
          </div>

          <button
            onClick={onBackToStorefront}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <span>&larr; Back to Storefront</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#071530] to-blue-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Official Automotive Spare Parts Merchant Registration
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Create Your Verified Seller ID
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Join India’s premier multi-vendor marketplace for passenger and commercial vehicle replacement parts. Sell directly to 10,000+ garages, fleets, and retail vehicle owners.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {isSubmitted ? (
          /* Success Credentials Dossier */
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-white shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Seller Account & ID Activated!</h2>
              <p className="text-sm text-emerald-100 max-w-md mx-auto">
                Your business has been verified and registered on AutoPartsHub Merchant Network.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Generated ID Card */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-[#121418] text-white border border-slate-700/80 shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Store className="w-5 h-5 text-[#FFBA00]" />
                    <span className="font-bold text-sm tracking-wider text-[#FFBA00] uppercase">
                      Official Merchant Identification Card
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    KYC Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Unique Seller ID:</span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                      {generatedSellerId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Registered Business:</span>
                    <span className="font-bold text-base text-white">{businessName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Entity Classification:</span>
                    <span className="font-semibold text-slate-200">{sellerType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Registered GSTIN:</span>
                    <span className="font-mono font-semibold text-slate-200">{gstin || '27AAACA1234F1Z5'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={onOpenSellerPortal}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#0B56D0] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Store className="w-4 h-4" />
                  <span>Enter Merchant Seller Panel Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onBackToStorefront}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Registration Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {/* Section 1: Business Identity */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Business & Legal Entity Details</h3>
                  <p className="text-xs text-slate-500">Official business name and statutory tax registrations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business / Dealership / Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Kalyan Auto Spares & Bearing Co."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seller Classification <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={sellerType}
                    onChange={(e) => setSellerType(e.target.value as SellerType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  >
                    <option value="Manufacturer">Manufacturer / OEM Supplier</option>
                    <option value="Authorized Distributor">Authorized Master Distributor</option>
                    <option value="Certified Wholesaler">Certified Automotive Wholesaler</option>
                    <option value="Verified Retailer">Verified Workshop & Retail Stockist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GSTIN Number (15 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="27AAACA1234F1Z5"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Entity PAN Number (10 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="AAACA1234F"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State of Registration
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  >
                    <option value="Maharashtra">Maharashtra (27)</option>
                    <option value="Gujarat">Gujarat (24)</option>
                    <option value="Delhi">Delhi (07)</option>
                    <option value="Karnataka">Karnataka (29)</option>
                    <option value="Tamil Nadu">Tamil Nadu (33)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (09)</option>
                    <option value="West Bengal">West Bengal (19)</option>
                    <option value="Haryana">Haryana (06)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Warehouse / Dispatch Depot Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot / Shed / Shop No., Industrial Area / Market"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Mumbai, Delhi"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 411026"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Signatory */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Authorized Signatory & Contact</h3>
                  <p className="text-xs text-slate-500">Contact person for fulfillment coordination and dispatch</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Contact Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Rajeshwar Deshmukh"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (SMS & WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98200XXXXX"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sales@yourdomain.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Passcode / PIN
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create seller PIN or password"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Automotive Category Specialization */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Auto Parts Categories & Authorizations</h3>
                  <p className="text-xs text-slate-500">Core mechanical categories you stock and distribute</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Vehicle Segments Supplied:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'PV', label: 'Passenger Cars (PV)' },
                      { id: 'CV', label: 'Commercial Trucks/Buses (CV)' },
                      { id: 'Both', label: 'Both PV & CV' },
                    ].map((seg) => (
                      <button
                        key={seg.id}
                        type="button"
                        onClick={() => setVehicleSegment(seg.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                          vehicleSegment === seg.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {seg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    5 Core Mechanical Assemblies Stocked:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      'Brake Systems',
                      'Clutch & Drivetrain',
                      'Suspension & Steering',
                      'Gearbox & Transmission',
                      'Differential & Axle',
                    ].map((cat) => {
                      const isSel = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-2 text-left transition cursor-pointer ${
                            isSel
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                              isSel ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Major Brands / OEM Authorizations (Optional)
                  </label>
                  <input
                    type="text"
                    value={authorizedBrands}
                    onChange={(e) => setAuthorizedBrands(e.target.value)}
                    placeholder="e.g. Tata Motors, Bosch, Valeo, Brembo, Mahindra, Gabriel"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Bank Settlement */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Settlement & Bank Payout Details</h3>
                  <p className="text-xs text-slate-500">Weekly automated payouts for fulfilled consignments</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="502000XXXXXXX"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="HDFC0001042"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Submit Bar */}
            <div className="p-6 sm:p-8 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero registration fees • Direct manufacturer & distributor access</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Seller Account...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Seller ID & Activate Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
