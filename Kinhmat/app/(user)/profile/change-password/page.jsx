"use client";
import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Save, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiChangepassword } from "../../../../services/login";
import { getId } from "../../../../services/auth";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.title = "Đổi mật khẩu | Kính Mắt Luxury";
        // Ensure user is logged in
        const id = getId();
        if (!id) {
            toast.error("Vui lòng đăng nhập để đổi mật khẩu!");
            router.push("/login");
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.warn("Vui lòng nhập đầy đủ mật khẩu mới!");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            const id = getId();
            // Note: The backend currently only changes the password without verifying the old one.
            // If the backend `sp_u_change_password` requires old password, it would be passed here.
            // For now, we use apiChangepassword(newPassword, id) based on current backend implementation.
            const res = await apiChangepassword(newPassword, id);
            
            toast.success("Đổi mật khẩu thành công!");
            // Redirect to profile or home
            router.push("/profile");
            
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-gold mb-8 transition-colors">
                    <ArrowLeft size={16} /> Quay lại hồ sơ
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-4">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Đổi mật khẩu</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            Bảo mật tài khoản của bạn bằng một mật khẩu mạnh
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Mật khẩu mới</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-gray-400"><Lock size={16} /></span>
                                <input
                                    type={showNew ? "text" : "password"}
                                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-10 text-sm outline-none transition-all dark:text-white"
                                    placeholder="Tối thiểu 6 ký tự"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button type="button" className="absolute right-4 text-gray-400 hover:text-brand-gold" onClick={() => setShowNew(!showNew)}>
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">Xác nhận mật khẩu</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-gray-400"><Lock size={16} /></span>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    className="w-full bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 focus:border-brand-gold rounded-xl py-3 pl-10 pr-10 text-sm outline-none transition-all dark:text-white"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button type="button" className="absolute right-4 text-gray-400 hover:text-brand-gold" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-brand-gold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors disabled:opacity-70"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>Lưu thay đổi <Save size={16} /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
