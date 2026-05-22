using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Helper.Interface
{
    
    public interface IDbSql
    {
        public SqlDataReader demo(string query);
        bool insertupdate(string query);
        DataTable ListObj(string query);
        public DataTable Listobject(out string msgError, string sprocedureName, params object[] paramObjects);
        public object writeProcedure(out string msgError, string sprocedureName, params object[] paramObjects);
        string ExecuteSPScalar(string spname, out string msgError, params object[] parameters);
        public string reader(string query, int year);
        string GetString(string query);
    }
}
