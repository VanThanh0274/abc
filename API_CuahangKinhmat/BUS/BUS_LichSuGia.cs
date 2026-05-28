using BUS.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_LichSuGia : IBUS_LichSuGia
    {
        private IDAL_LichSuGia db;
        public BUS_LichSuGia(IDAL_LichSuGia db) { this.db = db; }

        public List<ModelLichSuGia> GetAll_Active() => db.GetAll_Active();
        public List<ModelLichSuGia> GetBySKU(int maSKU) => db.GetBySKU(maSKU);
        public bool Create(LichSuGia model) => db.Create(model);
    }
}
