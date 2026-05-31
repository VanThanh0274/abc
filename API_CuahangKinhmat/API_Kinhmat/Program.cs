using API_Kinhmat.Services;
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
builder.Services.AddHttpClient();

// DI registrations
builder.Services.AddTransient<IDbSql, DbSql>();
builder.Services.AddTransient<IDAL_Nhacungcap, DAL_Nhacungcap>();
builder.Services.AddTransient<IBUS_Nhacungcap, BUS_Nhacungcap>();
builder.Services.AddTransient<Idal_Danhmuc, DAL_Danhmuc>();
builder.Services.AddTransient<Ibus_Danhmuc, BUS_Danhmuc>();
builder.Services.AddTransient<IDAL_kinhmat, DAL_Kinhmat>();
builder.Services.AddTransient<Ibus_Kinhmat, BUS_Kinhmat>();
builder.Services.AddTransient<Idal_Donhang, DAL_Donhang>();
builder.Services.AddTransient<Ibus_Donhang, BUS_Donhang>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<Ibus_Nguoidung, BUS_Nguoidung>();
builder.Services.AddTransient<Idal_Nguoidung, DAL_Nguoidung>();
builder.Services.AddTransient<Ibus_Thongke, BUS_Thongke>();
builder.Services.AddTransient<Idal_Thongke, DAL_Thongke>();
builder.Services.AddTransient<Idal_Message, DAL_Message>();
builder.Services.AddTransient<Ibus_Message, BUS_Message>();

// Lịch sử giá - Price History
builder.Services.AddTransient<IDAL_LichSuGia, DAL_LichSuGia>();
builder.Services.AddTransient<IBUS_LichSuGia, BUS_LichSuGia>();

// Hóa đơn nhập kho - Purchase Invoices
builder.Services.AddTransient<IDAL_HoadonNhap, DAL_HoadonNhap>();
builder.Services.AddTransient<IBUS_HoadonNhap, BUS_HoadonNhap>();

// Hóa đơn xuất kho - Sales Invoices
builder.Services.AddTransient<IDAL_HoadonXuat, DAL_HoadonXuat>();
builder.Services.AddTransient<IBUS_HoadonXuat, BUS_HoadonXuat>();

// Khuyến mãi
builder.Services.AddTransient<IDAL_Khuyenmai, DAL_Khuyenmai>();
builder.Services.AddTransient<IBUS_Khuyenmai, BUS_Khuyenmai>();

// Blog
builder.Services.AddTransient<IDAL_Blog, DAL_Blog>();
builder.Services.AddTransient<IBUS_Blog, BUS_Blog>();

// Danh gia
builder.Services.AddTransient<Idal_Danhgia, DAL_Danhgia>();
builder.Services.AddTransient<Ibus_Danhgia, BUS_Danhgia>();

// Giohang
builder.Services.AddTransient<Idal_Giohang, DAL_Giohang>();
builder.Services.AddTransient<Ibus_Giohang, BUS_Giohang>();

// Voucher
builder.Services.AddTransient<Idal_Voucher, DAL_Voucher>();
builder.Services.AddTransient<Ibus_Voucher, BUS_Voucher>();

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

app.MapControllers();

app.Run();
