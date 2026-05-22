using BUS;
using BUS.Interface;
using DAL;
using DAL.Helper.Interface;
using DAL.Interface;
using DAL.SQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddTransient<IDbSql, DbSql>();
builder.Services.AddTransient<IDAL_Nhacungcap, DAL_Nhacungcap>();
builder.Services.AddTransient<IBUS_Nhacungcap, BUS_Nhacungcap>();
builder.Services.AddTransient<Idal_Danhmuc, DAL_Danhmuc>();
builder.Services.AddTransient<Ibus_Danhmuc, BUS_Danhmuc>();
builder.Services.AddTransient<IDAL_kinhmat, DAL_Kinhmat>();
builder.Services.AddTransient<Ibus_Kinhmat, BUS_Kinhmat>();
builder.Services.AddTransient<Idal_Donhang, DAL_Donhang>();
builder.Services.AddTransient<Ibus_Donhang, BUS_Donhang>();
builder.Services.AddTransient<Ibus_Nguoidung, BUS_Nguoidung>();
builder.Services.AddTransient<Idal_Nguoidung, DAL_Nguoidung>();
builder.Services.AddTransient<Ibus_Thongke, BUS_Thongke>();
builder.Services.AddTransient<Idal_Thongke, DAL_Thongke>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var key = Encoding.ASCII.GetBytes(builder.Configuration["AppSettings:Secret"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Swagger with JWT support
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token với tiền tố 'Bearer' (ví dụ: Bearer {token})"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


var app = builder.Build();
//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider("D:\\Năm Ba\\Call API\\apikinhmat\\image\\product"),
//    RequestPath = "/files"
//});
//tự thêm của chat
app.UseCors(builder =>
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader());



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseAuthorization();

app.MapControllers();


app.Run();
