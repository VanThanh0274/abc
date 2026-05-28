'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Filterproduct() {
    const router = useRouter();
    const [selectedChatlieu, setSelectedChatlieu] = useState([]);
    const [selectedKieudang, setSelectedKieudang] = useState([]);

    const handleCheckboxChange = (e, setState) => {
        const { checked, value } = e.target;
        setState(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const handleFilter = () => {
        const chatlieuStr = selectedChatlieu.join(',');
        const kieudangStr = selectedKieudang.join(',');
        router.push(`/listproduct?chatlieu=${encodeURIComponent(chatlieuStr)}&kieudang=${encodeURIComponent(kieudangStr)}`);
    };

    return (
        <div className="w-full bg-white border border-gray-150 rounded-2xl p-6 shadow-md space-y-6">
            
            {/* Filter Section Header */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Filter className="text-brand-gold text-lg" />
                <h3 className="text-sm font-bold font-heading text-gray-900 uppercase tracking-wider">
                    Bộ lọc sản phẩm
                </h3>
            </div>

            {/* Shape Filter (Kiểu dáng) */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="text-[10px]" /> Kiểu dáng
                </h4>
                <ul className="space-y-2 text-xs font-medium text-gray-600 pl-1">
                    {["Chữ nhật", "Lục giác", "Mắt mèo", "Tròn", "Vuông"].map(shape => (
                        <li key={shape} className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                value={shape}
                                id={`shape-${shape}`}
                                onChange={e => handleCheckboxChange(e, setSelectedKieudang)}
                                className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer accent-brand-gold"
                            />
                            <label htmlFor={`shape-${shape}`} className="cursor-pointer hover:text-gray-900 transition duration-150">
                                {shape}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Material Filter (Chất liệu) */}
            <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="text-[10px]" /> Chất liệu
                </h4>
                <ul className="space-y-2 text-xs font-medium text-gray-600 pl-1">
                    {["Kính", "Kim loại", "Nhựa", "Titan"].map(material => (
                        <li key={material} className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                value={material}
                                id={`material-${material}`}
                                onChange={e => handleCheckboxChange(e, setSelectedChatlieu)}
                                className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer accent-brand-gold"
                            />
                            <label htmlFor={`material-${material}`} className="cursor-pointer hover:text-gray-900 transition duration-150">
                                {material}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Apply Filter Button */}
            <motion.button 
                onClick={handleFilter}
                className="w-full py-3 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-lg shadow-brand-gold/15 flex items-center justify-center gap-2 mt-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
            >
                <span>ÁP DỤNG LỌC</span>
            </motion.button>

        </div>
    );
}
