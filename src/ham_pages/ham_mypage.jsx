// src/ham_pages/ham_mypage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto'; // 차트 만드는 라이브러리

// Header, Sidebar, Topbar 컴포넌트 import
import Header from './ham_common/ham_header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';

//공통 리셋 & 마이페이지 스타일 
import '../ham_asset/css/ham_mypage.css';


// 차트 출력용 더미 데이터
const chartData = [
    { id: "chart1", data: [66, 34], color: "#3a7afe", label: "66%", title: "일반 방 출석률", stat: "85일 / 128 일", link: "View Details" },
    { id: "chart2", data: [74, 26], color: "#3a7afe", label: "74%", title: "챌린지 방 출석률", stat: "73일 / 85 일", link: "Go to challenge lists" },
    { id: "chart3", data: [74, 26], color: "#3a7afe", label: "74%", title: "로그인 출석 체크", stat: "158 일 of 235 일", link: "Go to check-in" },
    { id: "chart4", data: [97, 3], color: "#3a7afe", label: "97%", title: "과제 수행 / 출석일 (일반방)", stat: "83일 / 85 일", link: "View Details" },
    { id: "chart5", data: [100, 0], color: "#28a745", label: "100%", title: "과제 수행 / 출석일 (챌린지)", stat: "73일 / 73 일", link: "View Details" },
];

// 챌린지 리스트 더미 데이터
const challenges = {
    ongoing: [
        { id: 1, title: '반갑습니다. 매일 500m 걷기 챌린지 방입니다.', date: '2024 / 03 / 21 ~ 2024 / 04 / 20 (30일)', image: 'IMG_4879.jpg' },
        { id: 2, title: '건강한 루틴을 만드는 것은 중요합니다.', date: '2024 / 02 / 01 ~ 2024 / 02 / 20 (20일)', image: 'IMG_4878.jpg' },
        { id: 3, title: '안녕하세요! 100m 걷기 챌린지입니다.', date: '2024 / 02 / 01 ~ 2024 / 02 / 20 (20일)', image: 'IMG_4878.jpg' },
        { id: 4, title: '500m 걷기 챌린지 시작합니다.', date: '2024 / 02 / 01 ~ 2024 / 02 / 20 (20일)', image: 'IMG_4879.jpg' },
    ],
    upcoming: [
        { id: 5, title: '제목 뭐 뭐하는 방~', date: '2024 / 03 / 01 ~ 2024 / 03 / 10 (10일)', image: 'IMG_4646.jpg' },
    ],
    completed: [
        { id: 6, title: '제목', date: '2024 / 01 / 01 ~ 2024 / 01 / 31', image: 'IMG_4645.jpg' },
        { id: 7, title: '제목', date: '2024 / 01 / 01 ~ 2024 / 01 / 31', image: 'IMG_4645.jpg' },
    ],
};

const MyPage = () => {
    
    // 챌린지 히스토리 탭 전환 상태값
    const [activeTab, setActiveTab] = useState('ongoing'); // 현재 활성화된 챌린지 탭 (진행 중, 시작 전, 종료)

    // 차트 생성 및 파괴 관리
    useEffect(() => {
        const chartInstances = {}; // 차트 인스턴스를 저장하는 객체

        chartData.forEach((chart) => {
            const canvas = document.getElementById(chart.id); // 차트를 그릴 canvas 요소 가져오기
            if (!canvas) return;
            const ctx = canvas.getContext("2d"); // 2D 컨텍스트 얻기

            if (chartInstances[chart.id]) {
                chartInstances[chart.id].destroy(); // 기존 차트 인스턴스 제거
            }

            chartInstances[chart.id] = new Chart(ctx, {
                type: "doughnut", // 도넛형 차트
                data: {
                    datasets: [
                        {
                            data: chart.data,
                            backgroundColor: [chart.color, "#e0e0e0"], // 차트 색상 설정
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    cutout: "70%", // 가운데 비율 설정
                    responsive: true, // 반응형 설정
                    maintainAspectRatio: false, // 반응형일 때 비율 유지하지 않음
                    plugins: {
                        tooltip: { enabled: false }, // 툴팁 비활성화
                        legend: { display: false }, // 범례 비활성화
                    },
                    animation: {
                        onComplete: function () {
                            if (!this.chart) return;

                            const ctx = this.chart.ctx;
                            if (!ctx) return;

                            const width = this.chart.width;
                            const height = this.chart.height;

                            ctx.restore();
                            const fontSize = (height / 4).toFixed(2);
                            ctx.font = `${fontSize}px Arial`;
                            ctx.textBaseline = "middle";
                            ctx.fillStyle = "#000";

                            const text = chart.label; // 차트 중앙에 표시할 텍스트
                            const textX = Math.round((width - ctx.measureText(text).width) / 2);
                            const textY = height / 2;

                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        },
                    },
                },
            });
        });

        // 컴포넌트 언마운트 시 차트 인스턴스 정리
        return () => {
            Object.values(chartInstances).forEach((chartInstance) => {
                chartInstance.destroy(); // 차트 인스턴스 파괴
            });
        };
    }, []);

    // 탭 클릭 시 활성화 상태 변경
    const handleTabClick = (tab) => {
        setActiveTab(tab); // 클릭된 탭으로 activeTab 업데이트
    };

    // 로그아웃 핸들러 (예시)
    const handleLogout = () => {
        // 로그아웃 로직 추가
        console.log("로그아웃");
    };

    return (
        <div className="wrap">
            {/* Header 컴포넌트 */}
            <Header
                // profileImage는 Topbar 내에서 관리되므로 MyPage에서는 전달하지 않음
                username="씽씽이김유찬"
                points="3600"
                onLogout={handleLogout}
            />

            {/* 메인 컨테이너 */}
            <div className="hmk_main-container">
                {/* Sidebar 컴포넌트 */}
                <Sidebar />

                {/* 메인 콘텐츠 영역 */}
                <div className="hmk_main">
                    {/* Topbar 컴포넌트 */}
                    <Topbar
                        username="씽씽이김유찬"
                        points="3600"
                    />

                    <div className="hmk_stat-container">
                        {chartData.map((chart) => (
                            <div key={chart.id} className="hmk_stat-card" style={{ position: 'relative' }}>
                                <div className="hmk_chart">
                                    <canvas className="hmk_chart_item" id={chart.id} width="71" height="71"></canvas>
                                    <div className="hmk_stat-card_chart-center-text">
                                        {chart.label} {/* 차트 중앙에 표시될 텍스트 */}
                                    </div>
                                </div>
                                <div className="hmk_stat-info">
                                    <p className="hmk_stat-title">{chart.title}</p>
                                    <p className="hmk_stat-data">{chart.stat}</p>
                                    <Link to="#" className="hmk_stat-link">{chart.link}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hmk_tab-menu">
                        <button className={`hmk_tab-button ${activeTab === 'ongoing' ? 'hmk_active' : ''}`} onClick={() => handleTabClick('ongoing')}>
                            진행중인 챌린지
                        </button>
                        <button className={`hmk_tab-button ${activeTab === 'upcoming' ? 'hmk_active' : ''}`} onClick={() => handleTabClick('upcoming')}>
                            시작 전 챌린지
                        </button>
                        <button className={`hmk_tab-button ${activeTab === 'completed' ? 'hmk_active' : ''}`} onClick={() => handleTabClick('completed')}>
                            종료 된 챌린지
                        </button>
                    </div>

                    <div className="hmk_challenge-list">
                        {challenges[activeTab].map((challenge) => (
                            <div key={challenge.id} className="hmk_challenge-card">
                                <img src={require(`../ham_asset/images/${challenge.image}`)} alt="챌린지" className="hmk_challenge-image" />
                                <div className="hmk_challenge-details">
                                    <p className="hmk_challenge-date">{challenge.date}</p>
                                    <p className="hmk_challenge-title">{challenge.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
