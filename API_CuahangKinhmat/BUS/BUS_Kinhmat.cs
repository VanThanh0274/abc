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
    public class BUS_Kinhmat:Ibus_Kinhmat
    {
        private IDAL_kinhmat dal;
        public BUS_Kinhmat(IDAL_kinhmat dal)
        {
            this.dal = dal;
        }
        public ResponseData<List<modelKinhmat>> Getall(int page_number, int page_size)
        {
            return dal.Getall(page_number, page_size);
        }
        public Kinhmat Getbyid(string id)
        {
            return dal.Getbyid(id);
        }
        public bool Update(Kinhmat km)
        {
            return dal.Update(km);
        }
        public bool Add(Kinhmat km)
        {
            return dal.Add(km);
        }
        public bool Delete(int id)
        {
            return dal.Delete(id);
        }
        public ResponseData<List<modelKinhmat>> SearchAdmin(string kinhmat, int page_number, int page_size)
        {
            return dal.SearchAdmin(kinhmat, page_number, page_size);
        }
        public ResponseData<List<Kinhmat>> Getalltheodanhmuc(int madanhmuc, int page_number, int page_size)
        {
            return dal.Getalltheodanhmuc(madanhmuc,page_number,page_size);
        }
        public ResponseData<List<Kinhmat>> Search(string ten, int page_number, int page_size)
        {
            return dal.Search(ten, page_number, page_size);
        }
        public List<Kinhmat> Getallgioithieu(string gioithieu)
        {
            return dal.Getallgioithieu(gioithieu);
        }
        public List<Kinhmat> FilterKinhmat(string chatlieu, string kieudang)
        {
            return dal.FilterKinhmat(chatlieu,kieudang);
        }
    }
}
