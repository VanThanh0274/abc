using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;
using System.Linq;

namespace DAL
{
    public class DAL_Voucher : Idal_Voucher
    {
        private IDbSql db;
        public DAL_Voucher(IDbSql db)
        {
            this.db = db;
        }

        public List<Voucher> GetAvailable()
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_voucher_get_available");
            return dt.ConvertTo<Voucher>().ToList();
        }

        public Voucher ApplyVoucher(string MaVoucher, decimal TongTien)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_voucher_apply", 
                "@MaVoucher", MaVoucher,
                "@TongTien", TongTien);
            return dt.ConvertTo<Voucher>().FirstOrDefault();
        }
    }
}
