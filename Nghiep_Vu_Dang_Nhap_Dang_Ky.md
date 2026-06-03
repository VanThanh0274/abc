# QUY TRÌNH NGHIỆP VỤ CHI TIẾT (AUTH, CART, PAYMENT, AI)

Tài liệu này mô tả chi tiết toàn bộ luồng xử lý nghiệp vụ, logic hệ thống và các khía cạnh bảo mật liên quan đến Hệ thống Kính Mắt Luxury, từ quá trình Đăng ký, Đăng nhập, Quản lý phiên hoạt động, Đặc quyền VIP đến Thanh toán và Trợ lý AI.

---

## 1. Nghiệp vụ: Đăng Ký Tài Khoản (Registration)

### A. Mô tả luồng Front-End
1. **Giao diện:** Người dùng truy cập trang Đăng ký và điền đầy đủ các thông tin bắt buộc (Tên, Số điện thoại, Email, Mật khẩu, Nhập lại mật khẩu).
2. **Kiểm tra dữ liệu (Validation):**
   - Không được bỏ trống các trường thông tin.
   - Email phải tuân thủ đúng định dạng (có `@`, dấu chấm).
   - Số điện thoại phải đúng định dạng VN (10-11 số).
   - Mật khẩu phải đủ mạnh (Tối thiểu 6 ký tự).
   - Dữ liệu ở hai ô "Mật khẩu" và "Nhập lại mật khẩu" phải trùng khớp tuyệt đối.
3. **Gửi yêu cầu:** Trình duyệt sử dụng Axios gọi API `POST /api/Users/register` với payload (thân gửi) dạng JSON.

### B. Mô tả luồng Back-End (API & Database)
1. **Tiếp nhận & Kiểm tra trùng lặp (Check exists):**
   - Hệ thống (Backend) truy vấn xuống Database (bảng `Nguoidung`) để kiểm tra `email` hoặc `sdt` đã có ai sử dụng chưa.
   - Nếu đã tồn tại: Ném lỗi HTTP `400 Bad Request` với thông báo "Email hoặc Số điện thoại đã được sử dụng".
2. **Bảo mật Mật khẩu (Hashing):**
   - **Tuyệt đối KHÔNG** lưu mật khẩu dạng thuần (plaintext).
   - Backend sử dụng thuật toán mã hóa một chiều để băm mật khẩu ra thành một chuỗi (Hashed Password) không thể dịch ngược.
3. **Khởi tạo dữ liệu người dùng:**
   - Tạo đối tượng `Nguoidung` mới.
   - Gán `role = "user"` (Quyền người dùng thông thường).
   - Gán `is_vip = 0` (Chưa phải là thành viên VIP).
4. **Lưu trữ Database:**
   - Gọi Stored Procedure `sp_nguoidung_insert` để lưu vào Cơ sở dữ liệu. SQL Server sẽ tự động cấp phát ID mới cho người dùng.
5. **Trả về kết quả:**
   - Backend trả về mã `200 OK` (Thành công) cùng tin nhắn "Đăng ký thành công".
   - Frontend hiển thị thông báo (Toast) và tự động chuyển hướng người dùng sang trang Đăng Nhập.

---

## 2. Nghiệp vụ: Đăng Nhập (Login)

### A. Mô tả luồng Front-End
1. **Giao diện:** Người dùng nhập `Email/SĐT` và `Mật khẩu` vào form.
2. **Gửi yêu cầu:** Trình duyệt gọi API `POST /api/Users/login`.

### B. Mô tả luồng Back-End & Tạo Session (JWT)
1. **Tìm kiếm người dùng:**
   - Backend tìm kiếm bản ghi trong bảng `Nguoidung` có `email` (hoặc `sdt`) khớp với dữ liệu gửi lên. Nếu không tìm thấy, trả về lỗi "Tài khoản không tồn tại".
2. **Xác thực Mật khẩu (Verify Password):**
   - Lấy mật khẩu thuần do khách hàng nhập, đưa qua hàm băm và so sánh với Mật khẩu băm đang lưu trong Database.
   - Nếu sai: Trả về lỗi `401 Unauthorized` "Mật khẩu không chính xác".
3. **Sinh Token (JWT - JSON Web Token):**
   - Khi xác thực thành công, hệ thống sử dụng một chuỗi bí mật (Secret Key) cấu hình trong `appsettings.json` để ký một chuỗi Token.
   - **Payload (Dữ liệu mang theo) của Token chứa:**
     - `UserId` (Mã người dùng)
     - `Role` (Quyền: Admin / User)
     - `Is_Vip` (Trạng thái VIP để Frontend dễ phân biệt).
     - `Exp` (Hạn sử dụng của Token - Ví dụ: 1 ngày hoặc 7 ngày).
4. **Trả về Client:**
   - Backend trả về `200 OK` kèm theo chuỗi Token và thông tin cơ bản của user.

### C. Xử lý lưu trữ tại Front-End
1. Sau khi nhận được Token, Frontend lưu nó vào **LocalStorage** (hoặc Session/Cookies).
   - `localStorage.setItem('token', res.token);`
2. Frontend giải mã (decode) Token để biết Role là Admin hay User.
   - Nếu `Role == "admin"`: Chuyển hướng thẳng vào trang Quản trị (`/admin`).
   - Nếu `Role == "user"`: Chuyển hướng về Trang chủ để mua sắm (`/`).
3. Cập nhật trạng thái thanh Navbar: Đổi nút "Đăng nhập" thành "Tên/Avatar" của User.

---

## 3. Nghiệp vụ: Quản Trị Phiên Đăng Nhập (Authorization)

Mọi API quan trọng (Ví dụ: Đặt hàng, Xem lịch sử) sau khi Đăng nhập đều phải thông qua quy trình kiểm duyệt (Middleware/Guard):

1. **Gắn Token vào Yêu cầu (Request Interceptors):**
   - Khi Frontend gọi các API yêu cầu quyền, Axios Interceptor sẽ tự động chèn Token từ LocalStorage vào Header: `Authorization: Bearer <chuỗi_token>`
2. **Backend xác thực Token:**
   - API nhận request, đọc Header `Authorization`.
   - Tiến hành giải mã Token:
     - Nếu Token bị sửa đổi/giả mạo -> Lỗi `401 Unauthorized`.
     - Nếu Token đã hết hạn (Expired) -> Lỗi `401 Unauthorized`.
     - Trích xuất `Role`. Nếu API (VD: Thêm danh mục) yêu cầu quyền Admin mà Token chỉ có quyền User -> Lỗi `403 Forbidden` (Chặn, từ chối truy cập).
3. **Hết hạn phiên đăng nhập:**
   - Khi Frontend nhận mã lỗi `401` từ Backend, Frontend sẽ tự động xóa Token trong `LocalStorage` và "đá" người dùng văng ra màn hình yêu cầu Đăng nhập lại.

---

## 4. Nghiệp vụ: Đăng Xuất (Logout)

Quá trình đăng xuất thực chất là việc "hủy bỏ" phiên làm việc phía Client:
1. Người dùng bấm vào nút "Đăng xuất" trên giao diện.
2. Frontend thực hiện lệnh: `localStorage.removeItem('token')`.
3. Làm mới giao diện (Clear state giỏ hàng, thông tin cá nhân của user trên Redux/Context).
4. Tự động chuyển hướng người dùng về trang Đăng Nhập hoặc Trang Chủ mặc định.

---

## 5. Nghiệp vụ: Giỏ Hàng và Xác Định Đặc Quyền VIP

Đây là luồng nghiệp vụ quan trọng nhằm kích thích người dùng mua sắm và duy trì tệp khách hàng trung thành.

### A. Thêm vào giỏ hàng (Add to Cart)
1. **Thao tác người dùng:** Tại trang chi tiết sản phẩm, khách hàng chọn số lượng và bấm "Thêm vào giỏ hàng".
2. **Lưu trữ State (Client-Side):** 
   - Hệ thống chưa gửi thẳng dữ liệu lên Server để tránh tốn tài nguyên. Giỏ hàng (Mã SP, Tên, Hình ảnh, Giá, Số lượng) được đưa vào mảng lưu trong `LocalStorage` (để không bị mất khi F5 trình duyệt).
   - Số lượng ở biểu tượng giỏ hàng trên thanh điều hướng (Navbar) sẽ tự động nhảy số (badge) ngay lập tức.
3. **Chuyển sang trang Thanh Toán:** Khi khách hàng vào trang Giỏ Hàng (`/cart`) và bấm "Tiến hành thanh toán".

### B. Kiểm tra và Nhận diện Hạng Thành Viên VIP
Để biết một người dùng là VIP hay Không VIP, hệ thống sử dụng cơ chế kiểm tra kép (Double Verification) giữa Client và Server:

1. **Bước 1: Front-End kiểm tra tiến trình (VIP Progress)**
   - Khi vào trang Thanh toán (`/payments`), giao diện sẽ gọi API lấy thông tin người dùng.
   - Nếu `is_vip == true`, người dùng này đã thỏa mãn điều kiện tích lũy chi tiêu và đã kích hoạt VIP.
2. **Bước 2: Áp dụng Quyền Lợi Hiển Thị (UI/UX)**
   - **Đối với Thành viên Thường:** Cột Phí vận chuyển hiển thị `30.000 đ`. Tổng tiền thanh toán = (Tiền Hàng - Giảm Giá) + `30.000đ`.
   - **Đối với Thành viên VIP:** Cột Phí vận chuyển tự động đổi thành nhãn **"Miễn phí (VIP)"** với màu vàng nổi bật. Tổng tiền thanh toán = (Tiền Hàng - Giảm Giá) + `0đ`. 
   - VIP được phép nhập các mã Giảm giá (Voucher) đặc quyền riêng.

### C. Chốt Đơn & Xác thực Logic tại Database (Tính toàn vẹn Dữ liệu)
**Tuyệt đối không tin tưởng con số Tổng Tiền Frontend gửi lên.** Khi khách hàng bấm "Xác nhận Đặt hàng", mảng JSON các sản phẩm trong giỏ hàng được đẩy xuống Backend (`sp_donhang_insert`).

1. **Tính toán độc lập:** Stored Procedure tự động gọi truy vấn `SELECT is_vip FROM Nguoidung WHERE id = @iduser`.
2. **Áp dụng cước phí an toàn:**
   ```sql
   DECLARE @shipping_fee INT = 30000;
   IF @is_vip = 1 SET @shipping_fee = 0; -- Hệ thống tự ngầm loại bỏ 30k
   ```
3. **Chốt Tổng Tiền & Cập nhật Kho:** 
   - `tongtien` của hóa đơn được tính toán lại bằng lệnh SQL: `Tổng(giá * số lượng) - tiền giảm + @shipping_fee`. Tiền này mới là chuẩn xác nhất.
   - Trừ tự động số lượng sản phẩm trong bảng `Kinhmat` (`UPDATE Kinhmat SET soluong = soluong - @soluongban`).
   - Gửi tín hiệu thành công để Frontend xóa `LocalStorage` giỏ hàng.

---

## 6. Nghiệp vụ: Chatbot AI Hỗ Trợ Khách Hàng (Google Gemini)

Hệ thống tích hợp Trợ lý ảo AI sử dụng Google Gemini API để tự động tư vấn sản phẩm và giải đáp thắc mắc của khách hàng dựa trên dữ liệu thật của cửa hàng.

### A. Luồng xử lý giao diện (Front-End)
1. **Kích hoạt:** Người dùng bấm vào biểu tượng Chatbot (màu vàng) ở góc dưới màn hình.
2. **Giao tiếp:** Người dùng gõ câu hỏi (VD: "Có kính râm nào chống tia UV dưới 500k không?").
3. **Trải nghiệm UX:** Màn hình chat hiển thị tin nhắn của người dùng, sau đó hiện biểu tượng "Đang gõ..." để giả lập phản hồi tự nhiên.
4. **Gửi dữ liệu:** Frontend gọi API `POST /api/Ctr_Chatbot/chat` mang theo `message` (câu hỏi) và `iduser` (nếu khách đã đăng nhập).

### B. Luồng xử lý Backend (C# & Gemini API)
1. **Tiếp nhận & Lưu trữ (Lịch sử Chat):**
   - Backend nhận `userMessage`.
   - Nếu `iduser` tồn tại, lưu tin nhắn của khách vào bảng `Message` (Database) để ghi nhớ ngữ cảnh cuộc trò chuyện trước đó.
2. **Thu thập Ngữ cảnh (Context Builder):**
   - Backend truy vấn bảng `Kinhmat` và các bảng liên quan để lấy danh sách sản phẩm hiện có (Mã, Tên kính, Giá, Chất liệu, Khuyến mãi,...).
   - Chuyển đổi dữ liệu này thành một chuỗi JSON thuần.
3. **Giao tiếp với Google Gemini:**
   - Cấu trúc lại một **System Prompt (Câu lệnh hướng dẫn)** cực kỳ chi tiết gửi cho Gemini:
     - *Vai trò:* "Bạn là nhân viên tư vấn của Kính Mắt Luxury..."
     - *Nguyên tắc:* "Tuyệt đối chỉ tư vấn dựa trên danh sách sản phẩm sau đây: [Dữ liệu JSON]... Không được bịa đặt hay nói những thứ không có trong danh sách."
     - *Ngữ cảnh:* Kèm theo các tin nhắn lịch sử (để AI hiểu khách hàng đang nói tiếp về mẫu kính nào).
   - Dùng `HttpClient` gửi Request JSON tới Endpoint của Google `https://generativelanguage.googleapis.com/...:generateContent`.
4. **Xử lý Phản hồi (Response):**
   - Nhận kết quả Text từ Google Gemini.
   - Nếu `iduser` tồn tại, lưu câu trả lời của AI vào bảng `Message` với role là `model`.
   - Trả kết quả về cho Frontend để hiển thị cho người dùng.

---

## 7. Nghiệp vụ: Thanh Toán Trực Tuyến qua Ví MoMo

Hệ thống hỗ trợ thanh toán online hoàn toàn tự động, tích hợp Cổng thanh toán MoMo bằng giao thức kết nối API bảo mật.

### A. Khởi tạo Giao dịch (Tạo Đơn Hàng)
1. **Frontend:** Tại trang Thanh toán, khách chọn phương thức "Thanh toán qua Ví MoMo" và bấm "Xác nhận đặt hàng".
2. **Backend xử lý đơn:**
   - Hệ thống tạo một bản ghi Đơn hàng mới (Lưu vào `Donhang` và `DonhangChitiet`) với trạng thái mặc định là `"Chờ xác nhận"`.
   - Lấy `mahd` (Mã hóa đơn) vừa tạo và tổng số tiền thanh toán (đã trừ khuyến mãi/free ship).
3. **Kết nối MoMo API:**
   - Backend tạo Request gửi sang Cổng MoMo (Endpoint: `/v2/gateway/api/create`).
   - **Ký bảo mật (Signature):** Dùng thuật toán `HMAC_SHA256` để băm kết hợp các thông tin `partnerCode, accessKey, secretKey, orderId, amount, returnUrl, notifyUrl...`.
   - Gọi API MoMo. MoMo xác thực và trả về một `payUrl` (Đường dẫn trang thanh toán chính thức của MoMo).
4. **Chuyển hướng:** Backend gửi `payUrl` về Frontend. Frontend dùng lệnh `window.location.href = payUrl` để điều hướng thẳng khách sang ứng dụng MoMo (trên điện thoại) hoặc trang web thanh toán MoMo (trên máy tính).

### B. Quá trình Thanh toán (Trên nền tảng MoMo)
1. Khách hàng quét mã QR bằng App MoMo hoặc đăng nhập để xác nhận chuyển tiền.
2. Tiền được trừ khỏi ví/tài khoản ngân hàng của khách hàng. Máy chủ MoMo ghi nhận giao dịch thành công.

### C. Đồng bộ Kết quả Thanh toán (IPN & ReturnUrl)
Để website biết khách đã thanh toán thành công hay chưa, MoMo sử dụng 2 cơ chế:

1. **Return URL (Dành cho Trải nghiệm người dùng):**
   - Sau khi thanh toán, MoMo tự động chuyển hướng khách hàng quay lại website theo đường dẫn đã cấu hình (VD: `/payment-result?resultCode=0&orderId=...`).
   - Frontend hiển thị màn hình "Thanh toán thành công" (Nếu `resultCode == 0`) hoặc "Giao dịch thất bại" cho khách hàng xem.
2. **Notify URL / IPN - Instant Payment Notification (Dành cho Logic Backend):**
   - Cùng lúc với bước trên, Máy chủ MoMo tự động gọi ngầm một lệnh POST về một API ẩn của Backend (VD: `/api/Ctr_Momo/IPN`).
   - Backend kiểm tra lại **Chữ ký bảo mật (Signature)** do MoMo gửi sang để chống việc kẻ xấu giả mạo API truyền kết quả láo.
   - Nếu chữ ký hợp lệ và `resultCode == 0` (Thanh toán thành công):
     - Backend thực thi lệnh UPDATE thẳng vào Database đổi `trangthai = "Đã thanh toán"` cho mã hóa đơn tương ứng.
     - (Quy trình chốt đơn tự động hoàn tất, không cần nhân viên Admin đối soát tay).

---

## 8. Các Nghiệp Vụ Phụ Trợ (Tùy chọn)

### A. Quên Mật Khẩu (Forgot Password)
1. Người dùng nhập Email cần khôi phục mật khẩu.
2. Backend kiểm tra Email có tồn tại trong hệ thống không. Nếu có, sinh ra một mã OTP ngẫu nhiên (Lưu vào DB kèm theo hạn sử dụng 5-10 phút).
3. Backend sử dụng giao thức SMTP (VD: Gmail SMTP) gửi mã OTP qua Email cho khách hàng.
4. Khách hàng kiểm tra mail, nhập mã OTP lên màn hình.
5. Nếu OTP chính xác và chưa hết hạn, hệ thống mở khóa form nhập Mật khẩu mới.
6. Backend băm mật khẩu mới (Hash) và ghi đè vào DB, hoàn tất khôi phục.

### B. Đổi Mật Khẩu (Change Password)
1. Chỉ thực hiện được khi khách hàng đang Đăng Nhập (Có Token hợp lệ).
2. Khách hàng nhập form: Mật khẩu cũ, Mật khẩu mới, Xác nhận mật khẩu mới.
3. Backend giải mã JWT Token để lấy `UserId`, tìm user trong DB. Lấy mật khẩu cũ băm thử để so sánh với mật khẩu đang lưu.
4. Nếu khớp 100%, tiến hành băm mật khẩu mới và ghi đè vào DB. Thông báo đổi thành công.
