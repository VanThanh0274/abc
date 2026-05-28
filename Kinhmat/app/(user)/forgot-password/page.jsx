"use client";
import { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
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
            // Mock API call - Replace with actual implementation later
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success("Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn!");
            setIsSent(true);
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
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
                            Quên mật khẩu?
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Đừng lo lắng! Hãy nhập email bạn đã đăng ký, chúng tôi sẽ gửi hướng dẫn để bạn lấy lại mật khẩu.
                        </p>
                    </div>

                    {!isSent ? (
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
                                        <>GỬI YÊU CẦU <Send size={16}/></>
                                    )}
                                </span>
                            </button>
                        </form>
                    ) : (
                        <motion.div 
                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-2xl text-center space-y-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                                <Send size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Kiểm tra Email của bạn</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Chúng tôi đã gửi một email hướng dẫn lấy lại mật khẩu tới <span className="font-semibold">{email}</span>. Vui lòng kiểm tra hộp thư đến (và cả thư mục Spam).
                            </p>
                        </motion.div>
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
