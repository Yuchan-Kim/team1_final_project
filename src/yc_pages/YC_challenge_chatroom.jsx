    // src/components/YCChat.jsx

    import React, { useState } from 'react';
    import '../yc_assets/yc_css/yc_css_challenge_chatroom.css';
    import { FaTimes } from 'react-icons/fa'; // 닫기 아이콘

    const YCChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
        {/* Floating Chat Icon */}
        <div className="yc-floating-chat-icon" onClick={toggleChat} aria-label="채팅 열기">
            💬
        </div>

        {/* 채팅 모달 */}
        {isChatOpen && (
            <div className="yc-chat-modal-overlay" onClick={toggleChat}>
            <div className="yc-chat-modal" onClick={(e) => e.stopPropagation()}>
                <div className="yc-chat-modal-header">
                <h2>채팅</h2>
                <button className="yc-chat-modal-close-button" onClick={toggleChat} aria-label="채팅 닫기">
                    <FaTimes />
                </button>
                </div>
                <div className='yc-chat-box'>
                <div className='yc-user-msg-box'>
                    <div className='yc-user-msg'>웅앵</div>
                </div>
                <div className='yc-bot-msg-box'>
                    <div className='yc-bot-msg'>후앵</div>
                </div>
                </div>
                <form className="yc-chat-form">
                <input className="yc-chat-input" type="text" name="message" placeholder="메시지를 입력하세요" />
                <button className='yc-btn-send' type="submit">보내기</button>
                </form>
            </div>
            </div>
        )}
        </>
    );
    };

    export default YCChat;
