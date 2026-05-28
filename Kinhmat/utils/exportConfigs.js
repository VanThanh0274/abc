/**
 * Cấu hình định nghĩa cột (column definitions) cho từng module xuất Excel.
 * Mỗi cột có: key (tên field trong data), label (tiêu đề hiển thị), width (độ rộng cột)
 */

// ── 1. Đơn hàng ──────────────────────────────────────────────────────────────
export const COLUMNS_DONHANG = [
  { key: 'mahd',      label: 'Mã Đơn Hàng',    width: 14 },
  { key: 'ten',       label: 'Khách Hàng',      width: 25 },
  { key: 'sdt',       label: 'Số Điện Thoại',   width: 16 },
  { key: 'email',     label: 'Email',            width: 28 },
  { key: 'diachi',    label: 'Địa Chỉ',          width: 40 },
  { key: 'tongtien',  label: 'Tổng Tiền (đ)',    width: 18 },
  { key: 'trangthai', label: 'Trạng Thái',       width: 16 },
  { key: 'thoigian',  label: 'Ngày Đặt',         width: 20 },
  { key: 'ghichu',    label: 'Ghi Chú',          width: 30 },
];

// ── 2. Sản phẩm (Kính mắt) ───────────────────────────────────────────────────
export const COLUMNS_KINHMAT = [
  { key: 'id',       label: 'Mã SP',           width: 10 },
  { key: 'ten',      label: 'Tên Sản Phẩm',   width: 35 },
  { key: 'danhmuc',  label: 'Danh Mục',        width: 20 },
  { key: 'giaban',   label: 'Giá Bán (đ)',     width: 16 },
  { key: 'gianhap',  label: 'Giá Nhập (đ)',    width: 16 },
  { key: 'soluong',  label: 'Tồn Kho',         width: 12 },
  { key: 'kieudang', label: 'Kiểu Dáng',       width: 16 },
  { key: 'chatlieu', label: 'Chất Liệu',       width: 18 },
  { key: 'xuatxu',   label: 'Xuất Xứ',         width: 16 },
  { key: 'trangthai',label: 'Trạng Thái',      width: 14 },
];

// ── 3. Người dùng ─────────────────────────────────────────────────────────────
export const COLUMNS_NGUOIDUNG = [
  { key: 'id',       label: 'ID',             width: 8  },
  { key: 'ten',      label: 'Họ Tên',         width: 25 },
  { key: 'username', label: 'Username',       width: 20 },
  { key: 'email',    label: 'Email',          width: 28 },
  { key: 'sdt',      label: 'Số Điện Thoại', width: 16 },
  { key: 'role',     label: 'Vai Trò',        width: 12 },
  { key: 'is_vip',   label: 'VIP',            width: 10 },
  { key: 'diachi',   label: 'Địa Chỉ',        width: 35 },
];

// ── 4. Hóa đơn Nhập kho ───────────────────────────────────────────────────────
export const COLUMNS_HOADON_NHAP = [
  { key: 'mahdn',         label: 'Mã HĐ Nhập',      width: 14 },
  { key: 'nhacungcap',    label: 'Nhà Cung Cấp',     width: 25 },
  { key: 'nguoinhan',     label: 'Người Nhận',       width: 25 },
  { key: 'ngaynhap',      label: 'Ngày Nhập',        width: 18 },
  { key: 'tongtien',      label: 'Tổng Tiền (đ)',    width: 18 },
  { key: 'trangthai',     label: 'Trạng Thái',       width: 18 },
  { key: 'ghichu',        label: 'Ghi Chú',          width: 30 },
];

// ── 5. Hóa đơn Xuất kho ───────────────────────────────────────────────────────
export const COLUMNS_HOADON_XUAT = [
  { key: 'mahdx',      label: 'Mã HĐ Xuất',     width: 14 },
  { key: 'mahd',       label: 'Mã Đơn Hàng',    width: 14 },
  { key: 'nguoixuat',  label: 'Người Xuất',      width: 25 },
  { key: 'ngaynhap', label: 'Ngày Nhập', width: 20 },
  { key: 'tongtien', label: 'Tổng Tiền', width: 18 },
  { key: 'ghichu', label: 'Ghi Chú', width: 30 },
];

export const COLUMNS_BLOG = [
  { key: 'id', label: 'Mã', width: 8 },
  { key: 'tieude', label: 'Tiêu Đề', width: 45 },
  { key: 'tendanhmuc', label: 'Danh Mục', width: 20 },
  { key: 'tacgia', label: 'Tác Giả', width: 20 },
  { key: 'luotxem', label: 'Lượt Xem', width: 12 },
  { key: 'trangthai', label: 'Trạng Thái', width: 14 },
  { key: 'ngaytao', label: 'Ngày Đăng', width: 20 },
];

// ── 6. Nhà cung cấp ───────────────────────────────────────────────────────────
export const COLUMNS_NHACUNGCAP = [
  { key: 'ma',       label: 'Mã NCC',          width: 10 },
  { key: 'ten',      label: 'Tên Nhà Cung Cấp',width: 30 },
  { key: 'diachi',   label: 'Địa Chỉ',         width: 35 },
  { key: 'sdt',      label: 'Số Điện Thoại',   width: 16 },
  { key: 'email',    label: 'Email',            width: 28 },
];

// ── 7. Khuyến mãi ─────────────────────────────────────────────────────────────
export const COLUMNS_KHUYENMAI = [
  { key: 'ma',          label: 'Mã KM',         width: 10 },
  { key: 'ten',         label: 'Tên Khuyến Mãi',width: 30 },
  { key: 'phantram',    label: 'Phần Trăm (%)',  width: 16 },
  { key: 'ngaybatdau',  label: 'Ngày Bắt Đầu',  width: 18 },
  { key: 'ngayketthuc', label: 'Ngày Kết Thúc', width: 18 },
  { key: 'trangthai',   label: 'Trạng Thái',     width: 14 },
];

// ── 8. Thống kê — Doanh thu & Lợi nhuận theo tháng ───────────────────────────
export const COLUMNS_THONGKE_DOANHTHU = [
  { key: 'thang',          label: 'Tháng',           width: 12 },
  { key: 'doanhthu_thang', label: 'Doanh Thu (đ)',   width: 20 },
  { key: 'loinhuan_thang', label: 'Lợi Nhuận (đ)',  width: 20 },
];

// ── 9. Thống kê — Đơn hàng theo tháng ────────────────────────────────────────
export const COLUMNS_THONGKE_DONHANG = [
  { key: 'thang',   label: 'Tháng',          width: 12 },
  { key: 'soluong', label: 'Số Đơn Hàng',   width: 18 },
];

// ── 10. Thống kê — Top sản phẩm ──────────────────────────────────────────────
export const COLUMNS_TOP_SANPHAM = [
  { key: 'masp', label: 'Mã SP',          width: 10 },
  { key: 'ten',  label: 'Tên Sản Phẩm', width: 35 },
  { key: 'sl',   label: 'Số Lượng Bán', width: 16 },
];
