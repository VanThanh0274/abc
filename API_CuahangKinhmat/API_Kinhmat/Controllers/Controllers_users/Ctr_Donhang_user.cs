using BUS.Interface;
using Microsoft.AspNetCore.Mvc;
using Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers.Controllers_users
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Donhang_user : ControllerBase
    {
        private Ibus_Donhang bus;
        private Ibus_Giohang busGiohang;
        
        public Ctr_Donhang_user(Ibus_Donhang bus, Ibus_Giohang busGiohang)
        {
            this.bus = bus;
            this.busGiohang = busGiohang;
        }

        [HttpPost]
        [Route("Insert")]
        public IActionResult Insert([FromBody] Donhang model)
        {
            var result = bus.Insert(model);
            if (result == "1")
            {
                // Xóa giỏ hàng sau khi đặt hàng thành công
                busGiohang.Clear(model.iduser);
                return Ok(new { status = 200, message = "Thành công" });
            }
            else
            {
                return BadRequest(new { status = 400, message = "Thất bại" });
            }
        }
        [HttpGet]
        [Route("GetbyidUser")]
        public IActionResult GetbyidUser(int id)
        {
            var result = bus.GetbyidUser(id);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(new { message = "Thất bại" });
            }
        }

    }
}
