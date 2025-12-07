// app/about/page.js (Next.js 13+ App Router)

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

export const metadata = {
  title: "About Us | 7even86gamehub",
  description:
    "Learn more about 7even86gamehub, our mission, vision, and the values that drive us to provide the best gaming experience in Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      <TopBar/>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#9d020820_0%,_transparent_50%)]"></div>
        <div className="max-w-5xl mx-auto px-4 min-[375px]:px-6 sm:px-8 lg:px-12 py-12 min-[375px]:py-16 sm:py-20 md:py-24 text-center relative z-10">
          <h1 className="text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            About <span className="text-[#9d0208]">7even86gamehub</span>
          </h1>
          <p className="text-sm min-[375px]:text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Welcome to <span className="font-semibold text-white">7even86gamehub</span> — a
            next-generation gaming e-commerce destination built for the modern gamer.
            We combine cutting-edge technology with a passion for gaming excellence
            to deliver a seamless, secure, and thrilling online shopping experience.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 min-[375px]:px-6 sm:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-[375px]:gap-6 sm:gap-8">
          {/* Mission */}
          <div className="bg-white/5 border border-white/10 p-5 min-[375px]:p-6 sm:p-8 group hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#9d0208] group-hover:bg-[#7a0106] transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl min-[375px]:text-2xl sm:text-3xl font-bold text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-xs min-[375px]:text-sm sm:text-base text-gray-400 leading-relaxed">
              At 7even86gamehub, our mission is simple: to make gaming gear accessible
              and affordable for every gamer. From high-performance components and
              gaming peripherals to the latest releases, we bring quality products
              to your doorstep with speed, security, and convenience.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white/5 border border-white/10 p-5 min-[375px]:p-6 sm:p-8 group hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#9d0208] group-hover:bg-[#7a0106] transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-xl min-[375px]:text-2xl sm:text-3xl font-bold text-white">
                Our Vision
              </h2>
            </div>
            <p className="text-xs min-[375px]:text-sm sm:text-base text-gray-400 leading-relaxed">
              We envision a digital marketplace where innovation meets trust.
              7even86gamehub is more than a store — it's a community of gamers who
              value authenticity, performance, and an exceptional gaming experience.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-8 sm:mt-12 md:mt-16 bg-white/5 border border-white/10 p-5 min-[375px]:p-6 sm:p-8">
          <h2 className="text-xl min-[375px]:text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
            <div className="w-1 h-8 sm:h-10 bg-[#9d0208]"></div>
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#9d0208] group-hover:border-[#9d0208] transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm min-[375px]:text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Gamer First
                </h3>
                <p className="text-xs min-[375px]:text-sm text-gray-400">
                  Every decision we make starts with you, the gamer.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#9d0208] group-hover:border-[#9d0208] transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm min-[375px]:text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Quality & Performance
                </h3>
                <p className="text-xs min-[375px]:text-sm text-gray-400">
                  Only the best, most reliable gaming products make it to our store.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#9d0208] group-hover:border-[#9d0208] transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm min-[375px]:text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Innovation
                </h3>
                <p className="text-xs min-[375px]:text-sm text-gray-400">
                  Harnessing the latest tech to enhance your gaming journey.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-[#9d0208] group-hover:border-[#9d0208] transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm min-[375px]:text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Community
                </h3>
                <p className="text-xs min-[375px]:text-sm text-gray-400">
                  Building a trusted community of passionate gamers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 md:mt-20 relative overflow-hidden">
          <div className="absolute inset-0 "></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
          <div className="relative z-10 text-center p-6 min-[375px]:p-8 sm:p-10 md:p-12">
            <h2 className="text-2xl min-[375px]:text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Join the 7even86gamehub Experience
            </h2>
            <p className="text-xs min-[375px]:text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              From your first click to the final checkout, 7even86gamehub is here to
              make gaming gear shopping smarter, faster, and better. Explore our collections
              today and discover why thousands of gamers trust us.
            </p>
            <a
              href="/all-products"
              className="inline-flex items-center gap-2 bg-white text-[#9d0208] px-6 min-[375px]:px-8 py-3 min-[375px]:py-3.5 font-semibold text-sm min-[375px]:text-base hover:bg-gray-100 transition-all duration-300 hover:gap-3 group"
            >
              Start Shopping
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}