using Model;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface IBUS_Blog
    {
        List<DanhMucBlog> GetAllDanhmuc();
        bool CreateDanhmuc(DanhMucBlog model);
        bool DeleteDanhmuc(int id);

        ResponseData<List<Blog>> Getall(int page_number, int page_size);
        Blog Getbyid(int id);
        bool Create(Blog model);
        bool Update(Blog model);
        bool Delete(int id);
        ResponseData<List<Blog>> Search(string keyword, string trangthai, int page_number, int page_size);
        bool IncreaseView(int id);
    }
}
