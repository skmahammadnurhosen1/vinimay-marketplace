import { Review } from '../types';

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'prod-001': [
    {
      id: 'rev-001',
      userName: 'Manish Verma',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      verifiedPurchase: true,
      rating: 5,
      title: 'Exact fit for Tata Ace Gold — Zero squeal or vibration',
      comment: 'Ordered for our logistics fleet Tata Ace Gold (2022). The Bosch brake pads came in original hologram packaging. Friction bite is significantly better than local aftermarket alternatives. 4,000 km driven with heavy commercial loads, no dust and zero brake fade.',
      date: '14 Feb 2026',
      vehicleUsed: 'Tata Ace Gold (2022 Diesel)',
      helpfulCount: 38,
      photos: ['/assets/prod_brakepad.jpg', '/assets/cat_brake.jpg']
    },
    {
      id: 'rev-002',
      userName: 'Suresh Patil (Master Mechanic)',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      verifiedPurchase: true,
      rating: 5,
      title: 'Genuine Bosch ceramic pads with anti-squeal shims',
      comment: 'I run an independent commercial workshop in Pune. These are 100% genuine Bosch OE-spec pads. The backing plate thickness and chamfering are precise. Installed in under 20 minutes with zero modification needed.',
      date: '28 Jan 2026',
      vehicleUsed: 'Tata Ace HT / Gold',
      helpfulCount: 22
    },
    {
      id: 'rev-003',
      userName: 'Amitav Ghosh',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      verifiedPurchase: true,
      rating: 4,
      title: 'Great stopping power on Maruti Swift',
      comment: 'Installed on 2020 Swift ZXi. Great initial bite in monsoon city driving. Delivered in 2 business days to Kolkata. Highly recommend verifying your vehicle model year before ordering.',
      date: '10 Jan 2026',
      vehicleUsed: 'Maruti Suzuki Swift (2020 Petrol)',
      helpfulCount: 15
    },
    {
      id: 'rev-004',
      userName: 'Rajinder Singh',
      userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
      verifiedPurchase: true,
      rating: 5,
      title: 'Verified dealer dispatch, prompt delivery',
      comment: 'Packaging was sturdy with transit foam protection. Included wear sensors and shims as advertised. 5 stars for genuine parts guarantee.',
      date: '19 Dec 2025',
      vehicleUsed: 'Tata Ace Mega (2019)',
      helpfulCount: 9
    }
  ],
  'prod-004': [
    {
      id: 'rev-005',
      userName: 'Vikramaditya Roy',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      verifiedPurchase: true,
      rating: 5,
      title: 'Flawless Brembo High-Carbon disc rotors',
      comment: 'Replaced warped rotors on Toyota Innova Crysta. High-carbon metallurgy keeps disc temperature low on mountain descents. Balance and runout tolerance are within 0.02mm.',
      date: '02 Mar 2026',
      vehicleUsed: 'Toyota Innova Crysta (2021 Diesel)',
      helpfulCount: 45,
      photos: ['/assets/prod_disc.jpg']
    },
    {
      id: 'rev-006',
      userName: 'Harish Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      verifiedPurchase: true,
      rating: 5,
      title: 'Zero judder, 100% authentic Brembo India part',
      comment: 'Direct bolt-on replacement for Tata Ace Gold and Innova models. UV anti-rust coating on the hat prevents unsightly corrosion behind the alloys.',
      date: '18 Jan 2026',
      vehicleUsed: 'Tata Ace Gold (2023)',
      helpfulCount: 19
    }
  ]
};

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-default-1',
    userName: 'Rajesh Mukherjee',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    verifiedPurchase: true,
    rating: 5,
    title: 'Precision OEM fitment and high build quality',
    comment: 'The part arrived securely packaged with sealed warranty tags. Installed without any hassle. Genuine performance and direct compatibility with my vehicle.',
    date: '05 Feb 2026',
    vehicleUsed: 'Tata Ace Gold / Commercial Fleet',
    helpfulCount: 29
  },
  {
    id: 'rev-default-2',
    userName: 'Karthik Raman',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    verifiedPurchase: true,
    rating: 5,
    title: 'Fast dispatch from authorized distributor',
    comment: 'Was skeptical ordering automobile spares online, but this verified seller delivered authentic OEM components with valid batch number. 100% satisfied.',
    date: '22 Jan 2026',
    vehicleUsed: 'Maruti Suzuki Fleet',
    helpfulCount: 18
  },
  {
    id: 'rev-default-3',
    userName: 'Mohammad Tariq',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    verifiedPurchase: true,
    rating: 4,
    title: 'Solid build, well worth the price',
    comment: 'Fitment verified on our commercial transport. Highly recommend checking your engine code before ordering to ensure correct revision.',
    date: '12 Jan 2026',
    vehicleUsed: 'Commercial Utility Fleet',
    helpfulCount: 11
  }
];

export function getProductReviews(productId: string): Review[] {
  return MOCK_REVIEWS[productId] || DEFAULT_REVIEWS;
}
