USE API_Kinhmat;
GO

CREATE OR ALTER PROCEDURE sp_u_nguoidung_by_email
    @email nvarchar(100)
AS
BEGIN
    SELECT * FROM Nguoidung WHERE email = @email;
END
GO
