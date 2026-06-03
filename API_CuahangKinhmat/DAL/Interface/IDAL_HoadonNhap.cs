using Model;
using System.Collections.Generic;

namespace DAL.Interface
{
    public interface IDAL_HoadonNhap
    {
        List<ModelHoadonNhap> GetAll();
        ModelHoadonNhap GetById(int mahdn);
        List<ModelHoadonNhapChitiet> GetChitietById(int mahdn);
        int Create(HoadonNhap model);
        bool Update(HoadonNhap model);
        bool AddChitiet(HoadonNhapChitiet chitiet);
        bool Confirm(int mahdn);
    }
}
