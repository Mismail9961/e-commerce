"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { router, getCartCount } = useAppContext();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const canAccessSellerDashboard =
    session?.user?.role === "seller" || session?.user?.role === "admin";

  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut({ redirect: false });
    window.location.reload();
  };

  const cartCount = getCartCount();

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-[#EA580B]/10">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section with Accent */}
          <div className="flex items-center gap-2 xs:gap-3">
            <div className="h-8 xs:h-10 lg:h-12 w-1 bg-gradient-to-b from-[#EA580B] to-orange-400 rounded-full flex-shrink-0"></div>
            <Image
              className="cursor-pointer w-16 xs:w-20 sm:w-28 lg:w-36 h-auto max-h-12 lg:max-h-14 object-contain transition-all hover:scale-105"
              onClick={() => router.push("/")}
              src={assets.mainlogo}
              alt="logo"
            />
          </div>

          {/* Desktop Navigation - Pill Style */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-2 bg-gray-50/80 backdrop-blur-sm rounded-full p-1.5 border border-gray-100">
              <Link
                href="/"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-[#EA580B] to-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-700 hover:bg-white hover:text-[#EA580B]"
                }`}
              >
                Home
              </Link>
              <Link
                href="/all-products"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive("/all-products")
                    ? "bg-gradient-to-r from-[#EA580B] to-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-700 hover:bg-white hover:text-[#EA580B]"
                }`}
              >
                Shop
              </Link>
              <Link
                href="/about-us"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive("/about-us")
                    ? "bg-gradient-to-r from-[#EA580B] to-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-700 hover:bg-white hover:text-[#EA580B]"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive("/contact-us")
                    ? "bg-gradient-to-r from-[#EA580B] to-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-700 hover:bg-white hover:text-[#EA580B]"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 xs:gap-3">
            {/* Seller Dashboard - Desktop */}
            {canAccessSellerDashboard && (
              <button
                onClick={() => router.push("/seller")}
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#EA580B] bg-orange-50 hover:bg-[#EA580B] hover:text-white rounded-full transition-all duration-300 border border-[#EA580B]/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </button>
            )}

            {/* Cart Button - Enhanced */}
            <button
              onClick={() => router.push("/cart")}
              className="relative group p-2.5 lg:p-3 bg-white hover:bg-orange-50 border border-gray-200 hover:border-[#EA580B]/30 rounded-full transition-all duration-300"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 group-hover:text-[#EA580B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-[#EA580B] to-orange-500 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-lg shadow-orange-500/40 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden md:block">
              {status === "loading" ? (
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 animate-pulse"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-orange-50/50 transition-all duration-300 border border-transparent hover:border-[#EA580B]/20"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-[#EA580B]/30 shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-[#EA580B] to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20">
                        {/* Header with Orange Gradient */}
                        <div className="relative px-5 py-4 bg-gradient-to-br from-[#EA580B] to-orange-500">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                          <div className="relative">
                            <p className="text-base font-bold text-white truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-orange-100 truncate mt-0.5">
                              {session.user.email}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-[#EA580B] bg-white rounded-full shadow-sm">
                              {session.user.role}
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/my-orders"
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#EA580B] transition-colors group"
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                              <svg className="w-5 h-5 text-gray-500 group-hover:text-[#EA580B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <span>My Orders</span>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
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
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#EA580B] to-orange-500 rounded-full hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login
                </Link>
              )}
            </div>

            {/* Mobile User Menu */}
            <div className="md:hidden">
              {status === "loading" ? (
                <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 animate-pulse"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-0.5"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-9 h-9 xs:w-10 xs:h-10 rounded-full object-cover border-2 border-[#EA580B]/30"
                      />
                    ) : (
                      <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-gradient-to-br from-[#EA580B] to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm"
                        onClick={() => setShowDropdown(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden max-h-[85vh] overflow-y-auto">
                        {/* Mobile Header with Orange Gradient */}
                        <div className="relative px-4 py-4 bg-gradient-to-br from-[#EA580B] to-orange-500">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                          <div className="relative">
                            <p className="text-sm font-bold text-white truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-orange-100 truncate mt-0.5">
                              {session.user.email}
                            </p>
                            <span className="inline-block mt-2 px-2.5 py-1 text-[10px] font-semibold text-[#EA580B] bg-white rounded-full">
                              {session.user.role}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Navigation Links */}
                        <div className="lg:hidden border-b border-gray-100">
                          <Link
                            href="/"
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                              isActive("/")
                                ? "text-[#EA580B] bg-orange-50"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Home</span>
                          </Link>
                          <Link
                            href="/all-products"
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                              isActive("/all-products")
                                ? "text-[#EA580B] bg-orange-50"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span>Shop</span>
                          </Link>
                          <Link
                            href="/about-us"
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                              isActive("/about-us")
                                ? "text-[#EA580B] bg-orange-50"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>About Us</span>
                          </Link>
                          <Link
                            href="/contact-us"
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                              isActive("/contact-us")
                                ? "text-[#EA580B] bg-orange-50"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Contact</span>
                          </Link>
                        </div>

                        {canAccessSellerDashboard && (
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              router.push("/seller");
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[#EA580B] hover:bg-orange-50 transition-colors border-b border-gray-100"
                          >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Seller Dashboard</span>
                          </button>
                        )}

                        <Link
                          href="/my-orders"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>My Orders</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-3 xs:px-4 py-2 text-xs xs:text-sm font-semibold text-white bg-gradient-to-r from-[#EA580B] to-orange-500 rounded-full shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};

export default Navbar;