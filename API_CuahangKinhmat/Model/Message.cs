using System;

namespace Model
{
    public class Message
    {
        public int id { get; set; }
        public int? iduser { get; set; }
        public string role { get; set; }
        public string content { get; set; }
        public DateTime thoigian { get; set; }
    }

    public class ChatRequest
    {
        public int? iduser { get; set; }
        public string message { get; set; }
    }

    public class ChatResponse
    {
        public string reply { get; set; }
    }
}
