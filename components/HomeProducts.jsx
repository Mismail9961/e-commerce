"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const HomeProducts = () => {
  const { router } = useAppContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/list");
        if (res.data.success) {
          const normalized = res.data.data.map((c) => ({
            _id: String(c._id),
            name: c.name,
          }));
          setCategories(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/product/list");
        if (res.data.success && res.data.data) {
          const validProducts = res.data.data.filter(
            (product) => product && product._id && product.name
          );
          setProducts(validProducts);
        } else {
          console.error("Failed to fetch products: Invalid response", res.data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper to get category name from product
  const getCategoryName = (product) => {
    if (!product.category) return 'Uncategorized';
    
    // Handle MongoDB ObjectId format
    let categoryId;
    if (typeof product.category === 'object' && product.category?.$oid) {
      categoryId = product.category.$oid;
    } else if (typeof product.category === 'object' && product.category?._id) {
      categoryId = String(product.category._id);
    } else {
      categoryId = String(product.category);
    }

    // Find category name from categories list
    const category = categories.find(cat => String(cat._id) === categoryId);
    return category?.name || 'Uncategorized';
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = getCategoryName(product);
    
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedProducts).sort((a, b) => 
    a.localeCompare(b)
  );

  // Helper to get category slug
  const getCategorySlug = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, "-");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        {sortedCategories.length > 0 ? (
          sortedCategories.map((categoryName, index) => {
            const categorySlug = getCategorySlug(categoryName);
            
            return (
              <div 
                key={categoryName} 
                className={`mb-16 sm:mb-20 lg:mb-24 ${
                  index === 0 ? 'animate-fade-in' : ''
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-10 pb-4 border-b-2 border-[#00b4d8]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-[#00b4d8] to-[#03045e] rounded-full"></div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#03045e] mb-1">
                        {categoryName}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {groupedProducts[categoryName].length} {groupedProducts[categoryName].length === 1 ? 'product' : 'products'} available
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/${categorySlug}`)}
                    className="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-[#03045e] bg-white hover:bg-[#00b4d8] hover:text-white border-2 border-[#00b4d8] rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <span className="hidden sm:inline">View All</span>
                    <span className="sm:hidden">All</span>
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                  {groupedProducts[categoryName].slice(0, 10).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Show More Button (if more than 10 products) */}
                {groupedProducts[categoryName].length > 10 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => router.push(`/${categorySlug}`)}
                      className="group flex items-center gap-2 px-8 py-3 text-sm font-medium text-[#03045e] bg-white hover:bg-[#00b4d8]/10 border border-[#00b4d8]/30 hover:border-[#00b4d8] rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <span>Show {groupedProducts[categoryName].length - 10} more products</span>
                      <svg 
                        className="w-4 h-4 transition-transform group-hover:translate-y-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 mb-6 bg-gradient-to-br from-[#00b4d8]/20 to-[#03045e]/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[#00b4d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-xl sm:text-2xl text-[#03045e] font-bold mb-2">No products available</p>
            <p className="text-sm text-gray-500">Check back soon for new arrivals!</p>
          </div>
        )}

        {/* See All Products Button */}
        {sortedCategories.length > 0 && (
          <div className="flex justify-center mt-12 sm:mt-16">
            <button
              onClick={() => router.push("/all-products")}
              className="group relative px-10 sm:px-14 py-4 sm:py-4.5 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-[#00b4d8] to-[#03045e] hover:from-[#03045e] hover:to-[#00b4d8] rounded-xl shadow-lg shadow-[#00b4d8]/30 hover:shadow-[#00b4d8]/50 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Browse All Products
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;