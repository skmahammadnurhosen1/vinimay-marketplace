import React from 'react';
import { ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

interface CompatibilityBannerProps {
  onSelectVehicle: () => void;
}

export const CompatibilityBanner: React.FC<CompatibilityBannerProps> = ({ onSelectVehicle }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="rounded-xl overflow-hidden shadow-sm border border-blue-200 bg-white grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left: Blue section */}
        <div className="lg:col-span-5 bg-[#0B56D0] p-6 sm:p-7 text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold leading-tight">
              Get the Right Part. <br />
              Avoid Wrong Orders.
            </h3>
            <p className="text-[11px] text-blue-100">
              Verify your vehicle before purchasing.
            </p>
            <div>
              <button
                type="button"
                onClick={onSelectVehicle}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 font-bold text-xs rounded transition-colors cursor-pointer"
              >
                <span>Select Vehicle</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Center: Cars image */}
        <div className="lg:col-span-4 p-4 flex items-center justify-center bg-gradient-to-r from-blue-50/50 to-amber-50/30">
          <img
            src="/assets/banner_cars.jpg"
            alt="Compatible vehicles fleet"
            className="h-20 w-full max-w-sm object-cover rounded-lg shadow-xs"
          />
        </div>

        {/* Right: Yellow Box */}
        <div className="lg:col-span-3 bg-[#FFBA00] p-6 sm:p-7 text-gray-950 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-gray-950" />
          </div>
          <div className="font-bold text-xs leading-tight">
            Compatible Parts <br />
            Only
          </div>
        </div>
      </div>
    </section>
  );
};
