using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL
{
    public class DAL_Danhgia : Idal_Danhgia
    {
        private IDbSql db;
        public DAL_Danhgia(IDbSql db)
        {
            this.db = db;
        }

        public bool Insert(Danhgia danhgia)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_danhgia_create",
                "@masp", danhgia.masp,
                "@iduser", danhgia.iduser,
                "@SoSao", danhgia.SoSao,
                "@BinhLuan", danhgia.BinhLuan);
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

        public List<Danhgia> GetByProduct(int masp)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_danhgia_getbyproduct", "@masp", masp);
            return dt.ConvertTo<Danhgia>().ToList();
        }

        public bool CheckUserPurchased(int idUser, int masp)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_danhgia_check_purchased", 
                "@iduser", idUser, 
                "@masp", masp);
            
            if (dt != null && dt.Rows.Count > 0)
            {
                int count = Convert.ToInt32(dt.Rows[0][0]);
                return count > 0;
            }
            return false;
        }
    }
}
