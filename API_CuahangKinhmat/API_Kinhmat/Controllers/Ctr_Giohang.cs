using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class Ctr_Giohang : ControllerBase
    {
        private Ibus_Giohang bus;

        public Ctr_Giohang(Ibus_Giohang bus)
        {
            this.bus = bus;
        }

        [HttpGet("get")]
        public IActionResult GetByUser()
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    var list = bus.GetByUser(userId);
                    return Ok(list);
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("add")]
        public IActionResult AddItem(int masp, int soluong)
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    if (bus.AddItem(userId, masp, soluong))
                    {
                        return Ok(new { message = "Thêm vào giỏ hàng thành công" });
                    }
                }
                return BadRequest(new { message = "Lỗi khi thêm vào giỏ hàng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("update")]
        public IActionResult UpdateItem(int masp, int soluong)
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    if (bus.UpdateItem(userId, masp, soluong))
                    {
                        return Ok(new { message = "Cập nhật giỏ hàng thành công" });
                    }
                }
                return BadRequest(new { message = "Lỗi cập nhật giỏ hàng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("remove")]
        public IActionResult RemoveItem(int masp)
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    if (bus.RemoveItem(userId, masp))
                    {
                        return Ok(new { message = "Xóa khỏi giỏ hàng thành công" });
                    }
                }
                return BadRequest(new { message = "Lỗi xóa khỏi giỏ hàng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
