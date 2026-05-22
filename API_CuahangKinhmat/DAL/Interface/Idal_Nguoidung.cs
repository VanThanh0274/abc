using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interface
{
    public interface Idal_Nguoidung
    {
        Nguoidung GetUser(string user, string pass);
        bool Insert(Nguoidung nguoidung);
        public bool Update(Nguoidung nguoidung);
        public Nguoidung Getbyid(int id);
        public bool ChangePassword(string password, int id);
        public ResponseData<List<Nguoidung>> Getall(int page_number, int page_size);
        public bool UpdateRole(int id, string role, int state);
    }
}
