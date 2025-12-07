"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React from "react";
import TopBar from "@/components/TopBar";
import WhatsAppButton from "@/components/WhatsAppButton";

const Product = () => {

    const { id } = useParams();
    const { router, addToCart, currency } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await axios.get(`/api/product/${id}`);
            
            if (res.data.success && res.data.data) {
                setProductData(res.data.data);
                setMainImage(res.data.data.image?.[0] || null);
            } else {
                setError("Product not found");
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(err.response?.data?.error || "Failed to load product");
        } finally {
            setLoading(false);
        }
    }

    const fetchRelatedProducts = async () => {
        try {
            const res = await axios.get("/api/product/list");
            if (res.data.success && res.data.data) {
                const related = res.data.data
                    .filter((product) => product._id !== id && product)
                    .slice(0, 5);
                setRelatedProducts(related);
            }
        } catch (err) {
            console.error("Error fetching related products:", err);
        }
    }

    useEffect(() => {
        if (id) {
            fetchProductData();
            fetchRelatedProducts();
        }
    }, [id])

    if (loading) {
        return <Loading />
    }

    if (error || !productData) {
        return (
            <>
            <TopBar/>
                <Navbar />
                <div className="min-h-screen bg-[#003049] flex items-center justify-center px-4">
                    <div className="text-center bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-8 sm:p-12 max-w-md">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#8a1a13] to-black rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-[#8a1a13]/50">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg sm:text-xl text-white font-semibold mb-6">{error || "Product not found"}</p>
                        <button
                            onClick={() => router.push("/")}
                            className="relative overflow-hidden px-6 sm:px-8 py-3 bg-gradient-to-r from-[#8a1a13] to-black text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#8a1a13]/50 transition-all duration-300"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </>
        )
    }

    const displayPrice = productData.offerPrice || productData.price;
    const originalPrice = productData.offerPrice ? productData.price : null;
    const productImages = productData.image || [];

    return (
        <>
            <Navbar />
            <div className="bg-[#003049] min-h-screen px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 pt-6 sm:pt-8 md:pt-12 pb-8">
                
                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
                    
                    {/* Image Gallery */}
                    <div className="space-y-3 sm:space-y-4">
                        {/* Main Image */}
                        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 shadow-2xl">
                            <div className="aspect-square w-full">
                                <Image
                                    src={mainImage || productImages[0] || assets.upload_area}
                                    alt={productData.name}
                                    className="w-full h-full object-contain p-4 sm:p-6 md:p-8 transition-transform duration-500 hover:scale-105"
                                    width={800}
                                    height={800}
                                />
                            </div>
                        </div>

                        {/* Thumbnail Grid */}
                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                {productImages.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setMainImage(image)}
                                        className={`cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-2 transition-all duration-300 hover:scale-105 ${
                                            mainImage === image 
                                                ? "border-[#8a1a13] shadow-lg shadow-[#8a1a13]/50" 
                                                : "border-gray-700 hover:border-gray-600"
                                        }`}
                                    >
                                        <div className="aspect-square">
                                            <Image
                                                src={image}
                                                alt={`${productData.name} - ${index + 1}`}
                                                className="w-full h-full object-contain p-2"
                                                width={200}
                                                height={200}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-4 sm:space-y-6">
                        {/* Product Name */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                            {productData.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4].map((star) => (
                                    <svg key={star} className="w-4 h-4 sm:w-5 sm:h-5 text-[#8a1a13]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span className="text-sm sm:text-base text-gray-400 font-medium">(4.5)</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                            {productData.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#8a1a13] to-white bg-clip-text text-transparent">
                                {currency}{displayPrice}
                            </span>
                            {originalPrice && (
                                <span className="text-base sm:text-lg text-gray-600 line-through">
                                    {currency}{originalPrice}
                                </span>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

                        {/* Product Details Table */}
                        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-800 p-4 sm:p-6">
                            <table className="w-full">
                                <tbody className="space-y-2">
                                    <tr className="border-b border-gray-800">
                                        <td className="text-xs sm:text-sm text-gray-500 font-medium py-2 sm:py-3">Brand</td>
                                        <td className="text-xs sm:text-sm text-gray-300 py-2 sm:py-3 text-right">Generic</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="text-xs sm:text-sm text-gray-500 font-medium py-2 sm:py-3">Color</td>
                                        <td className="text-xs sm:text-sm text-gray-300 py-2 sm:py-3 text-right">Multi</td>
                                    </tr>
                                    <tr>
                                        <td className="text-xs sm:text-sm text-gray-500 font-medium py-2 sm:py-3">Category</td>
                                        <td className="text-xs sm:text-sm text-gray-300 py-2 sm:py-3 text-right">{productData.category}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 pt-4">
                            <button 
                                onClick={() => addToCart(productData._id)} 
                                className="flex-1 py-3 sm:py-4 bg-gray-800 text-white font-semibold text-sm sm:text-base rounded-xl border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300"
                            >
                                Add to Cart
                            </button>
                            <button 
                                onClick={() => { 
                                    addToCart(productData._id); 
                                    router.push('/cart') 
                                }} 
                                className="relative overflow-hidden flex-1 py-3 sm:py-4 bg-gradient-to-r from-[#8a1a13] to-black text-white font-bold text-sm sm:text-base rounded-xl hover:shadow-lg hover:shadow-[#8a1a13]/50 transition-all duration-300"
                            >
                                <span className="relative z-10">Buy Now</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Section Header */}
                        <div className="text-center relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
                            </div>
                            <div className="relative inline-block px-6">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                    <span className="text-white">Featured </span>
                                    <span className="bg-gradient-to-r from-[#8a1a13] to-white bg-clip-text text-transparent">Products</span>
                                </h2>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* See More Button */}
                        <div className="flex justify-center pt-4 sm:pt-6">
                            <button 
                                onClick={() => router.push("/all-products")}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 border border-gray-700 text-gray-400 font-semibold text-sm sm:text-base rounded-xl hover:bg-gray-800 hover:border-[#8a1a13] hover:text-white transition-all duration-300"
                            >
                                View All Products
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            <WhatsAppButton/>
        </>
    )
};

export default Product;