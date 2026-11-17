import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, Truck, Store, MapPin, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/formatters';
import { OrderType } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    deliveryAreas,
    user,
    openCartOrderForm,
    setActiveTab
  } = useApp();

  const [deliveryOption, setDeliveryOption] = useState<OrderType>('delivery');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('asaba');

  if (!isCartOpen) return null;

  // Find delivery fee for selected area
  const selectedArea = deliveryAreas.find((a) => a.id === selectedAreaId) || deliveryAreas[0];
  const deliveryFee = deliveryOption === 'delivery' ? (selectedArea?.fee || 15000) : 0;
  const subtotal = getCartTotal();
  const grandTotal = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    openCartOrderForm();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#F4F7FC] h-full flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
              aria-label="Close Cart"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-[#172033] tracking-tight">
              My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Cart Body */}
        {cart.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Cart Items List */}
            <div className="space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex gap-3 items-center"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h3>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <div className="text-xs font-black text-[#071B49] mt-1 tabular-nums">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center bg-slate-100 rounded-md border border-slate-200">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-l-md font-bold transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold tabular-nums text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-r-md font-bold transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Option Selector (as featured in screenshot) */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Delivery Option</h4>

              <div className="space-y-2">
                {/* Deliver to me */}
                <label
                  onClick={() => setDeliveryOption('delivery')}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                    deliveryOption === 'delivery'
                      ? 'border-[#FF8500] bg-[#FF8500]/5'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryOption"
                    checked={deliveryOption === 'delivery'}
                    onChange={() => setDeliveryOption('delivery')}
                    className="mt-0.5 accent-[#FF8500]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#FF8500]" /> Deliver to me
                      </span>
                      <span className="text-[#FF8500] font-extrabold">
                        ({formatNaira(deliveryFee)})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Direct doorstep delivery to your home or office.
                    </p>
                  </div>
                </label>

                {/* I will pick up */}
                <label
                  onClick={() => setDeliveryOption('pickup')}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                    deliveryOption === 'pickup'
                      ? 'border-[#FF8500] bg-[#FF8500]/5'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryOption"
                    checked={deliveryOption === 'pickup'}
                    onChange={() => setDeliveryOption('pickup')}
                    className="mt-0.5 accent-[#FF8500]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-[#071B49]" /> I will pick up
                      </span>
                      <span className="text-emerald-600 font-bold">FREE</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Pick up directly at our Asaba store during open hours.
                    </p>
                  </div>
                </label>
              </div>

              {/* Delivery Area quick selection if delivery chosen */}
              {deliveryOption === 'delivery' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Select Your Area:
                  </label>
                  <select
                    value={selectedAreaId}
                    onChange={(e) => setSelectedAreaId(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-hidden focus:border-[#FF8500]"
                  >
                    {deliveryAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name} — {formatNaira(area.fee)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Delivery Details Summary Card (as seen in screenshot) */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#071B49]" />
                {deliveryOption === 'delivery' ? 'Delivery Address' : 'Pickup Store'}
              </h4>

              {deliveryOption === 'delivery' ? (
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">
                    {user?.savedAddress || '123 Main Street, Asaba'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Nearest Bus Stop: {user?.savedNearestBusStop || 'Holy Family Bus Stop'}
                  </p>
                  <button
                    onClick={handleProceedToCheckout}
                    className="text-[11px] text-[#FF8500] hover:underline font-bold pt-1 inline-block"
                  >
                    Change / Edit Address →
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">Richard Home Logistics Showroom</p>
                  <p className="text-[11px] text-slate-500">123 Main Street, Asaba, Delta State</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Mon - Sat: 8:00 AM – 6:00 PM
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Explore our premium collection of beds, televisions, refrigerators, tables, and home appliances.
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setActiveTab('categories');
              }}
              className="mt-5 px-5 py-2.5 bg-[#FF8500] hover:bg-[#ff941a] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Footer Checkout Bar */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-white p-4 border-t border-slate-200/80 shadow-lg space-y-3 pb-safe">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal:</span>
                <span className="tabular-nums font-semibold text-slate-800">
                  {formatNaira(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee:</span>
                <span className="tabular-nums font-semibold text-slate-800">
                  {deliveryFee > 0 ? formatNaira(deliveryFee) : 'FREE (Store Pickup)'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#071B49] pt-1.5 border-t border-slate-100">
                <span>Total:</span>
                <span className="tabular-nums text-base text-[#FF8500]">
                  {formatNaira(grandTotal)}
                </span>
              </div>
            </div>

            {/* Primary Action Button: "Proceed to Order Details" or "Send Order on WhatsApp" */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#FF8500] hover:bg-[#ff941a] active:scale-98 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Order</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
