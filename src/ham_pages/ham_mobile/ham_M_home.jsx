// src/components/DashboardPrototype.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChallengeStatusIndicator from '../ham_ChallengeStatusIndicator';
import profileStore from '../ham_common/profileStore';
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

    // profileStore 구독 및 데이터 동기화
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            const safeProfile = {
                challengesSummary: updatedProfile?.challengesSummary || {
                    ongoing: 0,
                    upcoming: 0,
                    completed: 0,
                    participationScore: 0
                },
                challengesDetails: updatedProfile?.challengesDetails || {
                    ongoing: [],
                    upcoming: [],
                    completed: [],
                    created: []
                }
            };
            setUserInfo(safeProfile);
        };
        // 초기 데이터 설정
        const initialData = {
            challengesSummary: profileStore.getChallengesSummary() || {
                ongoing: 0,
                upcoming: 0,
                completed: 0,
                participationScore: 0
            },
            challengesDetails: profileStore.getChallengesDetails() || {
                ongoing: [],
                upcoming: [],
                completed: [],
                created: []
            }
        };

        // 여기서 initialData를 사용하여 초기 상태 설정
        handleProfileChange(initialData);

        // profileStore 구독
        profileStore.subscribe(handleProfileChange);

        return () => profileStore.unsubscribe(handleProfileChange);
    }, []);
    // 탭 클릭 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // 챌린지 카드 클릭 핸들러
    const handleCardClick = (roomNum) => {
        navigate(`/cmain/${roomNum}`);
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


    return (
        <div className="hmk_mobile_home-wrap">
            <div className="hmk_mobile_home-fixed-top">
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
                                {userInfo.participationScore > 0 ?
                                    `${userInfo.participationScore}점` :
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
                    {activeChallenges.map((challenge) => {
                        const challengeKey = `challenge-${challenge.roomNum || challenge.id}`;
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
            <div className="hmk_mobile_home-bottom">
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('challenge')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('challenge')}
                >
                    <img
                        className="hmk_mobile_home-icon"
                        src="/images/challenge.png"
                        alt="챌린지 요약정보 아이콘"
                    />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'challenge' ? 'visible' : 'hidden'}`}>
                        챌린지
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('inventory')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('inventory')}
                >
                    <img
                        className="hmk_mobile_home-icon"
                        src="/images/inventory.png"
                        alt="보관함 아이콘"
                    />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'inventory' ? 'visible' : 'hidden'}`}>
                        보관함
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('points')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('points')}
                >
                    <img
                        className="hmk_mobile_home-icon"
                        src="/images/points.png"
                        alt="포인트 내역 아이콘"
                    />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'points' ? 'visible' : 'hidden'}`}>
                        포인트
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('rank')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('rank')}
                >
                    <img
                        className="hmk_mobile_home-icon"
                        src="/images/rank_spincup.gif"
                        alt="랭킹페이지 아이콘"
                    />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'rank' ? 'visible' : 'hidden'}`}>
                        랭킹
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('profile')}
                >
                    <img
                        className="hmk_mobile_home-icon"
                        src="/images/profile-fill.png"
                        alt="프로필 카드 아이콘"
                    />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'profile' ? 'visible' : 'hidden'}`}>
                        프로필
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MobileDashboard;
