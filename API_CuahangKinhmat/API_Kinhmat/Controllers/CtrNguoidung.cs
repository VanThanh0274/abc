using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CtrNguoidung : ControllerBase
    {
        private Ibus_Nguoidung bus;
        public CtrNguoidung(Ibus_Nguoidung bus)
        {
            this.bus = bus;
        }
        
        [HttpPost]
        [Route("login")]
        public IActionResult Get([FromBody] AuthenticateModel model)
        {
            Nguoidung user= bus.Login(model.username,model.pass);
            if (user == null)
                return BadRequest(new { message = "Tài khoản và mật khẩu không chính xác" });

            return Ok(new { id=user.id,username = user.username, hoten = user.ten,user.role, token = user.token });
        }
        [HttpPost]
        [Route("create")]
        public IActionResult create([FromBody] Nguoidung user)
        {
            if (bus.Insert(user))
            {
                return Ok(new {mess="Thành công",user});
            }
            else
            {
                return BadRequest("Đã có lỗi");
            }
        }
        [HttpPut]
        [Route("update")]
        public IActionResult update([FromBody] Nguoidung user)
        {
            if (bus.Update(user))
            {
                return Ok(new { mess = "Thành công", user });
            }
            else
            {
                return BadRequest("Đã có lỗi");
            }
        }
        [HttpGet]
        [Route("getbyid")]
        public Nguoidung Getbyid(int id)
        {
            var list =bus.Getbyid(id);
            return list;
        }
        [HttpGet]
        [Route("Changepassword")]
        public IActionResult Changepass(string password, int id)
        {
            var kt = bus.ChangePassword(password,id);
            if (kt)
            {
                return Ok(new { messeage = "Thành công" });
            }
            else
            {
                return BadRequest(new { messeage = "Thất bại" });
            }
        }
        [HttpGet]
        [Route("Getall")]
        public IActionResult Getall(int page_number, int page_size)
        {
            var list = bus.Getall(page_number,page_size);
            return Ok(list);
        }
        [HttpGet]
        [Route("UpdateRole")]
        public IActionResult UpdateRole(int id, string role, int state)
        {
            var list = bus.UpdateRole(id,role,state);
            return Ok(new {mess= "huy"});
        }
    }
}
