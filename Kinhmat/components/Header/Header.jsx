'use client'
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllCategory } from '../../services/category';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleUserClick = () => {
    const token = localStorage.getItem('token');
    if (token == null) {
      router.push("/login");
    } else {
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
      try {
        const data = await getAllCategory();
        setCategory(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    }
    fetchData();
    
    window.addEventListener('localStorageUpdated', updateCartTotal);
    return () => {
      window.removeEventListener('localStorageUpdated', updateCartTotal);
    };
  }, []);

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
      router.push(`/listproduct?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSearchInput(false);
    }
  }

  return (
    <header className="sticky top-0 z-[1000] w-full glass-effect shadow-sm transition-all duration-300">
      {/* Top Bar: Logo & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/Home" className="flex items-center hover:opacity-90 transition">
          <Image
            src="/images/logo3.png"
            alt="Kính Mắt Luxury Logo"
            width={160}
            height={60}
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center space-x-6 text-gray-800 dark:text-gray-100">
          
          {/* Search Icon & Input */}
          <div 
            className="relative flex items-center h-9"
            onMouseEnter={() => setShowSearchInput(true)}
            onMouseLeave={() => setShowSearchInput(false)}
          >
            <div className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full cursor-pointer transition flex items-center justify-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg text-gray-700 dark:text-gray-300" />
            </div>

            <AnimatePresence>
              {showSearchInput && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm kiếm kính mắt..."
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-1.5 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold z-50 text-gray-800 dark:text-gray-100"
                  autoFocus
                />
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full cursor-pointer transition flex items-center justify-center">
            <FontAwesomeIcon icon={faCartShopping} className="text-lg text-gray-700 dark:text-gray-300" />
            {totalcart > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse-slow">
                {totalcart}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={handleUserClick}
              className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full cursor-pointer transition flex items-center justify-center outline-none"
            >
              <FontAwesomeIcon icon={faUser} className="text-lg text-gray-700 dark:text-gray-300" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-[200] w-52 overflow-hidden py-1.5"
                >
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-medium"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <div
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('orderhistory');
                    }}
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer font-medium border-b border-gray-50 dark:border-gray-700"
                  >
                    Lịch sử mua hàng
                  </div>
                  <div
                    onClick={() => {
                      setShowUserMenu(false);
                      localStorage.removeItem('token');
                      router.push('/login');
                    }}
                    className="block px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer font-semibold"
                  >
                    Đăng xuất
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Navigation Sub-Menu Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800/80 bg-gray-55/90 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center relative">
          <ul className="flex items-center space-x-1 sm:space-x-4 md:space-x-8 py-1.5 md:py-2.5">
            <li className="relative group">
              <Link 
                href="/Home" 
                className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold px-3 py-2 rounded-lg transition"
              >
                Trang chủ
              </Link>
            </li>

            <li className="relative group">
              <Link 
                href="#" 
                className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold px-3 py-2 rounded-lg transition inline-flex items-center space-x-1"
              >
                <span>Danh mục</span>
                <FontAwesomeIcon icon={faAngleDown} className="text-xs ml-0.5 group-hover:rotate-180 transition-transform duration-300" />
              </Link>

              {/* Sub-menu Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block pt-2 w-56 z-[1001]">
                <div className="bg-white dark:bg-gray-850 rounded-xl shadow-xl border border-gray-100 dark:border-gray-750 overflow-hidden p-1.5">
                  {category.map((dm) => (
                    <Link
                      key={dm.ma}
                      href={`/listproduct?id=${dm.ma}`}
                      className="block px-4 py-2.5 text-xs md:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-brand-gold dark:hover:text-brand-gold rounded-lg transition font-medium"
                    >
                      {dm.tendanhmuc}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li className="relative group">
              <Link 
                href="/sale" 
                className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold px-3 py-2 rounded-lg transition"
              >
                Ưu đãi
              </Link>
            </li>

            <li className="relative group">
              <Link 
                href="/blog" 
                className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold px-3 py-2 rounded-lg transition"
              >
                Blog
              </Link>
            </li>

            <li className="relative group">
              <Link 
                href="/vip" 
                className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold px-3 py-2 rounded-lg transition"
              >
                Vip Member
              </Link>
            </li>

            <li className="relative group">
              <Link 
                href="/introduce" 
                className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold px-3 py-2 rounded-lg transition"
              >
                Giới thiệu
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
