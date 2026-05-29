"use client";
import { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiForgotPassword } from '../../../services/login';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        document.title = "Quên mật khẩu | Kính Mắt Luxury";
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.warn("Vui lòng nhập email của bạn!");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warn("Email không hợp lệ!");
            return;
        }

        setIsLoading(true);
        try {
            const result = await apiForgotPassword(email);
            toast.success(result?.message || "Tạo mật khẩu mới thành công!");
            if (result?.newPassword) {
                setNewPassword(result.newPassword);
            }
            setIsSent(true);
        } catch (error) {
            console.error("Lỗi:", error);
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau!";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-sans">

            {/* Left Side - Image Banner */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                    src="/images/sale.jpg"
                    alt="Luxury Eyewear"
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                />

                <div className="relative z-20 text-center px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-widest text-shadow-lg">
                            An Tâm <span className="text-brand-gold">Tuyệt Đối</span>
                        </h1>
                        <p className="text-lg text-gray-200 leading-relaxed font-light max-w-md mx-auto">
                            Tài khoản của bạn luôn được bảo mật ở mức cao nhất. Lấy lại mật khẩu dễ dàng chỉ trong vài bước.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-gray-50 dark:bg-gray-900">

                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-6">
                            <Sparkles size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                            {isSent ? "Mật khẩu của bạn" : "Quên mật khẩu?"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {isSent
                                ? "Mật khẩu mới đã được tạo thành công. Vui lòng lưu lại và đăng nhập."
                                : "Đừng lo lắng! Hãy nhập email bạn đã đăng ký để hệ thống cấp lại mật khẩu mới."}
                        </p>
                    </div>

                    {isSent ? (
                        <div className="space-y-6 text-center">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-6">
                                <p className="text-sm text-green-800 dark:text-green-300 mb-2">Mật khẩu mới của bạn là:</p>
                                <div className="text-3xl font-mono font-bold text-green-600 dark:text-green-400 tracking-wider">
                                    {newPassword}
                                </div>
                                <p className="text-xs text-gray-500 mt-4">
                                    (Vui lòng sao chép mật khẩu này và đổi lại ngay sau khi đăng nhập)
                                </p>
                            </div>

                            <Link href="/login">
                                <button className="w-full py-3.5 rounded-xl text-black font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(197,168,128,0.3)] hover:shadow-[0_0_30px_rgba(197,168,128,0.5)] bg-brand-gold hover:bg-yellow-500 transition-all duration-300">
                                    QUAY LẠI ĐĂNG NHẬP
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">
                                    Địa chỉ Email
                                </label>
                                <div className="relative flex items-center group">
                                    <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl text-black font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(197,168,128,0.3)] hover:shadow-[0_0_30px_rgba(197,168,128,0.5)] bg-brand-gold hover:bg-yellow-500 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <span className="relative flex items-center gap-2">
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <>GỬI YÊU CẦU <Send size={16} /></>
                                    )}
                                </span>
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-gold transition-colors"
                        >
                            <ArrowLeft size={16} /> Trở về trang đăng nhập
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
