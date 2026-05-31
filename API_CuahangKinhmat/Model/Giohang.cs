using System;
using System.Collections.Generic;

namespace Model
{
    public class Giohang
    {
        public int id { get; set; }
        public int iduser { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public List<GiohangChitiet> ChiTiet { get; set; } = new List<GiohangChitiet>();
    }

    public class GiohangChitiet
    {
        public int id { get; set; }
        public int id_giohang { get; set; }
        public int masp { get; set; }
        public int soluong { get; set; }
        public DateTime NgayThem { get; set; }

        // Extra info for displaying cart
        public string TenSanPham { get; set; }
        public int GiaBan { get; set; }
        public string Anh { get; set; }
        public int TongTien => GiaBan * soluong;
    }
}
