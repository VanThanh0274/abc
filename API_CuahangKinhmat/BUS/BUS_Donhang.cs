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
    public class BUS_Donhang:Ibus_Donhang
    {
        private Idal_Donhang dal;
        public BUS_Donhang(Idal_Donhang dal)
        {
            this.dal = dal;
        }
        public ResponseData<List<Donhang>> Filter(string keyword, string trangthai, int page_number, int page_size)
        {
            return dal.Filter(keyword,trangthai,page_number,page_size);
        }
        public ResponseData<List<Donhang>> Getall(int page_number, int page_size)
        {
            return dal.Getall(page_number, page_size);
        }
        public ModelDonhang Getbyid(int id)
        {
            return dal.Getbyid(id);
        }
        public string Insert(Donhang model)
        {
            var result = dal.Insert(model);
            if (result)
            {
                return "1";
            }
            else if (!result)
            {
                return "0";
            }
            return "-1";
        }
        public bool Update(string trangthai, int mahd)
        {
            return dal.Update(trangthai, mahd); 
        }
        public Thongtinvanchuyen get_vanchuyen_bymahd(int mahd)
        {
            return dal.get_vanchuyen_bymahd(mahd);
        }
        public bool InsertVanchuyen(Thongtinvanchuyen model)
        {
            return dal.InsertVanchuyen(model);
        }
        public bool UpdateVanchuyen(string mvd)
        {
            return dal.UpdateVanchuyen(mvd);
        }
        public List<ModelDonhang> GetbyidUser(int id)
        {
            return dal.GetbyidUser(id);
        }


    }
}
