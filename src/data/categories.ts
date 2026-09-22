import { Category } from '../types';

export const MARKETPLACE_CATEGORIES: Category[] = [
  {
    id: 'brake-parts',
    name: 'Brake Parts',
    slug: 'brake-parts',
    description: 'Pads, Disc, Drum, Caliper',
    itemCount: 4280,
    image: '/assets/cat_brake.jpg',
    subcategories: ['Brake Pads', 'Brake Discs', 'Brake Shoes', 'Brake Calipers']
  },
  {
    id: 'clutch-parts',
    name: 'Clutch Parts',
    slug: 'clutch-parts',
    description: 'Plate, Pressure Plate, Bearing',
    itemCount: 3140,
    image: '/assets/cat_clutch.jpg',
    subcategories: ['Clutch Plate', 'Pressure Plate', 'Release Bearing', 'Clutch Kit']
  },
  {
    id: 'suspension',
    name: 'Suspension',
    slug: 'suspension',
    description: 'Shock, Strut, Spring',
    itemCount: 5620,
    image: '/assets/cat_suspension.jpg',
    subcategories: ['Shock Absorbers', 'Struts', 'Coil Springs', 'Control Arms']
  },
  {
    id: 'gearbox-transmission',
    name: 'Gearbox & Transmission',
    slug: 'gearbox-transmission',
    description: 'Gear, Shaft, Synchronizer',
    itemCount: 2890,
    image: '/assets/cat_gearbox.jpg',
    subcategories: ['Gear Shaft', 'Synchronizer Ring', 'Transmission Bearing', 'Shift Cable']
  },
  {
    id: 'differential-axle',
    name: 'Differential & Axle',
    slug: 'differential-axle',
    description: 'Gear, Axle Shaft, Assembly',
    itemCount: 1940,
    image: '/assets/cat_differential.jpg',
    subcategories: ['Crown Wheel & Pinion', 'Axle Shaft', 'Universal Joint', 'Carrier Assembly']
  }
];
