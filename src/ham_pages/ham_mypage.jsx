// src/ham_pages/ham_mypage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../pages/include/DH_Header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import ChartComponent from './ham_common/ham_ChartComponent';

import '../ham_asset/css/ham_mypage.css';

const MyPage = () => {
    const navigate = useNavigate();
    const userNum = 1; // 고정된 사용자 번호

    // 상태 관리
    const [chartData, setChartData] = useState([]);
    const [challenges, setChallenges] = useState({
        ongoing: [],
        upcoming: [],
        completed: []
    });
    const [activeTab, setActiveTab] = useState('ongoing');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("MyPage 마운트/업데이트됨");
        const fetchData = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';

                // 병렬로 API 호출
                const [chartResponse, userResponse] = await Promise.all([
                    axios.get(`${apiUrl}/api/user/${userNum}/charts`),
                    axios.get(`${apiUrl}/api/user/${userNum}`)
                ]);

                if (chartResponse.data.result === 'success') {
                    setChartData(chartResponse.data.apiData || []);
                }

                if (userResponse.data.result === 'success') {
                    const userData = userResponse.data.apiData;
                    if (userData.challenges) {
                        setChallenges(userData.challenges);
                    }
                }
            } catch (err) {
                console.error("데이터를 불러오는 중 오류 발생:", err);
                setError(err.response?.data?.message || "데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        console.log("현재 차트 데이터:", chartData);
        console.log("현재 챌린지 데이터:", challenges);
    }, [chartData, challenges]);

    // 탭 클릭 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // 챌린지 카드 클릭 핸들러
    const handleCardClick = () => {
        navigate('/cmain');
    };

    if (loading) {
        return <div>데이터를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const activeChallenges = challenges[activeTab] || [];

    return (
        <>
            <Header />
            <div className="wrap ham_wrap">
                <div className="hmk_main-container">
                    <Sidebar />
                    <div className="hmk_main">
                        <Topbar userNum={userNum} />
                        <div className="hmk_stat-container">
                            {chartData.map((chart) => (
                                <div key={chart.id} className="hmk_stat-card" style={{ position: 'relative' }}>
                                    <div className="hmk_chart">
                                        <ChartComponent chart={chart} />
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
                            <button
                                className={`hmk_tab-button ${activeTab === 'ongoing' ? 'hmk_active' : ''}`}
                                onClick={() => handleTabClick('ongoing')}
                                aria-label="진행중인 챌린지 탭"
                            >
                                진행중인 챌린지
                            </button>
                            <button
                                className={`hmk_tab-button ${activeTab === 'upcoming' ? 'hmk_active' : ''}`}
                                onClick={() => handleTabClick('upcoming')}
                                aria-label="시작 전 챌린지 탭"
                            >
                                시작 전 챌린지
                            </button>
                            <button
                                className={`hmk_tab-button ${activeTab === 'completed' ? 'hmk_active' : ''}`}
                                onClick={() => handleTabClick('completed')}
                                aria-label="종료 된 챌린지 탭"
                            >
                                종료 된 챌린지
                            </button>
                        </div>
                        <div className="hmk_challenge-list">
                            {activeChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="hmk_challenge-card"
                                    onClick={handleCardClick}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleCardClick();
                                    }}
                                    tabIndex="0"
                                    role="button"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={`/images/${challenge.image}`}
                                        alt={`챌린지 ${challenge.title}`}
                                        className="hmk_challenge-image"
                                    />
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
        </>
    );
};

export default MyPage;