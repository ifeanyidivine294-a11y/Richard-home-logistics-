import React from 'react';
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, favourites, getCartItemCount, setIsCartOpen } = useApp();
  const cartCount = getCartItemCount();

  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home,
      badge: null,
      onClick: () => setActiveTab('home')
    },
    {
      id: 'categories' as const,
      label: 'Categories',
      icon: Grid,
      badge: null,
      onClick: () => setActiveTab('categories')
    },
    {
      id: 'favourites' as const,
      label: 'Favourites',
      icon: Heart,
      badge: favourites.length > 0 ? favourites.length : null,
      onClick: () => setActiveTab('favourites')
    },
    {
      id: 'cart' as const,
      label: 'Cart',
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount : null,
      onClick: () => setIsCartOpen(true)
    },
    {
      id: 'account' as const,
      label: 'Account',
      icon: User,
      badge: null,
      onClick: () => setActiveTab('account')
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors focus:outline-hidden ${
                isActive ? 'text-[#FF8500]' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.8px]'
                  }`}
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 bg-[#EF4444] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-scale">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight font-medium ${
                  isActive ? 'text-[#FF8500] font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
