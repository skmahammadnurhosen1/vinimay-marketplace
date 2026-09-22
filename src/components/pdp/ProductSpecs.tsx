import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

interface ProductSpecsProps {
  product: Product;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  const allSpecs: Record<string, string> = {
    Brand: product.brand,
    Manufacturer: product.manufacturer || `${product.brand} Automotive Pvt Ltd`,
    'Part Number': product.partNumber,
    'OEM Reference Number': product.oemNumber || 'Direct Replacement Specification',
    'Product Quality Tier': `${product.partType} Standard`,
    Category: product.category.replace('-', ' ').toUpperCase(),
    Subcategory: product.subCategory,
    ...product.specifications,
    'Warranty Duration': product.warranty,
    'Return Window': `${product.returnDays} Days Return Eligibility`,
    'Country of Origin': 'India',
    'Compliance Standard': 'ISO/TS 16949 & ECE R90 Certified'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs my-8 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#0B56D0]" />
          <span>Technical & Engineering Specifications</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Detailed technical parameters, physical dimensions, and metallurgical certifications
        </p>
      </div>

      {/* 2-Column Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-xs">
        {Object.entries(allSpecs).map(([label, value], idx) => (
          <div
            key={label}
            className="flex items-center justify-between py-2.5 border-b border-gray-100 gap-4"
          >
            <span className="text-gray-500 font-medium shrink-0">{label}</span>
            <span className="font-bold text-gray-950 text-right font-mono truncate">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Engineering Features */}
      {product.features && product.features.length > 0 && (
        <div className="pt-2 space-y-3">
          <h3 className="text-sm font-bold text-gray-900">
            Manufacturing Standards & Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
            {product.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
