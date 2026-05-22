import "./style.css";
export default function Footer() {
  return (
    <div>
      <div className="hethong-cuahang">
        <div className="hethong-cuahang-center">
          <div>
            
            <p>HỆ THỐNG CỬA HÀNG</p>
            <p>65A - 67 - 69 Hàm Nghi - TP. Quy Nhơn</p>
            <p>HOTLINE 1: <a href="tel:0937876001">0937876001</a></p>
            <p>HOTLINE 2: <a href="tel:0933807137">0933807137</a></p>
            <p>EMAIL: Desmonshop@gmail.com</p>
            <p>THỜI GIAN MỞ CỦA: 7:30 – 22:00</p>
          </div>
          <div>
            <p>HƯỚNG DẪN MUA HÀNG</p>
            <p><a href="#">Lưu Ý Nhanh</a></p>
            <p><a href="#">Chọn Kính Theo Khuôn Mặt</a></p>
            <p><a href="#">Cách Thức Mua Hàng</a></p>
            <p><a href="#">Cách Thức Thanh Toán</a></p>
            <p><a href="#">Quy Trình Bảo Hành & Đổi Trả</a></p>
          </div>
          <div>
            <p>BẢN ĐỒ CỬA HÀNG DESMON STORE</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              width="300"
              height="200"
              style={{ border: 0 }} 
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>

          </div>
        </div>
      </div>

      <div className="banquyen">
        <div className="banquyen-menu">
          <div className="banquyen-menu-center">
            <ul>
              <li><a href="#">Kính mắt Desmon</a></li>
              <li><a href="#">Kính râm</a></li>
              <li><a href="#">Gọng kính cận</a></li>
              <li><a href="#">Tròng kính</a></li>
              <li><a href="#">Kính râm cận</a></li>
              <li><a href="#">Hàng hiệu</a></li>
            </ul>
          </div>
        </div>
        <div className="banquyen-2020">
          <div className="banquyen-2020-center">
            <p>Copyright Kính Mắt DESMON - Đo & Cắt Kính Cận Viễn Loạn 2020. All Rights Reserved</p>
          </div>
        </div>



      </div>

    </div>
  );
}
