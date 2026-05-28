using Model;
using System.Collections.Generic;

namespace DAL.Interface
{
    public interface IDAL_LichSuGia
    {
        List<ModelLichSuGia> GetAll_Active();
        List<ModelLichSuGia> GetBySKU(int masp);
        bool Create(LichSuGia model);
    }
}
