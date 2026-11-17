/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategorySection } from './components/CategorySection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { CatalogueView } from './components/CatalogueView';
import { FavouritesView } from './components/FavouritesView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { BottomNav } from './components/BottomNav';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerOrderFormModal } from './components/CustomerOrderFormModal';
import { OrderReadyModal } from './components/OrderReadyModal';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import { ToastContainer } from './components/ToastContainer';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ShieldCheck, Database, Zap, Headphones, MessageSquare, Check } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, businessSettings, currentPortal, isAdmin } = useApp();

  // If in Admin Portal view and authenticated as Admin
  if (currentPortal === 'admin' && isAdmin) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#F4F7FC]">
        <AdminPortal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Top Header */}
      <Header />

      {/* Main Tab Screen Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-1 pb-24">
            <HeroBanner />
            <CategorySection />
            <FeaturedProducts />

            {/* Bottom Brand Guarantee Strip (From reference screenshot) */}
            <div className="px-4 py-4 mt-2">
              <div className="bg-[#071B49] text-white rounded-2xl p-4 shadow-sm space-y-4">
                {/* 4 Feature Pill Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#FF8500]" />
                    </div>
                    <div>
                      <span className="font-bold block text-[11px] leading-tight">Secure Login</span>
                      <span className="text-[9px] text-slate-300">(Firebase)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Database className="w-4 h-4 text-[#FF8500]" />
                    </div>
                    <div>
                      <span className="font-bold block text-[11px] leading-tight">Your Data</span>
                      <span className="text-[9px] text-slate-300">Your Privacy</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Zap className="w-4 h-4 text-[#FF8500]" />
                    </div>
                    <div>
                      <span className="font-bold block text-[11px] leading-tight">Fast & Smooth</span>
                      <span className="text-[9px] text-slate-300">Performance</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Headphones className="w-4 h-4 text-[#FF8500]" />
                    </div>
                    <div>
                      <span className="font-bold block text-[11px] leading-tight">Reliable</span>
                      <span className="text-[9px] text-slate-300">Support</span>
                    </div>
                  </div>
                </div>

                {/* Orange WhatsApp Banner Strip from mockup */}
                <a
                  href={`https://wa.me/${businessSettings.whatsAppNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-[#FF8500] hover:bg-[#ff941a] text-white rounded-xl shadow-xs transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white text-[#16A34A] flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare className="w-5 h-5 fill-[#16A34A]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider block opacity-95">
                        Order Now on WhatsApp
                      </span>
                      <span className="text-sm font-black tracking-tight">
                        {businessSettings.displayPhone}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md group-hover:bg-white/30 transition">
                    Chat Now →
                  </span>
                </a>

                {/* Tagline and Category Checklist */}
                <div className="pt-2 border-t border-white/10 text-center">
                  <p className="text-xs italic font-bold text-slate-200">
                    ...Quality Homes, Happier Families
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#FF8500]" /> Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#FF8500]" /> TVs
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#FF8500]" /> Fridges
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#FF8500]" /> Glass Tables
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#FF8500]" /> Fans
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#FF8500]" /> Home Appliances
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && <CatalogueView />}
        {activeTab === 'favourites' && <FavouritesView />}
        {activeTab === 'orders' && <OrdersView />}
        {(activeTab === 'profile' || activeTab === 'account') && <ProfileView />}
        {activeTab === 'cart' && <CatalogueView />}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav />

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CustomerOrderFormModal />
      <OrderReadyModal />
      <CheckoutModal />
      <WhatsAppOrderModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DeviceFrameWrapper>
        <MainContent />
      </DeviceFrameWrapper>
    </AppProvider>
  );
}
