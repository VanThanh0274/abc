using System;

namespace Model
{
    public class Blog
    {
        public int id { get; set; }
        public string? tieude { get; set; }
        public string? noidung { get; set; }
        public string? tomtat { get; set; }
        public string? anh { get; set; }
        public int? madanhmuc { get; set; }
        public string? tendanhmuc { get; set; } // Thuộc tính join từ bảng DanhMucBlog
        public string? tacgia { get; set; }
        public int luotxem { get; set; }
        public int trangthai { get; set; }
        public DateTime ngaytao { get; set; }
        public DateTime ngaycapnhat { get; set; }
    }

    public class DanhMucBlog
    {
        public int id { get; set; }
        public string ten { get; set; }
        public int trangthai { get; set; }
    }
}
