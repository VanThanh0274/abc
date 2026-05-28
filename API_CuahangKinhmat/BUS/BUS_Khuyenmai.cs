using BUS.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_Khuyenmai : IBUS_Khuyenmai
    {
        private IDAL_Khuyenmai dal;
        public BUS_Khuyenmai(IDAL_Khuyenmai dal)
        {
            this.dal = dal;
        }

        public List<Khuyenmai> GetAll()
        {
            return dal.GetAll();
        }

        public Khuyenmai GetByCode(string ma_km)
        {
            return dal.GetByCode(ma_km);
        }

        public bool Create(Khuyenmai model)
        {
            return dal.Create(model);
        }

        public bool Update(Khuyenmai model)
        {
            return dal.Update(model);
        }

        public bool Delete(int id)
        {
            return dal.Delete(id);
        }
    }
}
