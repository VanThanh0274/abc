"use client";
import { useEffect, useState } from 'react';
import { User, Lock, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { apiLogin } from '../../../services/login';
import { useRouter } from 'next/navigation';
import { getRole } from "../../../services/auth";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const loginse = async () => {
        if (!user.trim() || !pass.trim()) {
            toast.warn("Vui lòng điền đầy đủ tài khoản và mật khẩu!");
            return;
        }

        setIsLoading(true);
        try {
            const obj = {
                username: user,
                pass: pass,
            };
            const res = await apiLogin(obj);

            if (res?.token) {
                localStorage.setItem("token", res.token);
                const role = getRole();
                toast.success("Đăng nhập thành công!");

                window.dispatchEvent(new Event('localStorageUpdated'));

                if (role === "Admin") {
                    router.push("/admin");
                } else {
                    router.push("/Home");
                }
            } else {
                toast.error("Sai tài khoản hoặc mật khẩu!");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            toast.error("Lỗi kết nối máy chủ hoặc sai tài khoản!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Đăng nhập | Kính Mắt Luxury";
    }, []);

    return (
        <div className="min-h-screen bg-white flex font-sans">
            
            {/* Left Side - Image Banner */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img 
                    src="/images/banner1.png" 
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
                            Luxury <span className="text-brand-gold">Optic</span>
                        </h1>
                        <p className="text-lg text-gray-200 leading-relaxed font-light max-w-md mx-auto">
                            Khám phá bộ sưu tập kính mắt thời thượng, tôn vinh đẳng cấp và phong cách sống của riêng bạn.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-gray-50 dark:bg-gray-900">
                
                {/* Back to Home Button */}
                <Link href="/Home" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-gold transition-colors">
                    <ArrowLeft size={16} /> Quay lại trang chủ
                </Link>

                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                            Chào mừng trở lại!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Vui lòng đăng nhập để tiếp tục trải nghiệm mua sắm tuyệt vời.
                        </p>
                    </div>

                    {/* Form Inputs */}
                    <div className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Tên đăng nhập</label>
                            <div className="relative flex items-center group">
                                <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                    placeholder="Nhập tên đăng nhập"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && loginse()}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Mật khẩu</label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-brand-gold hover:text-yellow-600 transition-colors">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative flex items-center group">
                                <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                    placeholder="••••••••"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && loginse()}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-gray-400 hover:text-brand-gold transition-colors outline-none cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            className="w-full py-4 rounded-xl text-black font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(197,168,128,0.3)] hover:shadow-[0_0_30px_rgba(197,168,128,0.5)] bg-brand-gold hover:bg-yellow-500 transition-all duration-300 mt-2 cursor-pointer flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                            onClick={loginse}
                            disabled={isLoading}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <span className="relative flex items-center gap-2">
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <>ĐĂNG NHẬP <Sparkles size={16}/></>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Social Login Separator */}
                    <div className="my-8">
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                            <span className="px-4 text-[11px] uppercase tracking-wider text-gray-500 font-semibold bg-gray-50 dark:bg-gray-900 z-10">
                                Hoặc kết nối qua
                            </span>
                            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1da1f2]"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                                Google
                            </button>
                            <button className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1877f2]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    {/* Register Footer Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Chưa có tài khoản?{" "}
                        <Link href="/register" className="text-brand-gold hover:text-yellow-600 font-bold transition-colors">
                            Đăng ký ngay
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}