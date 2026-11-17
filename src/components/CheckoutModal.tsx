import React, { useState } from 'react';
import { ArrowLeft, Truck, Store, AlertCircle, CheckCircle, ShieldCheck, Clock, Calendar, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/formatters';
import { OrderType } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    deliveryAreas,
    user,
    businessSettings,
    submitOrder,
    getCartTotal
  } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Customer Information (pre-filled from user profile if available)
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');

  // Delivery Specific Fields
  const [deliveryAreaId, setDeliveryAreaId] = useState(deliveryAreas[0]?.id || 'asaba');
  const [address, setAddress] = useState(user?.savedAddress || '123 Main Street, Asaba');
  const [nearestBusStop, setNearestBusStop] = useState(user?.savedNearestBusStop || 'Holy Family Bus Stop');
  const [state] = useState('Delta State');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Pickup Specific Fields
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState(businessSettings.pickupSlots[0] || '9:00 AM – 11:00 AM');
  const [pickupPhone, setPickupPhone] = useState(phoneNumber || '+234 906 970 687');

  // Confirmation Checkbox
  const [isConfirmed, setIsConfirmed] = useState(true);

  // Form errors
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const subtotal = getCartTotal();
  const selectedArea = deliveryAreas.find((a) => a.id === deliveryAreaId) || deliveryAreas[0];
  const deliveryFee = orderType === 'delivery' ? (selectedArea?.fee || 15000) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }

    if (orderType === 'delivery') {
      if (!address.trim()) {
        setErrorMessage('Please provide your full delivery address');
        return;
      }
      if (!nearestBusStop.trim()) {
        setErrorMessage('Please provide your nearest bus stop or recognized landmark');
        return;
      }
    } else {
      if (!pickupDate) {
        setErrorMessage('Please select a preferred pickup date');
        return;
      }
      if (!pickupTime) {
        setErrorMessage('Please choose a preferred pickup time slot');
        return;
      }
    }

    if (!isConfirmed) {
      setErrorMessage('Please confirm that your order details are correct');
      return;
    }

    // Submit order through context
    submitOrder({
      customer: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        address: orderType === 'delivery' ? address.trim() : undefined
      },
      orderType,
      delivery:
        orderType === 'delivery'
          ? {
              state,
              city: selectedArea.name.split(' ')[0],
              address: address.trim(),
              nearestBusStop: nearestBusStop.trim(),
              deliveryAreaId,
              additionalInstructions: additionalInstructions.trim(),
              deliveryFee
            }
          : undefined,
      pickup:
        orderType === 'pickup'
          ? {
              preferredDate: pickupDate,
              preferredTime: pickupTime,
              pickupPhone: pickupPhone.trim() || phoneNumber.trim()
            }
          : undefined,
      deliveryFee
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-start sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white sm:rounded-2xl min-h-screen sm:min-h-0 sm:my-6 shadow-2xl flex flex-col pb-safe">
        {/* Header matching screenshot */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setIsCartOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
              aria-label="Back to Cart"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-base font-bold text-[#172033] tracking-tight">
              {orderType === 'delivery' ? 'Delivery Details' : 'Pick Up Details'}
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-400">Step 2 of 2</span>
        </div>

        {/* Tab Toggle: Delivery vs Pick Up (From reference screenshot) */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => {
                setOrderType('delivery');
                setErrorMessage('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                orderType === 'delivery'
                  ? 'bg-[#FF8500] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Delivery
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderType('pickup');
                setErrorMessage('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                orderType === 'pickup'
                  ? 'bg-[#FF8500] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Pick Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SECTION A: Customer Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#071B49]">
              Section A: Customer Information
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chukwudebe Ifeanyi"
                className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500] focus:ring-1 focus:ring-[#FF8500]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phone Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (!pickupPhone) setPickupPhone(e.target.value);
                  }}
                  placeholder="e.g. +234 906 970 687"
                  className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500] focus:ring-1 focus:ring-[#FF8500]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@gmail.com"
                  className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500] focus:ring-1 focus:ring-[#FF8500]"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SECTION C: Delivery OR Pick Up */}
          {orderType === 'delivery' ? (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071B49] flex items-center justify-between">
                <span>Section C: Delivery Destination</span>
                <span className="text-xs text-[#FF8500] font-black">
                  Fee: {formatNaira(deliveryFee)}
                </span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main Street, Asaba"
                  className="w-full text-xs sm:text-sm py-2.5 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500] focus:ring-1 focus:ring-[#FF8500]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nearest Bus Stop or Recognized Landmark <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nearestBusStop}
                  onChange={(e) => setNearestBusStop(e.target.value)}
                  placeholder="e.g. Holy Family Bus Stop / Summit Junction"
                  className="w-full text-xs sm:text-sm py-2.5 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500] focus:ring-1 focus:ring-[#FF8500]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Delivery Area / State
                </label>
                <select
                  value={deliveryAreaId}
                  onChange={(e) => setDeliveryAreaId(e.target.value)}
                  className="w-full text-xs sm:text-sm py-2.5 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-900 focus:outline-hidden focus:border-[#FF8500]"
                >
                  {deliveryAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({formatNaira(area.fee)})
                    </option>
                  ))}
                </select>
                {selectedArea.note && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    {selectedArea.note}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Additional Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. Call my second line upon reaching the gate or dispatch to 2nd floor flat"
                  className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071B49] flex items-center justify-between">
                <span>Section C: Pick Up Schedule</span>
                <span className="text-xs text-emerald-600 font-bold">Free In-Store</span>
              </h3>

              <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Showroom Opening Hours
                </p>
                <p className="text-[11px] text-amber-800">
                  {businessSettings.openingHours}
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Location: {businessSettings.physicalAddress}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Preferred Pickup Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Preferred Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-900 focus:outline-hidden focus:border-[#FF8500]"
                  >
                    {businessSettings.pickupSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pickup Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={pickupPhone}
                  onChange={(e) => setPickupPhone(e.target.value)}
                  placeholder="e.g. +234 906 970 687"
                  className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>
            </div>
          )}

          {/* SECTION B & D: Review Products & Order Summary */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#071B49]">
              Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
            </h3>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2 text-xs">
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-slate-700">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.product.name} ({item.selectedSize || 'Standard'})
                    </span>
                    <span className="font-semibold tabular-nums shrink-0">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Product Subtotal:</span>
                  <span className="font-bold tabular-nums">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({orderType === 'delivery' ? selectedArea.name.split(' ')[0] : 'Store Pickup'}):</span>
                  <span className="font-bold tabular-nums">
                    {deliveryFee > 0 ? formatNaira(deliveryFee) : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#071B49] pt-1 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-[#FF8500] font-black text-base tabular-nums">
                    {formatNaira(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 accent-[#FF8500] rounded"
              />
              <span className="text-xs font-semibold text-slate-800">
                I confirm that my order details and items are correct.
              </span>
            </label>

            {/* Blue Info Notice from reference screenshot */}
            <div className="p-3 bg-blue-50/80 border border-blue-200/70 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                i
              </div>
              <p className="leading-snug">
                Your order details will be sent on WhatsApp for final confirmation. Our logistics team will verify stock and contact you immediately.
              </p>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 bg-[#071B49] hover:bg-[#0c2763] active:scale-98 text-white rounded-xl font-black text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 text-[#FF8500]" />
              CONFIRM & SEND ORDER ON WHATSAPP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
