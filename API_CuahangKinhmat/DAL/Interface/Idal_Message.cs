using Model;
using System.Collections.Generic;

namespace DAL.Interface
{
    public interface Idal_Message
    {
        bool AddMessage(Message model);
        List<Message> GetHistory(int iduser);
        bool ClearHistory(int iduser);
    }
}
