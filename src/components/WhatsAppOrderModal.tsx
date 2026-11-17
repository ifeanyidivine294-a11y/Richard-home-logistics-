import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquare, Copy, Check, ExternalLink, Phone, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createWhatsAppUrl } from '../utils/formatters';

export const WhatsAppOrderModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    activeOrderForWhatsApp,
    businessSettings,
    showToast,
    setActiveTab
  } = useApp();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isWhatsAppModalOpen) {
      // Fire confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas blocked
      }
    }
  }, [isWhatsAppModalOpen]);

  if (!isWhatsAppModalOpen || !activeOrderForWhatsApp) return null;

  const order = activeOrderForWhatsApp;
  const whatsappUrl = createWhatsAppUrl(businessSettings.whatsAppNumber, order.whatsAppMessage);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(order.whatsAppMessage);
    setCopied(true);
    showToast('Order details copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Celebration Header */}
        <div className="bg-[#071B49] text-white p-5 text-center relative">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#16A34A] text-white flex items-center justify-center mb-3 shadow-md animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase font-bold text-[#FF8500] tracking-widest block mb-1">
            Order Reference Generated
          </span>
          <h2 className="text-xl font-black text-white">
            {order.reference}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Your order has been recorded. Complete the order by sending the generated details to Richard Home Logistics on WhatsApp!
          </p>
        </div>

        {/* WhatsApp Message Preview Box */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
                WhatsApp Message Preview
              </label>
              <button
                onClick={handleCopyMessage}
                className="text-xs font-semibold text-[#FF8500] hover:text-[#d97000] flex items-center gap-1 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Text
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {order.whatsAppMessage}
            </div>
          </div>

          {/* Primary Action: Open WhatsApp Button */}
          <div className="space-y-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-4 bg-[#16A34A] hover:bg-[#15803d] active:scale-98 text-white rounded-xl font-black text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Open WhatsApp (+234 906 970 687)
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyMessage}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Order Details Copied to Clipboard' : 'Copy Order Text to Clipboard'}
            </button>
          </div>

          {/* Direct Phone Support */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-700" />
              <span>Need help or quick call?</span>
            </div>
            <a
              href={`tel:${businessSettings.whatsAppNumber}`}
              className="font-bold text-[#071B49] hover:underline"
            >
              {businessSettings.displayPhone}
            </a>
          </div>

          <p className="text-[10px] text-slate-500 text-center leading-normal">
            Note: Sending this WhatsApp message is your official confirmation request. Our staff will confirm available inventory and provide payment instructions.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              setIsWhatsAppModalOpen(false);
              setActiveTab('orders');
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> View in My Orders
          </button>
          <button
            onClick={() => {
              setIsWhatsAppModalOpen(false);
              setActiveTab('home');
            }}
            className="text-xs font-bold text-[#FF8500] hover:text-[#d97000]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
