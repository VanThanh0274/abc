"use client"
import { useEffect, useState } from "react"
import styles from './style.module.css'
import { apiChangepassword, apiGetprofile_byid, apiUpdateUser } from "../../../services/login"
import { Getiduser } from "../../../services/auth"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

let p;
export default function Profile() {
    const [account, setaccount] = useState({});
    const [username, setusername] = useState('');
    const [hoTen, setHoTen] = useState(''); // Tên đầy đủ của người dùng (tương ứng với 'ten' trong API)
    const [sdt, setSdt] = useState('');     // Số điện thoại
    const [email, setEmail] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [newPassword2, setnewPassword2] = useState('');
    const [oldPassword, setoldPassword] = useState('');
    const [pass, setpass] = useState('');

    const [showform, setshowform] = useState(false);

    const router = useRouter();
    const handleChangepass = async () => {
        if (pass !== oldPassword) {
            toast.error("Mật khẩu không chính xác")
            return;
        }
        else if (newPassword !== newPassword2) {
            toast.error("Mật khẩu không khớp")
            return;
        }
        await apiChangepassword(newPassword, Getiduser())
        localStorage.removeItem('token');
        toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại');
        router.push("/login")


    }
    const handleUpdate = async() => {
        await apiUpdateUser(
            {
                id: Getiduser(),
                username: "string",
                pass: "123",
                ten: hoTen,
                sdt: sdt,
                email: email,
                role: "string",
                token: "string",
                trangthai: 0
            }
        )
        toast.success("Thành công");
    }   

    const fetchdata = async () => {
        const data = await apiGetprofile_byid(Getiduser());
        
        if (data) {
            setHoTen(data.ten || '');
            setSdt(data.sdt || '');
            setEmail(data.email || '');
            setusername(data.username || '');
        }
        console.log(data);
        setpass(data.pass);

    }
    useEffect(() => {
        ;
        document.title = "Hồ sơ"
        fetchdata();

    }, [])
    return (
        <div>
            <div className={styles.account}>
                <div className={styles.accountCenter}>
                    {/* Phần avatar */}
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatarPlaceholder}>
                            <img src="/images/intro/avatar_trang_1_cd729c335b.jpg" alt="" />
                        </div>
                        <p className={styles.usernameDisplay}>{username}</p>
                    </div>

                    {/* Input Tên người dùng */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Tên người dùng</label>
                        <input
                            type="text"
                            id="username"
                            value={hoTen}
                            onChange={(e) => setHoTen(e.target.value)}
                            className={styles.inputField}
                        />
                    </div>

                    {/* Input Số điện thoại */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <input
                            type="tel" // Sử dụng type="tel" cho số điện thoại
                            id="phoneNumber"
                            value={sdt}
                            onChange={(e) => setSdt(e.target.value)}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="phoneNumber">Email</label>
                        <input
                            type="email" // Sử dụng type="tel" cho số điện thoại
                            id="phoneNumber"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.inputField}
                        />
                    </div>

                    {/* Nhóm nút hành động */}
                    <div className={styles.buttonGroup}>
                        <button className={styles.saveButton} 
                            onClick={handleUpdate}>
                            Lưu thông tin
                        </button>
                        <button className={styles.changePasswordButton}
                            onClick={() => setshowform(true)} >
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </div>

            {showform && (
                <div className={styles.overlay}> {/* Tạo một overlay để làm mờ nền */}
                    <div className={styles.changePasswordForm}>
                        <h2>Đổi mật khẩu</h2>
                        <div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="oldPassword">Mật khẩu cũ</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    className={styles.inputField}
                                    onChange={(e) => setoldPassword(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="newPassword">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className={styles.inputField}
                                    onChange={(e) => setnewPassword(e.target.value)}

                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    id="confirmNewPassword"
                                    className={styles.inputField}
                                    onChange={(e) => setnewPassword2(e.target.value)}
                                />
                            </div>
                            <div className={styles.buttonGroupForm}> {/* Nhóm nút riêng cho form */}
                                <button type="submit" className={styles.submitButton} onClick={handleChangepass}>
                                    Đổi mật khẩu
                                </button>
                                <button
                                    type="button" // Quan trọng: type="button" để không submit form
                                    className={styles.cancelButton}
                                    onClick={() => setshowform(false)} // Đóng form
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}