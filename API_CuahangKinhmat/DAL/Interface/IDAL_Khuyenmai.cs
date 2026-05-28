using Model;
using System.Collections.Generic;

namespace DAL.Interface
{
    public interface IDAL_Khuyenmai
    {
        List<Khuyenmai> GetAll();
        Khuyenmai GetByCode(string ma_km);
        bool Create(Khuyenmai model);
        bool Update(Khuyenmai model);
        bool Delete(int id);
    }
}
