import {
  CustomerOrder,
  CustomerReturnRequest,
  CustomerWarrantyClaim,
  CustomerNotification,
  SupportTicket,
  SelectedVehicle,
  PackageTrackingInfo
} from '../types';
import { ALL_PRODUCTS } from './products';
import { DEMO_ADDRESSES } from './mockAddresses';
import { VERIFIED_SELLERS } from './sellers';

const MOCK_VEHICLE_TATA_ACE: SelectedVehicle = {
  vehicleType: 'commercial',
  manufacturer: 'Tata',
  model: 'Ace Gold',
  year: 2022,
  fuelType: 'Diesel',
  engine: '700cc Dicor',
  variant: 'Plus'
};

const MOCK_VEHICLE_SWIFT: SelectedVehicle = {
  vehicleType: 'passenger',
  manufacturer: 'Maruti Suzuki',
  model: 'Swift',
  year: 2021,
  fuelType: 'Petrol',
  engine: '1.2L DualJet',
  variant: 'ZXi+'
};

// -------------------------------------------------------------
// TRACKING CHECKPOINTS HELPER
// -------------------------------------------------------------
const createCheckpoints = (
  currentStage: 'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered',
  originCity: string,
  destCity: string,
  baseDate: string
): PackageTrackingInfo['checkpoints'] => {
  const stages = [
    {
      stage: 'ordered' as const,
      title: 'Order Verified & Confirmed',
      description: 'Payment authorized and merchant dispatch requisition created.',
      timestamp: `${baseDate} 10:15 AM`,
      location: 'Central Order Routing System'
    },
    {
      stage: 'packed' as const,
      title: 'Packaging & Quality Inspection Complete',
      description: 'Part verified against OEM specs, barcode scanned, and sealed in heavy-duty shipping box.',
      timestamp: `${baseDate} 03:40 PM`,
      location: `${originCity} Regional Distribution Center`
    },
    {
      stage: 'shipped' as const,
      title: 'Dispatched via Express Courier',
      description: 'Package handed over to air/surface cargo linehaul vehicle in transit.',
      timestamp: `${baseDate} 08:30 PM`,
      location: `${originCity} Airport Cargo Hub`
    },
    {
      stage: 'out_for_delivery' as const,
      title: 'Out for Doorstep Delivery',
      description: 'Consignment allocated to delivery executive. OTP delivery active.',
      timestamp: `Next Day 09:20 AM`,
      location: `${destCity} Local Hub`
    },
    {
      stage: 'delivered' as const,
      title: 'Delivered to Customer',
      description: 'Package delivered and signed at destination. 10-day fitment return window opened.',
      timestamp: `Next Day 02:45 PM`,
      location: `${destCity} Delivery Location`
    }
  ];

  const stageOrder = ['ordered', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const curIdx = stageOrder.indexOf(currentStage);

  return stages.map((s, idx) => ({
    ...s,
    completed: idx <= curIdx,
    current: idx === curIdx
  }));
};

// -------------------------------------------------------------
// 1. MOCK ORDERS LIST
// -------------------------------------------------------------
export const INITIAL_MOCK_ORDERS: CustomerOrder[] = [
  // 1. Multi-Vendor Delivered Order (Recent)
  {
    id: 'APH-2026-98421',
    date: '18 Sept 2026, 11:30 AM',
    overallStatus: 'delivered',
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    paymentRef: 'UPI-982103984124',
    deliveryAddress: DEMO_ADDRESSES[0], // Garage in Mumbai
    vehicleContext: MOCK_VEHICLE_TATA_ACE,
    subtotal: 7498,
    discountTotal: 1802,
    shippingTotal: 0,
    gstAmount: 1350,
    totalPayable: 7498,
    isReturnEligible: true,
    isWarrantyEligible: true,
    invoiceUrl: '#',
    packages: [
      {
        packageId: 'PKG-BOSCH-7721',
        sellerId: VERIFIED_SELLERS['bosch-direct'].id,
        sellerName: VERIFIED_SELLERS['bosch-direct'].name,
        sellerCity: VERIFIED_SELLERS['bosch-direct'].city,
        sellerState: VERIFIED_SELLERS['bosch-direct'].state,
        sellerTier: VERIFIED_SELLERS['bosch-direct'].tier,
        sellerVerified: true,
        trackingId: 'BLUEDART-8821039',
        courierPartner: 'Blue Dart Express',
        estimatedDelivery: 'Delivered on 19 Sept 2026',
        items: [{ product: ALL_PRODUCTS[0], quantity: 1 }],
        packageSubtotal: 2499,
        packageShipping: 0,
        status: 'delivered',
        trackingInfo: {
          packageId: 'PKG-BOSCH-7721',
          trackingId: 'BLUEDART-8821039',
          courierPartner: 'Blue Dart Express',
          currentStage: 'delivered',
          estimatedDelivery: '19 Sept 2026',
          checkpoints: createCheckpoints('delivered', 'Mumbai', 'Mumbai', '18 Sept 2026')
        }
      },
      {
        packageId: 'PKG-BREMBO-4491',
        sellerId: VERIFIED_SELLERS['brembo-india'].id,
        sellerName: VERIFIED_SELLERS['brembo-india'].name,
        sellerCity: VERIFIED_SELLERS['brembo-india'].city,
        sellerState: VERIFIED_SELLERS['brembo-india'].state,
        sellerTier: VERIFIED_SELLERS['brembo-india'].tier,
        sellerVerified: true,
        trackingId: 'DELHIVERY-9941203',
        courierPartner: 'Delhivery Surface Express',
        estimatedDelivery: 'Delivered on 20 Sept 2026',
        items: [{ product: ALL_PRODUCTS[1], quantity: 1 }],
        packageSubtotal: 4999,
        packageShipping: 0,
        status: 'delivered',
        trackingInfo: {
          packageId: 'PKG-BREMBO-4491',
          trackingId: 'DELHIVERY-9941203',
          courierPartner: 'Delhivery Surface Express',
          currentStage: 'delivered',
          estimatedDelivery: '20 Sept 2026',
          checkpoints: createCheckpoints('delivered', 'Bengaluru', 'Mumbai', '18 Sept 2026')
        }
      }
    ]
  },

  // 2. Multi-Vendor In-Transit Order (Package A is Shipped, Package B is Packed)
  {
    id: 'APH-2026-87114',
    date: '20 Sept 2026, 04:15 PM',
    overallStatus: 'shipped',
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    paymentRef: 'TXN-CARD-44918239',
    deliveryAddress: DEMO_ADDRESSES[0],
    vehicleContext: MOCK_VEHICLE_TATA_ACE,
    subtotal: 6500,
    discountTotal: 1400,
    shippingTotal: 99,
    gstAmount: 1170,
    totalPayable: 6599,
    isReturnEligible: false, // Cannot return until delivered
    isWarrantyEligible: false,
    invoiceUrl: '#',
    packages: [
      {
        packageId: 'PKG-TVS-8819',
        sellerId: VERIFIED_SELLERS['tvs-girling'].id,
        sellerName: VERIFIED_SELLERS['tvs-girling'].name,
        sellerCity: VERIFIED_SELLERS['tvs-girling'].city,
        sellerState: VERIFIED_SELLERS['tvs-girling'].state,
        sellerTier: VERIFIED_SELLERS['tvs-girling'].tier,
        sellerVerified: true,
        trackingId: 'BLUEDART-5510294',
        courierPartner: 'Blue Dart Air Express',
        estimatedDelivery: 'Expected 22 Sept 2026',
        items: [{ product: ALL_PRODUCTS[2] || ALL_PRODUCTS[0], quantity: 1 }],
        packageSubtotal: 3650,
        packageShipping: 0,
        status: 'shipped',
        trackingInfo: {
          packageId: 'PKG-TVS-8819',
          trackingId: 'BLUEDART-5510294',
          courierPartner: 'Blue Dart Air Express',
          currentStage: 'shipped',
          estimatedDelivery: '22 Sept 2026',
          checkpoints: createCheckpoints('shipped', 'Coimbatore', 'Mumbai', '20 Sept 2026')
        }
      },
      {
        packageId: 'PKG-BOSCH-9930',
        sellerId: VERIFIED_SELLERS['bosch-direct'].id,
        sellerName: VERIFIED_SELLERS['bosch-direct'].name,
        sellerCity: VERIFIED_SELLERS['bosch-direct'].city,
        sellerState: VERIFIED_SELLERS['bosch-direct'].state,
        sellerTier: VERIFIED_SELLERS['bosch-direct'].tier,
        sellerVerified: true,
        trackingId: 'DTDC-3301948',
        courierPartner: 'DTDC Prime Logistics',
        estimatedDelivery: 'Expected 23 Sept 2026',
        items: [{ product: ALL_PRODUCTS[3] || ALL_PRODUCTS[0], quantity: 1 }],
        packageSubtotal: 2850,
        packageShipping: 99,
        status: 'packed',
        trackingInfo: {
          packageId: 'PKG-BOSCH-9930',
          trackingId: 'DTDC-3301948',
          courierPartner: 'DTDC Prime Logistics',
          currentStage: 'packed',
          estimatedDelivery: '23 Sept 2026',
          checkpoints: createCheckpoints('packed', 'Mumbai', 'Mumbai', '20 Sept 2026')
        }
      }
    ]
  },

  // 3. Processing Order (Just ordered, awaiting merchant packing)
  {
    id: 'APH-2026-74920',
    date: '21 Sept 2026, 09:30 AM',
    overallStatus: 'processing',
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    paymentRef: 'UPI-771920491024',
    deliveryAddress: DEMO_ADDRESSES[1], // Home in Pune
    vehicleContext: MOCK_VEHICLE_SWIFT,
    subtotal: 2499,
    discountTotal: 701,
    shippingTotal: 99,
    gstAmount: 450,
    totalPayable: 2598,
    isReturnEligible: false,
    isWarrantyEligible: false,
    invoiceUrl: '#',
    packages: [
      {
        packageId: 'PKG-BOSCH-1102',
        sellerId: VERIFIED_SELLERS['bosch-direct'].id,
        sellerName: VERIFIED_SELLERS['bosch-direct'].name,
        sellerCity: VERIFIED_SELLERS['bosch-direct'].city,
        sellerState: VERIFIED_SELLERS['bosch-direct'].state,
        sellerTier: VERIFIED_SELLERS['bosch-direct'].tier,
        sellerVerified: true,
        trackingId: 'PENDING-PICKUP',
        courierPartner: 'Blue Dart Surface',
        estimatedDelivery: 'Expected 24 Sept 2026',
        items: [{ product: ALL_PRODUCTS[0], quantity: 1 }],
        packageSubtotal: 2499,
        packageShipping: 99,
        status: 'ordered',
        trackingInfo: {
          packageId: 'PKG-BOSCH-1102',
          trackingId: 'PENDING-PICKUP',
          courierPartner: 'Blue Dart Surface',
          currentStage: 'ordered',
          estimatedDelivery: '24 Sept 2026',
          checkpoints: createCheckpoints('ordered', 'Mumbai', 'Pune', '21 Sept 2026')
        }
      }
    ]
  },

  // 4. Delivered Order with Active Return Request
  {
    id: 'APH-2026-61025',
    date: '10 Sept 2026, 02:00 PM',
    overallStatus: 'returned',
    paymentMethod: 'cod',
    paymentStatus: 'Paid',
    paymentRef: 'COD-CASH-49102',
    deliveryAddress: DEMO_ADDRESSES[0],
    vehicleContext: MOCK_VEHICLE_TATA_ACE,
    subtotal: 4999,
    discountTotal: 1101,
    shippingTotal: 0,
    gstAmount: 900,
    totalPayable: 4999,
    isReturnEligible: false, // Already returned
    isWarrantyEligible: false,
    invoiceUrl: '#',
    packages: [
      {
        packageId: 'PKG-BREMBO-0192',
        sellerId: VERIFIED_SELLERS['brembo-india'].id,
        sellerName: VERIFIED_SELLERS['brembo-india'].name,
        sellerCity: VERIFIED_SELLERS['brembo-india'].city,
        sellerState: VERIFIED_SELLERS['brembo-india'].state,
        sellerTier: VERIFIED_SELLERS['brembo-india'].tier,
        sellerVerified: true,
        trackingId: 'DELHIVERY-7749102',
        courierPartner: 'Delhivery Reverse Logistics',
        estimatedDelivery: 'Delivered on 12 Sept 2026',
        items: [{ product: ALL_PRODUCTS[1], quantity: 1 }],
        packageSubtotal: 4999,
        packageShipping: 0,
        status: 'delivered'
      }
    ]
  },

  // 5. Delivered Order with Active Warranty Claim
  {
    id: 'APH-2026-52901',
    date: '15 Aug 2026, 10:00 AM',
    overallStatus: 'delivered',
    paymentMethod: 'netbanking',
    paymentStatus: 'Paid',
    paymentRef: 'NETBK-99410294',
    deliveryAddress: DEMO_ADDRESSES[0],
    vehicleContext: MOCK_VEHICLE_TATA_ACE,
    subtotal: 3650,
    discountTotal: 750,
    shippingTotal: 0,
    gstAmount: 657,
    totalPayable: 3650,
    isReturnEligible: false, // 10 days expired
    isWarrantyEligible: true, // 18-month warranty active
    invoiceUrl: '#',
    packages: [
      {
        packageId: 'PKG-TVS-3301',
        sellerId: VERIFIED_SELLERS['tvs-girling'].id,
        sellerName: VERIFIED_SELLERS['tvs-girling'].name,
        sellerCity: VERIFIED_SELLERS['tvs-girling'].city,
        sellerState: VERIFIED_SELLERS['tvs-girling'].state,
        sellerTier: VERIFIED_SELLERS['tvs-girling'].tier,
        sellerVerified: true,
        trackingId: 'BLUEDART-3391029',
        courierPartner: 'Blue Dart Surface',
        estimatedDelivery: 'Delivered on 18 Aug 2026',
        items: [{ product: ALL_PRODUCTS[2] || ALL_PRODUCTS[0], quantity: 1 }],
        packageSubtotal: 3650,
        packageShipping: 0,
        status: 'delivered'
      }
    ]
  },

  // 6. Cancelled Order prior to shipping
  {
    id: 'APH-2026-40192',
    date: '02 Aug 2026, 05:40 PM',
    overallStatus: 'cancelled',
    paymentMethod: 'upi',
    paymentStatus: 'Refunded',
    paymentRef: 'REFUND-UPI-3301948',
    deliveryAddress: DEMO_ADDRESSES[2],
    vehicleContext: MOCK_VEHICLE_TATA_ACE,
    subtotal: 2850,
    discountTotal: 650,
    shippingTotal: 99,
    gstAmount: 513,
    totalPayable: 2949,
    isReturnEligible: false,
    isWarrantyEligible: false,
    invoiceUrl: '#',
    packages: [
      {
        packageId: 'PKG-BOSCH-CANCELLED',
        sellerId: VERIFIED_SELLERS['bosch-direct'].id,
        sellerName: VERIFIED_SELLERS['bosch-direct'].name,
        sellerCity: VERIFIED_SELLERS['bosch-direct'].city,
        sellerState: VERIFIED_SELLERS['bosch-direct'].state,
        sellerTier: VERIFIED_SELLERS['bosch-direct'].tier,
        sellerVerified: true,
        trackingId: 'CANCELLED',
        courierPartner: 'Cancelled',
        estimatedDelivery: 'Cancelled by customer',
        items: [{ product: ALL_PRODUCTS[3] || ALL_PRODUCTS[0], quantity: 1 }],
        packageSubtotal: 2850,
        packageShipping: 99,
        status: 'ordered'
      }
    ]
  }
];

// -------------------------------------------------------------
// 2. MOCK RETURN REQUESTS
// -------------------------------------------------------------
export const INITIAL_MOCK_RETURNS: CustomerReturnRequest[] = [
  {
    id: 'RET-2026-1049',
    orderId: 'APH-2026-61025',
    productId: ALL_PRODUCTS[1].id,
    product: ALL_PRODUCTS[1],
    quantity: 1,
    sellerId: VERIFIED_SELLERS['brembo-india'].id,
    sellerName: VERIFIED_SELLERS['brembo-india'].name,
    vehicleContext: MOCK_VEHICLE_TATA_ACE,
    reason: 'Product Not Compatible',
    explanation: 'Rotor diameter does not align with our 2022 Ace Gold wheel hub mounting studs. Mechanic confirmed fitment mismatch.',
    submittedDate: '13 Sept 2026',
    status: 'under_inspection',
    statusHistory: [
      { status: 'submitted', title: 'Return Request Logged', date: '13 Sept 2026, 03:20 PM', notes: 'Reason: Product Not Compatible with Tata Ace Gold' },
      { status: 'under_verification', title: 'Admin & Merchant Approval', date: '14 Sept 2026, 11:00 AM', notes: 'Verified 100% Fitment Guarantee eligibility' },
      { status: 'pickup_scheduled', title: 'Doorstep Pickup Completed', date: '15 Sept 2026, 04:30 PM', notes: 'Collected via Delhivery Reverse AWB: REV-99410' },
      { status: 'under_inspection', title: 'Warehouse Inspection in Progress', date: '17 Sept 2026, 10:15 AM', notes: 'Evaluating part unboxing and cosmetic integrity' }
    ],
    evidencePhotos: ['/assets/prod_disc.jpg'],
    resolutionType: 'refund',
    pickupDate: '15 Sept 2026',
    refundAmount: 4999
  },
  {
    id: 'RET-2026-1088',
    orderId: 'APH-2026-98421',
    productId: ALL_PRODUCTS[0].id,
    product: ALL_PRODUCTS[0],
    quantity: 1,
    sellerId: VERIFIED_SELLERS['bosch-direct'].id,
    sellerName: VERIFIED_SELLERS['bosch-direct'].name,
    vehicleContext: MOCK_VEHICLE_TATA_ACE,
    reason: 'Damaged Product',
    explanation: 'One of the brake pad ceramic friction shims was chipped during transit.',
    submittedDate: '20 Sept 2026',
    status: 'additional_info_required',
    statusHistory: [
      { status: 'submitted', title: 'Return Request Submitted', date: '20 Sept 2026, 06:10 PM', notes: 'Claimed chipped friction shim' },
      { status: 'additional_info_required', title: 'Additional Photo Required', date: '21 Sept 2026, 09:45 AM', notes: 'Merchant requested a clearer photo of the barcode on the outer packaging box' }
    ],
    evidencePhotos: ['/assets/prod_brakepad.jpg'],
    resolutionType: 'replacement',
    additionalInfoPrompt: 'Please upload a photo showing the Bosch outer box holographic security seal and serial barcode.'
  }
];

// -------------------------------------------------------------
// 3. MOCK WARRANTY CLAIMS
// -------------------------------------------------------------
export const INITIAL_MOCK_WARRANTIES: CustomerWarrantyClaim[] = [
  {
    id: 'WAR-2026-5521',
    orderId: 'APH-2026-52901',
    productId: (ALL_PRODUCTS[2] || ALL_PRODUCTS[0]).id,
    product: ALL_PRODUCTS[2] || ALL_PRODUCTS[0],
    partNumber: 'TVS-BC-7721',
    vehicle: MOCK_VEHICLE_TATA_ACE,
    problemDescription: 'Hydraulic caliper piston sticking after 3 weeks of operation. Brake pads dragging against rotor.',
    photos: ['/assets/cat_brake.jpg'],
    videoName: 'caliper_sticking_test.mp4',
    invoiceNumber: 'INV-APH-2026-52901',
    submittedDate: '10 Sept 2026',
    status: 'under_review',
    warrantyPeriod: '18 Months / 30,000 km Warranty',
    outcome: 'replacement',
    outcomeNotes: 'Under engineering review with TVS Girling technical team. Initial replacement pre-approved.'
  },
  {
    id: 'WAR-2026-5544',
    orderId: 'APH-2026-98421',
    productId: ALL_PRODUCTS[1].id,
    product: ALL_PRODUCTS[1],
    partNumber: '09.8968.11',
    vehicle: MOCK_VEHICLE_TATA_ACE,
    problemDescription: 'Severe brake judder and surface warping detected within 500 km.',
    photos: ['/assets/prod_disc.jpg'],
    invoiceNumber: 'INV-APH-2026-98421',
    submittedDate: '21 Sept 2026',
    status: 'additional_info_required',
    warrantyPeriod: '12 Months Anti-Warp Guarantee',
    additionalInfoPrompt: 'Please provide mechanic runout gauge dial reading measurement (in millimeters) or workshop test certificate.'
  }
];

// -------------------------------------------------------------
// 4. MOCK CUSTOMER NOTIFICATIONS
// -------------------------------------------------------------
export const INITIAL_MOCK_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif-1',
    type: 'order_shipped',
    title: 'Consignment Dispatched • Blue Dart Air',
    message: 'Your TVS Girling Caliper from Sundaram Brakes (Order #APH-2026-87114) has been shipped via AWB BLUEDART-5510294.',
    timestamp: '20 Sept, 08:30 PM',
    read: false,
    orderId: 'APH-2026-87114'
  },
  {
    id: 'notif-2',
    type: 'return_update',
    title: 'Action Required: Return #RET-2026-1088',
    message: 'Apex Mobility has requested an additional photo of the Bosch packaging barcode to approve your return.',
    timestamp: '21 Sept, 09:45 AM',
    read: false,
    referenceId: 'RET-2026-1088'
  },
  {
    id: 'notif-3',
    type: 'delivered',
    title: 'Parts Delivered Successfully',
    message: 'Both packages for Order #APH-2026-98421 have been delivered. 10-day Fitment Guarantee is now active.',
    timestamp: '19 Sept, 02:45 PM',
    read: true,
    orderId: 'APH-2026-98421'
  },
  {
    id: 'notif-4',
    type: 'payment_confirmed',
    title: 'Payment Confirmed • Escrow Protected',
    message: 'Payment of ₹7,498 confirmed via UPI. Funds held safely in marketplace escrow until fitment confirmation.',
    timestamp: '18 Sept, 11:30 AM',
    read: true,
    orderId: 'APH-2026-98421'
  }
];

// -------------------------------------------------------------
// 5. MOCK SUPPORT TICKETS
// -------------------------------------------------------------
export const INITIAL_MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-8821',
    subject: 'Confirm compatibility for Tata Ace 2022 front shock absorbers',
    category: 'Technical Fitment',
    orderId: 'APH-2026-98421',
    status: 'Resolved',
    createdAt: '17 Sept 2026',
    lastUpdate: '18 Sept 2026',
    messages: [
      {
        sender: 'customer',
        text: 'Hi, can you confirm if part 09.8968.11 disc rotor fits Tata Ace Gold 2022 with 13-inch rim?',
        timestamp: '17 Sept, 04:00 PM'
      },
      {
        sender: 'support',
        text: 'Hello Rajesh! Yes, Brembo part 09.8968.11 is cataloged for Tata Ace Gold Dicor / BS6 models with standard 4-hole hub layout. You are covered by our 100% Fitment Guarantee.',
        timestamp: '18 Sept, 10:15 AM'
      }
    ]
  },
  {
    id: 'TCK-8849',
    subject: 'Tracking delay on DTDC package consignment',
    category: 'Shipping',
    orderId: 'APH-2026-87114',
    status: 'In Progress',
    createdAt: '21 Sept 2026',
    lastUpdate: '21 Sept 2026',
    messages: [
      {
        sender: 'customer',
        text: 'Package PKG-BOSCH-9930 has been in packed status since yesterday. When will DTDC pick it up?',
        timestamp: '21 Sept, 10:30 AM'
      },
      {
        sender: 'support',
        text: 'Hello Rajesh! We have alerted our logistics coordinator at Apex Mobility Mumbai warehouse. The DTDC pickup vehicle is scheduled for 2:00 PM today.',
        timestamp: '21 Sept, 11:15 AM'
      }
    ]
  }
];
