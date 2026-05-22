using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using DAL.Helper.Interface;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Collections;

namespace DAL.SQL
{
    public class DbSql: IDbSql
    {
        private string str;

        public DbSql(IConfiguration configuration)
        {
            str = configuration["ConnectionStrings:DefaultConnection"];
        }

        public bool insertupdate(string query)
        {
            using (SqlConnection conn = new SqlConnection(str))
            {
                
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.ExecuteNonQuery();
                return true;
            }
        }
        public SqlDataReader demo(string query)
        {
            var conn = new SqlConnection(str);
            conn.Open();
            var cmd = new SqlCommand(query, conn);
            return cmd.ExecuteReader(CommandBehavior.CloseConnection);
        }
        public string GetString(string query)
        {
            using (SqlConnection conn = new SqlConnection(str))
            {

                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                string a = cmd.ExecuteScalar().ToString();
                return a;
            }
        }


        public string reader(string query,int year)
        {
            using (var connection = new SqlConnection(str))
            {
                connection.Open();
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Year", year);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var json0 = JsonSerializer.Deserialize<object>(reader[0].ToString());//giải mã json loại bỏ dấu " \ "
                            var json1 = JsonSerializer.Deserialize<object>(reader[1].ToString());
                            var json2 = reader[2].ToString();
                            var json3 = reader[3].ToString();

                            // Tạo một object để ghép hai phần dữ liệu
                            var combinedJson = new
                            {
                                bddoanhthu = json0,
                                bdloinhuan = json1,
                                a=json2,
                                b=json3
                            };

                            // Chuyển object thành chuỗi JSON
                            return JsonSerializer.Serialize(combinedJson);
                        }
                    }
                }
            }
            return string.Empty;
        }
        public DataTable ListObj(string query)
        {
            using (SqlConnection conn = new SqlConnection(str))
            {

                conn.Open();
                using(SqlDataAdapter adp = new SqlDataAdapter(query, conn))
                {
                    DataTable dt = new DataTable();
                    adp.Fill(dt);
                    dt.Dispose();
                    return dt;
                    
                }
                
                
            }
        }

        public object writeProcedure(out string msgError, string sprocedureName, params object[] paramObjects)
        {
            msgError = "";
            object result = null;
            using (SqlConnection connection = new SqlConnection(str))
            {
                connection.Open();
                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    try
                    {
                        SqlCommand cmd = connection.CreateCommand();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = sprocedureName;
                        cmd.Transaction = transaction;
                        cmd.Connection = connection;

                        int parameterInput = (paramObjects.Length) / 2;
                        int j = 0;
                        for (int i = 0; i < parameterInput; i++)
                        {
                            string paramName = Convert.ToString(paramObjects[j++]);
                            object value = paramObjects[j++];
                            if (paramName.ToLower().Contains("json"))
                            {
                                cmd.Parameters.Add(new SqlParameter()
                                {
                                    ParameterName = paramName,
                                    Value = value ?? DBNull.Value,
                                    SqlDbType = SqlDbType.NVarChar
                                });
                            }
                            else
                            {
                                cmd.Parameters.Add(new SqlParameter(paramName, value ?? DBNull.Value));
                            }
                        }

                        result = cmd.ExecuteScalar();
                        cmd.Dispose();
                        transaction.Commit();
                    }
                    catch (Exception exception)
                    {

                        result = null;
                        msgError = exception.ToString();
                        try
                        {
                            transaction.Rollback();
                        }
                        catch (Exception ex) { }
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
            }
            return result;
        }
        public DataTable Listobject(out string msgError, string sprocedureName, params object[] paramObjects)
        {
            DataTable tb = new DataTable();
            SqlConnection connection;
            try
            {
                SqlCommand cmd = new SqlCommand { CommandType = CommandType.StoredProcedure, CommandText = sprocedureName };
                connection = new SqlConnection(str);
                cmd.Connection = connection;

                int parameterInput = (paramObjects.Length) / 2;

                int j = 0;
                for (int i = 0; i < parameterInput; i++)
                {
                    string paramName = Convert.ToString(paramObjects[j++]).Trim();
                    object value = paramObjects[j++];
                    if (paramName.ToLower().Contains("json"))
                    {
                        cmd.Parameters.Add(new SqlParameter()
                        {
                            ParameterName = paramName,
                            Value = value ?? DBNull.Value,
                            SqlDbType = SqlDbType.NVarChar
                        });
                    }
                    else
                    {
                        cmd.Parameters.Add(new SqlParameter(paramName, value ?? DBNull.Value));
                    }
                }

                SqlDataAdapter ad = new SqlDataAdapter(cmd);
                ad.Fill(tb);
                cmd.Dispose();
                ad.Dispose();
                connection.Dispose();
                msgError = "";
            }
            catch (Exception exception)
            {
                tb = null;
                msgError = exception.ToString();
            }
            return tb;
        }

        public string ExecuteSPScalar(string spName, out string msgError, params object[] parameters)
        {
            msgError = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(str))
                {
                    conn.Open();
                    using (var sqlCommand = new SqlCommand(spName, conn))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        for (int i = 0; i < parameters.Length; i += 2)
                        {
                            sqlCommand.Parameters.AddWithValue(parameters[i].ToString(), parameters[i + 1]);
                        }

                        var result = sqlCommand.ExecuteScalar();
                        return result?.ToString();
                    }
                }
                
            }
            catch (Exception e)
            {
                msgError = e.Message;
                return null;
            }
            //finally
            //{
            //    //CloseConnection();
            //}
        }
    }
}
