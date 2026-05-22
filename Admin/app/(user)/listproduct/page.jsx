
'use client';
import './style.css'
import '../../../assets/style.css'
import Filterproduct from '../../../components/Listproduct/filterproduct';
import Listproduct from '../../../components/Listproduct/listproduct';
import Link from 'next/link';
export default function Product() {
    return (
        <div>
            <div className="main-category">
                <div className="main-category-left">
                    <Link href="/Home">Trang chủ</Link>
                    <span> / </span>
                    Sản phẩm
                </div>
                <div className="main-category-right">
                    <span>Showing 1–30 of 554 results</span>
                    <select name="" id="">
                        <option value="#">Thứ tự mặc định</option>
                    </select>
                </div>
            </div>

            <div className="app">
                <Filterproduct/>
                <Listproduct/>
            </div>
        </div>
    )
}