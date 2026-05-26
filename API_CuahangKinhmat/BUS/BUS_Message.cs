using BUS.Interface;
using DAL.Interface;
using Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BUS
{
    public class BUS_Message : Ibus_Message
    {
        private readonly Idal_Message dal;
        private readonly IDAL_kinhmat _dalKinhmat;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;

        public BUS_Message(Idal_Message dal, IDAL_kinhmat dalKinhmat, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            this.dal = dal;
            this._dalKinhmat = dalKinhmat;
            this._httpClientFactory = httpClientFactory;
            this._apiKey = configuration["AppSettings:GeminiApiKey"] ?? "";
        }

        public bool AddMessage(Message model)
        {
            return dal.AddMessage(model);
        }

        public List<Message> GetHistory(int iduser)
        {
            return dal.GetHistory(iduser);
        }

        public bool ClearHistory(int iduser)
        {
            return dal.ClearHistory(iduser);
        }

        public async Task<string> GetChatbotResponse(int? iduser, string userMessage)
        {
            // 1. Lưu tin nhắn của User vào DB (nếu có iduser)
            if (iduser.HasValue && iduser.Value > 0)
            {
                dal.AddMessage(new Message
                {
                    iduser = iduser.Value,
                    role = "user",
                    content = userMessage,
                    thoigian = DateTime.Now
                });
            }

            // 2. Lấy danh sách sản phẩm thu nhỏ làm bối cảnh tĩnh từ Database
            string productsJson = "[]";
            try
            {
                var productsData = _dalKinhmat.Getall(1, 500);
                if (productsData?.data != null)
                {
                    var minifiedProducts = new List<object>();
                    foreach (var item in productsData.data)
                    {
                        minifiedProducts.Add(new
                        {
                            id = item.id,
                            ten = item.ten,
                            gia = item.giaban,
                            cl = item.chatlieu,
                            kd = item.kieudang,
                            xx = item.xuatxu,
                            tt = item.trangthai == 1 ? "Còn hàng" : "Hết hàng"
                        });
                    }
                    productsJson = JsonSerializer.Serialize(minifiedProducts);
                }
            }
            catch (Exception ex)
            {
                // Bỏ qua lỗi truy cập DB để tránh gián đoạn hội thoại
                productsJson = "[]";
            }

            // 3. Tạo danh sách các tin nhắn để gửi sang Gemini API (bao gồm cả Instruction của hệ thống và lịch sử trò chuyện)
            var conversationContents = new List<object>();

            // Cấu hình Instruction cho trợ lý với thông tin sản phẩm đầy đủ trong bối cảnh
            string systemInstruction = "Bạn là trợ lý ảo tư vấn kính mắt thông minh và nhiệt tình của 'Cửa hàng Kính Mắt'. " +
                                       "Hãy giao tiếp thân thiện, trả lời ngắn gọn và tập trung tư vấn các sản phẩm có thật trong kho dựa trên danh sách dữ liệu sản phẩm dưới dạng JSON sau: \n" +
                                       productsJson + "\n\n" +
                                       "Lưu ý quan trọng: \n" +
                                       "- Khi tư vấn, hãy ưu tiên giới thiệu các mẫu sản phẩm có tên, giá và thông số cụ thể khớp với nhu cầu của khách hàng từ danh sách trên.\n" +
                                       "- Không bịa đặt hoặc tự nghĩ ra các mẫu sản phẩm không có trong danh sách trên.\n" +
                                       "- Tư vấn nhiệt tình về chất liệu (kim loại, nhựa dẻo...), xu hướng, và kiểu dáng phù hợp với khuôn mặt khách hàng.";

            conversationContents.Add(new
            {
                role = "user",
                parts = new[] { new { text = systemInstruction } }
            });
            conversationContents.Add(new
            {
                role = "model",
                parts = new[] { new { text = "Xin chào! Tôi là trợ lý ảo của Cửa hàng Kính Mắt. Tôi có thông tin toàn bộ kho sản phẩm của cửa hàng. Tôi rất vui lòng được hỗ trợ bạn chọn được sản phẩm kính mắt thời trang và tối ưu nhất cho đôi mắt của bạn. Bạn muốn tôi tư vấn gọng kính, kính râm, hay đo tròng kính?" } }
            });

            // Nếu người dùng đã đăng nhập, lấy lịch sử trò chuyện để làm Context Memory
            if (iduser.HasValue && iduser.Value > 0)
            {
                var history = dal.GetHistory(iduser.Value);
                // Chỉ lấy 10 tin nhắn gần nhất để tránh dung lượng payload quá lớn
                var recentHistory = history.Count > 10 ? history.GetRange(history.Count - 10, 10) : history;
                
                foreach (var msg in recentHistory)
                {
                    string geminiRole = msg.role == "user" ? "user" : "model";
                    conversationContents.Add(new
                    {
                        role = geminiRole,
                        parts = new[] { new { text = msg.content } }
                    });
                }
            }
            else
            {
                // Đối với khách vãng lai, chỉ đưa tin nhắn hiện tại
                conversationContents.Add(new
                {
                    role = "user",
                    parts = new[] { new { text = userMessage } }
                });
            }

            // 4. Gửi HTTP POST request trực tiếp lên REST API của Gemini 3.5 Flash
            var client = _httpClientFactory.CreateClient();
            string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = conversationContents
            };

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            string requestJson = JsonSerializer.Serialize(requestBody, jsonOptions);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync(url, content);
                if (!response.IsSuccessStatusCode)
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    return $"[Lỗi API Gemini - Status Code: {response.StatusCode}]: Yêu cầu kiểm tra khóa API trong appsettings.json. Chi tiết lỗi: {errorContent}";
                }

                string responseJson = await response.Content.ReadAsStringAsync();
                
                // Parse kết quả trả về bằng System.Text.Json
                using (JsonDocument doc = JsonDocument.Parse(responseJson))
                {
                    var root = doc.RootElement;
                    if (root.TryGetProperty("candidates", out var candidates) && 
                        candidates.ValueKind == JsonValueKind.Array && 
                        candidates.GetArrayLength() > 0)
                    {
                        var firstCandidate = candidates[0];
                        if (firstCandidate.TryGetProperty("content", out var contentElement) &&
                            contentElement.TryGetProperty("parts", out var partsElement) &&
                            partsElement.ValueKind == JsonValueKind.Array &&
                            partsElement.GetArrayLength() > 0)
                        {
                            var firstPart = partsElement[0];
                            if (firstPart.TryGetProperty("text", out var textElement))
                            {
                                string reply = textElement.GetString();

                                // 5. Lưu phản hồi của AI vào DB (nếu có iduser)
                                if (iduser.HasValue && iduser.Value > 0)
                                {
                                    dal.AddMessage(new Message
                                    {
                                        iduser = iduser.Value,
                                        role = "model",
                                        content = reply,
                                        thoigian = DateTime.Now
                                    });
                                }

                                return reply;
                            }
                        }
                    }
                }

                return "Không nhận được phản hồi hợp lệ từ chatbot.";
            }
            catch (Exception ex)
            {
                return $"Lỗi kết nối máy chủ chatbot: {ex.Message}";
            }
        }
    }
}
