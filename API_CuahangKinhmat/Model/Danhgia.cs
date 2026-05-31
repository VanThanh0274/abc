using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Danhgia
    {
        public int id { get; set; }
        public int masp { get; set; }
        public int iduser { get; set; }
        public int SoSao { get; set; }
        public string BinhLuan { get; set; }
        public DateTime NgayTao { get; set; }

        // Extra fields for displaying review
        public string TenNguoiDung { get; set; } 

        public Danhgia() { }

        public Danhgia(int id, int masp, int iduser, int soSao, string binhLuan, DateTime ngayTao, string tenNguoiDung = "")
        {
            this.id = id;
            this.masp = masp;
            this.iduser = iduser;
            this.SoSao = soSao;
            this.BinhLuan = binhLuan;
            this.NgayTao = ngayTao;
            this.TenNguoiDung = tenNguoiDung;
        }
    }
}
