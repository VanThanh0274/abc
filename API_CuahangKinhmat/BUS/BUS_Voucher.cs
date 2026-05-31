using BUS.Interface;
using DAL.Interface;
using Model;
using System.Collections.Generic;

namespace BUS
{
    public class BUS_Voucher : Ibus_Voucher
    {
        private Idal_Voucher dal;
        public BUS_Voucher(Idal_Voucher dal)
        {
            this.dal = dal;
        }

        public List<Voucher> GetAvailable()
        {
            return dal.GetAvailable();
        }

        public Voucher ApplyVoucher(string MaVoucher, decimal TongTien)
        {
            return dal.ApplyVoucher(MaVoucher, TongTien);
        }
    }
}
