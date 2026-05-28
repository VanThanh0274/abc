using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Data;

namespace DAL
{
    public class DAL_LichSuGia : IDAL_LichSuGia
    {
        private IDbSql sql;
        public DAL_LichSuGia(IDbSql sql) { this.sql = sql; }

        public List<ModelLichSuGia> GetAll_Active()
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_lichsugia_getall_active");
            try { return dt.ConvertTo<ModelLichSuGia>().ToList(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public List<ModelLichSuGia> GetBySKU(int masp)
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_lichsugia_getbysku", "@masp", masp);
            try { return dt.ConvertTo<ModelLichSuGia>().ToList(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public bool Create(LichSuGia model)
        {
            string msg = "";
            try
            {
                var obj = sql.writeProcedure(out msg, "sp_lichsugia_create",
                    "@masp", model.masp,
                    "@gianhap", model.gianhap,
                    "@giaban", model.giaban);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                    throw new Exception(Convert.ToString(obj) + msg);
                return true;
            }
            catch (Exception ex) { throw ex; }
        }
    }
}
