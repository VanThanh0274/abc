'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './style.css';

import {
  FaHome,
  FaList,
  FaUser,
} from 'react-icons/fa';
import { BiCategoryAlt } from "react-icons/bi";
import { FaBagShopping } from "react-icons/fa6";


const menuItems = [
  { label: 'Tổng quan', icon: <FaHome size={18} />, href: '/admin' },

  {
    items: [
      { label: 'Quản lý sản phẩm', icon: <FaList size={18} />, href: '/admin/products' },
      { label: 'Quản lý danh mục', icon: <BiCategoryAlt size={18} />, href: '/admin/category' },
      { label: 'Quản lý đơn hàng', icon: <FaBagShopping size={18} />, href: '/admin/order' },
      { label: 'Quản lý người dùng', icon: <FaUser size={18} />, href: '/admin/employees' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <img src="/images/logo3.png" alt="Logo" className="sidebar-logo" />
      {menuItems.map((section, idx) => (
        <div key={idx} className="sidebar-section">
          {section.label && !section.items ? (
            <Link
              href={section.href}
              className={`sidebar-link ${pathname === section.href ? 'active' : ''}`}
            >
              {section.icon}
              <span>{section.label}</span>
            </Link>
          ) : (
            <ul>
              {section.items.map((item, subIdx) => (
                <li key={subIdx}>
                  <Link
                    href={item.href}
                    className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
