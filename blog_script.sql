USE [API_Kinhmat];
GO

-- 1. BẢNG DANH MỤC BLOG
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DanhMucBlog]') AND type in (N'U'))
BEGIN
    CREATE TABLE DanhMucBlog (
        id        INT IDENTITY(1,1) PRIMARY KEY,
        ten       NVARCHAR(150) NOT NULL,
        trangthai INT DEFAULT 1 -- 1: Hoạt động, 0: Tạm ẩn, -1: Đã xóa
    );
END
GO

-- 2. BẢNG BLOG
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Blog]') AND type in (N'U'))
BEGIN
    CREATE TABLE Blog (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        tieude      NVARCHAR(300)  NOT NULL,
        noidung     NVARCHAR(MAX)  NOT NULL,
        tomtat      NVARCHAR(500)  NULL,
        anh         NVARCHAR(300)  NULL,
        madanhmuc   INT            NULL FOREIGN KEY REFERENCES DanhMucBlog(id),
        tacgia      NVARCHAR(100)  NULL,
        luotxem     INT            DEFAULT 0,
        trangthai   INT            DEFAULT 1,  -- 1: Đã đăng, 0: Nháp, -1: Đã xóa
        ngaytao     DATETIME       DEFAULT GETDATE(),
        ngaycapnhat DATETIME       DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- STORED PROCEDURES CHO DANH MỤC BLOG
-- =============================================

-- Danh sách danh mục
CREATE OR ALTER PROCEDURE sp_danhmucblog_getall
AS
BEGIN
    SELECT * 
    FROM DanhMucBlog 
    WHERE trangthai >= 0 
    ORDER BY ten ASC;
END
GO

-- Tạo danh mục
CREATE OR ALTER PROCEDURE sp_danhmucblog_create
    @ten NVARCHAR(150),
    @trangthai INT = 1
AS
BEGIN
    INSERT INTO DanhMucBlog(ten, trangthai)
    VALUES(@ten, @trangthai);
END
GO

-- Xóa danh mục (Soft Delete)
CREATE OR ALTER PROCEDURE sp_danhmucblog_delete
    @id INT
AS
BEGIN
    UPDATE DanhMucBlog 
    SET trangthai = -1 
    WHERE id = @id;
    
    -- Xóa mềm các blog thuộc danh mục này
    UPDATE Blog
    SET trangthai = -1
    WHERE madanhmuc = @id;
END
GO


-- =============================================
-- STORED PROCEDURES CHO BLOG
-- =============================================

-- Lấy danh sách (Phân trang)
CREATE OR ALTER PROCEDURE sp_blog_getall
    @page_number INT,
    @page_size INT
AS
BEGIN
    SELECT 
        b.*,
        d.ten as tendanhmuc
    FROM Blog b
    LEFT JOIN DanhMucBlog d ON b.madanhmuc = d.id
    WHERE b.trangthai >= 0
    ORDER BY b.ngaycapnhat DESC
    OFFSET (@page_number - 1) * @page_size ROWS
    FETCH NEXT @page_size ROWS ONLY;
END
GO

-- Đếm tổng số lượng (Phân trang)
CREATE OR ALTER PROCEDURE sp_blog_getall_count
AS
BEGIN
    SELECT COUNT(*) FROM Blog WHERE trangthai >= 0;
END
GO

-- Chi tiết Blog theo ID
CREATE OR ALTER PROCEDURE sp_blog_getbyid
    @id INT
AS
BEGIN
    SELECT 
        b.*,
        d.ten as tendanhmuc
    FROM Blog b
    LEFT JOIN DanhMucBlog d ON b.madanhmuc = d.id
    WHERE b.id = @id AND b.trangthai >= 0;
END
GO

-- Thêm mới Blog
CREATE OR ALTER PROCEDURE sp_blog_create
    @tieude NVARCHAR(300),
    @noidung NVARCHAR(MAX),
    @tomtat NVARCHAR(500),
    @anh NVARCHAR(300),
    @madanhmuc INT,
    @tacgia NVARCHAR(100),
    @trangthai INT
AS
BEGIN
    INSERT INTO Blog (tieude, noidung, tomtat, anh, madanhmuc, tacgia, trangthai, ngaytao, ngaycapnhat)
    VALUES (@tieude, @noidung, @tomtat, @anh, @madanhmuc, @tacgia, @trangthai, GETDATE(), GETDATE());
END
GO

-- Cập nhật Blog
CREATE OR ALTER PROCEDURE sp_blog_update
    @id INT,
    @tieude NVARCHAR(300),
    @noidung NVARCHAR(MAX),
    @tomtat NVARCHAR(500),
    @anh NVARCHAR(300),
    @madanhmuc INT,
    @tacgia NVARCHAR(100),
    @trangthai INT
AS
BEGIN
    UPDATE Blog
    SET tieude = @tieude,
        noidung = @noidung,
        tomtat = @tomtat,
        anh = @anh,
        madanhmuc = @madanhmuc,
        tacgia = @tacgia,
        trangthai = @trangthai,
        ngaycapnhat = GETDATE()
    WHERE id = @id;
END
GO

-- Xóa Blog (Soft Delete)
CREATE OR ALTER PROCEDURE sp_blog_delete
    @id INT
AS
BEGIN
    UPDATE Blog
    SET trangthai = -1
    WHERE id = @id;
END
GO

-- Tìm kiếm Blog
CREATE OR ALTER PROCEDURE sp_blog_search
    @keyword NVARCHAR(250),
    @trangthai NVARCHAR(10), -- Có thể là chuỗi rỗng để không lọc trạng thái
    @page_number INT,
    @page_size INT
AS
BEGIN
    SELECT 
        b.*,
        d.ten as tendanhmuc
    FROM Blog b
    LEFT JOIN DanhMucBlog d ON b.madanhmuc = d.id
    WHERE 
        b.trangthai >= 0
        AND (@trangthai = '' OR CAST(b.trangthai AS NVARCHAR) = @trangthai)
        AND (b.tieude LIKE '%' + @keyword + '%' OR b.tacgia LIKE '%' + @keyword + '%')
    ORDER BY b.ngaycapnhat DESC
    OFFSET (@page_number - 1) * @page_size ROWS
    FETCH NEXT @page_size ROWS ONLY;
END
GO

-- Đếm tổng số lượng tìm kiếm
CREATE OR ALTER PROCEDURE sp_blog_search_count
    @keyword NVARCHAR(250),
    @trangthai NVARCHAR(10)
AS
BEGIN
    SELECT COUNT(*) 
    FROM Blog 
    WHERE trangthai >= 0
        AND (@trangthai = '' OR CAST(trangthai AS NVARCHAR) = @trangthai)
        AND (tieude LIKE '%' + @keyword + '%' OR tacgia LIKE '%' + @keyword + '%');
END
GO

-- Tăng lượt xem
CREATE OR ALTER PROCEDURE sp_blog_increase_view
    @id INT
AS
BEGIN
    UPDATE Blog
    SET luotxem = ISNULL(luotxem, 0) + 1
    WHERE id = @id;
END
GO
