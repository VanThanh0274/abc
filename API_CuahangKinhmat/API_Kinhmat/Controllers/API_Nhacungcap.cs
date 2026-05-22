using BUS;
using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class API_Nhacungcap : ControllerBase
        
    {
        private IBUS_Nhacungcap bus;
        public API_Nhacungcap(IBUS_Nhacungcap bus)
        {
            this.bus = bus;
        }


        

        // DELETE api/<API_Nhacungcap>/5
        [Route("Get-all")]
        [HttpGet]
        public ActionResult<IEnumerable<Nhacungcap>> getall()
        {
            var list =bus.Getall();
            return Ok(list);
        }

        [Route("Create")]
        [HttpPost]
        public Nhacungcap create([FromBody] Nhacungcap model)
        {
            bus.Add(model);
            return model;
        }

        [Route("Delete/{id}")]
        [HttpDelete]
        public IActionResult Delete(string id)
        {
            bus.Delete(id);
            return Ok();
        }
        [Route("Update")]
        [HttpPut]
        public Nhacungcap Update([FromBody] Nhacungcap model)
        {
            bus.Update(model);
            return model;
        }
        //[Route("Search/{key}")]
        //[HttpGet]
        //public ActionResult Search(string key)
        //{
        //    var list = bus.Search(key);
        //    return Ok(list);
        //}
        [Route("GetbyId")]
        [HttpGet]
        public Nhacungcap GetbyId(int id)
        {
             
            return bus.GetNCCbyID(id);
        }

    }
}
