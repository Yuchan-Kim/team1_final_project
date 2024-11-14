// src/ham_pages/ham_mypage_ranking.jsx
import React, { useEffect } from 'react';
import Header from '../pages/include/DH_Header';
import '../ham_asset/css/ham_mypage_ranking.css';

import grl from '../ham_asset/images/rank_girl-runtoleft.gif';
import dog from '../ham_asset/images/rank_dog-runtoleft.gif';
import cat from '../ham_asset/images/rank_cat-runtoleft.gif';
import clap from '../ham_asset/images/rank_clap.gif';
import win from '../ham_asset/images/rank_winner.gif';
const rankData = [
    { id: 1, nickname: '손흥민', points: 155500, image: 'IMG_4879.jpg' },
    { id: 2, nickname: '메시', points: 135500, image: 'IMG_4879.jpg' },
    { id: 3, nickname: '호나우두', points: 125500, image: 'IMG_4879.jpg' },
    { id: 4, nickname: '박찬호', points: 123000, image: 'IMG_4879.jpg' },
    { id: 5, nickname: '박세리', points: 121000, image: 'IMG_4879.jpg' },
    { id: 6, nickname: '김연아', points: 120000, image: 'IMG_4879.jpg' },
    { id: 7, nickname: '이강인', points: 119000, image: 'IMG_4879.jpg' },
    { id: 8, nickname: '손석구', points: 115000, image: 'IMG_4879.jpg' },
    { id: 9, nickname: '강백호', points: 114000, image: 'IMG_4879.jpg' },
    { id: 10, nickname: '손오공', points: 23000, image: 'IMG_4879.jpg' },
];

const Rank = () => {

    const myRank = rankData[9];

    return (
        <>
            {/* Header 컴포넌트 */}
            <Header />
            {/* 상단 배너 */}
            <div className="hmk_rank_page">
                <div className="hmk_rank_title_banner">
                    <div className="hmk_rank_banner_image">
                    </div>
                    <div class="hmk_rank_moving_text">
                        <span><img src={clap} alt="hmk_icon" className='hmk_rank_banner_icon' />Top3 Ranker</span>
                        <span><img src={cat} alt="hmk_icon" className='hmk_rank_banner_icon' /></span>
                        <span>🥇</span><img src={require(`../ham_asset/images/${rankData[0].image}`)} alt="rank1_profile" className='hmk_rank_banner_prof' /> <p>{rankData[0].nickname}</p>
                        <span>🥈</span><img src={require(`../ham_asset/images/${rankData[1].image}`)} alt="rank2_profile" className='hmk_rank_banner_prof' /> <p>{rankData[1].nickname}</p>
                        <span>🥉</span><img src={require(`../ham_asset/images/${rankData[2].image}`)} alt="rank3_profile" className='hmk_rank_banner_prof' /> <p>{rankData[2].nickname}</p>
                        <span><img src={dog} alt="hmk_icon" className='hmk_rank_banner_icon' /></span>
                        <span><img src={grl} alt="hmk_icon" className='hmk_rank_banner_icon' /></span>
                    </div>
                </div>

                <div className="wrap ham_wrap">
                    {/* 랭킹 페이지 아웃 프레임 */}
                    <div className="hmk_rank_main">
                        <div className="hmk_rank_head">
                            <div className="hmk_rank_head_container">
                                <img src={win} className="hmk_ranker_welcome" alt="Hall Of Fame" />
                            </div>
                            <div className="hmk_rank_podium">
                                {/* 2등 */}
                                <div key={rankData[1].id} className="hmk_podium_rank hmk_rank2">
                                    <div className='hmk_podium_profile'>
                                        <img src={require(`../ham_asset/images/${rankData[1].image}`)} alt="rank2_profile" className='hmk_ranker_profile_no2' />
                                        <div className="hmk_podium_medal">🥈</div>
                                    </div>
                                    <div className="hmk_podium_base silver">
                                        <p>{rankData[1].nickname}</p>
                                        <p>{rankData[1].points.toLocaleString()}</p>
                                    </div>
                                </div>
                                {/* 1등 */}
                                <div key={rankData[0].id} className="hmk_podium_rank hmk_rank1">
                                    <div className='hmk_podium_profile'>
                                        <img src={require(`../ham_asset/images/${rankData[0].image}`)} alt="rank1_profile" className='hmk_ranker_profile_no1' />
                                        <div className="hmk_podium_medal">🥇</div>
                                    </div>
                                    <div className="hmk_podium_base gold">
                                        <p>{rankData[0].nickname}</p>
                                        <p>{rankData[0].points.toLocaleString()}</p>
                                    </div>
                                </div>
                                {/* 3등 */}
                                <div key={rankData[2].id} className="hmk_podium_rank hmk_rank3">
                                    <div className='hmk_podium_profile'>
                                        <img src={require(`../ham_asset/images/${rankData[2].image}`)} alt="rank3_profile" className='hmk_ranker_profile_no3' />
                                        <div className="hmk_podium_medal">🥉</div>
                                    </div>
                                    <div className="hmk_podium_base bronze">
                                        <p>{rankData[2].nickname}</p>
                                        <p>{rankData[2].points.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='hmk_podium_bottom'></div>
                        </div>
                        <div className='hmk_rank_body'>
                            <div className='hmk_rank_my'>
                                <p className='hmk_my_rank_eff'></p>
                                <table className="hmk_rank_my_rank">
                                    <tbody>
                                        <tr className="hmk_rank_my_rank_number">
                                            <td><p>나</p>{myRank ? myRank.rank : "N/A"}  </td>
                                            <td>
                                                <img
                                                    src={require(`../ham_asset/images/${myRank.image}`)}
                                                    alt="my_profile"
                                                    className="hmk_ranker_profile_no"
                                                />
                                            </td>
                                            <td className="hmk_rank_my_rank_nickname">
                                                {myRank ? myRank.nickname : "닉네임"}
                                            </td>
                                            <td className="hmk_rank_my_points">
                                                {myRank ? myRank.points.toLocaleString() : "0"} 포인트
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
                                            <tr key={rank.id}>
                                                <td>
                                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                                </td>
                                                <td>
                                                    <img src={require(`../ham_asset/images/${rank.image}`)} alt="profile" className='hmk_ranker_profile_no' />
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
                {/* 하단 배너  */}
                <div className="hmk_rank_banner_bottom">
                    <div className="hmk_rank_page_title">
                        <div className="hmk_rank_body_effects">
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Rank;
