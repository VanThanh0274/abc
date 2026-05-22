using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Nguoidung
    {
        public int id { get; set; }
        public string username { get; set; }
        public string pass { get; set; }
        public string ten { get; set; }
        public string sdt { get; set; }
        public string email { get; set; }
        public string role { get; set; }
        public string token { get; set; }
        public int trangthai { get; set; }

        public Nguoidung(int id, string username, string pass, string ten, string sdt, string email, string role, int trangthai)
        {
            this.id = id;
            this.username = username;
            this.pass = pass;
            this.ten = ten;
            this.sdt = sdt;
            this.email = email;
            this.role = role;
            this.trangthai = trangthai;
        }
        public Nguoidung() { }
    }
}
