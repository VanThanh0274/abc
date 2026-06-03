using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class API_HoadonNhap : ControllerBase
    {
        private IBUS_HoadonNhap bus;
        public API_HoadonNhap(IBUS_HoadonNhap bus) { this.bus = bus; }

        /// <summary>Lấy danh sách tất cả hóa đơn nhập kho</summary>
        [HttpGet("Get-all")]
        public IActionResult GetAll()
        {
            try { return Ok(bus.GetAll()); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Lấy thông tin tổng quan một hóa đơn nhập theo mã</summary>
        [HttpGet("Get-by-id/{mahdn}")]
        public IActionResult GetById(int mahdn)
        {
            try { return Ok(bus.GetById(mahdn)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Lấy danh sách chi tiết hàng hóa của một hóa đơn nhập</summary>
        [HttpGet("Get-chitiet/{mahdn}")]
        public IActionResult GetChitiet(int mahdn)
        {
            try { return Ok(bus.GetChitietById(mahdn)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>
        /// Tạo hóa đơn nhập kho mới (kèm chi tiết).
        /// Nếu model.chitiet có dữ liệu, sẽ tự động thêm từng dòng chi tiết,
        /// trigger SQL sẽ tự động cộng tồn kho KinhmatSKU.
        /// </summary>
        [HttpPost("Create")]
        public IActionResult Create([FromBody] HoadonNhap model)
        {
            try
            {
                int mahdn = bus.Create(model);
                if (mahdn <= 0) return BadRequest("Tạo hóa đơn nhập thất bại");

                // Thêm từng dòng chi tiết nếu có
                if (model.chitiet != null && model.chitiet.Count > 0)
                {
                    foreach (var item in model.chitiet)
                    {
                        item.mahdn = mahdn;
                        bus.AddChitiet(item);
                    }
                }

                return Ok(new { message = "Tạo hóa đơn nhập thành công", mahdn });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>
        /// Cập nhật hóa đơn nhập kho chưa duyệt
        /// </summary>
        [HttpPut("Update/{mahdn}")]
        public IActionResult Update(int mahdn, [FromBody] HoadonNhap model)
        {
            try
            {
                model.mahdn = mahdn;
                bus.Update(model);

                // Thêm từng dòng chi tiết nếu có
                if (model.chitiet != null && model.chitiet.Count > 0)
                {
                    foreach (var item in model.chitiet)
                    {
                        item.mahdn = mahdn;
                        bus.AddChitiet(item);
                    }
                }

                return Ok(new { message = "Cập nhật hóa đơn nhập thành công" });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Thêm một dòng chi tiết hàng vào hóa đơn nhập đã tồn tại</summary>
        [HttpPost("Add-chitiet")]
        public IActionResult AddChitiet([FromBody] HoadonNhapChitiet chitiet)
        {
            try
            {
                bus.AddChitiet(chitiet);
                return Ok(new { message = "Thêm chi tiết nhập thành công" });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        /// <summary>Xác nhận hóa đơn nhập kho (chuyển từ Nháp sang Đã nhập kho)</summary>
        [HttpPut("Confirm/{mahdn}")]
        public IActionResult Confirm(int mahdn)
        {
            try
            {
                bus.Confirm(mahdn);
                return Ok(new { message = "Xác nhận nhập kho thành công" });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}


