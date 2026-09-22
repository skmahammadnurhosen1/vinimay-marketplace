import React from 'react';
import { ShieldCheck, RotateCcw, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

interface WarrantyReturnInstallationProps {
  warranty: string;
  returnDays: number;
  installationGuidance?: string;
  category: string;
}

export const WarrantyReturnInstallation: React.FC<WarrantyReturnInstallationProps> = ({
  warranty,
  returnDays,
  installationGuidance,
  category
}) => {
  const defaultGuidance =
    installationGuidance ||
    'Professional automotive installation recommended. Always torque bolts to manufacturer specifications and perform safety road-test before full commercial load operation.';

  return (
    <div className="my-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Warranty, Returns & Installation Guidance
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent consumer protection policies and professional mechanical standards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* 1. Manufacturer Warranty */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-950">
              Official Manufacturer Warranty
            </h3>
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              {warranty}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              Covers manufacturing defects, premature material fatigue, structural warping, and metallurgical flaws under normal vehicle operating conditions.
            </p>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-2 border-t border-gray-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Serial number registration verified</span>
          </div>
        </div>

        {/* 2. 10-Day No-Questions Return Policy */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B56D0] flex items-center justify-center border border-blue-100 shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-950">
              {returnDays}-Day Easy Return Policy
            </h3>
            <div className="text-xs font-bold text-[#0B56D0] bg-blue-50 px-2.5 py-1 rounded-md inline-block">
              Zero-Risk Return Protection
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              If the spare part does not fit your vehicle or arrives in damaged condition, initiate an easy return within {returnDays} days in original packaging for a 100% full refund.
            </p>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-2 border-t border-gray-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0B56D0] shrink-0" />
            <span>Doorstep courier pickup available</span>
          </div>
        </div>

        {/* 3. Professional Installation Guidance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shadow-2xs">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-950">
              Installation & Workshop Guidance
            </h3>
            <div className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
              Professional Installation Recommended
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {defaultGuidance}
            </p>
          </div>

          <div className="text-[11px] text-amber-800 flex items-center gap-1.5 pt-2 border-t border-gray-100">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Keep installation invoice for warranty claims</span>
          </div>
        </div>
      </div>
    </div>
  );
};
