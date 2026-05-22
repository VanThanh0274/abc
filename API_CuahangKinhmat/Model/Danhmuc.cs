using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Danhmuc
    {
        private int ma;
        private string tendanhmuc, mota;
        

        public Danhmuc(int ma, string tendanhmuc, string mota)
        {
            this.ma = ma;
            this.tendanhmuc = tendanhmuc;
            this.mota = mota;
        }
        public Danhmuc() { }
        public int Ma { get => ma; set => ma = value; }
        public string Tendanhmuc { get => tendanhmuc; set => tendanhmuc = value; }
        public string Mota { get => mota; set => mota = value; }
        
    }
    public class Total_danhmuc
    {
        public string danhmuc { get; set; }
        public int id { get; set; }
        public string sl { get; set; }
    }
}
