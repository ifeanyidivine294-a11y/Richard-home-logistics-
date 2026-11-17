import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const FavouritesView: React.FC = () => {
  const { favourites, products, setActiveTab } = useApp();

  const favProducts = products.filter((p) => favourites.includes(p.id));

  return (
    <div className="px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-bold text-[#172033] tracking-tight">
            My Favourites
          </h1>
          <p className="text-xs text-slate-500">
            {favProducts.length} saved item{favProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {favProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {favProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center text-red-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No favourites saved yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Tap the heart icon on any furniture or appliance to save it to your wishlist.
          </p>
          <button
            onClick={() => setActiveTab('categories')}
            className="mt-4 px-4 py-2 bg-[#071B49] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0d2763] transition flex items-center gap-1.5 mx-auto"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Explore Catalogue
          </button>
        </div>
      )}
    </div>
  );
};
