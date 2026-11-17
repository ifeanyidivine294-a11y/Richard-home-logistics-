import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  Store,
  User,
  Phone,
  Home,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/formatters';
import { OrderType, CartItem } from '../types';

export const CustomerOrderFormModal: React.FC = () => {
  const {
    cart,
    directOrderProduct,
    isOrderFormOpen,
    setIsOrderFormOpen,
    deliveryAreas,
    user,
    businessSettings,
    submitOrder,
    getCartTotal
  } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Customer Information (pre-filled from profile if logged in)
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [homeAddress, setHomeAddress] = useState(user?.savedAddress || '123 Main Street, Asaba');
  const [state, setState] = useState('Delta State');
  const [town, setTown] = useState('Asaba');
  const [nearestBusStop, setNearestBusStop] = useState(user?.savedNearestBusStop || 'Holy Family Bus Stop');
  const [deliveryAreaId, setDeliveryAreaId] = useState(deliveryAreas[0]?.id || 'asaba');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Pickup fields
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState(businessSettings.pickupSlots[0] || '9:00 AM – 11:00 AM');
  const [pickupPhone, setPickupPhone] = useState(phoneNumber || '+234 906 970 687');

  // Confirmation Checkbox
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOrderFormOpen) return null;

  // Active items being ordered (either direct single item or all cart items)
  const items: CartItem[] = directOrderProduct ? [directOrderProduct] : cart;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const selectedArea = deliveryAreas.find((a) => a.id === deliveryAreaId) || deliveryAreas[0];
  const deliveryFee = orderType === 'delivery' ? (selectedArea?.fee || 15000) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your order has no items. Please select a product first.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }

    if (orderType === 'delivery') {
      if (!homeAddress.trim()) {
        setErrorMessage('Please enter your full residential address');
        return;
      }
      if (!nearestBusStop.trim()) {
        setErrorMessage('Please enter your nearest bus stop or landmark');
        return;
      }
    } else {
      if (!pickupDate) {
        setErrorMessage('Please select a pickup date');
        return;
      }
      if (!pickupTime) {
        setErrorMessage('Please select a pickup time slot');
        return;
      }
    }

    if (!isConfirmed) {
      setErrorMessage('Please confirm that your order details are correct');
      return;
    }

    submitOrder({
      customer: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        address: orderType === 'delivery' ? homeAddress.trim() : undefined,
      },
      orderType,
      delivery:
        orderType === 'delivery'
          ? {
              state,
              city: town.trim() || selectedArea.name.split(' ')[0],
              address: homeAddress.trim(),
              nearestBusStop: nearestBusStop.trim(),
              deliveryAreaId,
              additionalInstructions: additionalInstructions.trim(),
              deliveryFee,
            }
          : undefined,
      pickup:
        orderType === 'pickup'
          ? {
              preferredDate: pickupDate,
              preferredTime: pickupTime,
              pickupPhone: pickupPhone.trim() || phoneNumber.trim(),
            }
          : undefined,
      deliveryFee,
      itemsToOrder: items,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-start sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white sm:rounded-2xl min-h-screen sm:min-h-0 sm:my-6 shadow-2xl flex flex-col pb-safe">
        {/* Header (matching reference screenshot) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <button
            onClick={() => setIsOrderFormOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold text-[#172033] tracking-tight">
            Order Form
          </h1>
          <span className="text-xs font-semibold text-slate-400">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. CUSTOMER INFORMATION (Numbered pill matching mockup) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#071B49] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-xs font-bold text-[#071B49] uppercase tracking-wider">
                Customer Information
              </h2>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Phone Number (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Home Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Home className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>
            </div>
          </div>

          {/* 2. DELIVERY OR PICKUP (Numbered pill matching mockup) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#071B49] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-xs font-bold text-[#071B49] uppercase tracking-wider">
                Delivery or Pickup
              </h2>
            </div>

            {/* Selectable toggle cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-3 px-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 text-xs font-bold ${
                  orderType === 'delivery'
                    ? 'border-[#FF8500] bg-[#FF8500]/10 text-[#071B49] shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-5 h-5 text-[#FF8500]" />
                Deliver to Me
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-3 px-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 text-xs font-bold ${
                  orderType === 'pickup'
                    ? 'border-[#FF8500] bg-[#FF8500]/10 text-[#071B49] shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Store className="w-5 h-5 text-[#071B49]" />
                Pick Up
              </button>
            </div>

            {/* Dynamic Delivery Fields */}
            {orderType === 'delivery' ? (
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Delta State">Delta State</option>
                    <option value="Anambra State">Anambra State</option>
                    <option value="Edo State">Edo State</option>
                    <option value="Lagos State">Lagos State</option>
                    <option value="Other State in Nigeria">Other State in Nigeria</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Town or City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Asaba, Okpanam, Ibusa, Onitsha"
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Nearest Bus Stop or Landmark <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nearestBusStop}
                    onChange={(e) => setNearestBusStop(e.target.value)}
                    placeholder="e.g. Holy Family Bus Stop / Summit Junction"
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Delivery Area Zone (Calculated Fee)
                  </label>
                  <select
                    value={deliveryAreaId}
                    onChange={(e) => setDeliveryAreaId(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                  >
                    {deliveryAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name} — {formatNaira(area.fee)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Additional Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="e.g. Call before coming or drop at reception"
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            ) : (
              /* Dynamic Pickup Fields */
              <div className="space-y-2.5 pt-1">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-amber-700" /> Richard Home Showroom Pickup
                  </p>
                  <p className="text-[11px] text-amber-800 mt-1">
                    {businessSettings.physicalAddress}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    {businessSettings.openingHours}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Preferred Pickup Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Preferred Pickup Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white"
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Pickup Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={pickupPhone}
                    onChange={(e) => setPickupPhone(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. ORDER ITEMS REVIEW (matching reference screenshot) */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-[#071B49] uppercase tracking-wider">
              Selected Products ({items.length})
            </h3>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        Qty: {item.quantity} · {item.selectedSize || 'Standard'}
                      </p>
                      <div className="font-bold text-[#071B49] tabular-nums">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. ORDER SUMMARY & TOTALS */}
          <div className="bg-[#F4F7FC] p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold tabular-nums text-slate-900">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span className="font-bold tabular-nums text-slate-900">
                {deliveryFee > 0 ? formatNaira(deliveryFee) : 'FREE (Pickup)'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#071B49]">
              <span>Grand Total:</span>
              <span className="text-[#FF8500] text-base tabular-nums">
                {formatNaira(grandTotal)}
              </span>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 accent-[#FF8500] rounded"
            />
            <span className="text-xs font-semibold text-slate-800">
              I confirm that my order details are correct.
            </span>
          </label>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#16A34A] hover:bg-[#15803d] active:scale-98 text-white rounded-xl font-black text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            Confirm & Send Order on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};
