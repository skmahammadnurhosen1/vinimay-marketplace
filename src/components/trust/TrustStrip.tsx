import React from 'react';
import { ShieldCheck, Cog, Lock } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20 mb-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 py-3.5 px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x divide-gray-200">
          {/* Block 1 */}
          <div className="flex items-center gap-3.5 pl-2">
            <ShieldCheck className="w-7 h-7 text-[#0B56D0] shrink-0 stroke-[1.8]" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">Verified Sellers</h4>
              <p className="text-[11px] text-gray-500">Trusted & rated by customers</p>
            </div>
          </div>

          {/* Block 2 */}
          <div className="flex items-center gap-3.5 md:pl-8">
            <Cog className="w-7 h-7 text-[#0B56D0] shrink-0 stroke-[1.8]" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">Genuine / OEM / Aftermarket</h4>
              <p className="text-[11px] text-gray-500">100% authentic products</p>
            </div>
          </div>

          {/* Block 3 */}
          <div className="flex items-center gap-3.5 md:pl-8">
            <Lock className="w-7 h-7 text-[#0B56D0] shrink-0 stroke-[1.8]" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">Secure Payments</h4>
              <p className="text-[11px] text-gray-500">Multiple payment options</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
