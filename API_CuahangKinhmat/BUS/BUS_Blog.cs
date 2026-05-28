using BUS.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_Blog : IBUS_Blog
    {
        private IDAL_Blog _dal;
        public BUS_Blog(IDAL_Blog dal)
        {
            _dal = dal;
        }

        public List<DanhMucBlog> GetAllDanhmuc()
        {
            return _dal.GetAllDanhmuc();
        }

        public bool CreateDanhmuc(DanhMucBlog model)
        {
            return _dal.CreateDanhmuc(model);
        }

        public bool DeleteDanhmuc(int id)
        {
            return _dal.DeleteDanhmuc(id);
        }

        public ResponseData<List<Blog>> Getall(int page_number, int page_size)
        {
            return _dal.Getall(page_number, page_size);
        }

        public Blog Getbyid(int id)
        {
            return _dal.Getbyid(id);
        }

        public bool Create(Blog model)
        {
            return _dal.Create(model);
        }

        public bool Update(Blog model)
        {
            return _dal.Update(model);
        }

        public bool Delete(int id)
        {
            return _dal.Delete(id);
        }

        public ResponseData<List<Blog>> Search(string keyword, string trangthai, int page_number, int page_size)
        {
            return _dal.Search(keyword, trangthai, page_number, page_size);
        }

        public bool IncreaseView(int id)
        {
            return _dal.IncreaseView(id);
        }
    }
}
