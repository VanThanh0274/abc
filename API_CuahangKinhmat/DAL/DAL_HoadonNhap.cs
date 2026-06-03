using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Data;

namespace DAL
{
    public class DAL_HoadonNhap : IDAL_HoadonNhap
    {
        private IDbSql sql;
        public DAL_HoadonNhap(IDbSql sql) { this.sql = sql; }

        public List<ModelHoadonNhap> GetAll()
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_hoadonnhap_getall");
            try { return dt.ConvertTo<ModelHoadonNhap>().ToList(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public ModelHoadonNhap GetById(int mahdn)
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_hoadonnhap_getbyid", "@mahdn", mahdn);
            try { return dt.ConvertTo<ModelHoadonNhap>().FirstOrDefault(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public List<ModelHoadonNhapChitiet> GetChitietById(int mahdn)
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_hoadonnhap_chitiet_getbyid", "@mahdn", mahdn);
            try { return dt.ConvertTo<ModelHoadonNhapChitiet>().ToList(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public int Create(HoadonNhap model)
        {
            string msg = "";
            try
            {
                var dt = sql.Listobject(out msg, "sp_hoadonnhap_create",
                    "@mancc", model.mancc,
                    "@nguoinhap", model.nguoinhap ?? "",
                    "@ghichu", model.ghichu ?? "");
                if (!string.IsNullOrEmpty(msg)) throw new Exception(msg);
                if (dt != null && dt.Rows.Count > 0)
                    return Convert.ToInt32(dt.Rows[0]["mahdn"]);
                return 0;
            }
            catch (Exception ex) { throw ex; }
        }

        public bool Update(HoadonNhap model)
        {
            string msg = "";
            try
            {
                var obj = sql.writeProcedure(out msg, "sp_hoadonnhap_update",
                    "@mahdn", model.mahdn,
                    "@mancc", model.mancc,
                    "@nguoinhap", model.nguoinhap ?? "",
                    "@ghichu", model.ghichu ?? "");
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                    throw new Exception(Convert.ToString(obj) + msg);
                return true;
            }
            catch (Exception ex) { throw ex; }
        }

        public bool AddChitiet(HoadonNhapChitiet chitiet)
        {
            string msg = "";
            try
            {
                var obj = sql.writeProcedure(out msg, "sp_hoadonnhap_addchitiet",
                    "@mahdn", chitiet.mahdn,
                    "@masp", chitiet.masp,
                    "@soluong", chitiet.soluong,
                    "@gianhap", chitiet.gianhap);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                    throw new Exception(Convert.ToString(obj) + msg);
                return true;
            }
            catch (Exception ex) { throw ex; }
        }

        public bool Confirm(int mahdn)
        {
            string msg = "";
            try
            {
                var obj = sql.writeProcedure(out msg, "sp_hoadonnhap_confirm", "@mahdn", mahdn);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                    throw new Exception(Convert.ToString(obj) + msg);
                return true;
            }
            catch (Exception ex) { throw ex; }
        }
    }
}
