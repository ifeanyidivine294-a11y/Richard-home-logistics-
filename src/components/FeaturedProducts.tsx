import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const FeaturedProducts: React.FC = () => {
  const { products, setActiveTab, setSelectedCategory, setSelectedSubcategory } = useApp();

  const featuredList = products.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <section className="px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold text-[#172033] tracking-tight">
          Featured Products
        </h2>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setActiveTab('categories');
          }}
          className="text-xs font-semibold text-[#FF8500] hover:text-[#e07500] flex items-center gap-0.5 transition"
        >
          See All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {featuredList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
