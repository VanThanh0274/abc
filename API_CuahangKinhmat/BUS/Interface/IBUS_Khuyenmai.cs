using Model;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface IBUS_Khuyenmai
    {
        List<Khuyenmai> GetAll();
        Khuyenmai GetByCode(string ma_km);
        bool Create(Khuyenmai model);
        bool Update(Khuyenmai model);
        bool Delete(int id);
    }
}
