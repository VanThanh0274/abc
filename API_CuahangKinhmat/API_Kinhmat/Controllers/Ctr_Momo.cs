using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API_Kinhmat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ctr_Momo : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public Ctr_Momo(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("CreatePayment")]
        public async Task<IActionResult> CreatePayment([FromBody] MomoPaymentRequest request)
        {
            try
            {
                var partnerCode = _config["MoMo:PartnerCode"];
                var accessKey = _config["MoMo:AccessKey"];
                var secretKey = _config["MoMo:SecretKey"];
                var apiEndpoint = _config["MoMo:ApiEndpoint"];
                var returnUrl = _config["MoMo:ReturnUrl"];
                var notifyUrl = _config["MoMo:NotifyUrl"];
                var requestType = _config["MoMo:RequestType"];

                var orderId = request.OrderId ?? $"KM{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
                var requestId = Guid.NewGuid().ToString();
                var amount = request.Amount.ToString();
                var orderInfo = request.OrderInfo ?? "Thanh toan don hang Kinh Mat Luxury";
                var extraData = "";
                var lang = "vi";

                // Build raw signature string (HMAC-SHA256)
                var rawSignature = $"accessKey={accessKey}&amount={amount}&extraData={extraData}&ipnUrl={notifyUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={partnerCode}&redirectUrl={returnUrl}&requestId={requestId}&requestType={requestType}";

                var signature = ComputeHmacSha256(rawSignature, secretKey);

                var payload = new
                {
                    partnerCode,
                    accessKey,
                    requestId,
                    amount,
                    orderId,
                    orderInfo,
                    redirectUrl = returnUrl,
                    ipnUrl = notifyUrl,
                    extraData,
                    requestType,
                    signature,
                    lang
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(apiEndpoint, content);
                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return BadRequest(new { message = "Gọi MoMo API thất bại", detail = responseBody });
                }

                var momoResponse = JsonSerializer.Deserialize<MomoResponse>(responseBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (momoResponse?.ResultCode == 0)
                {
                    return Ok(new
                    {
                        payUrl = momoResponse.PayUrl,
                        orderId,
                        requestId
                    });
                }

                return BadRequest(new { message = momoResponse?.Message ?? "Tạo thanh toán thất bại", resultCode = momoResponse?.ResultCode });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpPost("IPN")]
        public IActionResult IPN([FromBody] MomoIpnRequest request)
        {
            try
            {
                var secretKey = _config["MoMo:SecretKey"];
                var accessKey = _config["MoMo:AccessKey"];

                // Verify signature
                var rawSignature = $"accessKey={accessKey}&amount={request.Amount}&extraData={request.ExtraData}&message={request.Message}&orderId={request.OrderId}&orderInfo={request.OrderInfo}&orderType={request.OrderType}&partnerCode={request.PartnerCode}&payType={request.PayType}&requestId={request.RequestId}&responseTime={request.ResponseTime}&resultCode={request.ResultCode}&transId={request.TransId}";

                var expectedSignature = ComputeHmacSha256(rawSignature, secretKey);

                if (request.Signature != expectedSignature)
                {
                    return BadRequest(new { message = "Chữ ký không hợp lệ" });
                }

                if (request.ResultCode == 0)
                {
                    // Payment successful - log or update order status
                    // In a production system, you'd update the order status in DB here
                    Console.WriteLine($"[MoMo IPN] Payment successful: OrderId={request.OrderId}, TransId={request.TransId}, Amount={request.Amount}");
                }

                return Ok(new { message = "IPN received" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("QueryStatus")]
        public async Task<IActionResult> QueryStatus(string orderId, string requestId)
        {
            try
            {
                var partnerCode = _config["MoMo:PartnerCode"];
                var accessKey = _config["MoMo:AccessKey"];
                var secretKey = _config["MoMo:SecretKey"];
                var queryEndpoint = "https://test-payment.momo.vn/v2/gateway/api/query";

                var rawSignature = $"accessKey={accessKey}&orderId={orderId}&partnerCode={partnerCode}&requestId={requestId}";
                var signature = ComputeHmacSha256(rawSignature, secretKey);

                var payload = new
                {
                    partnerCode,
                    requestId,
                    orderId,
                    signature,
                    lang = "vi"
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(queryEndpoint, content);
                var responseBody = await response.Content.ReadAsStringAsync();

                return Ok(JsonSerializer.Deserialize<object>(responseBody));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private static string ComputeHmacSha256(string message, string key)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var messageBytes = Encoding.UTF8.GetBytes(message);
            using var hmac = new HMACSHA256(keyBytes);
            var hashBytes = hmac.ComputeHash(messageBytes);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }

    public class MomoPaymentRequest
    {
        public long Amount { get; set; }
        public string? OrderId { get; set; }
        public string? OrderInfo { get; set; }
    }

    public class MomoResponse
    {
        public string? PartnerCode { get; set; }
        public string? RequestId { get; set; }
        public string? OrderId { get; set; }
        public long Amount { get; set; }
        public long ResponseTime { get; set; }
        public string? Message { get; set; }
        public int ResultCode { get; set; }
        public string? PayUrl { get; set; }
        public string? Deeplink { get; set; }
        public string? QrCodeUrl { get; set; }
    }

    public class MomoIpnRequest
    {
        public string? PartnerCode { get; set; }
        public string? OrderId { get; set; }
        public string? RequestId { get; set; }
        public long Amount { get; set; }
        public string? OrderInfo { get; set; }
        public string? OrderType { get; set; }
        public long TransId { get; set; }
        public int ResultCode { get; set; }
        public string? Message { get; set; }
        public string? PayType { get; set; }
        public long ResponseTime { get; set; }
        public string? ExtraData { get; set; }
        public string? Signature { get; set; }
    }
}
