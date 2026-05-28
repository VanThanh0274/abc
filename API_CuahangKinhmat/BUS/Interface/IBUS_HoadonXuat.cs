using Model;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface IBUS_HoadonXuat
    {
        List<ModelHoadonXuat> GetAll();
        ModelHoadonXuat GetById(int mahdx);
        List<ModelHoadonXuatChitiet> GetChitietById(int mahdx);
        int CreateFromDonhang(TaoHoadonXuatRequest request);
    }
}
