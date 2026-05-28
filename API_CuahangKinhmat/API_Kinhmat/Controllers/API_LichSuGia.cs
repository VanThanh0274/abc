using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class API_LichSuGia : ControllerBase
    {
        private IBUS_LichSuGia bus;
        public API_LichSuGia(IBUS_LichSuGia bus) { this.bus = bus; }

        /// <summary>Lấy tất cả giá đang áp dụng hiện hành của toàn bộ SKU</summary>
        [HttpGet("Get-all-active")]
        public IActionResult GetAllActive()
        {
            try
            {
                var list = bus.GetAll_Active();
                return Ok(list);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Lấy lịch sử giá của một SKU cụ thể</summary>
        [HttpGet("Get-by-sku/{maSKU}")]
        public IActionResult GetBySKU(int maSKU)
        {
            try
            {
                var list = bus.GetBySKU(maSKU);
                return Ok(list);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Cập nhật/thêm mức giá mới cho một SKU (tự động đóng giá cũ)</summary>
        [HttpPost("Create")]
        public IActionResult Create([FromBody] LichSuGia model)
        {
            try
            {
                bus.Create(model);
                return Ok(new { message = "Cập nhật giá thành công", data = model });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
