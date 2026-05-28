import api from '../utils/request';

export const apiSendChatMessage = async (data) => {
  const res = await api.post('/Ctr_Chatbot/chat', data);
  return res.data;
};

export const apiGetChatHistory = async (iduser) => {
  const res = await api.get(`/Ctr_Chatbot/history?iduser=${iduser}`);
  return res.data;
};

export const apiClearChatHistory = async (iduser) => {
  const res = await api.delete(`/Ctr_Chatbot/clear?iduser=${iduser}`);
  return res.data;
};
