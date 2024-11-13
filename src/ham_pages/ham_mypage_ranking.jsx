// src/ham_pages/ham_mypage.jsx

import React  from 'react';

// Header, Sidebar, Topbar 컴포넌트 import
import Header from '../pages/include/DH_Header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';

//공통 리셋 & 마이페이지 스타일 
import '../ham_asset/css/ham_mypage_ranking.css';

// 차트용 더미 데이터
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

    return (
        <>
            {/* Header 컴포넌트 */}
            <Header />
            <div className="wrap ham_wrap">
                {/* 메인 컨테이너 */}
                <div className="hmk_main-container">
                    {/* Sidebar 컴포넌트 */}
                    <Sidebar />
                    {/* 메인 콘텐츠 영역 */}
                    <div className="hmk_main">
                        {/* Topbar 컴포넌트 */}
                        <Topbar
                            username="씽씽이김유찬"
                            points="3600"
                        />

                        <div className="hmk_rank_main">
                            <div className="hmk_rank_head">
                                <h2>명예의 전당</h2>
                                <div className="hmk_rank_head_container">
                                    <div className="hmk_rank_totaluser">
                                        <img src='' alt='total_users' className="hmk_rank_totaluserno" />
                                        <p>Total Users</p>
                                        <p>365명</p>
                                        <p>↑ 8%</p>
                                    </div>
                                    <div className="hmk_rank_totaltask">
                                        <img src='' alt='total_tasks' className="hmk_rank_totaltaskno" />
                                        <p>Total Challenge</p>
                                        <p>256 개</p>
                                        <p>↑ 22%</p>
                                    </div>
                                    <div className="hmk_rank_totalpoint">
                                        <img src='' alt='total_points' className="hmk_rank_totalpointno" />
                                        <p>Total Points</p>
                                        <p>3,595,478 P</p>
                                        <p>↑ 7%</p>
                                    </div>
                                </div>
                                <div className='hmk_rank_chart'>
                                    <canvas id="rankChart" width="400" height="400"></canvas>
                                    <div className="hmk_rank_chart_center-text">
                                        75.1%
                                    </div>
                                    <p>완료 미션 2,820개</p>
                                    <p>전체 미션 3,756개</p>
                                </div>
                            </div>
                            <div className='hmk_rank_body'>
                                <div className="hmk_rank_podium">
                                    <div className='hmk_podium_profile'>
                                        {rankData.slice(0, 3).map((rank, index) => (
                                            <div key={rank.id} className={`hmk_rank${index + 1}_profile`}>
                                                <img src={require(`../ham_asset/images/${rank.image}`)} alt={`rank${index + 1}_profile`} className={`hmk_ranker_profile_no${index + 1}`} />
                                                <p>{rank.nickname}</p>
                                                <p>{rank.points}</p>
                                            </div>
                                        ))}
                                    </div>
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
                                                    <td>{index + 1}</td>
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

                </div>

            </div>
        </>
    );
};

export default Rank;
