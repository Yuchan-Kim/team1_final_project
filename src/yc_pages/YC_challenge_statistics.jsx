// YCChallengeStatistics.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../yc_assets/yc_css/yc_css_challenge_statistics.css";
import Sidebar from "./YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";
import TopHeader from "../pages/include/DH_Header.jsx";

import YCProfileInfo from "../yc_pages/YC_profile_info.jsx";
import { Doughnut, Line, Bar } from "react-chartjs-2"; 
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
import { FaFileAlt } from 'react-icons/fa'; // 문서 아이콘 추가

// **Chart.js 요소 등록**
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isProfileOpen, setProfileOpen] = useState(false); // 프로필 모달 상태 추가
  const [profileUser, setProfileUser] = useState(null);

  const users = [
    { 
      id: 1, 
      name: "함민규", 
      progress: 92,
      avatar: "path_to_avatar1.jpg",
      location: "서울",
      reliability: 4.5,
      pointRanking: 10,
      reportCount: 0,
      activeChallenges: 3,
      completedChallenges: 2
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    },
    { 
      id: 2, 
      name: "박지민", 
      progress: 80,
      avatar: "path_to_avatar2.jpg",
      location: "부산",
      reliability: 4.0,
      pointRanking: 20,
      reportCount: 1,
      activeChallenges: 2,
      completedChallenges: 3
    }

  ];

  const emojis = ['😊', '😎', '🚀', '🎉', '🏆', '🔥', '💪', '🌟', '🎯'];

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const openProfile = (user) => {
    setProfileUser(user);
    setProfileOpen(true);
  };

  const closeProfile = () => {
    setProfileOpen(false);
    setProfileUser(null);
  };

  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 애니메이션 트리거
    setAnimationTriggered(true);
  }, []);

  const chartData = selectedUser ? {
    labels: ["완료", "미완료"],
    datasets: [
      {
        data: [selectedUser.progress, 100 - selectedUser.progress],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        hoverBackgroundColor: ["#66BB6A", "#BDBDBD"],
        borderWidth: 0
      },
    ],
  } : null;

  // 전체 달성률 라인 차트 데이터 (예시 데이터)
  const overallLineChartData = {
    labels: ["24-04-01", "24-04-05", "24-04-10", "24-04-15", "24-04-20", "24-04-25", "24-04-30"],
    datasets: [
      {
        label: "전체 달성률",
        data: [50, 55, 60, 65, 70, 75, 80],
        fill: true,
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        borderColor: "#2196f3",
        tension: 0.4,
        pointBackgroundColor: "#2196f3",
      },
    ],
  };

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
          text: "전체 달성률 (%)",
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

  // 개인 달성률 라인 차트 데이터 (예시 데이터)
  const personalLineChartData = {
    labels: ["24-04-01", "24-04-05", "24-04-10", "24-04-15", "24-04-20", "24-04-25", "24-04-30"],
    datasets: [
      {
        label: "내 달성률",
        data: [85, 88, 90, 92, 94, 96, 92],
        fill: true,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "#ff9f40",
        tension: 0.4,
        pointBackgroundColor: "#ff9f40",
      },
    ],
  };

  const personalLineChartOptions = {
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
          text: "내 달성률 (%)",
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

  // 막대 그래프 데이터 (예시 데이터)
  const barChartData = {
    labels: ["미션 A", "미션 B", "미션 C", "미션 D", "미션 E"],
    datasets: [
      {
        label: "완료된 내 미션 수",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "#ff6384",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "미션",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "완료 수",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
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
      duration: 1000, // 애니메이션 지속 시간 (밀리초) 감소
      easing: 'easeOutQuart', // 더 자연스러운 이징 함수
    },
  };

  return (
    <>
   
    <TopHeader/>
    <div className="yc-statistics-wrap">
      
      <Sidebar />
      
      <div className="yc_challenge_statistics_main">
        <Header />
        <h2 className="yc_challenge_statistics_title">유저 현황</h2>
         
        {/* 전체 달성율 및 내 달성율 섹션과 포인트 그래프 */}
        <div className="yc_challenge_statistics_overall-personal-container">
          {/* 그래프 섹션 */}
          <div className="yc_challenge_statistics_graphs-section">
            {/* 전체 달성률 포인트 그래프 (라인 차트) */}
            <div className="yc_challenge_statistics_line-chart">
              <Line
                data={overallLineChartData}
                options={lineChartOptions}
              />
            </div>

            {/* 내 달성률 포인트 그래프 (라인 차트) */}
            <div className="yc_challenge_statistics_line-chart">
              <Line
                data={personalLineChartData}
                options={personalLineChartOptions}
              />
            </div>

            {/* 추가 그래프 (막대 그래프) */}
            <div className="yc_challenge_statistics_additional-graph">
              <Bar
                data={barChartData}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
        
        {/* 사용자 리스트 섹션 */}
        <div className="yc_challenge_statistics_user-list">
          <h2 className="yc_challenge_statistics_title">랭킹</h2>
          {users.map((user, index) => (
            <div key={user.id} className="yc_challenge_statistics_user">
              <span className="yc_challenge_statistics_user-emoji">
                {emojis[index % emojis.length]}
              </span>
              <div className="yc_challenge_statistics_user-info">
                <Link
                    to="#"
                    className="yc_challenge_statistics_user-name"
                    onClick={() => openProfile(user)} // 프로필 열기 
                    >
                    {user.name}
                </Link>
                <div className="yc_challenge_statistics_user-progress-bar">
                  <div
                    className="yc_challenge_statistics_filled"
                    style={{ width: `${user.progress}%` }}
                  ></div>
                </div>
                <span className="yc_challenge_statistics_user-progress">
                  달성율 {user.progress}%
                </span>
              </div>
              <span className="yc_challenge_statistics_user-details">
                <button
                  className="yc_challenge_statistics_report-button"
                  onClick={() => openModal(user)}
                  aria-label="성적표 보기"
                >
                  <FaFileAlt />
                </button>
              </span>
            </div>
          ))}
        </div>

        {/* 성적표 모달 */}
        {isModalOpen && selectedUser && (
          <div className="yc-modal-overlay" onClick={closeModal}>
            <div className="yc-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>성적표</h2>
              <div className="yc-report-details">
                <div className="yc-dougnut-chart">
                  <Doughnut
                    key={selectedUser.id} // **고유 키 추가**
                    data={chartData}
                    options={chartOptions}
                  />
                  <span className="yc-completion-rate">{selectedUser.progress}%</span>
                </div>
                <div className="yc-mission-details">
                  <p>완료한 미션: 52/60</p>
                  <p>스트레칭 하기: 26/30</p>
                  <p>500m 걷기: 26/30</p>
                </div>
              </div>

              {/* 그룹 챌린지 섹션 추가 */}
              <div className="yc-group-challenge-section">
                <h3>그룹 챌린지</h3>
                <div className="yc-group-challenge-points">
                  +1000 P
                </div>
                <ul className="yc-group-challenges">
                  <li>줄넘기 5000번 뛰기 - 성공</li>
                </ul>
              </div>

              <div className="yc-points-summary">
                <p><strong>도전 보상:</strong> +120 P</p>
                <p><strong>그룹 보상:</strong> +1500 P</p>
                <p><strong>배팅 포인트:</strong> +600 P</p>
                <p><strong>합계:</strong> 2220 P</p>
              </div>
              <button className="yc-close-button" onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        )}
        
        {/* 프로필 정보 모달 */}
        <YCProfileInfo
          isOpen={isProfileOpen}
          onClose={closeProfile}
          user={profileUser} // 선택한 사용자 정보 전달
        />
      </div>
    </div>
    </>
  );
};

export default YCChallengeStatistics;
