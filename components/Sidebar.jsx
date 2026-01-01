"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const { getCartCount } = useAppContext();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [showShopSubmenu, setShowShopSubmenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const canAccessSellerDashboard =
    session?.user?.role === "seller" || session?.user?.role === "admin";

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch("/api/category/list");
        const result = await response.json();
        
        if (result.success && result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    setShowSidebar(false);
    await signOut({ redirect: false });
    window.location.reload();
  };

  const cartCount = getCartCount();
  const isActive = (path) => pathname === path;

  const handleCategoryClick = (slug) => {
    setShowSidebar(false);
    setShowShopSubmenu(false);
    router.push(`/${slug}`);
  };

  const handleNavigation = (path) => {
    setShowSidebar(false);
    setShowShopSubmenu(false);
    router.push(path);
  };

  return (
    <>
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-[60]"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[260px] xs:w-[280px] bg-[#f3f8fd] z-[70] transform transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-lg font-bold text-[#2563eb]">
              7even86gamehub
            </h1>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 rounded-md text-[#2563eb] hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-2 py-3">
            {/* User */}
            {status === "loading" ? (
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse mb-3" />
            ) : session ? (
              <div className="flex gap-3 items-center bg-white p-3 rounded-xl mb-3 shadow-sm">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold">
                    {session.user.name?.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold mb-3"
              >
                Sign In
              </button>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about-us" },
                { label: "Contact", path: "/contact-us" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm ${
                    isActive(item.path)
                      ? "bg-[#2563eb] text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Shop */}
              <button
                onClick={() => setShowShopSubmenu(!showShopSubmenu)}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-200 flex justify-between"
              >
                Shop
                <span>{showShopSubmenu ? "▲" : "▼"}</span>
              </button>

              {showShopSubmenu && (
                <div className="ml-3 space-y-1">
                  <button
                    onClick={() => handleNavigation("/all-products")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-md"
                  >
                    All Products
                  </button>
                  
                  {loadingCategories ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Loading categories...
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => handleCategoryClick(category.name.toLowerCase().replace(/\s+/g, '-'))}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-md"
                      >
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No categories available
                    </div>
                  )}
                </div>
              )}

              {session && (
                <>
                  <button
                    onClick={() => handleNavigation("/cart")}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-200 flex justify-between"
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="bg-[#2563eb] text-white text-xs min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavigation("/my-orders")}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                  >
                    My Orders
                  </button>
                </>
              )}

              {canAccessSellerDashboard && (
                <button
                  onClick={() => handleNavigation("/seller")}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                >
                  Dashboard
                </button>
              )}

              {session && (
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-100"
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="py-3 border-t text-center text-xs text-gray-400">
            © 2024 7even86gamehub.pk
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;