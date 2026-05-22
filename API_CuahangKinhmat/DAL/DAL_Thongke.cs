using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DAL
{
    public class DAL_Thongke:Idal_Thongke
    {
        IDbSql db;
        public DAL_Thongke(IDbSql db)
        {
            this.db = db;
        }
        public List<Thongkesanpham> top5sp_banchay(string type,int month, int year)
        {
            try
            {
                string msg = "";
                var dt = db.Listobject(out msg, "sp_thongke_top5product_banchay2",
                    "type",type,
                    "@month", month,
                    "@year", year);
                return dt.ConvertTo<Thongkesanpham>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public Thongke_today thongke_ngay()
        {
            try
            {
                string msg = "";
                var dt = db.Listobject(out msg, "sp_thongke_doanhthu_today");
                if (!string.IsNullOrEmpty(msg))
                {
                    throw new Exception(msg);
                }
                return dt.ConvertTo<Thongke_today>().FirstOrDefault();
            }catch (Exception ex)
            {
                throw ex;
            }
        }
        public string thongke_year(int year)
        {
            return db.reader("sp_thongke_year", year);

        }
        public Thongke_year thongke_by_year(int year)
        {
            string msg = "";
            var list1 = db.Listobject(out msg, "sp_doanhthu_by_year",
                "@year", year);
            var list2 = db.Listobject(out msg, "sp_loinhuan_by_year",
                "@year", year);
            return new Thongke_year(
                    list1.ConvertTo<Doanhthu_thang>().ToList(),
                    list2.ConvertTo<Loinhuan_thang>().ToList());

        }
        public Thongke_month Thongke_month(int month,int year)
        {
            string msg = "";
            List<top5sp> list;
            var dt = db.Listobject(out msg, "sp_thongke_month_kinhmat",
                "@month", month,
                "@year", year);
            list=dt.ConvertTo<top5sp>().ToList();
            var dx = db.Listobject(out msg, "sp_thongke_month_doanhthu",
                "@month", month,
                "@year", year);
            if(dx.Rows.Count == 1)
            {
                return new Thongke_month(
                    list,
                    dx.Rows[0][0].ToString(),
                    dx.Rows[0][1].ToString());
            }
            return null;
        }
        public Thongketongquan thongketongquan()
        {
            try
            {
                string msg = "";
                var dt = db.Listobject(out msg, "sp_thongke_tongquan");
                if (!string.IsNullOrEmpty(msg))
                {
                    throw new Exception(msg);
                }
                return dt.ConvertTo<Thongketongquan>().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public List<ThongkeDonhang> thongkeDonhang(int year)
        {
            try
            {
                string msg = "";
                var dt = db.Listobject(out msg, "sp_thongke_soluong_donhang_byyear",
                    "@year", year);
                return dt.ConvertTo<ThongkeDonhang>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<Thongkesanpham> top5sp_itduocmua(string type, int month, int year)
        {
            try
            {
                string msg = "";
                var dt = db.Listobject(out msg, "sp_thongke_top5product_itduocmua",
                    "type", type,
                    "@month", month,
                    "@year", year);
                return dt.ConvertTo<Thongkesanpham>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public string thongke_year(int year)
        //{
        //    try
        //    {
        //        string msg = "";
        //        var dt = db.ListObj("exec sp_thongke_year "+year);






        //        if (!string.IsNullOrEmpty(msg))
        //        {
        //            throw new Exception(msg);
        //        }
        //        return JsonConvert.SerializeObject(dt);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }

        //}
    }
}