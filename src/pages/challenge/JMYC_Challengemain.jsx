import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import YCProfileInfo from "../../yc_pages/YC_profile_info.jsx";

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
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userAuth, setUserAuth] = useState(0);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [error, setError] = useState(null);
  const [missionAchievements, setMissionAchievements] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  // 프로필 모달 상태 관리
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  // 방정보 가져오기
  const [roomInfo, setRoomInfo] = useState(null); // 방 설명
  const [roomAnnoun, setRoomAnnoun] = useState(null); // 공지 사항
  const [userList, setUserList] = useState([]); // 참가자 리스트
  const [dateList, setDateList] = useState([]); // 요일 리스트
  const [missionList, setMissionList] = useState([]); // 미션 리스트

  // 방정보 가져오기
  const getRoomInfo = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/roomMain/${roomNum}`,
      responseType: 'json'
    }).then(response => {
      const { userList,dateList, missionList, roomInfo, roomAnnoun } = response.data.apiData;

      setUserList(userList || []);
      setDateList(dateList || []);
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
      checkUserAuth();
      console.log('missionList:', missionList)
    } else {
      setError("roomNum이 정의되지 않았습니다.");
    }
  }, [roomNum]);
  
  useEffect(() => {
    // 페이지 로드 시 스크롤 위치를 맨 위로 설정
    window.scrollTo(0, 0);
  }, []);

  
  const checkUserAuth = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'json'
    }).then(response => {
      if (response.data.result === 'success' && response.data.apiData === 1){
        setUserAuth(1);
        console.log("1등록");

      } else if (response.data.result === 'success' && response.data.apiData === 2) {
          setUserAuth(2);
          console.log("2등록");

      } else {
        setUserAuth(0);
        console.log("0등록");

      }
    }).catch(error => {
      console.log(error);
      setError("서버와의 통신에 실��했습니다.");
    });
  }

  // 모달 열기 함수
  const [modalImgIndex, setModalImgIndex] = useState(0);

// openModal 함수 수정
const openModal = (mission) => {
  setSelectedMission(mission);
  setModalImgIndex(0); // 모달을 열 때 항상 첫 번째 이미지를 표시
  setIsModalOpen(true);
};


  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMission(null);
  };

  

   // 프로필 모달 열기 함수
   const openProfile = async (userNum) => {
    console.log('openProfile called with:', userNum); // 디버깅용 로그 추가
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rates/profile/${userNum}`);
        console.log('Profile Response:', response.data);
        if (response.data.result === 'success') {
            setProfileUser(response.data.apiData);
            setProfileOpen(true);
        } else {
            setError("프로필 정보를 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        setError("서버와의 통신에 실패했습니다.");
        console.error(error);
    }
  };

  // 프로필 모달 닫기 함수
  const closeProfile = () => {
    setProfileOpen(false);
    setProfileUser(null);
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
          '#007aff',
          '#E0E0E0',
        ],
        borderColor: [
          '#007aff',
          '#E0E0E0',
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

  const ImageSlider = ({ images, missionName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const handleNextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    const handlePrevImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
  
    return (
      <div className="yc-slider-container">
        {images.length > 0 ? (
          <div className="yc-slider">
            <img
              className="yc-slider-image"
              src={`${process.env.REACT_APP_API_URL}/upload/${images[currentIndex]}`}
              alt={`${missionName} 이미지 ${currentIndex + 1}`}
            />
            {images.length > 1 && (
              <div className="yc-slider-buttons">
                <button
                  className="yc-slider-btn prev"
                  onClick={handlePrevImage}
                >
                  ◀
                </button>
                <button
                  className="yc-slider-btn next"
                  onClick={handleNextImage}
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>
    );
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
            <strong>{firstMission.missionName} </strong> <br/> <br/>
            <strong id = "yc-group_achieve">달성률: {firstMission.achievementRate.toFixed(2)}%</strong> <br/><br/>
            </div>
          </>
        ) : (
          <p>차트를 로드 중입니다...</p>
        )}
        
        <h3 id = "top5_rank">달성률 TOP5</h3>
          {topUsers.map((user) => (
            <div key={user.userNum} className="yc-ranking-item">
              <img 
                src={
                user.usingProfilePic
                    ? `${process.env.REACT_APP_API_URL}${user.usingProfilePic}`
                    : '/images/profile-fill.png' // 기본 프로필 이미지 경로
            }
                alt={'/images/challenge1.png'} 
                className="yc-ranking-avatar" 
                onError={(e) => {
                  e.target.src = '/images/profile-fill.png';
                }}
              />
              <div className="yc-ranking-info">
                        <Link
                          to="#"
                          className="yc_challenge_statistics_top5User"
                          onClick={() => openProfile(user.userNum)} // user 객체 대신 userNum을 전달합니다.
                        >
                          {user.userName}
                        </Link>
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
                <h3>챌린지 설명</h3>
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
                      <th>종합 달성률</th>
                      <th>보유 포인트</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => (
                      <tr className='yc-user-list' key={user.userNum}>
                        <td><Link
                          to="#"
                          className="yc_challenge_statistics_enteredUser"
                          onClick={() => openProfile(user.userNum)} // user 객체 대신 userNum을 전달합니다.
                        >
                          {user.userName}
                        </Link></td>
                        <td className={`yc-status-${user.achievementRate}`}>{user.achievementRate}</td>
                        <td>{user.userPoints || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* 프로필 정보 모달 */}
          
              </div>
            </div>
          </section>

          {/* Main Bottom Section */}
          <section className='yc-main-bottom'>
          <div className='jm-room-mission-date-box'>
            <strong>미션 해당 요일: </strong>
              {
                  dateList
                      .filter(date => date.roomDayNum >= 1 && date.roomDayNum <= 7) // 1~7번만 필터링
                      .map((date, index) => {
                          // 요일 매핑
                          const days = ["월", "화", "수", "목", "금", "토", "일"];
                          return (
                              <div key={index} className='jm-room-mission-date'>
                                  <span className='jm-room-date'>{days[date.roomDayNum - 1]}</span>
                              </div>
                          );
                      })
              }
          </div>
            {/* 개별 미션 요약 */}
            <div className='yc-mission-summary'>
              {missionList.length > 0 ? (
                Object.entries(
                  missionList.reduce((acc, mission) => {
                    if (!acc[mission.missionName]) {
                      acc[mission.missionName] = {
                        missionNum: mission.missionNum,
                        missionName: mission.missionName,
                        missionMethod: mission.missionMethod,
                        images: [],
                      };
                    }

                    // 이미지 데이터가 존재할 경우 처리
                    if (mission.missionImgName) {
                      const imageArray = mission.missionImgName.split(',').map((img) => img.trim());
                      acc[mission.missionName].images.push(...imageArray);
                    }

                    return acc;
                  }, {})
                ).map(([missionName, mission]) => (
                  <div className='yc-mission-item' key={mission.missionNum}>
                    <h4>{mission.missionName}</h4>

                    {/* 슬라이더 컴포넌트 */}
                    <ImageSlider images={mission.images} missionName={mission.missionName} />

                    <div className="yc-mission-content">
                      <p>{mission.missionMethod}</p>
                    </div>
                    <button
                      className="yc-view-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(mission);
                      }}
                    >
                      + 더보기
                    </button>
                  </div>
                ))
              ) : (
                <p>미션 데이터가 없습니다.</p>
              )}
            </div>
          </section>
        
        </main>
      </div>
      
      { (userAuth === 1 ||userAuth === 2)  &&(
            <ChatRoom roomNum={roomNum}/>
        ) }  

      {/* 모달 창 */}
      {isModalOpen && selectedMission && (
  <div
    className="yc-modal-overlay_roomMain"
    onClick={closeModal}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div
      className="yc-modal_roomMain"
      onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
    >
      {/* 닫기 아이콘 */}
      <button
        className="yc-modal-close_roomMain"
        onClick={closeModal}
        aria-label="닫기"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      {/* 모달 내용 */}
      <div className="yc-modal-content_roomMain">
        {/* 미션 제목 */}
        <h2 id="yc-modal-title">{selectedMission.missionName}</h2>

        {/* 슬라이더 구현 */}
        {selectedMission.images && selectedMission.images.length > 0 ? (
          <div className="yc-slider-container">
            <button
              className="yc-slider-button prev"
              onClick={() =>
                setModalImgIndex(
                  (prevIndex) =>
                    (prevIndex - 1 + selectedMission.images.length) %
                    selectedMission.images.length
                )
              }
              disabled={selectedMission.images.length <= 1}
            >
              ◀
            </button>
            <div className="yc-slider">
              <img
                src={`${process.env.REACT_APP_API_URL}/upload/${selectedMission.images[modalImgIndex].trim()}`}
                alt={`${selectedMission.missionName} 이미지 ${modalImgIndex + 1}`}
                className="yc-slider-image"
              />
            </div>
            <button
              className="yc-slider-button next"
              onClick={() =>
                setModalImgIndex(
                  (prevIndex) => (prevIndex + 1) % selectedMission.images.length
                )
              }
              disabled={selectedMission.images.length <= 1}
            >
              ▶
            </button>
          </div>
        ) : (
          <p>이미지가 없습니다.</p>
        )}

        {/* 미션 방법 */}
        <div className="yc-mission-method">
          <p>{selectedMission.missionMethod}</p>
        </div>
      </div>
    </div>
  </div>
)}



      <YCProfileInfo
            isOpen={isProfileOpen}
            onClose={closeProfile}
            user={profileUser} // 선택된 유저 정보 전달
      />

      {/* 푸터 */}
      <Footert/>
        {/* 푸터 끝 */}
    </>
  );
}

export default ChallengePage;
