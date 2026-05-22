'use client';

import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import styles from './style.module.css';
import Blogmenu from '../../../components/Blog/blogmenu';
import { useEffect } from 'react';



export default function SalePage() {
  useEffect(() => {
        document.title = "Ưu đãi";
    })
  return (
    <div className={styles.content}>
      <div className={styles.left}>
        <div>
          <p style={{ fontSize: 14 }}>CHƯƠNG TRÌNH KHUYẾN MẠI</p>
          <h3>SALE TƯNG BỪNG – MỪNG NĂM MỚI – MUA 1 ĐƯỢC 2</h3>
          <p className={styles.saleContent}>Hưởng ứng nhập học 2022, DESMON kính gửi đến quý khách hàng event “Mua 1 Được 5”. Với mong muốn dành tặng những phần quà ý nghĩa tới khách hàng nhân dịp năm mới, chúng tôi đã tâm huyết xây dựng & cho ra mắt chương trình “Mua 1 được 2”. Đây là một cơ hội giúp mọi người thay đổi đa dạng style trong năm mới với chi phí cực nhỏ. Hãy đến với DESMON, phá bỏ ngay “giới hạn” của bản thân nhé!!</p>
        </div>

        <div className={styles.saleImage}>
          <img src="/images/sale.jpg" alt="" />
        </div>

        <div className={styles.saleNhaphoc}>
          <h3>NHẬP HỌC VỚI VÔ VÀN QUÀ TẶNG TẠI DESMON</h3>
          <ul>
            <li>Mua 1 gọng tặng 1 kính râm thời trang...</li>
            <li>Với gọng trên 280k...</li>
            <li>Không bảo hành thì giảm 30%...</li>
          </ul>
        </div>

        <div className={styles.contact}>
          <p>TRÂN TRỌNG THÔNG BÁO!</p>
          <p>Time: 7h30 – 21h30</p>
          <p>Hotline: <span>0937876001</span> - <span>0933807137</span></p>
          <p>Website: desmonshop.com</p>
          <p>Facebook: Kính mắt DESMON</p>
        </div>
      </div>

      <Blogmenu/>
    </div>
  );
}
