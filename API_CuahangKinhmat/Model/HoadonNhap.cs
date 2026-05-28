using System;
using System.Collections.Generic;

namespace Model
{
    // Hóa đơn nhập kho tổng quát
    public class HoadonNhap
    {
        public int mahdn { get; set; }
        public int mancc { get; set; }
        public DateTime ngaynhap { get; set; }
        public int tongtien { get; set; }
        public string nguoinhap { get; set; }
        public string ghichu { get; set; }
        public int trangthai { get; set; }
        // Danh sách chi tiết khi tạo hóa đơn
        public List<HoadonNhapChitiet> chitiet { get; set; }
    }

    // Chi tiết một dòng trong hóa đơn nhập kho
    public class HoadonNhapChitiet
    {
        public int macthdn { get; set; }
        public int mahdn { get; set; }
        public int masp { get; set; }       // FK → Kinhmat.id
        public int soluong { get; set; }
        public int gianhap { get; set; }
    }

    // Model mở rộng để hiển thị tên NCC + chi tiết đầy đủ
    public class ModelHoadonNhap : HoadonNhap
    {
        public string tenncc { get; set; }
    }

    // Model chi tiết nhập kho mở rộng (kèm tên sản phẩm, ảnh)
    public class ModelHoadonNhapChitiet : HoadonNhapChitiet
    {
        public string anh { get; set; }
        public string tensp { get; set; }
    }
}
