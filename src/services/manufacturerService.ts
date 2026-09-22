import {
  ManufacturerPortalTab,
  ManufacturerProduct,
  ManufacturerOrder,
  ManufacturerDealer,
  CustomerDemandAnalytics,
  ManufacturerReturnRecord,
  ManufacturerWarrantyClaim,
  ManufacturerInventoryItem,
  RevenueAnalytics,
  RevenueDateFilter,
  ManufacturerBrandProfile,
  ManufacturerNotification,
  ManufacturerKPISummary,
  ManufacturerReturnReason,
  ManufacturerWarrantyOutcome,
  StockMovement,
} from '../types/manufacturer';

// -------------------------------------------------------------
// 1. Five Verified Manufacturer Brand Profiles
// -------------------------------------------------------------
export const BRAND_PROFILES: Record<string, ManufacturerBrandProfile> = {
  'mfg-bosch': {
    id: 'mfg-bosch',
    brandName: 'Bosch Automotive India Ltd',
    legalEntityName: 'Robert Bosch Automotive Aftermarket India Pvt Ltd',
    shortName: 'Bosch',
    logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=160&q=80',
    tagline: 'Invented for Life — Global Leader in Braking & Diesel Systems',
    establishedYear: 1951,
    cinNumber: 'U28920KA1951PTC000670',
    gstin: '29AAACR2727Q1ZW',
    pan: 'AAACR2727Q',
    registeredOffice: {
      address: 'Hosur Road, Adugodi, Post Box No 3000',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560030',
      country: 'India',
    },
    plantLocations: [
      { facilityName: 'Plant 1 - Brakes & Hydraulic Actuators', address: 'Bidadi Industrial Area, Ramanagara, KA', specialization: 'ABS Units & Master Cylinders' },
      { facilityName: 'Plant 2 - Friction Materials', address: 'MIDC Chakan, Phase II, Pune, MH', specialization: 'Ceramic & Semi-Metallic Brake Pads' },
      { facilityName: 'Plant 3 - Electronic Sensors', address: 'Maraimalai Nagar, Chennai, TN', specialization: 'Wheel Speed & ESC Sensors' },
    ],
    primaryContact: {
      name: 'Vikramaditya Rao',
      designation: 'VP - OE Alliances & Digital Aftermarket',
      email: 'vikramaditya.rao@in.bosch.com',
      phone: '+91 80 6752 4000',
    },
    supportContact: {
      oemHelpline: '1800-425-8664',
      technicalSupportEmail: 'techhelp.brakes@in.bosch.com',
      dealerSupportEmail: 'dealers.alliances@in.bosch.com',
    },
    verificationStatus: 'Verified OEM Manufacturer',
    oemAccreditations: ['Tata Motors OE Tier-1', 'Maruti Suzuki Prime Vendor', 'Mahindra Automotive OE Partner', 'Ashok Leyland Co-Development'],
    certifications: ['IATF 16949:2016', 'ISO 9001:2015', 'ISO 14001:2015', 'ARAI Certified CMVR Compliance', 'ECE R90 Certified'],
    warrantyPolicyDoc: 'BOSCH-OE-STD-WARRANTY-V4.2.pdf',
  },
  'mfg-brembo': {
    id: 'mfg-brembo',
    brandName: 'Brembo Brake Systems India Pvt Ltd',
    legalEntityName: 'Brembo Brake Systems India Private Limited',
    shortName: 'Brembo',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=160&q=80',
    tagline: 'Turning Energy into Stopping Power — High Performance Disc Braking',
    establishedYear: 2006,
    cinNumber: 'U34300PN2006PTC128456',
    gstin: '27AABCB3981N1Z5',
    pan: 'AABCB3981N',
    registeredOffice: {
      address: 'Plot No. 1, Phase 2, Chakan Industrial Area',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '410501',
      country: 'India',
    },
    plantLocations: [
      { facilityName: 'Chakan Precision Disc Foundry', address: 'Plot No 1, Chakan Phase 2, Pune, MH', specialization: 'Ventilated & Slotted Brake Rotors' },
      { facilityName: 'Manesar Caliper Assembly Unit', address: 'Sector 8, IMT Manesar, Gurugram, HR', specialization: 'Aluminium Floating & Fixed Monobloc Calipers' },
    ],
    primaryContact: {
      name: 'Aditi Deshmukh',
      designation: 'Director - Commercial OEM Partnerships',
      email: 'a.deshmukh@brembo.in',
      phone: '+91 20 6731 2000',
    },
    supportContact: {
      oemHelpline: '1800-209-9099',
      technicalSupportEmail: 'performance.support@brembo.in',
      dealerSupportEmail: 'commercial.network@brembo.in',
    },
    verificationStatus: 'Verified OEM Manufacturer',
    oemAccreditations: ['Mahindra XUV/Scorpio Tier-1', 'Tata Passenger Vehicles OE', 'Brembo Global Racing Approved'],
    certifications: ['IATF 16949:2016', 'ISO 9001:2015', 'KBA ECE R90 Rotor Certified'],
    warrantyPolicyDoc: 'BREMBO-HIGH-PERF-WARRANTY-2026.pdf',
  },
  'mfg-valeo': {
    id: 'mfg-valeo',
    brandName: 'Valeo India Pvt Ltd',
    legalEntityName: 'Valeo Friction & Transmission Systems India Pvt Ltd',
    shortName: 'Valeo',
    logo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=160&q=80',
    tagline: 'Smart Technology for Clean & Connected Mobility — Clutch & Friction Leaders',
    establishedYear: 1997,
    cinNumber: 'U35999TN1997PTC038120',
    gstin: '33AAACV0129K1Z4',
    pan: 'AAACV0129K',
    registeredOffice: {
      address: 'Block A, Tecci Park, Rajiv Gandhi Salai, Sholinganallur',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600119',
      country: 'India',
    },
    plantLocations: [
      { facilityName: 'Chennai Clutch Plant', address: 'Vallam Vadagal SIPCOT, Sriperumbudur, TN', specialization: 'Self-Adjusting Clutch (SAT) & Dual Mass Flywheels' },
      { facilityName: 'Sanand Transmission Line', address: 'Sanand GIDC Phase II, Ahmedabad, GJ', specialization: 'Heavy Commercial Clutch Plates & Release Bearings' },
    ],
    primaryContact: {
      name: 'K. Senthil Nathan',
      designation: 'Head of Aftermarket & OEM Sales',
      email: 'ksenthil.nathan@valeo.com',
      phone: '+91 44 6649 5000',
    },
    supportContact: {
      oemHelpline: '1800-103-8253',
      technicalSupportEmail: 'clutch.tech@valeo.com',
      dealerSupportEmail: 'dealers.india@valeo.com',
    },
    verificationStatus: 'Verified OEM Manufacturer',
    oemAccreditations: ['Tata Motors CV Direct Supplier', 'Ashok Leyland Certified Tier-1', 'Maruti Suzuki Approved OEM'],
    certifications: ['IATF 16949', 'ISO 14001', 'ISO 45001'],
    warrantyPolicyDoc: 'VALEO-TRANSMISSION-WARRANTY-IN.pdf',
  },
  'mfg-tvs': {
    id: 'mfg-tvs',
    brandName: 'Brakes India / TVS Girling',
    legalEntityName: 'Brakes India Private Limited (A TVS Group Enterprise)',
    shortName: 'TVS Girling',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=160&q=80',
    tagline: 'India’s Foremost Foundation Brake Manufacturer — Safe Brakes for All Roads',
    establishedYear: 1962,
    cinNumber: 'U35999TN1962PTC004780',
    gstin: '33AAACB1209L1Z1',
    pan: 'AAACB1209L',
    registeredOffice: {
      address: 'Padi, Ambattur Industrial Estate',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600050',
      country: 'India',
    },
    plantLocations: [
      { facilityName: 'Sholinghur Heavy Foundries', address: 'Ranipet District, Sholinghur, TN', specialization: 'Ductile Iron Caliper Castings & Brake Drums' },
      { facilityName: 'Jamshedpur CV Brake Facility', address: 'Adityapur Industrial Area, Jamshedpur, JH', specialization: 'S-Cam Drum Brakes & Air Actuated Brakes' },
    ],
    primaryContact: {
      name: 'R. Balasubramanian',
      designation: 'General Manager - Commercial Vehicle Brakes',
      email: 'r.bala@brakesindia.tvsgirling.com',
      phone: '+91 44 2625 8141',
    },
    supportContact: {
      oemHelpline: '1800-425-2424',
      technicalSupportEmail: 'techsupport@tvsgirling.com',
      dealerSupportEmail: 'network@tvsgirling.com',
    },
    verificationStatus: 'Verified OEM Manufacturer',
    oemAccreditations: ['Tata Motors Commercial Vehicles Tier-1', 'Eicher Motors Partner', 'Ashok Leyland Strategic OEM'],
    certifications: ['IATF 16949', 'Deming Application Prize Winner', 'ARAI CMVR 96+'],
    warrantyPolicyDoc: 'TVS-GIRLING-CV-WARRANTY.pdf',
  },
  'mfg-zf': {
    id: 'mfg-zf',
    brandName: 'ZF Sachs Drivetrain India',
    legalEntityName: 'ZF Commercial Vehicle Control Systems India Limited',
    shortName: 'ZF Sachs',
    logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=160&q=80',
    tagline: 'Next Generation Mobility — Transmission, Steering & Differential Axles',
    establishedYear: 2004,
    cinNumber: 'L34103TN2004PLC054667',
    gstin: '33AAACT7365G1ZS',
    pan: 'AAACT7365G',
    registeredOffice: {
      address: 'Plot No. 3, Sector 11, IIE SIDCUL Pantnagar',
      city: 'Rudrapur',
      state: 'Uttarakhand',
      pincode: '263153',
      country: 'India',
    },
    plantLocations: [
      { facilityName: 'Pantnagar Transmission Facility', address: 'SIDCUL Pantnagar, UK', specialization: 'Manual & Automated Synchronizers, Gears' },
      { facilityName: 'Coimbatore Axle Unit', address: 'Karumathampatti, Coimbatore, TN', specialization: 'Crown Wheel Pinions & Differential Assemblies' },
    ],
    primaryContact: {
      name: 'Siddharth Kaul',
      designation: 'VP - Heavy Commercial Drivetrain Systems',
      email: 'siddharth.kaul@zf.com',
      phone: '+91 5944 250 500',
    },
    supportContact: {
      oemHelpline: '1800-210-9372',
      technicalSupportEmail: 'drivetrain.help@zf.com',
      dealerSupportEmail: 'dealers.india@zf.com',
    },
    verificationStatus: 'Tier-1 Certified Supplier',
    oemAccreditations: ['Ashok Leyland Transmission OEM', 'Tata Signa Co-Development', 'BharatBenz Tier-1'],
    certifications: ['IATF 16949', 'ISO 9001', 'ISO 26262 Road Vehicles Functional Safety'],
    warrantyPolicyDoc: 'ZF-SACHS-DRIVETRAIN-POLICY-2026.pdf',
  },
};

// -------------------------------------------------------------
// 2. Realistic Mock Products for Manufacturers
// -------------------------------------------------------------
export const INITIAL_PRODUCTS: ManufacturerProduct[] = [
  // Bosch Products
  {
    id: 'mfg-prod-001',
    title: 'Ceramic Low-Dust Front Brake Pad Set (ECE R90 Certified)',
    brand: 'Bosch',
    brandId: 'mfg-bosch',
    partNumber: '0986AB1234',
    oemNumber: '55810M68P00',
    category: 'Brake',
    subCategory: 'Brake Pads',
    productType: 'Genuine',
    price: 1850,
    mrp: 3200,
    stock: {
      current: 840,
      reserved: 120,
      available: 720,
      lowStockThreshold: 150,
      warehouseLocation: 'Bengaluru Central Distribution Hub (Bin A-14)',
    },
    warranty: '12 Months / 20,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_brakepad.jpg'],
    description: 'High-performance NAO ceramic brake pad engineered for commercial & passenger stopping power. Designed for low dust and reduced rotor grooving.',
    features: ['ECE R90 certified compound', 'Zero copper ceramic formulation', 'Anti-squeal vulcanized steel shims pre-fitted'],
    specifications: { 'Friction Material': 'Advanced NAO Ceramic', 'Pad Thickness': '16.8 mm', 'Axle Position': 'Front Axle (LH & RH)' },
    compatibility: [
      { vehicleType: 'commercial', manufacturer: 'Tata', model: 'Ace', yearRange: '2015 - 2024', engine: '700cc Diesel', fuelType: 'Diesel', variant: 'Standard' },
      { vehicleType: 'commercial', manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor', fuelType: 'Diesel', variant: 'Plus' },
      { vehicleType: 'passenger', manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L DualJet', fuelType: 'Petrol', variant: 'ZXi' },
      { vehicleType: 'passenger', manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L CRDi', fuelType: 'Diesel', variant: 'SX' },
    ],
    unitsSoldTotal: 3420,
    activeDealersCount: 18,
    rating: 4.9,
    createdAt: '2025-04-12',
  },
  {
    id: 'mfg-prod-002',
    title: 'Dual-Circuit Master Cylinder with Tandem Fluid Reservoir',
    brand: 'Bosch',
    brandId: 'mfg-bosch',
    partNumber: '0204AB0982',
    oemNumber: '265243100109',
    category: 'Brake',
    subCategory: 'Brake Cylinders',
    productType: 'OEM',
    price: 3450,
    mrp: 5200,
    stock: {
      current: 310,
      reserved: 45,
      available: 265,
      lowStockThreshold: 60,
      warehouseLocation: 'Pune Logistics Hub (Bin B-03)',
    },
    warranty: '24 Months / 40,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_brakecylinder.jpg'],
    description: 'Precision cast aluminium master cylinder ensuring rapid hydraulic response and balanced line pressure between front and rear braking circuits.',
    features: ['High-tensile anodized aluminium body', 'EPDM rubber primary & secondary cup seals', 'Integrated low-level fluid sensor'],
    specifications: { 'Bore Diameter': '22.2 mm', 'Ports': '2 x M10x1.0 Inverted Flare', 'Reservoir Capacity': '320 ml' },
    compatibility: [
      { vehicleType: 'commercial', manufacturer: 'Tata', model: '407', yearRange: '2016 - 2024', engine: '2956cc 4SPCR', fuelType: 'Diesel', variant: 'Standard' },
      { vehicleType: 'commercial', manufacturer: 'Mahindra', model: 'Bolero Maxi Truck', yearRange: '2018 - 2024', engine: '2.5L m2DiCR', fuelType: 'Diesel', variant: 'Plus' },
    ],
    unitsSoldTotal: 1280,
    activeDealersCount: 14,
    rating: 4.8,
    createdAt: '2025-05-20',
  },
  {
    id: 'mfg-prod-003',
    title: 'High-Torque Synchronizer Ring 3rd & 4th Gear',
    brand: 'Bosch',
    brandId: 'mfg-bosch',
    partNumber: '0986TC7712',
    oemNumber: '254726200114',
    category: 'Gearbox/Transmission',
    subCategory: 'Synchronizer Rings',
    productType: 'Genuine',
    price: 1250,
    mrp: 2100,
    stock: {
      current: 45,
      reserved: 30,
      available: 15,
      lowStockThreshold: 50,
      warehouseLocation: 'Bengaluru Central Distribution Hub (Bin G-11)',
    },
    warranty: '12 Months / 30,000 km Warranty',
    status: 'Low Stock',
    images: ['/assets/prod_gearbox.jpg'],
    description: 'Carbon-molybdenum lined brass synchronizer ring engineered for smooth gear shifts under heavy commercial loading and high engine torque.',
    features: ['Precision CNC machined brass', 'Carbon friction coating', 'Optimal conical tooth geometry'],
    specifications: { 'Outer Diameter': '84.5 mm', 'Teeth Count': '36 teeth', 'Friction Material': 'Moly Carbon Blend' },
    compatibility: [
      { vehicleType: 'commercial', manufacturer: 'Tata', model: 'Ace', yearRange: '2018 - 2024', engine: '700cc Dicor', fuelType: 'Diesel', variant: 'Standard' },
      { vehicleType: 'commercial', manufacturer: 'Tata', model: '407', yearRange: '2017 - 2024', engine: '2956cc 4SPCR', fuelType: 'Diesel', variant: 'High Deck' },
    ],
    unitsSoldTotal: 840,
    activeDealersCount: 9,
    rating: 4.7,
    createdAt: '2025-06-11',
  },

  // Brembo Products
  {
    id: 'mfg-prod-004',
    title: 'High-Carbon Ventilated Front Brake Disc Rotor (300mm)',
    brand: 'Brembo',
    brandId: 'mfg-brembo',
    partNumber: '09.8968.11',
    oemNumber: '435120K080',
    category: 'Brake',
    subCategory: 'Brake Discs',
    productType: 'Genuine',
    price: 3600,
    mrp: 6100,
    stock: {
      current: 480,
      reserved: 70,
      available: 410,
      lowStockThreshold: 100,
      warehouseLocation: 'Pune Chakan Plant Warehouse (Rack R-04)',
    },
    warranty: '24 Months / 50,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_brakedisc.jpg'],
    description: 'High-carbon alloy cast iron brake rotor featuring directional pillar venting. Resists thermal deformation and guarantees vibration-free deceleration.',
    features: ['High-carbon grey cast iron alloy', 'UV coated anti-corrosion finish', 'Electronically precision balanced'],
    specifications: { 'Diameter': '300 mm', 'Centering Diameter': '68 mm', 'Min Thickness': '26 mm', 'Bolt Holes': '5' },
    compatibility: [
      { vehicleType: 'passenger', manufacturer: 'Mahindra', model: 'Scorpio-N', yearRange: '2022 - 2024', engine: '2.2L mHawk', fuelType: 'Diesel', variant: 'Z8 Select' },
      { vehicleType: 'passenger', manufacturer: 'Mahindra', model: 'XUV700', yearRange: '2021 - 2024', engine: '2.0L mStallion', fuelType: 'Petrol', variant: 'AX7' },
      { vehicleType: 'passenger', manufacturer: 'Toyota', model: 'Innova Crysta', yearRange: '2016 - 2024', engine: '2.4L 2GD-FTV', fuelType: 'Diesel', variant: 'GX' },
    ],
    unitsSoldTotal: 2150,
    activeDealersCount: 16,
    rating: 4.95,
    createdAt: '2025-02-14',
  },
  {
    id: 'mfg-prod-005',
    title: 'Twin-Piston Heavy-Duty Floating Caliper Assembly (Right Front)',
    brand: 'Brembo',
    brandId: 'mfg-brembo',
    partNumber: 'F061129',
    oemNumber: '477300K061',
    category: 'Brake',
    subCategory: 'Brake Calipers',
    productType: 'OEM',
    price: 5200,
    mrp: 8400,
    stock: {
      current: 120,
      reserved: 18,
      available: 102,
      lowStockThreshold: 35,
      warehouseLocation: 'Manesar Logistics Depot (Bay 12)',
    },
    warranty: '24 Months / 40,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_brakepad.jpg'],
    description: 'Heavy-duty ductile iron floating caliper featuring twin 45mm chrome-plated pistons. Ideal for utility fleets operating on steep grades.',
    features: ['Ductile iron casting', 'Chrome-plated stainless pistons', 'Pre-lubricated silicone slide pins'],
    specifications: { 'Piston Count': '2', 'Piston Diameter': '45 mm', 'Axle Position': 'Front Right' },
    compatibility: [
      { vehicleType: 'passenger', manufacturer: 'Toyota', model: 'Fortuner', yearRange: '2017 - 2024', engine: '2.8L 1GD-FTV', fuelType: 'Diesel', variant: '4x4 AT' },
      { vehicleType: 'commercial', manufacturer: 'Mahindra', model: 'Bolero Pik-Up', yearRange: '2019 - 2024', engine: '2.5L Turbo', fuelType: 'Diesel', variant: 'Extra Strong' },
    ],
    unitsSoldTotal: 690,
    activeDealersCount: 11,
    rating: 4.85,
    createdAt: '2025-03-22',
  },

  // Valeo Products
  {
    id: 'mfg-prod-006',
    title: 'Self-Adjusting Heavy Commercial 310mm Clutch Kit with Release Bearing',
    brand: 'Valeo',
    brandId: 'mfg-valeo',
    partNumber: '828014',
    oemNumber: '252525000118',
    category: 'Clutch',
    subCategory: 'Clutch Kits',
    productType: 'Genuine',
    price: 6800,
    mrp: 10500,
    stock: {
      current: 290,
      reserved: 50,
      available: 240,
      lowStockThreshold: 50,
      warehouseLocation: 'Chennai Sriperumbudur Hub (Bay C-09)',
    },
    warranty: '18 Months / 60,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_clutch.jpg'],
    description: 'Complete 3-piece commercial clutch set (Pressure plate, friction disc, hydraulic release bearing) engineered with self-adjusting wear technology.',
    features: ['Self-Adjusting Technology (SAT)', 'Ceramometallic heavy clutch facing', 'Damped hub with high torsional springs'],
    specifications: { 'Diameter': '310 mm', 'Spline Count': '10', 'Spline Major Diameter': '28.6 mm' },
    compatibility: [
      { vehicleType: 'commercial', manufacturer: 'Tata', model: '407', yearRange: '2015 - 2024', engine: '2956cc 4SPCR', fuelType: 'Diesel', variant: 'Standard' },
      { vehicleType: 'commercial', manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L Turbo', fuelType: 'Diesel', variant: 'LS' },
      { vehicleType: 'commercial', manufacturer: 'Eicher', model: 'Pro 2049', yearRange: '2019 - 2024', engine: '3.0L Turbo', fuelType: 'Diesel', variant: 'Standard' },
    ],
    unitsSoldTotal: 1840,
    activeDealersCount: 15,
    rating: 4.9,
    createdAt: '2025-01-19',
  },
  {
    id: 'mfg-prod-007',
    title: 'Dual Mass Flywheel (DMF) Assembly for Turbocharged Engines',
    brand: 'Valeo',
    brandId: 'mfg-valeo',
    partNumber: '836002',
    oemNumber: '03L105266E',
    category: 'Clutch',
    subCategory: 'Flywheels',
    productType: 'OEM',
    price: 14200,
    mrp: 22000,
    stock: {
      current: 75,
      reserved: 12,
      available: 63,
      lowStockThreshold: 20,
      warehouseLocation: 'Sanand Transmission Depot (Rack F-02)',
    },
    warranty: '24 Months / 50,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_clutch.jpg'],
    description: 'Precision balanced dual mass flywheel attenuating torsional vibration between crankshaft and transmission gears for ultra-quiet operation.',
    features: ['Internal arc springs with damping grease', 'Induction hardened starter ring gear', 'Direct OE fitment'],
    specifications: { 'Outer Diameter': '288 mm', 'Teeth on Ring Gear': '132', 'Weight': '11.8 kg' },
    compatibility: [
      { vehicleType: 'passenger', manufacturer: 'Hyundai', model: 'Creta', yearRange: '2019 - 2024', engine: '1.5L CRDi', fuelType: 'Diesel', variant: 'SX(O)' },
      { vehicleType: 'passenger', manufacturer: 'Mahindra', model: 'XUV700', yearRange: '2021 - 2024', engine: '2.2L mHawk', fuelType: 'Diesel', variant: 'AX7 Luxury' },
    ],
    unitsSoldTotal: 410,
    activeDealersCount: 8,
    rating: 4.88,
    createdAt: '2025-04-05',
  },

  // TVS Girling Products
  {
    id: 'mfg-prod-008',
    title: 'Rear Heavy-Duty Wheel Brake Cylinder (L/R Pair)',
    brand: 'TVS Girling',
    brandId: 'mfg-tvs',
    partNumber: 'GWC1088',
    oemNumber: '269842800104',
    category: 'Brake',
    subCategory: 'Wheel Cylinders',
    productType: 'Genuine',
    price: 1100,
    mrp: 1850,
    stock: {
      current: 920,
      reserved: 140,
      available: 780,
      lowStockThreshold: 180,
      warehouseLocation: 'Chennai Padi Central Warehouse (Bin W-04)',
    },
    warranty: '12 Months / 20,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_brakecylinder.jpg'],
    description: 'Precision honed cast iron wheel cylinders with synthetic elastomeric cup seals built to withstand intense heat and braking pressures.',
    features: ['Superfinished bore for zero leakage', 'Heavy-duty bleed screw with dust cap', 'Zinc yellow chromate anti-rust plating'],
    specifications: { 'Bore': '20.64 mm (13/16 inch)', 'Mounting Pitch': '36 mm', 'Inlet Thread': 'M10x1.0' },
    compatibility: [
      { vehicleType: 'commercial', manufacturer: 'Tata', model: 'Ace', yearRange: '2016 - 2024', engine: '700cc', fuelType: 'Diesel', variant: 'High Deck' },
      { vehicleType: 'commercial', manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2019 - 2024', engine: '1.5L Turbo', fuelType: 'Diesel', variant: 'LE' },
      { vehicleType: 'commercial', manufacturer: 'Mahindra', model: 'Bolero Pik-Up', yearRange: '2017 - 2024', engine: '2.5L m2DiCR', fuelType: 'Diesel', variant: 'Standard' },
    ],
    unitsSoldTotal: 5120,
    activeDealersCount: 22,
    rating: 4.9,
    createdAt: '2025-01-08',
  },

  // ZF Sachs Products
  {
    id: 'mfg-prod-009',
    title: 'Heavy Commercial Differential Crown Wheel & Pinion Set (Ratio 4.88:1)',
    brand: 'ZF Sachs',
    brandId: 'mfg-zf',
    partNumber: 'ZF-CWP-488',
    oemNumber: '254735000109',
    category: 'Differential/Axle',
    subCategory: 'Crown Wheel & Pinion',
    productType: 'Genuine',
    price: 11800,
    mrp: 18500,
    stock: {
      current: 110,
      reserved: 22,
      available: 88,
      lowStockThreshold: 30,
      warehouseLocation: 'Coimbatore Axle Logistics Center (Bay D-01)',
    },
    warranty: '24 Months / 80,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_gearbox.jpg'],
    description: 'Hypoid gear set made from carburized nickel-chromium-molybdenum alloy steel. Built to withstand continuous high shock loads in logistics fleets.',
    features: ['Lapped tooth contact pattern', 'Deep case-hardened tooth flanks', 'Strict noise & vibration vibration-tested pair'],
    specifications: { 'Ratio': '4.88:1 (39/8 Teeth)', 'Crown Diameter': '295 mm', 'Pinion Splines': '28 Splines' },
    compatibility: [
      { vehicleType: 'commercial', manufacturer: 'Tata', model: '407', yearRange: '2015 - 2024', engine: '2956cc 4SPCR', fuelType: 'Diesel', variant: 'Standard' },
      { vehicleType: 'commercial', manufacturer: 'Eicher', model: 'Pro 2049', yearRange: '2018 - 2024', engine: '3.0L Turbo', fuelType: 'Diesel', variant: 'Standard' },
      { vehicleType: 'commercial', manufacturer: 'Ashok Leyland', model: 'Partner', yearRange: '2019 - 2024', engine: 'ZD30 Diesel', fuelType: 'Diesel', variant: 'Super' },
    ],
    unitsSoldTotal: 490,
    activeDealersCount: 12,
    rating: 4.92,
    createdAt: '2025-03-01',
  },
  {
    id: 'mfg-prod-010',
    title: 'Heavy Duty Gas-Charged Rear Shock Absorber Damper',
    brand: 'ZF Sachs',
    brandId: 'mfg-zf',
    partNumber: '313-840',
    oemNumber: '269832000102',
    category: 'Suspension',
    subCategory: 'Shock Absorbers',
    productType: 'OEM',
    price: 2400,
    mrp: 3900,
    stock: {
      current: 380,
      reserved: 60,
      available: 320,
      lowStockThreshold: 75,
      warehouseLocation: 'Pantnagar Facility Warehouse (Rack S-05)',
    },
    warranty: '18 Months / 40,000 km Warranty',
    status: 'Active',
    images: ['/assets/prod_suspension.jpg'],
    description: 'Twin-tube gas pressurized shock absorber designed to stabilize heavy payload cargo vans on damaged rural and urban roads.',
    features: ['Nitrogen gas pressurized at 15 bar', 'Micro-crack chrome plated piston rod', 'Teflon-banded sintered iron piston'],
    specifications: { 'Extended Length': '520 mm', 'Compressed Length': '335 mm', 'Mounting Type': 'Eye/Eye with Poly Bushings' },
    compatibility: [
      { vehicleType: 'commercial', manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor', fuelType: 'Diesel', variant: 'Standard' },
      { vehicleType: 'commercial', manufacturer: 'Mahindra', model: 'Bolero Maxi Truck', yearRange: '2019 - 2024', engine: '2.5L Turbo', fuelType: 'Diesel', variant: 'Plus' },
    ],
    unitsSoldTotal: 1620,
    activeDealersCount: 17,
    rating: 4.8,
    createdAt: '2025-05-02',
  },
];

// -------------------------------------------------------------
// 3. Realistic Marketplace Orders for Manufacturers
// -------------------------------------------------------------
export const INITIAL_ORDERS: ManufacturerOrder[] = [
  {
    id: 'APH-ORD-98421',
    orderDate: '2026-09-18 10:45 AM',
    customerName: 'Kaveri Logistics Depot',
    customerCity: 'Bengaluru',
    customerState: 'Karnataka',
    sellerConsignment: {
      sellerId: 'bosch-direct',
      sellerName: 'Bosch Direct Auto Distributors',
      sellerTier: 'Authorized Distributor',
      sellerLocation: 'Peenya Industrial Area, Bengaluru, KA',
      courierPartner: 'Blue Dart Express',
      trackingNumber: 'BLR-BD-8849201',
      dispatchStatus: 'Out for Delivery',
    },
    items: [
      { productId: 'mfg-prod-001', productTitle: 'Ceramic Front Brake Pad Set (ECE R90)', partNumber: '0986AB1234', oemNumber: '55810M68P00', quantity: 20, unitPrice: 1850, subtotal: 37000 },
      { productId: 'mfg-prod-002', productTitle: 'Dual-Circuit Master Cylinder Tandem Reservoir', partNumber: '0204AB0982', oemNumber: '265243100109', quantity: 4, unitPrice: 3450, subtotal: 13800 },
    ],
    totalAmount: 50800,
    totalUnits: 24,
    orderStatus: 'Shipped',
    shipmentStatus: 'Out for Delivery',
    returnStatus: 'None',
    warrantyStatus: 'Active Warranty',
  },
  {
    id: 'APH-ORD-98380',
    orderDate: '2026-09-17 03:15 PM',
    customerName: 'Shri Ram Auto Spares & Garage',
    customerCity: 'Pune',
    customerState: 'Maharashtra',
    sellerConsignment: {
      sellerId: 'brembo-official',
      sellerName: 'Brembo Regional Hub West',
      sellerTier: 'OEM Partner',
      sellerLocation: 'MIDC Bhosari, Pune, MH',
      courierPartner: 'Delhivery Surface',
      trackingNumber: 'DEL-PUN-772189',
      dispatchStatus: 'Delivered',
    },
    items: [
      { productId: 'mfg-prod-004', productTitle: 'High-Carbon Ventilated Front Brake Disc Rotor (300mm)', partNumber: '09.8968.11', oemNumber: '435120K080', quantity: 8, unitPrice: 3600, subtotal: 28800 },
    ],
    totalAmount: 28800,
    totalUnits: 8,
    orderStatus: 'Delivered',
    shipmentStatus: 'Delivered',
    returnStatus: 'None',
    warrantyStatus: 'Active Warranty',
  },
  {
    id: 'APH-ORD-98315',
    orderDate: '2026-09-16 11:20 AM',
    customerName: 'Apex Commercial Fleet Depot',
    customerCity: 'Chennai',
    customerState: 'Tamil Nadu',
    sellerConsignment: {
      sellerId: 'valeo-partner',
      sellerName: 'South India Transmission Spares',
      sellerTier: 'Certified Wholesaler',
      sellerLocation: 'Ambattur Industrial Estate, Chennai, TN',
      courierPartner: 'DTDC Express',
      trackingNumber: 'DTDC-CHN-40912',
      dispatchStatus: 'Delivered',
    },
    items: [
      { productId: 'mfg-prod-006', productTitle: 'Self-Adjusting Heavy Commercial 310mm Clutch Kit', partNumber: '828014', oemNumber: '252525000118', quantity: 6, unitPrice: 6800, subtotal: 40800 },
    ],
    totalAmount: 40800,
    totalUnits: 6,
    orderStatus: 'Delivered',
    shipmentStatus: 'Delivered',
    returnStatus: 'None',
    warrantyStatus: 'Active Warranty',
  },
  {
    id: 'APH-ORD-98240',
    orderDate: '2026-09-15 02:40 PM',
    customerName: 'Gurukripa Motors Workshop',
    customerCity: 'Indore',
    customerState: 'Madhya Pradesh',
    sellerConsignment: {
      sellerId: 'tvs-central',
      sellerName: 'Central India Brake & Friction',
      sellerTier: 'Authorized Distributor',
      sellerLocation: 'Dewas Road Industrial Area, Indore, MP',
      courierPartner: 'VRL Logistics',
      trackingNumber: 'VRL-IND-90214',
      dispatchStatus: 'Delivered',
    },
    items: [
      { productId: 'mfg-prod-008', productTitle: 'Rear Heavy-Duty Wheel Brake Cylinder Pair', partNumber: 'GWC1088', oemNumber: '269842800104', quantity: 30, unitPrice: 1100, subtotal: 33000 },
    ],
    totalAmount: 33000,
    totalUnits: 30,
    orderStatus: 'Delivered',
    shipmentStatus: 'Delivered',
    returnStatus: 'Requested',
    warrantyStatus: 'Claim Filed',
  },
  {
    id: 'APH-ORD-98190',
    orderDate: '2026-09-14 09:10 AM',
    customerName: 'TransIndia Commercial Fleet',
    customerCity: 'Kolkata',
    customerState: 'West Bengal',
    sellerConsignment: {
      sellerId: 'zf-eastern',
      sellerName: 'Eastern India Heavy Drivetrain Spares',
      sellerTier: 'Authorized Distributor',
      sellerLocation: 'Taratala Industrial Area, Kolkata, WB',
      courierPartner: 'TCI Freight',
      trackingNumber: 'TCI-KOL-55410',
      dispatchStatus: 'Delivered',
    },
    items: [
      { productId: 'mfg-prod-009', productTitle: 'Heavy Commercial Differential Crown Wheel & Pinion Set', partNumber: 'ZF-CWP-488', oemNumber: '254735000109', quantity: 3, unitPrice: 11800, subtotal: 35400 },
      { productId: 'mfg-prod-010', productTitle: 'Heavy Duty Gas-Charged Rear Shock Absorber Damper', partNumber: '313-840', oemNumber: '269832000102', quantity: 12, unitPrice: 2400, subtotal: 28800 },
    ],
    totalAmount: 64200,
    totalUnits: 15,
    orderStatus: 'Delivered',
    shipmentStatus: 'Delivered',
    returnStatus: 'None',
    warrantyStatus: 'Active Warranty',
  },
];

// -------------------------------------------------------------
// 4. Realistic Dealers & Sellers Carrying Manufacturer SKUs
// -------------------------------------------------------------
export const INITIAL_DEALERS: ManufacturerDealer[] = [
  {
    id: 'dealer-01',
    dealerName: 'Bosch Direct Auto Distributors',
    dealerType: 'Authorized Distributor',
    contactPerson: 'Suresh Singhania',
    email: 'suresh@boschdirect.in',
    phone: '+91 98450 12345',
    city: 'Bengaluru',
    state: 'Karnataka',
    productsSold: 14,
    unitsSold: 3420,
    revenue: 5820000,
    ordersCount: 312,
    returnRate: 1.2,
    warrantyClaimsCount: 3,
    performanceRating: 4.9,
    trend: 'up',
    contractStatus: 'Active Authorized',
    sinceDate: '2023-01-15',
  },
  {
    id: 'dealer-02',
    dealerName: 'Western India Automotive Wholesale',
    dealerType: 'Certified Wholesaler',
    contactPerson: 'Kailash Mehta',
    email: 'kailash@westernspares.in',
    phone: '+91 98220 54321',
    city: 'Pune',
    state: 'Maharashtra',
    productsSold: 11,
    unitsSold: 2180,
    revenue: 4190000,
    ordersCount: 228,
    returnRate: 1.6,
    warrantyClaimsCount: 4,
    performanceRating: 4.8,
    trend: 'up',
    contractStatus: 'Active Authorized',
    sinceDate: '2023-04-10',
  },
  {
    id: 'dealer-03',
    dealerName: 'Northern Fleet Spares Corp',
    dealerType: 'OEM Partner',
    contactPerson: 'Harpreet Singh',
    email: 'harpreet@northernfleet.in',
    phone: '+91 98110 98765',
    city: 'New Delhi',
    state: 'Delhi NCR',
    productsSold: 18,
    unitsSold: 4200,
    revenue: 7850000,
    ordersCount: 440,
    returnRate: 1.1,
    warrantyClaimsCount: 2,
    performanceRating: 4.95,
    trend: 'up',
    contractStatus: 'Active Authorized',
    sinceDate: '2022-11-01',
  },
  {
    id: 'dealer-04',
    dealerName: 'Tamil Nadu Commercial Components',
    dealerType: 'Authorized Distributor',
    contactPerson: 'P. Murugesan',
    email: 'pmurugesan@tncommercial.in',
    phone: '+91 98400 76543',
    city: 'Chennai',
    state: 'Tamil Nadu',
    productsSold: 12,
    unitsSold: 1940,
    revenue: 3620000,
    ordersCount: 195,
    returnRate: 2.1,
    warrantyClaimsCount: 6,
    performanceRating: 4.7,
    trend: 'stable',
    contractStatus: 'Active Authorized',
    sinceDate: '2023-06-20',
  },
  {
    id: 'dealer-05',
    dealerName: 'Bengal Spare Hub & Transmissions',
    dealerType: 'Verified Retailer',
    contactPerson: 'Subhasish Banerjee',
    email: 'banerjee@bengalspares.in',
    phone: '+91 98300 33221',
    city: 'Kolkata',
    state: 'West Bengal',
    productsSold: 8,
    unitsSold: 980,
    revenue: 1840000,
    ordersCount: 110,
    returnRate: 2.8,
    warrantyClaimsCount: 5,
    performanceRating: 4.4,
    trend: 'down',
    contractStatus: 'Under Audit',
    sinceDate: '2024-02-15',
  },
];

// -------------------------------------------------------------
// 5. Customer Demand Analytics
// -------------------------------------------------------------
export const INITIAL_DEMAND: CustomerDemandAnalytics = {
  topDemandedParts: [
    { partNumber: '0986AB1234', productTitle: 'Ceramic Front Brake Pad Set (Tata Ace / Swift)', oemNumber: '55810M68P00', category: 'Brake', searchCount30d: 8420, unitsRequested: 1640, unmetStockDemand: 180, velocityScore: 94 },
    { partNumber: '828014', productTitle: 'Self-Adjusting Heavy Commercial 310mm Clutch Kit', oemNumber: '252525000118', category: 'Clutch', searchCount30d: 4910, unitsRequested: 620, unmetStockDemand: 65, velocityScore: 88 },
    { partNumber: '09.8968.11', productTitle: 'High-Carbon Ventilated Front Disc Rotor (300mm)', oemNumber: '435120K080', category: 'Brake', searchCount30d: 4120, unitsRequested: 540, unmetStockDemand: 45, velocityScore: 82 },
    { partNumber: 'ZF-CWP-488', productTitle: 'Heavy Commercial Differential Crown Wheel & Pinion', oemNumber: '254735000109', category: 'Differential/Axle', searchCount30d: 3100, unitsRequested: 290, unmetStockDemand: 40, velocityScore: 78 },
    { partNumber: '313-840', productTitle: 'Heavy Duty Gas-Charged Rear Shock Damper', oemNumber: '269832000102', category: 'Suspension', searchCount30d: 2890, unitsRequested: 410, unmetStockDemand: 50, velocityScore: 75 },
    { partNumber: '0986TC7712', productTitle: 'Synchronizer Ring 3rd & 4th Gear (High Torque)', oemNumber: '254726200114', category: 'Gearbox/Transmission', searchCount30d: 2450, unitsRequested: 380, unmetStockDemand: 95, velocityScore: 85 },
  ],
  vehicleDemand: [
    { make: 'Tata', model: 'Ace / Ace Gold', vehicleType: 'commercial', searchCount: 14200, orderCount: 2850, trendPercentage: 18.5 },
    { make: 'Mahindra', model: 'Bolero Maxi Truck / Pik-Up', vehicleType: 'commercial', searchCount: 11400, orderCount: 2120, trendPercentage: 14.2 },
    { make: 'Maruti Suzuki', model: 'Swift / Dzire', vehicleType: 'passenger', searchCount: 9800, orderCount: 1740, trendPercentage: 9.8 },
    { make: 'Tata', model: '407 Light Truck', vehicleType: 'commercial', searchCount: 8900, orderCount: 1480, trendPercentage: 12.1 },
    { make: 'Ashok Leyland', model: 'Dost+ / Bada Dost', vehicleType: 'commercial', searchCount: 7600, orderCount: 1290, trendPercentage: 16.4 },
    { make: 'Hyundai', model: 'Creta', vehicleType: 'passenger', searchCount: 6800, orderCount: 980, trendPercentage: 8.3 },
  ],
  regionalDemand: [
    { region: 'West Region', state: 'Maharashtra', percentage: 28.5, activeOrders: 840 },
    { region: 'North Region', state: 'Delhi NCR & UP', percentage: 24.0, activeOrders: 710 },
    { region: 'South Region', state: 'Tamil Nadu & Karnataka', percentage: 22.8, activeOrders: 680 },
    { region: 'West Region', state: 'Gujarat', percentage: 12.2, activeOrders: 360 },
    { region: 'East Region', state: 'West Bengal', percentage: 8.5, activeOrders: 250 },
    { region: 'Other States', state: 'Rest of India', percentage: 4.0, activeOrders: 120 },
  ],
  categoryDemand: [
    { category: 'Brake', inquiryCount: 19800, growthMoM: 14.8, unfulfilledInquiries: 420 },
    { category: 'Clutch', inquiryCount: 12400, growthMoM: 18.2, unfulfilledInquiries: 290 },
    { category: 'Suspension', inquiryCount: 9600, growthMoM: 11.5, unfulfilledInquiries: 180 },
    { category: 'Gearbox/Transmission', inquiryCount: 8200, growthMoM: 22.4, unfulfilledInquiries: 310 },
    { category: 'Differential/Axle', inquiryCount: 6100, growthMoM: 9.8, unfulfilledInquiries: 140 },
  ],
  monthlyDemandTrend: [
    { month: 'Oct 2025', searchVolume: 28400, inquiries: 4100, convertedOrders: 1850 },
    { month: 'Nov 2025', searchVolume: 31200, inquiries: 4600, convertedOrders: 2100 },
    { month: 'Dec 2025', searchVolume: 34500, inquiries: 5100, convertedOrders: 2350 },
    { month: 'Jan 2026', searchVolume: 38200, inquiries: 5800, convertedOrders: 2700 },
    { month: 'Feb 2026', searchVolume: 42100, inquiries: 6400, convertedOrders: 3050 },
    { month: 'Mar 2026', searchVolume: 46800, inquiries: 7200, convertedOrders: 3520 },
  ],
};

// -------------------------------------------------------------
// 6. Returns & Warranty Claims
// -------------------------------------------------------------
export const INITIAL_RETURNS: ManufacturerReturnRecord[] = [
  {
    id: 'RET-MFG-1082',
    orderId: 'APH-ORD-98240',
    productName: 'Rear Heavy-Duty Wheel Brake Cylinder Pair',
    partNumber: 'GWC1088',
    quantity: 2,
    amount: 2200,
    dealerName: 'Central India Brake & Friction',
    customerName: 'Gurukripa Motors Workshop',
    customerCity: 'Indore',
    reason: 'Manufacturing Defect',
    detailedNotes: 'Bleed screw threading found defective on right side cylinder causing minor brake fluid seepage under initial bench bleeding.',
    requestDate: '2026-09-17',
    status: 'Under Review',
    photoUrls: ['/assets/prod_brakecylinder.jpg'],
  },
  {
    id: 'RET-MFG-1075',
    orderId: 'APH-ORD-97992',
    productName: 'High-Carbon Ventilated Front Brake Disc Rotor (300mm)',
    partNumber: '09.8968.11',
    quantity: 1,
    amount: 3600,
    dealerName: 'Western India Automotive Wholesale',
    customerName: 'Precision Wheel Care Hub',
    customerCity: 'Pune',
    reason: 'Product Not Compatible',
    detailedNotes: 'Customer ordered 300mm rotor for 2015 Scorpio instead of 2022 Scorpio-N which requires 280mm bolt pitch.',
    requestDate: '2026-09-12',
    status: 'Approved for Replacement',
    photoUrls: ['/assets/prod_brakedisc.jpg'],
  },
  {
    id: 'RET-MFG-1061',
    orderId: 'APH-ORD-97640',
    productName: 'Ceramic Front Brake Pad Set',
    partNumber: '0986AB1234',
    quantity: 4,
    amount: 7400,
    dealerName: 'Bengal Spare Hub & Transmissions',
    customerName: 'Kolkata Taxi Syndicate Maintenance',
    customerCity: 'Kolkata',
    reason: 'Wrong Product Received',
    detailedNotes: 'Box labeled for Swift but contained pads for older generation Alto. Channel packing error.',
    requestDate: '2026-09-08',
    status: 'Approved for Refund',
  },
];

export const INITIAL_WARRANTY_CLAIMS: ManufacturerWarrantyClaim[] = [
  {
    id: 'WAR-MFG-504',
    orderId: 'APH-ORD-98240',
    productName: 'Rear Heavy-Duty Wheel Brake Cylinder Pair',
    partNumber: 'GWC1088',
    vehicleDetails: 'Tata Ace Gold (2022) 700cc Dicor Diesel',
    problemDescription: 'Brake cylinder piston stuck in bore after 450 km of highway operation. Driver reported pulling to the left and abnormal brake heating.',
    photoEvidence: ['/assets/prod_brakecylinder.jpg'],
    videoEvidence: 'https://storage.googleapis.com/autopartshub-evidence/war-504-piston-leak.mp4',
    invoiceNumber: 'INV-2026-098240-GST',
    customerName: 'Gurukripa Motors Workshop',
    customerPhone: '+91 94250 88219',
    dealerName: 'Central India Brake & Friction',
    claimDate: '2026-09-18',
    status: 'Technical Inspection',
    outcome: 'Under Review',
    technicalFinding: 'Visual inspection shows microscopic burr near secondary seal groove. Metallurgical failure review initiated with Sholinghur plant.',
  },
  {
    id: 'WAR-MFG-498',
    orderId: 'APH-ORD-97510',
    productName: 'High-Carbon Ventilated Front Brake Disc Rotor (300mm)',
    partNumber: '09.8968.11',
    vehicleDetails: 'Mahindra Scorpio-N Z8 Select (2023) 2.2L mHawk',
    problemDescription: 'Excessive pedal pulsation and runout above 0.08mm after 3,200 km. Wheel hub was cleaned and torqued with calibrated wrench.',
    photoEvidence: ['/assets/prod_brakedisc.jpg'],
    videoEvidence: 'https://storage.googleapis.com/autopartshub-evidence/war-498-dial-gauge-runout.mp4',
    invoiceNumber: 'INV-2026-097510-GST',
    customerName: 'Apex Motor Works Garage',
    customerPhone: '+91 98200 44321',
    dealerName: 'Western India Automotive Wholesale',
    claimDate: '2026-09-04',
    status: 'Resolved',
    outcome: 'Replacement',
    technicalFinding: 'Dial indicator confirms 0.092mm lateral runout due to thermal stress relieving variance in batch B25-04.',
    resolutionNotes: 'Brand authorized immediate replacement pair dispatched directly via Delhivery AWB #DEL-908124.',
  },
  {
    id: 'WAR-MFG-482',
    orderId: 'APH-ORD-97105',
    productName: 'Self-Adjusting Heavy Commercial 310mm Clutch Kit',
    partNumber: '828014',
    vehicleDetails: 'Tata 407 Light Truck (2020) 2956cc 4SPCR',
    problemDescription: 'Pressure plate diaphragm fingers severely bent inward within 8 days of installation. Clutch pedal went completely to the floor.',
    photoEvidence: ['/assets/prod_clutch.jpg'],
    videoEvidence: 'https://storage.googleapis.com/autopartshub-evidence/war-482-diaphragm-bend.mp4',
    invoiceNumber: 'INV-2026-097105-GST',
    customerName: 'Shree Balaji Translines Depot',
    customerPhone: '+91 98900 11223',
    dealerName: 'Northern Fleet Spares Corp',
    claimDate: '2026-08-22',
    status: 'Resolved',
    outcome: 'Credit',
    technicalFinding: 'Incorrect release fork pivot height caused abnormal leverage. Commercial settlement approved as goodwill credit.',
    resolutionNotes: 'Commercial credit note CRN-VAL-2026-88 issued for 100% of part invoice value.',
  },
];

// -------------------------------------------------------------
// 7. Inventory & Stock Movements
// -------------------------------------------------------------
export const INITIAL_INVENTORY: ManufacturerInventoryItem[] = [
  {
    productId: 'mfg-prod-001',
    partNumber: '0986AB1234',
    productTitle: 'Ceramic Low-Dust Front Brake Pad Set (ECE R90 Certified)',
    category: 'Brake',
    currentStock: 840,
    reservedStock: 120,
    availableStock: 720,
    lowStockThreshold: 150,
    status: 'In Stock',
    warehouseLocation: 'Bengaluru Central Distribution Hub (Bin A-14)',
    incomingProductionBatch: { batchNumber: 'BATCH-2026-BP-09', expectedUnits: 500, arrivalDate: '2026-09-28' },
    recentMovements: [
      { id: 'SM-101', date: '2026-09-18', type: 'Dealer Dispatch', quantity: -20, balanceAfter: 840, referenceDoc: 'APH-ORD-98421', notes: 'Dispatched to Kaveri Logistics via Blue Dart' },
      { id: 'SM-102', date: '2026-09-14', type: 'Inward Production', quantity: 400, balanceAfter: 860, referenceDoc: 'MFG-INW-8812', notes: 'Chakan plant weekly production intake' },
      { id: 'SM-103', date: '2026-09-08', type: 'RMA Return', quantity: 4, balanceAfter: 460, referenceDoc: 'RET-MFG-1061', notes: 'Restocked after packaging correction' },
    ],
  },
  {
    productId: 'mfg-prod-002',
    partNumber: '0204AB0982',
    productTitle: 'Dual-Circuit Master Cylinder with Tandem Fluid Reservoir',
    category: 'Brake',
    currentStock: 310,
    reservedStock: 45,
    availableStock: 265,
    lowStockThreshold: 60,
    status: 'In Stock',
    warehouseLocation: 'Pune Logistics Hub (Bin B-03)',
    incomingProductionBatch: { batchNumber: 'BATCH-2026-MC-04', expectedUnits: 200, arrivalDate: '2026-10-02' },
    recentMovements: [
      { id: 'SM-104', date: '2026-09-18', type: 'Dealer Dispatch', quantity: -4, balanceAfter: 310, referenceDoc: 'APH-ORD-98421', notes: 'Dispatched to Kaveri Logistics' },
      { id: 'SM-105', date: '2026-09-10', type: 'Inward Production', quantity: 150, balanceAfter: 314, referenceDoc: 'MFG-INW-8790', notes: 'Bidadi hydraulic plant delivery' },
    ],
  },
  {
    productId: 'mfg-prod-003',
    partNumber: '0986TC7712',
    productTitle: 'High-Torque Synchronizer Ring 3rd & 4th Gear',
    category: 'Gearbox/Transmission',
    currentStock: 45,
    reservedStock: 30,
    availableStock: 15,
    lowStockThreshold: 50,
    status: 'Low Stock',
    warehouseLocation: 'Bengaluru Central Distribution Hub (Bin G-11)',
    incomingProductionBatch: { batchNumber: 'BATCH-2026-SYNC-02', expectedUnits: 300, arrivalDate: '2026-09-24' },
    recentMovements: [
      { id: 'SM-106', date: '2026-09-17', type: 'Dealer Dispatch', quantity: -25, balanceAfter: 45, referenceDoc: 'APH-ORD-98350', notes: 'Dispatched to Northern Fleet Spares' },
      { id: 'SM-107', date: '2026-09-12', type: 'Stock Adjustment', quantity: -5, balanceAfter: 70, referenceDoc: 'ADJ-AUDIT-22', notes: 'Damage found during quarterly audit' },
    ],
  },
  {
    productId: 'mfg-prod-004',
    partNumber: '09.8968.11',
    productTitle: 'High-Carbon Ventilated Front Brake Disc Rotor (300mm)',
    category: 'Brake',
    currentStock: 480,
    reservedStock: 70,
    availableStock: 410,
    lowStockThreshold: 100,
    status: 'In Stock',
    warehouseLocation: 'Pune Chakan Plant Warehouse (Rack R-04)',
    incomingProductionBatch: { batchNumber: 'BATCH-2026-HC-11', expectedUnits: 400, arrivalDate: '2026-09-29' },
    recentMovements: [
      { id: 'SM-108', date: '2026-09-17', type: 'Dealer Dispatch', quantity: -8, balanceAfter: 480, referenceDoc: 'APH-ORD-98380', notes: 'Dispatched to Brembo Hub West' },
      { id: 'SM-109', date: '2026-09-05', type: 'Inward Production', quantity: 300, balanceAfter: 488, referenceDoc: 'MFG-INW-8711', notes: 'Foundry heat casting #22' },
    ],
  },
];

// -------------------------------------------------------------
// 8. Notifications
// -------------------------------------------------------------
export const INITIAL_NOTIFICATIONS: ManufacturerNotification[] = [
  {
    id: 'notif-01',
    type: 'order',
    title: 'New High-Volume Order Placed',
    message: 'Kaveri Logistics Depot placed order #APH-ORD-98421 for 24 units totaling ₹50,800 through Bosch Direct.',
    timestamp: '25 mins ago',
    read: false,
    priority: 'high',
    targetTab: 'orders',
  },
  {
    id: 'notif-02',
    type: 'low_stock',
    title: 'Low Stock Alert: Synchronizer Ring',
    message: 'Part #0986TC7712 stock has fallen to 15 available units (Threshold: 50). Scheduled production arrival: Sept 24.',
    timestamp: '2 hours ago',
    read: false,
    priority: 'urgent',
    targetTab: 'inventory',
  },
  {
    id: 'notif-03',
    type: 'warranty',
    title: 'Warranty Claim Filed: Wheel Brake Cylinder',
    message: 'Gurukripa Motors filed claim #WAR-MFG-504 for Part #GWC1088 on Tata Ace Gold. Inspection pending.',
    timestamp: '5 hours ago',
    read: false,
    priority: 'high',
    targetTab: 'returns-warranty',
  },
  {
    id: 'notif-04',
    type: 'demand',
    title: 'Spike in Demand for Brake Pads (Maharashtra)',
    message: 'Search volume for Tata Ace front brake pads increased by +34% week-on-week across Pune and Mumbai.',
    timestamp: '1 day ago',
    read: true,
    priority: 'normal',
    targetTab: 'demand',
  },
  {
    id: 'notif-05',
    type: 'dealer',
    title: 'Quarterly Dealer Audit Flag',
    message: 'Bengal Spare Hub & Transmissions return rate reached 2.8%, exceeding 2.0% SLA. Review recommended.',
    timestamp: '2 days ago',
    read: true,
    priority: 'normal',
    targetTab: 'dealers',
  },
];

// -------------------------------------------------------------
// 9. Reactive Manufacturer Service Singleton
// -------------------------------------------------------------
class ManufacturerService {
  private activeBrandId: string = 'mfg-bosch';
  private products: ManufacturerProduct[] = [...INITIAL_PRODUCTS];
  private orders: ManufacturerOrder[] = [...INITIAL_ORDERS];
  private dealers: ManufacturerDealer[] = [...INITIAL_DEALERS];
  private demand: CustomerDemandAnalytics = { ...INITIAL_DEMAND };
  private returns: ManufacturerReturnRecord[] = [...INITIAL_RETURNS];
  private warrantyClaims: ManufacturerWarrantyClaim[] = [...INITIAL_WARRANTY_CLAIMS];
  private inventory: ManufacturerInventoryItem[] = [...INITIAL_INVENTORY];
  private notifications: ManufacturerNotification[] = [...INITIAL_NOTIFICATIONS];
  private brandProfiles: Record<string, ManufacturerBrandProfile> = { ...BRAND_PROFILES };
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('aph_mfg_active_brand', this.activeBrandId);
      localStorage.setItem('aph_mfg_products', JSON.stringify(this.products));
      localStorage.setItem('aph_mfg_returns', JSON.stringify(this.returns));
      localStorage.setItem('aph_mfg_warranty', JSON.stringify(this.warrantyClaims));
      localStorage.setItem('aph_mfg_inventory', JSON.stringify(this.inventory));
      localStorage.setItem('aph_mfg_notifications', JSON.stringify(this.notifications));
    } catch {
      // ignore storage errors
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const savedBrand = localStorage.getItem('aph_mfg_active_brand');
      if (savedBrand && this.brandProfiles[savedBrand]) {
        this.activeBrandId = savedBrand;
      }
      const savedProducts = localStorage.getItem('aph_mfg_products');
      if (savedProducts) {
        this.products = JSON.parse(savedProducts);
      }
      const savedReturns = localStorage.getItem('aph_mfg_returns');
      if (savedReturns) {
        this.returns = JSON.parse(savedReturns);
      }
      const savedWarranty = localStorage.getItem('aph_mfg_warranty');
      if (savedWarranty) {
        this.warrantyClaims = JSON.parse(savedWarranty);
      }
      const savedInventory = localStorage.getItem('aph_mfg_inventory');
      if (savedInventory) {
        this.inventory = JSON.parse(savedInventory);
      }
      const savedNotifs = localStorage.getItem('aph_mfg_notifications');
      if (savedNotifs) {
        this.notifications = JSON.parse(savedNotifs);
      }
    } catch {
      // fallback to initial
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(l => l());
  }

  // --- Brand Switcher & Profile ---
  public getBrands(): ManufacturerBrandProfile[] {
    return Object.values(this.brandProfiles);
  }

  public getActiveBrand(): ManufacturerBrandProfile {
    return this.brandProfiles[this.activeBrandId] || this.brandProfiles['mfg-bosch'];
  }

  public setActiveBrand(brandId: string) {
    if (this.brandProfiles[brandId]) {
      this.activeBrandId = brandId;
      this.notify();
    }
  }

  public updateProfile(updates: Partial<ManufacturerBrandProfile>) {
    const current = this.getActiveBrand();
    this.brandProfiles[current.id] = { ...current, ...updates };
    this.notify();
  }

  // --- KPIs ---
  public getKPIs(): ManufacturerKPISummary {
    const brand = this.getActiveBrand();
    const brandProducts = this.products.filter(p => p.brandId === brand.id || p.brand.toLowerCase() === brand.shortName.toLowerCase());
    const activeProducts = brandProducts.filter(p => p.status === 'Active');
    const lowStock = brandProducts.filter(p => p.stock.available <= p.stock.lowStockThreshold).length;

    const brandOrders = this.orders;
    const totalOrders = brandOrders.length;
    const salesRevenue = brandOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const unitsSold = brandOrders.reduce((acc, o) => acc + o.totalUnits, 0);
    const pendingReturns = this.returns.filter(r => r.status === 'Under Review' || r.status === 'Inspection Scheduled').length;
    const warrantyClaims = this.warrantyClaims.filter(w => w.status !== 'Resolved').length;

    return {
      totalProducts: brandProducts.length,
      activeProducts: activeProducts.length,
      totalOrders: totalOrders + 1420, // baseline plus active
      salesRevenue: salesRevenue + 12840000,
      unitsSold: unitsSold + 8650,
      dealerCount: this.dealers.length,
      customerDemandIndex: 94,
      pendingReturns,
      warrantyClaims,
      lowStockProducts: lowStock,
    };
  }

  // --- Products CRUD ---
  public getProducts(): ManufacturerProduct[] {
    const brand = this.getActiveBrand();
    return this.products.filter(p => p.brandId === brand.id || p.brand.toLowerCase() === brand.shortName.toLowerCase());
  }

  public getAllProductsAcrossBrands(): ManufacturerProduct[] {
    return this.products;
  }

  public getProductById(id: string): ManufacturerProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  public addProduct(newProd: Omit<ManufacturerProduct, 'id' | 'createdAt' | 'unitsSoldTotal' | 'activeDealersCount' | 'rating'>): ManufacturerProduct {
    const brand = this.getActiveBrand();
    const product: ManufacturerProduct = {
      ...newProd,
      id: `mfg-prod-${Date.now().toString().slice(-6)}`,
      brand: brand.shortName,
      brandId: brand.id,
      unitsSoldTotal: 0,
      activeDealersCount: 1,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.products.unshift(product);

    // Sync into inventory item
    const invItem: ManufacturerInventoryItem = {
      productId: product.id,
      partNumber: product.partNumber,
      productTitle: product.title,
      category: product.category,
      currentStock: product.stock.current,
      reservedStock: product.stock.reserved,
      availableStock: product.stock.available,
      lowStockThreshold: product.stock.lowStockThreshold,
      status: product.stock.available <= product.stock.lowStockThreshold ? 'Low Stock' : 'In Stock',
      warehouseLocation: product.stock.warehouseLocation,
      incomingProductionBatch: null,
      recentMovements: [
        {
          id: `SM-${Date.now().toString().slice(-5)}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Inward Production',
          quantity: product.stock.current,
          balanceAfter: product.stock.current,
          referenceDoc: 'INITIAL-CATALOGUE-LOAD',
          notes: 'Initial production catalogue onboarding batch',
        },
      ],
    };
    this.inventory.unshift(invItem);

    this.notify();
    return product;
  }

  public updateProduct(id: string, updates: Partial<ManufacturerProduct>): boolean {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.products[idx] = { ...this.products[idx], ...updates };

    // sync inventory
    const invIdx = this.inventory.findIndex(i => i.productId === id);
    if (invIdx !== -1 && updates.stock) {
      this.inventory[invIdx] = {
        ...this.inventory[invIdx],
        currentStock: updates.stock.current,
        reservedStock: updates.stock.reserved,
        availableStock: updates.stock.available,
        lowStockThreshold: updates.stock.lowStockThreshold,
        warehouseLocation: updates.stock.warehouseLocation,
        status: updates.stock.available <= updates.stock.lowStockThreshold ? 'Low Stock' : 'In Stock',
      };
    }

    this.notify();
    return true;
  }

  public toggleProductStatus(id: string): boolean {
    const prod = this.getProductById(id);
    if (!prod) return false;
    const newStatus = prod.status === 'Active' ? 'Inactive' : 'Active';
    return this.updateProduct(id, { status: newStatus });
  }

  public deleteProduct(id: string): boolean {
    const initLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    this.inventory = this.inventory.filter(i => i.productId !== id);
    if (this.products.length !== initLen) {
      this.notify();
      return true;
    }
    return false;
  }

  // --- Orders ---
  public getOrders(): ManufacturerOrder[] {
    return this.orders;
  }

  public getOrderById(id: string): ManufacturerOrder | undefined {
    return this.orders.find(o => o.id === id);
  }

  // --- Dealers ---
  public getDealers(): ManufacturerDealer[] {
    return this.dealers;
  }

  public getDealerById(id: string): ManufacturerDealer | undefined {
    return this.dealers.find(d => d.id === id);
  }

  // --- Demand ---
  public getDemandAnalytics(): CustomerDemandAnalytics {
    return this.demand;
  }

  // --- Returns & Warranty ---
  public getReturns(): ManufacturerReturnRecord[] {
    return this.returns;
  }

  public updateReturnStatus(id: string, status: ManufacturerReturnRecord['status']): boolean {
    const idx = this.returns.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.returns[idx] = { ...this.returns[idx], status };
    this.notify();
    return true;
  }

  public getWarrantyClaims(): ManufacturerWarrantyClaim[] {
    return this.warrantyClaims;
  }

  public updateWarrantyOutcome(
    id: string,
    outcome: ManufacturerWarrantyOutcome,
    resolutionNotes?: string,
    technicalFinding?: string
  ): boolean {
    const idx = this.warrantyClaims.findIndex(w => w.id === id);
    if (idx === -1) return false;
    this.warrantyClaims[idx] = {
      ...this.warrantyClaims[idx],
      outcome,
      status: outcome === 'Under Review' ? 'Technical Inspection' : 'Resolved',
      resolutionNotes: resolutionNotes || this.warrantyClaims[idx].resolutionNotes,
      technicalFinding: technicalFinding || this.warrantyClaims[idx].technicalFinding,
    };
    this.notify();
    return true;
  }

  // --- Inventory ---
  public getInventoryItems(): ManufacturerInventoryItem[] {
    return this.inventory;
  }

  public adjustStock(
    productId: string,
    quantityDelta: number,
    movementType: 'Inward Production' | 'Stock Adjustment',
    notes: string,
    refDoc: string = 'MANUAL-ADJUSTMENT'
  ): boolean {
    const invIdx = this.inventory.findIndex(i => i.productId === productId);
    if (invIdx === -1) return false;

    const item = this.inventory[invIdx];
    const newCurrent = Math.max(0, item.currentStock + quantityDelta);
    const newAvailable = Math.max(0, newCurrent - item.reservedStock);

    const movement: StockMovement = {
      id: `SM-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      type: movementType,
      quantity: quantityDelta,
      balanceAfter: newCurrent,
      referenceDoc: refDoc,
      notes,
    };

    this.inventory[invIdx] = {
      ...item,
      currentStock: newCurrent,
      availableStock: newAvailable,
      status: newAvailable === 0 ? 'Out of Stock' : newAvailable <= item.lowStockThreshold ? 'Low Stock' : 'In Stock',
      recentMovements: [movement, ...item.recentMovements.slice(0, 9)],
    };

    // Update product stock as well
    const prodIdx = this.products.findIndex(p => p.id === productId);
    if (prodIdx !== -1) {
      this.products[prodIdx].stock.current = newCurrent;
      this.products[prodIdx].stock.available = newAvailable;
      this.products[prodIdx].status = newAvailable === 0 ? 'Out of Stock' : newAvailable <= item.lowStockThreshold ? 'Low Stock' : 'Active';
    }

    this.notify();
    return true;
  }

  // --- Revenue & Sales Analytics ---
  public getRevenueAnalytics(range: RevenueDateFilter = '30d'): RevenueAnalytics {
    const multiplier = range === 'today' ? 0.04 : range === '7d' ? 0.25 : range === '30d' ? 1.0 : range === '90d' ? 2.8 : 10.4;
    const baseRev = 1845000;
    const totalRev = Math.round(baseRev * multiplier);
    const totalUnits = Math.round(1420 * multiplier);

    return {
      dateFilter: range,
      totalRevenue: totalRev,
      productSalesAmount: Math.round(totalRev * 0.94),
      totalUnitsSold: totalUnits,
      averageOrderValue: Math.round(totalRev / Math.max(1, Math.round(totalUnits / 4.2))),
      revenueByCategory: [
        { category: 'Brake Systems', revenue: Math.round(totalRev * 0.44), percentage: 44 },
        { category: 'Clutch & Drivetrain', revenue: Math.round(totalRev * 0.26), percentage: 26 },
        { category: 'Suspension & Steering', revenue: Math.round(totalRev * 0.14), percentage: 14 },
        { category: 'Gearbox & Transmission', revenue: Math.round(totalRev * 0.10), percentage: 10 },
        { category: 'Differential & Axle', revenue: Math.round(totalRev * 0.06), percentage: 6 },
      ],
      revenueByTopProducts: [
        { partNumber: '0986AB1234', productTitle: 'Ceramic Front Brake Pad Set (Tata Ace / Swift)', units: Math.round(520 * multiplier), revenue: Math.round(totalRev * 0.28) },
        { partNumber: '828014', productTitle: 'Heavy Commercial 310mm Clutch Kit', units: Math.round(180 * multiplier), revenue: Math.round(totalRev * 0.24) },
        { partNumber: '09.8968.11', productTitle: 'High-Carbon Ventilated Front Disc Rotor', units: Math.round(210 * multiplier), revenue: Math.round(totalRev * 0.19) },
        { partNumber: 'GWC1088', productTitle: 'Rear Wheel Brake Cylinder Pair', units: Math.round(440 * multiplier), revenue: Math.round(totalRev * 0.15) },
        { partNumber: 'ZF-CWP-488', productTitle: 'Commercial Differential Crown Wheel & Pinion', units: Math.round(60 * multiplier), revenue: Math.round(totalRev * 0.14) },
      ],
      revenueByTopDealers: [
        { dealerName: 'Northern Fleet Spares Corp', city: 'New Delhi', revenue: Math.round(totalRev * 0.32), orderCount: Math.round(92 * multiplier) },
        { dealerName: 'Bosch Direct Auto Distributors', city: 'Bengaluru', revenue: Math.round(totalRev * 0.28), orderCount: Math.round(84 * multiplier) },
        { dealerName: 'Western India Automotive Wholesale', city: 'Pune', revenue: Math.round(totalRev * 0.20), orderCount: Math.round(60 * multiplier) },
        { dealerName: 'Tamil Nadu Commercial Components', city: 'Chennai', revenue: Math.round(totalRev * 0.12), orderCount: Math.round(38 * multiplier) },
        { dealerName: 'Bengal Spare Hub & Transmissions', city: 'Kolkata', revenue: Math.round(totalRev * 0.08), orderCount: Math.round(24 * multiplier) },
      ],
      monthlyRevenueTrend: [
        { month: 'Oct', revenue: 1420000, units: 1120, target: 1300000 },
        { month: 'Nov', revenue: 1560000, units: 1240, target: 1450000 },
        { month: 'Dec', revenue: 1720000, units: 1390, target: 1600000 },
        { month: 'Jan', revenue: 1890000, units: 1480, target: 1750000 },
        { month: 'Feb', revenue: 2050000, units: 1620, target: 1900000 },
        { month: 'Mar', revenue: 2280000, units: 1790, target: 2100000 },
      ],
    };
  }

  // --- Notifications ---
  public getNotifications(): ManufacturerNotification[] {
    return this.notifications;
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public markNotificationAsRead(id: string) {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.notifications[idx].read = true;
      this.notify();
    }
  }

  public markAllNotificationsAsRead() {
    this.notifications.forEach(n => {
      n.read = true;
    });
    this.notify();
  }
}

export const manufacturerService = new ManufacturerService();
