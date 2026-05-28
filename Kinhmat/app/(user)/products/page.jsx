"use client"
import React, { Suspense } from "react";
import ProductTop from "../../../components/products/product_top";
import "../../../components/products/style.css"

export default function Products() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[300px] text-gray-500 font-sans">Đang tải chi tiết sản phẩm...</div>}>
            <ProductTop/>
        </Suspense>
    )
}