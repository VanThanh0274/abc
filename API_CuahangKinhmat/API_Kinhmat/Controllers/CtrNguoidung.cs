using BUS.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;
using API_Kinhmat.Services;
using System;
using System.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CtrNguoidung : ControllerBase
    {
        private Ibus_Nguoidung bus;
        private readonly IEmailService _emailService;

        public CtrNguoidung(Ibus_Nguoidung bus, IEmailService emailService)
        {
            this.bus = bus;
            _emailService = emailService;
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

        [HttpPost]
        [Route("UpgradeVip")]
        [Authorize]
        public IActionResult UpgradeVip()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int userId))
            {
                try
                {
                    var success = bus.UpgradeVip(userId);
                    if (success)
                        return Ok(new { message = "Nâng cấp VIP thành công!" });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
                return BadRequest(new { message = "Lỗi khi nâng cấp VIP." });
            }
            return Unauthorized(new { message = "Không xác định được người dùng." });
        }

        [HttpGet]
        [Route("VipProgress")]
        [Authorize]
        public IActionResult VipProgress()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int userId))
            {
                int tongChiTieu = bus.GetVipProgress(userId);
                int mucTieu = 5000000;
                
                var profile = bus.Getbyid(userId);
                bool isVip = profile != null && profile.is_vip == 1;

                return Ok(new 
                { 
                    tongChiTieu = tongChiTieu, 
                    mucTieu = mucTieu, 
                    isVip = isVip 
                });
            }
            return Unauthorized(new { message = "Không xác định được người dùng." });
        }

        public class ForgotPasswordModel
        {
            public string Email { get; set; }
        }

        [HttpPost]
        [Route("ForgotPassword")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { message = "Vui lòng cung cấp email." });
            }

            var user = bus.GetByEmail(model.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Email này chưa được đăng ký trong hệ thống!" });
            }

            // Tạo mật khẩu mới ngẫu nhiên (6 ký tự)
            string newPassword = GenerateRandomPassword(6);

            // Cập nhật vào DB
            bool changed = bus.ChangePassword(newPassword, user.id);
            if (changed)
            {
                return Ok(new { 
                    message = "Tạo mật khẩu mới thành công!",
                    newPassword = newPassword
                });
            }

            return BadRequest(new { message = "Có lỗi khi cập nhật mật khẩu." });
        }

        private string GenerateRandomPassword(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
