"use client";
import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { MessageSquare, Send, X, Trash2, Bot } from 'lucide-react';
import { apiSendChatMessage, apiGetChatHistory, apiClearChatHistory } from '../../services/chatbot';
import { Getiduser } from '../../services/auth';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [iduser, setIduser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Default welcome message
  const defaultWelcome = {
    role: 'model',
    content: 'Xin chào! Tôi là trợ lý ảo của Cửa hàng Kính Mắt Luxury. Tôi có thể giúp gì cho bạn hôm nay? Tôi có thể tư vấn chọn gọng kính hợp mặt, kính râm thời trang, hoặc chọn tròng kính phù hợp nhé!',
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

  // Hàm tiền xử lý trích xuất sản phẩm JSON từ phản hồi bằng RegExp
  const parseMessage = (msg) => {
    if (msg.role !== 'model') {
      return { text: msg.content, products: [] };
    }

    const regex = /\[RECOMMENDATIONS\]([\s\S]*?)\[\/RECOMMENDATIONS\]/;
    const match = msg.content.match(regex);

    if (match) {
      const jsonStr = match[1].trim();
      let products = [];
      try {
        products = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Lỗi khi phân tích JSON sản phẩm gợi ý:", e);
      }
      
      const cleanText = msg.content.replace(regex, '').trim();
      return { text: cleanText, products };
    }

    return { text: msg.content, products: [] };
  };

  const handleProductClick = (prodId) => {
    setIsOpen(false); // Đóng cửa sổ chat khi chuyển trang
    router.push(`/products?id=${prodId}`);
  };

  return (
    <>
      {/* Floating Action Button with framer-motion */}
      <motion.button 
        className="chatbot-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with AI Advisor"
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="chatbot-pulse"></span>
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center"
          >
            {isOpen ? <X className="text-2xl" /> : <MessageSquare className="text-2xl" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Floating Chat Window Modal with framer-motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-modal shadow-2xl border border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0, scale: 0.85, y: 60, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 60 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar-container">
                  <Bot className="text-white text-lg" />
                  <span className="chatbot-status-dot"></span>
                </div>
                <div>
                  <h3 className="chatbot-title font-heading">Kính Mắt AI</h3>
                  <p className="chatbot-subtitle">Tư vấn cao cấp 24/7</p>
                </div>
              </div>

              <div className="chatbot-header-actions">
                <button 
                  className="chatbot-header-btn"
                  onClick={handleClearHistory}
                  title="Xóa lịch sử chat"
                >
                  <Trash2 className="text-base" />
                </button>
                <button 
                  className="chatbot-header-btn"
                  onClick={() => setIsOpen(false)}
                  title="Thu nhỏ"
                >
                  <X className="text-lg" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="chatbot-messages-body">
              {messages.map((msg, index) => {
                const parsed = parseMessage(msg);
                const isUser = msg.role === 'user';
                return (
                  <motion.div 
                    key={index} 
                    className={`chatbot-msg-wrapper ${isUser ? 'user' : 'model'}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="chatbot-bubble">
                      {!isUser ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-100 font-sans">
                          <ReactMarkdown>{parsed.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="font-sans font-medium text-white break-words">
                          {parsed.text}
                        </div>
                      )}

                      {/* Card sản phẩm gợi ý dạng Grid sang trọng */}
                      {parsed.products && parsed.products.length > 0 && (
                        <motion.div 
                          className="chatbot-prod-recommendations"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15, duration: 0.2 }}
                        >
                          <p className="chatbot-prod-rec-title font-heading">Gợi ý dành cho bạn</p>
                          <div className="chatbot-prod-list space-y-2 mt-1">
                            {parsed.products.map((prod, pIdx) => (
                              <motion.div 
                                key={prod.id} 
                                className="chatbot-prod-card"
                                onClick={() => handleProductClick(prod.id)}
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + pIdx * 0.05 }}
                              >
                                <img 
                                  src={`http://localhost:5273/images/product/${prod.anh || 'default.jpg'}`} 
                                  alt={prod.ten} 
                                  className="chatbot-prod-img rounded-lg shadow-sm"
                                />
                                <div className="chatbot-prod-details">
                                  <span className="chatbot-prod-name font-sans">{prod.ten}</span>
                                  <span className="chatbot-prod-price font-heading">{(prod.gia || 0).toLocaleString('vi-VN')} đ</span>
                                  <span className="chatbot-prod-btn font-sans">Xem chi tiết</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <div className="chatbot-time">{formatTime(msg.thoigian)}</div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading typing indicator */}
              {isLoading && (
                <motion.div 
                  className="chatbot-msg-wrapper model"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="chatbot-bubble py-3 px-4">
                    <div className="chatbot-typing">
                      <span className="chatbot-dot"></span>
                      <span className="chatbot-dot"></span>
                      <span className="chatbot-dot"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form className="chatbot-input-footer" onSubmit={handleSend}>
              <input
                type="text"
                className="chatbot-input font-sans text-sm focus:ring-1 focus:ring-brand-gold"
                placeholder="Hỏi về gọng kính, kiểu mặt, giá..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              />
              <motion.button 
                type="submit" 
                className="chatbot-send-btn shadow-md"
                disabled={isLoading || !inputText.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="text-sm" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
