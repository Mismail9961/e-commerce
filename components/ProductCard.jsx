"use client";
import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();
  const productImage = product?.image?.[0] || assets.upload_area;
  const displayPrice = product?.offerPrice || product?.price || 0;
  const hasOffer = product?.offerPrice && product?.price && product.offerPrice < product.price;

  // Get category name - handles both string and populated object
  const categoryName = typeof product?.category === 'string' 
    ? product?.category 
    : product?.category?.name || 'Uncategorized';

  // Calculate discount percentage
  const discountPercentage = hasOffer 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div
      onClick={() => router.push("/product/" + product._id)}
      className="flex flex-col gap-2 min-[375px]:gap-2.5 w-full cursor-pointer group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#00b4d8]/30"
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-[#00b4d8]/5 to-[#03045e]/5 w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
        {/* Sale Badge */}
        {hasOffer && (
          <div className="absolute top-2 min-[375px]:top-3 left-2 min-[375px]:left-3 z-10 flex flex-col gap-1">
            <div className="bg-gradient-to-r from-[#00b4d8] to-[#03045e] text-white text-[10px] min-[375px]:text-xs font-bold px-2.5 min-[375px]:px-3 py-1 min-[375px]:py-1.5 rounded-lg shadow-md">
              SALE
            </div>
            <div className="bg-white/95 backdrop-blur-sm text-[#03045e] text-[10px] min-[375px]:text-xs font-bold px-2 min-[375px]:px-2.5 py-0.5 min-[375px]:py-1 rounded-lg shadow-md">
              -{discountPercentage}%
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Add wishlist logic here
          }}
          className="absolute top-2 min-[375px]:top-3 right-2 min-[375px]:right-3 z-10 w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 bg-white/90 backdrop-blur-sm hover:bg-[#00b4d8] text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <Image
          src={productImage}
          alt={product?.name || "Product"}
          className="group-hover:scale-110 transition-transform duration-700 object-cover w-full h-full"
          width={400}
          height={500}
        />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push("/product/" + product._id);
            }}
            className="px-4 py-2 bg-white text-[#03045e] text-xs font-semibold rounded-lg shadow-lg hover:bg-[#00b4d8] hover:text-white transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 min-[375px]:gap-2 p-3 min-[375px]:p-4">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] min-[375px]:text-xs text-[#00b4d8] bg-[#00b4d8]/10 px-2.5 py-1 rounded-full font-semibold">
            {categoryName}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-xs min-[375px]:text-sm sm:text-base font-bold text-[#03045e] line-clamp-2 leading-tight min-h-[2.5rem] min-[375px]:min-h-[2.8rem] group-hover:text-[#00b4d8] transition-colors">
          {product?.name || "Unnamed Product"}
        </h3>

        {/* Description - Hidden on mobile */}
        <p className="hidden md:block text-xs text-gray-500 truncate">
          {product?.description || "No description available"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 min-[375px]:gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg
                key={index}
                className={`h-3 w-3 min-[375px]:h-3.5 min-[375px]:w-3.5 ${
                  index < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] min-[375px]:text-xs text-gray-500 font-medium">(4.5)</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-1 min-[375px]:mt-2 pt-2 border-t border-gray-100">
          <div className="flex flex-col gap-0.5">
            <p className="text-base min-[375px]:text-lg sm:text-xl font-bold text-[#03045e] leading-none">
              {currency}{displayPrice}
            </p>
            {hasOffer && (
              <p className="text-[10px] min-[375px]:text-xs sm:text-sm text-gray-400 line-through leading-none">
                {currency}{product.price}
              </p>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#00b4d8] to-[#03045e] hover:from-[#03045e] hover:to-[#00b4d8] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group/btn"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;