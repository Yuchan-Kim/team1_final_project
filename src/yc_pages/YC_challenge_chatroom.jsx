import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";

import '../yc_assets/yc_css/yc_css_challenge_chatroom.css';

import { FaTimes } from 'react-icons/fa'; // 닫기 아이콘

const ChatRoom = ({ roomNum }) => { // props를 디스트럭처링하여 roomNum 받기
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userNum, setUserNum] = useState(null); // userNum 상태 추가
  const chatBoxRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // 현재 사용자의 userNum을 가져옵니다.
    const fetchUserNum = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/chat/info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.result === 'success') {
          setUserNum(response.data.apiData);
        } else {
          alert('유저 정보를 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('서버와의 통신에 실패했습니다.');
      }
    };

    fetchUserNum();
  }, [token]);

  useEffect(() => {
    if (roomNum && userNum !== null) {
      getAllMessages();
    }
  }, [roomNum, userNum]); // roomNum이나 userNum이 변경될 때마다 메시지 가져오기

  // 전체 채팅 메시지 가져오기
  const getAllMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/chat/${roomNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.result === 'success') { 
        setMessages(response.data.apiData.map(msg => ({
          sender: msg.chatter === userNum ? 'user' : 'other', // chatter와 userNum 비교
          text: msg.chatContent,
          chatTime: new Date(msg.chatTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userName: msg.chatter === userNum ? '나' : msg.userName // 메시지 발신자 이름 설정
        })));
      } else {
        alert("채팅 메시지를 불러오는 데 문제가 있습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버와의 통신에 실패했습니다.");
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessage = { 
      roomNum, 
      chatContent: input
      // chatter는 백엔드에서 설정
    };

    try {
      // 메시지를 백엔드로 전송
      const response = await axios.post(`http://localhost:9000/api/chat/`, newMessage, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.result === 'success') {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages([...messages, { sender: 'user', text: input, chatTime: timeNow, userName: '나' }]);
        setInput('');
      } else {
        alert("메시지 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버와의 통신에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // 메시지가 업데이트될 때마다 스크롤 이동

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
                  <span>{msg.userName}: </span>
                  <span>{msg.text}</span>
                  <div className="yc-chat-time">{msg.chatTime}</div>
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

export default ChatRoom;
