using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DAL_Danhmuc:Idal_Danhmuc
    {
        private IDbSql sql;
        
        public DAL_Danhmuc(IDbSql sql)
        {
            this.sql = sql;
        }

        public List<Danhmuc> Getall()
        {
            List<Danhmuc> list = new List<Danhmuc>();
            var dt = sql.ListObj("exec sp_danhmuc_select_all");
            foreach (DataRow d in dt.Rows)
            {
                list.Add(new Danhmuc(
                   int.Parse(d[0].ToString()),
                   d[1].ToString(),
                   d[2].ToString()
                 ));
            }
            return list;
            

        }
        public List<Danhmuc> Search(string danhmuc)
        {
            List<Danhmuc> list = new List<Danhmuc>();
            var dt = sql.ListObj($"exec sp_danhmuc_search '{danhmuc}'");
            foreach (DataRow d in dt.Rows)
            {
                list.Add(new Danhmuc(
                   int.Parse(d[0].ToString()),
                   d[1].ToString(),
                   d[2].ToString()
                 ));
            }
            return list;


        }
        public bool Add(Danhmuc dm)
        {
            string query = $"exec sp_danhmuc_create N'{dm.Tendanhmuc}', N'{dm.Mota}'";
            return sql.insertupdate(query);

        }
        public bool Delete(string id)
        {
            string query = $"exec  sp_danhmuc_delete {id}";
            return sql.insertupdate(query);

        }
        public bool Update(Danhmuc dm)
        {
            string query = $"exec sp_danhmuc_update {dm.Ma},N'{dm.Tendanhmuc}',N'{dm.Mota}' ";
            return sql.insertupdate(query);
        }
        public Danhmuc GetDanhmucbyID(int id)
        {
            string query = $"exec sp_danhmuc_select_by_id {id}";

            // Thực thi câu truy vấn và lấy kết quả
            DataTable result = sql.ListObj(query);

            // Nếu không tìm thấy dữ liệu, trả về null
            if (result.Rows.Count == 0)
            {
                return null;
            }

            // Chuyển đổi dữ liệu từ DataRow sang đối tượng Nhacungcap
            DataRow row = result.Rows[0];
            Danhmuc danhmuc = new Danhmuc(
                Convert.ToInt32(row["id"].ToString()),
                row["danhmuc"].ToString(),
                row["mota"].ToString()
                );
            

            return danhmuc;
        }

        public Total_danhmuc Gettotaldanhmuc(string danhmuc)
        {
            string msg = "";
            var dt = sql.Listobject(out msg, "sp_u_total_product_category", "@danhmuc", danhmuc);

            return dt.ConvertTo<Total_danhmuc>().FirstOrDefault();

        }
    }
}
