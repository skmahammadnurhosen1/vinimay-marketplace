import { DeliveryAddress } from '../types';

export const DEMO_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-01',
    fullName: 'Rajesh Sharma (Om Sai Auto Garage)',
    phone: '+91 98201 44556',
    addressLine1: 'Unit 14, Galaxy Automobile Complex',
    addressLine2: 'Opposite Link Road Metro Pillar 112',
    landmark: 'Near Western Express Highway',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400058',
    type: 'garage',
    isDefault: true
  },
  {
    id: 'addr-02',
    fullName: 'Rajesh Sharma',
    phone: '+91 98201 44556',
    addressLine1: 'Flat 402, B-Wing, Royal Palms Residency',
    addressLine2: 'Paud Road, Kothrud',
    landmark: 'Near Gandhi Bhavan',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411038',
    type: 'home',
    isDefault: false
  },
  {
    id: 'addr-03',
    fullName: 'Sharma Transports Fleet Yard',
    phone: '+91 98112 77889',
    addressLine1: 'Plot 28, Transport Nagar Commercial Hub',
    addressLine2: 'Sanjay Gandhi Transport Depot Zone 3',
    landmark: 'Near Indian Oil Petrol Pump',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110042',
    type: 'work',
    isDefault: false
  }
];
