using Model;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface IBUS_LichSuGia
    {
        List<ModelLichSuGia> GetAll_Active();
        List<ModelLichSuGia> GetBySKU(int masp);
        bool Create(LichSuGia model);
    }
}
