// ChallengePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Challengemain.css';

import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";

const ChallengePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const missions = [
    { title: "그룹 미션 1", status: "제출", description: "인증방법 설명", isGroup: true },
    { title: "그룹 미션 2", status: "제출", description: "인증방법 설명", isGroup: true },
    { title: "스트레칭 하기", status: "제출", description: "인증방법 설명", isGroup: false },
    { title: "500미터 걷기", status: "제출", description: "인증방법 설명", isGroup: false },
    { title: "물 마시기", status: "제출", description: "인증방법 설명", isGroup: false },
    { title: "눈 마사지", status: "제출", description: "인증방법 설명", isGroup: false },
    { title: "눈 마시기", status: "제출", description: "인증방법 설명", isGroup: false }
  ];

  // 그룹 미션 먼저 정렬
  const sortedMissions = missions.sort((a, b) => b.isGroup - a.isGroup);

  return (
    <div className="jm-container">
      {/* Sidebar */}
      <aside className='jm-sidenav'>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className='jm-main-content'>
        {/* Header */}
        <header className='jm-header'>
          <Header />
        </header>

        {/* Main Top Section */}
        <section className='jm-main-top'>
          {/* Room Information */}
          <div className="jm-room-info">
            <div className="jm-room-card">
              <h3>방 소개</h3>
              <p>
                반갑습니다. 매일 500m 걷기 챌린지방 입니다.<br />
                꾸준한 걷는 습관을 만들고 싶은 분들을 모집 중입니다.<br />
                우리 모두 건강한 루틴을 만들었으면 좋겠습니다!
              </p>
            </div>
            <div className="jm-room-card">
              <h3>공지 사항</h3>
              <p>공지 내용을 여기에 입력합니다.</p>
            </div>
            
          </div>

          {/* User Community */}
          <div className="jm-community">
            <h2 className='jm-community-title'>커뮤니티</h2>
            <div className='jm-chat-section'>
              <div className='jm-chat-box'>
                <div className='jm-user-msg-box'>
                  <div className='jm-user-msg'>웅앵</div>
                </div>
                <div className='jm-bot-msg-box'>
                  <div className='jm-bot-msg'>후앵</div>
                </div>
              </div>
              <form className="jm-chat-form">
                <input className="jm-chat-input" type="text" name="message" placeholder="메시지를 입력하세요" />
                <button className='jm-btn-send' type="submit">보내기</button>
              </form>
            </div>
          </div>

          {/* Participant List */}
          <div className="jm-participant-info">
            <h3>유저 목록</h3>
            <table className="jm-participant-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>상태</th>
                  <th>포인트</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                <tr className='jm-user-list'>
                  <td>황유찬</td>
                  <td className="jm-status-online">online</td>
                  <td>600</td>
                  <td><button className="jm-report-button">신고</button></td>
                </tr>
                <tr className='jm-user-list'>
                  <td>김민수</td>
                  <td className="jm-status-offline">offline</td>
                  <td>450</td>
                  <td><button className="jm-report-button">신고</button></td>
                </tr>
                <tr className='jm-user-list'>
                  <td>이서연</td>
                  <td className="jm-status-online">online</td>
                  <td>750</td>
                  <td><button className="jm-report-button">신고</button></td>
                </tr>
                {/* 추가 유저 리스트 */}
              </tbody>
            </table>
          </div>
        </section>

        {/* Main Bottom Section */}
        <section className='jm-main-bottom'>
          {/* Mission Summary */}
          <div className='jm-mission-summary'>
            {sortedMissions.map((mission, index) => (
              <div className='jm-mission-item' key={index}>
                <img src="https://via.placeholder.com/50" alt={`${mission.title} 이미지`} className="jm-mission-image" />
                <div className="jm-mission-content">
                  <h4>{mission.title}</h4>
                  <p>{mission.description}</p>
                </div>
                <button className="jm-submit-button">제출하기</button>
              </div>
            ))}
          </div>

          {/* Mission Slider */}
          <div className="jm-mission-slider">
            <div className="jm-mission-slider-track">
              {sortedMissions.map((mission, index) => (
                <Link to="/mission" key={index} className="jm-mission-slide">
                  <h3>{mission.title}</h3>
                  <img src="https://via.placeholder.com/211x239" alt={`${mission.title} 이미지`} />
                  <p>{mission.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal 창 */}
      {isModalOpen && (
        <div className="jm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="jm-modal" onClick={(e) => e.stopPropagation()}>
            <h2>유의 사항</h2>
            <p>여기에 유의 사항 내용을 입력하세요.</p>
            <button className="jm-modal-close" onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengePage;
