using BUS.Interface;
using DAL.Interface;
using Model;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BUS
{
    public class BUS_Thongke:Ibus_Thongke
    {
        Idal_Thongke dal;
        public BUS_Thongke(Idal_Thongke dal)
        {
            this.dal = dal;
        }
        public List<Thongkesanpham> top5sp_banchay(string type,int month, int year)
        {
            return dal.top5sp_banchay(type,month, year);
        }
        public Thongke_today thongke_ngay()
        {
            return dal.thongke_ngay();
        }
        public string thongke_year(int year)
        {
            return dal.thongke_year(year);
        }
        public Thongke_month Thongke_month(int month, int year)
        {
            return dal.Thongke_month(month, year);
        }
        public Thongke_year thongke_by_year(int year)
        {
            return dal.thongke_by_year(year);
        }
        public Thongketongquan thongketongquan()
        {
            return dal.thongketongquan();
        }
        public List<ThongkeDonhang> thongkeDonhang(int year)
        {
            return dal.thongkeDonhang(year);
        }
        public List<Thongkesanpham> top5sp_itduocmua(string type, int month, int year)
        {
            return dal.top5sp_itduocmua(type, month, year);
        }
    }
}
