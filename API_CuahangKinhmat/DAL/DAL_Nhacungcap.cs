using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using DAL.SQL;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DAL
{
    public class DAL_Nhacungcap:IDAL_Nhacungcap
    {
        private IDbSql sql;
        //DbSql sql = new DbSql();
        public DAL_Nhacungcap(IDbSql sql)
        {
            this.sql = sql;
        }
        
        public List<Nhacungcap> Getall()
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_nhacungcap_select_all");
            try
            {
                return dt.ConvertTo<Nhacungcap>().ToList();
            }
            catch(Exception ex)
            {
                throw new Exception(ex+ msg);
            }

        }
        public bool Add(Nhacungcap ncc)
        {
            string msg = "";
            try
            {
                var obj = sql.writeProcedure(out msg, "sp_nhacungcap_create",
                "@tenncc", ncc.tenncc,
                "@sdt", ncc.sdt,
                "@email", ncc.email,
                "@diachi", ncc.diachi,
                "@trangthai", ncc.trangthai);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                {
                    throw new Exception(Convert.ToString(obj) + msg);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public bool Delete(string id)
        {
            string msg = "";
            try
            {
                var obj = sql.writeProcedure(out msg, "sp_nhacungcap_delete", "@id", id);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                {
                    throw new Exception(Convert.ToString(obj) + msg);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public bool Update(Nhacungcap ncc)
        {
            string msg = "";
            try
            {
                var obj = sql.writeProcedure(out msg, "sp_nhacungcap_update",
                "@id",ncc.id,
                "@tenncc", ncc.tenncc,
                "@sdt", ncc.sdt,
                "@email", ncc.email,
                "@diachi", ncc.diachi,
                "@trangthai", ncc.trangthai);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                {
                    throw new Exception(Convert.ToString(obj) + msg);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public List<Nhacungcap> Search(string keyword)
        //{
        //    string query = $"SELECT * FROM Nhacungcap WHERE Tenncc LIKE N'%{keyword}%' OR Sdt LIKE '%{keyword}%' OR Email LIKE '%{keyword}%' OR Diachi LIKE N'%{keyword}%'";
        //    DataTable result = sql.ListObj(query);

        //    List<Nhacungcap> list = new List<Nhacungcap>();
        //    foreach (DataRow row in result.Rows)
        //    {
        //        Nhacungcap ncc = new Nhacungcap
        //        {
        //            Mancc = Convert.ToInt32(row["mancc"].ToString()),
        //            Tenncc = row["tenncc"].ToString(),
        //            Sdt = row["sdt"].ToString(),
        //            Email = row["email"].ToString(),
        //            Diachi = row["diachi"].ToString()
        //        };
        //        list.Add(ncc);
        //    }
        //    return list;
        //}
        public Nhacungcap GetNCCbyID(int id)
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_nhacungcap_select_by_id","@id",id);
            try
            {
                return dt.ConvertTo<Nhacungcap>().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception(ex + msg);
            }
        }
        


    }
}
