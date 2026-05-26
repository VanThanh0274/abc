using DAL.Helper;
using DAL.Helper.Interface;
using DAL.Interface;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL
{
    public class DAL_Message : Idal_Message
    {
        private IDbSql db;
        public DAL_Message(IDbSql db)
        {
            this.db = db;
        }

        public bool AddMessage(Message model)
        {
            string msgError = "";
            try
            {
                var result = db.writeProcedure(out msgError, "sp_message_create",
                    "@iduser", model.iduser == null || model.iduser == 0 ? DBNull.Value : (object)model.iduser,
                    "@role", model.role,
                    "@content", model.content);

                if ((result != null && !string.IsNullOrEmpty(result.ToString())) || !string.IsNullOrEmpty(msgError))
                {
                    throw new Exception(Convert.ToString(result) + msgError);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<Message> GetHistory(int iduser)
        {
            string msg = "";
            var dt = db.Listobject(out msg, "sp_message_get_history", "@iduser", iduser);
            return dt.ConvertTo<Message>().ToList();
        }

        public bool ClearHistory(int iduser)
        {
            string msg = "";
            try
            {
                var obj = db.writeProcedure(out msg, "sp_message_clear_history", "@iduser", iduser);
                if ((obj != null && !string.IsNullOrEmpty(obj.ToString())) || !string.IsNullOrEmpty(msg))
                {
                    throw new Exception(Convert.ToString(obj) + msg);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
