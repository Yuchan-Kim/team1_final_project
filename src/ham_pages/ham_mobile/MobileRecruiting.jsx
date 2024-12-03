import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileBottomMenu from './MobileBottomMenu';

import '../../ham_asset/css/ham_M_recruiting.css';

const MobileRecruiting = () => {
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('recruitingActiveTab') || 'all'
    );
    const [recruitingStats, setRecruitingStats] = useState({
        recruitingNormalRooms: 0,
        recruitingChallengeRooms: 0,
        closingSoonChallengeRooms: 0,
        availableRooms: 0,
    });

    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null);
    const [imgError, setImgError] = useState({});
    const [recruitingChallenges, setRecruitingChallenges] = useState([]);
    const [error, setError] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);

    const getRoomTypes = async (token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Roomtype`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                setRoomTypes(response.data.apiData);
                console.log('%%%룸 타입이 들어있니???;', response.data.apiData)
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('방 타입을 불러오는 중 오류 발생:', error);
            setError("방 타입을 불러오는 데 실패했습니다.");
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('recruitingActiveTab', tab);
        filterChallenges(tab, recruitingChallenges);
    };



    const getRecruitingRooms = async (token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/roomList`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            });
            console.log("룸 리스트에서 가져오는거: ", response.data.apiData);
            if (response.data.result === 'success') {
                return response.data.apiData;

            } else {
                setError(response.data.message);
                return [];
            }

        } catch (error) {
            console.error('방 목록을 불러오는 중 오류 발생:', error);
            setError("방 목록을 불러오는 데 실패했습니다.");
            return [];
        }
    };

    const filterChallenges = (tab, challenges) => {
        if (!challenges) return;

        let filteredChallenges = challenges.filter(challenge => {
            const dDay = calculateDday(challenge.roomStartDate);

            return (
                challenge.roomStatusNum === 2 && // 모집 중인 방
                dDay >= 1 && // 시작일이 지나지 않은 방
                challenge.enteredUserStatusNum !== 1 // 참여하지 않은 방
            );
        });
        console.log("필터챌린지에 뭐가 들었니? : ", filterChallenges)
        console.log("필터챌린지에 뭐가 들었니? : ", filteredChallenges)
        switch (tab) {
            case 'normal':
                filteredChallenges = filteredChallenges.filter(
                    challenge => challenge.roomTypeName === "일반"
                );
                break;
            case 'challenge':
                filteredChallenges = filteredChallenges.filter(
                    challenge => challenge.roomTypeName === "챌린지"
                );
                break;
            case 'closing-soon':
                filteredChallenges = filteredChallenges.filter(challenge => {
                    const dDay = calculateDday(challenge.roomStartDate);
                    return dDay === 1;
                });
                break;
            default:
                break;
        }

        filteredChallenges.sort((a, b) => {
            const dDayA = calculateDday(a.roomStartDate);
            const dDayB = calculateDday(b.roomStartDate);
            return dDayA - dDayB;
        });

        setRecruitingChallenges(filteredChallenges);
    };

    useEffect(() => {
        const initialize = async () => {
            const token = localStorage.getItem('token');
            const authUser = localStorage.getItem('authUser');

            if (!token || !authUser) {
                navigate('/mobile');
                return;
            }

            await getRoomTypes(token);
            const rooms = await getRecruitingRooms(token);
            filterChallenges(activeTab, rooms);
        };

        initialize();
    }, [navigate, activeTab]);

    const handleCardClick = (roomNum) => {
        navigate(`/mobile/mission/${roomNum}`);
    };

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

    const calculateDday = (startDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const timeDiff = start.getTime() - (today.getTime() + 24 * 60 * 60 * 1000);
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    if (error) {
        return <div className="hmk_error-message">{error}</div>;
    }

    return (
        <div className="hmk_mobile_recruiting-wrap">
            <div className="hmk_mobile_recruiting-fixed-top">
                <div className="hmk_mobile_site-header">
                    <div className="hmk_mobile_site-logo">
                        <img src="/img/struggle.gif" alt="Donkey Logo" />
                    </div>
                    <span>Donkey: 동기 키우기</span>
                </div>
                <h1 className="hmk_mobile_page-title">방 참가 하기</h1>
                <div className="hmk_mobile_recruiting-tabs">
                    <div
                        key="tab-all"
                        className={`hmk_mobile_recruiting-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabClick('all')}
                    >
                        전체
                    </div>
                    <div
                        key="tab-normal"
                        className={`hmk_mobile_recruiting-tab ${activeTab === 'normal' ? 'active' : ''}`}
                        onClick={() => handleTabClick('normal')}
                    >
                        일반방
                    </div>
                    <div
                        key="tab-challenge"
                        className={`hmk_mobile_recruiting-tab ${activeTab === 'challenge' ? 'active' : ''}`}
                        onClick={() => handleTabClick('challenge')}
                    >
                        챌린지
                    </div>
                    <div
                        key="tab-closing-soon"
                        className={`hmk_mobile_recruiting-tab ${activeTab === 'closing-soon' ? 'active' : ''}`}
                        onClick={() => handleTabClick('closing-soon')}
                    >
                        마감임박(D-1)
                    </div>
                </div>
            </div>
            <div className="hmk_mobile_recruiting-content">
                <div className="hmk_mobile_recruiting-grid-list">
                    {recruitingChallenges.map((challenge, index) => {
                        // unique key 생성을 위해 index와 roomNum 조합 사용
                        const challengeKey = `challenge-${challenge.roomNum}-${index}`;
                        const dDay = calculateDday(challenge.roomStartDate);
                        return (
                            <div
                                key={challengeKey}
                                className="hmk_challenge-card"
                                onClick={() => handleCardClick(challenge.roomNum)}
                                tabIndex="0"
                                role="button"
                            >
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
                                    <div className="hmk_challenge-badges">
                                        <span className="hmk_challenge-dday">D-{dDay}</span>
                                        <span className="hmk_challenge-participants">
                                            {challenge.roomMinNum}/{challenge.roomMaxNum}
                                        </span>
                                        <div className="hmk_challenge-participants hmk_challenge-part_point">
                                            {challenge.roomPoint}pt
                                        </div>
                                    </div>
                                    <p className="hmk_challenge-title">{challenge.roomTitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <MobileBottomMenu />
        </div>
    );
};

export default MobileRecruiting;