"use client";
import Sidebar from '../../components/admin/sidebar/sidebar';
import { ToastContainer } from 'react-toastify';
import { useRouter } from "next/navigation";
import { getRole } from "../../services/auth"; 
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const role = getRole();
    if (role !== "Admin") {
      router.push("/Home"); // Không phải admin thì redirect
    }
  }, []);

  return (
    <div className="flex bg-luxury-cream min-h-screen relative transition-colors duration-150">
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 bg-luxury-cream text-gray-800 min-h-screen relative overflow-x-hidden transition-colors duration-150">
        {children}
        <ToastContainer theme="light" />
      </main>
    </div>
  );
}
