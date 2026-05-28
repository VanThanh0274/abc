USE [API_Kinhmat]
GO

-- =============================================
-- MIGRATION NÂNG CAO v2 - PHÙ HỢP VỚI DB THỰC TẾ
-- DB thực tế dùng: Kinhmat (có giaban, gianhap trực tiếp)
--                  DonhangChitiet (cột masp → Kinhmat.id)
--                  KHÔNG có bảng KinhmatSKU
-- =============================================

-- =============================================
-- 1. BẢNG NHÀ CUNG CẤP (tạo nếu chưa có)
-- =============================================
IF OBJECT_ID('dbo.Nhacungcap', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Nhacungcap](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [tenncc] [nvarchar](100) NOT NULL,
        [sdt] [nvarchar](50) NULL,
        [email] [nvarchar](100) NULL,
        [diachi] [nvarchar](250) NULL,
        [trangthai] [int] NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Nhacungcap] PRIMARY KEY CLUSTERED ([id] ASC)
    )
    PRINT N'[OK] Đã tạo bảng Nhacungcap'
END
ELSE
    PRINT N'[SKIP] Bảng Nhacungcap đã tồn tại'
GO

-- =============================================
-- 2. BẢNG LỊCH SỬ GIÁ (FK → Kinhmat.id, không cần KinhmatSKU)
-- =============================================
IF OBJECT_ID('dbo.LichSuGia', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[LichSuGia]
    PRINT N'[DROP] Đã xóa bảng LichSuGia cũ'
END
GO

CREATE TABLE [dbo].[LichSuGia](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [masp] [int] NOT NULL,                   -- FK → Kinhmat.id
    [gianhap] [int] NOT NULL DEFAULT 0,
    [giaban] [int] NOT NULL DEFAULT 0,
    [ngayapdung] [datetime] NOT NULL DEFAULT GETDATE(),
    [ngayketthuc] [datetime] NULL,
    [trangthai] [int] NOT NULL DEFAULT 1,    -- 1: Đang áp dụng, 0: Hết hạn
    CONSTRAINT [PK_LichSuGia] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_LichSuGia_Kinhmat] FOREIGN KEY([masp])
        REFERENCES [dbo].[Kinhmat] ([id]) ON DELETE CASCADE
)
GO
PRINT N'[OK] Đã tạo bảng LichSuGia (FK → Kinhmat.id)'
GO

-- =============================================
-- 3. BẢNG HÓA ĐƠN NHẬP KHO (FK → Kinhmat.id)
-- =============================================
IF OBJECT_ID('dbo.HoadonNhapChitiet', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[HoadonNhapChitiet]
    PRINT N'[DROP] Đã xóa bảng HoadonNhapChitiet cũ'
END
IF OBJECT_ID('dbo.HoadonNhap', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[HoadonNhap]
    PRINT N'[DROP] Đã xóa bảng HoadonNhap cũ'
END
GO

CREATE TABLE [dbo].[HoadonNhap](
    [mahdn] [int] IDENTITY(1,1) NOT NULL,
    [mancc] [int] NOT NULL,
    [ngaynhap] [datetime] NOT NULL DEFAULT GETDATE(),
    [tongtien] [int] NOT NULL DEFAULT 0,
    [nguoinhap] [nvarchar](100) NULL,
    [ghichu] [nvarchar](500) NULL,
    [trangthai] [int] NOT NULL DEFAULT 0,    -- 0: Nháp, 1: Đã nhập kho
    CONSTRAINT [PK_HoadonNhap] PRIMARY KEY CLUSTERED ([mahdn] ASC),
    CONSTRAINT [FK_HoadonNhap_Nhacungcap] FOREIGN KEY([mancc])
        REFERENCES [dbo].[Nhacungcap] ([id])
)
GO

CREATE TABLE [dbo].[HoadonNhapChitiet](
    [macthdn] [int] IDENTITY(1,1) NOT NULL,
    [mahdn] [int] NOT NULL,
    [masp] [int] NOT NULL,                   -- FK → Kinhmat.id
    [soluong] [int] NOT NULL DEFAULT 1,
    [gianhap] [int] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_HoadonNhapChitiet] PRIMARY KEY CLUSTERED ([macthdn] ASC),
    CONSTRAINT [FK_HoadonNhapChitiet_HoadonNhap] FOREIGN KEY([mahdn])
        REFERENCES [dbo].[HoadonNhap] ([mahdn]) ON DELETE CASCADE,
    CONSTRAINT [FK_HoadonNhapChitiet_Kinhmat] FOREIGN KEY([masp])
        REFERENCES [dbo].[Kinhmat] ([id])
)
GO
PRINT N'[OK] Đã tạo bảng HoadonNhap và HoadonNhapChitiet (FK → Kinhmat.id)'
GO

-- =============================================
-- 4. BẢNG HÓA ĐƠN XUẤT KHO (FK → Kinhmat.id)
-- =============================================
IF OBJECT_ID('dbo.HoadonXuatChitiet', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[HoadonXuatChitiet]
    PRINT N'[DROP] Đã xóa bảng HoadonXuatChitiet cũ'
END
IF OBJECT_ID('dbo.HoadonXuat', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[HoadonXuat]
    PRINT N'[DROP] Đã xóa bảng HoadonXuat cũ'
END
GO

CREATE TABLE [dbo].[HoadonXuat](
    [mahdx] [int] IDENTITY(1,1) NOT NULL,
    [mahd] [int] NOT NULL,
    [iduser] [int] NOT NULL,
    [ngayxuat] [datetime] NOT NULL DEFAULT GETDATE(),
    [tongtien] [int] NOT NULL DEFAULT 0,
    [nguoixuat] [nvarchar](100) NULL,
    [ghichu] [nvarchar](500) NULL,
    [trangthai] [int] NOT NULL DEFAULT 1,
    CONSTRAINT [PK_HoadonXuat] PRIMARY KEY CLUSTERED ([mahdx] ASC),
    CONSTRAINT [FK_HoadonXuat_Donhang] FOREIGN KEY([mahd])
        REFERENCES [dbo].[Donhang] ([mahd]),
    CONSTRAINT [FK_HoadonXuat_Nguoidung] FOREIGN KEY([iduser])
        REFERENCES [dbo].[Nguoidung] ([id])
)
GO

CREATE TABLE [dbo].[HoadonXuatChitiet](
    [macthdx] [int] IDENTITY(1,1) NOT NULL,
    [mahdx] [int] NOT NULL,
    [masp] [int] NOT NULL,                   -- FK → Kinhmat.id
    [soluong] [int] NOT NULL DEFAULT 1,
    [giaban] [int] NOT NULL DEFAULT 0,
    CONSTRAINT [PK_HoadonXuatChitiet] PRIMARY KEY CLUSTERED ([macthdx] ASC),
    CONSTRAINT [FK_HoadonXuatChitiet_HoadonXuat] FOREIGN KEY([mahdx])
        REFERENCES [dbo].[HoadonXuat] ([mahdx]) ON DELETE CASCADE,
    CONSTRAINT [FK_HoadonXuatChitiet_Kinhmat] FOREIGN KEY([masp])
        REFERENCES [dbo].[Kinhmat] ([id])
)
GO
PRINT N'[OK] Đã tạo bảng HoadonXuat và HoadonXuatChitiet (FK → Kinhmat.id)'
GO

-- =============================================
-- 5. TRIGGERS TỰ ĐỘNG CẬP NHẬT TỒN KHO
-- =============================================
CREATE OR ALTER TRIGGER [dbo].[trg_HoadonNhap_UpdateStock]
ON [dbo].[HoadonNhapChitiet]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    -- Cộng tồn kho khi nhập hàng
    UPDATE [dbo].[Kinhmat]
    SET [soluong] = [Kinhmat].[soluong] + inserted.[soluong]
    FROM [dbo].[Kinhmat]
    INNER JOIN inserted ON [Kinhmat].[id] = inserted.[masp]
END
GO

CREATE OR ALTER TRIGGER [dbo].[trg_HoadonXuat_UpdateStock]
ON [dbo].[HoadonXuatChitiet]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    -- Trừ tồn kho khi xuất hàng
    UPDATE [dbo].[Kinhmat]
    SET [soluong] = [Kinhmat].[soluong] - inserted.[soluong]
    FROM [dbo].[Kinhmat]
    INNER JOIN inserted ON [Kinhmat].[id] = inserted.[masp]
END
GO
PRINT N'[OK] Đã tạo Triggers cập nhật tồn kho (→ Kinhmat.soluong)'
GO

-- =============================================
-- 6. STORED PROCEDURES: LỊCH SỬ GIÁ
-- =============================================
CREATE OR ALTER PROC sp_lichsugia_getbysku (@masp INT)
AS
BEGIN
    SELECT lsg.*, km.ten AS tensp
    FROM [dbo].[LichSuGia] lsg
    INNER JOIN [dbo].[Kinhmat] km ON lsg.masp = km.id
    WHERE lsg.masp = @masp
    ORDER BY lsg.ngayapdung DESC
END
GO

CREATE OR ALTER PROC sp_lichsugia_getall_active
AS
BEGIN
    SELECT lsg.*, km.ten AS tensp, km.anh
    FROM [dbo].[LichSuGia] lsg
    INNER JOIN [dbo].[Kinhmat] km ON lsg.masp = km.id
    WHERE lsg.trangthai = 1
    ORDER BY lsg.ngayapdung DESC
END
GO

-- Thêm mức giá mới, tự động đóng giá cũ và cập nhật ngay vào Kinhmat
CREATE OR ALTER PROC sp_lichsugia_create
(
    @masp INT,
    @gianhap INT,
    @giaban INT
)
AS
BEGIN
    BEGIN TRANSACTION
    -- Đóng giá cũ đang áp dụng
    UPDATE [dbo].[LichSuGia]
    SET ngayketthuc = GETDATE(), trangthai = 0
    WHERE masp = @masp AND trangthai = 1

    -- Tạo giá mới
    INSERT INTO [dbo].[LichSuGia] (masp, gianhap, giaban, ngayapdung, trangthai)
    VALUES (@masp, @gianhap, @giaban, GETDATE(), 1)

    -- Cập nhật giá hiện tại ngay vào bảng Kinhmat (để code cũ vẫn hoạt động)
    UPDATE [dbo].[Kinhmat]
    SET gianhap = @gianhap, giaban = @giaban
    WHERE id = @masp
    COMMIT
END
GO
PRINT N'[OK] Đã tạo Stored Procedures cho LichSuGia'
GO

-- =============================================
-- 7. STORED PROCEDURES: HÓA ĐƠN NHẬP KHO
-- =============================================
CREATE OR ALTER PROC sp_hoadonnhap_getall
AS
BEGIN
    SELECT hdn.*, ncc.tenncc
    FROM [dbo].[HoadonNhap] hdn
    INNER JOIN [dbo].[Nhacungcap] ncc ON hdn.mancc = ncc.id
    ORDER BY hdn.ngaynhap DESC
END
GO

CREATE OR ALTER PROC sp_hoadonnhap_getbyid (@mahdn INT)
AS
BEGIN
    SELECT hdn.*, ncc.tenncc
    FROM [dbo].[HoadonNhap] hdn
    INNER JOIN [dbo].[Nhacungcap] ncc ON hdn.mancc = ncc.id
    WHERE hdn.mahdn = @mahdn
END
GO

CREATE OR ALTER PROC sp_hoadonnhap_chitiet_getbyid (@mahdn INT)
AS
BEGIN
    SELECT ct.*, km.ten AS tensp, km.anh
    FROM [dbo].[HoadonNhapChitiet] ct
    INNER JOIN [dbo].[Kinhmat] km ON ct.masp = km.id
    WHERE ct.mahdn = @mahdn
END
GO

CREATE OR ALTER PROC sp_hoadonnhap_create
(
    @mancc INT,
    @nguoinhap NVARCHAR(100),
    @ghichu NVARCHAR(500)
)
AS
BEGIN
    INSERT INTO [dbo].[HoadonNhap] (mancc, ngaynhap, tongtien, nguoinhap, ghichu, trangthai)
    VALUES (@mancc, GETDATE(), 0, @nguoinhap, @ghichu, 0)
    SELECT SCOPE_IDENTITY() AS mahdn
END
GO

CREATE OR ALTER PROC sp_hoadonnhap_addchitiet
(
    @mahdn INT,
    @masp INT,
    @soluong INT,
    @gianhap INT
)
AS
BEGIN
    INSERT INTO [dbo].[HoadonNhapChitiet] (mahdn, masp, soluong, gianhap)
    VALUES (@mahdn, @masp, @soluong, @gianhap)

    -- Cập nhật tổng tiền hóa đơn nhập
    UPDATE [dbo].[HoadonNhap]
    SET tongtien = (SELECT SUM(soluong * gianhap) FROM [dbo].[HoadonNhapChitiet] WHERE mahdn = @mahdn)
    WHERE mahdn = @mahdn
END
GO

CREATE OR ALTER PROC sp_hoadonnhap_confirm (@mahdn INT)
AS
BEGIN
    UPDATE [dbo].[HoadonNhap] SET trangthai = 1 WHERE mahdn = @mahdn
END
GO
PRINT N'[OK] Đã tạo Stored Procedures cho HoadonNhap'
GO

-- =============================================
-- 8. STORED PROCEDURES: HÓA ĐƠN XUẤT KHO
-- =============================================
CREATE OR ALTER PROC sp_hoadonxuat_getall
AS
BEGIN
    SELECT hdx.*, nd.ten AS tenkhachhang, dh.diachi, dh.sdt
    FROM [dbo].[HoadonXuat] hdx
    INNER JOIN [dbo].[Nguoidung] nd ON hdx.iduser = nd.id
    INNER JOIN [dbo].[Donhang] dh ON hdx.mahd = dh.mahd
    ORDER BY hdx.ngayxuat DESC
END
GO

CREATE OR ALTER PROC sp_hoadonxuat_getbyid (@mahdx INT)
AS
BEGIN
    SELECT hdx.*, nd.ten AS tenkhachhang, dh.diachi, dh.sdt
    FROM [dbo].[HoadonXuat] hdx
    INNER JOIN [dbo].[Nguoidung] nd ON hdx.iduser = nd.id
    INNER JOIN [dbo].[Donhang] dh ON hdx.mahd = dh.mahd
    WHERE hdx.mahdx = @mahdx
END
GO

CREATE OR ALTER PROC sp_hoadonxuat_chitiet_getbyid (@mahdx INT)
AS
BEGIN
    SELECT ct.*, km.ten AS tensp, km.anh
    FROM [dbo].[HoadonXuatChitiet] ct
    INNER JOIN [dbo].[Kinhmat] km ON ct.masp = km.id
    WHERE ct.mahdx = @mahdx
END
GO

-- Tạo hóa đơn xuất từ đơn hàng đã được duyệt
-- DonhangChitiet dùng cột 'masp' (FK → Kinhmat.id)
CREATE OR ALTER PROC sp_hoadonxuat_create_from_donhang
(
    @mahd INT,
    @nguoixuat NVARCHAR(100),
    @ghichu NVARCHAR(500)
)
AS
BEGIN
    BEGIN TRANSACTION
    DECLARE @iduser INT, @tongtien INT
    SELECT @iduser = iduser, @tongtien = tongtien FROM [dbo].[Donhang] WHERE mahd = @mahd

    -- Tạo hóa đơn xuất
    DECLARE @mahdx INT
    INSERT INTO [dbo].[HoadonXuat] (mahd, iduser, ngayxuat, tongtien, nguoixuat, ghichu, trangthai)
    VALUES (@mahd, @iduser, GETDATE(), @tongtien, @nguoixuat, @ghichu, 1)
    SET @mahdx = SCOPE_IDENTITY()

    -- Sao chép chi tiết từ DonhangChitiet (dùng cột 'masp' đúng của DB thực tế)
    INSERT INTO [dbo].[HoadonXuatChitiet] (mahdx, masp, soluong, giaban)
    SELECT @mahdx, ct.masp, ct.soluong, ct.giaban
    FROM [dbo].[DonhangChitiet] ct
    WHERE ct.mahd = @mahd

    COMMIT
    SELECT @mahdx AS mahdx
END
GO
PRINT N'[OK] Đã tạo Stored Procedures cho HoadonXuat'
GO

PRINT N'====== MIGRATION HOÀN TẤT THÀNH CÔNG ======'
GO
