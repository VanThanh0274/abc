'use client'
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import "./style.css"
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllCategory } from '../../services/category';
import { useRouter } from 'next/navigation';
config.autoAddCss = false;
import {
  faMagnifyingGlass,
  faCartShopping,
  faUser,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Header() {
  const [category, setCategory] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [totalcart, settotalcart] = useState(0);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const router = useRouter();
  const abc = () => {
    const token = localStorage.getItem('token');
    if (token == null) {
      router.push("/login")

    }
    else {
      setShowUserMenu((prev) => !prev);
    }
  }


  const updateCartTotal = () => {
    const listcard = JSON.parse(localStorage.getItem('sanphams')) || [];
    settotalcart(listcard.length);
  };
  useEffect(() => {

    updateCartTotal();


    const fetchData = async () => {
      const data = await getAllCategory();
      setCategory(data);
      console.log(data);
    }
    fetchData();
    
    window.addEventListener('localStorageUpdated', updateCartTotal);

    // 3. Cleanup: Xóa Event Listener khi component unmount
    return () => {
      window.removeEventListener('localStorageUpdated', updateCartTotal);
    };
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
      // Chuyển trang tới /listproduct với query tìm kiếm
      router.push(`/listproduct?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSearchInput(false); // ẩn input sau khi chuyển trang
    }
  }

  return (
    <div>
      <div className="menu">
        <div className="menu-row1">
          <div className="menu-left">
            <Image
              src="/images/logo3.png"
              alt="Logo"
              width={100}
              height={50}
            />
          </div>

          <div className="menu-right" style={{ position: 'relative' }}>
            {/* Icon kính lúp */}
            <div
              onMouseEnter={() => setShowSearchInput(true)}
              onMouseLeave={() => setShowSearchInput(false)}
              style={{ display: 'inline-block', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>

            {/* Input hiện ra khi hover */}
            {showSearchInput && (
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setShowSearchInput(true)} // Giữ input khi rê chuột vào
                onMouseLeave={() => setShowSearchInput(false)} // Ẩn khi ra ngoài
                placeholder="Tìm kiếm..."
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: 0,
                  width: '200px',
                  padding: '5px 10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  outline: 'none',
                  zIndex: 100,
                }}
                autoFocus
              />
            )}

            <span className="icon-giohang" >
              <Link href="/cart">
                <FontAwesomeIcon icon={faCartShopping} />
              </Link>
              <span className='totalcart'>{totalcart}</span>
            </span>

            <div style={{ display: 'inline-block', position: 'relative' }} ref={userMenuRef}>
              <FontAwesomeIcon
                icon={faUser}
                onClick={() => abc()}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              />
              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '30px',
                    right: 0,
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 200,
                    width: '160px',
                  }}

                >
                  <Link href="/profile">
                    <div style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                      Tài khoản của tôi
                    </div>
                  </Link>
                  <div
                    onClick={() => {
                      router.push('orderhistory')
                    }}
                    style={{ padding: '10px', cursor: 'pointer' }}
                  >
                    Lịch sử mua hàng
                  </div>
                  <div
                    onClick={() => {
                      localStorage.removeItem('token');
                      router.push('/login')

                    }}
                    style={{ padding: '10px', cursor: 'pointer' }}
                  >
                    Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* phần menu-row2 vẫn giữ nguyên */}
      <div className="menu-row2">
        <ul className="menu_ul">
          <li id="idkinhram"><Link href="/Home">Trang chủ</Link></li>
          <li id="idgongkinh">
            <Link href="#">Danh mục <FontAwesomeIcon icon={faAngleDown} /></Link>
            <ul className="menucon">
              {category.map((dm) => (
                <li key={dm.ma}>
                  <Link href={`/listproduct?id=${dm.ma}`}>{dm.tendanhmuc}</Link>
                </li>
              ))}
            </ul>
          </li>
          <li id="idtrongkinh"><Link href="/sale">Ưu đãi</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="#">Vip Member</Link></li>
          <li><Link href="/introduce">Giới thiệu</Link></li>
        </ul>
        <a href="#"><i className="fa-brands fa-facebook"></i></a>
        <a href="#"><i className="fa-brands fa-square-instagram"></i></a>
        <a href="#"><i className="fa-brands fa-youtube"></i></a>
      </div>
    </div>
  );
}
