import React from 'react';
import { ArrowRight, ShieldCheck, Tag, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { banner, setActiveTab, setSelectedCategory } = useApp();

  return (
    <section className="px-4 pt-3 pb-2">
      {/* Trust Badges Strip (from reference mockup) */}
      <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-[#071B49] mb-3 bg-white/80 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#FF8500]/15 flex items-center justify-center text-[#FF8500]">
            <ShieldCheck className="w-3 h-3" />
          </div>
          <span>Quality Products</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#FF8500]/15 flex items-center justify-center text-[#FF8500]">
            <Tag className="w-3 h-3" />
          </div>
          <span>Affordable Prices</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#FF8500]/15 flex items-center justify-center text-[#FF8500]">
            <Truck className="w-3 h-3" />
          </div>
          <span>Reliable Delivery</span>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#071B49] text-white shadow-md">
        <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between min-h-[175px] max-w-[65%] sm:max-w-[55%]">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#FF8500] mb-1 block">
              Nigeria Home Collection
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {banner?.title || 'Modern Living Starts Here'}
            </h1>
            <p className="mt-1 text-xs text-slate-200 line-clamp-2">
              {banner?.subtitle || 'Stylish Furniture & Appliances for Your Home'}
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                setSelectedCategory('beds');
                setActiveTab('categories');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF8500] hover:bg-[#ff941a] active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              {banner?.ctaText || 'Order Now'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Background Image */}
        <div className="absolute top-0 right-0 bottom-0 w-3/5 sm:w-1/2">
          <img
            src={banner?.imageUrl || '/src/assets/images/hero_living_room_1794158920760.jpg'}
            alt="Modern Living Room Furniture"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay to blend into Midnight Navy */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071B49] via-[#071B49]/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};
