using Model;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BUS.Interface
{
    public interface Ibus_Thongke
    {
        List<Thongkesanpham> top5sp_banchay(string type, int month, int year);
        public Thongke_today thongke_ngay();
        string thongke_year(int year);
        public Thongke_month Thongke_month(int month, int year);
        public Thongke_year thongke_by_year(int year);
        public Thongketongquan thongketongquan();
        public List<ThongkeDonhang> thongkeDonhang(int year);
        public List<Thongkesanpham> top5sp_itduocmua(string type, int month, int year);
    }
}
