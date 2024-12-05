import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../pages/include/DH_Header';
import Footer from '../pages/include/JM-Footer';
import '../ham_asset/css/ham_mypage_ranking.css';
import YCProfileInfo from "../yc_pages/YC_profile_info.jsx";

const defaultProfile = '/upload/profile-fill.png';

const Rank = () => {
    const [rankData, setRankData] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
    const currentUserNum = localStorage.getItem('userNum');

    const getImageUrl = (imagePath) => {
        if (!imagePath) return defaultProfile;
        if (imagePath.startsWith('http')) return imagePath;
        return `${apiUrl}${imagePath}`;
    };

    useEffect(() => {
        const fetchRankData = async () => {
            try {
                const rankResponse = await axios.get(`${apiUrl}/api/rank/top10`);
                if (rankResponse.data.result === 'success') {
                    setRankData(rankResponse.data.apiData);
                } else {
                    throw new Error("랭킹 데이터를 불러오지 못했습니다.");
                }

                if (currentUserNum) {
                    const myRankResponse = await axios.get(`${apiUrl}/api/rank/user/${currentUserNum}`);
                    if (myRankResponse.data.result === 'success') {
                        setMyRank(myRankResponse.data.apiData);
                    }
                }

                setLoading(false);
            } catch (err) {
                setError("데이터를 불러오지 못했습니다.");
                setLoading(false);
            }
        };

        fetchRankData();
    }, [apiUrl, currentUserNum]);

    const openProfile = async (userNum) => {
        try {
            const response = await axios.get(`${apiUrl}/api/rates/profile/${userNum}`);
            if (response.data.result === 'success') {
                setProfileUser(response.data.apiData);
                setProfileOpen(true);
            }
        } catch {
            alert("프로필 정보를 불러올 수 없습니다.");
        }
    };

    const closeProfile = () => {
        setProfileOpen(false);
        setProfileUser(null);
    };

    if (loading) return <div className="hmk_loading">Loading...</div>;
    if (error) return <div className="hmk_error">{error}</div>;

    return (
        <>
            <Header />
            <div className="hmk_rank_page">
                {/* 명예의 전당 배너 */}
                <div className="hmk_rank_hall_of_fame">
                    <h1 className="hmk_hall_of_fame_title">🏆 Hall of Fame 🏆</h1>
                    <div className="hmk_rank_top3">
                        {rankData.slice(0, 3).map((user, index) => (
                            <div key={user.userNum} className={`hmk_ranker_card rank-${index + 1}`}>
                                <div className="hmk_ranker_image_wrapper">
                                    <img 
                                        src={getImageUrl(user.profileImage)} 
                                        alt={`rank_${index + 1}`} 
                                        className="hmk_ranker_image"
                                    />
                                    <div className="hmk_ranker_glow"></div>
                                    <div className="hmk_ranker_badge">{['🥇', '🥈', '🥉'][index]}</div>
                                </div>
                                <p className="hmk_ranker_name">{user.nickname}</p>
                                <p className="hmk_ranker_points">{user.points.toLocaleString()} pts</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 내 랭킹 */}
                {myRank && (
                    <div className="hmk_my_rank">
                        <h2 className="hmk_my_rank_title">My Rank</h2>
                        <div className="hmk_my_rank_card">
                            <img 
                                src={getImageUrl(myRank.profileImage)} 
                                alt="내 프로필" 
                                className="hmk_my_rank_image"
                            />
                            <div className="hmk_my_rank_info">
                                <p className="hmk_my_rank_name">{myRank.nickname}</p>
                                <p className="hmk_my_rank_position">Rank: {myRank.user_rank}</p>
                                <p className="hmk_my_rank_points">{myRank.points.toLocaleString()} pts</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top 10 랭킹 테이블 */}
                <div className="hmk_rank_list_container">
                    <h2 className="hmk_rank_list_title">Top 10 Rankings</h2>
                    <table className="hmk_rank_table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankData.map((user, index) => (
                                <tr key={user.userNum} className={`hmk_rank_row ${index < 3 ? `rank-${index + 1}` : ''}`}>
                                    <td>{['🥇', '🥈', '🥉'][index] || index + 1}</td>
                                    <td className="hmk_rank_player" onClick={() => openProfile(user.userNum)}>
                                        <img 
                                            src={getImageUrl(user.profileImage)} 
                                            alt="프로필 이미지" 
                                            className="hmk_rank_player_image"
                                        />
                                        {user.nickname}
                                    </td>
                                    <td>{user.points.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <YCProfileInfo isOpen={isProfileOpen} onClose={closeProfile} user={profileUser} />
            <Footer />
        </>
    );

};

export default Rank;
