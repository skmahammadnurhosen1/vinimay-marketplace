import React from 'react';
import { Product, ViewMode } from '../../types';
import { DetailedProductCard } from './DetailedProductCard';

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  onViewDetails: (product: Product) => void;
  onViewCompatibleVehicles: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  onViewDetails,
  onViewCompatibleVehicles
}) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <DetailedProductCard
            key={product.id}
            product={product}
            viewMode="list"
            onViewDetails={onViewDetails}
            onViewCompatibleVehicles={onViewCompatibleVehicles}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <DetailedProductCard
          key={product.id}
          product={product}
          viewMode="grid"
          onViewDetails={onViewDetails}
          onViewCompatibleVehicles={onViewCompatibleVehicles}
        />
      ))}
    </div>
  );
};
