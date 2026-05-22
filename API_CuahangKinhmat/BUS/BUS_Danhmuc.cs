using BUS.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BUS
{
    public class BUS_Danhmuc:Ibus_Danhmuc
    {
        Idal_Danhmuc dal;
        public BUS_Danhmuc(Idal_Danhmuc dal)
        {
            this.dal = dal;
        }
        public List<Danhmuc> Getall()
        {
            return dal.Getall();
        }
        public List<Danhmuc> Search(string danhmuc)
        {
            return dal.Search(danhmuc);
        }
        public bool Add(Danhmuc dm)
        {
            return dal.Add(dm);
        }
        public bool Delete(string id)
        {
            return dal.Delete(id);
        }
        public bool Update(Danhmuc dm)
        {
            return dal.Update(dm);
        }
        public Danhmuc GetDanhmucbyID(int id)
        {
            return dal.GetDanhmucbyID(id);
        }
        public Total_danhmuc Gettotaldanhmuc(string danhmuc)
        {
            return dal.Gettotaldanhmuc(danhmuc);
        }


    }
}
