-- 1. Tạo bảng Message để lưu trữ lịch sử tin nhắn
IF OBJECT_ID('dbo.Message', 'U') IS NOT NULL
    DROP TABLE dbo.Message;
GO

CREATE TABLE [dbo].[Message](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [iduser] [int] NULL,
    [role] [varchar](50) NOT NULL, -- 'user' hoặc 'model'
    [content] [nvarchar](max) NOT NULL,
    [thoigian] [datetime] NULL DEFAULT (getdate()),
 CONSTRAINT [PK_Message] PRIMARY KEY CLUSTERED 
(
    [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- Tạo khóa ngoại liên kết tới bảng Nguoidung
ALTER TABLE [dbo].[Message]  WITH CHECK ADD  CONSTRAINT [FK_Message_Nguoidung] FOREIGN KEY([iduser])
REFERENCES [dbo].[Nguoidung] ([id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[Message] CHECK CONSTRAINT [FK_Message_Nguoidung]
GO


-- 2. Stored Procedure thêm tin nhắn mới
CREATE OR ALTER PROC sp_db_message_create
(
    @iduser INT = NULL,
    @role VARCHAR(50),
    @content NVARCHAR(MAX)
)
AS
BEGIN
    INSERT INTO [Message] (iduser, [role], content, thoigian)
    VALUES (@iduser, @role, @content, GETDATE())
END
GO


-- 3. Stored Procedure lấy lịch sử hội thoại của người dùng
CREATE OR ALTER PROC sp_db_message_get_history
(
    @iduser INT
)
AS
BEGIN
    SELECT id, iduser, [role], content, thoigian
    FROM [Message]
    WHERE iduser = @iduser
    ORDER BY thoigian ASC
END
GO


-- 4. Stored Procedure xóa lịch sử hội thoại
CREATE OR ALTER PROC sp_db_message_clear_history
(
    @iduser INT
)
AS
BEGIN
    DELETE FROM [Message]
    WHERE iduser = @iduser
END
GO
