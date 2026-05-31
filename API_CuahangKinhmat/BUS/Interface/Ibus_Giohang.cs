using Model;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface Ibus_Giohang
    {
        List<GiohangChitiet> GetByUser(int iduser);
        bool AddItem(int iduser, int masp, int soluong);
        bool UpdateItem(int iduser, int masp, int soluong);
        bool RemoveItem(int iduser, int masp);
        bool Clear(int iduser);
    }
}
