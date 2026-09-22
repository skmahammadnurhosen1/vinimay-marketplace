import React, { useState } from 'react';
import { Building2, ShieldCheck, Star, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Seller } from '../../types';

interface SellerCardProps {
  seller: Seller;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gray-50/80 rounded-2xl border border-gray-200/90 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Store info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#C59B27] shrink-0 shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                Authorized Seller
              </span>
              {seller.verified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-stone-950 mt-0.5">
              {seller.name}
            </h4>

            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <span className="flex items-center gap-1 font-bold text-stone-800">
                <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                <span>{seller.rating.toFixed(1)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span>{seller.city}, {seller.state}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Tier Badge */}
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>{seller.tier}</span>
          </span>
        </div>
      </div>

      {/* Seller Performance Highlights */}
      <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
        <span>⚡ 98.6% On-time dispatch rate</span>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-[#C59B27] hover:text-[#9E7A1C] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{showDetails ? 'Hide Credentials' : 'View Seller Details'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {showDetails && (
        <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1.5 animate-in fade-in duration-150">
          <p className="font-semibold text-gray-900">Distributor Profile:</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Direct tier-1 automotive spares partner with climate-controlled warehouse facilities in {seller.city}.
            All stock carries authentic manufacturer batch numbers and 100% genuine warranty verification.
          </p>
        </div>
      )}
    </div>
  );
};
