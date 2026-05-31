using BUS.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_Giohang : Ibus_Giohang
    {
        private Idal_Giohang dal;
        public BUS_Giohang(Idal_Giohang dal)
        {
            this.dal = dal;
        }

        public List<GiohangChitiet> GetByUser(int iduser)
        {
            return dal.GetByUser(iduser);
        }

        public bool AddItem(int iduser, int masp, int soluong)
        {
            return dal.AddItem(iduser, masp, soluong);
        }

        public bool UpdateItem(int iduser, int masp, int soluong)
        {
            return dal.UpdateItem(iduser, masp, soluong);
        }

        public bool RemoveItem(int iduser, int masp)
        {
            return dal.RemoveItem(iduser, masp);
        }

        public bool Clear(int iduser)
        {
            return dal.Clear(iduser);
        }
    }
}
