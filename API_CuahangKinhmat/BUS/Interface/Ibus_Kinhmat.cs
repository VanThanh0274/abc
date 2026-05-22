using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BUS.Interface
{
    public interface Ibus_Kinhmat
    {
        public ResponseData<List<modelKinhmat>> Getall(int page_number, int page_size);
        public Kinhmat Getbyid(string id);
        public bool Update(Kinhmat km);
        public bool Add(Kinhmat km);
        public bool Delete(int id);
        public ResponseData<List<modelKinhmat>> SearchAdmin(string kinhmat, int page_number, int page_size);
        public ResponseData<List<Kinhmat>> Getalltheodanhmuc(int madanhmuc, int page_number, int page_size);
        public ResponseData<List<Kinhmat>> Search(string ten, int page_number, int page_size);
        public List<Kinhmat> Getallgioithieu(string gioithieu);
        public List<Kinhmat> FilterKinhmat(string chatlieu, string kieudang);
    }
}
