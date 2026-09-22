import {
  SellerProfile,
  SellerKPIMetrics,
  SellerOrder,
  SellerProduct,
  SellerInventoryItem,
  SellerReturnItem,
  SellerWarrantyClaim,
  SellerSettlement,
  SellerNotification
} from '../types/seller';

export const MOCK_SELLER_PROFILE: SellerProfile = {
  id: 'seller-1',
  businessName: 'Apex Mobility Solutions (Bosch Certified)',
  sellerType: 'Authorized Distributor',
  ownerName: 'Vikramaditya Singhania',
  mobile: '+91 98201 54820',
  email: 'business@apexmobility.in',
  gstin: '27AABCA9124K1Z8',
  pan: 'AABCA9124K',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '50200048192041',
  ifsc: 'HDFC0000129',
  address: 'Unit 4B, Western Express Industrial Estate, Andheri East',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400069',
  rating: 4.9,
  reviewCount: 2840,
  kycStatus: 'Verified',
  joinedDate: '15 Jan 2024',
  documents: [
    {
      id: 'doc-1',
      type: 'gst_certificate',
      title: 'GST Registration Certificate (Form REG-06)',
      fileName: 'GSTIN_27AABCA9124K1Z8_Verified.pdf',
      fileSize: '1.4 MB',
      uploadedDate: '16 Jan 2024',
      status: 'Verified',
      notes: 'GSTIN validated against GSTN Portal via automated check'
    },
    {
      id: 'doc-2',
      type: 'pan_card',
      title: 'Company PAN Card',
      fileName: 'Apex_PAN_AABCA9124K.pdf',
      fileSize: '840 KB',
      uploadedDate: '16 Jan 2024',
      status: 'Verified'
    },
    {
      id: 'doc-3',
      type: 'bank_proof',
      title: 'Cancelled Cheque / Bank Statement',
      fileName: 'HDFC_Cancelled_Cheque_5020.pdf',
      fileSize: '1.1 MB',
      uploadedDate: '17 Jan 2024',
      status: 'Verified'
    },
    {
      id: 'doc-4',
      type: 'mfg_auth_letter',
      title: 'Bosch Tier-1 Authorized Distributor Letter',
      fileName: 'Bosch_India_Authorized_Distributor_2026.pdf',
      fileSize: '2.3 MB',
      uploadedDate: '18 Jan 2024',
      status: 'Verified',
      notes: 'Annual direct manufacturer partnership contract active'
    },
    {
      id: 'doc-5',
      type: 'biz_registration',
      title: 'Certificate of Incorporation (ROC Mumbai)',
      fileName: 'ROC_Incorporation_U34300MH2018PTC.pdf',
      fileSize: '1.9 MB',
      uploadedDate: '16 Jan 2024',
      status: 'Verified'
    }
  ]
};

export const MOCK_SELLER_KPIS: SellerKPIMetrics = {
  totalOrders: 1482,
  pendingOrders: 18,
  completedOrders: 1420,
  cancelledOrders: 44,
  returnRequests: 7,
  warrantyClaims: 4,
  totalSales: 4285400,
  platformCommission: 428540,
  netSettlement: 3856860,
  totalStock: 840,
  totalProducts: 42,
  lowStockCount: 3
};

export const MOCK_SALES_CHART = [
  { month: 'Oct 2025', gross: 320000, commission: 32000, net: 288000 },
  { month: 'Nov 2025', gross: 395000, commission: 39500, net: 355500 },
  { month: 'Dec 2025', gross: 440000, commission: 44000, net: 396000 },
  { month: 'Jan 2026', gross: 485000, commission: 48500, net: 436500 },
  { month: 'Feb 2026', gross: 560000, commission: 56000, net: 504000 },
  { month: 'Mar 2026', gross: 680000, commission: 68000, net: 612000 }
];

export const MOCK_SELLER_ORDERS: SellerOrder[] = [
  {
    id: 'PKG-APH-98421-BOSCH',
    marketplaceOrderId: 'APH-2026-98421',
    orderDate: '21 Sep 2026, 09:14 AM',
    customerSummary: {
      maskedName: 'Rajesh K. (Fleet Mgr)',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700001'
    },
    items: [
      {
        productId: 'prod-1',
        title: 'Bosch QuietCast Ceramic Front Brake Pad Set (Low-Dust)',
        partNumber: '0986AB1234',
        oemNumber: '2813-4210-01',
        brand: 'Bosch',
        partType: 'OEM',
        quantity: 2,
        unitPrice: 1849,
        totalPrice: 3698,
        image: '/assets/cat_brake.jpg',
        vehicleSummary: 'Tata Ace Gold (Diesel)'
      }
    ],
    totalAmount: 3698,
    commissionRate: 0.1,
    commissionAmount: 369.8,
    netPayout: 3328.2,
    paymentState: 'Paid',
    shipmentState: 'delivered',
    courierName: 'Blue Dart Surface Cargo',
    trackingNumber: 'BD-84729104',
    dispatchDate: '19 Sep 2026',
    estimatedDelivery: '21 Sep 2026 (Delivered)',
    checkpoints: [
      {
        stage: 'ordered',
        title: 'Order Confirmed & Route Approved',
        description: 'Payment verified, routed to Apex Mumbai Hub',
        timestamp: '19 Sep 2026, 09:30 AM',
        location: 'Mumbai Hub'
      },
      {
        stage: 'packed',
        title: 'QC Passed & Barcode Sealed',
        description: 'Double-wall carton packaged with transit shock seal',
        timestamp: '19 Sep 2026, 02:15 PM',
        location: 'Andheri Central Depot'
      },
      {
        stage: 'shipped',
        title: 'Handed to Blue Dart Logistics',
        description: 'Air cargo transit manifest generated',
        timestamp: '19 Sep 2026, 07:00 PM',
        location: 'BOM Cargo Terminal'
      },
      {
        stage: 'out_for_delivery',
        title: 'Out for Courier Delivery',
        description: 'Allocated to courier executive for delivery',
        timestamp: '21 Sep 2026, 08:45 AM',
        location: 'Kolkata Central Facility'
      },
      {
        stage: 'delivered',
        title: 'Customer Received & Verified',
        description: 'Delivered and signed by recipient',
        timestamp: '21 Sep 2026, 01:20 PM',
        location: 'Kolkata'
      }
    ]
  },
  {
    id: 'PKG-APH-87114-BOSCH',
    marketplaceOrderId: 'APH-2026-87114',
    orderDate: '20 Sep 2026, 11:30 AM',
    customerSummary: {
      maskedName: 'Sanjay M.',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081'
    },
    items: [
      {
        productId: 'prod-4',
        title: 'Bosch High-Performance Fuel Injector Nozzle Assembly',
        partNumber: '0445110059',
        oemNumber: 'BOS-INJ-771',
        brand: 'Bosch',
        partType: 'Genuine',
        quantity: 1,
        unitPrice: 4250,
        totalPrice: 4250,
        image: '/assets/prod_bearing.jpg',
        vehicleSummary: 'Mahindra Bolero Maxi Truck'
      }
    ],
    totalAmount: 4250,
    commissionRate: 0.1,
    commissionAmount: 425,
    netPayout: 3825,
    paymentState: 'Paid',
    shipmentState: 'shipped',
    courierName: 'Delhivery Express Cargo',
    trackingNumber: 'DEL-99214710',
    dispatchDate: '21 Sep 2026',
    estimatedDelivery: '23 Sep 2026',
    checkpoints: [
      {
        stage: 'ordered',
        title: 'Order Verified & Approved',
        description: 'Payment confirmed by gateway',
        timestamp: '20 Sep 2026, 11:35 AM',
        location: 'Automated Gateway'
      },
      {
        stage: 'packed',
        title: 'Packed & Weighed',
        description: 'Net weight 0.85kg, bubble wrapped & seal coded',
        timestamp: '20 Sep 2026, 04:00 PM',
        location: 'Apex Mumbai Depot'
      },
      {
        stage: 'shipped',
        title: 'Departed Mumbai Sorting Facility',
        description: 'Linehaul container truck en route to Hyderabad',
        timestamp: '21 Sep 2026, 06:15 AM',
        location: 'Bhiwandi Logistic Hub'
      }
    ]
  },
  {
    id: 'PKG-APH-74920-BOSCH',
    marketplaceOrderId: 'APH-2026-74920',
    orderDate: '21 Sep 2026, 08:05 AM',
    customerSummary: {
      maskedName: 'Anil K. (Fleet Services)',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001'
    },
    items: [
      {
        productId: 'prod-2',
        title: 'Bosch Platinum Spark Plug (Set of 4)',
        partNumber: '0242236544',
        oemNumber: 'FR7DC+',
        brand: 'Bosch',
        partType: 'OEM',
        quantity: 2,
        unitPrice: 890,
        totalPrice: 1780,
        image: '/assets/cat_spark.jpg',
        vehicleSummary: 'Maruti Suzuki Swift'
      }
    ],
    totalAmount: 1780,
    commissionRate: 0.1,
    commissionAmount: 178,
    netPayout: 1602,
    paymentState: 'Pending (COD)',
    shipmentState: 'packed',
    courierName: 'DTDC Express Logistics',
    trackingNumber: 'DT-44810291',
    estimatedDelivery: '22 Sep 2026',
    checkpoints: [
      {
        stage: 'ordered',
        title: 'Order Created',
        description: 'COD verification completed via SMS OTP',
        timestamp: '21 Sep 2026, 08:10 AM',
        location: 'System'
      },
      {
        stage: 'packed',
        title: 'Ready for Courier Pickup',
        description: 'Barcode label affixed, awaiting courier morning route',
        timestamp: '21 Sep 2026, 10:30 AM',
        location: 'Apex Andheri Depot'
      }
    ]
  },
  {
    id: 'PKG-APH-61025-BOSCH',
    marketplaceOrderId: 'APH-2026-61025',
    orderDate: '21 Sep 2026, 12:40 PM',
    customerSummary: {
      maskedName: 'Devendra P.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001'
    },
    items: [
      {
        productId: 'prod-1',
        title: 'Bosch QuietCast Ceramic Front Brake Pad Set',
        partNumber: '0986AB1234',
        brand: 'Bosch',
        partType: 'OEM',
        quantity: 1,
        unitPrice: 1849,
        totalPrice: 1849,
        image: '/assets/cat_brake.jpg',
        vehicleSummary: 'Tata Ace Gold'
      }
    ],
    totalAmount: 1849,
    commissionRate: 0.1,
    commissionAmount: 184.9,
    netPayout: 1664.1,
    paymentState: 'Paid',
    shipmentState: 'ordered',
    courierName: 'Blue Dart Surface Cargo',
    trackingNumber: 'Pending Allocation',
    estimatedDelivery: '24 Sep 2026',
    checkpoints: [
      {
        stage: 'ordered',
        title: 'Order Created & Pending Dispatch',
        description: 'Picking slip generated. Awaiting warehouse packing.',
        timestamp: '21 Sep 2026, 12:45 PM',
        location: 'Apex Depot System'
      }
    ]
  }
];

export const MOCK_SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: 'prod-1',
    title: 'Bosch QuietCast Premium Ceramic Front Brake Pad Set',
    brand: 'Bosch',
    manufacturer: 'Bosch Automotive Aftermarket Pvt Ltd',
    partNumber: '0986AB1234',
    oemNumber: '2813-4210-01',
    category: 'brake-system',
    subCategory: 'Brake Pads',
    partType: 'OEM',
    price: 1849,
    mrp: 2499,
    discountPercentage: 26,
    stockCount: 84,
    lowStockThreshold: 15,
    status: 'active',
    images: ['/assets/cat_brake.jpg', '/assets/cat_suspension.jpg'],
    description:
      'Engineered specifically for extreme Indian highway and urban stop-and-go driving conditions with zero brake squeal and ultra-low rotor wear.',
    features: [
      'Multi-layer sound insulating rubber core shims',
      'OE-style chamfers and slots for silent braking',
      'ECE R90 certified metallurgy'
    ],
    specifications: {
      'Axle Position': 'Front Axle Left & Right',
      Thickness: '17.2 mm',
      'Brake System': 'Akebono Type Caliper',
      Friction: 'GG Rating'
    },
    compatibility: [
      {
        manufacturer: 'Tata',
        model: 'Ace Gold',
        yearRange: '2018-2026',
        engine: '700cc Dicor',
        fuelType: 'Diesel'
      },
      {
        manufacturer: 'Tata',
        model: 'Ace HT',
        yearRange: '2015-2024',
        engine: '702cc Natural',
        fuelType: 'Diesel'
      }
    ],
    warranty: '12 Months / 20,000 KM Manufacturer Warranty',
    returnDays: 10,
    createdAt: '12 Feb 2025'
  },
  {
    id: 'prod-2',
    title: 'Bosch Platinum-Iridium Spark Plug Set (Pack of 4)',
    brand: 'Bosch',
    manufacturer: 'Bosch GmbH',
    partNumber: '0242236544',
    oemNumber: 'FR7DC+',
    category: 'ignition-system',
    subCategory: 'Spark Plugs',
    partType: 'OEM',
    price: 890,
    mrp: 1200,
    discountPercentage: 25,
    stockCount: 120,
    lowStockThreshold: 20,
    status: 'active',
    images: ['/assets/cat_spark.jpg'],
    description:
      'Continuous wave 360-degree laser welded platinum tip provides superior ignitability and 4x longer operational life than copper plugs.',
    features: [
      '0.6mm ultra-fine wire platinum center electrode',
      'Nickel-plated shell with rolled threads prevents seizure',
      'Factory pre-gapped precision'
    ],
    specifications: {
      Gap: '0.8 mm',
      'Thread Size': 'M14 x 1.25',
      Hex: '16 mm'
    },
    compatibility: [
      {
        manufacturer: 'Maruti Suzuki',
        model: 'Swift',
        yearRange: '2017-2025',
        engine: '1.2L K12M / DualJet',
        fuelType: 'Petrol'
      },
      {
        manufacturer: 'Hyundai',
        model: 'i20',
        yearRange: '2016-2024',
        engine: '1.2L Kappa',
        fuelType: 'Petrol'
      }
    ],
    warranty: '24 Months / 40,000 KM Warranty',
    returnDays: 10,
    createdAt: '20 Jan 2025'
  },
  {
    id: 'prod-4',
    title: 'Bosch High-Performance Common Rail Fuel Injector Nozzle Assembly',
    brand: 'Bosch',
    manufacturer: 'Bosch Diesel Systems',
    partNumber: '0445110059',
    oemNumber: 'BOS-INJ-771',
    category: 'fuel-system',
    subCategory: 'Fuel Injectors',
    partType: 'Genuine',
    price: 4250,
    mrp: 5400,
    discountPercentage: 21,
    stockCount: 8,
    lowStockThreshold: 10,
    status: 'active',
    images: ['/assets/prod_bearing.jpg'],
    description:
      'Calibrated solenoid micro-metering diesel fuel injection valve for maximum thermal efficiency and low emissions in commercial fleets.',
    features: [
      'Genuine factory calibrated test bench data included',
      'Diamond-like carbon coated valve needle',
      'Pressures up to 2000 bar supported'
    ],
    specifications: {
      'System Type': 'Common Rail CR/IPL',
      Voltage: '12V Piezoelectric Solenoid'
    },
    compatibility: [
      {
        manufacturer: 'Mahindra',
        model: 'Bolero Maxi Truck',
        yearRange: '2017-2026',
        engine: 'm2DiCR 2.5L',
        fuelType: 'Diesel'
      }
    ],
    warranty: '12 Months Manufacturer Warranty',
    returnDays: 10,
    createdAt: '05 Mar 2025'
  },
  {
    id: 'prod-7',
    title: 'Bosch Heavy Duty 12V 90A Commercial Alternator',
    brand: 'Bosch',
    manufacturer: 'Bosch Electrical Drives',
    partNumber: '0124325003',
    oemNumber: 'ALT-90A-CV',
    category: 'electrical-system',
    subCategory: 'Alternators',
    partType: 'Genuine',
    price: 7850,
    mrp: 9500,
    discountPercentage: 17,
    stockCount: 4,
    lowStockThreshold: 6,
    status: 'active',
    images: ['/assets/cat_engine.jpg'],
    description:
      'High-amperage alternator designed for commercial vehicles powering auxiliary cooling, GPS telematics, and heavy lighting.',
    features: [
      'Heavy duty copper windings with double resin dip',
      'Integrated electronic voltage regulator',
      'Sealed bearings for dust & humidity resistance'
    ],
    specifications: {
      Amperage: '90 Amps',
      Voltage: '12 Volts',
      Rotation: 'Clockwise'
    },
    compatibility: [
      {
        manufacturer: 'Tata',
        model: '407 Gold',
        yearRange: '2016-2025',
        engine: '3.0L Dicor',
        fuelType: 'Diesel'
      }
    ],
    warranty: '18 Months Replacement Warranty',
    returnDays: 10,
    createdAt: '18 Apr 2025'
  }
];

export const MOCK_SELLER_INVENTORY: SellerInventoryItem[] = [
  {
    productId: 'prod-1',
    title: 'Bosch QuietCast Premium Ceramic Front Brake Pad Set',
    partNumber: '0986AB1234',
    brand: 'Bosch',
    category: 'Brake System',
    image: '/assets/cat_brake.jpg',
    currentStock: 84,
    reservedStock: 6,
    availableStock: 78,
    lowStockThreshold: 15,
    isLowStock: false,
    unitPrice: 1849,
    totalValue: 155316,
    lastRestocked: '15 Sep 2026'
  },
  {
    productId: 'prod-2',
    title: 'Bosch Platinum-Iridium Spark Plug Set (Pack of 4)',
    partNumber: '0242236544',
    brand: 'Bosch',
    category: 'Ignition System',
    image: '/assets/cat_spark.jpg',
    currentStock: 120,
    reservedStock: 12,
    availableStock: 108,
    lowStockThreshold: 20,
    isLowStock: false,
    unitPrice: 890,
    totalValue: 106800,
    lastRestocked: '10 Sep 2026'
  },
  {
    productId: 'prod-4',
    title: 'Bosch High-Performance Common Rail Fuel Injector Nozzle',
    partNumber: '0445110059',
    brand: 'Bosch',
    category: 'Fuel System',
    image: '/assets/prod_bearing.jpg',
    currentStock: 8,
    reservedStock: 2,
    availableStock: 6,
    lowStockThreshold: 10,
    isLowStock: true,
    unitPrice: 4250,
    totalValue: 34000,
    lastRestocked: '01 Aug 2026'
  },
  {
    productId: 'prod-7',
    title: 'Bosch Heavy Duty 12V 90A Commercial Alternator',
    partNumber: '0124325003',
    brand: 'Bosch',
    category: 'Electrical System',
    image: '/assets/cat_engine.jpg',
    currentStock: 4,
    reservedStock: 1,
    availableStock: 3,
    lowStockThreshold: 6,
    isLowStock: true,
    unitPrice: 7850,
    totalValue: 31400,
    lastRestocked: '20 Jul 2026'
  }
];

export const MOCK_SELLER_RETURNS: SellerReturnItem[] = [
  {
    id: 'RET-2026-081',
    orderId: 'APH-2026-61025',
    productId: 'prod-1',
    productTitle: 'Bosch QuietCast Ceramic Front Brake Pad Set',
    partNumber: '0986AB1234',
    productImage: '/assets/cat_brake.jpg',
    quantity: 1,
    reason: 'Product Not Compatible',
    customerExplanation:
      'Caliper bracket geometry was modified on my modified 2016 Ace chassis. The pads did not clip into the rotor slide pin.',
    submittedDate: '20 Sep 2026, 04:15 PM',
    status: 'under_verification',
    refundAmount: 1849,
    evidencePhotos: ['/assets/cat_brake.jpg'],
    vehicleDetails: 'Tata Ace 2016 Custom Axle'
  },
  {
    id: 'RET-2026-074',
    orderId: 'APH-2026-58190',
    productId: 'prod-2',
    productTitle: 'Bosch Platinum-Iridium Spark Plug Set',
    partNumber: '0242236544',
    productImage: '/assets/cat_spark.jpg',
    quantity: 1,
    reason: 'Wrong Product Received',
    customerExplanation:
      'Outer box said FR7DC+ but inner plugs were copper standard model 0242229656.',
    submittedDate: '17 Sep 2026, 11:10 AM',
    status: 'pickup_scheduled',
    refundAmount: 890,
    evidencePhotos: ['/assets/cat_spark.jpg'],
    vehicleDetails: 'Maruti Swift Petrol'
  }
];

export const MOCK_SELLER_WARRANTIES: SellerWarrantyClaim[] = [
  {
    id: 'WAR-2026-039',
    orderId: 'APH-2026-52901',
    productId: 'prod-4',
    productTitle: 'Bosch Common Rail Fuel Injector Nozzle Assembly',
    partNumber: '0445110059',
    vehicle: {
      vehicleType: 'commercial',
      manufacturer: 'Mahindra',
      model: 'Bolero Maxi Truck',
      year: 2022,
      fuelType: 'Diesel',
      engine: 'm2DiCR 2.5L',
      variant: 'Standard'
    },
    problemDescription:
      'Severe fuel leak from nozzle sealing washer seat and ECU error code P0087 (Fuel Rail Pressure Too Low) under load.',
    photos: ['/assets/prod_bearing.jpg'],
    videoName: 'bolero_injector_leak_test.mp4',
    invoiceNumber: 'INV-APH-2026-52901',
    submittedDate: '18 Sep 2026, 02:40 PM',
    status: 'under_review',
    outcome: 'replacement',
    outcomeNotes: 'Technical inspection confirmed microscopic crack near high-pressure collar. Replacement unit approved.',
    warrantyPeriod: '12 Months / 20,000 KM'
  }
];

export const MOCK_SELLER_SETTLEMENTS: SellerSettlement[] = [
  {
    id: 'SETTLE-2026-084',
    orderId: 'APH-2026-98421',
    grossSales: 3698,
    commissionDeducted: 369.8,
    gstOnCommission: 66.56,
    netSettled: 3261.64,
    status: 'Settled',
    settlementDate: '21 Sep 2026',
    utrReference: 'HDFC262640192841',
    bankAccountSummary: 'HDFC Bank •••• 2041'
  },
  {
    id: 'SETTLE-2026-083',
    orderId: 'APH-2026-95104',
    grossSales: 8940,
    commissionDeducted: 894.0,
    gstOnCommission: 160.92,
    netSettled: 7885.08,
    status: 'Settled',
    settlementDate: '18 Sep 2026',
    utrReference: 'HDFC262610849201',
    bankAccountSummary: 'HDFC Bank •••• 2041'
  },
  {
    id: 'SETTLE-2026-082',
    orderId: 'APH-2026-87114',
    grossSales: 4250,
    commissionDeducted: 425.0,
    gstOnCommission: 76.5,
    netSettled: 3748.5,
    status: 'Processing',
    settlementDate: '23 Sep 2026 (Scheduled)',
    utrReference: 'Pending UTR Generation',
    bankAccountSummary: 'HDFC Bank •••• 2041'
  }
];

export const MOCK_SELLER_NOTIFICATIONS: SellerNotification[] = [
  {
    id: 'notif-s1',
    type: 'new_order',
    title: 'New Consignment Dispatch Requisition',
    message: 'Order #APH-2026-74920 contains 2x Spark Plugs. Pack by 04:00 PM today.',
    timestamp: '21 Sep 2026, 08:05 AM',
    read: false,
    linkId: 'PKG-APH-74920-BOSCH'
  },
  {
    id: 'notif-s2',
    type: 'return_request',
    title: 'New Customer Return Initiated',
    message: 'Return #RET-2026-081 raised for Brake Pad Set. Reason: Product Not Compatible.',
    timestamp: '20 Sep 2026, 04:15 PM',
    read: false,
    linkId: 'RET-2026-081'
  },
  {
    id: 'notif-s3',
    type: 'settlement',
    title: 'Payout Transferred: ₹7,885.08',
    message: 'Batch settlement credited to HDFC Bank A/c 2041 via NEFT (UTR: HDFC262610849201).',
    timestamp: '18 Sep 2026, 06:30 PM',
    read: true,
    linkId: 'SETTLE-2026-083'
  },
  {
    id: 'notif-s4',
    type: 'stock_alert',
    title: 'Low Stock Alert: Fuel Injector Nozzle',
    message: 'Only 6 units available in warehouse. Reorder recommended.',
    timestamp: '17 Sep 2026, 10:00 AM',
    read: true,
    linkId: 'prod-4'
  }
];
