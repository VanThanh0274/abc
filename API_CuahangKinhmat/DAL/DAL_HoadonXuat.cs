using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Data;

namespace DAL
{
    public class DAL_HoadonXuat : IDAL_HoadonXuat
    {
        private IDbSql sql;
        public DAL_HoadonXuat(IDbSql sql) { this.sql = sql; }

        public List<ModelHoadonXuat> GetAll()
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_hoadonxuat_getall");
            try { return dt.ConvertTo<ModelHoadonXuat>().ToList(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public ModelHoadonXuat GetById(int mahdx)
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_hoadonxuat_getbyid", "@mahdx", mahdx);
            try { return dt.ConvertTo<ModelHoadonXuat>().FirstOrDefault(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public List<ModelHoadonXuatChitiet> GetChitietById(int mahdx)
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_hoadonxuat_chitiet_getbyid", "@mahdx", mahdx);
            try { return dt.ConvertTo<ModelHoadonXuatChitiet>().ToList(); }
            catch (Exception ex) { throw new Exception(ex + msg); }
        }

        public int CreateFromDonhang(TaoHoadonXuatRequest request)
        {
            string msg = "";
            try
            {
                var dt = sql.Listobject(out msg, "sp_hoadonxuat_create_from_donhang",
                    "@mahd", request.mahd,
                    "@nguoixuat", request.nguoixuat ?? "",
                    "@ghichu", request.ghichu ?? "");
                if (!string.IsNullOrEmpty(msg)) throw new Exception(msg);
                if (dt != null && dt.Rows.Count > 0)
                {
                    return Convert.ToInt32(dt.Rows[0]["mahdx"]);
                }
                return 0;
            }
            catch (Exception ex) { throw ex; }
        }
    }
}
