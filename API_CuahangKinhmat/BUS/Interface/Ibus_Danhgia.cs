using Model;
using System;
using System.Collections.Generic;

namespace BUS.Interface
{
    public interface Ibus_Danhgia
    {
        bool Insert(Danhgia danhgia);
        List<Danhgia> GetByProduct(int masp);
        bool CheckUserPurchased(int idUser, int masp);
    }
}
