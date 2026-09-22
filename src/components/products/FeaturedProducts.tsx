import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  onViewProductDetails: (product: Product) => void;
  onViewAllClick?: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onViewProductDetails,
  onViewAllClick
}) => {
  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Popular Spare Parts
        </h2>
        <button
          onClick={onViewAllClick}
          className="text-xs font-semibold text-[#0B56D0] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* 6 Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewProductDetails}
          />
        ))}
      </div>
    </section>
  );
};
