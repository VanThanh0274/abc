"use client"
import React, { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import ProductTop from "../../../components/products/product_top";
import ProductReviews from "../../../components/products/ProductReviews";
import ProductRelated from "../../../components/products/ProductRelated";
import "../../../components/products/style.css"

function ProductContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    return (
        <>
            <ProductTop />
            {id && <ProductReviews productId={id} />}
            {id && <ProductRelated productId={id} />}
        </>
    );
}

export default function Products() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[300px] text-gray-500 font-sans">Đang tải chi tiết sản phẩm...</div>}>
            <ProductContent />
        </Suspense>
    )
}
