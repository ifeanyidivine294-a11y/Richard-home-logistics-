import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-3.5 py-2.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 animate-slide-in backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-[#16A34A] text-white border-emerald-500'
              : toast.type === 'error'
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-[#071B49] text-white border-slate-700'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-white" />
          ) : (
            <Info className="w-4 h-4 shrink-0 text-white" />
          )}
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
