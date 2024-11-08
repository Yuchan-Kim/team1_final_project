// YCChallengeStatistics.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../yc_assets/yc_css/yc_css_challenge_statistics.css";
import Sidebar from "./YC_challenge_sidebar.jsx";
import { Doughnut } from "react-chartjs-2"; // Changed to Doughnut
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

// **Chart.js 요소 등록**
ChartJS.register(ArcElement, Tooltip, Legend);

const YCChallengeStatistics = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: "함민규", progress: 92, details: "줄넘기 5000번 뛰기 15회 달성!" },
    { id: 2, name: "박지민", progress: 92, details: "줄넘기 5000번 뛰기 15회 달성!" },
    { id: 3, name: "이다현", progress: 92, details: "줄넘기 5000번 뛰기 15회 달성!" },
    { id: 4, name: "신지원", progress: 92, details: "줄넘기 5000번 뛰기 15회 달성!" },
    { id: 5, name: "용찬우", progress: 92, details: "줄넘기 5000번 뛰기 -회 달성!" },
    { id: 6, name: "김선용", progress: 92, details: "줄넘기 5000번 뛰기 5회 달성!" },
    { id: 7, name: "김유찬", progress: 92, details: "줄넘기 5000번 뛰기 115회 달성!" },
    { id: 8, name: "유찬김", progress: 92, details: "줄넘기 5000번 뛰기 15회 달성!" },
    { id: 9, name: "송형주", progress: 92, details: "줄넘기 5000번 뛰기 15회 달성!" }
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

  return (
    <div className="wrap">
      <Sidebar />
      <div className="yc_challenge_statistics_main">
        <h2 className="yc_challenge_statistics_title">유저 현황</h2>

        {/* 전체 달성율 섹션 */}
        <div className="yc_challenge_statistics_overall-progress">
          <span>
            전체 달성율 
            <span className="yc_challenge_statistics_percentage">50%</span>
          </span>
          <div className="yc_challenge_statistics_progress-bar">
            <div className="yc_challenge_statistics_filled" style={{ width: '50%' }}></div>
          </div>
          <div className="yc_challenge_statistics_scale">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* 내 달성율 섹션 */}
        <div className="yc_challenge_statistics_personal-progress">
          <span>
            내 달성율 
            <span className="yc_challenge_statistics_percentage">92%</span>
          </span>
          <div className="yc_challenge_statistics_progress-bar">
            <div className="yc_challenge_statistics_filled" style={{ width: '92%' }}></div>
          </div>
          <div className="yc_challenge_statistics_scale">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* 사용자 리스트 섹션 */}
        <div className="yc_challenge_statistics_user-list">
          {users.map((user, index) => (
            <div key={user.id} className="yc_challenge_statistics_user">
              <span className="yc_challenge_statistics_user-emoji">
                {emojis[index % emojis.length]}
              </span>
              <div className="yc_challenge_statistics_user-info">
                <Link to="#" className="yc_challenge_statistics_user-name">
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
                {user.details}
                <button
                  className="yc_challenge_statistics_report-button"
                  onClick={() => openModal(user)}
                >
                  성적표
                </button>
              </span>
            </div>
          ))}
        </div>

        {/* 성적표 모달 */}
        {isModalOpen && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>성적표</h2>
              <div className="report-details">
                <div className="pie-chart">
                  <Doughnut
                    key={selectedUser.id} // **고유 키 추가**
                    data={chartData}
                    options={{
                      maintainAspectRatio: false,
                      cutout: '70%', // Donut chart
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          enabled: true
                        }
                      }
                    }}
                  />
                  <span className="completion-rate">{selectedUser.progress}%</span>
                </div>
                <div className="mission-details">
                  <p>완료한 미션: 52/60</p>
                  <p>스트레칭 하기: 26/30</p>
                  <p>500m 걷기: 26/30</p>
                </div>
              </div>

              {/* 그룹 챌린지 섹션 추가 */}
              <div className="group-challenge-section">
                <h3>그룹 챌린지</h3>
                <div className="group-challenge-points">
                  +1000 P
                </div>
                <ul className="group-challenges">
                  <li>줄넘기 5000번 뛰기 - 성공</li>
                </ul>
                
              </div>

              <div className="points-summary">
                <p><strong>도전 보상:</strong> +120 P</p>
                <p><strong>그룹 보상:</strong> +1500 P</p>
                <p><strong>배팅 포인트:</strong> +600 P</p>
                <p><strong>합계:</strong> 2220 P</p>
              </div>
              <button className="close-button" onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YCChallengeStatistics;
