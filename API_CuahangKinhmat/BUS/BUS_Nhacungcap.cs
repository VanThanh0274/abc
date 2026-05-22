using BUS.Interface;
using DAL;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BUS
{
    public class BUS_Nhacungcap:IBUS_Nhacungcap
    {
        private IDAL_Nhacungcap db;
        public BUS_Nhacungcap(IDAL_Nhacungcap db)
        {
            this.db = db;
        }
        public List<Nhacungcap> Getall()
        {
            return db.Getall();
        }
        public bool Add(Nhacungcap ncc)
        {
            return db.Add(ncc);
        }
        public bool Delete(string id)
        {
            return db.Delete(id);
        }
        public bool Update(Nhacungcap ncc)
        {
            return db.Update(ncc);
        }
        //public List<Nhacungcap> Search(string keyword)
        //{
        //    return db.Search(keyword);
        //}
        public Nhacungcap GetNCCbyID(int id)
        {
            return db.GetNCCbyID(id);
        }
    }
}
