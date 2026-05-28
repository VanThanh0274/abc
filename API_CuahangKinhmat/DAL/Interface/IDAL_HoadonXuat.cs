using Model;
using System.Collections.Generic;

namespace DAL.Interface
{
    public interface IDAL_HoadonXuat
    {
        List<ModelHoadonXuat> GetAll();
        ModelHoadonXuat GetById(int mahdx);
        List<ModelHoadonXuatChitiet> GetChitietById(int mahdx);
        int CreateFromDonhang(TaoHoadonXuatRequest request);
    }
}
