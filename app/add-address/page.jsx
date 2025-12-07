"use client"
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddAddress = () => {

  const router = useRouter();

  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    pincode: '',
    area: '',
    city: '',
    state: '',
    isDefault: false
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { data } = await axios.post("/api/add-address", address, { withCredentials: true });

      if (data.success) {
        toast.success("Address added successfully!");
        router.push("/cart");
      } else {
        toast.error(data.error || "Failed to add address");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while adding address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#003049] px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Form Section */}
          <div className="w-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Add Shipping <span className="text-[#8a1a13]">Address</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                Enter your delivery details below
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmitHandler} className="space-y-4 sm:space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-2">
                  Full Name
                </label>
                <input
                  className="px-3 sm:px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg outline-none w-full text-white placeholder-gray-600 focus:border-[#8a1a13] transition-colors"
                  type="text"
                  placeholder="Enter your full name"
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  value={address.fullName}
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-2">
                  Phone Number
                </label>
                <input
                  className="px-3 sm:px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg outline-none w-full text-white placeholder-gray-600 focus:border-[#8a1a13] transition-colors"
                  type="text"
                  placeholder="Enter your phone number"
                  onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                  value={address.phoneNumber}
                  required
                />
              </div>

              {/* Pin Code */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-2">
                  Pin Code
                </label>
                <input
                  className="px-3 sm:px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg outline-none w-full text-white placeholder-gray-600 focus:border-[#8a1a13] transition-colors"
                  type="text"
                  placeholder="Enter pin code"
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  value={address.pincode}
                  required
                />
              </div>

              {/* Address Area */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-2">
                  Address (Area and Street)
                </label>
                <textarea
                  className="px-3 sm:px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg outline-none w-full text-white placeholder-gray-600 focus:border-[#8a1a13] transition-colors resize-none"
                  rows={4}
                  placeholder="House no., building name, area, street"
                  onChange={(e) => setAddress({ ...address, area: e.target.value })}
                  value={address.area}
                  required
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-500 mb-2">
                    City/District/Town
                  </label>
                  <input
                    className="px-3 sm:px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg outline-none w-full text-white placeholder-gray-600 focus:border-[#8a1a13] transition-colors"
                    type="text"
                    placeholder="City"
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    value={address.city}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-500 mb-2">
                    State
                  </label>
                  <input
                    className="px-3 sm:px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg outline-none w-full text-white placeholder-gray-600 focus:border-[#8a1a13] transition-colors"
                    type="text"
                    placeholder="State"
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    value={address.state}
                    required
                  />
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="default-address"
                  checked={address.isDefault}
                  onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })}
                  className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-900 border-gray-800 rounded cursor-pointer accent-[#8a1a13]"
                />
                <label htmlFor="default-address" className="text-xs sm:text-sm text-gray-400 cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 sm:mt-8 py-3 sm:py-4 bg-gradient-to-r from-[#8a1a13] to-black text-white font-bold text-sm sm:text-base rounded-lg hover:shadow-lg hover:shadow-[#8a1a13]/50 transition-all duration-300 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving Address..." : "Save Address"}
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#8a1a13]/10 blur-3xl rounded-full"></div>
              <Image
                className="relative z-10"
                src={assets.my_location_image}
                alt="location"
                width={500}
                height={500}
              />
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;