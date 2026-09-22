import { Product } from '../types';
import { VERIFIED_SELLERS } from './sellers';

export const ALL_PRODUCTS: Product[] = [
  // -------------------------------------------------------------
  // 1. BRAKE PARTS (8 Products)
  // -------------------------------------------------------------
  {
    id: 'prod-001',
    title: 'Brake Pad Set (Front Axle)',
    brand: 'Bosch',
    partNumber: '0986AB1234',
    oemNumber: '55810M68P00',
    category: 'brake-parts',
    subCategory: 'Brake Pads',
    partType: 'Genuine',
    price: 2499,
    mrp: 3200,
    discountPercentage: 22,
    rating: 4.8,
    reviewCount: 1240,
    inStock: true,
    stockCount: 48,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_brakepad.jpg'],
    description: 'High-performance ceramic brake pad set engineered for superior stopping power and reduced rotor wear.',
    features: [
      'ECE R90 certified compound',
      'Low dust ceramic formulation',
      'Sound dampening anti-squeal shims included'
    ],
    specifications: {
      'Friction Material': 'Advanced Ceramic NAO',
      'Thickness': '16.8 mm',
      'Axle Position': 'Front Axle (Left & Right)'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2015 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L DualJet' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L CRDi' }
    ],
    seller: VERIFIED_SELLERS['bosch-direct'],
    warranty: '12 Months / 20,000 km Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'prod-004',
    title: 'High-Carbon Ventilated Brake Disc Rotor',
    brand: 'Brembo',
    partNumber: '09.8968.11',
    oemNumber: '435120K080',
    category: 'brake-parts',
    subCategory: 'Brake Discs',
    partType: 'Genuine',
    price: 4999,
    mrp: 6100,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 980,
    inStock: true,
    stockCount: 26,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_disc.jpg'],
    description: 'High carbon ventilated front brake disc rotor providing superior heat dissipation and zero judder.',
    features: [
      'High carbon metallurgy',
      'Pillar venting technology',
      'Anti-corrosion UV coated hat'
    ],
    specifications: {
      'Diameter': '296 mm',
      'Nominal Thickness': '28 mm',
      'Centering Diameter': '68 mm'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2015 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Toyota', model: 'Innova Crysta', yearRange: '2016 - 2024', engine: '2.4L GD Diesel' },
      { manufacturer: 'Mahindra', model: 'Scorpio-N', yearRange: '2022 - 2024', engine: '2.2L mHawk' }
    ],
    seller: VERIFIED_SELLERS['brembo-india'],
    warranty: '12 Months Anti-Warp Guarantee',
    returnDays: 10,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'prod-007',
    title: 'Hydraulic Brake Caliper Assembly (Front Right)',
    brand: 'TVS Girling',
    partNumber: 'TVS-BC-7721',
    oemNumber: '280442100155',
    category: 'brake-parts',
    subCategory: 'Brake Caliper',
    partType: 'OEM',
    price: 3650,
    mrp: 4400,
    discountPercentage: 17,
    rating: 4.7,
    reviewCount: 420,
    inStock: true,
    stockCount: 15,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_brake.jpg'],
    description: 'OEM single piston floating caliper with anti-corrosion zinc plating and pre-lubricated guide pins.',
    features: [
      'Pre-assembled with EPDM rubber seals',
      'Chromium plated alloy piston',
      'High temperature bleed screw'
    ],
    specifications: {
      'Piston Diameter': '54 mm',
      'Position': 'Front Right',
      'Brake System': 'Girling Floating'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2015 - 2024', engine: '1.5L mHawk75' }
    ],
    seller: VERIFIED_SELLERS['tvs-girling'],
    warranty: '18 Months / 30,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-008',
    title: 'Tandem Brake Master Cylinder with Reservoir',
    brand: 'Bosch',
    partNumber: '0204123891',
    oemNumber: '51100M79G00',
    category: 'brake-parts',
    subCategory: 'Master Cylinder',
    partType: 'Genuine',
    price: 2850,
    mrp: 3500,
    discountPercentage: 19,
    rating: 4.6,
    reviewCount: 310,
    inStock: true,
    stockCount: 22,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_brake.jpg'],
    description: 'Precision bored aluminum master cylinder providing linear pedal response and dual circuit safety.',
    features: [
      'Hard anodized internal bore',
      'UV-stabilized transparent fluid reservoir',
      'Integrated fluid level warning sensor'
    ],
    specifications: {
      'Bore Diameter': '20.64 mm',
      'Ports': 'M10 x 1.0 (2 Ports)',
      'Material': 'Cast Aluminum'
    },
    compatibility: [
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2019 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['bosch-direct'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-009',
    title: 'Heavy Duty Rear Brake Shoe Set (Axle Set)',
    brand: 'Brembo',
    partNumber: 'S85512',
    oemNumber: '53200M68P00',
    category: 'brake-parts',
    subCategory: 'Brake Shoes',
    partType: 'Aftermarket',
    price: 1650,
    mrp: 2100,
    discountPercentage: 21,
    rating: 4.5,
    reviewCount: 560,
    inStock: true,
    stockCount: 65,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_brakepad.jpg'],
    description: 'Bonded organic brake shoes formulated for commercial haulage and passenger car drum brake systems.',
    features: [
      'High thermal stability lining',
      'Anti-rust coated steel shoe body',
      'Includes lever and spring clips'
    ],
    specifications: {
      'Drum Diameter': '200 mm',
      'Shoe Width': '36 mm',
      'Axle Position': 'Rear Axle'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L Turbo' }
    ],
    seller: VERIFIED_SELLERS['brembo-india'],
    warranty: '6 Months / 10,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-010',
    title: 'Ceramic Low-Dust Rear Brake Pad Set',
    brand: 'Bosch',
    partNumber: '0986AB4492',
    oemNumber: '583021WA00',
    category: 'brake-parts',
    subCategory: 'Brake Pads',
    partType: 'OEM',
    price: 2150,
    mrp: 2700,
    discountPercentage: 20,
    rating: 4.7,
    reviewCount: 480,
    inStock: true,
    stockCount: 38,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_brakepad.jpg'],
    description: 'Precision molded ceramic rear brake pads for SUVs and modern sedans with electronic parking brakes.',
    features: [
      'Integrated acoustic wear sensor',
      'Chamfered and slotted friction face',
      'Consistent pedal bite in wet conditions'
    ],
    specifications: {
      'Friction Material': 'Ceramic NAO',
      'Thickness': '15.2 mm',
      'Axle Position': 'Rear Axle'
    },
    compatibility: [
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2019 - 2024', engine: '1.5L Diesel' },
      { manufacturer: 'Kia', model: 'Seltos', yearRange: '2019 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['bosch-direct'],
    warranty: '12 Months / 20,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-011',
    title: 'Reinforced Stainless Steel Braided Brake Hose Set',
    brand: 'TVS Girling',
    partNumber: 'TVS-BH-991',
    oemNumber: '51540M68P00',
    category: 'brake-parts',
    subCategory: 'Brake Lines & Hoses',
    partType: 'Aftermarket',
    price: 1350,
    mrp: 1750,
    discountPercentage: 23,
    rating: 4.6,
    reviewCount: 290,
    inStock: true,
    stockCount: 45,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_brake.jpg'],
    description: 'PTFE lined brake hose with stainless steel overbraid eliminating spongy pedal feel under heavy load.',
    features: [
      'Burst pressure rated to 400 bar',
      'Zinc-plated steel end banjo fittings',
      'DOT 4 & DOT 5.1 fluid compatible'
    ],
    specifications: {
      'Length': '465 mm',
      'Fittings': 'Banjo 10 mm / M10x1 Female',
      'Operating Pressure': '250 bar'
    },
    compatibility: [
      { manufacturer: 'Mahindra', model: 'Thar', yearRange: '2020 - 2024', engine: '2.2L mHawk' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['tvs-girling'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-012',
    title: 'Front Slotted High-Performance Disc Pair',
    brand: 'Brembo',
    partNumber: '09.A115.1X',
    oemNumber: '4351233090',
    category: 'brake-parts',
    subCategory: 'Brake Discs',
    partType: 'Genuine',
    price: 7499,
    mrp: 9200,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 640,
    inStock: true,
    stockCount: 18,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_disc.jpg'],
    description: 'Xtra drilled and slotted performance brake rotors providing immediate gas evacuation and pad scrubbing.',
    features: [
      'Directional curved cooling vanes',
      'High manganese alloy iron',
      'Dynamic balance checked'
    ],
    specifications: {
      'Diameter': '310 mm',
      'Thickness': '32 mm',
      'Hole Count': '5'
    },
    compatibility: [
      { manufacturer: 'Toyota', model: 'Innova Crysta', yearRange: '2016 - 2024', engine: '2.4L Diesel' },
      { manufacturer: 'Toyota', model: 'Fortuner', yearRange: '2016 - 2024', engine: '2.8L Diesel' }
    ],
    seller: VERIFIED_SELLERS['brembo-india'],
    warranty: '24 Months / 40,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: true
  },

  // -------------------------------------------------------------
  // 2. CLUTCH PARTS (7 Products)
  // -------------------------------------------------------------
  {
    id: 'prod-002',
    title: 'Complete 3-Piece Heavy Duty Clutch Kit',
    brand: 'Valeo',
    partNumber: '635021',
    oemNumber: '270225000109',
    category: 'clutch-parts',
    subCategory: 'Clutch Kit',
    partType: 'OEM',
    price: 8499,
    mrp: 9999,
    discountPercentage: 15,
    rating: 4.8,
    reviewCount: 890,
    inStock: true,
    stockCount: 19,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_clutchkit.jpg'],
    description: 'Complete 3-piece heavy duty clutch kit including friction disc, pressure plate, and release bearing.',
    features: [
      'Torsional damper springs tuned for low NVH',
      'High copper-content organic friction lining',
      'OE concentric slave bearing included'
    ],
    specifications: {
      'Diameter': '215 mm',
      'Spline Count': '21 Teeth',
      'Hub Profile': '21x24.5'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2015 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L Turbo' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2016 - 2024', engine: '1.5L mHawk' }
    ],
    seller: VERIFIED_SELLERS['valeo-national'],
    warranty: '18 Months / 30,000 km Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'prod-005',
    title: 'Self-Adjusting Clutch Pressure Plate Assembly',
    brand: 'LUK',
    partNumber: '123 3048 09',
    oemNumber: '280225000188',
    category: 'clutch-parts',
    subCategory: 'Pressure Plate',
    partType: 'OEM',
    price: 3999,
    mrp: 4800,
    discountPercentage: 17,
    rating: 4.7,
    reviewCount: 760,
    inStock: true,
    stockCount: 42,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_pressureplate.jpg'],
    description: 'Self-adjusting clutch pressure plate with high clamping force and smooth modulation.',
    features: [
      'Self-adjusting ramp rings',
      'Reduced pedal effort',
      'Factory dynamically balanced'
    ],
    specifications: {
      'Diameter': '200 mm',
      'Clamping Force': '4800 N',
      'Diaphragm Spring': 'Shot-peened Spring Steel'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2015 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L' }
    ],
    seller: VERIFIED_SELLERS['luk-powertrain'],
    warranty: '12 Months / 25,000 km Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'prod-013',
    title: 'Hydraulic Concentric Clutch Slave Cylinder (CSC)',
    brand: 'LUK',
    partNumber: '510 0073 10',
    oemNumber: '23820M68P00',
    category: 'clutch-parts',
    subCategory: 'Slave Cylinder',
    partType: 'Genuine',
    price: 3150,
    mrp: 3800,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 390,
    inStock: true,
    stockCount: 28,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_clutch.jpg'],
    description: 'Integrated concentric slave cylinder and angular contact release bearing in reinforced polyamide casing.',
    features: [
      'Direct bellhousing mounting',
      'Zero maintenance pre-greased bearing',
      'Self-aligning bearing face'
    ],
    specifications: {
      'Operating Fluid': 'Brake Fluid DOT 4',
      'Casing Material': 'High strength PA66-GF30',
      'Stroke': '18 mm'
    },
    compatibility: [
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L Diesel' }
    ],
    seller: VERIFIED_SELLERS['luk-powertrain'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-014',
    title: 'Organic Heavy-Duty Clutch Friction Disc Plate',
    brand: 'Valeo',
    partNumber: '802791',
    oemNumber: '270225000140',
    category: 'clutch-parts',
    subCategory: 'Clutch Disc',
    partType: 'Aftermarket',
    price: 2650,
    mrp: 3300,
    discountPercentage: 20,
    rating: 4.6,
    reviewCount: 510,
    inStock: true,
    stockCount: 50,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_clutch.jpg'],
    description: 'Replacement organic clutch driven plate with 6 heavy-duty dual-rate damper springs for quiet idling.',
    features: [
      'Asbestos-free high friction facing',
      'Cushioned segment construction for progressive engagement',
      'Hardened spline teeth hub'
    ],
    specifications: {
      'Diameter': '200 mm',
      'Spline Count': '18',
      'Facing Material': 'Valeo F810 Organic'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['valeo-national'],
    warranty: '12 Months / 20,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-015',
    title: 'Dual Mass Flywheel (DMF) Powertrain Assembly',
    brand: 'LUK',
    partNumber: '415 0524 10',
    oemNumber: '280203100118',
    category: 'clutch-parts',
    subCategory: 'Flywheel',
    partType: 'Genuine',
    price: 18500,
    mrp: 22500,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 180,
    inStock: true,
    stockCount: 11,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_clutchkit.jpg'],
    description: 'Precision balanced dual mass flywheel absorbing torsional engine crankshaft vibrations in modern diesels.',
    features: [
      'Dual arc spring dampening system',
      'Integrated starter ring gear',
      'Prevents gearbox gear rattle and fatigue'
    ],
    specifications: {
      'Ring Gear Teeth': '115',
      'Weight': '11.8 kg',
      'Mounting Bolt Holes': '6'
    },
    compatibility: [
      { manufacturer: 'Mahindra', model: 'Thar', yearRange: '2020 - 2024', engine: '2.2L mHawk' },
      { manufacturer: 'Mahindra', model: 'Scorpio-N', yearRange: '2022 - 2024', engine: '2.2L' },
      { manufacturer: 'Tata', model: 'Harrier', yearRange: '2019 - 2024', engine: '2.0L Kryotec' }
    ],
    seller: VERIFIED_SELLERS['luk-powertrain'],
    warranty: '24 Months / 50,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: true
  },
  {
    id: 'prod-016',
    title: 'Self-Centering Clutch Release Bearing Unit',
    brand: 'SKF',
    partNumber: 'VKC 3514',
    oemNumber: '0926933005',
    category: 'clutch-parts',
    subCategory: 'Release Bearing',
    partType: 'OEM',
    price: 1150,
    mrp: 1450,
    discountPercentage: 21,
    rating: 4.7,
    reviewCount: 680,
    inStock: true,
    stockCount: 72,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_clutch.jpg'],
    description: 'Self-centering angular contact ball thrust bearing designed to compensate for angular misalignment.',
    features: [
      'High temperature synthetic grease filling',
      'Low friction nylon cage',
      'Reinforced steel sliding sleeve'
    ],
    specifications: {
      'Inner Diameter': '32 mm',
      'Width': '22 mm',
      'Dynamic Load': '14.2 kN'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2015 - 2024', engine: '1.2L' }
    ],
    seller: VERIFIED_SELLERS['skf-bearings'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-017',
    title: 'Clutch Master Cylinder Assembly (Firewall Mount)',
    brand: 'Valeo',
    partNumber: '874402',
    oemNumber: '23810M68P00',
    category: 'clutch-parts',
    subCategory: 'Master Cylinder',
    partType: 'Aftermarket',
    price: 1950,
    mrp: 2450,
    discountPercentage: 20,
    rating: 4.6,
    reviewCount: 340,
    inStock: true,
    stockCount: 35,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_clutch.jpg'],
    description: 'Compact plastic composite master cylinder with quick-release hydraulic clip coupling.',
    features: [
      'Corrosion free lightweight housing',
      'Low pedal effort return spring',
      'Pre-bled and factory tested'
    ],
    specifications: {
      'Bore Size': '15.87 mm',
      'Connection': 'Quick Connect 9.89 mm',
      'Fluid': 'DOT 4'
    },
    compatibility: [
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L CRDi' },
      { manufacturer: 'Kia', model: 'Seltos', yearRange: '2019 - 2024', engine: '1.5L Diesel' }
    ],
    seller: VERIFIED_SELLERS['valeo-national'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },

  // -------------------------------------------------------------
  // 3. SUSPENSION PARTS (7 Products)
  // -------------------------------------------------------------
  {
    id: 'prod-003',
    title: 'Twin-Tube Gas Shock Absorber (Front Left/Right)',
    brand: 'KYB',
    partNumber: '3390701',
    oemNumber: '280432100142',
    category: 'suspension',
    subCategory: 'Shock Absorber',
    partType: 'Aftermarket',
    price: 3250,
    mrp: 4100,
    discountPercentage: 21,
    rating: 4.7,
    reviewCount: 630,
    inStock: true,
    stockCount: 34,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_shock.jpg'],
    description: 'High pressure gas-charged twin tube shock absorber for smooth ride comfort and wheel control.',
    features: [
      'Nitrogen gas pressurized for zero aeration',
      'Hard chromed piston rod',
      'Seamless cylinder body construction'
    ],
    specifications: {
      'Type': 'Gas Pressure Twin Tube',
      'Position': 'Front Left / Right',
      'Mounting': 'Top Pin / Bottom Eye'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2015 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Mahindra', model: 'Thar', yearRange: '2020 - 2024', engine: '2.2L mHawk' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2016 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['kyb-suspension'],
    warranty: '24 Months Replacement Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'prod-018',
    title: 'Heavy Duty Front Strut Assembly with Coil Spring',
    brand: 'Monroe',
    partNumber: 'MN-742018',
    oemNumber: '41601M68P00',
    category: 'suspension',
    subCategory: 'Strut Assembly',
    partType: 'OEM',
    price: 4850,
    mrp: 5900,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 520,
    inStock: true,
    stockCount: 24,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_suspension.jpg'],
    description: 'Complete pre-assembled strut with progressive rate coil spring, upper mount, and dust boot.',
    features: [
      'Velocity proportional valving (VPV)',
      'High strength micro-alloy spring steel',
      'Quick bolt-on installation without spring compressor'
    ],
    specifications: {
      'Extended Length': '520 mm',
      'Collapsed Length': '360 mm',
      'Spring Rate': '28 N/mm'
    },
    compatibility: [
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L DualJet' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['monroe-ride'],
    warranty: '24 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: true
  },
  {
    id: 'prod-019',
    title: 'Front Lower Control Arm with Ball Joint & Bushings',
    brand: 'Talbros',
    partNumber: 'TAL-LCA-309',
    oemNumber: '545001W000',
    category: 'suspension',
    subCategory: 'Control Arm',
    partType: 'Genuine',
    price: 2350,
    mrp: 2950,
    discountPercentage: 20,
    rating: 4.7,
    reviewCount: 410,
    inStock: true,
    stockCount: 40,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_suspension.jpg'],
    description: 'Forged high strength steel lower wishbone arm with pre-installed grease-packed ball joint.',
    features: [
      'High grade vulcanized rubber isolator bushings',
      'Cathodic electrocoat corrosion protection',
      'Restores original steering geometry and alignment'
    ],
    specifications: {
      'Material': 'High Tensile Stamped Steel',
      'Ball Joint Pin Diameter': '18 mm',
      'Position': 'Front Left'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2014 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L CRDi' }
    ],
    seller: VERIFIED_SELLERS['monroe-ride'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-020',
    title: 'Anti-Roll Stabilizer Sway Bar Link Rod (Pair)',
    brand: 'KYB',
    partNumber: 'KYB-SL-884',
    oemNumber: '488200K030',
    category: 'suspension',
    subCategory: 'Sway Bar Link',
    partType: 'Aftermarket',
    price: 1199,
    mrp: 1550,
    discountPercentage: 23,
    rating: 4.5,
    reviewCount: 710,
    inStock: true,
    stockCount: 85,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_suspension.jpg'],
    description: 'Heavy duty stabilizer link pair with sealed full-ball stud design for responsive vehicle cornering.',
    features: [
      'Greased for life with chloroprene dust boots',
      'Induction hardened ball studs',
      'Eliminates knocking sounds over road bumps'
    ],
    specifications: {
      'Center to Center Length': '285 mm',
      'Thread Size': 'M12 x 1.25',
      'Hex Nut Size': '17 mm'
    },
    compatibility: [
      { manufacturer: 'Toyota', model: 'Innova Crysta', yearRange: '2016 - 2024', engine: '2.4L Diesel' },
      { manufacturer: 'Mahindra', model: 'Scorpio-N', yearRange: '2022 - 2024', engine: '2.2L' },
      { manufacturer: 'Mahindra', model: 'Thar', yearRange: '2020 - 2024', engine: '2.2L mHawk' }
    ],
    seller: VERIFIED_SELLERS['kyb-suspension'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-021',
    title: 'Commercial Heavy Duty Rear Leaf Spring Assembly',
    brand: 'Talbros',
    partNumber: 'TAL-LS-700',
    oemNumber: '265103400101',
    category: 'suspension',
    subCategory: 'Leaf Springs',
    partType: 'Genuine',
    price: 5499,
    mrp: 6800,
    discountPercentage: 19,
    rating: 4.9,
    reviewCount: 380,
    inStock: true,
    stockCount: 16,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_suspension.jpg'],
    description: 'Multi-leaf semi-elliptic spring pack manufactured from parabolic alloy spring steel for high load payloads.',
    features: [
      'Stress-relieved shot-peened tension leaves',
      'Includes bronze bushed eyes and anti-friction pads',
      'Handles full 1.5 ton commercial payloads'
    ],
    specifications: {
      'Leaves Count': '5 Leaves (Main + Helper)',
      'Free Camber': '115 mm',
      'Load Capacity': '1800 kg per axle'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L Turbo' }
    ],
    seller: VERIFIED_SELLERS['meritor-axle'],
    warranty: '12 Months Unlimited Payload Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: false
  },
  {
    id: 'prod-022',
    title: 'Gas-Charged Rear Shock Absorber Damper',
    brand: 'Monroe',
    partNumber: 'MN-550912',
    oemNumber: '41700M68P00',
    category: 'suspension',
    subCategory: 'Shock Absorber',
    partType: 'OEM',
    price: 2450,
    mrp: 3100,
    discountPercentage: 21,
    rating: 4.6,
    reviewCount: 490,
    inStock: true,
    stockCount: 39,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_shock.jpg'],
    description: 'Rear damper equipped with ten-stage full displacement valving for controlled rebound and passenger comfort.',
    features: [
      'All-weather fluid with friction modifiers',
      'Fluon banded piston for consistent sealing',
      'Heavy gauge steel pressure tube'
    ],
    specifications: {
      'Position': 'Rear Axle',
      'Type': 'Telescopic Damper',
      'Stroke': '190 mm'
    },
    compatibility: [
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['monroe-ride'],
    warranty: '18 Months / 30,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-023',
    title: 'Front Suspension Strut Top Mount with Bearing',
    brand: 'SKF',
    partNumber: 'VKDA 35412 T',
    oemNumber: '41710M68P00',
    category: 'suspension',
    subCategory: 'Strut Mount',
    partType: 'Genuine',
    price: 1450,
    mrp: 1850,
    discountPercentage: 22,
    rating: 4.8,
    reviewCount: 360,
    inStock: true,
    stockCount: 55,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_suspension.jpg'],
    description: 'Engineered rubber-metal top strut mount with integrated sealed thrust ball bearing for smooth steering rotation.',
    features: [
      'Dampens road vibrations from entering the cabin',
      'Sealed bearing resists water and road grit',
      'OEM exact fit specifications'
    ],
    specifications: {
      'Mount Type': 'Strut Cushion Mount',
      'Bearing Type': 'Deep Groove Thrust Ball Bearing',
      'Bolts': '3-Stud Pattern'
    },
    compatibility: [
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L' },
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2015 - 2024', engine: '700cc Diesel' }
    ],
    seller: VERIFIED_SELLERS['skf-bearings'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },

  // -------------------------------------------------------------
  // 4. GEARBOX & TRANSMISSION PARTS (6 Products)
  // -------------------------------------------------------------
  {
    id: 'prod-006',
    title: 'Gearbox Mainshaft Tapered Roller Bearing',
    brand: 'SKF',
    partNumber: 'B438 653313',
    oemNumber: '0926525038',
    category: 'gearbox-transmission',
    subCategory: 'Transmission Bearings',
    partType: 'Aftermarket',
    price: 1250,
    mrp: 1600,
    discountPercentage: 22,
    rating: 4.9,
    reviewCount: 520,
    inStock: true,
    stockCount: 88,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_bearing.jpg'],
    description: 'Precision tapered roller bearing for manual gearbox and transaxle mainshaft support.',
    features: [
      'Case hardened steel raceways',
      'Low friction cage design',
      'Withstands high axial and radial thrust'
    ],
    specifications: {
      'Inner Diameter': '25 mm',
      'Outer Diameter': '52 mm',
      'Width': '16.25 mm'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['skf-bearings'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'prod-024',
    title: 'Manual 5-Speed Brass Synchromesh Ring Set (1st-5th)',
    brand: 'ZF',
    partNumber: 'ZF-SR-5501',
    oemNumber: '280226200109',
    category: 'gearbox-transmission',
    subCategory: 'Synchromesh Rings',
    partType: 'Genuine',
    price: 3450,
    mrp: 4200,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 290,
    inStock: true,
    stockCount: 23,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_gearbox.jpg'],
    description: 'Complete 5-piece molybdenum coated brass synchro ring set ensuring smooth, crunch-free gear changes.',
    features: [
      'High wear-resistant silicon brass alloy',
      'Precision machined friction teeth',
      'Withstands heavy commercial gear shifts'
    ],
    specifications: {
      'Gears Included': '1st, 2nd, 3rd, 4th, 5th',
      'Cone Angle': '7.5 degrees',
      'Coating': 'Molybdenum Flame Sprayed'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Tata', model: '407 Gold', yearRange: '2016 - 2024', engine: '3.0L Dicor' }
    ],
    seller: VERIFIED_SELLERS['luk-powertrain'],
    warranty: '12 Months / 30,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: true
  },
  {
    id: 'prod-025',
    title: 'Dual Gear Shift Control Cable Assembly',
    brand: 'Talbros',
    partNumber: 'TAL-GC-190',
    oemNumber: '281926900115',
    category: 'gearbox-transmission',
    subCategory: 'Shift Cables',
    partType: 'OEM',
    price: 1850,
    mrp: 2300,
    discountPercentage: 20,
    rating: 4.7,
    reviewCount: 440,
    inStock: true,
    stockCount: 37,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_gearbox.jpg'],
    description: 'Shift and select low-friction control cable pair with nylon liner for crisp manual gear shifts.',
    features: [
      'Heat resistant fire retardant outer sheath',
      'Stainless steel multi-strand inner wire',
      'OE clip and rubber grommets included'
    ],
    specifications: {
      'Cable 1 Length': '1240 mm',
      'Cable 2 Length': '1290 mm',
      'Core Diameter': '3.2 mm'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2014 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L Turbo' }
    ],
    seller: VERIFIED_SELLERS['valeo-national'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-026',
    title: 'Automatic Transmission Fluid Filter & Gasket Kit',
    brand: 'Bosch',
    partNumber: '0986TF0012',
    oemNumber: '353300R010',
    category: 'gearbox-transmission',
    subCategory: 'Transmission Filter',
    partType: 'Genuine',
    price: 2750,
    mrp: 3400,
    discountPercentage: 19,
    rating: 4.8,
    reviewCount: 310,
    inStock: true,
    stockCount: 29,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_gearbox.jpg'],
    description: 'High-micron felt filter cartridge with premium oil pan gasket for 6-speed torque converter automatics.',
    features: [
      'Traps clutch debris and metal wear particulates',
      'High temperature synthetic rubber pan seal',
      'Maintains hydraulic line pressure in valve body'
    ],
    specifications: {
      'Filtration Media': 'Synthetic Depth Media (30 micron)',
      'Transmission Code': 'Aisin 6-Speed AT',
      'Includes': 'Filter + Pan Gasket + O-Ring'
    },
    compatibility: [
      { manufacturer: 'Toyota', model: 'Innova Crysta', yearRange: '2016 - 2024', engine: '2.8L / 2.4L' },
      { manufacturer: 'Mahindra', model: 'Thar', yearRange: '2020 - 2024', engine: '2.0L Turbo Petrol AT' }
    ],
    seller: VERIFIED_SELLERS['bosch-direct'],
    warranty: '12 Months / 20,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-027',
    title: 'Gearbox 1st-2nd Gear Shift Selector Fork',
    brand: 'ZF',
    partNumber: 'ZF-SF-4421',
    oemNumber: '280226300108',
    category: 'gearbox-transmission',
    subCategory: 'Shift Mechanism',
    partType: 'OEM',
    price: 1650,
    mrp: 2050,
    discountPercentage: 20,
    rating: 4.6,
    reviewCount: 190,
    inStock: true,
    stockCount: 19,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_gearbox.jpg'],
    description: 'Ductile iron forged selector fork with hardened bronze pads preventing premature synchro slippage.',
    features: [
      'High bend resistance under aggressive gear engagement',
      'Precision ground shaft bore',
      'Factory tested wear contact pads'
    ],
    specifications: {
      'Material': 'Drop-Forged 40Cr Steel',
      'Shaft Diameter': '14 mm',
      'Application': '1st & 2nd Gear Shift'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' }
    ],
    seller: VERIFIED_SELLERS['luk-powertrain'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-028',
    title: 'High-Torque Differential Input Shaft Bearing Set',
    brand: 'SKF',
    partNumber: 'VKHB 2209',
    oemNumber: '0926530018',
    category: 'gearbox-transmission',
    subCategory: 'Transmission Bearings',
    partType: 'Aftermarket',
    price: 1550,
    mrp: 1950,
    discountPercentage: 21,
    rating: 4.7,
    reviewCount: 380,
    inStock: true,
    stockCount: 44,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_bearing.jpg'],
    description: 'High-speed matched pair of tapered roller bearings designed for input pinion and gear reduction shafts.',
    features: [
      'Precision ground crown raceways',
      'Low acoustic vibration level',
      'Handles extreme shock loads during hill climb'
    ],
    specifications: {
      'Inside Bore': '30 mm',
      'Outside Diameter': '62 mm',
      'Bearing Type': 'Tapered Roller Cup & Cone'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2016 - 2024', engine: '1.5L mHawk' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['skf-bearings'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },

  // -------------------------------------------------------------
  // 5. DIFFERENTIAL & AXLE PARTS (5 Products)
  // -------------------------------------------------------------
  {
    id: 'prod-029',
    title: 'Hypoid Crown Wheel & Pinion Gear Set (Ratio 4.88)',
    brand: 'Meritor',
    partNumber: 'MER-CWP-488',
    oemNumber: '280435100109',
    category: 'differential-axle',
    subCategory: 'Crown Wheel & Pinion',
    partType: 'Genuine',
    price: 11999,
    mrp: 14500,
    discountPercentage: 17,
    rating: 4.9,
    reviewCount: 310,
    inStock: true,
    stockCount: 14,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_differential.jpg'],
    description: 'Matched gear set lapped together for zero gear whine and high torque transmission under full cargo load.',
    features: [
      'Case hardened 8620 alloy steel',
      'Lapped in pairs with matching contact pattern markings',
      'Includes new pinion nut and crush washer'
    ],
    specifications: {
      'Gear Ratio': '4.88:1 (39T Crown / 8T Pinion)',
      'Crown Bolt Holes': '10',
      'Axle Type': 'Salisbury / Banjo Live Axle'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L Turbo' }
    ],
    seller: VERIFIED_SELLERS['meritor-axle'],
    warranty: '24 Months Heavy Commercial Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'prod-030',
    title: 'Rear Axle Half Shaft (Right Hand Side)',
    brand: 'Meritor',
    partNumber: 'MER-AS-771',
    oemNumber: '280435200114',
    category: 'differential-axle',
    subCategory: 'Axle Shaft',
    partType: 'OEM',
    price: 3850,
    mrp: 4700,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 270,
    inStock: true,
    stockCount: 21,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_differential.jpg'],
    description: 'Induction hardened carbon steel rear drive axle shaft with integral wheel mounting hub flange.',
    features: [
      'High torsional fatigue limit for overloaded commercial vehicles',
      'Precision rolled involute spline teeth',
      'Includes wheel studs and oil seal collar'
    ],
    specifications: {
      'Total Length': '742 mm',
      'Spline Count': '24 Splines',
      'Stud Pattern': '4 x 100 mm'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' }
    ],
    seller: VERIFIED_SELLERS['meritor-axle'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-031',
    title: 'Differential Internal Spider Cross & Bevel Gear Kit',
    brand: 'Talbros',
    partNumber: 'TAL-DF-220',
    oemNumber: '280435300188',
    category: 'differential-axle',
    subCategory: 'Differential Internals',
    partType: 'Aftermarket',
    price: 2450,
    mrp: 3100,
    discountPercentage: 21,
    rating: 4.6,
    reviewCount: 420,
    inStock: true,
    stockCount: 38,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_differential.jpg'],
    description: 'Complete differential bevel gears rebuilding kit including 4 pinion gears, 2 side gears, and thrust washers.',
    features: [
      'Hardened spider cross pin',
      'Phosphor bronze spherical thrust washers',
      'Restores smooth differentiation during turns'
    ],
    specifications: {
      'Kit Contents': 'Spider Cross + 4 Pinion Gears + 2 Side Gears + Washers',
      'Material': 'Forged Alloy Steel 20MnCr5',
      'Hardness': '58-62 HRC'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2015 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['meritor-axle'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: false
  },
  {
    id: 'prod-032',
    title: 'Driveshaft Universal Joint Cross Kit with Grease Nipple',
    brand: 'SKF',
    partNumber: 'UJ-2782-G',
    oemNumber: '280441100122',
    category: 'differential-axle',
    subCategory: 'Universal Joint',
    partType: 'OEM',
    price: 850,
    mrp: 1100,
    discountPercentage: 23,
    rating: 4.8,
    reviewCount: 890,
    inStock: true,
    stockCount: 110,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_differential.jpg'],
    description: 'Heavy duty cardan propeller shaft cross with needle roller bearing cups and external circlips.',
    features: [
      'Central grease fitting zerk for easy lubrication during servicing',
      'Multi-lip synthetic rubber dust seals',
      'Induction case hardened bearing journals'
    ],
    specifications: {
      'Cap Diameter': '27 mm',
      'Overall Width': '82 mm',
      'Snap Ring Type': 'External Circlips'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2016 - 2024', engine: '1.5L mHawk' },
      { manufacturer: 'Ashok Leyland', model: 'Dost+', yearRange: '2018 - 2024', engine: '1.5L Turbo' }
    ],
    seller: VERIFIED_SELLERS['skf-bearings'],
    warranty: '12 Months Replacement Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: false
  },
  {
    id: 'prod-033',
    title: 'Front Wheel Hub & Bearing Unit with ABS Magnetic Ring',
    brand: 'SKF',
    partNumber: 'VKBA 6872',
    oemNumber: '43401M68P00',
    category: 'differential-axle',
    subCategory: 'Wheel Hub',
    partType: 'Genuine',
    price: 3250,
    mrp: 3999,
    discountPercentage: 19,
    rating: 4.9,
    reviewCount: 450,
    inStock: true,
    stockCount: 33,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_bearing.jpg'],
    description: 'Gen-3 sealed double row angular contact wheel hub unit with integrated ABS active tone encoder.',
    features: [
      'Pre-torqued and pre-greased zero maintenance design',
      'High-grade induction hardened spindle flange',
      'Flawless ABS wheel speed sensor compatibility'
    ],
    specifications: {
      'Flange Diameter': '138 mm',
      'Wheel Studs': '4',
      'Integrated Sensors': 'Magnetic ABS Encoder'
    },
    compatibility: [
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2018 - 2024', engine: '1.2L DualJet' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['skf-bearings'],
    warranty: '24 Months / 40,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: true
  },

  // -------------------------------------------------------------
  // 6. ENGINE & ELECTRICAL ESSENTIALS (3 Products)
  // -------------------------------------------------------------
  {
    id: 'prod-034',
    title: 'High-Efficiency Spin-On Engine Oil Filter',
    brand: 'Bosch',
    partNumber: '0986AF0041',
    oemNumber: '16510M68P00',
    category: 'engine-parts',
    subCategory: 'Oil Filter',
    partType: 'Genuine',
    price: 399,
    mrp: 520,
    discountPercentage: 23,
    rating: 4.8,
    reviewCount: 1650,
    inStock: true,
    stockCount: 150,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/prod_brakepad.jpg'],
    description: 'Premium microscopic cell resin-impregnated cellulose oil filter trapping 99% of engine carbon sludge.',
    features: [
      'Silicone anti-drainback valve prevents dry starts',
      'High burst pressure heavy-gauge steel casing',
      'Bypass valve maintains oil pressure during cold starts'
    ],
    specifications: {
      'Thread Size': '3/4"-16 UNF',
      'Outer Diameter': '68 mm',
      'Height': '75 mm'
    },
    compatibility: [
      { manufacturer: 'Maruti Suzuki', model: 'Swift', yearRange: '2015 - 2024', engine: '1.2L K12' },
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2012 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Hyundai', model: 'Creta', yearRange: '2018 - 2024', engine: '1.5L' }
    ],
    seller: VERIFIED_SELLERS['bosch-direct'],
    warranty: '6 Months / 10,000 km Warranty',
    returnDays: 10,
    isPopular: true,
    isFeatured: false
  },
  {
    id: 'prod-035',
    title: 'Heavy Duty 12V 90A Automotive Alternator Unit',
    brand: 'Lucas-TVS',
    partNumber: 'LTVS-ALT-90',
    oemNumber: '280215100119',
    category: 'electrical-parts',
    subCategory: 'Alternators',
    partType: 'OEM',
    price: 6850,
    mrp: 8200,
    discountPercentage: 16,
    rating: 4.7,
    reviewCount: 280,
    inStock: true,
    stockCount: 17,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_gearbox.jpg'],
    description: 'High-current output 90 Amp compact alternator engineered with heavy duty copper winding and surge diodes.',
    features: [
      'Internal avalanche diode rectifier',
      'Built-in electronic smart voltage regulator',
      'Includes 6-rib serpentine pulley'
    ],
    specifications: {
      'Voltage': '12 V',
      'Current Output': '90 Amperes',
      'Rotation': 'Clockwise (CW)'
    },
    compatibility: [
      { manufacturer: 'Tata', model: 'Ace Gold', yearRange: '2018 - 2024', engine: '700cc Dicor' },
      { manufacturer: 'Tata', model: 'Ace', yearRange: '2014 - 2024', engine: '700cc Diesel' },
      { manufacturer: 'Mahindra', model: 'Bolero', yearRange: '2016 - 2024', engine: '1.5L mHawk' }
    ],
    seller: VERIFIED_SELLERS['denso-electrics'],
    warranty: '18 Months / 30,000 km Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: true
  },
  {
    id: 'prod-036',
    title: 'High-Torque Reduction Gear Starter Motor (12V 2.2kW)',
    brand: 'Denso',
    partNumber: 'DS-STR-22',
    oemNumber: '281000L070',
    category: 'electrical-parts',
    subCategory: 'Starter Motors',
    partType: 'Genuine',
    price: 7999,
    mrp: 9500,
    discountPercentage: 16,
    rating: 4.9,
    reviewCount: 340,
    inStock: true,
    stockCount: 15,
    deliveryTime: 'Free Delivery | 2-3 days',
    images: ['/assets/cat_gearbox.jpg'],
    description: 'Planetary gear reduction starter motor delivering strong cranking torque in sub-zero and tropical conditions.',
    features: [
      'Sealed solenoid contacts for wet weather reliability',
      'Hardened 10-tooth starter pinion gear',
      'Low battery drain high efficiency armature'
    ],
    specifications: {
      'Voltage': '12 V',
      'Power Rating': '2.2 kW',
      'Pinion Teeth': '10 Teeth'
    },
    compatibility: [
      { manufacturer: 'Toyota', model: 'Innova Crysta', yearRange: '2016 - 2024', engine: '2.4L / 2.8L' },
      { manufacturer: 'Mahindra', model: 'Thar', yearRange: '2020 - 2024', engine: '2.2L mHawk' }
    ],
    seller: VERIFIED_SELLERS['denso-electrics'],
    warranty: '24 Months Replacement Warranty',
    returnDays: 10,
    isPopular: false,
    isFeatured: true
  }
];

// Re-export POPULAR_PRODUCTS for backward compatibility with homepage
export const POPULAR_PRODUCTS: Product[] = ALL_PRODUCTS.slice(0, 6);
