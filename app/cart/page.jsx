'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const Cart = () => {

  const { currency, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();
  const [cartProducts, setCartProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch product details for all items in cart
  useEffect(() => {
    const fetchCartProducts = async () => {
      const productIds = Object.keys(cartItems).filter(id => cartItems[id] > 0);
      
      if (productIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all products in parallel
        const productPromises = productIds.map(async (id) => {
          try {
            const res = await axios.get(`/api/product/${id}`);
            if (res.data.success && res.data.data) {
              return { id, product: res.data.data };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
          }
        });

        const results = await Promise.all(productPromises);
        const productsMap = {};
        
        results.forEach((result) => {
          if (result) {
            productsMap[result.id] = result.product;
          }
        });

        setCartProducts(productsMap);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cartItems]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </>
    );
  }

  const cartItemIds = Object.keys(cartItems).filter(id => cartItems[id] > 0);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-6 xs:gap-8 md:gap-10 px-3 xs:px-4 sm:px-6 md:px-16 lg:px-32 pt-8 xs:pt-10 md:pt-14 mb-12 xs:mb-16 md:mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 xs:mb-8 border-b border-gray-500/30 pb-4 xs:pb-6">
            <p className="text-xl xs:text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-base xs:text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>
          
          {cartItemIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 xs:py-16 md:py-20">
              <p className="text-lg xs:text-xl text-gray-500 mb-4">Your cart is empty</p>
              <button 
                onClick={() => router.push('/all-products')} 
                className="px-5 xs:px-6 py-2 xs:py-2.5 bg-orange-500 text-white text-sm xs:text-base rounded hover:bg-orange-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Card View - iPhone 5S optimized */}
              <div className="md:hidden space-y-4">
                {cartItemIds.map((itemId) => {
                  const product = cartProducts[itemId];

                  if (!product || cartItems[itemId] <= 0) return null;

                  const productImage = product.image?.[0] || assets.upload_area;
                  const displayPrice = product.offerPrice || product.price || 0;
                  const subtotal = displayPrice * cartItems[itemId];

                  return (
                    <div key={itemId} className="bg-white border border-gray-200 rounded-lg p-3 xs:p-4 shadow-sm">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="rounded-lg overflow-hidden bg-gray-100 p-2 w-20 xs:w-24">
                            <Image
                              src={productImage}
                              alt={product.name || "Product"}
                              className="w-full h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm xs:text-base font-medium text-gray-800 truncate mb-1 xs:mb-2">
                            {product.name || "Unnamed Product"}
                          </h3>
                          <p className="text-xs xs:text-sm text-gray-600 mb-2 xs:mb-3">
                            {currency}{displayPrice.toFixed(2)} each
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 xs:gap-3 bg-gray-50 rounded-lg px-2 xs:px-3 py-1.5">
                              <button 
                                onClick={() => updateCartQuantity(itemId, cartItems[itemId] - 1)}
                                className="text-gray-600 hover:text-orange-600 transition"
                              >
                                <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="text-sm xs:text-base font-medium text-gray-800 min-w-[20px] text-center">
                                {cartItems[itemId]}
                              </span>
                              <button 
                                onClick={() => addToCart(itemId)}
                                className="text-gray-600 hover:text-orange-600 transition"
                              >
                                <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            <button
                              className="text-xs xs:text-sm text-red-500 hover:text-red-600 font-medium transition"
                              onClick={() => updateCartQuantity(itemId, 0)}
                            >
                              Remove
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="flex items-center justify-between mt-2 xs:mt-3 pt-2 xs:pt-3 border-t border-gray-100">
                            <span className="text-xs xs:text-sm text-gray-600">Subtotal:</span>
                            <span className="text-sm xs:text-base font-semibold text-orange-600">
                              {currency}{subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="text-left">
                    <tr>
                      <th className="text-nowrap pb-6 px-4 text-gray-600 font-medium">
                        Product Details
                      </th>
                      <th className="pb-6 px-4 text-gray-600 font-medium">
                        Price
                      </th>
                      <th className="pb-6 px-4 text-gray-600 font-medium">
                        Quantity
                      </th>
                      <th className="pb-6 px-4 text-gray-600 font-medium">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItemIds.map((itemId) => {
                      const product = cartProducts[itemId];

                      if (!product || cartItems[itemId] <= 0) return null;

                      const productImage = product.image?.[0] || assets.upload_area;
                      const displayPrice = product.offerPrice || product.price || 0;
                      const subtotal = displayPrice * cartItems[itemId];

                      return (
                        <tr key={itemId}>
                          <td className="flex items-center gap-4 py-4 px-4">
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                              <Image
                                src={productImage}
                                alt={product.name || "Product"}
                                className="w-16 h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                              />
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-800">{product.name || "Unnamed Product"}</p>
                              <button
                                className="text-xs text-orange-600 mt-1 hover:text-orange-700 transition"
                                onClick={() => updateCartQuantity(itemId, 0)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {currency}{displayPrice.toFixed(2)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateCartQuantity(itemId, cartItems[itemId] - 1)}>
                                <Image
                                  src={assets.decrease_arrow}
                                  alt="decrease_arrow"
                                  className="w-4 h-4"
                                />
                              </button>
                              <input 
                                onChange={e => {
                                  const value = Number(e.target.value);
                                  if (value >= 0) {
                                    updateCartQuantity(itemId, value);
                                  }
                                }} 
                                type="number" 
                                value={cartItems[itemId]} 
                                min="0"
                                className="w-10 border text-center appearance-none rounded px-1 py-1"
                              />
                              <button onClick={() => addToCart(itemId)}>
                                <Image
                                  src={assets.increase_arrow}
                                  alt="increase_arrow"
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 font-medium">
                            {currency}{subtotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button 
                onClick={() => router.push('/all-products')} 
                className="group flex items-center mt-4 xs:mt-6 gap-2 text-orange-600 hover:text-orange-700 text-sm xs:text-base transition"
              >
                <Image
                  className="group-hover:-translate-x-1 transition w-4 h-4 xs:w-5 xs:h-5"
                  src={assets.arrow_right_icon_colored}
                  alt="arrow_right_icon_colored"
                />
                Continue Shopping
              </button>
            </>
          )}
        </div>
        <OrderSummary cartItems={cartItems} cartProducts={cartProducts} />
      </div>
      <Footer />
    </>
  );
};

export default Cart;