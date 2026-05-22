"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";
import Link from "next/link";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [reload, setReload] = useState(false); // để trigger cập nhật
  const router= useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sanphams")) || [];
    setCartItems(stored);
  }, [reload]);

  const updateQuantity = (index, delta) => {
    const updatedCart = [...cartItems];
    updatedCart[index].soluong = Math.max(1, updatedCart[index].soluong + delta);
    updatedCart[index].tong = updatedCart[index].soluong * updatedCart[index].gia;
    setCartItems(updatedCart);
    localStorage.setItem("sanphams", JSON.stringify(updatedCart));
  };

  const handleInputChange = (index, value) => {
    // const updatedCart = [...cartItems];
    // const val = Math.max(1, Number(value));
    // updatedCart[index].soluong = val;
    // updatedCart[index].tong = val * updatedCart[index].gia;
    // setCartItems(updatedCart);
    // localStorage.setItem("sanphams", JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem("sanphams", JSON.stringify(updatedCart));
     window.dispatchEvent(new Event('localStorageUpdated'));
  };

  const capnhat = () => {
    alert("Đã cập nhật giỏ hàng!");
    setReload(!reload); // để refresh dữ liệu nếu cần
  };

  const thanhtoan = () => {
    router.push("/payments")
  };

  const tamTinh = cartItems.reduce((total, item) => total + item.tong, 0);

  return (
    <div>
      <div className="content">
        <div className="giohang-sanpham">
          <table className="table-giohang-sanpham">
            <thead>
              <tr>
                <th style={{ width: "10cm" }}>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody className="listsp">
              {cartItems.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <IoMdCloseCircleOutline size={28} onClick={() => removeItem(index)}
                        style={{
                          borderRadius: "6px",
                          color:"#ccc",
                          marginRight: "10px",
                        }}/>
                      
                    </div>
                    <div>
                      <img
                        width="100px"
                        src={`http://localhost:5273/images/product/${item.anh}`}
                        alt={item.ten}
                      />
                    </div>
                    <div style={{ paddingLeft: "10px" }}>
                      <Link href={`/products?id=${item.id}`} style={{ textDecoration: "none", color:"#4872FA" }}>{item.ten}</Link>
                    </div>
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {item.gia.toLocaleString("vi-VN")}đ
                  </td>
                  <td>
                    <div className="quantity-control">
                      <button className="btn" onClick={() => updateQuantity(index, -1)}>-</button>
                      <input
                        type="number"
                        value={item.soluong}
                        min="1"
                        onChange={(e) => handleInputChange(index, e.target.value)}
                      />
                      <button className="btn" onClick={() => updateQuantity(index, 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {item.tong.toLocaleString("vi-VN")}đ
                  </td>
                </tr>
              ))}
              {cartItems.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    Giỏ hàng của bạn đang trống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: "10px" }}>
            <button className="tiptuc">
              <a href="/listproduct?id=1">Tiếp tục xem sản phẩm</a>
            </button>
            <button className="capnhatgiohang" onClick={capnhat}>
              Cập nhật giỏ hàng
            </button>
          </div>
        </div>

        <div className="giohang-thanhtoan">
          <table className="table-thanhtoan">
            <thead>
              <tr>
                <th colSpan="2">Cộng giỏ hàng</th>
              </tr>
            </thead>
            <tbody className="tongtienthanhtoan">
              <tr>
                <td>Tạm tính</td>
                <td>{tamTinh.toLocaleString("vi-VN")}đ</td>
              </tr>
              <tr>
                <td>Tổng</td>
                <td>{tamTinh.toLocaleString("vi-VN")}đ</td>
              </tr>
            </tbody>
          </table>
          <button id="btn_thanhtoan" onClick={thanhtoan}>
            Tiến hành thanh toán
          </button>
          <div className="giohang-thanhtoan-phieuudai">
            <i className="fa-solid fa-tag"></i> PHIẾU ƯU ĐÃI
          </div>
          <input
            type="text"
            style={{
              width: "95%",
              height: "0.8cm",
              paddingLeft: "3px",
              marginBottom: "5px",
            }}
            placeholder="Mã ưu đãi"
          />
          <button
            style={{
              width: "97%",
              backgroundColor: "#ECECEC",
              border: "1px solid rgb(49, 46, 46)",
              color: "rgb(116, 110, 110)",
              padding: "6px",
            }}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
