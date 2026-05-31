using Model;
using System;
using System.Collections.Generic;

namespace DAL.Interface
{
    public interface Idal_Danhgia
    {
        bool Insert(Danhgia danhgia);
        List<Danhgia> GetByProduct(int masp);
        bool CheckUserPurchased(int idUser, int masp);
    }
}
