using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Helper
{
    public class AppSettings
    {
        public static AppSettings ist = new AppSettings();
        public string Secret { get; set; }
    }
}
