import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CinematicHeroProps {
  onShopPartsClick: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onShopPartsClick }) => {
  return (
    <section className="relative overflow-hidden min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex items-center border-b border-gray-200">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero_cars.jpg"
          alt="Luxury performance vehicles"
          className="w-full h-full object-cover object-center lg:object-right"
        />
        {/* Soft, clean gradient overlay so the text on the left remains crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:via-white/75 lg:via-white/70 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl space-y-4">
          <span className="text-[11px] font-bold tracking-widest text-[#0B56D0] uppercase block">
            PREMIUM AUTOMOBILE SPARE PARTS MARKETPLACE
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
            Find the Right Part <br />
            for the <span className="text-[#0B56D0]">Right Vehicle</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed max-w-md">
            Shop genuine, OEM and aftermarket spare parts <br className="hidden sm:inline" />
            for passenger and commercial vehicles.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onShopPartsClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold text-xs rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-98"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
