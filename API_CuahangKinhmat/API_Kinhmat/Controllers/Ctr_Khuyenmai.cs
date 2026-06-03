using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;
using System;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Khuyenmai : ControllerBase
    {
        private readonly IBUS_Khuyenmai bus;

        public Ctr_Khuyenmai(IBUS_Khuyenmai bus)
        {
            this.bus = bus;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var data = bus.GetAll();
            return Ok(data);
        }

        [HttpGet("GetByCode/{code}")]
        public IActionResult GetByCode(string code)
        {
            var data = bus.GetByCode(code);
            if (data == null) return NotFound(new { message = "Không tìm thấy mã khuyến mãi hoặc mã đã hết hạn" });
            return Ok(data);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Admin,admin")]
        public IActionResult Create([FromBody] Khuyenmai model)
        {
            try
            {
                var res = bus.Create(model);
                return Ok(new { success = res });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("Update")]
        [Authorize(Roles = "Admin,admin")]
        public IActionResult Update([FromBody] Khuyenmai model)
        {
            try
            {
                var res = bus.Update(model);
                return Ok(new { success = res });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "Admin,admin")]
        public IActionResult Delete(int id)
        {
            try
            {
                var res = bus.Delete(id);
                return Ok(new { success = res });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
