using Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BUS.Interface
{
    public interface Ibus_Message
    {
        bool AddMessage(Message model);
        List<Message> GetHistory(int iduser);
        bool ClearHistory(int iduser);
        Task<string> GetChatbotResponse(int? iduser, string userMessage);
    }
}
