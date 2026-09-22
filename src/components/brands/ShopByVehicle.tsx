import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ShopByVehicleProps {
  onSelectBrand: (brandName: string) => void;
}

export const ShopByVehicle: React.FC<ShopByVehicleProps> = ({ onSelectBrand }) => {
  const brands = [
    {
      id: 'maruti',
      name: 'Maruti Suzuki',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Suzuki Red 'S' */}
          <path
            d="M38 5 L64 5 L52 18 L65 18 L48 35 L22 35 L34 22 L21 22 Z"
            fill="#E31837"
          />
        </svg>
      )
    },
    {
      id: 'hyundai',
      name: 'Hyundai',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Hyundai Blue Slanted H Oval */}
          <ellipse cx="50" cy="20" rx="26" ry="15" fill="none" stroke="#002C6C" strokeWidth="3" />
          <path
            d="M39 12 C41 20 45 26 47 28 M61 12 C59 20 55 26 53 28 M38 20 L62 20"
            stroke="#002C6C"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )
    },
    {
      id: 'tata',
      name: 'Tata',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Tata Circular Blue Logo */}
          <circle cx="50" cy="20" r="15" fill="none" stroke="#005A9C" strokeWidth="3" />
          <path
            d="M42 15 L58 15 M50 15 L50 27 M44 24 C48 20 52 18 56 18"
            stroke="#005A9C"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )
    },
    {
      id: 'mahindra',
      name: 'Mahindra',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Mahindra Twin Peaks Red Logo */}
          <path
            d="M36 28 L46 10 L50 19 L54 10 L64 28 L58 28 L52 17 L50 22 L48 17 L42 28 Z"
            fill="#D71921"
          />
        </svg>
      )
    },
    {
      id: 'toyota',
      name: 'Toyota',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Toyota Triple Ovals */}
          <ellipse cx="50" cy="20" rx="25" ry="15" fill="none" stroke="#EB0A1E" strokeWidth="2.8" />
          <ellipse cx="50" cy="17" rx="13" ry="7" fill="none" stroke="#EB0A1E" strokeWidth="2.8" />
          <ellipse cx="50" cy="20" rx="6" ry="15" fill="none" stroke="#EB0A1E" strokeWidth="2.8" />
        </svg>
      )
    },
    {
      id: 'kia',
      name: 'Kia',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Kia Red Wordmark Oval */}
          <ellipse cx="50" cy="20" rx="28" ry="15" fill="none" stroke="#BB162B" strokeWidth="2.8" />
          <text
            x="50"
            y="26"
            fontFamily="system-ui, sans-serif"
            fontSize="18"
            fontWeight="900"
            fill="#BB162B"
            textAnchor="middle"
            letterSpacing="2"
          >
            KIA
          </text>
        </svg>
      )
    },
    {
      id: 'ashok-leyland',
      name: 'Ashok Leyland',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Ashok Leyland Wheel */}
          <circle cx="50" cy="20" r="14" fill="none" stroke="#00539F" strokeWidth="3" />
          <path
            d="M50 8 L50 32 M38 20 L62 20 M42 12 L58 28 M42 28 L58 12"
            stroke="#00539F"
            strokeWidth="2.2"
          />
        </svg>
      )
    },
    {
      id: 'eicher',
      name: 'Eicher',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* Eicher Red Triangle Emblem */}
          <polygon points="50,7 66,29 34,29" fill="none" stroke="#D32F2F" strokeWidth="3.5" />
          <circle cx="50" cy="21" r="5" fill="#D32F2F" />
        </svg>
      )
    },
    {
      id: 'bharatbenz',
      name: 'BharatBenz',
      logo: (
        <svg viewBox="0 0 100 45" className="w-16 h-8">
          {/* BharatBenz Circular Star Badge */}
          <circle cx="50" cy="20" r="14" fill="#0F172A" />
          <polygon
            points="50,9 54,18 63,20 56,25 58,33 50,28 42,33 44,25 37,20 46,18"
            fill="#FFFFFF"
          />
        </svg>
      )
    }
  ];

  return (
    <section id="brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Shop by Vehicle
        </h2>
        <button
          onClick={() => onSelectBrand('All')}
          className="text-xs font-semibold text-[#0B56D0] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* 9 Brand Cards in a clean row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5 sm:gap-3">
        {brands.map(brand => (
          <button
            key={brand.id}
            onClick={() => onSelectBrand(brand.name)}
            className="bg-white rounded-xl border border-gray-200 p-2 sm:p-2.5 hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center justify-center h-24 group cursor-pointer min-w-0 overflow-hidden"
          >
            <div className="h-10 w-full flex items-center justify-center">
              {brand.logo}
            </div>
            <span className="text-[11px] font-bold text-gray-800 text-center mt-1 leading-tight group-hover:text-[#0B56D0]">
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
