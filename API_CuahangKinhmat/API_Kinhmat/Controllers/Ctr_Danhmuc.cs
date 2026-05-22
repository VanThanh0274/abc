using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class Ctr_Danhmuc : ControllerBase
    {
        // GET: Ctr_Danhmuc
        private Ibus_Danhmuc bus;
        
        public Ctr_Danhmuc(Ibus_Danhmuc bus)
        {
            this.bus = bus;
            
        }
        [HttpGet]
        [Route("Get-all")]

        public IActionResult getall()
        {
            var list = bus.Getall();
            return Ok(list);
        }
        [HttpGet]
        [Route("Search")]

        public IActionResult Search(string? danhmuc)
        {
            var list = bus.Search(danhmuc);
            return Ok(list);
        }

        [HttpPost]
        [Route("Create")]
        public Danhmuc create([FromBody] Danhmuc model)
        {
            bus.Add(model);
            return model;
        }
        [HttpPut]
        [Route("Update")]
        public Danhmuc update([FromBody] Danhmuc model) {

            bus.Update(model); 
            return model; 
        }
        [HttpDelete]
        [Route("Delete")]
        public IActionResult delete(string id)
        {
            bus.Delete(id);
            return Ok();
        }
        [HttpGet]
        [Route("Getbyid")]
        public Danhmuc Getbyid(int id)
        {
            return bus.GetDanhmucbyID(id);
            
        }
    }
}
