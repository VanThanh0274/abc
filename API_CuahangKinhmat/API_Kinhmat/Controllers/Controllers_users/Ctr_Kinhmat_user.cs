using BUS.Interface;
using Microsoft.AspNetCore.Mvc;
using Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers.Controllers_users
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Kinhmat_user : ControllerBase
    {
        private Ibus_Kinhmat bus;
        public Ctr_Kinhmat_user(Ibus_Kinhmat bus)
        {
            this.bus = bus;
        }
        [HttpGet]
        [Route("GetKinhmatdanhmuc")]
        public IActionResult GetKinhmatdanhmuc(int id,int page_number, int page_size)
        {
            var list = bus.Getalltheodanhmuc(id, page_number, page_size);
            return Ok(list);
        }
        [HttpGet]
        [Route("Getgioithieu")]
        public IActionResult Getgioithieu(string gioithieu)
        {
            var list = bus.Getallgioithieu(gioithieu);
            return Ok(list);
        }


        [HttpGet]
        [Route("Getbyid")]
        public Kinhmat Getbyid(int id)
        {
            var list = bus.Getbyid(id.ToString());
            return list;
        }

        [HttpGet]
        [Route("Search")]
        public IActionResult Search(string ten, int page_number, int page_size)
        {
            var list = bus.Search(ten, page_number, page_size);
            if (list == null)
            {

                return Ok(new { mess = "Ko có" });
            }
            return Ok(list);
        }


        [HttpGet]
        [Route("Filter")]
        public IActionResult Filter(string? chatlieu, string? kieudang)
        {
            var list = bus.FilterKinhmat(chatlieu, kieudang);
            if (list == null)
            {

                return Ok(new { mess = "Ko có" });
            }
            return Ok(list);
        }
    }
}
