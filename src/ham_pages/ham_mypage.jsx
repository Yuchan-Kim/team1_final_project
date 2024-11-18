// src/ham_pages/ham_mypage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../pages/include/DH_Header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import ChartComponent from './ham_common/ham_ChartComponent';

import '../ham_asset/css/ham_mypage.css';
import profileStore from './ham_common/profileStore'; // profileStore 임포트

const MyPage = () => {
    const navigate = useNavigate();
    const [userNum, setUserNum] = useState(profileStore.getUserNum());
    const [userInfo, setUserInfo] = useState({
        nickname: profileStore.getNickname(),
        region: '',
        profileImage: profileStore.getProfileImage(),
        challengesSummary: profileStore.getChallengesSummary(),
        participationScore: profileStore.getChallengesSummary().participationScore
    });

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

    // profileStore 구독
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setUserNum(updatedProfile.userNum);
            setUserInfo({
                nickname: updatedProfile.nickname,
                region: updatedProfile.region || '',
                profileImage: updatedProfile.profileImage,
                challengesSummary: updatedProfile.challengesSummary,
                participationScore: updatedProfile.challengesSummary.participationScore
            });
            setChallenges({
                ongoing: updatedProfile.challengesDetails.ongoing,
                upcoming: updatedProfile.challengesDetails.upcoming,
                completed: updatedProfile.challengesDetails.completed
            });
        };

        profileStore.subscribe(handleProfileChange);

        // 초기 데이터 설정
        handleProfileChange({
            profileImage: profileStore.getProfileImage(),
            nickname: profileStore.getNickname(),
            userNum: profileStore.getUserNum(),
            challengesSummary: profileStore.getChallengesSummary(),
            challengesDetails: profileStore.getChallengesDetails()
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // 챌린지 상세 데이터는 profileStore를 통해 이미 받아왔으므로 별도 API 호출 제거

    // 차트 데이터 로드
    useEffect(() => {
        if (!userNum) {
            console.log("userNum이 설정되지 않음. 데이터 요청하지 않음.");
            return;
        }

        console.log("MyPage 차트 데이터 로딩 시작, userNum:", userNum);
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
                const response = await axios.get(`${apiUrl}/api/user/${userNum}/charts`);

                if (response.data.result === 'success') {
                    setChartData(response.data.apiData || []);
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
                        <Topbar />
                        <div className="hmk_stat-container">
                            {chartData.map((chart, index) => (
                                <div key={chart.id || index} className="hmk_stat-card" style={{ position: 'relative' }}>
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
                                    key={challenge.id || challenge.roomNum} // 고유한 key 속성 추가
                                    className="hmk_challenge-card"
                                    onClick={handleCardClick}
                                    onKeyDown={(e) => {
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
                                        <div className="hmk_challenge-datebox">
                                            <p className="hmk_challenge-startdate">{challenge.roomStartDate}</p>
                                            <p>~</p>
                                            <p className="hmk_challenge-enddate">{challenge.endDate}</p>
                                        </div>
                                        <p className="hmk_challenge-title">{challenge.roomTitle}</p>
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
