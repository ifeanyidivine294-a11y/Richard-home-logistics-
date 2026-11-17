import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DeviceFrameWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useApp();

  return (
    <div className="min-h-screen bg-[#EAEFF7] text-[#172033] flex flex-col justify-start items-center">
      {/* Desktop floating mode switcher banner */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-6xl px-6 py-2.5 my-2 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-xs font-black text-[#071B49] tracking-tight">
            Richard Home Logistics
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-medium text-slate-600">
            Android Mobile App & Web Store
          </span>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setDeviceMode('mobile-frame')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              deviceMode === 'mobile-frame'
                ? 'bg-[#071B49] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android Mobile Frame (Reference UI)
          </button>
          <button
            onClick={() => setDeviceMode('responsive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              deviceMode === 'responsive'
                ? 'bg-[#071B49] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop Responsive View
          </button>
        </div>
      </div>

      {/* Container conditional rendering */}
      {deviceMode === 'mobile-frame' ? (
        <div className="w-full flex justify-center py-0 lg:py-4 px-0 lg:px-4">
          {/* Android Handset Mockup Container on Desktop, normal on Mobile */}
          <div className="w-full max-w-[430px] bg-white min-h-screen lg:min-h-[880px] lg:max-h-[920px] lg:rounded-[44px] lg:border-[10px] lg:border-[#1E293B] lg:shadow-2xl flex flex-col relative overflow-hidden transition-all">
            {/* Android Status Bar (Visible on Desktop Mockup) */}
            <div className="hidden lg:flex items-center justify-between px-6 pt-3 pb-1 bg-white text-slate-800 text-[11px] font-semibold select-none shrink-0 z-30">
              <span>9:41</span>
              {/* Camera Notch */}
              <div className="w-4 h-4 rounded-full bg-slate-900 mx-auto -mt-1 shadow-inner" />
              <div className="flex items-center gap-1.5 text-slate-700">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Application Scrollable Screen Viewport */}
            <div className="flex-1 overflow-y-auto relative bg-[#F4F7FC] flex flex-col">
              {children}
            </div>

            {/* Android Navigation Bar Pill Indicator */}
            <div className="hidden lg:flex justify-center pb-2 bg-white shrink-0">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop View */
        <div className="w-full max-w-6xl bg-[#F4F7FC] min-h-screen shadow-xs flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
