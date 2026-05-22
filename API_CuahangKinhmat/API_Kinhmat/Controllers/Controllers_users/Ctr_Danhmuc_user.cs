using BUS.Interface;
using Microsoft.AspNetCore.Mvc;
using Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers.Controllers_users
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Danhmuc_user : ControllerBase
    {
        private Ibus_Danhmuc bus;
        public Ctr_Danhmuc_user(Ibus_Danhmuc bus)
        {
            this.bus = bus;
        }

        [HttpGet]
        [Route("Getall")]
        public ActionResult<Danhmuc> Getall()
        {
            var list = bus.Getall();
            return Ok(list);
        }

        // GET api/<Ctr_Danhmuc_user>/5
        [HttpGet]
        [Route("Get_totalproductdanhmuc")]
        public IActionResult Get_totalproductdanhmuc(string danhmuc)
        {
            var list = bus.Gettotaldanhmuc(danhmuc);
            return Ok(list);
        }
    }
}
