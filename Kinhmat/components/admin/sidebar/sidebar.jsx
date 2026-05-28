'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  House,
  LayoutList,
  Users,
  Layers,
  ShoppingBag,
  ArrowLeft,
  TrendingUp,
  PackageOpen,
  PackageCheck,
  Truck,
  Building2,
  Gift,
  BookOpen
} from 'lucide-react';

const menuItems = [
  { label: 'Tổng quan', icon: <House className="text-lg" />, href: '/admin' },
  {
    groupLabel: 'Quản lý kho hàng',
    items: [
      { label: 'Quản lý sản phẩm', icon: <LayoutList className="text-lg" />, href: '/admin/products' },
      { label: 'Quản lý danh mục', icon: <Layers className="text-lg" />, href: '/admin/category' },
      { label: 'Nhà cung cấp', icon: <Building2 className="text-lg" />, href: '/admin/supplier' },
      { label: 'Lịch sử giá', icon: <TrendingUp className="text-lg" />, href: '/admin/price-history' },
    ],
  },
  {
    groupLabel: 'Hóa đơn & Giao vận',
    items: [
      { label: 'Hóa đơn nhập kho', icon: <PackageOpen className="text-lg" />, href: '/admin/import' },
      { label: 'Hóa đơn xuất kho', icon: <PackageCheck className="text-lg" />, href: '/admin/export' },
      { label: 'Quản lý đơn hàng', icon: <ShoppingBag className="text-lg" />, href: '/admin/order' },
    ],
  },
  {
    groupLabel: 'Hệ thống',
    items: [
      { label: 'Quản lý bài viết', icon: <BookOpen className="text-lg" />, href: '/admin/blog' },
      { label: 'Quản lý người dùng', icon: <Users className="text-lg" />, href: '/admin/employees' },
      { label: 'Quản lý khuyến mãi', icon: <Gift className="text-lg" />, href: '/admin/promotions' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[280px] min-h-screen bg-white border-r border-gray-200/80 p-6 flex flex-col justify-between flex-shrink-0 font-sans text-gray-500 shadow-sm transition-colors duration-150">
      
      <div className="space-y-8">
        {/* Branding Logo */}
        <Link href="/Home" className="block text-center focus:outline-none">
          <img src="/images/logo3.png" alt="Luxury Logo" className="w-[180px] mx-auto block hover:opacity-80 transition duration-150" />
          <span className="text-[9px] font-bold tracking-widest text-brand-gold uppercase block mt-2">ADMINISTRATION CONTROL</span>
        </Link>

        {/* Navigation Sections */}
        <nav className="space-y-5">
          {menuItems.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.label && !section.items ? (
                <Link
                  href={section.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 outline-none ${
                    pathname === section.href 
                      ? 'text-brand-dark bg-brand-gold/15 border-l-2 border-brand-gold shadow-sm shadow-brand-gold/5' 
                      : 'text-gray-500 hover:text-brand-dark hover:bg-gray-50 hover:translate-x-1'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </Link>
              ) : (
                <div className="space-y-1">
                  {section.groupLabel && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-gold px-4 pt-3 pb-1">
                      {section.groupLabel}
                    </p>
                  )}
                  <ul className="space-y-0.5">
                    {section.items.map((item, subIdx) => (
                      <li key={subIdx}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 outline-none ${
                            pathname === item.href 
                              ? 'text-brand-dark bg-brand-gold/15 border-l-2 border-brand-gold shadow-sm shadow-brand-gold/5' 
                              : 'text-gray-500 hover:text-brand-dark hover:bg-gray-50 hover:translate-x-1'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Return to shop link */}
      <div className="border-t border-gray-150 pt-4">
        <Link 
          href="/Home" 
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 hover:border-brand-gold hover:text-brand-dark hover:bg-gray-50 text-xs font-semibold text-gray-500 transition duration-150 cursor-pointer"
        >
          <ArrowLeft className="text-sm" />
          <span>Về trang chủ shop</span>
        </Link>
      </div>

    </div>
  );
}
