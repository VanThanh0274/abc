"use client";
import './style.css';
import { FaTwitter, FaFacebook } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { apiLogin } from '../../../services/login';
import { useRouter } from 'next/navigation';
import {getRole} from "../../../services/auth"
import {toast} from "react-toastify"

export default function LoginPage() {
    const [user, setuser] = useState("");
    const [pass, setpass] = useState("");
    const router = useRouter();
    const loginse = async () => {
        try {
            const obj = {
                username: user,
                pass: pass,
            };
            const res = await apiLogin(obj);

            if (res?.token) {
                
                localStorage.setItem("token", res.token);
                const role =getRole();
                console.log(role);
                 // lưu token
                if(role=="Admin"){
                    toast.success("Đăng nhập thành công!");
                    
                    router.push("/admin");
                }
                if(role=="user"){
                    toast.success("Đăng nhập thành công!");
                    router.push("/Home");
                }
            } else {
                alert("Sai tài khoản hoặc mật khẩu!");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            toast.error("Lỗi kết nối server hoặc sai tài khoản!");
        }
        
    }
    useEffect(() => {
        document.title="Login";
    })

    return (
        <div className="container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <div className="input-group">

                    <input
                        type="text"
                        id="username"
                        className="input-field"
                        placeholder="Tên đăng nhập"
                        onChange={(e) => setuser(e.target.value)}
                    />
                </div>
                <div className="input-group">

                    <input
                        type="password"
                        id="password"
                        className="input-field"
                        placeholder="Mật khẩu"
                        onChange={(e) => setpass(e.target.value)}
                    />
                </div>
                <button className="continue-button" onClick={loginse}>Đăng nhập</button>
                <div className="social-login">
                    <div className="separator">
                        <hr className="line" />
                        <span className="or-text">or Connect With Social Media</span>
                        <hr className="line" />
                    </div>
                    <button className="twitter-button">
                        <FaTwitter className="social-icon" />
                        Sign In With Twitter
                    </button>
                    <button className="facebook-button">
                        <FaFacebook className="social-icon" />
                        Sign In With Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}