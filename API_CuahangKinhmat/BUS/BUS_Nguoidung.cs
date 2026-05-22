using BUS.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DAL.Helper;

namespace BUS
{
    public class BUS_Nguoidung: Ibus_Nguoidung
    {
        private Idal_Nguoidung dal;
        private string Secret;
        public BUS_Nguoidung(Idal_Nguoidung dal, IConfiguration configuration)
        {
            this.dal = dal;
            Secret = configuration["AppSettings:Secret"];
        }

        
        public Nguoidung Login(string username, string password)
        {
            var user = dal.GetUser(username, password);
            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),

                    new Claim(ClaimTypes.Name, user.ten.ToString()),
                    new Claim(ClaimTypes.StreetAddress, user.email),
                    new Claim(ClaimTypes.Role, user.role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.token = tokenHandler.WriteToken(token);

            return user;

        }
        
        public bool Insert(Nguoidung nguoidung)
        {
            return dal.Insert(nguoidung);
        }
        public bool Update(Nguoidung nguoidung)
        {
            return dal.Update(nguoidung);
        }
        public Nguoidung Getbyid(int id)
        {
            return dal.Getbyid(id);
        }
        public bool ChangePassword(string password, int id)
        {
            return dal.ChangePassword(password, id);
        }
        public ResponseData<List<Nguoidung>> Getall(int page_number, int page_size)
        {
            return dal.Getall(page_number, page_size);

        }
        public bool UpdateRole(int id, string role, int state)
        {
            return dal.UpdateRole(id, role, state);
        }
    }
}
