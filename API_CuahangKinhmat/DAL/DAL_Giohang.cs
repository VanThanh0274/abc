using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL
{
    public class DAL_Giohang : Idal_Giohang
    {
        private IDbSql db;
        public DAL_Giohang(IDbSql db)
        {
            this.db = db;
        }

        public List<GiohangChitiet> GetByUser(int iduser)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_giohang_get_by_user", "@iduser", iduser);
            return dt.ConvertTo<GiohangChitiet>().ToList();
        }

        public bool AddItem(int iduser, int masp, int soluong)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_giohang_add_item",
                    "@iduser", iduser,
                    "@masp", masp,
                    "@soluong", soluong);
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

        public bool UpdateItem(int iduser, int masp, int soluong)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_giohang_update_item",
                    "@iduser", iduser,
                    "@masp", masp,
                    "@soluong", soluong);
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

        public bool RemoveItem(int iduser, int masp)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_giohang_remove_item",
                    "@iduser", iduser,
                    "@masp", masp);
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

        public bool Clear(int iduser)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_giohang_clear",
                    "@iduser", iduser);
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
    }
}
