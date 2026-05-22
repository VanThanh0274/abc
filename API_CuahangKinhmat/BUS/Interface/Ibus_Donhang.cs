using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BUS.Interface
{
    public interface Ibus_Donhang
    {
        string Insert(Donhang model);
        bool Update(string trangthai, int mahd);
        ResponseData<List<Donhang>> Getall(int page_number, int page_size);
        public ResponseData<List<Donhang>> Filter(string keyword, string trangthai, int page_number, int page_size);
        ModelDonhang Getbyid(int id);
        Thongtinvanchuyen get_vanchuyen_bymahd(int mahd);
        bool InsertVanchuyen(Thongtinvanchuyen model);
        bool UpdateVanchuyen(string mvd);
        public List<ModelDonhang> GetbyidUser(int id);
    }
}
