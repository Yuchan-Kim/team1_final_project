import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../pages/include/DH_Header';
import Footer from '../pages/include/JM-Footer';
import '../ham_asset/css/ham_mypage_ranking.css';

// 이미지 상수들
const defaultProfile = '/images/profile-fill.png';
const grl = '/images/rank_girl-runtoleft.gif';
const dog = '/images/rank_dog-runtoleft.gif';
const cat = '/images/rank_cat-runtoleft.gif';
const clap = '/images/rank_clap.gif';
const win = '/images/rank_winner.gif';

// axios 기본 설정
axios.defaults.withCredentials = true; // 쿠키 포함 설정
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
const Rank = () => {
    const [rankData, setRankData] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserNum = localStorage.getItem('userNum');
    const getImageUrl = (imagePath) => {
        if (!imagePath) return defaultProfile;
        return `/images/${imagePath}`;
    };
    useEffect(() => {
        const fetchRankData = async () => {

            try {
                const rankResponse = await axios.get(`${apiUrl}/api/rank/top10`);

                if (rankResponse.data.result === "success") {
                    // apiData에서 데이터 가져오기
                    setRankData(rankResponse.data.apiData); // 여기를 수정
                } else {
                    throw new Error(rankResponse.data.message || "랭킹 데이터를 가져오는데 실패했습니다.");
                }

                if (currentUserNum) {
                    const myRankResponse = await axios.get(`${apiUrl}/api/rank/user/${currentUserNum}`);

                    if (myRankResponse.data.result === "success") {
                        // apiData에서 데이터 가져오기
                        setMyRank(myRankResponse.data.apiData); // 여기를 수정
                    } else {
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("[React] 에러 상세 정보:", {
                    message: err.message,
                    response: err.response,
                    stack: err.stack
                });
                setError(err.message || '랭킹 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchRankData();
    }, [currentUserNum]);

    // 데이터 상태 변경 시 로그
    useEffect(() => {
    }, [rankData]);

    useEffect(() => {
    }, [myRank]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!rankData || !Array.isArray(rankData) || rankData.length === 0)
        return <div>랭킹 정보가 없습니다.</div>;

    return (
        <>
            <Header />
            <div className="hmk_rank_page">
                <div className="hmk_rank_title_banner">
                    <div className="hmk_rank_banner_image"></div>
                    <div className="hmk_rank_moving_text">
                        <span>
                            <img src={clap} alt="clap" className='hmk_rank_banner_icon' />
                            Top3 Ranker
                        </span>
                        <span>
                            <img src={cat} alt="cat" className='hmk_rank_banner_icon' />
                        </span>
                        {rankData.slice(0, 3).map((user, index) => (
                            <span key={user.userNum}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                <img
                                    src={user.profileImage ? getImageUrl(user.profileImage) : defaultProfile}
                                    alt={`rank${index + 1}_profile`}
                                    className='hmk_rank_banner_prof'
                                    onError={(e) => { e.target.src = defaultProfile }}
                                />
                                <p>{user.nickname}</p>
                            </span>
                        ))}
                        <span>
                            <img src={dog} alt="dog" className='hmk_rank_banner_icon' />
                        </span>
                        <span>
                            <img src={grl} alt="girl" className='hmk_rank_banner_icon' />
                        </span>
                    </div>
                </div>

                <div className="wrap ham_wrap">
                    <div className="hmk_rank_main">
                        <div className="hmk_rank_head">
                            <div className="hmk_rank_head_container">
                                <img src={win} className="hmk_ranker_welcome" alt="Hall Of Fame" />
                            </div>
                            <div className='hmk_ranker_podiumframe'>
                                <div className="hmk_rank_podium">
                                    {/* 2등 */}
                                    {rankData[1] && (
                                        <div key={rankData[1].userNum} className="hmk_podium_rank hmk_rank2">
                                            <div className='hmk_podium_profile hmk_silver_frame'>
                                                <img
                                                    src={rankData[1].profileImage ? getImageUrl(rankData[1].profileImage) : defaultProfile}
                                                    alt="rank2_profile"
                                                    className='hmk_ranker_profile_no2'
                                                    onError={(e) => { e.target.src = defaultProfile }}
                                                />
                                                <div className="hmk_podium_medal">🥈</div>
                                            </div>
                                            <div className="hmk_podium_base silver">
                                                <p>{rankData[1].nickname}</p>
                                                <p>{rankData[1].points.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {/* 1등 */}
                                    {rankData[0] && (
                                        <div key={rankData[0].userNum} className="hmk_podium_rank hmk_rank1">
                                            <div className='hmk_podium_profile hmk_gold_frame'>
                                                <img
                                                    src={rankData[0].profileImage ? getImageUrl(rankData[0].profileImage) : defaultProfile}
                                                    alt="rank1_profile"
                                                    className='hmk_ranker_profile_no1'
                                                    onError={(e) => { e.target.src = defaultProfile }}
                                                />
                                                <div className="hmk_podium_medal">🥇</div>
                                            </div>
                                            <div className="hmk_podium_base gold">
                                                <p>{rankData[0].nickname}</p>
                                                <p>{rankData[0].points.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {/* 3등 */}
                                    {rankData[2] && (
                                        <div key={rankData[2].userNum} className="hmk_podium_rank hmk_rank3">
                                            <div className='hmk_podium_profile hmk_bronze_frame'>
                                                <img
                                                    src={rankData[2].profileImage ? getImageUrl(rankData[2].profileImage) : defaultProfile}
                                                    alt="rank3_profile"
                                                    className='hmk_ranker_profile_no3'
                                                    onError={(e) => { e.target.src = defaultProfile }}
                                                />
                                                <div className="hmk_podium_medal">🥉</div>
                                            </div>
                                            <div className="hmk_podium_base bronze">
                                                <p>{rankData[2].nickname}</p>
                                                <p>{rankData[2].points.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='hmk_podium_bottom'></div>
                        </div>
                        <div className='hmk_rank_body'>
                            {/* 내 랭킹 정보 */}
                            {myRank && (
                                <div className='hmk_rank_my'>
                                    <p className='hmk_my_rank_eff'></p>
                                    <table className="hmk_rank_my_rank">
                                        <tbody>
                                            <tr className="hmk_rank_my_rank_number">
                                                <td><p>나</p>{myRank.user_rank}</td>
                                                <td>
                                                    <img
                                                        src={myRank.profileImage ? getImageUrl(myRank.profileImage) : defaultProfile}
                                                        alt="my_profile"
                                                        className="hmk_ranker_profile_no"
                                                        onError={(e) => { e.target.src = defaultProfile }}
                                                    />
                                                </td>
                                                <td className="hmk_rank_my_rank_nickname">{myRank.nickname}</td>
                                                <td className="hmk_rank_my_points">{myRank.points.toLocaleString()} 포인트</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {/* Top 10 랭킹 목록 */}
                            <div className='hmk_rank_top10'>
                                <table className='hmk_rank_list'>
                                    <thead>
                                        <tr>
                                            <th>순위</th>
                                            <th>프로필</th>
                                            <th>닉네임</th>
                                            <th>포인트</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankData.map((rank, index) => (
                                            <tr key={rank.userNum}>
                                                <td>
                                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                                </td>
                                                <td>
                                                    <img
                                                        src={rank.profileImage ? getImageUrl(rank.profileImage) : defaultProfile}
                                                        alt="profile"
                                                        className='hmk_ranker_profile_no'
                                                        onError={(e) => { e.target.src = defaultProfile }}
                                                    />
                                                </td>
                                                <td>{rank.nickname}</td>
                                                <td>{rank.points.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hmk_rank_banner_bottom">
                    <div className="hmk_rank_page_title">
                        <div className="hmk_rank_body_effects"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Rank;