using Model;
using System.Collections.Generic;

namespace DAL.Interface
{
    public interface Idal_Voucher
    {
        List<Voucher> GetAvailable();
        Voucher ApplyVoucher(string MaVoucher, decimal TongTien);
    }
}
