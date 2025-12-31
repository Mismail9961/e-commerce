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

  return (
    <div
      onClick={() => router.push("/product/" + product._id)}
      className="flex flex-col gap-1.5 min-[375px]:gap-2 w-full cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative bg-gray-100 border border-gray-200 w-full aspect-[3/4] flex items-center justify-center overflow-hidden rounded-lg">
        {/* Sale Badge */}
        {hasOffer && (
          <div className="absolute top-1.5 min-[375px]:top-2 left-1.5 min-[375px]:left-2 z-10 bg-blue-600 text-white text-[10px] min-[375px]:text-xs font-bold px-2 min-[375px]:px-2.5 py-0.5 min-[375px]:py-1 rounded shadow-md">
            Sale
          </div>
        )}

        <Image
          src={productImage}
          alt={product?.name || "Product"}
          className="group-hover:scale-105 transition-transform duration-500 object-cover w-full h-full"
          width={400}
          height={500}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 min-[375px]:gap-1.5 px-0.5 min-[375px]:px-1">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] min-[375px]:text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium border border-blue-200">
            {categoryName}
          </span>
        </div>

        {/* Product Name */}
        <p className="text-xs min-[375px]:text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] min-[375px]:min-h-[2.8rem]">
          {product?.name || "Unnamed Product"}
        </p>

        {/* Description - Hidden on mobile */}
        <p className="hidden md:block text-xs text-gray-600 truncate">
          {product?.description || ""}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 min-[375px]:gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Image
                key={index}
                className="h-2.5 w-2.5 min-[375px]:h-3 min-[375px]:w-3"
                src={index < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
              />
            ))}
          </div>
          <p className="text-[10px] min-[375px]:text-xs text-gray-600">(4.5)</p>
        </div>

        {/* Price and Buy Button */}
        <div className="flex items-start justify-between mt-0.5 min-[375px]:mt-1 gap-1">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm min-[375px]:text-base sm:text-lg font-bold text-gray-900 leading-none whitespace-nowrap">
              {currency}{displayPrice}
            </p>
            {hasOffer && (
              <p className="text-[10px] min-[375px]:text-xs sm:text-sm text-gray-500 line-through leading-none whitespace-nowrap">
                {currency}{product.price}
              </p>
            )}
          </div>
          
          <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded shadow-sm">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;