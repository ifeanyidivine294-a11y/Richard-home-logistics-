import React, { useState, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { formatNaira } from '../utils/formatters';
import { CategoryId } from '../types';

export const CatalogueView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    searchQuery,
    setSearchQuery,
    setActiveTab
  } = useApp();

  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  // Current category object
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  // Subcategories list
  const subcategoryList = useMemo(() => {
    if (currentCategory) {
      return currentCategory.subcategories;
    }
    return ['All'];
  }, [currentCategory]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }
      // Subcategory filter
      if (selectedSubcategory && selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSub = p.subcategory.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSub && !matchesCat) {
          return false;
        }
      }
      // Price filter
      if (p.price > priceRange) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, priceRange, sortBy]);

  return (
    <div className="pb-24">
      {/* Category Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (selectedSubcategory && selectedSubcategory !== 'All') {
                  setSelectedSubcategory(null);
                } else if (selectedCategory) {
                  setSelectedCategory(null);
                } else {
                  setActiveTab('home');
                }
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#172033] tracking-tight">
                {currentCategory ? currentCategory.name : searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-[10px] text-slate-500">
                {filteredProducts.length} items available
              </p>
            </div>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Category Switcher Tabs if no category selected or for quick jump */}
        {!selectedCategory && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-[#071B49] text-white"
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryId)}
                className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Subcategory Chips (Horizontal Scroller) */}
        {selectedCategory && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
            {subcategoryList.map((sub) => {
              const isActive = (selectedSubcategory === sub) || (!selectedSubcategory && sub === 'All');
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub === 'All' ? null : sub)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#071B49] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Search & Filter chips bar */}
      {(searchQuery || priceRange < 1000000 || sortBy !== 'featured') && (
        <div className="px-4 pt-2.5 flex items-center gap-2 flex-wrap text-xs">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-[#FF8500]/10 text-[#FF8500] px-2.5 py-1 rounded-md font-medium">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="hover:opacity-75">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {priceRange < 1000000 && (
            <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md font-medium">
              Max {formatNaira(priceRange)}
              <button onClick={() => setPriceRange(1000000)} className="hover:opacity-75">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {sortBy !== 'featured' && (
            <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md font-medium">
              Sort: {sortBy === 'price-asc' ? 'Price: Low-High' : sortBy === 'price-desc' ? 'Price: High-Low' : 'Newest'}
              <button onClick={() => setSortBy('featured')} className="hover:opacity-75">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Product Grid */}
      <div className="px-4 pt-3">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find any items matching your selected criteria. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSelectedSubcategory(null);
                setSearchQuery('');
                setPriceRange(1000000);
                setSortBy('featured');
              }}
              className="mt-4 px-4 py-2 bg-[#FF8500] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#e67700] transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF8500]" />
                Filter & Sort Products
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Sort By */}
              <div>
                <label className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  Sort Order
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setSortBy('featured')}
                    className={`py-2 px-3 rounded-lg border text-left font-medium transition ${
                      sortBy === 'featured'
                        ? 'border-[#FF8500] bg-[#FF8500]/5 text-[#FF8500] font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Featured First
                  </button>
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`py-2 px-3 rounded-lg border text-left font-medium transition ${
                      sortBy === 'newest'
                        ? 'border-[#FF8500] bg-[#FF8500]/5 text-[#FF8500] font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    New Arrivals
                  </button>
                  <button
                    onClick={() => setSortBy('price-asc')}
                    className={`py-2 px-3 rounded-lg border text-left font-medium transition ${
                      sortBy === 'price-asc'
                        ? 'border-[#FF8500] bg-[#FF8500]/5 text-[#FF8500] font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setSortBy('price-desc')}
                    className={`py-2 px-3 rounded-lg border text-left font-medium transition ${
                      sortBy === 'price-desc'
                        ? 'border-[#FF8500] bg-[#FF8500]/5 text-[#FF8500] font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>

              {/* Price Filter Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Maximum Budget
                  </label>
                  <span className="text-xs font-extrabold text-[#071B49] tabular-nums">
                    {formatNaira(priceRange)}
                  </span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="1000000"
                  step="10000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#FF8500] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₦30,000</span>
                  <span>₦1,000,000+</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setPriceRange(1000000);
                  setSortBy('featured');
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#071B49] hover:bg-[#0c2869] text-xs font-bold text-white shadow-sm transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
