import React from 'react';
import { ArrowRight, Building2, ShieldCheck, TrendingUp, Users } from 'lucide-react';

interface BecomeASellerSectionProps {
  onOpenSellerModal: () => void;
}

export const BecomeASellerSection: React.FC<BecomeASellerSectionProps> = ({ onOpenSellerModal }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="relative bg-gradient-to-r from-[#083D99] via-[#0B56D0] to-[#1268F3] rounded-2xl overflow-hidden shadow-lg border border-blue-400/20 p-6 sm:p-8 text-white">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FFBA00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Delivery person image + Text */}
          <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md bg-blue-900/50">
              <img
                src="/assets/seller_person.jpg"
                alt="Marketplace seller"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold leading-snug text-white">
                Sell Your Spare Parts With Us
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-md">
                Reach customers across India through our growing automotive marketplace.
              </p>
            </div>
          </div>

          {/* Center: 4 Business Badges - visible across devices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex items-center gap-2 sm:gap-3 w-full lg:w-auto min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 text-[11px] sm:text-xs text-blue-50 transition-colors min-w-0">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFBA00] shrink-0" />
              <span className="font-medium truncate">Manufacturer</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 text-[11px] sm:text-xs text-blue-50 transition-colors min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFBA00] shrink-0" />
              <span className="font-medium truncate">Distributor</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 text-[11px] sm:text-xs text-blue-50 transition-colors min-w-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFBA00] shrink-0" />
              <span className="font-medium truncate">Wholesaler</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 text-[11px] sm:text-xs text-blue-50 transition-colors min-w-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFBA00] shrink-0" />
              <span className="font-medium truncate">Retailer</span>
            </div>
          </div>

          {/* Right: Yellow button */}
          <div className="w-full sm:w-auto flex justify-end shrink-0">
            <button
              onClick={onOpenSellerModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#FFBA00] hover:bg-[#EAA500] active:scale-[0.98] text-gray-950 font-bold text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer group"
            >
              <span>Become a Seller</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
