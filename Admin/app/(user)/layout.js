"use client"
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";



export default function UserLayout({ children }) {
  // const pathname = usePathname();
  // const hideHeaderFooter = pathname === '/introduce';
  return (
    <>
      {<Header />}
      <main>{children}</main>
      { <Footer />}
      <ToastContainer/>
    </>
  );
}
