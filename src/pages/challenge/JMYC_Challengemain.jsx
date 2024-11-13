// ChallengePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../css/JMYC_Challengemain.css';
import '../css/Jm-Point-info.css';

import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";
import Footert from "../include/JM-Footer.jsx";
import TopHeader from "../include/DH_Header.jsx";
import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const ChallengePage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  // 개별 미션 리스트
  const missions = [
    { title: "최종 미션", status: "제출", description: "그룹 인증방법 설명", image: "https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" },
    { title: "스트레칭 하기", status: "제출", description: "인증방법 설명", isGroup: false, image: "https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" },
    { title: "500미터 걷기", status: "제출", description: "인증방법 설명", isGroup: false, image: "https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" },
    { title: "물 마시기", status: "제출", description: "인증방법 설명", isGroup: false, image: "https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" },
    { title: "눈 마사지", status: "제출", description: "인증방법 설명", isGroup: false, image: "https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" },
    { title: "눈 마시기", status: "제출", description: "인증방법 설명", isGroup: false, image: "https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" }
  ];

  // 참가자 리스트 (예시 데이터)
  const participants = [
    { name: "황유찬", status: "online", points: 600 },
    { name: "김민수", status: "offline", points: 450 },
    { name: "이서연", status: "online", points: 750 },
    { name: "박지훈", status: "online", points: 500 },
    { name: "최수빈", status: "offline", points: 300 },
    { name: "정민재", status: "online", points: 650 },
    { name: "한지민", status: "offline", points: 400 },
    { name: "오승윤", status: "online", points: 700 },
    { name: "유재석", status: "offline", points: 350 },
    { name: "강호동", status: "online", points: 800 },
    { name: "이영자", status: "offline", points: 200 },
    { name: "홍길동", status: "online", points: 550 },
    { name: "김태희", status: "offline", points: 250 },
    { name: "손흥민", status: "online", points: 900 },
    { name: "류현진", status: "offline", points: 150 },
  ];

  // 개별 미션 정렬 (그룹 미션 제외)
  const sortedMissions = missions.sort((a, b) => (b.isGroup === undefined ? 0 : b.isGroup - a.isGroup));

  // 도넛 차트 데이터 설정
  const doughnutData = {
    labels: ['완료', '미완료'],
    datasets: [
      {
        label: '달성도',
        data: [65, 35], // 예시 데이터
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: '그룹 챌린지 달성도',
      },
    },
  };

  // 모달 열기 함수
  const openModal = (mission) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMission(null);
  };

  return (
    <>
      <TopHeader/>

      {/* 차트 추가 */}
      <div className="yc-chart-container">
        <Doughnut data={doughnutData} options={doughnutOptions} />
        <div className="yc-achievement-rate">
          <h4>달성률: 65%</h4>
        </div>
      </div>

      <div className="yc-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className='yc-main-content'>
          {/* Header */}
          <header className='yc-header'>
            <Header />
          </header>

          {/* Main Top Section */}
          <section className='yc-main-top'>
            {/* Room Information */}
            <div className="yc-room-info">
              <div className="yc-room-card">
                <h3>방 소개</h3>
                <div className='jm-room-card-contents-box'>
                  <p>
                    반갑습니다. 매일 500m 걷기 챌린지방 입니다.<br />
                    꾸준한 걷는 습관을 만들고 싶은 분들을 모집 중입니다.<br />
                    우리 모두 건강한 루틴을 만들었으면 좋겠습니다!
                    반갑습니다. 매일 500m 걷기 챌린지방 입니다.<br />
                    꾸준한 걷는 습관을 만들고 싶은 분들을 모집 중입니다.<br />
                    우리 모두 건강한 루틴을 만들었으면 좋겠습니다!
                    반갑습니다. 매일 500m 걷기 챌린지방 입니다.<br />
                    꾸준한 걷는 습관을 만들고 싶은 분들을 모집 중입니다.<br />
                    우리 모두 건강한 루틴을 만들었으면 좋겠습니다!
                    반갑습니다. 매일 500m 걷기 챌린지방 입니다.<br />
                    꾸준한 걷는 습관을 만들고 싶은 분들을 모집 중입니다.<br />
                    우리 모두 건강한 루틴을 만들었으면 좋겠습니다!
                  </p>
                </div>
              </div>
              <div className="yc-room-card">
                <h3>공지 사항</h3>
                <div className='jm-room-card-contents-box'>
                  <p>공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.
                    공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.
                    공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.
                    공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.
                    공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.공지 내용을 여기에 입력합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 참가자 정보 */}
            <div className="yc-participant-info">
              {/* 참가자 수 표시 */}
              <h3>유저 목록 (총 {participants.length}명)</h3>
              <div className="yc-participant-user-table">
                <table className="yc-participant-table">
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>상태</th>
                      <th>포인트</th>
                      <th>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((user, index) => (
                      <tr className='yc-user-list' key={index}>
                        <td>{user.name}</td>
                        <td className={`yc-status-${user.status}`}>{user.status}</td>
                        <td>{user.points}</td>
                        <td><button className="yc-report-button">신고</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Main Bottom Section */}
          <section className='yc-main-bottom'>
            {/* 개별 미션 요약 */}
            <div className='yc-mission-summary'>
              {sortedMissions.map((mission, index) => (

                <Link to="/mission" className='yc-mission-item' key={index}>
                  <h4>{mission.title}</h4>
                  <img src={mission.image} alt={`${mission.title} 이미지`} className="yc-mission-image" />
                  <div className="yc-mission-content">
                    
                    <p>{mission.description}</p>
                  </div>
                  <button className="yc-view-button" onClick={() => openModal(mission)}>더보기</button>
                </Link>
              ))}
            </div>
          </section>
        
        </main>
      </div>
      
      <ChatRoom/>

      {/* 모달 창 */}
      {isModalOpen && selectedMission && (
        <div className="yc-modal-overlay_roomMain" onClick={closeModal}>
          <div className="yc-modal_roomMain" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            {/* 닫기 아이콘 */}
            <button className="yc-modal-close_roomMain" onClick={closeModal} aria-label="닫기">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {/* 모달 내용 */}
            <div className="yc-modal-content_roomMain">
              <img src={selectedMission.image} alt={`${selectedMission.title} 상세 이미지`} className="yc-modal-image_roomMain" />
              <div className="yc-modal-description_roomMain">
                <h2 id="modal-title">{selectedMission.title}</h2>
                <p>{selectedMission.description}</p>
                {/* 추가 정보가 있다면 여기에 추가 */}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 푸터 */}
      <Footert/>
        {/* 푸터 끝 */}
    </>
  );
}

export default ChallengePage;
