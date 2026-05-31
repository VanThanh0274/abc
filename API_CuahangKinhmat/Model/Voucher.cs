using System;

namespace Model
{
    public class Voucher
    {
        public int id { get; set; }
        public string MaVoucher { get; set; }
        public decimal PhanTramGiam { get; set; }
        public decimal GiamToiDa { get; set; }
        public decimal DonToiThieu { get; set; }
        public int SoLuong { get; set; }
        public int DaDung { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public int TrangThai { get; set; }

        public Voucher() { }
    }
}
