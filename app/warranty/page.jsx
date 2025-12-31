"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import TopBar from '@/components/TopBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Shield, Package, Clock, CheckCircle, XCircle, AlertCircle, FileText, Phone } from 'lucide-react';

export default function WarrantyPage() {
  const eligibleItems = [
    "Defective or damaged products upon delivery",
    "Wrong items shipped",
    "Products not matching description or photos",
    "Manufacturing defects discovered within 7 days",
    "Sealed fashion items with factory defects"
  ];

  const nonEligibleItems = [
    "Products with removed tags or damaged seals",
    "Used, worn, or altered items",
    "Products with physical damage caused by customer",
    "Items without original packaging, tags, and accessories",
    "Clearance, final sale, or promotional items",
    "Personalized or custom-made products"
  ];

  const exchangeProcess = [
    {
      step: "1",
      title: "Contact Us",
      description: "Reach out within 7 days of delivery via WhatsApp, email, or phone with your order details, photos, and issue description."
    },
    {
      step: "2",
      title: "Verification",
      description: "Our team will review your claim and may request additional photos or videos of the item."
    },
    {
      step: "3",
      title: "Return Approval",
      description: "Once approved, you'll receive return instructions and a return authorization number."
    },
    {
      step: "4",
      title: "Ship Back",
      description: "Pack the product securely in original packaging with all tags and accessories, then ship it back."
    },
    {
      step: "5",
      title: "Inspection",
      description: "We'll inspect the returned item within 2-3 business days to confirm eligibility."
    },
    {
      step: "6",
      title: "Exchange/Refund",
      description: "After approval, we'll ship your replacement or process your refund within 5-7 business days."
    }
  ];

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="min-h-screen bg-[#f3f8fd]">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] py-8 sm:py-12 lg:py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full mb-3 sm:mb-4 lg:mb-6">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 px-2">
              7 Days Exchange Policy
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-3xl mx-auto px-2">
              Your satisfaction matters. Shop with confidence — exchange eligible items within 7 days.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-10 lg:mb-16">
            <div className="bg-white border border-black/10 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center shadow-sm">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#2563eb] mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">7 Days</h3>
              <p className="text-xs sm:text-sm text-gray-600">From delivery date to initiate exchange</p>
            </div>
            
            <div className="bg-white border border-black/10 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center shadow-sm">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#2563eb] mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Original Condition</h3>
              <p className="text-xs sm:text-sm text-gray-600">With tags, packaging & accessories</p>
            </div>
            
            <div className="bg-white border border-black/10 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center shadow-sm">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#2563eb] mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Full Protection</h3>
              <p className="text-xs sm:text-sm text-gray-600">Against defects & mismatches</p>
            </div>
          </div>

          {/* Visual Gallery + Eligible vs Non-Eligible */}
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-6">
              Our Premium Collection – Protected with Confidence
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">

<grok-card data-id="c5ea37" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="5881cb" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="51b126" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="1a0c51" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="af6117" data-type="image_card"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="9efc73" data-type="image_card"  data-arg-size="LARGE" ></grok-card>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-10 lg:mb-16">
            {/* Eligible Items */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900">Eligible for Exchange</h2>
              </div>
              <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Eligible Items */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900">Not Eligible</h2>
              </div>
              <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exchange Process */}
          <div className="mb-6 sm:mb-10 lg:mb-16">
            <div className="text-center mb-5 sm:mb-7 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 px-2">
                How to Exchange Your Item
              </h2>
              <p className="text-xs sm:text-sm lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Simple steps to get your exchange processed smoothly
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {exchangeProcess.map((process, index) => (
                <div key={index} className="bg-white border border-black/10 rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-6 relative shadow-sm">
                  <div className="absolute -top-2 sm:-top-3 lg:-top-4 -left-2 sm:-left-3 lg:-left-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-md">
                    {process.step}
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 lg:mb-3 mt-1.5 sm:mt-2 lg:mt-3">
                    {process.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Terms */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-8 mb-6 sm:mb-10 lg:mb-12">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-amber-600 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900">Important Terms</h2>
            </div>
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4 text-xs sm:text-sm lg:text-base text-gray-700">
              <p className="leading-relaxed">
                <strong className="text-gray-900">7-Day Period:</strong> Starts from delivery date. Inspect your items immediately.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">Original Condition:</strong> Must include all tags, packaging, accessories & free gifts (if any).
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">Proof of Purchase:</strong> Valid order confirmation or invoice required.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">Shipping Costs:</strong> We cover return shipping for defects; customer covers for change of mind.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">Replacement:</strong> If item unavailable, we offer similar alternative or full refund.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white border border-black/10 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-10 text-center shadow-sm">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-[#2563eb] mx-auto mb-3 sm:mb-4 lg:mb-6" />
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 px-2">
              Need Help with an Exchange?
            </h2>
            <p className="text-xs sm:text-sm lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto px-2">
              Our support team is ready to assist with any questions about your exchange.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2">
              <a
                href="https://wa.me/923001234567" // ← Update number if needed
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-blue-500/30 text-xs sm:text-sm lg:text-base"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                WhatsApp Support
              </a>
              
              <a
                href="mailto:support@sachchu.pk" // ← Updated email
                className="flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm lg:text-base"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                Email Us
              </a>
            </div>

            <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200">
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 px-2">
                Business Hours: Monday - Saturday, 10:00 AM - 8:00 PM (PKT)
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 sm:mt-10 lg:mt-12 text-center px-2">
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed">
              Sachchu reserves the right to modify this exchange policy at any time. 
              Please check this page regularly for updates. Last updated: December 2025
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}