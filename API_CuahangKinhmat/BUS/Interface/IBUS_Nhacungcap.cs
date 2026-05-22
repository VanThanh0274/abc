using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BUS.Interface
{
    public interface IBUS_Nhacungcap
    {
        List<Nhacungcap> Getall();
        bool Add(Nhacungcap ncc);
        bool Delete(string id);
        bool Update(Nhacungcap ncc);
        //List<Nhacungcap> Search(string keyword);
        Nhacungcap GetNCCbyID(int id);
    }
}
