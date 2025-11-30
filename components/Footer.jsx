import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.mainlogo} alt="logo" />
          <p className="mt-6 text-sm">
            Welcome to 7even86GameHub – Your Ultimate Gaming Destination
            At 7even86GameHub, we're passionate about elevating your gaming experience to the next level. Whether you're a competitive esports athlete, a casual weekend warrior, or building your dream gaming rig, we've got you covered with premium gaming components and accessories. From high-performance graphics cards and lightning-fast processors to precision gaming mice, mechanical keyboards, and immersive headsets – we stock only the best brands and latest technology.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/about-us">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/contact-us">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>contact@7even86gamehub.pk</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © 7even86gamehub.pk All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;