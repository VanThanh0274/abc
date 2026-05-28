using BUS.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_HoadonXuat : IBUS_HoadonXuat
    {
        private IDAL_HoadonXuat db;
        public BUS_HoadonXuat(IDAL_HoadonXuat db) { this.db = db; }

        public List<ModelHoadonXuat> GetAll() => db.GetAll();
        public ModelHoadonXuat GetById(int mahdx) => db.GetById(mahdx);
        public List<ModelHoadonXuatChitiet> GetChitietById(int mahdx) => db.GetChitietById(mahdx);
        public int CreateFromDonhang(TaoHoadonXuatRequest request) => db.CreateFromDonhang(request);
    }
}
