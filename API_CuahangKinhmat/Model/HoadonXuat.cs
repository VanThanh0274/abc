using System;
using System.Collections.Generic;

namespace Model
{
    // Hóa đơn xuất kho kiêm hóa đơn bán lẻ
    public class HoadonXuat
    {
        public int mahdx { get; set; }
        public int mahd { get; set; }
        public int iduser { get; set; }
        public DateTime ngayxuat { get; set; }
        public int tongtien { get; set; }
        public string nguoixuat { get; set; }
        public string ghichu { get; set; }
        public int trangthai { get; set; }
    }

    // Chi tiết một dòng trong hóa đơn xuất kho
    public class HoadonXuatChitiet
    {
        public int macthdx { get; set; }
        public int mahdx { get; set; }
        public int masp { get; set; }       // FK → Kinhmat.id
        public int soluong { get; set; }
        public int giaban { get; set; }
    }

    // Model mở rộng để hiển thị tên khách hàng + địa chỉ
    public class ModelHoadonXuat : HoadonXuat
    {
        public string tenkhachhang { get; set; }
        public string diachi { get; set; }
        public string sdt { get; set; }
    }

    // Model chi tiết xuất kho mở rộng (kèm tên sản phẩm, ảnh)
    public class ModelHoadonXuatChitiet : HoadonXuatChitiet
    {
        public string anh { get; set; }
        public string tensp { get; set; }
    }

    // Request tạo hóa đơn xuất từ đơn hàng
    public class TaoHoadonXuatRequest
    {
        public int mahd { get; set; }
        public string nguoixuat { get; set; }
        public string ghichu { get; set; }
    }
}
