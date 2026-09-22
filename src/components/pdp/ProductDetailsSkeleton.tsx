import React from 'react';

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-48" />

      {/* Main Two-Column Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Gallery Skeleton */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-200 rounded-xl" />
              <div className="w-20 h-20 bg-gray-200 rounded-xl" />
              <div className="w-20 h-20 bg-gray-200 rounded-xl" />
            </div>
          </div>

          {/* Right Column Details Skeleton */}
          <div className="lg:col-span-7 space-y-5">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-16 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
