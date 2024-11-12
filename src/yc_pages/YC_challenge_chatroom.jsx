// src/components/YCChat.jsx

import React, { useState, useRef, useEffect } from 'react';
import '../yc_assets/yc_css/yc_css_challenge_chatroom.css';

import { FaTimes } from 'react-icons/fa'; // 닫기 아이콘

const YCChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: '메시지를 받았습니다!' }]);
    }, 1000);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Chat Icon */}
      <div 
        className="yc-floating-chat-icon" 
        onClick={toggleChat} 
        aria-label="채팅 열기"
        role="button" 
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter') toggleChat();
        }}
      >
        💬
      </div>

      {/* 채팅 모달 */}
      {isChatOpen && (
        <div className="yc-chat-modal">
          <div className="yc-chat-modal-header">
            <h2>채팅</h2>
            <button className="yc-chat-modal-close-button" onClick={toggleChat} aria-label="채팅 닫기">
              <FaTimes />
            </button>
          </div>
          <div className='yc-chat-box' ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={msg.sender === 'user' ? 'yc-user-msg-box' : 'yc-bot-msg-box'}
              >
                <div className={msg.sender === 'user' ? 'yc-user-msg' : 'yc-bot-msg'}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form className="yc-chat-form" onSubmit={handleSendMessage}>
            <input 
              className="yc-chat-input" 
              type="text" 
              name="message" 
              placeholder="메시지를 입력하세요" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className='yc-btn-send' type="submit">보내기</button>
          </form>
        </div>
      )}
    </>
  );
};

export default YCChat;
