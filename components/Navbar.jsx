"use client";
import React, { useState, useEffect, useMemo } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// Cache for categories to prevent repeated API calls
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const Navbar = () => {
  const { getCartCount } = useAppContext();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const canAccessSellerDashboard =
    session?.user?.role === "seller" || session?.user?.role === "admin";

  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut({ redirect: false });
    window.location.reload();
  };

  const cartCount = getCartCount();

  const isActive = (path) => pathname === path;

  // Helper function to create slug from category name
  const slugify = (text = "") =>
    text.toLowerCase().replace(/\s+/g, "-");

  // Check if cache is still valid
  const isCacheValid = useMemo(() => {
    if (!categoriesCache || !cacheTimestamp) return false;
    return Date.now() - cacheTimestamp < CACHE_DURATION;
  }, []);

  // Fetch categories from backend with caching
  useEffect(() => {
    const fetchCategories = async () => {
      // Use cache if valid
      if (isCacheValid && categoriesCache) {
        setCategories(categoriesCache);
        setLoadingCategories(false);
        return;
      }

      try {
        const res = await fetch("/api/category/list");
        const data = await res.json();

        if (data.success) {
          // Normalize category IDs to strings and create slugs
          const normalized = data.data.map((c) => ({
            _id: String(c._id),
            name: c.name,
            slug: slugify(c.name)
          }));

          // Update cache
          categoriesCache = normalized;
          cacheTimestamp = Date.now();
          
          setCategories(normalized);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isCacheValid]);

  // Handle category click
  const handleCategoryClick = (categorySlug) => {
    setShowCategoriesDropdown(false);
    setShowDropdown(false);
    router.push(`/${categorySlug}`);
  };

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 xs:h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-1.5 xs:p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo Section */}
            <div className="flex items-center gap-2 xs:gap-3">
              <Image
                className="cursor-pointer w-14 xs:w-16 sm:w-24 lg:w-36 h-auto max-h-10 xs:max-h-12 lg:max-h-14 object-contain transition-transform hover:scale-105"
                onClick={() => router.push("/")}
                src={assets.mainlogo}
                alt="logo"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              
              {/* Shop with Categories Dropdown - Desktop */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                  onClick={() => router.push("/all-products")}
                  className={`flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname?.startsWith("/all-products") || 
                    categories.some(cat => pathname === `/${cat.slug}`)
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Shop
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Categories Dropdown */}
                {showCategoriesDropdown && (
                  <div
                    onMouseEnter={() => setShowCategoriesDropdown(true)}
                    onMouseLeave={() => setShowCategoriesDropdown(false)}
                    className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="py-2">
                      <Link
                        href="/all-products"
                        onClick={() => setShowCategoriesDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        All Products
                      </Link>
                      {!loadingCategories && categories.length > 0 && (
                        <>
                          <div className="border-t border-gray-200 my-2"></div>
                          {categories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/${category.slug}`}
                              onClick={() => setShowCategoriesDropdown(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                              {category.name}
                            </Link>
                          ))}
                        </>
                      )}
                      {loadingCategories && (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/about-us"
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/about-us")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/contact-us")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
              {/* Seller Dashboard - Desktop */}
              {canAccessSellerDashboard && (
                <button
                  onClick={() => router.push("/seller")}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => router.push("/cart")}
                className="relative p-1.5 xs:p-2 sm:p-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] xs:min-w-[20px] h-4 xs:h-5 px-1 xs:px-1.5 bg-blue-600 text-white text-[10px] xs:text-xs flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden md:block">
                {status === "loading" ? (
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-gray-200 animate-pulse"></div>
                ) : session ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name}
                          className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowDropdown(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-20">
                          {/* Header */}
                          <div className="px-5 py-4 bg-blue-600">
                            <p className="text-base font-bold text-white truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-blue-100 truncate mt-0.5">
                              {session.user.email}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-blue-600 bg-white rounded-full">
                              {session.user.role}
                            </span>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              href="/my-orders"
                              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setShowDropdown(false)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              <span>My Orders</span>
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Mobile User Menu - Opens Sidebar */}
              <div className="md:hidden">
                {status === "loading" ? (
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                ) : session ? (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-0.5"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm xs:text-base">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                ) : (
                  <Link href="/login" className="flex items-center gap-1.5 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden xs:inline">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

// Export function to clear cache when needed (e.g., after adding new category)
export const clearCategoriesCache = () => {
  categoriesCache = null;
  cacheTimestamp = null;
};

export default Navbar;