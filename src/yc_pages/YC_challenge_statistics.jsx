// YCChallengeStatistics.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../yc_assets/yc_css/yc_css_challenge_statistics.css";
import Sidebar from "./YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";
import TopHeader from "../pages/include/DH_Header.jsx";
import Footert from "../pages/include/JM-Footer.jsx";
import ChatRoom from "../yc_pages/YC_challenge_chatroom.jsx";

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
import { FaFileAlt } from 'react-icons/fa'; // Document icon

// **Register Chart.js components**
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

  const [isProfileOpen, setProfileOpen] = useState(false); // Profile modal state
  const [profileUser, setProfileUser] = useState(null);

  // Updated users array with unique IDs and varied data
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
      id: 3, 
      name: "이수진", 
      progress: 75,
      avatar: "path_to_avatar3.jpg",
      location: "대구",
      reliability: 4.2,
      pointRanking: 15,
      reportCount: 0,
      activeChallenges: 4,
      completedChallenges: 3
    },
    { 
      id: 4, 
      name: "최민호", 
      progress: 85,
      avatar: "path_to_avatar4.jpg",
      location: "인천",
      reliability: 4.7,
      pointRanking: 8,
      reportCount: 0,
      activeChallenges: 5,
      completedChallenges: 4
    },
    { 
      id: 5, 
      name: "김하늘", 
      progress: 90,
      avatar: "path_to_avatar5.jpg",
      location: "광주",
      reliability: 4.8,
      pointRanking: 5,
      reportCount: 0,
      activeChallenges: 6,
      completedChallenges: 5
    },
    // Add more users as needed
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
    // Trigger animation on page load
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

  // Overall achievement rate line chart data (example data)
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

  // Personal achievement rate line chart data (example data)
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

  // Bar chart data (example data)
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
      animateRotate: true, // Enable rotation animation
      animateScale: false,  // Disable scale animation
      duration: 1000, // Reduce animation duration (ms)
      easing: 'easeOutQuart', // More natural easing function
    },
  };

   // Donut chart data
   const doughnutData = {
    labels: ['완료', '미완료'],
    datasets: [
      {
        label: '달성도',
        data: [65, 35], // Example data
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

  // Top 5 users for ranking display
  const topUsers = users
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  return (
    <>
      <TopHeader/>

      {/* Chart Container with Top 5 Rankings */}
      <div className="yc-chart-container">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="yc-achievement-rate">
            <h4>달성률: 65%</h4>
          </div>
          
          {/* Top 5 User Rankings */}
          <div className="yc-top-rankings">
            <h3>Top 5 랭킹</h3>
            {topUsers.map((user, index) => (
              <div key={user.id} className="yc-ranking-item">
                <img 
                  src={user.avatar} 
                  alt={`${user.name} 프로필`} 
                  className="yc-ranking-avatar" 
                />
                <div className="yc-ranking-info">
                  <span className="yc-ranking-name">{user.name}</span>
                  <span className="yc-ranking-progress">달성률: {user.progress}%</span>
                </div>
              </div>
            ))}
          </div>
      </div>

      <div className="yc-statistics-wrap">
        
        <Sidebar />
        
        <div className="yc_challenge_statistics_main">
          <Header />
          <h2 className="yc_challenge_statistics_title">유저 현황</h2>
          {/* Overall and Personal Achievement Rates and Point Graphs */}
          <div className="yc_challenge_statistics_overall-personal-container">
            {/* Graph Section */}
            <div className="yc_challenge_statistics_graphs-section">
              {/* Overall Achievement Rate Line Chart */}
              <div className="yc_challenge_statistics_line-chart">
                <Line
                  data={overallLineChartData}
                  options={lineChartOptions}
                />
              </div>

              {/* Personal Achievement Rate Line Chart */}
              <div className="yc_challenge_statistics_line-chart">
                <Line
                  data={personalLineChartData}
                  options={personalLineChartOptions}
                />
              </div>
            </div>
          </div>
          
          {/* User List Section */}
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
                      onClick={() => openProfile(user)} // Open profile 
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

          {/* Performance Report Modal */}
          {isModalOpen && selectedUser && (
            <div className="yc-modal-overlay" onClick={closeModal}>
              <div className="yc-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>성적표</h2>
                <div className="yc-report-details">
                  <div className="yc-dougnut-chart">
                    <Doughnut
                      key={selectedUser.id} // **Unique key added**
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

                {/* Group Challenge Section */}
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
          
          {/* Profile Info Modal */}
          <YCProfileInfo
            isOpen={isProfileOpen}
            onClose={closeProfile}
            user={profileUser} // Pass selected user info
          />
        </div>
      </div>
      <ChatRoom/>

       {/* Footer */}
       <Footert/>
          {/* Footer End */}
    </>
  );
};

export default YCChallengeStatistics;
