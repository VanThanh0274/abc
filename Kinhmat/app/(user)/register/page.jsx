"use client";
import { useEffect, useState } from 'react';
import { User, Lock, Eye, EyeOff, Sparkles, ArrowLeft, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiRegister } from '../../../services/login';
export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.title = "Đăng ký tài khoản | Kính Mắt Luxury";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!formData.username || !formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.warn("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Email không hợp lệ!");
            return;
        }

        if (formData.phone) {
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(formData.phone)) {
                toast.error("Số điện thoại không hợp lệ!");
                return;
            }
        }

        if (formData.password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            const userPayload = {
                id: 0,
                username: formData.username.trim(),
                ten: formData.fullname.trim(),
                email: formData.email.trim(),
                sdt: formData.phone.trim(),
                pass: formData.password,
                role: "user",
                token: "",
                trangthai: 1,
                is_vip: 0
            };

            const res = await apiRegister(userPayload);
            
            toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
            router.push("/login");
            
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            const errorMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : "Tên đăng nhập hoặc email đã tồn tại!");
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-sans">
            
            {/* Left Side - Form (Swapped side compared to login for variety) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                
                {/* Back to Home Button */}
                <Link href="/Home" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-gold transition-colors z-20">
                    <ArrowLeft size={16} /> Quay lại trang chủ
                </Link>

                <motion.div
                    className="w-full max-w-md my-auto pt-12 pb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                            Tạo tài khoản mới
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Gia nhập cộng đồng Luxury Optic để nhận những ưu đãi đặc quyền.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        
                        {/* Two columns for Name & Username */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Fullname Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Họ và tên <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center group">
                                    <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                        <User size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        name="fullname"
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Username Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Tên đăng nhập <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center group">
                                    <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                        <ShieldCheck size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        name="username"
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                        placeholder="Tên tài khoản"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Email <span className="text-red-500">*</span></label>
                            <div className="relative flex items-center group">
                                <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                    placeholder="user@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Số điện thoại</label>
                            <div className="relative flex items-center group">
                                <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                    <Phone size={16} />
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                    placeholder="09xx xxx xxx"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Mật khẩu <span className="text-red-500">*</span></label>
                            <div className="relative flex items-center group">
                                <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-10 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-gray-400 hover:text-brand-gold transition-colors outline-none cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                            <div className="relative flex items-center group">
                                <span className="absolute left-4 text-gray-400 group-focus-within:text-brand-gold transition-colors">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-10 text-sm font-medium outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-brand-gold/10"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-gray-400 hover:text-brand-gold transition-colors outline-none cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-xl text-black font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(197,168,128,0.3)] hover:shadow-[0_0_30px_rgba(197,168,128,0.5)] bg-brand-gold hover:bg-yellow-500 transition-all duration-300 mt-6 cursor-pointer flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <span className="relative flex items-center gap-2">
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <>ĐĂNG KÝ NGAY <Sparkles size={16}/></>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Login Footer Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium mt-8">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="text-brand-gold hover:text-yellow-600 font-bold transition-colors">
                            Đăng nhập tại đây
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Image Banner */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img loading="lazy" 
                    src="/images/sale.jpg" 
                    alt="Luxury Eyewear Collection" 
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                />
                
                <div className="relative z-20 text-center px-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold uppercase tracking-widest mb-6">
                            VIP MEMBER
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-widest text-shadow-lg leading-tight">
                            Tham gia <br/><span className="text-brand-gold">Đặc quyền</span>
                        </h1>
                        <p className="text-lg text-gray-200 leading-relaxed font-light max-w-md mx-auto">
                            Tạo tài khoản ngay hôm nay để tích điểm, thăng hạng VIP và nhận những ưu đãi giảm giá độc quyền chỉ dành riêng cho bạn.
                        </p>
                    </motion.div>
                </div>
            </div>

        </div>
    );
}
