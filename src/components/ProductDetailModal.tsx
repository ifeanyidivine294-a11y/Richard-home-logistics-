import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Plus,
  Minus,
  MessageSquare,
  Check,
  ShieldCheck,
  Truck,
  Star,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira, createWhatsAppUrl } from '../utils/formatters';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleFavourite,
    isFavourite,
    businessSettings,
    startDirectOrder,
    showToast
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    selectedProduct?.sizes?.[0] || 'Standard'
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    selectedProduct?.colors?.[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!selectedProduct) return null;

  const isFav = isFavourite(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleOrderNow = () => {
    startDirectOrder(selectedProduct, quantity, selectedSize, selectedColor);
    setSelectedProduct(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedProduct.name} | Richard Home Logistics`,
          text: `Check out the ${selectedProduct.name} at Richard Home Logistics for ${formatNaira(selectedProduct.price)}!`,
          url: window.location.href,
        });
      } catch {
        // dismissed
      }
    } else {
      navigator.clipboard.writeText(
        `${selectedProduct.name} - ${formatNaira(selectedProduct.price)} at Richard Home Logistics`
      );
      showToast('Product details copied to clipboard!', 'info');
    }
  };

  const handleDirectWhatsAppOrder = () => {
    const singleItemTotal = selectedProduct.price * quantity;
    const msg =
      `RICHARD HOME LOGISTICS — DIRECT ENQUIRY / ORDER\n\n` +
      `Product: ${selectedProduct.name}\n` +
      `Category: ${selectedProduct.category.toUpperCase()}\n` +
      (selectedSize ? `Size: ${selectedSize}\n` : '') +
      (selectedColor ? `Colour: ${selectedColor}\n` : '') +
      `Quantity: ${quantity}\n` +
      `Price: ${formatNaira(selectedProduct.price)}\n` +
      `Subtotal: ${formatNaira(singleItemTotal)}\n\n` +
      `Hello Richard Home Logistics, I would like to order this item. Please confirm availability and delivery to my location in Nigeria.`;

    const url = createWhatsAppUrl(businessSettings.whatsAppNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-start sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white sm:rounded-2xl min-h-screen sm:min-h-0 sm:my-6 shadow-2xl overflow-hidden flex flex-col pb-safe">
        {/* Top App Bar (matching reference mockup) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <button
            onClick={() => setSelectedProduct(null)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition active:scale-95"
            aria-label="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavourite(selectedProduct.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 ${
                isFav
                  ? 'bg-red-50 text-red-500'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="Toggle Favourite"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition active:scale-95"
              aria-label="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Image Preview */}
        <div className="relative bg-slate-50">
          <div className="w-full aspect-4/3 overflow-hidden bg-slate-100">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails row (matching screenshot) */}
          {selectedProduct.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 p-3 bg-white/80 backdrop-blur-xs border-t border-slate-100">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-12 rounded-lg overflow-hidden border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-[#FF8500] scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 space-y-4">
          {/* Title & Pricing */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#FF8500] uppercase tracking-wider">
                {selectedProduct.subcategory}
              </span>
              {selectedProduct.brand && (
                <span className="text-[11px] text-slate-400 font-medium">
                  · {selectedProduct.brand}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#172033] tracking-tight">
              {selectedProduct.name}
            </h1>

            {/* Pricing in Naira with strikethrough original price */}
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-2xl font-black text-[#FF8500] tabular-nums">
                {formatNaira(selectedProduct.price)}
              </span>
              {selectedProduct.originalPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through tabular-nums">
                  {formatNaira(selectedProduct.originalPrice)}
                </span>
              )}
            </div>

            {/* Star Rating from reference mockup (★ 4.8 (120 reviews)) */}
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <Star className="w-3.5 h-3.5 fill-amber-500" />
              </div>
              <span className="font-bold text-slate-800">4.8</span>
              <span className="text-slate-400">(120 reviews)</span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Size / Variant Options */}
          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">Size:</span>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedSize}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-[#071B49] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colour Options */}
          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">Colour:</span>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedColor}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedProduct.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-transform ${
                        isSelected
                          ? 'border-[#FF8500] scale-110 shadow-sm'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={color.name}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Qty:</span>
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-md bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 font-bold active:scale-90 transition shadow-2xs"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-xs tabular-nums text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-md bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 font-bold active:scale-90 transition shadow-2xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 space-y-2 pb-safe">
          <div className="grid grid-cols-2 gap-2">
            {/* Add to Cart Button (Orange) */}
            <button
              onClick={handleAddToCart}
              className={`py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98 ${
                addedAnimation ? 'bg-emerald-600' : 'bg-[#FF8500] hover:bg-[#ff941a]'
              }`}
            >
              {addedAnimation ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {addedAnimation ? 'Added!' : 'Add to Cart'}
            </button>

            {/* Order Now (Opens Customer Order Form directly with this product) */}
            <button
              onClick={handleOrderNow}
              className="py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#071B49] hover:bg-[#0c2763] text-white shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Zap className="w-4 h-4 text-[#FF8500]" /> Order Now
            </button>
          </div>

          {/* Order on WhatsApp Button (Green) */}
          <button
            onClick={handleDirectWhatsAppOrder}
            className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#16A34A] hover:bg-[#15803d] text-white shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
