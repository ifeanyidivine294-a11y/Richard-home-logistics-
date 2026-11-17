import React, { useState } from 'react';
import { Check, CheckCircle, MessageSquare, Copy, ExternalLink, X, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createWhatsAppUrl } from '../utils/formatters';
import { BrandLogo } from './BrandLogo';

export const OrderReadyModal: React.FC = () => {
  const {
    isOrderReadyModalOpen,
    setIsOrderReadyModalOpen,
    activeOrder,
    businessSettings,
    showToast,
    setActiveTab
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!isOrderReadyModalOpen || !activeOrder) return null;

  const whatsappUrl = createWhatsAppUrl(businessSettings.whatsAppNumber, activeOrder.whatsAppMessage);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(activeOrder.whatsAppMessage);
    setCopied(true);
    showToast('Order details copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center space-y-5 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsOrderReadyModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Green Circle with Checkmark (from reference image) */}
        <div className="pt-2">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg shadow-green-600/30">
            <Check className="w-10 h-10 stroke-[3.5px]" />
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="text-xl font-black text-[#172033] tracking-tight">
            Order Ready!
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[260px] mx-auto">
            Your order details have been prepared. Click below to send them on WhatsApp.
          </p>
          <div className="mt-2 text-xs font-mono font-bold text-[#071B49] bg-slate-100 py-1 px-2.5 rounded-lg inline-block">
            Ref: {activeOrder.reference}
          </div>
        </div>

        {/* Big Green "Open WhatsApp" Button (matching screenshot) */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-4 bg-[#16A34A] hover:bg-[#15803d] active:scale-98 text-white rounded-xl font-bold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            Open WhatsApp
          </button>

          <button
            onClick={handleCopyMessage}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Order Details Copied!' : 'Copy Order Text to Clipboard'}
          </button>
        </div>

        {/* Blue Info Note (matching screenshot) */}
        <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-left text-xs text-blue-900">
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
            i
          </div>
          <div>
            <strong className="block font-bold">Note:</strong>
            <p className="text-[11px] leading-tight text-blue-800 mt-0.5">
              Sending the WhatsApp message is your confirmation request.
            </p>
          </div>
        </div>

        {/* Brand House Logo footer (matching screenshot) */}
        <div className="pt-2 flex justify-center opacity-85">
          <BrandLogo size="md" showTagline={false} />
        </div>
      </div>
    </div>
  );
};
