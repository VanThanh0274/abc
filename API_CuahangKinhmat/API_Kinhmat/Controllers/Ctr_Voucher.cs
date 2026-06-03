using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Voucher : ControllerBase
    {
        private Ibus_Voucher bus;

        public Ctr_Voucher(Ibus_Voucher bus)
        {
            this.bus = bus;
        }

        [HttpGet("available")]
        public IActionResult GetAvailable()
        {
            try
            {
                var list = bus.GetAvailable();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("apply")]
        public IActionResult ApplyVoucher(string code, decimal total)
        {
            try
            {
                var voucher = bus.ApplyVoucher(code, total);
                if (voucher != null)
                {
                    return Ok(voucher);
                }
                return BadRequest(new { message = "Mã giảm giá không hợp lệ hoặc không đủ điều kiện áp dụng." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
