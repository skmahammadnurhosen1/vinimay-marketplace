import React from 'react';
import { ShieldCheck, CreditCard, Car, RotateCcw } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 py-3.5 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:divide-x divide-gray-200">
          {/* 1 */}
          <div className="flex items-center gap-3 sm:pl-2">
            <ShieldCheck className="w-6 h-6 text-[#0B56D0] shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-900">Verified Sellers</h4>
              <p className="text-[10px] text-gray-500">100% authentic products</p>
            </div>
          </div>

          {/* 2 */}
          <div className="flex items-center gap-3 lg:pl-6">
            <CreditCard className="w-6 h-6 text-[#0B56D0] shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-900">Secure Payments</h4>
              <p className="text-[10px] text-gray-500">Multiple payment options</p>
            </div>
          </div>

          {/* 3 */}
          <div className="flex items-center gap-3 lg:pl-6">
            <Car className="w-6 h-6 text-[#0B56D0] shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-900">Vehicle Compatibility</h4>
              <p className="text-[10px] text-gray-500">Right part for your vehicle</p>
            </div>
          </div>

          {/* 4 */}
          <div className="flex items-center gap-3 lg:pl-6">
            <RotateCcw className="w-6 h-6 text-[#0B56D0] shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-900">Easy Returns & Warranty</h4>
              <p className="text-[10px] text-gray-500">Hassle-free support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
