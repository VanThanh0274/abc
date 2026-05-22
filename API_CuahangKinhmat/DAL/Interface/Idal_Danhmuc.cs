using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interface
{
    public interface Idal_Danhmuc
    {
        List<Danhmuc> Getall();
        public List<Danhmuc> Search(string danhmuc);
        bool Add(Danhmuc dm);
        bool Delete(string id);
        bool Update(Danhmuc dm);
        Danhmuc GetDanhmucbyID(int id);
        public Total_danhmuc Gettotaldanhmuc(string danhmuc);
    }
}
