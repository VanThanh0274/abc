USE API_Kinhmat;
GO

-- Xóa dữ liệu cũ
DELETE FROM Blog;
GO
-- Reset Identity
DBCC CHECKIDENT ('Blog', RESEED, 0);
GO

-- Thêm 5 bài viết mới
INSERT INTO Blog (tieude, noidung, tomtat, anh, madanhmuc, tacgia, luotxem, trangthai, ngaytao, ngaycapnhat)
VALUES
(N'Bí quyết chọn gọng kính phù hợp với từng khuôn mặt', 
N'<p>Mỗi khuôn mặt đều mang một nét đẹp riêng, và việc chọn đúng gọng kính sẽ giúp tôn lên những đường nét ấy. Dưới đây là những nguyên tắc cơ bản:</p><ul><li><b>Khuôn mặt tròn:</b> Hãy chọn gọng kính hình chữ nhật hoặc vuông để tạo góc cạnh, giúp khuôn mặt trông thon gọn hơn. Tránh các gọng kính quá tròn.</li><li><b>Khuôn mặt vuông:</b> Trái ngược với mặt tròn, bạn nên chọn gọng kính tròn hoặc oval để làm mềm mại các đường nét góc cạnh của khuôn mặt.</li><li><b>Khuôn mặt trái xoan:</b> Chúc mừng bạn! Khuôn mặt này hầu như phù hợp với mọi kiểu dáng gọng kính. Hãy thoải mái thử nghiệm các phong cách từ cổ điển đến phá cách.</li><li><b>Khuôn mặt trái tim:</b> Gọng kính aviator (phi công) hoặc gọng không viền sẽ cân đối phần trán rộng và cằm hẹp của bạn.</li></ul><p>Đừng quên đến Cửa hàng Kính Mắt của chúng tôi để được tư vấn trực tiếp và thử hàng trăm mẫu kính mới nhất nhé!</p>', 
N'Hướng dẫn chi tiết cách chọn gọng kính hoàn hảo cho khuôn mặt tròn, vuông, trái xoan và trái tim để tôn vinh vẻ đẹp của bạn.', 
'/images/blog/blog0.png', NULL, N'Admin', 350, 1, GETDATE(), GETDATE()),

(N'Tròng kính chống ánh sáng xanh: Có thực sự cần thiết?', 
N'<p>Trong thời đại số, chúng ta dành phần lớn thời gian làm việc và giải trí trước màn hình máy tính, điện thoại. Điều này dẫn đến sự tiếp xúc liên tục với ánh sáng xanh - thủ phạm gây mỏi mắt, khô mắt và rối loạn giấc ngủ.</p><p><b>Tròng kính chống ánh sáng xanh hoạt động như thế nào?</b></p><p>Chúng được phủ một lớp bảo vệ đặc biệt giúp lọc hoặc phản chiếu các tia ánh sáng xanh có hại từ màn hình kỹ thuật số, ngăn chúng đi vào mắt. Điều này giúp giảm căng thẳng thị giác, bảo vệ võng mạc và mang lại giấc ngủ ngon hơn vào ban đêm.</p><p><b>Ai nên sử dụng?</b></p><p>Bất kỳ ai sử dụng thiết bị điện tử hơn 3 giờ mỗi ngày đều nên trang bị. Đặc biệt là dân văn phòng, học sinh, sinh viên và game thủ. Đầu tư vào một cặp tròng kính chống ánh sáng xanh là đầu tư cho sức khỏe lâu dài của đôi mắt bạn.</p>', 
N'Tìm hiểu tác hại của ánh sáng xanh từ màn hình điện tử và lý do tại sao tròng kính chống ánh sáng xanh là vật bất ly thân của dân văn phòng.', 
'/images/blog/blog2.jpg', NULL, N'Chuyên gia Khúc xạ', 520, 1, GETDATE(), GETDATE()),

(N'Cách vệ sinh và bảo quản kính mắt để luôn sáng bóng như mới', 
N'<p>Một cặp kính sạch không chỉ mang lại tầm nhìn rõ nét mà còn tăng tính thẩm mỹ. Tuy nhiên, nhiều người vẫn đang vệ sinh kính sai cách, dẫn đến trầy xước tròng kính.</p><p><b>Các bước vệ sinh chuẩn chuyên gia:</b></p><ol><li>Rửa sạch tay trước khi chạm vào kính để tránh truyền dầu mỡ lên tròng.</li><li>Xả kính dưới vòi nước ấm nhẹ để trôi đi bụi bẩn (không dùng nước nóng vì có thể làm hỏng lớp phủ bảo vệ).</li><li>Sử dụng một giọt dung dịch vệ sinh kính chuyên dụng hoặc nước rửa chén loại nhẹ. Thoa đều lên hai mặt tròng kính và gọng kính.</li><li>Rửa sạch lại với nước và vẩy nhẹ để nước trôi đi.</li><li>Lau khô nhẹ nhàng bằng khăn microfiber chuyên dụng (không dùng áo, giấy vệ sinh hay khăn tắm vì chúng chứa các sợi thô ráp gây xước).</li></ol><p><b>Bảo quản:</b> Luôn cất kính vào hộp cứng khi không sử dụng. Đừng bao giờ đặt úp mặt kính xuống bàn!</p>', 
N'Bỏ túi những mẹo vệ sinh kính mắt chuẩn chuyên gia giúp tròng kính không bị xước và gọng kính luôn bền đẹp theo thời gian.', 
'/images/blog/blog3.png', NULL, N'Admin', 210, 1, GETDATE(), GETDATE()),

(N'Kính râm phân cực (Polarized) là gì và vì sao bạn nên sở hữu?', 
N'<p>Bạn đã bao giờ bị chói mắt bởi ánh nắng phản chiếu từ mặt hồ nước, mặt đường nhựa hoặc kính ô tô chưa? Đó là lúc bạn cần đến kính râm phân cực (Polarized).</p><p><b>Kính Polarized khác kính râm thường ở điểm nào?</b></p><p>Kính râm thông thường chỉ làm giảm cường độ ánh sáng chiếu vào mắt. Trong khi đó, kính Polarized được tích hợp một lớp màng lọc đặc biệt giúp chặn đứng các tia sáng ngang phản chiếu (tia lóa). Kết quả là bạn không chỉ bớt chói mà còn nhìn thấy hình ảnh rõ nét, màu sắc chân thực và độ tương phản cao hơn.</p><p><b>Lợi ích vượt trội:</b></p><ul><li>Bảo vệ mắt hoàn hảo khi lái xe, giảm nguy cơ tai nạn do lóa mắt.</li><li>Rất lý tưởng cho các hoạt động ngoài trời như câu cá, chơi golf, đi biển.</li><li>Giảm mỏi mắt tuyệt đối khi hoạt động dưới trời nắng gắt.</li></ul><p>Hãy đến thử trực tiếp các mẫu kính Polarized tại cửa hàng để cảm nhận sự khác biệt ngay hôm nay!</p>', 
N'Khám phá sự khác biệt của kính râm phân cực so với kính thường và những lợi ích tuyệt vời khi lái xe hay tham gia các hoạt động ngoài trời.', 
'/images/blog/blog4.png', NULL, N'Admin', 480, 1, GETDATE(), GETDATE()),

(N'5 dấu hiệu cảnh báo bạn cần phải đi đo mắt và thay kính mới ngay', 
N'<p>Mắt kính không phải là vật dụng có thể dùng cả đời mà không cần thay thế. Độ cận/viễn của bạn có thể thay đổi, và tròng kính cũng bị lão hóa theo thời gian. Nếu bạn gặp 1 trong 5 dấu hiệu sau, đã đến lúc đi đo lại mắt:</p><ol><li><b>Thường xuyên nheo mắt:</b> Đây là phản xạ tự nhiên khi mắt cố gắng điều tiết để nhìn rõ hơn. Nếu nheo mắt trở thành thói quen, độ kính hiện tại đã không còn phù hợp.</li><li><b>Nhức đầu và mỏi mắt:</b> Kính sai độ hoặc tròng kính bị xước nhiều buộc cơ mắt phải làm việc quá sức, gây ra những cơn đau đầu khó chịu.</li><li><b>Nhìn mờ hoặc thấy hiện tượng bóng đôi:</b> Rõ ràng là đôi kính không còn hoàn thành tốt nhiệm vụ của nó.</li><li><b>Kính trượt xuống mũi liên tục:</b> Gọng kính đã bị lỏng lẻo, cong vênh sau thời gian dài sử dụng, không còn giữ được tâm điểm quang học chuẩn xác trên mắt.</li><li><b>Tròng kính bị trầy xước nặng hoặc ngả vàng:</b> Lớp phủ bảo vệ đã bong tróc, làm giảm tầm nhìn và không còn khả năng bảo vệ mắt khỏi tia UV hay ánh sáng xanh.</li></ol><p>Đừng chần chừ, hãy đặt lịch hẹn đo mắt miễn phí tại cửa hàng của chúng tôi ngay hôm nay!</p>', 
N'Nếu bạn thường xuyên nheo mắt, nhức đầu hay kính lỏng lẻo, đó là lúc bạn cần cập nhật lại số đo thị lực và sắm một chiếc kính mới.', 
'/images/blog/blog5.jpg', NULL, N'Bác sĩ Nhãn khoa', 650, 1, GETDATE(), GETDATE());
GO
