import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { useState,useEffect } from 'react';
import styles from './style.module.css';
const MenuItem = ({ title, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <li className={styles.menuItem}>
            <a href="#">{title}</a>
            <i onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
                {open ? <FaAngleRight /> : <FaAngleDown />}
            </i>
            {open && <ul className={styles.subMenu}>{children}</ul>}
        </li>
    );
};

export default function Blogmenu() {
    return (
        <div className={styles.right}>
            <h1>DANH MỤC SẢN PHẨM</h1>
            <ul className={styles.menu}>
                <MenuItem title="Chưa phân loại">
                    <li><a href="#">Khăn lau chống bám hơi</a></li>
                </MenuItem>
                <MenuItem title="Gọng Kính Cận">
                    <li><a href="">Gọng Kính Cận Cả Viền</a></li>
                    <li><a href="">Gọng Kính Cận Giá Rẻ</a></li>
                    <li><a href="">Gọng Kính Cận Nửa Viền</a></li>
                </MenuItem >
                <MenuItem title="Kính Áp Tròng">
                    <li><a href="">Lens Màu 1 Ngày</a></li>
                    <li><a href="">Lens Màu Cận – Loạn</a></li>
                    <li><a href="">Lens Màu Có Độ</a></li>
                    <li><a href="">Lens Màu Không Độ</a></li>
                    <li><a href="">Lens Thẩm Mỹ ( đục thủy tinh thể )</a></li>
                    <li><a href="">Nước Ngâm</a></li>
                    <li><a href="">Nước Nhỏ Mắt</a></li>
                    <li><a href="">Phụ Kiện Tặng Kèm</a></li>
                </MenuItem>
                <MenuItem title="Kính Chính Hãng">
                    <li><a href="">Kính CAMILA Chính Hãng</a></li>
                    <li><a href="">Kính Jaguar Chính Hãng</a></li>
                    <li><a href="">Kính JEEP Chính Hãng</a></li>
                </MenuItem>
                <MenuItem title="Kính Râm">
                    <li><a href="">Kính Râm Trẻ Em</a></li>
                </MenuItem>
                <li><a href="">Kính Râm Cận</a></li>
                <li><a href="">Lens Màu Không Độ</a></li>
                <li><a href="">Thương Hiệu</a></li>
                <li><a href="">Tròng Kính</a></li>
                <li><a href="">Tròng Kính Chemi U10 - Thương Hiệu Hàn Quốc</a></li>
                <li><a href="">Tròng Kính Chemi U2 - Thương Hiệu Hàn Quốc</a></li>
                <li><a href="">Tròng Kính Chemi U6 – Thương Hiệu Hàn Quốc</a></li>
                <li><a href="">Kính Râm Cận</a></li>
                <li><a href="">Kính Râm Cận</a></li>
                {/* Thêm các MenuItem khác tương tự */}
            </ul>

            <h1>DESMON BLOG</h1>
            <ul className={styles.menu}>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Chưa Được Phân Loại</a></li>
                <li><a href="#">Dịch Vụ</a></li>
            </ul>
        </div>
    )
}