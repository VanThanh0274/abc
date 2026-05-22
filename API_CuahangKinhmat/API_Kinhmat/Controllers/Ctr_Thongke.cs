using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;
using Newtonsoft.Json.Linq;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class Ctr_Thongke : ControllerBase
    {
        Ibus_Thongke bus;
        public Ctr_Thongke(Ibus_Thongke bus)
        {
            this.bus = bus;
        }
        [HttpGet]
        [Route("Top5spbanchay")]
        public ActionResult<Thongkesanpham> top5spbanchay(string type, int month, int year)
        {
            try
            {
                var list = bus.top5sp_banchay(type,month, year);

                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet]
        [Route("Thongke_today")]
        public IActionResult thongke_today()
        {

            var d = bus.thongke_ngay();
            return Ok(d);
        }
        [HttpGet]
        [Route("Thongke_year")]
        public IActionResult GetReport([FromQuery] int year)
        {
            var report = bus.thongke_by_year(year);
            return Ok(report);
        }
        [HttpGet]
        [Route("Thongke_month")]
        public IActionResult thongke_month(int month, int year)
        {
            var report = bus.Thongke_month(month,year);
            return Ok(report);
        }
        [HttpGet]
        [Route("Thongke_tongquan")]
        public IActionResult thongke_tongquan()
        {
            var report = bus.thongketongquan();
            return Ok(report);
        }
        [HttpGet]
        [Route("Thongke_Donhang")]
        public IActionResult thongkeDonhang(int year)
        {
            var report =bus.thongkeDonhang(year);
            return Ok(report);
        }
        [HttpGet]
        [Route("Top5sp_itduocmua")]
        public IActionResult Topsp_itduocmua(string type, int month,int year)
        {
            var report = bus.top5sp_itduocmua(type, month, year);
            return Ok(report);
        }
    }
}
