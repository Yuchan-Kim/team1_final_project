import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Import CSS
import '../css/JMYC_Challengemain.css';
import '../css/Jm-Point-info.css';

// Import Components
import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";
import Footert from "../include/JM-Footer.jsx";
import TopHeader from "../include/DH_Header.jsx";
import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";

import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Filler,
} from "chart.js";

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Filler
);

const ChallengePage = () => {
  const { roomNum } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [error, setError] = useState(null);
  const [missionAchievements, setMissionAchievements] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  // 방정보 가져오기
  const [roomInfo, setRoomInfo] = useState(null); // 방 설명
  const [roomAnnoun, setRoomAnnoun] = useState(null); // 공지 사항
  const [userList, setUserList] = useState([]); // 참가자 리스트
  const [missionList, setMissionList] = useState([]); // 미션 리스트

  // 방정보 가져오기
  const getRoomInfo = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/roomMain/${roomNum}`,
      responseType: 'json'
    }).then(response => {
      const { userList, missionList, roomInfo, roomAnnoun } = response.data.apiData;

      setUserList(userList || []);
      setMissionList(missionList || []);
      setRoomInfo(roomInfo || {});
      setRoomAnnoun(roomAnnoun || {});
    }).catch(error => {
      console.log(error);
      setError("방 정보를 불러오는 데 실패했습니다.");
    });
  };

  useEffect(() => {
    if (roomNum) {
      getRoomInfo();
      fetchTopUsers();
      fetchMissionAchievements();
    } else {
      setError("roomNum이 정의되지 않았습니다.");
    }
  }, [roomNum]); 

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

  // 미션 달성률 데이터를 가져오는 함수
  const fetchMissionAchievements = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/rates/achievement/${roomNum}`,
      responseType: 'json'
    })
    .then(response =>{
      console.log('Mission Achievements Response:', response.data);
      if (response.data.result === 'success') {
        setMissionAchievements(response.data.apiData);
      } else {
        setError("미션 달성률을 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
  };

  // Top 5 유저 가져오기
  const fetchTopUsers = () => {
    axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/rates/topusers/${roomNum}`, 
        responseType: 'json'
    })
    .then(response =>{
      console.log('Top Users Response:', response.data);
      if (response.data.result === 'success') { 
        setTopUsers(response.data.apiData); 
      } else {
        setError("Top 5 User를 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
  };

  // 첫 번째 미션 선택
  const firstMission = missionAchievements.length > 0 ? missionAchievements[0] : null;

  // 도넛 차트 데이터 설정
  const doughnutData = firstMission ? {
    labels: ['완료', '미완료'],
    datasets: [
      {
        label: firstMission.missionName,
        data: [firstMission.achievementRate, 100 - firstMission.achievementRate],
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
  } : null;

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

  return (
    <>
      <TopHeader/>

      {/* 에러 메시지 표시 */}
      {error && <div className="yc_error_message">{error}</div>}

      {/* 차트 추가 */}
      <div className="yc-chart-container">
        {doughnutData ? (
          <>
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="yc-achievement-rate">
              <h4>달성률: {firstMission.achievementRate.toFixed(2)}%</h4>
            </div>
          </>
        ) : (
          <p>차트를 로드 중입니다...</p>
        )}

        <h3>Top 5 랭킹</h3>
          {topUsers.map((user) => (
            <div key={user.userNum} className="yc-ranking-item">
              <img 
                src={user.usingProfilePic} 
                alt={`${user.userName} 프로필`} 
                className="yc-ranking-avatar" 
              />
              <div className="yc-ranking-info">
                <span className="yc-ranking-name">{user.userName}</span>
                <span className="yc-ranking-progress">달성률: {user.achievementRate}%</span>
              </div>
            </div>
          ))}
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
                      <tr className='yc-user-list' key={user.userNum}>
                        <td>{user.userName}</td>
                        <td className={`yc-status-${user.userStatus}`}>{user.userStatus}</td>
                        <td>{user.points || 0}</td>
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
              {missionList.length > 0 ? (
                missionList.map((mission, index) => (
                  <Link 
                    to="#"
                    className='yc-mission-item' 
                    key={mission.missionNum}
                  >
                    <h4>{mission.missionName}</h4>
                    <img 
                      src={mission.image || "https://via.placeholder.com/150"} 
                      alt={`${mission.missionName} 이미지`} 
                      className="yc-mission-image" 
                    />
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
                ))
              ) : (
                <p>미션 데이터가 없습니다.</p>
              )}
            </div>
          </section>
        
        </main>
      </div>
      
      <ChatRoom roomNum={roomNum}/>

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
              <img 
                src={selectedMission.image || "https://via.placeholder.com/150"} 
                alt={`${selectedMission.missionName} 상세 이미지`} 
                className="yc-modal-image_roomMain" 
              />
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
