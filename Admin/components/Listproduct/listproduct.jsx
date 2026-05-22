import './style.css'
import { useSearchParams, useRouter } from 'next/navigation';
import { filterProduct, getListProductCategory, searchProduct } from '../../services/product';
import { useState, useEffect } from 'react';
import { getAllCategory } from '../../services/category';
import { getCategoryContent } from './getCategoryContent';
import ReactPaginate from 'react-paginate';
import '../../assets/style.css'

export default function Listproduct() {

  const [categories, setCategories] = useState([]);
  const [product, setproduct] = useState([]);
  const [tranghientai, settranghientai] = useState(0);
  const [tongtrang, settongtrang] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const tk = searchParams.get('search');
  const chatlieu = searchParams.get('chatlieu');
  const kieudang = searchParams.get('kieudang');

  const handlePageClick = (event) => {
    settranghientai(event.selected);
  };

  // ===== FETCH CATEGORY =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategory();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // ===== FETCH PRODUCT =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const data = await getListProductCategory(id, tranghientai + 1, 6);
          setproduct(data.data);
          settongtrang(data.total);
          return;
        }

        if (tk) {
          const dataSearch = await searchProduct(tk);
          setproduct(dataSearch.data);
          return;
        }

        if (chatlieu || kieudang) {
          const dataFilter = await filterProduct(chatlieu || '', kieudang || '');
          setproduct(dataFilter);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [id, tk, chatlieu, kieudang, tranghientai]);

  return (
    <div>
      <div className="app-right">

        {/* ===== GIỚI THIỆU THEO DANH MỤC ===== */}
        {getCategoryContent(id, categories)}

        <p
          style={{
            textAlign: 'center',
            color: '#4872FA',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          className="btnxemthem"
        >
          Xem thêm
        </p>

        <div className="list-product">
          {product.map((sp) => (
            <div
              key={sp.id}
              className="product20"
              style={{ float: 'left' }}
              onClick={() => router.push(`/products?id=${sp.id}`)}
            >
              <img
                src={`http://localhost:5273/images/product/${sp.anh}`}
                alt="Không có"
                style={{ width: '100%', height: '255px', objectFit: 'cover' }}
              />
              <span><p>SALE!</p></span>

              <p style={{ textAlign: 'center', margin: '15px 3px' }}>
                {sp.ten}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ color: 'rgb(249, 98, 5)', marginLeft: '3px' }}>
                  {sp.giaban.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="page-sanpham">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={tongtrang}
            previousLabel="<"
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="active"
            forcePage={tranghientai}
          />
        </div>

      </div>
    </div>
  );
}
