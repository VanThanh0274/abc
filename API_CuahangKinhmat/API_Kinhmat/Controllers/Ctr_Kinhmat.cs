using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;
using System.IO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class Ctr_Kinhmat : ControllerBase
    {
        private Ibus_Kinhmat _bus;
        private string path;
        private readonly IWebHostEnvironment _env;
        public Ctr_Kinhmat (Ibus_Kinhmat bus,IConfiguration configuration, IWebHostEnvironment env)
        {
            _bus = bus;
            path = configuration["AppSettings:PATH"];
            _env = env;
        }
        // GET: api/<Ctr_Kinhmat>
        [HttpGet]
        [Route("Getall")]
        public ResponseData<List<modelKinhmat>> Getall(int page_number,int page_size)
        {
            
            return _bus.Getall(page_number, page_size);
        }
        [HttpGet]
        [Route("Getbyid")]
        public Kinhmat Getbyid(string id)
        {
            return _bus.Getbyid(id);
        }
        [HttpPut]
        [Route("Update")]
        public Kinhmat update([FromBody] Kinhmat kinhmat)
        {
            _bus.Update(kinhmat);
            return kinhmat;
        }
        [HttpPost]
        [Route("Create")]
        public Kinhmat creat([FromBody] Kinhmat kinhmat)
        {
            _bus.Add(kinhmat);
            return kinhmat;
        }
        [HttpDelete]
        [Route("Delete")]
        public ActionResult<Kinhmat> Delete(int id)
        {
            _bus.Delete(id);
            return Ok();
        }

        [HttpPost]
        [Route("Upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            try
            {
                string diachi = path + $"/{file.FileName}";
                using (var stream = new FileStream(diachi, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                string url = $"{Request.Scheme}://{Request.Host}/images/product/{file.FileName}";
                return Ok(new { Message = "Thành công", url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Không tìm thây \n {ex.Message}");
            }
        }
        [HttpGet]
        [Route("Search")]
        public IActionResult Search(string? kinhmat, int page_number, int page_size)
        {
            if(kinhmat == null)
            {
                kinhmat = "";
            }
            var list = _bus.SearchAdmin(kinhmat, page_number, page_size);
            return Ok(list);
        }

        
    }
}
