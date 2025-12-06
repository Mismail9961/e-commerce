// components/HeaderSlider.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "@/assets/assets";

const HeaderSlider = () => {
  const sliderData = [
    { id: 1, imgSrc: assets.HeadBanner, title: "Banner 1" },
    { id: 2, imgSrc: assets.HeadBanner1, title: "Banner 2" },
    { id: 3, imgSrc: assets.HeadBanner2, title: "Banner 3" },
    { id: 4, imgSrc: assets.HeadBanner1, title: "Banner 4" },
    { id: 5, imgSrc: assets.HeadBanner, title: "Banner 5" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const paginate = useCallback(
    (newDirection) => {
      setDirection(newDirection);
      setCurrentSlide((prev) => {
        let next = prev + newDirection;
        if (next < 0) next = sliderData.length - 1;
        if (next >= sliderData.length) next = 0;
        return next;
      });
    },
    [sliderData.length]
  );

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, paginate]);

  const cardVariants = {
    enter: () => ({
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
    }),
    center: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 1, 
        ease: [0.22, 1, 0.36, 1]
      },
    },
    exit: () => ({
      opacity: 0,
      scale: 1.05,
      filter: "blur(10px)",
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      },
    }),
  };

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={sliderData[currentSlide].id}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="relative w-full"
        >
          <div className="relative w-full h-[200px] min-[375px]:h-[240px] xxs:h-[280px] xs:h-[340px] sm:h-[450px] md:h-[520px] lg:h-[620px] xl:h-[720px]">
            <Image
              src={sliderData[currentSlide].imgSrc}
              alt={sliderData[currentSlide].title}
              fill
              priority
              quality={100}
              className="object-cover object-center"
              sizes="100vw"
            />

            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#9d0208]/20 via-transparent to-black/40"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() => {
          paginate(-1);
          setIsAutoPlaying(false);
        }}
        className="absolute left-2 min-[375px]:left-3 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 
        w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14
        flex items-center justify-center
        bg-black/40 backdrop-blur-md
        border border-white/10
        hover:bg-[#9d0208] hover:border-[#9d0208]
        transition-all duration-300 ease-out
        group"
      >
        <svg 
          className="w-4 h-4 min-[375px]:w-4.5 min-[375px]:h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => {
          paginate(1);
          setIsAutoPlaying(false);
        }}
        className="absolute right-2 min-[375px]:right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 
        w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14
        flex items-center justify-center
        bg-black/40 backdrop-blur-md
        border border-white/10
        hover:bg-[#9d0208] hover:border-[#9d0208]
        transition-all duration-300 ease-out
        group"
      >
        <svg 
          className="w-4 h-4 min-[375px]:w-4.5 min-[375px]:h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 min-[375px]:bottom-5 sm:bottom-6 lg:bottom-8 w-full flex justify-center items-center gap-1.5 min-[375px]:gap-2 sm:gap-2.5 z-30">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className="group relative"
          >
            <div className={`transition-all duration-500 ease-out
              ${currentSlide === index ? 
                "w-6 min-[375px]:w-8 sm:w-10 h-1 min-[375px]:h-1.5 bg-[#9d0208]" : 
                "w-1 min-[375px]:w-1.5 h-1 min-[375px]:h-1.5 bg-white/40 group-hover:bg-white/70 group-hover:scale-125"
              }`}
            />
            {currentSlide === index && (
              <div className="absolute inset-0 bg-[#9d0208]/50 blur-sm sm:blur-md"></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeaderSlider;