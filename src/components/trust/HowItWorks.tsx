import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Select Your Vehicle',
      desc: 'Tell us your vehicle details'
    },
    {
      num: '02',
      title: 'Find Compatible Parts',
      desc: 'Browse verified parts'
    },
    {
      num: '03',
      title: 'Buy From Verified Sellers',
      desc: 'Choose trusted sellers'
    },
    {
      num: '04',
      title: 'Track Your Order',
      desc: 'Real-time tracking & delivery'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          How It Works
        </h2>
        <button
          onClick={() => {}}
          className="text-xs font-semibold text-[#0B56D0] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* 4 Steps Row */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center gap-3.5 relative">
              {/* Blue Circular Badge */}
              <div className="w-8 h-8 rounded-full bg-[#0B56D0] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {step.num}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                  {step.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {step.desc}
                </p>
              </div>

              {/* Divider for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
