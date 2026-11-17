import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  lightText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  lightText = false,
  className = ''
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isXl = size === 'xl';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Icon: Roofline with chimney and 4 window panes */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${
          isSm ? 'w-8 h-8' : isLg ? 'w-14 h-14' : isXl ? 'w-20 h-20' : 'w-10 h-10'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House Roof in Vibrant Orange */}
          <path
            d="M10 50L50 18L90 50"
            stroke="#FF8500"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Chimney */}
          <path
            d="M74 38V26H64V30"
            stroke="#FF8500"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 4 Window Panes */}
          <rect x="38" y="46" width="10" height="10" rx="1.5" fill="#FF8500" />
          <rect x="52" y="46" width="10" height="10" rx="1.5" fill="#FF8500" />
          <rect x="38" y="60" width="10" height="10" rx="1.5" fill="#FF8500" />
          <rect x="52" y="60" width="10" height="10" rx="1.5" fill="#FF8500" />
          {/* Lower foundation accent line */}
          <path
            d="M24 82H76"
            stroke="#071B49"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight ${
              isSm
                ? 'text-sm'
                : isLg
                ? 'text-xl'
                : isXl
                ? 'text-3xl'
                : 'text-base'
            } ${lightText ? 'text-white' : 'text-[#071B49]'}`}
          >
            Richard
          </span>
        </div>
        <div className="flex items-center -mt-0.5">
          <span
            className={`font-bold tracking-tight ${
              isSm
                ? 'text-xs'
                : isLg
                ? 'text-base'
                : isXl
                ? 'text-2xl'
                : 'text-sm'
            } ${lightText ? 'text-slate-100' : 'text-[#071B49]'}`}
          >
            Home
          </span>
          <span
            className={`font-extrabold ml-1 tracking-tight ${
              isSm
                ? 'text-xs'
                : isLg
                ? 'text-base'
                : isXl
                ? 'text-2xl'
                : 'text-sm'
            } text-[#FF8500]`}
          >
            Logistics
          </span>
        </div>

        {showTagline && (
          <span
            className={`italic font-medium -mt-0.5 tracking-tight ${
              isSm ? 'text-[8px]' : isXl ? 'text-sm' : 'text-[9px]'
            } ${lightText ? 'text-amber-300' : 'text-[#071B49]/80'}`}
          >
            ...Your Home, Our Priority
          </span>
        )}
      </div>
    </div>
  );
};
