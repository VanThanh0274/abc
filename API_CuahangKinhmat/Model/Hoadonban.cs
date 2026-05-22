using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    //insert
    public class Donhang
    {
        public int mahd { get; set; }
        public int iduser { get; set; }
        public string ten { get; set; }
        public string sdt { get; set; }
        public string email { get; set; }
        public string diachi { get; set; }
        public string ghichu { get; set; }
        public DateTime thoigian { get; set; }
        public int tongtien { get; set; }
        public string trangthai { get; set; }
        public List<DonhangChitiet> listjson_chitiet { get; set; } 
    }
    public class DonhangChitiet
    {
        public int macthd { get; set; }
        public int mahd { get; set; }
        public int masp { get; set; }
        public int soluong { get; set; }
        public int giaban { get; set; }
    }


    //get all lấy thông qua nhiều bảng cửa hóa đơn
    public class ModelDonhang
    {
        public int mahd { get; set; }
        public int iduser { get; set; }
        public string ten { get; set; }
        public string sdt { get; set; }
        public string email { get; set; }
        public string diachi { get; set; }
        public string ghichu { get; set; }
        public DateTime thoigian { get; set; }
        public int tongtien { get; set; }
        public string trangthai { get; set; }
        public List<ModelDonhangChitiet> listjson_chitiet { get; set; }
    }
    public class ModelDonhangChitiet
    {
        public int macthd { get; set; }
        public int mahd { get; set; }
        public int masp { get; set; }
        public string ten { get; set; }
        public string anh { get; set; }
        public int soluong { get; set; }
        public int giaban { get; set; }
    }

    public class Thongtinvanchuyen
    {
        public string mavandon { get; set; }
        public int mahd { get; set; }
        public string donvivanchuyen { get; set; }
        public string ngaygiao { get; set; }
        public string ngaynhan { get; set; }
        public string trangthai { get; set; }
    }
}
