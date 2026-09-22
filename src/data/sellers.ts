import { Seller } from '../types';

export const VERIFIED_SELLERS: Record<string, Seller> = {
  'bosch-direct': {
    id: 'seller-1',
    name: 'Apex Mobility Solutions (Bosch Certified)',
    rating: 4.9,
    reviewCount: 2840,
    tier: 'Authorized Distributor',
    city: 'Mumbai',
    state: 'Maharashtra',
    verified: true
  },
  'brembo-india': {
    id: 'seller-2',
    name: 'EuroPerformance Parts Hub (Brembo Partner)',
    rating: 4.8,
    reviewCount: 1420,
    tier: 'OEM Partner',
    city: 'Bengaluru',
    state: 'Karnataka',
    verified: true
  },
  'valeo-national': {
    id: 'seller-3',
    name: 'National Autolinks Wholesale',
    rating: 4.7,
    reviewCount: 3190,
    tier: 'Certified Wholesaler',
    city: 'Delhi NCR',
    state: 'Delhi',
    verified: true
  },
  'luk-powertrain': {
    id: 'seller-4',
    name: 'Schaeffler-LUK Direct Depot',
    rating: 4.9,
    reviewCount: 980,
    tier: 'Authorized Distributor',
    city: 'Pune',
    state: 'Maharashtra',
    verified: true
  },
  'kyb-suspension': {
    id: 'seller-5',
    name: 'Southern Star Suspension Works',
    rating: 4.8,
    reviewCount: 1650,
    tier: 'Authorized Distributor',
    city: 'Chennai',
    state: 'Tamil Nadu',
    verified: true
  },
  'skf-bearings': {
    id: 'seller-6',
    name: 'Bharat Industrial & Automotive Bearings',
    rating: 4.9,
    reviewCount: 4120,
    tier: 'Authorized Distributor',
    city: 'Ahmedabad',
    state: 'Gujarat',
    verified: true
  },
  'tvs-girling': {
    id: 'seller-7',
    name: 'Sundaram Brakes & Hydraulics Depot',
    rating: 4.8,
    reviewCount: 2210,
    tier: 'OEM Partner',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    verified: true
  },
  'monroe-ride': {
    id: 'seller-8',
    name: 'Precision Shocks & Struts Logistics',
    rating: 4.7,
    reviewCount: 1890,
    tier: 'Authorized Distributor',
    city: 'Hyderabad',
    state: 'Telangana',
    verified: true
  },
  'meritor-axle': {
    id: 'seller-9',
    name: 'Commercial Drivetrain & Axle Supply',
    rating: 4.9,
    reviewCount: 3450,
    tier: 'Certified Wholesaler',
    city: 'Kolkata',
    state: 'West Bengal',
    verified: true
  },
  'denso-electrics': {
    id: 'seller-10',
    name: 'Powerline Auto Electricals & Starters',
    rating: 4.6,
    reviewCount: 870,
    tier: 'Verified Retailer',
    city: 'Jaipur',
    state: 'Rajasthan',
    verified: true
  }
};
