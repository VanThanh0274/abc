using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DAL_Donhang:Idal_Donhang
    {
        private IDbSql db;
        public DAL_Donhang(IDbSql db)
        {
            this.db = db;
        }
        public ResponseData<List<Donhang>> Getall(int page_number,int page_size)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_donhang_getall",
                "@page_number",page_number,
                "@page_size", page_size);
            int count = int.Parse(
                            db.GetString("select count(mahd) from Donhang")
                        );

            double total = Math.Ceiling((double)count / page_size);
            ResponseData<List<Donhang>> list = new ResponseData<List<Donhang>>(
                page_number,
                page_size,
                total,
                dt.ConvertTo<Donhang>().ToList()
            );

            return list;

        }
        //public ResponseData<List<Donhang>> Filter(string trangthai, int page_number, int page_size)
        //{
        //    string msg = "";
        //    var dt = db.Listobject(out msg, "sp_donhang_filter",
        //        "@trangthai", trangthai,
        //        "@page_number", page_number,
        //        "@page_size", page_size);
        //    int count = int.Parse(
        //                    db.GetString($"select count(mahd) from Donhang  where trangthai=N'{trangthai}'")
        //                );

        //    double total = Math.Ceiling((double)count / page_size);
        //    ResponseData<List<Donhang>> list = new ResponseData<List<Donhang>>(
        //        page_number,
        //        page_size,
        //        total,
        //        dt.ConvertTo<Donhang>().ToList()
        //    );

        //    return list;

        //}
        public ResponseData<List<Donhang>> Filter(string keyword ,string trangthai,int page_number, int page_size)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_donhang_filter_advanced",
                "@keyword", keyword,
                "@trangthai", trangthai,
                "@page_number", page_number,
                "@page_size", page_size);

            var dtcount = db.Listobject(out msg, "sp_donhang_filter_advanced_count",
                "@keyword", keyword,
                "@trangthai", trangthai);

            double count = 0;

            if (dtcount.Rows.Count > 0)
            {
                count = Convert.ToDouble(dtcount.Rows[0]["TotalRows"]);
            }
            double total = Math.Ceiling((double)count / page_size);
            ResponseData<List<Donhang>> list = new ResponseData<List<Donhang>>(
                page_number,
                page_size,
                total,
                dt.ConvertTo<Donhang>().ToList()
            );

            return list;

        }
        public ModelDonhang Getbyid(int id)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_donhang_getbyid",
                "@mahd", id);
            try
            {
                return dt.ConvertTo<ModelDonhang>().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<ModelDonhang> GetbyidUser(int id)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_u_donhang_getbyid",
                "@id", id);
            try
            {
                return dt.ConvertTo<ModelDonhang>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool Insert(Donhang model)
        {
            string msgError = "";
            try
            {
                var result = db.ExecuteSPScalar("sp_donhang_insert", out msgError,
                    "@iduser", model.iduser,
                    "@ten", model.ten,
                    "@sdt", model.sdt,
                    "@email", model.email,
                    "@diachi", model.diachi,
                    "@ghichu", model.ghichu,
                    "@thoigian", model.thoigian,
                    "@Data", MessageConvert.SerializeObject(model.listjson_chitiet));

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception(msgError);
                }

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi chèn đơn hàng: {ex.Message}", ex);
            }
        }
        public bool Update(string trangthai,int mahd)
        {
            string msg = "";

            try
            {
                var dt = db.writeProcedure(out msg, "sp_donhang_update_trangthai",
                "@trangthai", trangthai,
                "@mahd", mahd);
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool InsertVanchuyen (Thongtinvanchuyen model)
        {
            string msg = "";
            
            try
            {
                var dt = db.writeProcedure(out msg, "sp_thongtinvanchuyen_create",
                "@mavandon", model.mavandon,
                "@mahd", model.mahd,
                "@donvivanchuyen", model.donvivanchuyen,
                "@ngaygiao", model.ngaygiao,
                "@ngaynhan", model.ngaynhan,
                "@trangthai", model.trangthai);

                if (!string.IsNullOrEmpty(msg))
                {
                    throw new Exception(msg);
                }
                return true;
            }catch (Exception ex)
            {
                throw ex;
            }
            
        }
        public Thongtinvanchuyen get_vanchuyen_bymahd(int mahd)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_thongtinvanchuyen_select_by_mahd",
                "@mahd", mahd);
            try
            {
                return dt.ConvertTo<Thongtinvanchuyen>().FirstOrDefault();
            }catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool UpdateVanchuyen(string mvd)
        {
            string msg = "";

            try
            {
                var dt = db.writeProcedure(out msg, "sp_donhang_update_hoanhthanh",
                "@mavandon", mvd);

                if (!string.IsNullOrEmpty(msg))
                {
                    throw new Exception(msg);
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
