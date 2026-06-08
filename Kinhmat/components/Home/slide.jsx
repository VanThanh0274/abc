// slide.jsx
"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

export default function Slide() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 3500,
        cssEase: "cubic-bezier(0.16, 1, 0.3, 1)",
    };

    return (
        <motion.div 
            className="w-full flex justify-center py-6 px-4 bg-luxury-cream dark:bg-[#0c0d0f] transition-colors duration-150 relative overflow-hidden"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-7xl relative">
                <Slider {...settings} className="custom-slider-center">
                    <div className="px-3 outline-none">
                        <div className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 border border-white/5 bg-black/5 hover:shadow-brand-gold/10">
                            <img loading="lazy" 
                                src="/images/img_trans.jpeg" 
                                alt="Slide 1" 
                                className="w-[300px] sm:w-[500px] md:w-[750px] lg:w-[950px] h-[180px] sm:h-[300px] md:h-[400px] lg:h-[480px] object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>
                    <div className="px-3 outline-none">
                        <div className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 border border-white/5 bg-black/5 hover:shadow-brand-gold/10">
                            <img loading="lazy" 
                                src="/images/img_trans1.jpeg" 
                                alt="Slide 2" 
                                className="w-[300px] sm:w-[500px] md:w-[750px] lg:w-[950px] h-[180px] sm:h-[300px] md:h-[400px] lg:h-[480px] object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>
                    <div className="px-3 outline-none">
                        <div className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 border border-white/5 bg-black/5 hover:shadow-brand-gold/10">
                            <img loading="lazy" 
                                src="/images/img_trans2.jpeg" 
                                alt="Slide 3" 
                                className="w-[300px] sm:w-[500px] md:w-[750px] lg:w-[950px] h-[180px] sm:h-[300px] md:h-[400px] lg:h-[480px] object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>
                </Slider>
            </div>
        </motion.div>
    );
}
