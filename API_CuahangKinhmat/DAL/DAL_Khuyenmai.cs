using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL
{
    public class DAL_Khuyenmai : IDAL_Khuyenmai
    {
        private IDbSql db;
        public DAL_Khuyenmai(IDbSql db)
        {
            this.db = db;
        }

        public List<Khuyenmai> GetAll()
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_km_getall");
            return dt.ConvertTo<Khuyenmai>().ToList();
        }

        public Khuyenmai GetByCode(string ma_km)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_km_getbycode", "@ma_km", ma_km);
            return dt.ConvertTo<Khuyenmai>().FirstOrDefault();
        }

        public bool Create(Khuyenmai model)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_km_create",
                    "@ma_km", model.ma_km,
                    "@ten_km", model.ten_km,
                    "@mota", model.mota,
                    "@loai_km", model.loai_km,
                    "@giatri_km", model.giatri_km,
                    "@dieukien_toithieu", model.dieukien_toithieu,
                    "@ngaybatdau", model.ngaybatdau,
                    "@ngayketthuc", model.ngayketthuc,
                    "@is_vip_only", model.is_vip_only,
                    "@trangthai", model.trangthai);
                if (!string.IsNullOrEmpty(msg)) throw new Exception(msg);
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool Update(Khuyenmai model)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_km_update",
                    "@id", model.id,
                    "@ma_km", model.ma_km,
                    "@ten_km", model.ten_km,
                    "@mota", model.mota,
                    "@loai_km", model.loai_km,
                    "@giatri_km", model.giatri_km,
                    "@dieukien_toithieu", model.dieukien_toithieu,
                    "@ngaybatdau", model.ngaybatdau,
                    "@ngayketthuc", model.ngayketthuc,
                    "@is_vip_only", model.is_vip_only,
                    "@trangthai", model.trangthai);
                if (!string.IsNullOrEmpty(msg)) throw new Exception(msg);
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool Delete(int id)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_km_delete", "@id", id);
                if (!string.IsNullOrEmpty(msg)) throw new Exception(msg);
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
