# CHI TIẾT CƠ SỞ DỮ LIỆU KÍNH MẮT LUXURY

Hệ thống Kính Mắt Luxury hiện tại có tổng cộng **22 bảng dữ liệu (Tables)**. Các bảng này được chia thành các nhóm chức năng chính như: Quản lý Sản phẩm, Người dùng, Đơn hàng & Thanh toán, Nhập/Xuất Kho, Khuyến mãi và Trợ lý AI.

Dưới đây là chi tiết và mục đích của từng bảng cùng với các trường dữ liệu quan trọng:

---

## 1. Nhóm Quản lý Sản phẩm & Phân loại
*Đây là nhóm lưu trữ thông tin cốt lõi về hàng hóa đang kinh doanh.*

- **`Kinhmat` (Sản phẩm Kính mắt)**
  - Bảng chính lưu trữ thông tin sản phẩm.
  - *Cột nổi bật:* `id`, `ten`, `soluong`, `giaban`, `gianhap`, `chatlieu`, `kieudang`, `anh`, `trangthai`.
- **`Danhmuc` (Danh mục sản phẩm)**
  - Phân loại kính (VD: Kính râm, Kính cận, Gọng kính...).
  - *Cột nổi bật:* `id`, `danhmuc`, `mota`.
- **`Danhgia` (Đánh giá & Review)**
  - Khách hàng phản hồi về sản phẩm.
  - *Cột nổi bật:* `id`, `masp`, `iduser`, `SoSao`, `BinhLuan`, `NgayTao`.
- **`LichSuGia` (Lịch sử biến động giá)**
  - Lưu lại sự thay đổi về giá nhập và giá bán theo thời gian.
  - *Cột nổi bật:* `id`, `masp`, `gianhap`, `giaban`, `ngayapdung`.

---

## 2. Nhóm Quản lý Người dùng
*Quản lý tài khoản đăng nhập, thông tin liên hệ và phân quyền.*

- **`Nguoidung` (Người dùng & Admin)**
  - Lưu trữ thông tin tài khoản, đặc biệt có phân quyền Admin/User và cấp bậc VIP.
  - *Cột nổi bật:* `id`, `username`, `pass`, `ten`, `sdt`, `email`, `role`, `is_vip`, `trangthai`.

---

## 3. Nhóm Quản lý Đặt hàng & Giao dịch
*Nhóm này chịu trách nhiệm cho vòng đời mua sắm từ lúc thêm vào giỏ hàng đến khi thanh toán thành công.*

- **`Giohang` & `GiohangChitiet` (Giỏ hàng)**
  - Lưu trữ tạm thời các mặt hàng khách đã chọn nhưng chưa thanh toán.
  - *Cột nổi bật:* `id`, `iduser` (Giohang) | `id`, `idGiohang`, `masp`, `soluong` (GiohangChitiet).
- **`Donhang` (Hóa đơn bán hàng)**
  - Lưu trữ thông tin chung của 1 đơn hàng (Người nhận, địa chỉ, tổng tiền).
  - *Cột nổi bật:* `mahd`, `iduser`, `tongtien`, `tien_giam`, `trangthai`, `thoigian`.
- **`DonhangChitiet` (Chi tiết hóa đơn bán)**
  - Danh sách từng sản phẩm nằm trong 1 Đơn hàng cụ thể.
  - *Cột nổi bật:* `macthd`, `mahd`, `masp`, `soluong`, `giaban`.
- **`Thanhtoan` (Giao dịch Online/Offline)**
  - Lưu trữ trạng thái thanh toán (đặc biệt khi kết nối với Ví MoMo).
  - *Cột nổi bật:* `mathanhtoan`, `mahd`, `phuongthucthanhtoan`, `tongtien`, `trangthai`.
- **`Thongtinvanchuyen` (Theo dõi vận đơn)**
  - Theo dõi tình trạng giao hàng, nhà vận chuyển (VD: GHTK, Viettel Post).
  - *Cột nổi bật:* `mavandon`, `mahd`, `donvivanchuyen`, `ngaygiao`, `ngaynhan`.

---

## 4. Nhóm Quản lý Kho bãi (Nhập/Xuất)
*Sử dụng cho Admin và Kế toán để theo dõi dòng chảy hàng hóa.*

- **`Nhacungcap` (Nhà Cung Cấp)**
  - Thông tin các đối tác cung cấp nguồn hàng.
  - *Cột nổi bật:* `id`, `tenncc`, `sdt`, `email`, `diachi`.
- **`HoadonNhap` & `HoadonNhapChitiet` (Nhập Kho)**
  - Ghi nhận mỗi lần nhập hàng hóa từ Nhà Cung Cấp vào kho.
  - *Cột nổi bật:* `mahdn`, `mancc`, `ngaynhap`, `tongtien` | `masp`, `soluong`, `gianhap`.
- **`HoadonXuat` & `HoadonXuatChitiet` (Xuất Kho)**
  - Phiếu xuất hàng (Tự động sinh ra khi duyệt đơn hàng để trừ tồn kho chính thức).
  - *Cột nổi bật:* `mahdx`, `mahd`, `ngayxuat`, `tongtien` | `masp`, `soluong`, `giaban`.

---

## 5. Nhóm Marketing & Khuyến Mãi
*Hỗ trợ kích cầu mua sắm và chăm sóc Khách hàng VIP.*

- **`Khuyenmai` (Chương trình Khuyến mãi lớn)**
  - Lưu trữ các chiến dịch giảm giá (Có áp dụng riêng cho VIP).
  - *Cột nổi bật:* `id`, `ma_km`, `ten_km`, `giatri_km`, `loai_km`, `is_vip_only`, `ngayketthuc`.
- **`Voucher` (Mã giảm giá quy mô nhỏ)**
  - Mã ưu đãi nhập tay, phân bổ số lượng.
  - *Cột nổi bật:* `id`, `MaVoucher`, `GiaTri`, `SoLuong`, `NgayKetThuc`.

---

## 6. Nhóm Nội dung & Tin tức (Blog)
*Quản lý bài viết SEO, tin tức thời trang.*

- **`DanhMucBlog` (Chủ đề bài viết)**
  - Phân loại tin tức (VD: Mẹo vặt, Xu hướng).
  - *Cột nổi bật:* `id`, `ten`, `trangthai`.
- **`Blog` (Bài viết chi tiết)**
  - Nội dung các bài đăng tin tức.
  - *Cột nổi bật:* `id`, `tieude`, `noidung`, `anh`, `tacgia`, `luotxem`.

---

## 7. Nhóm AI Trợ lý ảo
*Lưu trữ ngữ cảnh để Google Gemini hiểu câu chuyện.*

- **`Message` (Lịch sử trò chuyện Chatbot)**
  - Lưu lại tin nhắn giữa Người dùng (User) và AI (Model) để duy trì mạch hội thoại.
  - *Cột nổi bật:* `id`, `iduser`, `role` (user/model), `content` (nội dung), `thoigian`.
