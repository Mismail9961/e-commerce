'use client';

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import TopBar from "@/components/TopBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";

/* Optional custom slug overrides */
const slugMap = {
  "Gaming Consoles": "gaming-consoles",
  "Mobile Accessories": "mobile-accessories",
  "PlayStation Games": "playstation-games",
  "Gaming Accessories": "gaming-accessories",
};

const AllProducts = () => {
  const { products } = useAppContext();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/list");
        const data = await res.json();

        if (data.success) {
          setCategories(data.data.map((c) => c.name));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= FILTER PRODUCTS ================= */
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    return products.filter((p) =>
      selectedCategories.includes(p.category)
    );
  }, [products, selectedCategories]);

  const searchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return filteredProducts;

    const q = searchQuery.toLowerCase();
    return filteredProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [filteredProducts, searchQuery]);

  /* ================= HELPERS ================= */
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  const renderCategories = (onClick) => {
    if (loadingCategories) {
      return (
        <p className="text-sm text-[#03045e]/60 px-4">
          Loading categories...
        </p>
      );
    }

    if (categories.length === 0) {
      return (
        <p className="text-sm text-[#03045e]/60 px-4">
          No categories found
        </p>
      );
    }

    return categories.map((category) => {
      const slug =
        slugMap[category] ||
        category.toLowerCase().replace(/\s+/g, "-");

      return (
        <Link
          key={category}
          href={`/${slug}`}
          onClick={onClick}
          className="group flex items-center gap-3 px-4 py-3 text-sm text-[#03045e]/60 hover:text-[#00b4d8] hover:bg-[#00b4d8]/5 rounded-xl transition-all"
        >
          <span>{category}</span>
        </Link>
      );
    });
  };

  /* ================= JSX ================= */
  return (
    <>
      <TopBar />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

          {/* Header */}
          <div className="pt-10 pb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#00b4d8] to-[#03045e] bg-clip-text text-transparent">
              All Products
            </h1>

            {/* Search */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-xl text-[#03045e] placeholder-[#03045e]/40 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] transition shadow-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#03045e]/40">
                🔍
              </span>
            </div>
          </div>

          <div className="flex gap-8 pb-20">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden lg:block w-72">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-[#03045e] font-bold mb-4">Categories</h3>
                <div className="space-y-1">
                  {renderCategories()}
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h4 className="text-sm text-[#03045e]/60 font-semibold mb-3">Filter by Category</h4>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 text-sm text-[#03045e]/80 cursor-pointer mb-3 hover:text-[#00b4d8] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-[#00b4d8] bg-white border-gray-300 rounded focus:ring-[#00b4d8] focus:ring-2"
                      />
                      {category}
                    </label>
                  ))}
                </div>

                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-[#00b4d8] hover:text-[#03045e] font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </aside>

            {/* PRODUCTS GRID */}
            <div className="flex-1">
              {searchedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {searchedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00b4d8] to-[#03045e] bg-clip-text text-transparent mb-3">
                    No products found
                  </h3>
                  <p className="text-[#03045e]/60 mb-6">
                    Try adjusting your search or filters
                  </p>
                  {(searchQuery || selectedCategories.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        clearFilters();
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#00b4d8] to-[#03045e] text-white rounded-xl hover:from-[#03045e] hover:to-[#00b4d8] transition-all shadow-lg"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default AllProducts;