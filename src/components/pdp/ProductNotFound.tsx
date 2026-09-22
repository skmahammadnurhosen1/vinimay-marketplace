import React from 'react';
import { AlertCircle, ArrowLeft, Search } from 'lucide-react';

interface ProductNotFoundProps {
  onBackToShop: () => void;
  onBackToHome: () => void;
}

export const ProductNotFound: React.FC<ProductNotFoundProps> = ({
  onBackToShop,
  onBackToHome
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Product Not Found
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          The requested spare part could not be located in our catalog, or may have been discontinued by the distributor.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToShop}
          className="px-5 py-2.5 bg-[#0B56D0] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Spare Parts</span>
        </button>

        <button
          type="button"
          onClick={onBackToHome}
          className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 transition-colors cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};
