using BUS.Interface;
using Microsoft.AspNetCore.Mvc;
using Model;
using System.Threading.Tasks;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Chatbot : ControllerBase
    {
        private readonly Ibus_Message _busMessage;

        public Ctr_Chatbot(Ibus_Message busMessage)
        {
            this._busMessage = busMessage;
        }

        [HttpPost]
        [Route("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.message))
            {
                return BadRequest(new { message = "Nội dung tin nhắn không được trống." });
            }

            string reply = await _busMessage.GetChatbotResponse(request.iduser, request.message);
            return Ok(new ChatResponse { reply = reply });
        }

        [HttpGet]
        [Route("history")]
        public IActionResult GetHistory(int iduser)
        {
            if (iduser <= 0)
            {
                return BadRequest(new { message = "Mã người dùng không hợp lệ." });
            }

            var history = _busMessage.GetHistory(iduser);
            return Ok(history);
        }

        [HttpDelete]
        [Route("clear")]
        public IActionResult ClearHistory(int iduser)
        {
            if (iduser <= 0)
            {
                return BadRequest(new { message = "Mã người dùng không hợp lệ." });
            }

            if (_busMessage.ClearHistory(iduser))
            {
                return Ok(new { message = "Xóa lịch sử trò chuyện thành công." });
            }
            return BadRequest(new { message = "Đã có lỗi xảy ra trong quá trình xóa lịch sử." });
        }
    }
}
