using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL
{
    public class DAL_Blog : IDAL_Blog
    {
        private IDbSql db;
        public DAL_Blog(IDbSql db)
        {
            this.db = db;
        }

        public List<DanhMucBlog> GetAllDanhmuc()
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_danhmucblog_getall");
            return dt.ConvertTo<DanhMucBlog>().ToList();
        }

        public bool CreateDanhmuc(DanhMucBlog model)
        {
            string msgError = "";
            try
            {
                var result = db.writeProcedure(out msgError, "sp_danhmucblog_create",
                    "@ten", model.ten,
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

        public bool DeleteDanhmuc(int id)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_danhmucblog_delete", "@id", id);
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

        public ResponseData<List<Blog>> Getall(int page_number, int page_size)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_blog_getall",
                "@page_number", page_number,
                "@page_size", page_size);

            int count = int.Parse(db.GetString("exec sp_blog_getall_count"));
            double total = Math.Ceiling((double)count / page_size);

            ResponseData<List<Blog>> a = new ResponseData<List<Blog>>(
                page_number, page_size, Math.Ceiling(total),
                dt.ConvertTo<Blog>().ToList()
            );

            return a;
        }

        public Blog Getbyid(int id)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_blog_getbyid", "@id", id);
            return dt.ConvertTo<Blog>().FirstOrDefault();
        }

        public bool Create(Blog model)
        {
            string msgError = "";
            try
            {
                var result = db.writeProcedure(out msgError, "sp_blog_create",
                    "@tieude", model.tieude,
                    "@noidung", model.noidung,
                    "@tomtat", model.tomtat,
                    "@anh", model.anh,
                    "@madanhmuc", model.madanhmuc,
                    "@tacgia", model.tacgia,
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

        public bool Update(Blog model)
        {
            string msgError = "";
            try
            {
                var result = db.writeProcedure(out msgError, "sp_blog_update",
                    "@id", model.id,
                    "@tieude", model.tieude,
                    "@noidung", model.noidung,
                    "@tomtat", model.tomtat,
                    "@anh", model.anh,
                    "@madanhmuc", model.madanhmuc,
                    "@tacgia", model.tacgia,
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
                var obj = db.writeProcedure(out msg, "sp_blog_delete", "@id", id);
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

        public ResponseData<List<Blog>> Search(string keyword, string trangthai, int page_number, int page_size)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_blog_search",
                "@keyword", keyword,
                "@trangthai", trangthai ?? "",
                "@page_number", page_number,
                "@page_size", page_size);

            int s = int.Parse(db.GetString($"exec sp_blog_search_count N'{keyword}', N'{trangthai ?? ""}'"));
            double total = Math.Ceiling((double)s / page_size);

            ResponseData<List<Blog>> a = new ResponseData<List<Blog>>(
                page_number, page_size, Math.Ceiling(total),
                dt.ConvertTo<Blog>().ToList()
            );

            return a;
        }

        public bool IncreaseView(int id)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_blog_increase_view", "@id", id);
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
