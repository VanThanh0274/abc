using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;
using System;
using System.IO;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Blog : ControllerBase
    {
        private IBUS_Blog _bus;
        public Ctr_Blog(IBUS_Blog bus)
        {
            _bus = bus;
        }

        [HttpGet("GetallDanhmuc")]
        public IActionResult GetAllDanhmuc()
        {
            try
            {
                var result = _bus.GetAllDanhmuc();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,admin")]
        [HttpPost("CreateDanhmuc")]
        public IActionResult CreateDanhmuc([FromBody] DanhMucBlog model)
        {
            try
            {
                _bus.CreateDanhmuc(model);
                return Ok(new { message = "Tạo danh mục thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,admin")]
        [HttpDelete("DeleteDanhmuc")]
        public IActionResult DeleteDanhmuc(int id)
        {
            try
            {
                _bus.DeleteDanhmuc(id);
                return Ok(new { message = "Xóa danh mục thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Getall")]
        public IActionResult Getall(int page_number = 1, int page_size = 10)
        {
            try
            {
                var result = _bus.Getall(page_number, page_size);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Getbyid")]
        public IActionResult Getbyid(int id)
        {
            try
            {
                var result = _bus.Getbyid(id);
                if (result == null) return NotFound(new { message = "Không tìm thấy bài viết" });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,admin")]
        [HttpPost("Create")]
        public IActionResult Create([FromBody] Blog model)
        {
            try
            {
                _bus.Create(model);
                return Ok(new { message = "Đăng bài viết thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,admin")]
        [HttpPut("Update")]
        public IActionResult Update([FromBody] Blog model)
        {
            try
            {
                _bus.Update(model);
                return Ok(new { message = "Cập nhật bài viết thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,admin")]
        [HttpDelete("Delete")]
        public IActionResult Delete(int id)
        {
            try
            {
                _bus.Delete(id);
                return Ok(new { message = "Xóa bài viết thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Search")]
        public IActionResult Search(string? keyword = "", string? trangthai = "", int page_number = 1, int page_size = 10)
        {
            try
            {
                var result = _bus.Search(keyword ?? "", trangthai ?? "", page_number, page_size);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("IncreaseView")]
        public IActionResult IncreaseView(int id)
        {
            try
            {
                _bus.IncreaseView(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,admin")]
        [HttpPost("UploadImage")]
        public IActionResult UploadImage()
        {
            try
            {
                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                    string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "blog");
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    string fileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                    string fullPath = Path.Combine(path, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    string url = $"{Request.Scheme}://{Request.Host}/images/blog/{fileName}";
                    return Ok(new { Message = "Thành công", url = url });
                }
                else
                {
                    return BadRequest("Không có file nào được tải lên.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
