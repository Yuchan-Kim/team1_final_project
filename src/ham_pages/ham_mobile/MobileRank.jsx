import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MobileBottomMenu from './MobileBottomMenu';
import YCProfileInfo from "../../yc_pages/YC_profile_info";
import profileStore from '../ham_common/profileStore';

import '../../ham_asset/css/ham_M_rank.css';
const defaultProfile = '/upload/profile-fill.png';
const grl = '/upload/rank_girl-runtoleft.gif';
const dog = '/upload/rank_dog-runtoleft.gif';
const cat = '/upload/rank_cat-runtoleft.gif';
const clap = '/upload/rank_clap.gif';
const win = '/upload/rank_winner.gif';

const MobileRank = () => {
    const navigate = useNavigate();
    const [rankData, setRankData] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [profileUser, setProfileUser] = useState(null);

    const currentUserNum = localStorage.getItem('userNum');

    const getImageUrl = (imagePath) => {
        if (!imagePath) return defaultProfile;

        // 이미 완전한 URL인 경우
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://13.125.216.39:9000';

        // /upload로 시작하는 경우
        if (imagePath.startsWith('/upload/')) {
            return `${apiUrl}${imagePath}`;
        }

        // 단순 파일명이거나 /로 시작하는 경우
        return `${apiUrl}/upload/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
    };

    const openProfile = async (userNum) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rates/profile/${userNum}`);
            if (response.data.result === 'success') {
                setProfileUser(response.data.apiData);
                setProfileOpen(true);
            }
        } catch (error) {
            console.error('프로필 로드 실패:', error);
        }
    };

    const closeProfile = () => {
        setProfileOpen(false);
        setProfileUser(null);
    };

    useEffect(() => {
        const fetchRankData = async () => {
            if (!currentUserNum) {
                navigate('/mobile');
                return;
            }

            try {
                const [rankResponse, myRankResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/rank/top10`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/rank/user/${currentUserNum}`)
                ]);

                if (rankResponse.data.result === 'success') {
                    setRankData(rankResponse.data.apiData);
                }
                if (myRankResponse.data.result === 'success') {
                    setMyRank(myRankResponse.data.apiData);
                }
            } catch (error) {
                console.error('랭킹 데이터 로드 실패:', error);
                setError('랭킹 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRankData();
    }, [currentUserNum, navigate]);

    if (loading) return <div className="hmk_mobile_home-wrap">로딩중...</div>;
    if (error) return <div className="hmk_mobile_home-wrap">{error}</div>;

    return (
        <div className="hmk_mobile_home-wrap">
            <div className="hmk_mobile_home-fixed-top">
            <div className="hmk_mobile_site-header">Donkey: 동기 키우기</div>
                <h1 className="hmk_mobile_page-title">명예의 전당</h1>
                {/* 상단 통계 카드 */}
                {/* 움직이는 배너 */}
                <div className="hmk_mobile_rank_moving_banner">
                    <div className="hmk_mobile_home-card_in_banner">
                        <div className="hmk_mobile_rank_moving_text">
                            <div className="hmk_mobile_rank_moving_content">
                                <span>
                                    <img src={clap} alt="clap" className="hmk_mobile_home-icon" />
                                    Top3 Ranker
                                </span>
                                {rankData.slice(0, 3).map((user, index) => (
                                    <span key={user.userNum}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                        <img
                                            src={getImageUrl(user.profileImage)}
                                            alt={`rank${index + 1}`}
                                            className="hmk_mobile_home-icon"
                                            onError={(e) => { e.target.src = defaultProfile }}
                                        />
                                        {user.nickname}
                                    </span>
                                ))}
                                <span>
                                    <img src={dog} alt="dog" className="hmk_mobile_home-icon" />
                                </span>
                                {/* 무한 스크롤을 위해 동일한 내용 반복 */}
                                <span>
                                    <img src={clap} alt="clap" className="hmk_mobile_home-icon" />
                                    Top3 Ranker
                                </span>
                                {rankData.slice(0, 3).map((user, index) => (
                                    <span key={`repeat-${user.userNum}`}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                        <img
                                            src={getImageUrl(user.profileImage)}
                                            alt={`rank${index + 1}`}
                                            className="hmk_mobile_home-icon"
                                            onError={(e) => { e.target.src = defaultProfile }}
                                        />
                                        {user.nickname}
                                    </span>
                                ))}
                                <span>
                                    <img src={dog} alt="dog" className="hmk_mobile_home-icon" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 내 랭킹 카드 */}
                {myRank && (
                    <div className="hmk_mobile_home-card">
                        <div className="hmk_mobile_home-stats">
                            <div className="hmk_mobile_home-stat">
                                <div className="hmk_mobile_home-stat-title">내 순위</div>
                                <div className="hmk_mobile_home-stat-value">{myRank.user_rank}위</div>
                            </div>
                            <div className="hmk_mobile_home-stat">
                                <div className="hmk_mobile_home-stat-title">포인트</div>
                                <div className="hmk_mobile_home-stat-value">{myRank.points.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 랭킹 리스트 */}
            <div className="hmk_mobile_home-content">
                <div className="hmk_mobile_home-card">
                    {rankData.map((rank, index) => (
                        <div
                            key={rank.userNum}
                            className="hmk_mobile_rank-item"
                            onClick={() => openProfile(rank.userNum)}
                        >
                            <div className="hmk_mobile_rank-position">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                            </div>
                            <div className="hmk_mobile_rank-profile">
                                <img
                                    src={getImageUrl(rank.profileImage)}
                                    alt={rank.nickname}
                                    onError={(e) => { e.target.src = defaultProfile }}
                                />
                            </div>
                            <div className="hmk_mobile_rank-info">
                                <div className="hmk_mobile_rank-name">{rank.nickname}</div>
                                <div className="hmk_mobile_rank-points">{rank.points.toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 프로필 모달 */}
            <YCProfileInfo
                isOpen={isProfileOpen}
                onClose={closeProfile}
                user={profileUser}
            />

            <MobileBottomMenu />
        </div>
    );
};

export default MobileRank;