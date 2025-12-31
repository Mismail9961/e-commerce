// app/about/page.js (Next.js 13+ App Router)

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "About Us | 7even86gamehub",
  description:
    "Learn more about 7even86gamehub, our mission, vision, and the values that drive us to provide the best gaming experience in Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#f3f8fd] min-h-screen">
      <TopBar />
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.15)_0%,_transparent_60%)]"></div>

        <div className="max-w-5xl mx-auto px-4 min-[320px]:px-5 sm:px-8 lg:px-12 py-10 min-[320px]:py-12 sm:py-16 md:py-20 text-center relative z-10">
          <h1 className="text-2xl min-[320px]:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-[#2563eb]">7even86gamehub</span>
          </h1>

          <p className="text-xs min-[320px]:text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Welcome to <span className="font-semibold text-gray-900">7even86gamehub</span> —
            a next-generation gaming e-commerce destination built for the modern gamer.
            We combine technology and passion to deliver a seamless, secure, and reliable
            online shopping experience.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto px-4 min-[320px]:px-5 sm:px-8 lg:px-12 py-10 sm:py-14 md:py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">

          {/* Mission */}
          <div className="bg-white border border-black/10 p-5 sm:p-8 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2563eb]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>

            <p className="text-xs min-[320px]:text-sm sm:text-base text-gray-600 leading-relaxed">
              Our mission is to make gaming gear accessible and affordable for every gamer.
              From components to peripherals, we deliver quality products with speed and trust.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white border border-black/10 p-5 sm:p-8 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2563eb]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>

            <p className="text-xs min-[320px]:text-sm sm:text-base text-gray-600 leading-relaxed">
              We envision a trusted digital marketplace where innovation meets gaming culture,
              powered by performance, transparency, and community.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-12 bg-white border border-black/10 p-5 sm:p-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-[#2563eb]"></div>
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Gamer First", "Quality & Performance", "Innovation", "Community"].map((value, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-[#2563eb]/10">
                  <svg className="w-5 h-5 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">{value}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    We uphold this value in everything we do.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
            Join the 7even86gamehub Experience
          </h2>

          <p className="text-xs sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            From browsing to checkout — we make gaming shopping smarter, faster, and more reliable.
          </p>

          <a
            href="/all-products"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-6 py-3 text-sm sm:text-base font-semibold hover:bg-blue-700 transition-all"
          >
            Start Shopping
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
