create or alter proc sp_danhmuc_create
(@danhmuc nvarchar(50),
@mota nvarchar(50))
as
begin
	insert into Danhmuc 
	values(@danhmuc,@mota)
end
go


CREATE OR ALTER PROCEDURE sp_danhmuc_update
    @id INT,
    @danhmuc NVARCHAR(50),
    @mota NVARCHAR(50)
AS
BEGIN
    UPDATE Danhmuc
    SET 
        [danhmuc] = @danhmuc,
        [mota] = @mota
    WHERE [id] = @id
END
go



CREATE OR ALTER PROCEDURE sp_danhmuc_delete
    @id INT
AS
BEGIN
    DELETE FROM Danhmuc
    WHERE [id] = @id
END
go

CREATE OR ALTER PROCEDURE sp_danhmuc_select_all
AS
BEGIN
    SELECT [id], [danhmuc], [mota]
    FROM Danhmuc
END
go


CREATE OR ALTER PROCEDURE sp_danhmuc_select_by_id
    @id INT
AS
BEGIN
    SELECT [id], [danhmuc], [mota]
    FROM Danhmuc
    WHERE [id] = @id
END
go


--Thủ tục Kính mắt
CREATE OR ALTER PROCEDURE sp_kinhmat_create
    @ten NVARCHAR(50),
    @soluong INT,
    @madanhmuc INT,
    @thuonghieu NVARCHAR(50),
    @xuatxu NVARCHAR(50),
    @chatlieu NVARCHAR(50),
    @kieudang NVARCHAR(50),
    @mota NVARCHAR(50),
    @anh NVARCHAR(50),
    @trangthai INT
AS
BEGIN
    INSERT INTO Kinhmat (
        [ten], [soluong], [madanhmuc], [thuonghieu], [xuatxu],
        [chatlieu], [kieudang], [mota], [anh], [trangthai]
    )
    VALUES (
        @ten, @soluong, @madanhmuc, @thuonghieu, @xuatxu,
        @chatlieu, @kieudang, @mota, @anh, @trangthai
    )
END
go

CREATE OR ALTER PROCEDURE sp_kinhmat_update
    @id INT,
    @ten NVARCHAR(50),
    @soluong INT,
    @madanhmuc INT,
    @thuonghieu NVARCHAR(50),
    @xuatxu NVARCHAR(50),
    @chatlieu NVARCHAR(50),
    @kieudang NVARCHAR(50),
    @mota NVARCHAR(50),
    @anh NVARCHAR(50),
    @trangthai INT
AS
BEGIN
    UPDATE Kinhmat
    SET 
        [ten] = @ten,
        [soluong] = @soluong,
        [madanhmuc] = @madanhmuc,
        [thuonghieu] = @thuonghieu,
        [xuatxu] = @xuatxu,
        [chatlieu] = @chatlieu,
        [kieudang] = @kieudang,
        [mota] = @mota,
        [anh] = @anh,
        [trangthai] = @trangthai
    WHERE [id] = @id
END
go


CREATE OR ALTER PROCEDURE sp_kinhmat_delete
    @id INT
AS
BEGIN
    DELETE FROM Kinhmat
    WHERE id = @id
END
go

CREATE OR ALTER PROCEDURE sp_kinhmat_select_all
AS
BEGIN
    SELECT 
        [id], [ten], [soluong], [madanhmuc], [thuonghieu],
        [xuatxu], [chatlieu], [kieudang], [mota], [anh], [trangthai]
    FROM Kinhmat
END
go


CREATE OR ALTER PROCEDURE sp_kinhmat_select_by_id
    @id INT
AS
BEGIN
    SELECT 
        [id], [ten], [soluong], [madanhmuc], [thuonghieu],
        [xuatxu], [chatlieu], [kieudang], [mota], [anh], [trangthai]
    FROM Kinhmat
    WHERE [id] = @id
END
go


--nha cung cap


CREATE OR ALTER PROCEDURE sp_nhacungcap_create
    @tenncc NVARCHAR(50),
    @sdt NVARCHAR(15),
    @email NVARCHAR(50),
    @diachi NVARCHAR(100),
    @trangthai INT
AS
BEGIN
    INSERT INTO Nhacungcap (
        [tenncc], [sdt], [email], [diachi], [trangthai]
    )
    VALUES (
        @tenncc, @sdt, @email, @diachi, @trangthai
    )
END
go

CREATE OR ALTER PROCEDURE sp_nhacungcap_select_all
AS
BEGIN
    SELECT 
        [id], [tenncc], [sdt], [email], [diachi], [trangthai]
    FROM Nhacungcap
END
go



CREATE OR ALTER PROCEDURE sp_nhacungcap_select_by_id
    @id INT
AS
BEGIN
    SELECT 
        [id], [tenncc], [sdt], [email], [diachi], [trangthai]
    FROM Nhacungcap
    WHERE [id] = @id
END
go


CREATE OR ALTER PROCEDURE sp_nhacungcap_update
    @id INT,
    @tenncc NVARCHAR(50),
    @sdt NVARCHAR(15),
    @email NVARCHAR(50),
    @diachi NVARCHAR(100),
    @trangthai INT
AS
BEGIN
    UPDATE Nhacungcap
    SET 
        [tenncc] = @tenncc,
        [sdt] = @sdt,
        [email] = @email,
        [diachi] = @diachi,
        [trangthai] = @trangthai
    WHERE [id] = @id
END
go


CREATE OR ALTER PROCEDURE sp_nhacungcap_delete
    @id INT
AS
BEGIN
    DELETE FROM Nhacungcap
    WHERE [id] = @id
END
go

