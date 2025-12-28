import React from "react";

export default function TopBar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#00b4d8] to-[#03045e] text-white text-center py-2 sm:py-2.5 text-xs sm:text-sm relative flex items-center justify-center overflow-hidden">
      <span className="absolute font-bold left-4 sm:left-[520px] top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer select-none transition-colors text-base sm:text-lg">
        &#8249;
      </span>
      <span className="px-8 sm:px-12 font-medium">
        We offer Cash on Delivery all over Karachi.
      </span>
      <span className="absolute font-bold right-4 sm:right-[520px] top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer select-none transition-colors text-base sm:text-lg">
        &#8250;
      </span>
    </div>
  );
}