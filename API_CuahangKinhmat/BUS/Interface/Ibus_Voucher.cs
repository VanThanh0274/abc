using Model;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface Ibus_Voucher
    {
        List<Voucher> GetAvailable();
        Voucher ApplyVoucher(string MaVoucher, decimal TongTien);
    }
}
