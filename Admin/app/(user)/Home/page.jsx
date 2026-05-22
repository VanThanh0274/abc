'use client';
import { useEffect } from 'react';
import { getAllCategory } from '../../../services/category.js';
import Slide from '../../../components/Home/slide.jsx'
import Quantityproduct from '../../../components/Home/quantityproduct.jsx'
import '../../../assets/style.css';
import Homecenter from '../../../components/Home/homecenter.jsx';
import ProductSlide from '../../../components/Home/productsSlide.jsx';

export default function EmployeePage() {

    useEffect(() => {
      document.title="Trang chủ"
  }, []);

  return (
    <div>
      <div></div>
      <Slide/>
      <Quantityproduct/>
      <Homecenter/>
      <ProductSlide gioithieu={"Sản phẩm mới"}/>
      <ProductSlide gioithieu={"Kính chính hãng"}/>
    </div>
  );
}