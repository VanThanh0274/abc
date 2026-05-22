"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { Getiduser } from "../../../services/auth";
import { createOrder } from "../../../services/order";
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation';
export default function Thanhtoan() {
  const [cart, setcart] = useState([]);
  const [tong, settong] = useState(0);
  const [form, setForm] = useState({
    tenkh: "",
    sdt: "",
    email: "",
    diachi: "",
    ghichu: "",
  });
  const router=useRouter();

  const logCurrentTime = () => new Date().toISOString();

  useEffect(() => {
    const fetchdata = () => {
      const liststorage = JSON.parse(localStorage.getItem('sanphams')) || [];
      setcart(liststorage);
      const tong = liststorage.reduce((acc, item) => acc + item.tong, 0);
      settong(tong);
    }
    fetchdata();
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (token == null) {
      toast.error("Vui lòng đăng nhập")
      router.push("/login")

    }
    else {


      try {
        const tenkh = form.tenkh;
        const email = form.email;
        const sdt = form.sdt;
        const diachi = form.diachi;
        const ghichu = form.ghichu;

        const list = JSON.parse(localStorage.getItem("sanphams")) || [];
        const listjson_chitiet = list.map((item) => ({
          macthd: 0,
          mahd: 0,
          masp: parseInt(item.id),
          soluong: parseInt(item.soluong),
          giaban: parseInt(item.gia),
        }));
        const donhang = {
          iduser: Getiduser(),
          ten: tenkh,
          sdt,
          email,
          diachi,
          ghichu,
          thoigian: logCurrentTime(),
          tongtien: tong,
          trangthai: "Chờ xác nhận",
          listjson_chitiet,
        }


        await createOrder(JSON.stringify(donhang));

        localStorage.removeItem("sanphams");
        setcart([]);
        toast.success("Thành công")

        console.log("Đặt hàng:", form);
      } catch (error) {
        toast.error("Lỗi")
      }
    }
    // Gửi API POST đặt hàng tại đây
  };

  return (
    <div>
      <div className={styles.app}>
        <div className={styles.thanhtoan}>
          {/* BÊN TRÁI */}
          <div className={styles.thanhtoanLeft}>
            <h3>THÔNG TIN THANH TOÁN</h3>
            <div className={styles.thanhtoanInput} style={{ marginTop: "10px" }}>
              <label>Họ và tên</label>
              <input
                type="text"
                id="tenkh"
                value={form.tenkh}
                onChange={handleChange}
              />
            </div>
            <div className={styles.thanhtoanInput}>
              <label>Số điện thoại</label>
              <input
                type="text"
                id="sdt"
                value={form.sdt}
                onChange={handleChange}
              />
            </div>
            <div className={styles.thanhtoanInput}>
              <label>Email</label>
              <input
                type="text"
                id="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.thanhtoanInput}>
              <label>Địa chỉ</label>
              <input
                type="text"
                placeholder="Địa chỉ nhận hàng"
                id="diachi"
                value={form.diachi}
                onChange={handleChange}
              />
            </div>
            <div className={styles.thanhtoanInput}>
              <h3>Thông tin bổ sung</h3>
              <label>Ghi chú đơn hàng</label>
              <textarea
                id="ghichu"
                rows="10"
                value={form.ghichu}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* BÊN PHẢI */}
          <div className={styles.thanhtoanRight}>
            <h3>Đơn hàng của bạn</h3>
            <div>
              <table className={styles.tables}>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Tạm tính</th>
                  </tr>
                </thead>
                <tbody className={styles.tbodys}>
                  {
                    cart.map((item) => (

                      <tr>
                        <td>{item.ten} X {item.soluong}</td>
                        <td>{item.gia.toLocaleString("vi-VN")}</td>
                      </tr>
                    ))
                  }


                  <tr style={{ fontWeight: "bold" }}>
                    <td>Ship</td>
                    <td>30.000 đ</td>
                  </tr>
                  <tr>
                    <td><strong>Tổng</strong></td>
                    <td><strong>{(tong + 30000).toLocaleString("vi-VN")} đ</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p>Trả tiền mặt khi nhận hàng</p>
              <button className={styles.btnThanhtoan} id="btn_thanhtoan" onClick={handleSubmit}>
                ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
