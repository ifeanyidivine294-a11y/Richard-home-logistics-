import React, { useState } from 'react';
import { Smartphone, Download, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already running standalone or user dismissed, don't show
  if (isInstalled || dismissed) return null;

  if (isInstallable) {
    return (
      <div className="bg-[#071B49] text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF8500] text-white flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="font-bold block">Install Richard Home App</span>
            <span className="text-[10px] text-slate-300">Fast ordering right on your home screen</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={install}
            className="px-3 py-1.5 bg-[#FF8500] hover:bg-[#ff941a] text-white font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" /> Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (isIOS) {
    return (
      <>
        <div className="bg-[#071B49] text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#FF8500] text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-bold block">Install on iPhone</span>
              <span className="text-[10px] text-slate-300">Add to Home Screen</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
            >
              How to Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Share className="w-4 h-4 text-[#FF8500]" />
                Install on iPhone / iPad
              </h3>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Tap the <strong>Share</strong> button in Safari's bottom toolbar.
                </li>
                <li>
                  Scroll down and tap <strong>Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong>Add</strong> in the top-right corner.
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full mt-2 py-2.5 bg-[#071B49] text-white text-xs font-bold rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
