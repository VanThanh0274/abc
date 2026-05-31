# TÀI LIỆU ĐẶC TẢ QUY TRÌNH NGHIỆP VỤ HỆ THỐNG
**Tên dự án:** Website Thương Mại Điện Tử Cửa Hàng Kính Mắt

---

## I. TỔNG QUAN HỆ THỐNG
Hệ thống được thiết kế để tự động hóa các quy trình mua bán kính mắt truyền thống, kết hợp giữa việc bán hàng trực tuyến và quản lý kho hàng, doanh thu cho cửa hàng. 
Hệ thống bao gồm 2 đối tượng tham gia chính (Actors):
1. **Khách hàng (Customer):** Người truy cập website để tìm kiếm, mua sắm sản phẩm và theo dõi đơn hàng.
2. **Quản trị viên (Admin / Nhân viên):** Người quản lý hàng hóa, xử lý đơn hàng, quản lý nhập/xuất kho và xem báo cáo tài chính.

---

## II. CHI TIẾT CÁC QUY TRÌNH NGHIỆP VỤ CỐT LÕI

### 1. Quy trình Nghiệp vụ Mua hàng và Thanh toán trực tuyến
**Mục đích:** Giúp khách hàng lựa chọn sản phẩm, lưu trữ vào giỏ hàng và thanh toán một cách nhanh chóng.
**Bảng CSDL liên quan:** `Kinhmat` (Sản phẩm), `Giohang` (Giỏ hàng), `Donhang` (Đơn đặt hàng), `Nguoidung` (Tài khoản), `Voucher` (Khuyến mãi).

**Các bước thực hiện:**
- **Bước 1 (Tìm kiếm & Tiếp cận):** Khách hàng truy cập trang chủ, sử dụng thanh tìm kiếm hoặc bộ lọc danh mục để tìm kính mắt theo kiểu dáng, chất liệu, xuất xứ.
- **Bước 2 (Thêm vào giỏ):** Tại trang chi tiết sản phẩm, khách hàng chọn số lượng và nhấn "Thêm vào giỏ hàng". Nếu khách chưa đăng nhập, hệ thống sẽ yêu cầu đăng nhập/đăng ký. Dữ liệu tạm thời được lưu trữ vào bảng `Giohang` gắn với ID của khách hàng.
- **Bước 3 (Áp dụng mã giảm giá):** Tại giao diện Giỏ hàng, khách hàng có thể nhập mã Voucher. Hệ thống gọi Stored Procedure để kiểm tra:
  - Mã có tồn tại và còn trong thời gian hiệu lực hay không.
  - Tổng giá trị đơn hàng có đạt hạn mức tối thiểu của Voucher hay không.
  - Nếu hợp lệ, hệ thống tính toán lại tổng tiền cuối cùng (Total Amount).
- **Bước 4 (Thanh toán - Checkout):** Khách hàng điền thông tin người nhận (Tên, Số điện thoại, Địa chỉ giao hàng). Khách hàng chọn phương thức thanh toán:
  - **COD (Thanh toán khi nhận hàng):** Hệ thống lập tức tạo Đơn hàng.
  - **Thanh toán trực tuyến (MoMo):** Hệ thống chuyển hướng sang cổng thanh toán MoMo. Khi giao dịch thành công, MoMo trả về Callback và hệ thống ghi nhận thanh toán.
- **Bước 5 (Kết thúc):** Hệ thống lưu dữ liệu vào bảng `Donhang` với trạng thái mặc định là `0` (Chờ xác nhận). Đồng thời làm sạch bảng `Giohang` của khách hàng đó.

---

### 2. Quy trình Nghiệp vụ Xử lý Đơn hàng
**Mục đích:** Giúp nhân viên cửa hàng theo dõi và cập nhật tiến độ giao hàng cho khách.
**Bảng CSDL liên quan:** `Donhang`, `Kinhmat`.

**Các bước thực hiện:**
- **Bước 1 (Tiếp nhận):** Quản trị viên đăng nhập vào hệ thống Admin, vào menu "Quản lý đơn hàng". Màn hình hiển thị danh sách các đơn hàng mới nhất (Trạng thái: Chờ xác nhận).
- **Bước 2 (Xác nhận & Chuẩn bị):** Nhân viên gọi điện thoại cho khách hàng để xác minh đơn hàng. Nếu khách đồng ý, nhân viên chuyển trạng thái đơn hàng sang `Đang chuẩn bị hàng / Đang giao`.
- **Bước 3 (Giao hàng thành công):** Khi đơn vị vận chuyển báo giao thành công, nhân viên cập nhật trạng thái đơn thành `Hoàn thành`. Lúc này, hệ thống sẽ tự động tạo ra một **Hóa đơn xuất** ngầm và **trừ đi số lượng tồn kho** của sản phẩm trong bảng `Kinhmat`.
- **Bước 4 (Hủy đơn):** Trong trường hợp khách từ chối nhận hoặc hết hàng, nhân viên chuyển trạng thái sang `Hủy đơn`. Số lượng tồn kho không bị trừ.

---

### 3. Quy trình Nghiệp vụ Quản lý Kho (Nhập / Xuất)
**Mục đích:** Đảm bảo số liệu tồn kho trên phần mềm luôn khớp với kho hàng thực tế. Tránh tình trạng khách đặt mua nhưng kho đã hết.
**Bảng CSDL liên quan:** `Hoadon_nhap` (Phiếu nhập), `Hoadon_xuat` (Phiếu xuất), `Nhacungcap` (Nhà cung cấp), `Kinhmat`.

**A. Nghiệp vụ Nhập kho:**
- **Bước 1:** Khi có hàng mới về, Admin vào mục "Quản lý Hóa đơn nhập".
- **Bước 2:** Chọn Nhà cung cấp (hoặc thêm mới Nhà cung cấp), người nhận (chính là tên Admin), ngày nhập.
- **Bước 3:** Thêm chi tiết các mã kính mắt được nhập, điền *Số lượng nhập* và *Giá nhập* (Giá vốn).
- **Bước 4:** Lưu hóa đơn nhập. Lúc này hệ thống tự động **cộng dồn** số lượng vừa nhập vào số lượng tồn kho hiện tại của sản phẩm trong bảng `Kinhmat`. Tính toán ra Tổng tiền nhập hàng để làm cơ sở tính chi phí.

**B. Nghiệp vụ Xuất kho:**
- Xuất kho tự động: Xảy ra khi một đơn hàng bán cho khách (B2C) chuyển sang trạng thái "Hoàn thành".
- Xuất kho thủ công: Quản trị viên tự lập "Hóa đơn xuất" để xuất trả hàng cho nhà cung cấp hoặc xuất tiêu hủy sản phẩm lỗi. Số lượng tồn kho sẽ bị **trừ đi** tương ứng.

---

### 4. Quy trình Báo cáo, Thống kê (Dashboard)
**Mục đích:** Cung cấp cho Ban giám đốc / Chủ cửa hàng bức tranh toàn cảnh về hiệu quả kinh doanh.

**Các nghiệp vụ thống kê:**
- **Thống kê Doanh thu & Lợi nhuận:**
  - *Đầu vào:* Lấy tổng tiền từ các đơn hàng có trạng thái `Hoàn thành` (Doanh thu). Lấy dữ liệu Giá nhập từ Hóa đơn nhập (Giá vốn).
  - *Xử lý:* Lợi nhuận = Doanh thu bán ra - Giá vốn hàng hóa.
  - *Đầu ra:* Biểu đồ đường (Line Chart) thể hiện sự tăng trưởng doanh thu theo từng tháng trong năm.
- **Thống kê Sản phẩm bán chạy:**
  - Hệ thống đếm tổng số lượng bán ra của từng mã kính mắt trong các đơn hàng hoàn thành.
  - Hiển thị danh sách Top 5 hoặc Top 10 sản phẩm (Best Sellers) để chủ cửa hàng có chiến lược nhập hàng thêm.
- **Xuất Excel (Nghiệp vụ Kế toán):**
  - Tại bất kỳ bảng dữ liệu nào (Đơn hàng, Sản phẩm, Khách hàng), Quản trị viên đều có thể nhấn nút "Export Excel".
  - Hệ thống định dạng lại dữ liệu và tải xuống máy tính file `.xlsx` để phục vụ việc in ấn báo cáo tài chính hàng tháng.

---

### 5. Các Quy trình Hỗ trợ Khác
- **Nghiệp vụ Đánh giá (Review):** Khách hàng sau khi nhận hàng thành công có quyền truy cập lại chi tiết sản phẩm để đánh giá sao (1-5 sao) và để lại bình luận. Dữ liệu được lưu vào bảng `Danhgia`. Admin có quyền xóa bình luận nếu chứa ngôn từ không phù hợp.
- **Nghiệp vụ Content (Blog):** Admin đăng tải các bài viết SEO (ví dụ: "Cách chọn kính phù hợp với khuôn mặt"). Khách hàng đọc để tăng tương tác và thời gian ở lại trang. Dữ liệu lưu tại bảng `Blog`.
- **Nghiệp vụ Phân quyền:** Tài khoản cấp Admin có thể quản lý bảng `Nguoidung`, khóa (block) các tài khoản spam hoặc nâng cấp quyền (Role) cho một nhân viên mới.
