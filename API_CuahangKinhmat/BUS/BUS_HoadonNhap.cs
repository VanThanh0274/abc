using BUS.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_HoadonNhap : IBUS_HoadonNhap
    {
        private IDAL_HoadonNhap db;
        public BUS_HoadonNhap(IDAL_HoadonNhap db) { this.db = db; }

        public List<ModelHoadonNhap> GetAll() => db.GetAll();
        public ModelHoadonNhap GetById(int mahdn) => db.GetById(mahdn);
        public List<ModelHoadonNhapChitiet> GetChitietById(int mahdn) => db.GetChitietById(mahdn);
        public int Create(HoadonNhap model) => db.Create(model);

        public bool Update(HoadonNhap model) => db.Update(model);

        public bool AddChitiet(HoadonNhapChitiet chitiet) => db.AddChitiet(chitiet);
        public bool Confirm(int mahdn) => db.Confirm(mahdn);
    }
}
