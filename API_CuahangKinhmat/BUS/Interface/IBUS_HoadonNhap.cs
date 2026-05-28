using Model;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface IBUS_HoadonNhap
    {
        List<ModelHoadonNhap> GetAll();
        ModelHoadonNhap GetById(int mahdn);
        List<ModelHoadonNhapChitiet> GetChitietById(int mahdn);
        int Create(HoadonNhap model);
        bool AddChitiet(HoadonNhapChitiet chitiet);
        bool Confirm(int mahdn);
    }
}
