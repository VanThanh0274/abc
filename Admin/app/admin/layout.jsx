"use client";
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import Sidebar from '../../components/admin/sidebar/sidebar';
import { ToastContainer } from 'react-toastify';
import { useRouter } from "next/navigation";
import { getRole } from "../../services/auth"; 
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import "./style.css"


export default function AdminLayout({ children }) {
  const router = useRouter();
  const demo = () => {
    
  }
  useEffect(() => {
    const role = getRole();
    if (role !== "Admin") {
      router.push("/Home"); // Không phải admin thì redirect
    }
  }, []);
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
        <ToastContainer />
      </main>
    </div>
  );
}
