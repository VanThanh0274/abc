using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class ResponseData<T>
    {
        
        public int page_number { get; set; }
        public int page_size { get; set; }
        public double total { get; set; }
        public T data { get; set; }
        public ResponseData(int page_number, int page_size, double total, T data)
        {
            this.page_number = page_number;
            this.page_size = page_size;
            this.total = total;
            this.data = data;
        }
    }
}
