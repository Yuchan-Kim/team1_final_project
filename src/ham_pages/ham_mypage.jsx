// src/ham_pages/ham_mypage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../pages/include/DH_Header';
import Footer from '../pages/include/JM-Footer';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import ChartComponent from './ham_common/ham_ChartComponent';
import ChallengeStatusIndicator from './ham_ChallengeStatusIndicator';

import '../ham_asset/css/ham_mypage.css';
import '../ham_asset/css/ham_ChallengeStatusIndicator.css';

import profileStore from './ham_common/profileStore'; // profileStore 임포트

const MyPage = () => {
    const [imgError, setImgError] = useState({}); // 이미지 에러 상태 추가
    const navigate = useNavigate();
    const [userNum, setUserNum] = useState(profileStore.getUserNum());
    // 상태 관리
    const [performanceCharts, setPerformanceCharts] = useState([]);
    const [achievementCharts, setAchievementCharts] = useState([]);
    const [challenges, setChallenges] = useState({
        ongoing: [],
        upcoming: [],
        completed: [],
        created: []
    });
    const [activeTab, setActiveTab] = useState('created');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // profileStore 구독
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setUserNum(updatedProfile.userNum);
            setChallenges({
                ongoing: updatedProfile.challengesDetails.ongoing,
                upcoming: updatedProfile.challengesDetails.upcoming,
                completed: updatedProfile.challengesDetails.completed,
                created: updatedProfile.challengesDetails.created
            });
        };
        profileStore.subscribe(handleProfileChange);

        // 초기 데이터 설정
        handleProfileChange({
            userNum: profileStore.getUserNum(),
            challengesSummary: profileStore.getChallengesSummary(),
            challengesDetails: profileStore.getChallengesDetails()
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // 차트 데이터 로드
    useEffect(() => {
        if (!userNum) {
            //("userNum이 설정되지 않음. 데이터 요청하지 않음.");
            return;
        }
        // console.log("MyPage 차트 데이터 로딩 시작, userNum:", userNum);
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
                const response = await axios.get(`${apiUrl}/api/my/${userNum}/charts`);

                if (response.data.result === 'success') {
                    const apiData = response.data.apiData || {};
                    // performance와 achievement로 분리하여 상태 업데이트
                    const performance = apiData.performance ? Object.values(apiData.performance) : [];
                    const achievement = apiData.achievement ? Object.values(apiData.achievement) : [];

                    // 원하는 차트 순서 정의
                    const performanceOrder = [
                        '일반방 미션 수행률',
                        '챌린지방 미션 수행률',
                        '전체 미션 수행률'
                    ];
                    const achievementOrder = [
                        '일반방 미션 달성률',
                        '챌린지방 미션 달성률',
                        '전체 미션 달성률'
                    ];
                    // 성과 차트 정렬
                    performance.sort((a, b) => performanceOrder.indexOf(a.chartTitle) - performanceOrder.indexOf(b.chartTitle));
                    // 달성 차트 정렬
                    achievement.sort((a, b) => achievementOrder.indexOf(a.chartTitle) - achievementOrder.indexOf(b.chartTitle));
                    // Performance 차트에 zeroColor 추가 (연한 파란색 회색)
                    const formattedPerformance = performance.map(chart => ({
                        chartTitle: chart.chartTitle,
                        ratioDisplay: chart.ratioDisplay,
                        percentage: chart.percentage,
                        attendedCount: chart.attendedCount,
                        totalCount: chart.totalCount,
                        displayValue: chart.displayValue || '0.0%',
                        color: '#3a7afe', // 일반방 파란색
                        zeroColor: '#b4b4b4' // 연한 파란색 회색
                    }));
                    // Achievement 차트에 zeroColor 추가 (연한 붉은색 회색)
                    const formattedAchievement = achievement.map(chart => ({
                        chartTitle: chart.chartTitle,
                        ratioDisplay: chart.ratioDisplay,
                        percentage: chart.percentage,
                        attendedCount: chart.attendedCount,
                        totalCount: chart.totalCount,
                        displayValue: chart.displayValue || '0.0%',
                        color: '#FF5722', // 챌린지방 붉은색
                        zeroColor: '#e5e5e5' // 연한 붉은색 회색
                    }));
                    setPerformanceCharts(formattedPerformance);
                    setAchievementCharts(formattedAchievement);
                } else {
                    setError("차트 데이터를 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("차트 데이터를 불러오는 중 오류 발생:", err);
                setError(err.response?.data?.message || "차트 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchChartData();
    }, [userNum]);
    // 탭 클릭 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    // 챌린지 카드 클릭 핸들러
    const handleCardClick = (roomNum) => {
        navigate(`/cmain/${roomNum}`);
    };
    if (loading) {
        return <div>데이터를 불러오는 중...</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // D-day 계산 함수
    const calculateDday = (startDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const timeDiff = start.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    // activeChallenges 정렬 로직 수정
    const activeChallenges = challenges[activeTab] ? [...challenges[activeTab]].sort((a, b) => {
        if (activeTab === 'created') {
            const dDayA = calculateDday(a.roomStartDate);
            const dDayB = calculateDday(b.roomStartDate);
            return dDayA - dDayB; // D-day가 가까운 순으로 정렬
        }
        return 0; // 다른 탭은 정렬하지 않음
    }) : [];

    return (
        <>
            <Header />
            <div className="wrap ham_wrap">
                <div className="hmk_main-container">
                    <Sidebar />
                    <div className="hmk_main">
                        <Topbar />
                        <div className="hmk_stat-container">
                            {/* Performance 차트 렌더링 */}
                            {performanceCharts.map((chart, index) => {
                                // ChartComponent에 전달할 데이터 구성
                                const formattedChart = {
                                    attendedCount: chart.attendedCount,
                                    totalCount: chart.totalCount,
                                    displayValue: chart.displayValue, // 중앙에 표시할 값
                                    color: chart.color, // 일반방 파란색
                                    zeroColor: chart.zeroColor // 연한 파란색 회색
                                };
                                return (
                                    <div key={`performance-${index}`} className="hmk_stat-card" style={{ position: 'relative' }}>
                                        <div className="hmk_chart">
                                            {/* ChartComponent에 변환된 데이터 전달 */}
                                            <ChartComponent chart={formattedChart} />
                                        </div>
                                        <div className="hmk_stat-info">
                                            <p className="hmk_stat-title">{chart.chartTitle}</p>
                                            <p className="hmk_stat-data">{chart.ratioDisplay} ({chart.percentage}%)</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Achievement 차트 렌더링 */}
                            {achievementCharts.map((chart, index) => {
                                // ChartComponent에 전달할 데이터 구성
                                const formattedChart = {
                                    attendedCount: chart.attendedCount,
                                    totalCount: chart.totalCount,
                                    displayValue: chart.displayValue, // 중앙에 표시할 값
                                    color: '#FF5722' // 다른 색상 설정
                                };
                                return (
                                    <div key={`achievement-${index}`} className="hmk_stat-card" style={{ position: 'relative' }}>
                                        <div className="hmk_chart">
                                            {/* ChartComponent에 변환된 데이터 전달 */}
                                            <ChartComponent chart={formattedChart} />
                                        </div>
                                        <div className="hmk_stat-info">
                                            <p className="hmk_stat-title">{chart.chartTitle}</p>
                                            <p className="hmk_stat-data">{chart.ratioDisplay} ({chart.percentage}%)</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="hmk_tab-menu">
                            <button
                                className={`hmk_tab-button ${activeTab === 'created' ? 'hmk_active' : ''}`}
                                onClick={() => handleTabClick('created')}
                                aria-label="내가 만든 방 탭"
                            >
                                내가 만든 방
                            </button>
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
                            {activeChallenges.map((challenge) => {
                                const challengeKey = `challenge-${challenge.roomNum || challenge.id}`;
                                // 데이터 확인을 위한 콘솔 로그
                                console.log("Challenge data:", {
                                    roomNum: challenge.roomNum,
                                    roomStatusNum: challenge.roomStatusNum,
                                    status: challenge.roomStatusName
                                });
                                return (
                                    <div
                                        key={challengeKey}
                                        className="hmk_challenge-card"
                                        onClick={() => handleCardClick(challenge.roomNum)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCardClick(challenge.roomNum);
                                        }}
                                        tabIndex="0"
                                        role="button"
                                        style={{ cursor: 'pointer', position: 'relative' }}
                                    >
                                        {activeTab === 'created' && (
                                            <ChallengeStatusIndicator
                                                startDate={challenge.roomStartDate}
                                                endDate={challenge.endDate}
                                                roomStatusNum={challenge.roomStatusNum}
                                            />
                                        )}
                                        <img
                                            src={imgError[challengeKey]
                                                ? '/images/challenge1.png'
                                                : `${process.env.REACT_APP_API_URL}/upload/${challenge.roomThumbNail}`
                                            }
                                            alt={`챌린지 ${challenge.roomTitle}`}
                                            className="hmk_challenge-image"
                                            onError={(e) => {
                                                if (!imgError[challengeKey]) {
                                                    setImgError(prev => ({
                                                        ...prev,
                                                        [challengeKey]: true
                                                    }));
                                                    e.target.src = '/images/challenge1.png';
                                                }
                                            }}
                                        />
                                        <div className="hmk_challenge-details">
                                            <div className="hmk_challenge-datebox">
                                                <p className="hmk_challenge-startdate">{challenge.roomStartDate}</p>
                                                <p>~</p>
                                                <p className="hmk_challenge-enddate">{challenge.endDate}</p>
                                            </div>
                                            <p className="hmk_challenge-title">{challenge.roomTitle}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyPage;
