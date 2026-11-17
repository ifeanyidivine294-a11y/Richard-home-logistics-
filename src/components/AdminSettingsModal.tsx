import React, { useState } from 'react';
import { X, Settings, Save, RefreshCw, DollarSign, Truck, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/formatters';
import { INITIAL_BUSINESS_SETTINGS, INITIAL_DELIVERY_AREAS, INITIAL_PRODUCTS } from '../data/mockData';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    businessSettings,
    updateBusinessSettings,
    deliveryAreas,
    updateDeliveryAreaFee,
    products,
    updateProductPrice,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'store' | 'delivery' | 'pricing'>('delivery');

  // Local store settings state
  const [phone, setPhone] = useState(businessSettings.displayPhone);
  const [whatsapp, setWhatsapp] = useState(businessSettings.whatsAppNumber);
  const [address, setAddress] = useState(businessSettings.physicalAddress);
  const [hours, setHours] = useState(businessSettings.openingHours);

  // Delivery area fee inputs state
  const [areaFees, setAreaFees] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    deliveryAreas.forEach((a) => {
      map[a.id] = a.fee;
    });
    return map;
  });

  // Product price inputs state
  const [prodPrices, setProdPrices] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.id] = p.price;
    });
    return map;
  });

  if (!isOpen) return null;

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings({
      ...businessSettings,
      displayPhone: phone,
      whatsAppNumber: whatsapp.replace(/\D/g, ''),
      physicalAddress: address,
      openingHours: hours
    });
    showToast('Store contact details updated', 'success');
  };

  const handleSaveDeliveryFees = () => {
    Object.entries(areaFees).forEach(([id, fee]) => {
      updateDeliveryAreaFee(id, Number(fee));
    });
    showToast('Delivery fee matrix updated', 'success');
  };

  const handleSaveProductPrices = () => {
    Object.entries(prodPrices).forEach(([id, price]) => {
      updateProductPrice(id, Number(price));
    });
    showToast('Catalogue prices updated', 'success');
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all prices, delivery fees, and settings to original defaults?')) {
      localStorage.removeItem('rhl_products');
      localStorage.removeItem('rhl_delivery_areas');
      localStorage.removeItem('rhl_business_settings');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#071B49] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF8500] flex items-center justify-center text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white">
                Store Owner / Admin Panel
              </h2>
              <p className="text-[11px] text-slate-300">
                Manage Nigerian Naira prices, Asaba delivery zones & WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'delivery'
                ? 'border-[#FF8500] text-[#071B49] bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" /> Delivery Fees
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'border-[#FF8500] text-[#071B49] bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Product Prices
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'store'
                ? 'border-[#FF8500] text-[#071B49] bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" /> Store Info
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* 1. DELIVERY FEES TAB */}
          {activeTab === 'delivery' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Delivery Area Fee Matrix (Naira ₦)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Changes take effect instantly in the cart and checkout forms.
                  </p>
                </div>
                <button
                  onClick={handleSaveDeliveryFees}
                  className="px-3 py-1.5 bg-[#FF8500] hover:bg-[#ff941a] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save Fees
                </button>
              </div>

              <div className="space-y-2">
                {deliveryAreas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{area.name}</span>
                      {area.note && (
                        <p className="text-[10px] text-slate-500">{area.note}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-500">₦</span>
                      <input
                        type="number"
                        step="1000"
                        value={areaFees[area.id] ?? area.fee}
                        onChange={(e) =>
                          setAreaFees({
                            ...areaFees,
                            [area.id]: Number(e.target.value)
                          })
                        }
                        className="w-24 text-right py-1 px-2 rounded-lg border border-slate-300 font-bold text-[#071B49] text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PRODUCT PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Catalogue Selling Prices (Naira ₦)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Quickly adapt prices to prevailing market inflation.
                  </p>
                </div>
                <button
                  onClick={handleSaveProductPrices}
                  className="px-3 py-1.5 bg-[#FF8500] hover:bg-[#ff941a] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save Prices
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {prod.category} · {prod.subcategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-bold text-slate-500">₦</span>
                      <input
                        type="number"
                        step="5000"
                        value={prodPrices[prod.id] ?? prod.price}
                        onChange={(e) =>
                          setProdPrices({
                            ...prodPrices,
                            [prod.id]: Number(e.target.value)
                          })
                        }
                        className="w-28 text-right py-1 px-2 rounded-lg border border-slate-300 font-bold text-[#071B49] text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. STORE SETTINGS TAB */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStore} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  WhatsApp Number (with country code, no +)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 234906970687"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Display Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 906 970 687"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Store Physical Showroom Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main Street, Asaba, Delta State"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Opening Hours & Days
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. Mon - Sat: 8:00 AM – 6:00 PM (Sunday Closed)"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF8500] hover:bg-[#ff941a] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Store Settings
              </button>
            </form>
          )}
        </div>

        {/* Footer with Reset */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={handleResetToDefaults}
            className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset All to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
