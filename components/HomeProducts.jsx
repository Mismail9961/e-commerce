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

  // Priority order for categories
  const categoryPriority = [
    "Gaming Consoles",
    "PlayStation Games", 
    "Gaming Accessories"
  ];

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

  // Sort categories by priority
  const sortedCategories = Object.keys(groupedProducts).sort((a, b) => {
    const priorityA = categoryPriority.indexOf(a);
    const priorityB = categoryPriority.indexOf(b);

    // If both are in priority list, sort by priority
    if (priorityA !== -1 && priorityB !== -1) {
      return priorityA - priorityB;
    }
    
    // If only A is in priority list, it comes first
    if (priorityA !== -1) return -1;
    
    // If only B is in priority list, it comes first
    if (priorityB !== -1) return 1;
    
    // If neither is in priority list, sort alphabetically
    return a.localeCompare(b);
  });

  // Helper to get category slug
  const getCategorySlug = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, "-");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-gradient-to-br from-[#001d2e] via-[#003049] to-[#001d2e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#9d0208] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001d2e] via-[#003049] to-[#001d2e]">
      {sortedCategories.length > 0 ? (
        sortedCategories.map((categoryName, index) => {
          const isPriorityCategory = categoryPriority.includes(categoryName);
          const categorySlug = getCategorySlug(categoryName);
          
          return (
            <div 
              key={categoryName} 
              className={`mb-12 sm:mb-16 lg:mb-20 ${
                index === 0 ? 'animate-fade-in' : ''
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {categoryName}
                  </h2>

                </div>
                <button
                  onClick={() => router.push(`/${categorySlug}`)}
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
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

              {/* Products Count */}
              <p className="text-xs sm:text-sm text-gray-400 mb-4">
                {groupedProducts[categoryName].length} {groupedProducts[categoryName].length === 1 ? 'product' : 'products'}
              </p>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {groupedProducts[categoryName].slice(0, 10).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Show More Button (if more than 10 products) */}
              {groupedProducts[categoryName].length > 10 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => router.push(`/${categorySlug}`)}
                    className="px-6 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all"
                  >
                    Show {groupedProducts[categoryName].length - 10} more products
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl text-white font-semibold mb-2">No products available</p>
          <p className="text-sm text-gray-400">Check back soon for new products!</p>
        </div>
      )}

      {/* See All Products Button */}
      {sortedCategories.length > 0 && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={() => router.push("/all-products")}
            className="px-8 sm:px-12 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white bg-[#9d0208] hover:bg-[#7a0006] transition-all duration-300 rounded-xl shadow-lg shadow-[#9d0208]/20 hover:shadow-[#9d0208]/40"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeProducts;