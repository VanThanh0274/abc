using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class API_HoadonXuat : ControllerBase
    {
        private IBUS_HoadonXuat bus;
        public API_HoadonXuat(IBUS_HoadonXuat bus) { this.bus = bus; }

        /// <summary>Lấy danh sách tất cả hóa đơn xuất kho</summary>
        [HttpGet("Get-all")]
        public IActionResult GetAll()
        {
            try { return Ok(bus.GetAll()); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Lấy thông tin tổng quan một hóa đơn xuất theo mã</summary>
        [HttpGet("Get-by-id/{mahdx}")]
        public IActionResult GetById(int mahdx)
        {
            try { return Ok(bus.GetById(mahdx)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Lấy danh sách chi tiết hàng hóa đã xuất của một hóa đơn</summary>
        [HttpGet("Get-chitiet/{mahdx}")]
        public IActionResult GetChitiet(int mahdx)
        {
            try { return Ok(bus.GetChitietById(mahdx)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>
        /// Tạo hóa đơn xuất kho từ một đơn hàng đã được duyệt.
        /// Trigger SQL tự động trừ tồn kho KinhmatSKU sau khi hóa đơn xuất được tạo.
        /// </summary>
        [HttpPost("Create-from-donhang")]
        public IActionResult CreateFromDonhang([FromBody] TaoHoadonXuatRequest request)
        {
            try
            {
                int mahdx = bus.CreateFromDonhang(request);
                if (mahdx <= 0) return BadRequest("Tạo hóa đơn xuất thất bại");
                return Ok(new { message = "Tạo hóa đơn xuất thành công", mahdx });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
