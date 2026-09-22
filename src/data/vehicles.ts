import { Manufacturer, VehicleBrand } from '../types';

export const VEHICLE_MANUFACTURERS: Manufacturer[] = [
  // Commercial Vehicles
  {
    id: 'tata-cv',
    name: 'Tata',
    category: 'commercial',
    popularModels: ['Ace', '407', 'Intra V30', 'Signa'],
    models: [
      {
        id: 'tata-ace',
        name: 'Ace',
        years: [2022, 2023, 2024, 2021, 2020, 2019, 2018],
        fuelTypes: ['Diesel', 'Petrol', 'CNG'],
        engines: ['700cc', '694cc BS6', '800cc'],
        variants: ['Standard', 'High Deck', 'Plus']
      },
      {
        id: 'tata-407',
        name: '407',
        years: [2022, 2023, 2024, 2021, 2020],
        fuelTypes: ['Diesel', 'CNG'],
        engines: ['2956cc 4SPCR', '3.8L'],
        variants: ['Standard', 'High Deck']
      }
    ]
  },
  {
    id: 'ashok-leyland',
    name: 'Ashok Leyland',
    category: 'commercial',
    popularModels: ['Dost+', 'Bada Dost', 'Partner'],
    models: [
      {
        id: 'al-dost',
        name: 'Dost+',
        years: [2022, 2023, 2024, 2021, 2020],
        fuelTypes: ['Diesel', 'CNG'],
        engines: ['1.5L Turbo'],
        variants: ['LE', 'LS', 'LX']
      }
    ]
  },
  {
    id: 'eicher-motors',
    name: 'Eicher',
    category: 'commercial',
    popularModels: ['Pro 2049', 'Pro 3015'],
    models: [
      {
        id: 'eicher-pro',
        name: 'Pro 2049',
        years: [2022, 2023, 2024, 2021],
        fuelTypes: ['Diesel'],
        engines: ['3.0L Turbo'],
        variants: ['Standard']
      }
    ]
  },
  {
    id: 'bharatbenz',
    name: 'BharatBenz',
    category: 'commercial',
    popularModels: ['1217R', '2823R'],
    models: [
      {
        id: 'bb-1217r',
        name: '1217R',
        years: [2022, 2023, 2024],
        fuelTypes: ['Diesel'],
        engines: ['3.9L 4D34i'],
        variants: ['Standard']
      }
    ]
  },

  // Passenger Vehicles
  {
    id: 'maruti-suzuki',
    name: 'Maruti Suzuki',
    category: 'passenger',
    popularModels: ['Swift', 'Baleno', 'Brezza', 'Dzire'],
    models: [
      {
        id: 'maruti-swift',
        name: 'Swift',
        years: [2022, 2023, 2024, 2021, 2020],
        fuelTypes: ['Petrol', 'CNG'],
        engines: ['1.2L DualJet'],
        variants: ['LXi', 'VXi', 'ZXi', 'ZXi+']
      }
    ]
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    category: 'passenger',
    popularModels: ['Thar', 'Scorpio-N', 'XUV700', 'Bolero'],
    models: [
      {
        id: 'mahindra-thar',
        name: 'Thar',
        years: [2022, 2023, 2024, 2021],
        fuelTypes: ['Diesel', 'Petrol'],
        engines: ['2.2L mHawk', '2.0L mStallion'],
        variants: ['AX (Opt)', 'LX Hard Top 4x4 AT']
      }
    ]
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    category: 'passenger',
    popularModels: ['Creta', 'Venue', 'i20'],
    models: [
      {
        id: 'hyundai-creta',
        name: 'Creta',
        years: [2022, 2023, 2024, 2021],
        fuelTypes: ['Petrol', 'Diesel'],
        engines: ['1.5L MPi', '1.5L CRDi'],
        variants: ['EX', 'S', 'SX', 'SX(O)']
      }
    ]
  },
  {
    id: 'toyota',
    name: 'Toyota',
    category: 'passenger',
    popularModels: ['Innova Crysta', 'Fortuner'],
    models: [
      {
        id: 'toyota-innova',
        name: 'Innova Crysta',
        years: [2022, 2023, 2024, 2021],
        fuelTypes: ['Diesel'],
        engines: ['2.4L Diesel'],
        variants: ['GX', 'VX', 'ZX']
      }
    ]
  },
  {
    id: 'kia',
    name: 'Kia',
    category: 'passenger',
    popularModels: ['Seltos', 'Sonet'],
    models: [
      {
        id: 'kia-seltos',
        name: 'Seltos',
        years: [2022, 2023, 2024],
        fuelTypes: ['Petrol', 'Diesel'],
        engines: ['1.5L Smartstream', '1.5L CRDi'],
        variants: ['HTK', 'HTX', 'GTX+']
      }
    ]
  }
];

export const POPULAR_VEHICLE_BRANDS: VehicleBrand[] = [
  { id: 'maruti-suzuki', name: 'Maruti Suzuki', category: 'passenger', origin: 'India', tagline: 'Every Day Journey', logoUrl: '/assets/brand_maruti.png' },
  { id: 'hyundai', name: 'Hyundai', category: 'passenger', origin: 'South Korea', tagline: 'Beyond Mobility', logoUrl: '/assets/brand_hyundai.png' },
  { id: 'tata-cv', name: 'Tata', category: 'both', origin: 'India', tagline: 'Connecting Aspirations', logoUrl: '/assets/brand_tata.png' },
  { id: 'mahindra', name: 'Mahindra', category: 'both', origin: 'India', tagline: 'Rise for Good', logoUrl: '/assets/brand_mahindra.png' },
  { id: 'toyota', name: 'Toyota', category: 'passenger', origin: 'Japan', tagline: 'Quality Revolution', logoUrl: '/assets/brand_toyota.png' },
  { id: 'kia', name: 'Kia', category: 'passenger', origin: 'South Korea', tagline: 'Movement that Inspires', logoUrl: '/assets/brand_kia.png' },
  { id: 'ashok-leyland', name: 'Ashok Leyland', category: 'commercial', origin: 'India', tagline: 'Aapki Jeet. Hamari Jeet.', logoUrl: '/assets/brand_ashok.png' },
  { id: 'eicher-motors', name: 'Eicher', category: 'commercial', origin: 'India', tagline: 'Delivering Efficiency', logoUrl: '/assets/brand_eicher.png' },
  { id: 'bharatbenz', name: 'BharatBenz', category: 'commercial', origin: 'Germany / India', tagline: 'Transforming Indian Trucking', logoUrl: '/assets/brand_bharatbenz.png' }
];
