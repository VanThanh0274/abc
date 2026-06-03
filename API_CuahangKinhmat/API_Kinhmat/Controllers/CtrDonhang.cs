using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;
using System.Reflection;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,admin")]
    public class CtrDonhang : ControllerBase
    {
        Ibus_Donhang bus;
        public CtrDonhang(Ibus_Donhang bus) {
            this.bus = bus;
        }
        // GET: api/<CtrDonhang>
        [HttpGet]
        [Route("Getall")]
        public ActionResult<ModelDonhang> getall(int page_number, int page_size)
        {
            var list =bus.Getall(page_number,page_size);
            return Ok(list);
        }
        [HttpGet]
        [Route("Filter")]
        public ActionResult<ModelDonhang> filter(string? keyword, string? trangthai, int page_number, int page_size)
        {
            var list = bus.Filter(keyword,trangthai,page_number, page_size);
            return Ok(list);
        }
        [HttpGet]
        [Route("Getdonhang_byid")]
        public IActionResult Getdonhang_byid(int mahd)
        {
            try
            {
                
                var model = bus.Getbyid(mahd);
                if(model == null)
                {
                    return BadRequest(new { mess = "Không tìm th?y" });
                }

                return Ok(model);

            }catch (Exception ex)
            {
                return BadRequest("ko th? thêm"+ex.Message);
            }
            
        }

        [HttpPost("Insert")]
        public IActionResult Insert([FromBody] Donhang model)
        {
            var result = bus.Insert(model);
            if (result == "Thêm don hàng thành công.")
            {
                return Ok(new { status = 200, message = result });
            }
            else
            {
                return BadRequest(new { status = 400, message = result });
            }
        }
        [HttpPut]
        [Route("Update_trangthai")]
        public IActionResult Update(string trangthai, int mahd)
        {
            try
            {

                if (bus.Update(trangthai, mahd))
                {
                    return Ok(new {mess="Thành công"});
                }
                return BadRequest("C?p nh?t tr?ng thái không thành công.");

            }
            catch (Exception ex)
            {
                // Ghi log l?i t?i dây n?u c?n thi?t
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("Get_vanchuyen")]
        public Thongtinvanchuyen get_vanchuyen_bymahd(int mahd)
        {
            var d = bus.get_vanchuyen_bymahd(mahd);
            return d;
        }
        [HttpPost]
        [Route("Insert_vanchuyen")]
        public IActionResult Insert(Thongtinvanchuyen model)
        {
            try
            {
                bool isInserted = bus.InsertVanchuyen(model);
                if (isInserted)
                {
                    return Ok(model);
                }

                return BadRequest("Không th? chèn thông tin v?n chuy?n.");
            }
            catch (Exception ex)
            {
                // Ghi log l?i t?i dây n?u c?n thi?t
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("Update_vanchuyen")]
        public IActionResult updatevanchuyen(string mavandon)
        {
            try
            {

                if (bus.UpdateVanchuyen(mavandon))
                {
                    return Ok(new { mess = "Thành công" });
                }
                return BadRequest("Ðon hàng chua du?c hoàn thành");

            }
            catch (Exception ex)
            {
                // Ghi log l?i t?i dây n?u c?n thi?t
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }

    }
}
