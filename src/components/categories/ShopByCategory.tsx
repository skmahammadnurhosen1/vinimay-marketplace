import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '../../data/categories';
import { Category } from '../../types';

interface ShopByCategoryProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Explore genuine and OEM replacement assemblies for all systems
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs font-bold text-[#0B56D0] hover:text-[#0947AD] flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 5 Cards Row - Perfectly Equal Proportions & Uniform Image Sizing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {MARKETPLACE_CATEGORIES.map((cat: Category) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className="bg-white rounded-2xl border border-gray-200 hover:border-[#0B56D0] p-3.5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group h-full"
          >
            {/* Standardized Fixed Aspect-Ratio Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3.5">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-gray-700 px-2 py-0.5 rounded-md shadow-2xs border border-white">
                {cat.itemCount.toLocaleString()} Parts
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-between text-left space-y-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#0B56D0] transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 leading-normal">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0B56D0]">
                <span>View All</span>
                <span className="w-6 h-6 rounded-full bg-blue-50 group-hover:bg-[#0B56D0] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
