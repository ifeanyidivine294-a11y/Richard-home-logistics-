import React from 'react';
import { Search, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const {
    getCartItemCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    user,
    isAdmin,
    setCurrentPortal,
    setIsAuthModalOpen,
    setAuthViewMode
  } = useApp();

  const cartCount = getCartItemCount();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('categories');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="text-left focus:outline-hidden hover:opacity-95 transition-opacity"
            aria-label="Richard Home Logistics Home"
          >
            <BrandLogo size="sm" showTagline={false} />
          </button>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md relative"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-9 pr-3 py-2 bg-[#F4F7FC] text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-full border border-slate-200/70 focus:outline-hidden focus:border-[#FF8500] focus:ring-2 focus:ring-[#FF8500]/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Admin Switcher Button (visible if admin) */}
            {isAdmin && (
              <button
                onClick={() => setCurrentPortal('admin')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FF8500] hover:bg-[#ff941a] text-white text-[11px] font-bold rounded-lg shadow-xs transition active:scale-95"
                title="Open Administrator Portal"
              >
                <span>👑</span>
                <span className="hidden sm:inline">Admin Portal</span>
              </button>
            )}

            {/* User Profile or Login Trigger */}
            <button
              onClick={() => {
                if (user && !user.isGuest) {
                  setActiveTab('account');
                } else {
                  setAuthViewMode('login');
                  setIsAuthModalOpen(true);
                }
              }}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition"
              aria-label={user && !user.isGuest ? 'View Profile' : 'Sign In'}
            >
              {user && !user.isGuest ? (
                <div className="w-8 h-8 rounded-full bg-[#071B49] text-white flex items-center justify-center text-xs font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <UserIcon className="w-5 h-5 text-[#071B49]" />
              )}
            </button>

            {/* Shopping Cart Icon with badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#071B49]" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-scale">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
