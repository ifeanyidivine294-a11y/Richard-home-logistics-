import React, { useState } from 'react';
import { Heart, Plus, Check, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, toggleFavourite, isFavourite, startDirectOrder } = useApp();
  const [justAdded, setJustAdded] = useState(false);
  const isFav = isFavourite(product.id);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite(product.id);
  };

  const handleOrderNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startDirectOrder(product, 1);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between overflow-hidden"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Discount badge if on sale */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-[#FF8500] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs">
            SAVE {formatNaira(product.originalPrice - product.price)}
          </div>
        )}

        {/* Favourite Button */}
        <button
          onClick={handleFavClick}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            isFav
              ? 'bg-red-50 text-red-500 shadow-xs'
              : 'bg-white/80 backdrop-blur-xs text-slate-400 hover:text-red-500'
          }`}
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Info */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
            {product.subcategory}
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-[#172033] line-clamp-1 group-hover:text-[#FF8500] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-2 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-[#172033] tracking-tight tabular-nums">
              {formatNaira(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through tabular-nums">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart (Orange) & Order Now */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleAddClick}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 ${
                justAdded
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-[#FF8500] hover:bg-[#ff941a] text-white shadow-2xs'
              }`}
              aria-label={`Add ${product.name} to Cart`}
            >
              {justAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {justAdded ? 'Added' : 'Add to Cart'}
            </button>

            <button
              onClick={handleOrderNowClick}
              className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-[#071B49] hover:bg-[#0c2763] text-white transition-all flex items-center justify-center gap-1 active:scale-95"
              aria-label={`Order ${product.name} Now`}
            >
              <Zap className="w-3 h-3 text-[#FF8500]" /> Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
