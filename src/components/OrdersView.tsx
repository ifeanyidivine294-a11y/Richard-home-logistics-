import React from 'react';
import { ClipboardList, MessageSquare, ExternalLink, Calendar, MapPin, Truck, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira, createWhatsAppUrl } from '../utils/formatters';

export const OrdersView: React.FC = () => {
  const { orders, businessSettings, setActiveTab, setActiveOrderForWhatsApp, setIsWhatsAppModalOpen } = useApp();

  return (
    <div className="px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-bold text-[#172033] tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-500">
            {orders.length} order request{orders.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-3.5">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const whatsappUrl = createWhatsAppUrl(businessSettings.whatsAppNumber, order.whatsAppMessage);

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3"
              >
                {/* Reference & Status */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Order Reference
                    </span>
                    <h3 className="text-xs font-black text-[#071B49] font-mono">
                      {order.reference}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/50">
                    {order.status}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="truncate pr-2">
                        {item.quantity}x {item.product.name}
                        {item.selectedSize ? ` (${item.selectedSize})` : ''}
                      </span>
                      <span className="font-semibold tabular-nums shrink-0">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Destination & Timing */}
                <div className="bg-[#F4F7FC] p-2.5 rounded-lg text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {order.orderType === 'delivery' ? (
                      <>
                        <Truck className="w-3.5 h-3.5 text-[#FF8500]" />
                        <span>Delivery to: {order.delivery?.address || 'Asaba'}</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-3.5 h-3.5 text-[#071B49]" />
                        <span>Showroom Pickup: {order.pickup?.preferredDate} ({order.pickup?.preferredTime})</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Placed on {formattedDate}</span>
                  </div>
                </div>

                {/* Total & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <span className="text-sm font-black text-[#FF8500] tabular-nums">
                      {formatNaira(order.grandTotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveOrderForWhatsApp(order);
                        setIsWhatsAppModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Details
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Re-send on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Once you order furniture or appliances via WhatsApp, your order reference and records will be shown here.
          </p>
          <button
            onClick={() => setActiveTab('categories')}
            className="mt-4 px-4 py-2 bg-[#FF8500] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#ff941a] transition"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};
