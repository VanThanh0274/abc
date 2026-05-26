"use client";
import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { LuMessageSquare, LuSend, LuX, LuTrash2, LuBot } from 'react-icons/lu';
import { apiSendChatMessage, apiGetChatHistory, apiClearChatHistory } from '../../services/chatbot';
import { Getiduser } from '../../services/auth';
import { toast } from 'react-toastify';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [iduser, setIduser] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Default welcome message
  const defaultWelcome = {
    role: 'model',
    content: 'Xin chào! Tôi là trợ lý ảo của Cửa hàng Kính Mắt. Tôi có thể giúp gì cho bạn hôm nay? Tôi có thể tư vấn chọn gọng kính hợp mặt, kính râm thời trang, hoặc chọn tròng kính phù hợp nhé!',
    thoigian: new Date().toISOString()
  };

  // Get current user ID and load chat history on mount
  useEffect(() => {
    const userId = Getiduser();
    if (userId) {
      setIduser(userId);
      fetchHistory(userId);
    } else {
      setMessages([defaultWelcome]);
    }
  }, []);

  // Fetch chat history from DB
  const fetchHistory = async (userId) => {
    try {
      const history = await apiGetChatHistory(userId);
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        setMessages([defaultWelcome]);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử chat:", error);
      setMessages([defaultWelcome]);
    }
  };

  // Auto scroll to bottom when messages list updates or chat opens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Handle send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    setInputText('');

    // Append user message locally
    const newUserMessage = {
      role: 'user',
      content: userMsgText,
      thoigian: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Call backend api
      const payload = {
        iduser: iduser ? parseInt(iduser) : null,
        message: userMsgText
      };
      
      const response = await apiSendChatMessage(payload);
      
      // Append model response locally
      const botReply = {
        role: 'model',
        content: response.reply || 'Không nhận được phản hồi.',
        thoigian: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error("Lỗi khi chat:", error);
      
      const errorMsg = {
        role: 'model',
        content: 'Xin lỗi, hiện tại tôi đang gặp khó khăn trong việc kết nối hệ thống. Bạn vui lòng thử lại sau ít phút hoặc liên hệ trực tiếp số hotline nhé!',
        thoigian: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const handleClearHistory = async () => {
    if (!iduser) {
      // For guest, just reset local state
      setMessages([defaultWelcome]);
      toast.success("Đã làm mới cuộc hội thoại!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện với chatbot không?")) {
      try {
        await apiClearChatHistory(iduser);
        setMessages([defaultWelcome]);
        toast.success("Đã xóa sạch lịch sử trò chuyện!");
      } catch (error) {
        console.error("Lỗi khi xóa lịch sử chat:", error);
        toast.error("Không thể xóa lịch sử trò chuyện. Vui lòng thử lại!");
      }
    }
  };

  const formatTime = (timeStr) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="chatbot-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with AI Advisor"
      >
        <span className="chatbot-pulse"></span>
        {isOpen ? <LuX size={24} /> : <LuMessageSquare size={24} />}
      </button>

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="chatbot-modal">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-container">
                <LuBot size={20} color="white" />
                <span className="chatbot-status-dot"></span>
              </div>
              <div>
                <h3 className="chatbot-title">Kính Mắt AI</h3>
                <p className="chatbot-subtitle">Tư vấn kính mắt 24/7</p>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button 
                className="chatbot-header-btn"
                onClick={handleClearHistory}
                title="Xóa lịch sử chat"
              >
                <LuTrash2 size={16} />
              </button>
              <button 
                className="chatbot-header-btn"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
              >
                <LuX size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chatbot-messages-body">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chatbot-msg-wrapper ${msg.role === 'user' ? 'user' : 'model'}`}
              >
                <div className="chatbot-bubble">
                  {msg.content}
                  <div className="chatbot-time">{formatTime(msg.thoigian)}</div>
                </div>
              </div>
            ))}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="chatbot-msg-wrapper model">
                <div className="chatbot-bubble">
                  <div className="chatbot-typing">
                    <span className="chatbot-dot"></span>
                    <span className="chatbot-dot"></span>
                    <span className="chatbot-dot"></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form className="chatbot-input-footer" onSubmit={handleSend}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="chatbot-send-btn"
              disabled={isLoading || !inputText.trim()}
            >
              <LuSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
