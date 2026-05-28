using System;
using System.Collections.Generic;

namespace Model
{
    // Lịch sử giá của một sản phẩm kính mắt (FK → Kinhmat.id)
    public class LichSuGia
    {
        public int id { get; set; }
        public int masp { get; set; }       // FK → Kinhmat.id
        public int gianhap { get; set; }
        public int giaban { get; set; }
        public DateTime ngayapdung { get; set; }
        public DateTime? ngayketthuc { get; set; }
        public int trangthai { get; set; }
    }

    // Model mở rộng để hiển thị tên sản phẩm
    public class ModelLichSuGia : LichSuGia
    {
        public string anh { get; set; }
        public string tensp { get; set; }
    }
}
