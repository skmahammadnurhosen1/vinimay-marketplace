import React from 'react';
import { ViewMode } from '../../types';

interface LoadingSkeletonProps {
  count?: number;
  viewMode?: ViewMode;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 8,
  viewMode = 'grid'
}) => {
  const items = Array.from({ length: count });

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-5 animate-pulse"
          >
            <div className="w-full md:w-56 h-40 bg-gray-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="w-full md:w-48 space-y-3 shrink-0 pt-2">
              <div className="h-6 bg-gray-200 rounded w-1/2 ml-auto" />
              <div className="h-8 bg-gray-200 rounded w-full" />
              <div className="h-7 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse flex flex-col"
        >
          <div className="aspect-[4/3] bg-gray-200 w-full" />
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
