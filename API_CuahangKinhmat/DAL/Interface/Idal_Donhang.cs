using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interface
{
    public interface Idal_Donhang
    {
        ResponseData<List<Donhang>> Getall(int page_number, int page_size);
        public ResponseData<List<Donhang>> Filter(string keyword, string trangthai, int page_number, int page_size);
        bool Insert(Donhang model);
        bool Update(string trangthai, int mahd);
        bool InsertVanchuyen(Thongtinvanchuyen model);
        Thongtinvanchuyen get_vanchuyen_bymahd(int mahd);
        bool UpdateVanchuyen(string mvd);
        ModelDonhang Getbyid(int id);
        public List<ModelDonhang> GetbyidUser(int id);


    }
}
