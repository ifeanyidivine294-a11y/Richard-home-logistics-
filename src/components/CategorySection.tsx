import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryId } from '../types';

export const CategorySection: React.FC = () => {
  const { categories, setSelectedCategory, setSelectedSubcategory, setActiveTab } = useApp();

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(null);
    setActiveTab('categories');
  };

  return (
    <section className="px-4 py-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold text-[#172033] tracking-tight">
          Shop by Category
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

      {/* Category Grid: 3 columns on mobile (6 items total) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="group flex flex-col items-center bg-white p-2 sm:p-2.5 rounded-xl border border-slate-100 shadow-2xs hover:shadow-sm hover:border-[#FF8500]/30 transition-all text-center focus:outline-hidden"
          >
            {/* Image Box */}
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-50 mb-1.5 flex items-center justify-center relative">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Category Name */}
            <span className="text-[11px] sm:text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-[#FF8500] transition-colors">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
