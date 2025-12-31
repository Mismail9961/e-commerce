import React from "react";

export default function TopBar() {
  return (
    <div className="w-full bg-gradient-to-r from-gray-100 to-white text-gray-700 text-center py-2 text-sm relative flex items-center justify-center border-b border-gray-200 px-2">
      
      <span className="absolute font-bold left-2 sm:left-6 md:left-24 lg:left-[520px] top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer select-none hover:text-gray-600 transition">
        &#8249;
      </span>

      <span className="font-medium text-xs sm:text-sm">
        We offer Cash on Delivery all over Karachi.
      </span>

      <span className="absolute font-bold right-2 sm:right-6 md:right-24 lg:right-[520px] top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer select-none hover:text-gray-600 transition">
        &#8250;
      </span>

    </div>
  );
}
