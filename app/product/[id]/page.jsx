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
    const [seoData, setSeoData] = useState(null);
    const [globalSeo, setGlobalSeo] = useState(null);

    // Fetch global SEO settings
    const fetchGlobalSeo = async () => {
        try {
            const res = await axios.get("/api/product-pages-seo");
            if (res.data.success) {
                setGlobalSeo(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching global SEO:", err);
        }
    };

    // Fetch product-specific SEO
    const fetchProductSeo = async (productId) => {
        try {
            const res = await axios.get(`/api/product-seo?productId=${productId}`);
            if (res.data.success && res.data.seo) {
                setSeoData(res.data.seo);
            }
        } catch (err) {
            console.error("Error fetching product SEO:", err);
        }
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await axios.get(`/api/product/${id}`);
            
            if (res.data.success && res.data.data) {
                setProductData(res.data.data);
                setMainImage(res.data.data.image?.[0] || null);
                fetchProductSeo(id);
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
                let currentCategoryId = null;
                if (productData?.category) {
                    if (typeof productData.category === 'object' && productData.category?.$oid) {
                        currentCategoryId = productData.category.$oid;
                    } else if (typeof productData.category === 'object' && productData.category?._id) {
                        currentCategoryId = String(productData.category._id);
                    } else {
                        currentCategoryId = String(productData.category);
                    }
                }

                const related = res.data.data
                    .filter((product) => {
                        if (product._id === id) return false;
                        
                        let productCategoryId = null;
                        if (typeof product.category === 'object' && product.category?.$oid) {
                            productCategoryId = product.category.$oid;
                        } else if (typeof product.category === 'object' && product.category?._id) {
                            productCategoryId = String(product.category._id);
                        } else {
                            productCategoryId = String(product.category);
                        }
                        
                        return productCategoryId === currentCategoryId;
                    })
                    .slice(0, 5);
                    
                setRelatedProducts(related);
            }
        } catch (err) {
            console.error("Error fetching related products:", err);
        }
    }

    // Update document head with SEO metadata
    useEffect(() => {
        if (!productData || !globalSeo) return;

        const displayPrice = productData.offerPrice || productData.price;
        const productImage = productData.image?.[0] || "";

        // Use product-specific SEO if available, otherwise use global SEO
        const title = seoData?.title || globalSeo?.title || 'Gaming Products in Pakistan | 7even86 Game Hub';
        const description = seoData?.description || globalSeo?.description || '';
        const keywords = seoData?.keywords?.join(', ') || globalSeo?.keywords?.join(', ') || '';
        const ogTitle = seoData?.openGraph?.title || title;
        const ogDescription = seoData?.openGraph?.description || description;
        const ogImage = seoData?.openGraph?.image || productImage;
        const brand = seoData?.structuredData?.brand || globalSeo?.structuredData?.defaultBrand || '7even86 Game Hub';
        const condition = seoData?.structuredData?.condition || globalSeo?.structuredData?.defaultCondition || 'new';
        const availability = seoData?.openGraph?.availability || globalSeo?.structuredData?.defaultAvailability || 'in stock';

        // Update page title
        document.title = title;

        // Update or create meta tags
        const updateMetaTag = (property, content, isProperty = false) => {
            if (!content) return;
            
            const attribute = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attribute}="${property}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Basic meta tags
        updateMetaTag('description', description);
        if (keywords) updateMetaTag('keywords', keywords);

        // Open Graph tags
        updateMetaTag('og:type', 'product', true);
        updateMetaTag('og:title', ogTitle, true);
        updateMetaTag('og:description', ogDescription, true);
        if (ogImage) updateMetaTag('og:image', ogImage, true);
        updateMetaTag('og:site_name', globalSeo?.openGraph?.siteName || '7even86 Game Hub', true);
        updateMetaTag('og:url', window.location.href, true);

        // Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', ogTitle);
        updateMetaTag('twitter:description', ogDescription);
        if (ogImage) updateMetaTag('twitter:image', ogImage);

        // Product specific tags
        updateMetaTag('product:price:amount', String(displayPrice), true);
        updateMetaTag('product:price:currency', globalSeo?.structuredData?.defaultCurrency || 'PKR', true);

        // Add structured data
        const structuredData = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": productData.name,
            "image": productImage,
            "description": description || productData.description,
            "brand": {
                "@type": "Brand",
                "name": brand
            },
            "sku": seoData?.structuredData?.sku || productData._id,
            "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": globalSeo?.structuredData?.defaultCurrency || "PKR",
                "price": displayPrice,
                "availability": `https://schema.org/${availability === 'in stock' ? 'InStock' : 'OutOfStock'}`,
                "itemCondition": `https://schema.org/${condition === 'new' ? 'NewCondition' : 'UsedCondition'}`
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": globalSeo?.structuredData?.averageRating || 4.5,
                "reviewCount": globalSeo?.structuredData?.reviewCount || 0
            }
        };

        // Remove existing structured data script
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new structured data script
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);

    }, [productData, globalSeo, seoData]);

    useEffect(() => {
        fetchGlobalSeo();
        if (id) {
            fetchProductData();
        }
    }, [id])

    useEffect(() => {
        if (productData) {
            fetchRelatedProducts();
        }
    }, [productData])

    const getCategoryName = () => {
        if (!productData?.category) return "N/A";
        if (typeof productData.category === 'object') {
            return productData.category.name || "N/A";
        }
        return productData.category;
    };

    if (loading) {
        return <Loading />
    }

    if (error || !productData) {
        return (
            <>
                <TopBar/>
                <Navbar />
                <div className="min-h-screen bg-[#f3f8fd] flex items-center justify-center px-4">
                    <div className="text-center bg-white rounded-2xl border border-[#2563eb]/20 shadow-xl p-8 sm:p-12 max-w-md">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#2563eb] to-[#1e40af] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-[#2563eb]/30">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg sm:text-xl text-gray-800 font-semibold mb-6">{error || "Product not found"}</p>
                        <button
                            onClick={() => router.push("/")}
                            className="relative overflow-hidden px-6 sm:px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2563eb]/40 transition-all duration-300"
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
    const discountPercentage = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

    return (
        <>
            <TopBar />
            <Navbar />
            <div className="bg-[#f3f8fd] min-h-screen px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 pt-6 sm:pt-8 md:pt-12 pb-8">
                
                {/* Breadcrumb */}
                <div className="text-sm text-gray-600 mb-6">
                    <button onClick={() => router.push("/")} className="hover:text-[#2563eb] transition">
                        Home
                    </button>
                    <span className="mx-2">/</span>
                    <span className="text-[#2563eb] font-medium">{productData.name}</span>
                </div>

                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
                    
                    {/* Image Gallery */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl">
                            {discountPercentage > 0 && (
                                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                                    {discountPercentage}% OFF
                                </div>
                            )}
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

                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                {productImages.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setMainImage(image)}
                                        className={`cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-white border-2 transition-all duration-300 hover:scale-105 ${
                                            mainImage === image 
                                                ? "border-[#2563eb] shadow-lg shadow-[#2563eb]/30" 
                                                : "border-gray-200 hover:border-[#2563eb]/50"
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
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            {productData.name}
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4].map((star) => (
                                    <svg key={star} className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span className="text-sm sm:text-base text-gray-600 font-medium">(4.5)</span>
                        </div>

                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {productData.description}
                        </p>

                        <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2563eb]">
                                {currency}{displayPrice}
                            </span>
                            {originalPrice && (
                                <>
                                    <span className="text-base sm:text-lg text-gray-500 line-through">
                                        {currency}{originalPrice}
                                    </span>
                                    <span className="text-sm sm:text-base text-green-600 font-semibold">
                                        Save {currency}{originalPrice - displayPrice}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                            <table className="w-full">
                                <tbody className="space-y-2">
                                    <tr className="border-b border-gray-200">
                                        <td className="text-xs sm:text-sm text-gray-600 font-medium py-2 sm:py-3">Category</td>
                                        <td className="text-xs sm:text-sm text-gray-900 py-2 sm:py-3 text-right font-semibold">
                                            {getCategoryName()}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="text-xs sm:text-sm text-gray-600 font-medium py-2 sm:py-3">Availability</td>
                                        <td className="text-xs sm:text-sm py-2 sm:py-3 text-right">
                                            <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                In Stock
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-xs sm:text-sm text-gray-600 font-medium py-2 sm:py-3">Condition</td>
                                        <td className="text-xs sm:text-sm text-gray-900 py-2 sm:py-3 text-right font-semibold">Brand New</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 pt-4">
                            <button 
                                onClick={() => addToCart(productData._id)} 
                                className="flex-1 py-3 sm:py-4 bg-white text-[#2563eb] font-semibold text-sm sm:text-base rounded-xl border-2 border-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button 
                                onClick={() => { 
                                    addToCart(productData._id); 
                                    router.push('/cart') 
                                }} 
                                className="relative overflow-hidden flex-1 py-3 sm:py-4 bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white font-bold text-sm sm:text-base rounded-xl hover:shadow-lg hover:shadow-[#2563eb]/40 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="relative z-10">Buy Now</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-6 sm:space-y-8">
                        <div className="text-center relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            </div>
                            <div className="relative inline-block px-6 bg-[#f3f8fd]">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                    <span className="text-gray-900">Related </span>
                                    <span className="text-[#2563eb]">Products</span>
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <div className="flex justify-center pt-4 sm:pt-6">
                            <button 
                                onClick={() => router.push("/all-products")}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#2563eb] text-[#2563eb] font-semibold text-sm sm:text-base rounded-xl hover:bg-[#2563eb] hover:text-white transition-all duration-300"
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