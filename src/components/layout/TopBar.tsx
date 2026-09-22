import React from 'react';
import { Phone, MessageSquare, Truck, ShieldCheck, Store } from 'lucide-react';

interface TopBarProps {
  onOpenSellerModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSellerModal }) => {
  return (
    <div className="bg-[#111317] text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Support and helpline */}
        <div className="flex items-center space-x-5">
          <a
            href="tel:18002097278"
            className="flex items-center gap-1.5 hover:text-[#E8D5A3] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="font-medium text-stone-200">Toll-Free:</span>
            <span>1800-209-PARTS (7278)</span>
          </a>
          <span className="hidden sm:inline text-stone-700">|</span>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 hover:text-[#E8D5A3] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
        </div>

        {/* Center: Trust guarantee */}
        <div className="hidden md:flex items-center gap-4 text-stone-400">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Pan-India Express Dispatch Across 19,000+ Pin Codes</span>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-stone-300">100% Guaranteed Vehicle Fitment</span>
          </div>
        </div>

        {/* Right: Seller link & currency */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenSellerModal}
            className="flex items-center gap-1.5 text-stone-300 hover:text-[#E8D5A3] transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="font-semibold text-[#E8D5A3]">Sell on AutoPartsHub</span>
          </button>
          <span className="text-stone-700">|</span>
          <div className="flex items-center gap-1 font-medium text-stone-300">
            <span className="text-[#C59B27] font-bold">₹</span>
            <span>INR</span>
          </div>
        </div>
      </div>
    </div>
  );
};
