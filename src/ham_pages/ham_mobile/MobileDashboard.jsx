// src/ham_pages/ham_mobile/ham_M_home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChallengeStatusIndicator from '../ham_ChallengeStatusIndicator';
import profileStore from '../ham_common/profileStore';
import MobileBottomMenu from './MobileBottomMenu';
import '../../ham_asset/css/ham_M_home.css';

const MobileDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null); // 각 메뉴 항목의 텍스트 표시 상태를 관리
    const [activeTab, setActiveTab] = useState('created'); // 챌린지 탭 관련 상태와 핸들러 추가
    const [imgError, setImgError] = useState({});
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
        }
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
                console.log('Updated Profile:', updatedProfile);
                if (!updatedProfile) return;

                // challengesDetails를 직접 profileStore에서 가져옴
                const details = profileStore.getChallengesDetails();
                const summary = profileStore.getChallengesSummary();

                setUserInfo({
                    challengesSummary: summary,
                    challengesDetails: details
                });
            };

            profileStore.subscribe(handleProfileChange);

            // 초기 데이터 설정
            const details = profileStore.getChallengesDetails();
            const summary = profileStore.getChallengesSummary();

            setUserInfo({
                challengesSummary: summary,
                challengesDetails: details
            });

            return () => profileStore.unsubscribe(handleProfileChange);
        };

        initialize();
    }, [navigate]);

    // 탭 클릭 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // 챌린지 카드 클릭 핸들러
    const handleCardClick = (roomNum) => {
        navigate(`/mobile/mission/${roomNum}`);
    };

    const handleMouseEnter = (menu) => {
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    const handleTouch = (menu) => {
        // 터치 시 해당 메뉴의 텍스트를 토글
        setActiveMenu(activeMenu === menu ? null : menu);
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
        console.log('Active Tab:', activeTab);
        console.log('Challenges Details:', userInfo.challengesDetails);
        const currentChallenges = userInfo.challengesDetails[activeTab] || [];
        console.log('Current Tab Challenges:', currentChallenges);
    }, [activeTab, userInfo]);
    const sortedChallenges = [...activeChallenges]
        .filter(challenge => {
            if (activeTab === 'upcoming' || activeTab === 'created') {
                // 시작 전 탭과 내가 방장 탭에서는 roomStatusNum이 2(모집 중)인 방만 표시
                return challenge.roomStatusNum === 2;
            }
            return true; // 다른 탭은 모든 방 표시
        })
        .sort((a, b) => {
            if (activeTab === 'created') {
                const dDayA = calculateDday(a.roomStartDate);
                const dDayB = calculateDday(b.roomStartDate);
                return dDayA - dDayB; // D-day가 가까운 순으로 정렬
            }
            return 0; // 다른 탭은 정렬하지 않음
        });

    return (
        <div className="hmk_mobile_home-wrap">
            <div className="hmk_mobile_home-fixed-top">
                <div className="hmk_mobile_site-header">Donkey: 동기 키우기</div>
                <h1 className="hmk_mobile_page-title">나의 DONKEY</h1>
                {/* 상단 통계 카드 */}
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
                        onClick={() => handleTabClick('created')}
                        aria-label="내가 만든 방 탭"
                    >
                        내가 방장
                    </button>
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'ongoing' ? 'hmk_active' : ''}`}
                        onClick={() => handleTabClick('ongoing')}
                        aria-label="진행중인 챌린지 탭"
                    >
                        진행중
                    </button>
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'upcoming' ? 'hmk_active' : ''}`}
                        onClick={() => handleTabClick('upcoming')}
                        aria-label="시작 전 챌린지 탭"
                    >
                        시작 전
                    </button>
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'completed' ? 'hmk_active' : ''}`}
                        onClick={() => handleTabClick('completed')}
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
                        return (
                            <div
                                key={challengeKey}
                                className={`hmk_challenge-card ${(activeTab === 'completed' ||
                                    (activeTab === 'created' && challenge.roomStatusNum === 4)) ? 'completed' : ''
                                    }`}
                                onClick={() => handleCardClick(challenge.roomNum)}
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
                                        activeTab === 'ongoing' ? 3 : // 진행 중
                                            activeTab === 'upcoming' ? 2 : // 모집 중
                                                activeTab === 'created' ? challenge.roomStatusNum || 1 : // 생성된 방은 실제 상태값 사용
                                                    activeTab === 'completed' ? 4 : // 종료
                                                        0 // 기본값
                                    }
                                />
                                <img
                                    src={imgError[challengeKey]
                                        ? '/images/challenge1.png'
                                        : `${process.env.REACT_APP_API_URL}${challenge.roomThumbNail}`
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
            {/* 하단 메뉴 섹션 */}
            <MobileBottomMenu />
        </div>
    );
}
export default MobileDashboard;
