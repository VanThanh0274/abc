using System;

namespace Model
{
    public class Khuyenmai
    {
        public int id { get; set; }
        public string ma_km { get; set; }
        public string ten_km { get; set; }
        public string mota { get; set; }
        public int loai_km { get; set; }
        public int giatri_km { get; set; }
        public int dieukien_toithieu { get; set; }
        public DateTime ngaybatdau { get; set; }
        public DateTime ngayketthuc { get; set; }
        public int is_vip_only { get; set; }
        public int trangthai { get; set; }
    }
}
