'use client';

import React, { Suspense } from 'react';
import Filterproduct from '../../../components/Listproduct/filterproduct';
import Listproduct from '../../../components/Listproduct/listproduct';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Product() {
    return (
        <div className="min-h-screen bg-luxury-cream transition-colors duration-150 py-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header and Breadcrumb */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                            <Sparkles className="text-[11px]" /> Discover Luxury Eyewear
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Link href="/Home" className="hover:text-brand-gold transition duration-150">Trang chủ</Link>
                            <span>/</span>
                            <span className="text-gray-800">Sản phẩm</span>
                        </div>
                    </div>
                </div>

                {/* Main Catalogue Layout (Side-by-side) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Sidebar Filter (3 Columns) */}
                    <div className="lg:col-span-3">
                        <Filterproduct />
                    </div>
                    
                    {/* Right Catalogue Grid (9 Columns) */}
                    <div className="lg:col-span-9">
                        <Suspense fallback={
                            <div className="flex flex-col items-center justify-center py-24 text-gray-500 font-sans space-y-4">
                                <span className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Đang tải danh sách kính...</span>
                            </div>
                        }>
                            <Listproduct />
                        </Suspense>
                    </div>

                </div>

            </div>
        </div>
    );
}
