import React, { useEffect,useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// import css
import '../css/JMYC_Challengemain.css';
import '../css/Jm-Point-info.css';

// import
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
  const {roomNum} = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);


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

  // 방정보 가져오기
  const [roomInfo, setRoomInfo] = useState(null); // 방 설명
  const [roomAnnoun, setRoomAnnoun] = useState(null); // 공지 사항
  const [userList, setUserList] = useState([]); // 참가자 리스트
  const [missionList, setMissionList] = useState([]); // 미션 리스트

  // 방정보 가져오기
  const getRoomInfo = () => {

    axios({
      method: 'get',
      url: `http://localhost:9000/api/roomMain/${roomNum}`,
  
      responseType: 'json'
    }).then(response => {
      const { userList, missionList, roomInfo, roomAnnoun } = response.data.apiData;

      setUserList(userList || []);
      setMissionList(missionList || []);
      setRoomInfo(roomInfo || {});
      setRoomAnnoun(roomAnnoun || {});

    }).catch(error => {
      console.log(error);
    });
  };

  useEffect(() => {
    getRoomInfo();
    console.log(setRoomInfo);
  }, []); 


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
                  <p>{roomInfo?.roomInfo || "방 소개 없음"}</p>
                </div>
              </div>
              <div className="yc-room-card">
                <h3>공지 사항</h3>
                <div className='jm-room-card-contents-box'>
                  <p>{roomAnnoun?.announcement || "방 공지 없음"}</p>
                </div>
              </div>
            </div>

            {/* 참가자 정보 */}
            <div className="yc-participant-info">
              {/* 참가자 수 표시 */}
              <h3>유저 목록 (총 {userList.length}명)</h3>
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
                    {userList.map((user, index) => (
                      <tr className='yc-user-list' key={index}>
                        <td>{user.userName}</td>
                        <td className={`yc-status-${user.userStatus}`}>{user.userStatus}</td>
                        <td>points</td>
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
              {missionList.map((mission, index) => (

              <Link 
                to="/mission" 
                className='yc-mission-item' 
                key={index}
                >
                <h4>{mission.missionName}</h4>
                <img src="" alt={`${mission.missionName} 이미지`} className="yc-mission-image" />
                <div className="yc-mission-content">
                  <p>{mission.missionMethod}</p>
                </div>

                {/* 더보기 버튼: 모달 열기 */}
                <button 
                  className="yc-view-button" 
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 Link 클릭 이벤트 전파 방지
                    e.preventDefault();  // Link의 기본 동작 방지
                    openModal(mission);  // 모달 열기
                  }}
                >
                  더보기
                </button>
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
              <img src={selectedMission.image || "default-image-path.jpg"} alt={`${selectedMission.title} 상세 이미지`} className="yc-modal-image_roomMain" />
              <div className="yc-modal-description_roomMain">
                <h2 id="modal-title">{selectedMission.missionName}</h2>
                <p>{selectedMission.missionMethod}</p>
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
