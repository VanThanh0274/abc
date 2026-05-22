using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Thongkesanpham
    {
        public string ten {  get; set; }
        public int sl {  get; set; }
    }
    public class top5sp
    {
        public int masp { get; set; }
        public string ten { get; set; }
        public int sl { get; set; }
    }
    public class Thongke_month
    {
        

        public List<top5sp> list { get; set; }
        public string doanhthu { get; set; }
        public string loinhuan { get; set; }
        public Thongke_month(List<top5sp> list, string doanhthu, string loinhuan)
        {
            this.list = list;
            this.doanhthu = doanhthu;
            this.loinhuan = loinhuan;
        }
    }










    public class Doanhthu_thang {
        

        public int thang { get; set; }
        public int doanhthu_thang { get; set; }
        


    }

    public class Loinhuan_thang
    {
        

        public int thang { get; set; }
        public int loinhuan_thang { get; set; }
        

    }
    public class Thongke_year
    {
        
        public List<Doanhthu_thang> bddoanhthu { get; set; }
        public List<Loinhuan_thang> bdloinhuan { get; set; }
        public Thongke_year(List<Doanhthu_thang> bddoanhthu, List<Loinhuan_thang> bdloinhuan)
        {
            this.bddoanhthu = bddoanhthu;
            this.bdloinhuan = bdloinhuan;
        }


    }


    public class Thongke_today
    {
        public int doanhthu { get; set; }
        public int donhang { get; set; }
        public int kinhmat { get; set; }
    }
    public class Thongketongquan
    {
        public int donhang { get; set; }
        public int kinhmat { get; set; }
        public int danhmuc { get; set; }
    }

    public class ThongkeDonhang
    {
        public int thang { get; set; }
        public int soluong { get; set; }
    }
}
