using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DAL_Kinhmat:IDAL_kinhmat
    {
        private IDbSql db;
        public DAL_Kinhmat(IDbSql db)
        {
            this.db = db;
        }

        public ResponseData<List<modelKinhmat>> Getall(int page_number, int page_size)
        {
            string msg = "";
            var dx= db.Listobject(out msg, "sp_kinhmat_select_all");
            var dt = db.Listobject(out msg, "sp_demopageGetALl_SanPham",
                "@page_number",page_number,
                "@page_size",page_size);
            double cx = Math.Ceiling((double)dx.Rows.Count / page_size);
            ResponseData<List<modelKinhmat>> a = new ResponseData<List<modelKinhmat>>(
                page_number, page_size, Math.Ceiling(cx),
                dt.ConvertTo<modelKinhmat>().ToList()
                );


            return a;

        }
        public Kinhmat Getbyid(string id)
        {
            string msg = "";
            var dt = db.Listobject(out msg,"sp_kinhmat_select_by_id","@id",id);
            
            return dt.ConvertTo<Kinhmat>().FirstOrDefault();

        }

        public bool Update(Kinhmat model)
        {
            string msgError = "";
            try
            {
                var result = db.writeProcedure(out msgError, "sp_kinhmat_update",
                "@id",model.id,
                "@ten", model.ten,
                "@soluong", model.soluong,
                "@madanhmuc", model.madanhmuc,
                "@giaban", model.giaban,
                "@gianhap", model.gianhap,
                "@gioithieu", model.gioithieu,
                "@xuatxu", model.xuatxu,
                "@chatlieu", model.chatlieu,
                "@kieudang", model.kieudang,
                "@mota", model.mota,
                "@anh", model.anh,
                "@trangthai", model.trangthai);

                if ((result != null && !string.IsNullOrEmpty(result.ToString())) || !string.IsNullOrEmpty(msgError))
                {
                    throw new Exception(Convert.ToString(result) + msgError);
                }
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
                var obj = db.writeProcedure(out msg, "sp_kinhmat_delete", "@id", id);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                {
                    throw new Exception(Convert.ToString(obj) + msg);
                }
                return true;
            }catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool Add(Kinhmat model)
        {
            string msgError = "";
            try
            {
                var result = db.writeProcedure(out msgError, "sp_kinhmat_create",
                "@ten", model.ten,
                "@soluong", model.soluong,
                "@madanhmuc", model.madanhmuc,
                "@giaban", model.giaban,
                "@gianhap", model.gianhap,
                "@gioithieu", model.gioithieu,
                "@xuatxu", model.xuatxu,
                "@chatlieu", model.chatlieu,
                "@kieudang", model.kieudang,
                "@mota", model.mota,
                "@anh", model.anh,
                "@trangthai", model.trangthai);

                if ((result != null && !string.IsNullOrEmpty(result.ToString())) || !string.IsNullOrEmpty(msgError))
                {
                    throw new Exception(Convert.ToString(result) + msgError);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }
        public ResponseData<List<Kinhmat>> Getalltheodanhmuc(int madanhmuc, int page_number, int page_size)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_u_kinhmatdanhmuc",
                "@madanhmuc", madanhmuc,
                "@page_number", page_number,
                "@page_size", page_size);
            int count = int.Parse(db.GetString($"exec sp_u_total_product_category_id {madanhmuc}"));
            double total = Math.Ceiling((double)count / page_size);
            ResponseData<List<Kinhmat>> a = new ResponseData<List<Kinhmat>>(
                page_number, 
                page_size, 
                Math.Ceiling(total),
                dt.ConvertTo<Kinhmat>().ToList()
                );

            try
            {
                return a;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public ResponseData<List<Kinhmat>> Search(string? ten, int page_number, int page_size)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_u_kinhmat_search",
                "@ten", ten,
                "@page_number", page_number,
                "@page_size", page_size);
            int s = int.Parse(db.GetString($"exec sp_u_total_search '{ten}'"));
            double total = Math.Ceiling((double)s / page_size);
            List<Kinhmat> d = dt.ConvertTo<Kinhmat>().ToList();
            ResponseData<List<Kinhmat>> a = new ResponseData<List<Kinhmat>>(
                page_number, page_size, Math.Ceiling(total),
                d
                );
            try
            {
                return a;
            }
            catch (Exception ex)
            {
                throw ex;
            }



        }

        public ResponseData<List<modelKinhmat>> SearchAdmin(string kinhmat, int page_number, int page_size)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_kinhmat_search",
                "@kinhmat", kinhmat,
                "@page_number", page_number,
                "@page_size", page_size);
            int s = int.Parse(db.GetString($"exec sp_u_total_search '{kinhmat}'"));
            double total = Math.Ceiling((double)s / page_size);

            ResponseData<List<modelKinhmat>> list = new ResponseData<List<modelKinhmat>>(
                page_number, page_size, Math.Ceiling(total),
                dt.ConvertTo<modelKinhmat>().ToList()
                );
            try
            {
                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<Kinhmat> Getallgioithieu(string gioithieu)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_u_kinhmat_gioithieu",
                "@gioithieu", gioithieu);

            return dt.ConvertTo<Kinhmat>().ToList();

        }
        public List<Kinhmat> FilterKinhmat(string chatlieu, string kieudang)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_u_LocKinhMat",
                "@ChatlieuList", chatlieu,
                "@KieudangList",kieudang);

            return dt.ConvertTo<Kinhmat>().ToList();

        }
    }
}
