using BUS.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_Danhgia : Ibus_Danhgia
    {
        private Idal_Danhgia dal;
        public BUS_Danhgia(Idal_Danhgia dal)
        {
            this.dal = dal;
        }

        public bool Insert(Danhgia danhgia)
        {
            return dal.Insert(danhgia);
        }

        public List<Danhgia> GetByProduct(int masp)
        {
            return dal.GetByProduct(masp);
        }

        public bool CheckUserPurchased(int idUser, int masp)
        {
            return dal.CheckUserPurchased(idUser, masp);
        }
    }
}
