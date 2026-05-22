using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interface
{
    public interface IDAL_Nhacungcap
    {
        List<Nhacungcap> Getall();
        bool Add(Nhacungcap ncc);
        bool Delete(string id);
        bool Update(Nhacungcap ncc);
        //List<Nhacungcap> Search(string keyword);
        Nhacungcap GetNCCbyID(int id);
    }
}
