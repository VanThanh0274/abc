using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DAL_Nguoidung: Idal_Nguoidung
    {
        private IDbSql db;
        public DAL_Nguoidung(IDbSql db)
        {
            this.db = db;
        }
        public Nguoidung GetUser(string user, string pass)
        {
            string msg = "ds";
            var obj = db.Listobject(out msg, "sp_login",
                "@username", user,
                "@pass", pass);
            return obj.ConvertTo<Nguoidung>().FirstOrDefault();

            //string query = $"select*from Nguoidung where username='{user}' and pass='{pass}'";
            //var dt = db.ListObj(query);
            //if(dt.Rows.Count == 1)
            //{
            //    var d = dt.Rows[0];
            //    return new Nguoidung
            //        (
            //            int.Parse(d[0].ToString()),
            //            d[1].ToString(),
            //            d[2].ToString(),
            //            d[3].ToString(),
            //            d[4].ToString(),
            //            d[5].ToString(),
            //            d[6].ToString(),
            //            int.Parse(d[7].ToString())
            //        );
            //}
            //return null;
        }
        public Nguoidung Getbyid(int id)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_u_profile_byid",
                "@id", id);
            return dt.ConvertTo<Nguoidung>().FirstOrDefault();
        }
        public bool ChangePassword(string password, int id)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_u_change_password",
                "@password", password,
                "@id",id);
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

        public bool Insert(Nguoidung nguoidung)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_nguoidung_create",
                "@username", nguoidung.username,
                "@pass", nguoidung.pass,
                "@ten", nguoidung.ten,
                "@sdt", nguoidung.sdt,
                "@email", nguoidung.email,
                "@role",nguoidung.role,
                "@trangthai",nguoidung.trangthai);
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
        public bool Update(Nguoidung nguoidung)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_u_nguoidung_Update",
                "@id", nguoidung.id,
                "@ten", nguoidung.ten,
                "@sdt", nguoidung.sdt,
                "@email", nguoidung.email);
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

        public bool UpdateRole(int id, string role, int state )
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_nguoidung_Update",
                "@id", id,
                "@role",role,
                "@state", state);
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

        public ResponseData<List<Nguoidung>> Getall(int page_number, int page_size)
        {
            string msg = "";
            int count = int.Parse(
                            db.GetString("select count(id) from Nguoidung")
                        );
            var dt = db.Listobject(out msg, "sp_user_getall",
                "@page_number", page_number,
                "@page_size", page_size);
            double total = Math.Ceiling((double)count / page_size);
            ResponseData<List<Nguoidung>> a = new ResponseData<List<Nguoidung>>(
                page_number,
                page_size,
                Math.Ceiling(total),
                dt.ConvertTo<Nguoidung>().ToList()
                );


            return a;

        }

    }
    
}
