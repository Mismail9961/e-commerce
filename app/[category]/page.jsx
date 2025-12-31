'use client';

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Loading from "@/components/Loading";
import CategorySeoSchema from "@/components/CategorySeoSchema";
import { useAppContext } from "@/context/AppContext";

/* ================= HELPERS ================= */
const slugify = (text = "") =>
  text.toLowerCase().replace(/\s+/g, "-");

/* ================= COMPONENT ================= */
const CategoryPage = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [categorySeo, setCategorySeo] = useState(null);

  const isAllProducts = category === "all-products";

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/list");
        const data = await res.json();

        if (data.success) {
          // Normalize category IDs to strings
          const normalized = data.data.map((c) => ({
            _id: String(c._id),
            name: c.name,
            slug: slugify(c.name)
          }));

          setCategories(normalized);
          console.log("Categories loaded:", normalized);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= ACTIVE CATEGORY ================= */
  const activeCategory = useMemo(() => {
    if (isAllProducts) return null;

    const found = categories.find(
      (c) => c.slug === category
    );

    console.log("Active category:", found, "for slug:", category);
    return found;
  }, [categories, category, isAllProducts]);

  const categoryName = activeCategory?.name || "All Products";
  const categoryId = activeCategory?._id;

  /* ================= FETCH CATEGORY SEO ================= */
  useEffect(() => {
    if (isAllProducts) return;

    const fetchSeo = async () => {
      try {
        const res = await fetch(`/api/seo/category/${category}`);
        const data = await res.json();
        if (data.success) setCategorySeo(data.data);
      } catch (err) {
        console.error("SEO fetch failed", err);
      }
    };

    fetchSeo();
  }, [category, isAllProducts]);

  /* ================= FILTER PRODUCTS BY CATEGORY ID ================= */
  const filteredProducts = useMemo(() => {
    if (isAllProducts) {
      console.log("Showing all products:", products.length);
      return products;
    }

    if (!categoryId) {
      console.log("No category ID found, returning empty");
      return [];
    }

    // Filter products where product.category matches the category._id
    const filtered = products.filter((p) => {
      // Handle MongoDB ObjectId format: {"$oid": "id"} or plain string
      let productCategoryId;
      
      if (typeof p.category === 'object' && p.category?.$oid) {
        productCategoryId = String(p.category.$oid);
      } else if (typeof p.category === 'object' && p.category?._id) {
        productCategoryId = String(p.category._id);
      } else {
        productCategoryId = String(p.category);
      }
      
      const matches = productCategoryId === categoryId;
      
      if (matches) {
        console.log("✅ Product matched:", p.name, "| Category ID:", productCategoryId);
      }
      
      return matches;
    });

    console.log(`🔍 Filtered ${filtered.length} products for category "${categoryName}" (ID: ${categoryId})`);
    console.log("Sample product categories:", products.slice(0, 3).map(p => ({
      name: p.name,
      category: p.category
    })));
    
    return filtered;
  }, [products, categoryId, isAllProducts, categoryName]);

  const searchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return filteredProducts;

    const q = searchQuery.toLowerCase();
    return filteredProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [filteredProducts, searchQuery]);

  /* ================= PAGE LOADING ================= */
  useEffect(() => {
    if (!loadingCategories) {
      const t = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(t);
    }
  }, [loadingCategories]);

  /* ================= LOADING ================= */
  if (isLoading) return <Loading />;

  /* ================= INVALID CATEGORY ================= */
  if (!isAllProducts && !activeCategory) {
    return (
      <>
        <TopBar />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-3 sm:mb-4">404</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Category not found</p>
            <Link
              href="/all-products"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-blue-600 transition"
            >
              Browse All Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ================= RENDER ================= */
  return (
    <>
      <CategorySeoSchema
        categoryName={categoryName}
        categorySlug={category}
        products={searchedProducts}
        categorySeo={categorySeo}
      />

      <TopBar />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-12">

          {/* Breadcrumb */}
          <div className="pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 lg:pb-6 text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <span className="mx-1.5 sm:mx-2">/</span>
            <span className="text-gray-800 truncate inline-block max-w-[200px] sm:max-w-none align-bottom">{categoryName}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 lg:gap-6 pb-4 sm:pb-6 lg:pb-10">
            <div className="w-full lg:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 mb-1 sm:mb-2 leading-tight">
                {categoryName}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                {searchedProducts.length} {searchedProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 pl-8 sm:pl-10 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm"
              />
              <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-base sm:text-lg text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* MOBILE CATEGORY DROPDOWN */}
          <div className="lg:hidden w-full mb-4 sm:mb-6">
            <select
              value={isAllProducts ? "all-products" : category}
              onChange={(e) => {
                const value = e.target.value;
                window.location.href = value === "all-products" ? "/all-products" : `/${value}`;
              }}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            >
              <option value="all-products">All Products ({products.length})</option>
              {categories.map((cat) => {
                // Count products for this category (handle ObjectId format)
                const productCount = products.filter(p => {
                  let productCategoryId;
                  if (typeof p.category === 'object' && p.category?.$oid) {
                    productCategoryId = String(p.category.$oid);
                  } else if (typeof p.category === 'object' && p.category?._id) {
                    productCategoryId = String(p.category._id);
                  } else {
                    productCategoryId = String(p.category);
                  }
                  return productCategoryId === cat._id;
                }).length;
                
                return (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name} ({productCount})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-4 sm:gap-6 lg:gap-8 pb-8 sm:pb-12 lg:pb-20">

            {/* SIDEBAR - Desktop Only */}
            <aside className="hidden lg:block w-72">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                <h3 className="text-gray-800 font-bold mb-4 text-lg">Categories</h3>

                <Link
                  href="/all-products"
                  className={`flex items-center justify-between px-4 py-3 rounded-xl mb-2 transition-all ${
                    isAllProducts
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-xs opacity-70">{products.length}</span>
                </Link>

                <div className="space-y-1">
                  {categories.map((cat) => {
                    const active = cat.slug === category;
                    
                    // Count products for this category (handle ObjectId format)
                    const productCount = products.filter(p => {
                      let productCategoryId;
                      if (typeof p.category === 'object' && p.category?.$oid) {
                        productCategoryId = String(p.category.$oid);
                      } else if (typeof p.category === 'object' && p.category?._id) {
                        productCategoryId = String(p.category._id);
                      } else {
                        productCategoryId = String(p.category);
                      }
                      return productCategoryId === cat._id;
                    }).length;

                    return (
                      <Link
                        key={cat._id}
                        href={`/${cat.slug}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          active
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs opacity-70">{productCount}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* PRODUCTS GRID */}
            <div className="flex-1 w-full min-w-0">
              {searchedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6">
                  {searchedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-24 lg:py-32 px-3">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📦</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                    No products found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? `No results for "${searchQuery}" in ${categoryName}`
                      : `No products available in ${categoryName} yet`
                    }
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-blue-600 transition shadow-md"
                    >
                      Clear Search
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

export default CategoryPage;