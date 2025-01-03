// src/ham_pages/ham_mobile/ham_M_home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChallengeStatusIndicator from '../ham_ChallengeStatusIndicator';
import profileStore from '../ham_common/profileStore';
import MobileBottomMenu from './MobileBottomMenu';
import '../../ham_asset/css/ham_M_home.css';

const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
};

const MobileDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null); // 각 메뉴 항목의 텍스트 표시 상태를 관리
    // localStorage에서 저장된 탭을 불러오거나, 없으면 'created' 사용
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('dashboardActiveTab') || 'created'
    );
    const [imgError, setImgError] = useState({});
    const [showStartChallengePromptModal, setShowStartChallengePromptModal] = useState(false);
    // 통합된 상태 관리
    const [userInfo, setUserInfo] = useState({
        challengesSummary: {
            ongoing: 0,
            upcoming: 0,
            completed: 0,
            participationScore: 0  // participationScore를 challengesSummary 안으로 이동
        },
        challengesDetails: {
            ongoing: [],
            upcoming: [],
            completed: [],
            created: []
        },
        todayMissionRooms: []
    });
    const calculateDday = (startDate) => {
        const today = new Date();
        const start = new Date(startDate);
        // 시간을 0시 0분 0초로 설정
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        const timeDiff = start.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };


    // profileStore 구독 및 데이터 동기화
    useEffect(() => {
        const initialize = async () => {
            const token = localStorage.getItem('token');
            const authUser = localStorage.getItem('authUser');

            if (!token || !authUser) {
                navigate('/mobile');
                return;
            }

            // 구독 설정
            const handleProfileChange = (updatedProfile) => {
                if (!updatedProfile) return;

                // challengesDetails를 직접 profileStore에서 가져옴
                const details = profileStore.getChallengesDetails();
                const summary = profileStore.getChallengesSummary();

                setUserInfo({
                    challengesSummary: summary,
                    challengesDetails: details,
                    todayMissionRooms: updatedProfile.todayMissionRooms || []
                });
            };

            profileStore.subscribe(handleProfileChange);

            // 초기 데이터 설정
            const details = profileStore.getChallengesDetails();
            const summary = profileStore.getChallengesSummary();

            setUserInfo({
                challengesSummary: summary,
                challengesDetails: details,
                todayMissionRooms: []
            });

            return () => profileStore.unsubscribe(handleProfileChange);
        };

        initialize();
    }, [navigate]);

    // 탭 클릭 핸들러
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('dashboardActiveTab', tab);
    };


    const calculateTimeDifference = (endDate) => {
        if (!endDate) return 0;
        const now = new Date();
        const end = new Date(endDate);
        if (isNaN(end.getTime())) return 0;
        return end - now;
    };

    // Handle card click with modal logic
    const handleCardClick = (challenge) => {
        if (activeTab === 'created' && challenge.roomStatusNum === 2) {
            const timeDiff = calculateTimeDifference(challenge.roomStartDate);
            if (timeDiff <= 0) {
                setShowStartChallengePromptModal(true);
                return;
            }
        }
        navigate(`/mobile/mission/${challenge.roomNum}`);
    };

    // 문서 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleDocumentClick = (e) => {
            if (!e.target.closest('.hmk_mobile_home-bottom-item')) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [activeMenu]);
    const activeChallenges = userInfo.challengesDetails[activeTab] || [];

    useEffect(() => {
        const currentChallenges = userInfo.challengesDetails[activeTab] || [];
        console.log('Current Tab Challenges:', currentChallenges);
    }, [activeTab, userInfo]);

    const sortedChallenges = [...activeChallenges]
        .sort((a, b) => {
            // 오늘의 미션 여부 먼저 확인
            const aTodayMission = profileStore.hasTodayMission(a.roomNum);
            const bTodayMission = profileStore.hasTodayMission(b.roomNum);

            // 오늘의 미션이 있는 항목을 우선 정렬
            if (aTodayMission && !bTodayMission) return -1;
            if (!aTodayMission && bTodayMission) return 1;
            // 각 탭별 정렬 로직
            switch (activeTab) {
                case 'created':  // 내가 방장 탭
                    const getStatusPriority = (status) => {
                        switch (status) {
                            case 4: return 4; // 종료
                            case 3: return 3; // 진행중
                            case 2: return 2; // 모집중
                            case 1: return 1; // 모집전
                            default: return 5;
                        }
                    };

                    const statusDiff = getStatusPriority(a.roomStatusNum) - getStatusPriority(b.roomStatusNum);
                    if (statusDiff !== 0) return statusDiff;

                    // 같은 상태 내에서는 시작 날짜가 가까운 순
                    if (a.roomStatusNum === 1 || a.roomStatusNum === 2) {
                        const dDayA = calculateDday(a.roomStartDate);
                        const dDayB = calculateDday(b.roomStartDate);
                        return dDayA - dDayB;
                    }
                    return 0;

                case 'upcoming':  // 시작 전 탭
                    return calculateDday(a.roomStartDate) - calculateDday(b.roomStartDate);

                case 'ongoing':  // 진행중 탭
                    // 진행 기간이 얼마 안 남은 순서대로
                    return calculateDday(a.endDate) - calculateDday(b.endDate);

                case 'completed':  // 종료 탭
                    // 최근에 종료된 순서대로
                    return new Date(b.endDate) - new Date(a.endDate);

                default:
                    return 0;
            }
        });

    return (
        <div className="hmk_mobile_home-wrap">
            <div className="hmk_mobile_home-fixed-top">
                <div className="hmk_mobile_site-header">Donkey: 동기 키우기</div>
                <h1 className="hmk_mobile_page-title">나의 DONKEY</h1>
                {/* 상단 통계 카드 */}
                <div className="hmk_mobile_home-card">
                    <div className="hmk_mobile_home-stats">
                        <div className="hmk_mobile_home-stat">
                            <div className="hmk_mobile_home-stat-title">진행 중</div>
                            <div className="hmk_mobile_home-stat-value">
                                {userInfo.challengesSummary.ongoing}
                            </div>
                        </div>
                        <div className="hmk_mobile_home-stat">
                            <div className="hmk_mobile_home-stat-title">시작 예정</div>
                            <div className="hmk_mobile_home-stat-value">
                                {userInfo.challengesSummary.upcoming}
                            </div>
                        </div>
                        <div className="hmk_mobile_home-stat">
                            <div className="hmk_mobile_home-stat-title">완료</div>
                            <div className="hmk_mobile_home-stat-value">
                                {userInfo.challengesSummary.completed}
                            </div>
                        </div>
                        <div className="hmk_mobile_home-stat">
                            <div className="hmk_mobile_home-stat-title">종합 달성률(평점)</div>
                            <div className="hmk_mobile_home-stat-value">
                                {userInfo.challengesSummary.participationScore > 0 ?
                                    `${userInfo.challengesSummary.participationScore}점` :
                                    <span className="hmk_small-text">달성한 미션이 없습니다.</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>


                {/* 중간 그리드 섹션 */}
                <div className="hmk_mobile_home-grid">
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'created' ? 'hmk_active' : ''}`}
                        onClick={() => handleTabChange('created')}
                        aria-label="내가 만든 방 탭"
                    >
                        내가 방장
                    </button>
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'ongoing' ? 'hmk_active' : ''}`}
                        onClick={() => handleTabChange('ongoing')}
                        aria-label="진행중인 챌린지 탭"
                    >
                        진행중
                    </button>
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'upcoming' ? 'hmk_active' : ''}`}
                        onClick={() => handleTabChange('upcoming')}
                        aria-label="시작 전 챌린지 탭"
                    >
                        시작 전
                    </button>
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'completed' ? 'hmk_active' : ''}`}
                        onClick={() => handleTabChange('completed')}
                        aria-label="종료 된 챌린지 탭"
                    >
                        종료
                    </button>
                </div>
            </div>
            <div className="hmk_mobile_home-content">
                {/* 챌린지 리스트 */}
                <div className="hmk_mobile_home-grid-list">
                    {sortedChallenges.map((challenge) => {
                        const challengeKey = `challenge-${challenge.roomNum || challenge.id}`;
                        const hasTodayMission = profileStore.hasTodayMission(challenge.roomNum);

                        return (
                            <div
                                key={challengeKey}
                                className={`hmk_challenge-card ${(activeTab === 'completed' ||
                                    (activeTab === 'created' && challenge.roomStatusNum === 4))
                                    ? 'completed'
                                    : ''
                                    } ${hasTodayMission ? 'hmk_today-mission' : ''}`}
                                onClick={() => handleCardClick(challenge)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCardClick(challenge.roomNum);
                                }}
                                tabIndex="0"
                                role="button"
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                {/* 모든 탭에서 상태 배지 표시 */}
                                <ChallengeStatusIndicator
                                    startDate={challenge.roomStartDate}
                                    endDate={challenge.endDate}
                                    roomStatusNum={
                                        activeTab === 'ongoing' ? 3 :
                                            activeTab === 'upcoming' ? 2 :
                                                activeTab === 'created' ? challenge.roomStatusNum || 1 :
                                                    activeTab === 'completed' ? 4 :
                                                        0
                                    }
                                />

                                {/* 오늘의 미션 표시 */}
                                {hasTodayMission && (
                                    <div className="hmk_today-mission-label">
                                        미션 제출일
                                    </div>
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
            <Modal
                isOpen={showStartChallengePromptModal}
                onRequestClose={() => setShowStartChallengePromptModal(false)}
                style={customModalStyles}
                contentLabel="웹 페이지 안내 모달"
                ariaHideApp={false}
            >
                <div className="yc-modal-header">
                    <p>모바일에서는 챌린지 시작이 제한됩니다. 웹페이지로 확인해주세요.</p>
                    <div className="yc-modal-buttons-header">
                        <button
                            className="yc-modal-confirm-header"
                            onClick={() => setShowStartChallengePromptModal(false)}
                        >
                            확인
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 하단 메뉴 섹션 */}
            <MobileBottomMenu />
        </div>
    );
}
export default MobileDashboard;
