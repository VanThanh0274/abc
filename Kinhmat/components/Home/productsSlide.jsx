"use client";

import { useEffect, useState } from "react";
import { getProductgioithieu } from "../../services/product";
import Slider from "react-slick";
import Image from "next/image";
import { imgURLlocal } from "../../assets/localhostimg";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ProductSlide({ gioithieu }) {
    const [list, setlist] = useState([]);
    const router = useRouter();

    const Load = async () => {
        try {
            const data = await getProductgioithieu(gioithieu);
            if (data) setlist(data);
        } catch (e) {
            console.error("Lỗi tải sản phẩm giới thiệu:", e);
        }
    };

    const settings = {
        dots: true,
        infinite: list.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    infinite: list.length > 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    infinite: list.length > 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    infinite: list.length > 1
                }
            }
        ]
    };

    useEffect(() => {
        Load();
    }, []);

    return (
        <div className="w-full py-12 bg-luxury-cream dark:bg-[#0c0d0f] transition-colors duration-150">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Heading */}
                <div className="text-center mb-8 space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-brand-gold uppercase">
                        <Sparkles className="text-xs" /> Featured Items
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 dark:text-white tracking-wide">
                        {gioithieu}
                    </h2>
                    <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-2"></div>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    <Slider {...settings} className="custom-slider-center" id="slidekinhs">
                        {list.map((products) => (
                            <div key={products.id} className="p-3 outline-none">
                                <motion.div 
                                    className="flex flex-col rounded-2xl bg-white dark:bg-black/20 border border-gray-150 dark:border-white/5 shadow-md overflow-hidden p-4 group cursor-pointer w-full max-w-[260px] mx-auto h-[350px] relative justify-between"
                                    onClick={() => router.push(`/products?id=${products.id}`)}
                                    whileHover={{ y: -4, shadow: "0 10px 15px -3px rgba(197,168,128,0.06)" }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {/* Image Wrapper */}
                                    <div className="h-44 w-full bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center rounded-xl overflow-hidden relative border border-gray-100/50 dark:border-white/5">
                                        <img 
                                            src={`${imgURLlocal()}${products.anh}`} 
                                            alt={products.ten} 
                                            className="h-32 w-auto object-contain transform group-hover:scale-105 transition-transform duration-500 p-2" 
                                        />
                                        <div className="absolute top-2 right-2 bg-brand-gold/10 text-brand-gold text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-brand-gold/20">
                                            Authentic
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1.5 pt-2 flex-grow flex flex-col justify-end">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm text-center truncate group-hover:text-brand-gold transition duration-150 leading-snug">
                                            {products.ten}
                                        </h3>
                                        <div className="text-center">
                                            <span className="font-bold text-sm text-brand-gold tracking-wide">
                                                {products.giaban.toLocaleString("vi-VN")} đ
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Small visual accent at bottom */}
                                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                </motion.div>
                            </div>
                        ))}
                    </Slider>
                </div>

            </div>
        </div>
    );
}