import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";

import "../yc_assets/yc_css/yc_css_challenge_statistics.css";
import Sidebar from "./YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";
import TopHeader from "../pages/include/DH_Header.jsx";
import Footert from "../pages/include/JM-Footer.jsx";
import ChatRoom from "../yc_pages/YC_challenge_chatroom.jsx";
import YCProfileInfo from "../yc_pages/YC_profile_info.jsx";

import { FaFileAlt } from 'react-icons/fa';
import { Doughnut, Line, Bar } from "react-chartjs-2"; // Bar 차트 추가

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

// Chart.js 컴포넌트 등록
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

const YCChallengeStatistics = () => {

  const [roomStatusNum, setRoomStatusNum] = useState(null);

  // 모달 상태 관리
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 프로필 모달 상태 관리
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  // 데이터 상태 관리
  const token = localStorage.getItem('token');
  const [topUsers, setTopUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [overallStats, setOverallStats] = useState([]); // 전체 달성률 통계
  const [missionApprovals, setMissionApprovals] = useState([]); // 미션 승인 횟수 통계
  const [missionAchievements, setMissionAchievements] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const roomEnterPoint = userDetails.roomEnterPoint || 0;
  const achievementRate = userDetails.userAchievementRate || 0;
  const challengeRewardPoints = userDetails.challengeRewardEligible ? roomEnterPoint : 0;

  let bettingPoints = 0;
  if (achievementRate < 85) {
      bettingPoints = roomEnterPoint * (achievementRate / 100);
  } else if (achievementRate >= 85 && achievementRate < 100) {
      bettingPoints = roomEnterPoint;
  } else if (achievementRate === 100) {
      bettingPoints = roomEnterPoint + (roomEnterPoint * 0.20);
  }

  // 에러 메시지 상태 관리
  const [error, setError] = useState(null);

  // URL에서 roomNum 파라미터 가져오기
  const { roomNum } = useParams();

  // 방 상태 가져오기 함수
  const fetchRoomStatus = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/header/${roomNum}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Room Status Response:', response.data);
        if (response.data.result === 'success') {
            setRoomStatusNum(response.data.apiData.roomStatusNum);
        } else {
            setError("방 상태 정보를 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        setError("서버와의 통신에 실패했습니다.");
        console.error(error);
    }
  };

  // 모달 열기 함수
  const openModal = async (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    setUserDetails({}); // 이전 데이터 초기화

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rates/userDetails/${roomNum}/${user.userNum}`);
        console.log('User Details Response:', response.data);
        if (response.data.result === 'success') {
            setUserDetails(response.data.apiData);
        } else {
            setError("사용자 정보를 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        setError("서버와의 통신에 실패했습니다.");
        console.error(error);
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
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

  const [userAuth, setUserAuth] = useState(0);

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

  // 전체 유저 목록 가져오기
  const fetchUsers = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/rates/users/${roomNum}`, 
      responseType: 'json'
  })
  .then(response => {
    console.log('Users Response:', response.data);
    if (response.data.result === 'success') {
      if (response.data.apiData && Array.isArray(response.data.apiData)) {
        setUsers(response.data.apiData);
      } else {
        setError("Unexpected data format for users.");
      }
    } else {
      setError("유저 목록을 불러오는 데 실패했습니다.");
    }
  })
  .catch(error => {
    setError("서버와의 통신에 실패했습니다.");
    console.error(error);
  });
  };

  // 전체 달성률 통계 가져오기
  const fetchOverallStats = () => {
    axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/rates/overall/${roomNum}`, 
        responseType: 'json'
    })
    .then(response =>{
      console.log('Overall Stats Response:', response.data);
      if (response.data.result === 'success') { 
        setOverallStats(response.data.apiData); 
      } else {
        setError("전체 달성률 통계를 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
  };

 

  const checkJoinedUser = () => {
    axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/challenge/join/${roomNum}`, // 수정된 URL
        responseType: 'json'
    })
    .then(response =>{
      if (response.data.result === 'success') { 
        setMissionApprovals(response.data.apiData); 
      } else {
        setError("미션 승인 횟수를 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
  };

  // 이모지 배열
  const emojis = ['😊', '😎', '🚀', '🎉', '🏆', '🔥', '💪', '🌟', '🎯'];

  // 전체 달성률 라인 차트 데이터 (백엔드에서 가져온 데이터로 설정)
  const overallLineChartData = {
    labels: overallStats.map(stat => stat.date), // 제출 날짜 레이블
    datasets: [
      {
        label: "일일 달성률",
        data: overallStats.map(stat => stat.percentage), // 달성률 데이터
        fill: true,
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        borderColor: "#2196f3",
        tension: 0.4,
        pointBackgroundColor: "#2196f3",
      },
    ],
  };

  // 전체 달성률 라인 차트 옵션
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "날짜",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "일일 달성률 (%)",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
      title: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  


  // 도넛 차트 옵션 정의
  const chartOptions = {
    maintainAspectRatio: false,
    cutout: '70%', // Donut chart
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    animation: {
      animateRotate: true, // 회전 애니메이션 활성화
      animateScale: false,  // 스케일 애니메이션 비활성화
      duration: 1000, // 애니메이션 지속 시간 (ms)
      easing: 'easeOutQuart', // 자연스러운 이징 함수
    },
  };

  // 성적표용 도넛 차트 데이터
  const chartData = selectedUser ? {
    labels: ["완료", "미완료"],
    datasets: [
      {
        data: [selectedUser.achievementRate, 100 - selectedUser.achievementRate],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        hoverBackgroundColor: ["#66BB6A", "#BDBDBD"],
        borderWidth: 0
      },
    ],
  } : null;

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

  // 그룹 챌린지 성공 여부 확인
  const groupChallengeSuccess = userDetails.groupChallenges?.every(
    (challenge) => challenge.achievementRate === 100
  );

  // 그룹 챌린지 포인트 계산
  const groupChallengePoints = groupChallengeSuccess ? roomEnterPoint : 0;

  


  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    if (roomNum) {
      fetchTopUsers();
      fetchUsers();
      fetchOverallStats();
      fetchMissionAchievements(); // 새로운 함수 호출
      checkUserAuth();
      fetchRoomStatus();
    } else {
      setError("roomNum이 정의되지 않았습니다.");
    }
  }, [roomNum]);

  return (
    <>
      {/* 상단 헤더 */}
      <TopHeader/>
      
      <div className="yc-chart-container"> 
          
        {/* Top 5 유저 랭킹 */}
        <div className="yc-top-rankings">
          {/* 도넛 차트와 달성률 표시 */}
          {doughnutData && (
            <>
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <h4>{missionAchievements.missionName} 달성률: {firstMission.achievementRate.toFixed(2)}%</h4>
            </>
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
      </div>

      <div className="yc-statistics-wrap">
        {/* 사이드바 */}
        <Sidebar />
        
        <div className="yc_challenge_statistics_main">
          {/* 헤더 */}
          <Header />
          
          {/* 유저 현황 제목 */}
          <h2 className="yc_challenge_statistics_title">유저 현황</h2>
          
          {/* 전체 및 개인 달성률 그래프 섹션 */}
          <div className="yc_challenge_statistics_overall-personal-container">
            <div className="yc_challenge_statistics_graphs-section">

              {/* 전체 달성률 라인 차트 */}
              <div className="yc_challenge_statistics_line-chart">
                <Line
                  data={overallLineChartData}
                  options={lineChartOptions}
                />
              </div>

            </div>
          </div>
          
          
          
          {/* 유저 목록 섹션 */}
          <div className="yc_challenge_statistics_user-list">
            <h2 className="yc_challenge_statistics_title">랭킹</h2>
            {users.length > 0 ? (
              users.map((user, index) => (
                <div key={user.userNum} className="yc_challenge_statistics_user">
                  {/* 이모지 표시 */}
                  <img 
                    src={user.usingProfilePic} 
                    alt={`${user.userName} 프로필`} 
                    className="yc_challenge_statistics_user-emoji" 
                  />
                  
                  {/* 유저 정보 */}
                  <div className="yc_challenge_statistics_user-info">
                    <Link
                      to="#"
                      className="yc_challenge_statistics_user-name"
                      onClick={() => openProfile(user.userNum)} // user 객체 대신 userNum을 전달합니다.
                    >
                      {user.userName}
                    </Link>

                    {/* 달성률 프로그레스 바 */}
                    <div className="yc_challenge_statistics_user-progress-bar">
                      <div
                        className="yc_challenge_statistics_filled"
                        style={{ width: `${user.achievementRate}%` }}
                      ></div>
                    </div>

                    {/* 달성률 퍼센트 표시 */}
                    <span className="yc_challenge_statistics_user-progress">
                      달성율 {user.achievementRate}%
                    </span>
                  </div>

                  {/* 성적표 보기 버튼 - roomStatusNum이 4일 때만 표시 */}
                {roomStatusNum === 4 && (
                    <span className="yc_challenge_statistics_user-details">
                        <button
                            className="yc_challenge_statistics_report-button"
                            onClick={() => openModal(user)}
                            aria-label="성적표 보기"
                        >
                            <FaFileAlt />
                        </button>
                    </span>
                )}
                  
                </div>
              )) 
            ) : (
              <p>유저 데이터가 없습니다.</p>
            )}
              
          </div> 

          {/* 성적표 모달 */}
          
          {isModalOpen && selectedUser && userDetails && (
              <div className="yc-modal-overlay" onClick={closeModal}>
              <div className="yc-modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>성적표</h2>
                  <div className="yc-report-details">
                      {/* 도넛 차트 */}
                      <div className="yc-dougnut-chart">
                          <Doughnut
                              key={selectedUser.userNum}
                              data={chartData}
                              options={chartOptions}
                          />
                          <span className="yc-completion-rate">{selectedUser.achievementRate}%</span>
                      </div>

                      {/* 미션 상세 정보 */}
                      <div className="yc-mission-details">
                          <p>완료한 미션: {userDetails?.totalMissions?.completedCount}/{userDetails?.totalMissions?.totalAssigned}</p>
                          {userDetails?.missionDetails?.map((mission) => (
                              <p key={mission.missionName}>
                                  {mission.missionName}: {mission.completedCount}/{mission.totalAssigned}
                              </p>
                          ))}
                      </div>

                      {/* 그룹 챌린지 섹션 */}
                      <div className="yc-group-challenge-section">
                          <h3>그룹 챌린지</h3>
                          <div className="yc-group-challenge-points">
                              +{groupChallengePoints} P
                          </div>
                          <ul className="yc-group-challenges">
                              {userDetails?.groupChallenges?.map((challenge) => (
                                  <li key={challenge.missionName}>
                                      {challenge.missionName} - {challenge.achievementRate === 100 ? '성공' : '실패'}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      {/* 포인트 요약 */}
                      <div className="yc-points-summary">
                          {userDetails?.challengeRewardEligible && (
                              <p><strong>도전 보상:</strong> +{challengeRewardPoints} P</p>
                          )}
                          <p><strong>그룹 보상:</strong> +{groupChallengePoints} P</p>
                          <p><strong>배팅 포인트:</strong> +{Math.round(bettingPoints)} P</p>
                          <p><strong>합계:</strong> {Math.round(challengeRewardPoints + groupChallengePoints + bettingPoints)} P</p>
                      </div>

                      <button className="yc-close-button" onClick={closeModal}>
                          닫기
                      </button>
                  </div>
              </div>
              </div>
          )}
          
          {/* 프로필 정보 모달 */}
          <YCProfileInfo
            isOpen={isProfileOpen}
            onClose={closeProfile}
            user={profileUser} // 선택된 유저 정보 전달
          />
        </div>
      </div>
      {/* 채팅룸 컴포넌트 */}
      {/* 채팅 컴포넌트 */}
      { (userAuth === 1 ||userAuth === 2)  &&(
            <ChatRoom roomNum={roomNum}/>
        ) }  

       {/* 푸터 */}
       <Footert/>
          {/* 푸터 끝 */}
    </>
  );
};

export default YCChallengeStatistics;
