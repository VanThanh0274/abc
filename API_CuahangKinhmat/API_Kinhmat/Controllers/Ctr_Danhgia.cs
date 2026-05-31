using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;
using System;
using System.Linq;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Danhgia : ControllerBase
    {
        private Ibus_Danhgia bus;

        public Ctr_Danhgia(Ibus_Danhgia bus)
        {
            this.bus = bus;
        }

        [HttpGet("product/{masp}")]
        public IActionResult GetByProduct(int masp)
        {
            try
            {
                var list = bus.GetByProduct(masp);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("check-can-review/{masp}")]
        [Authorize]
        public IActionResult CheckCanReview(int masp)
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    bool canReview = bus.CheckUserPurchased(userId, masp);
                    return Ok(new { canReview = canReview });
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("add")]
        [Authorize]
        public IActionResult AddReview([FromBody] Danhgia danhgia)
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdStr, out int userId))
                {
                    danhgia.iduser = userId;
                    // Check again if they actually purchased it to prevent API abuse
                    if (!bus.CheckUserPurchased(userId, danhgia.masp))
                    {
                        return BadRequest(new { message = "Bạn phải mua sản phẩm mới được đánh giá." });
                    }

                    if (bus.Insert(danhgia))
                    {
                        return Ok(new { message = "Thêm đánh giá thành công" });
                    }
                }
                return BadRequest(new { message = "Thêm đánh giá thất bại" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
