// src/ham_pages/ham_mypage_ranking.jsx
import React, { useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import Header from '../pages/include/DH_Header';
import '../ham_asset/css/ham_mypage_ranking.css';

import Banner from '../ham_asset/images/rank_thumbsup.gif';

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

    useEffect(() => {
        const ctx = document.getElementById('rankChart').getContext('2d');
        const rankChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['완료 미션', '남은 미션'],
                datasets: [{
                    label: 'Mission Completion Rate',
                    data: [75.1, 24.9],
                    backgroundColor: ['#4CAF50', '#e0e0e0'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '75%',
                rotation: -90,
                circumference: 180,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                maintainAspectRatio: false,
            }
        });

        return () => {
            rankChart.destroy();
        };
    }, []);

    return (
        <>
            {/* Header 컴포넌트 */}
            <Header />
            {/* 상단 배너 */}
            <div className="hmk_rank_title_banner">
                <div className="hmk_rank_banner_image">
                    <div className="hmk_rank_page_title">
                        <h2>명예의 전당</h2>
                    </div>
                </div>
            </div>

            <div className="wrap ham_wrap">
                {/* 랭킹 페이지 아웃 프레임 */}
                <div className="hmk_rank_main-out_frame">
                    {/* 랭킹 페이지 메인 콘텐츠 영역 */}
                    <div className="hmk_rank_main-container">

                        <div id="hmk_hall_of_fame">
                            <div className="hmk_rank_main">

                                <div className="hmk_rank_head">
                                    <div className="hmk_rank_head_container">
                                        <div className="hmk_rank_totaluser">
                                            <div className='hmk_rank_icons'>
                                                <img src='' alt='totalusers_icon' className="hmk_rank_totaluserno" />
                                            </div>
                                            <p>Total Users</p>
                                            <p>365명</p>
                                            <p>↑ 8%</p>
                                        </div>
                                        <div className="hmk_rank_totaltask">
                                            <div className='hmk_rank_icons'>
                                                <img src='' alt='totaltasks_icon' className="hmk_rank_totaltaskno" />
                                            </div>
                                            <p>Total Challenge</p>
                                            <p>256 개</p>
                                            <p>↑ 22%</p>
                                        </div>
                                        <div className="hmk_rank_totalpoint">
                                            <div className='hmk_rank_icons'>
                                                <img src='' alt='totalpoints_icon' className="hmk_rank_totalpointno" />
                                            </div>
                                            <p>Total Points</p>
                                            <p>3,595,478 P</p>
                                            <p>↑ 7%</p>
                                        </div>
                                    </div>
                                    <div className='hmk_rank_chart'>
                                        <canvas id="rankChart" width="400" height="200"></canvas>
                                        <div className="hmk_rank_chart_center-text">
                                            75.1%
                                        </div>
                                        <div className="hmk_rank_chart_mission-info">
                                            <div className="hmk_rank_text_left">
                                                <p className="hmk_rank_completed">완료 미션</p>
                                                <p className="hmk_rank_completed_value">2,820개</p>
                                            </div>
                                            <div className="hmk_rank_text_right">
                                                <p className="hmk_rank_total">전체 미션</p>
                                                <p className="hmk_rank_total_value">3,756개</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='hmk_rank_body'>
                                    <div className="hmk_rank_body_left">
                                        <div className="hmk_rank_body_left_top">
                                            <div className="hmk_rank_podium">
                                                {/* 2등 */}
                                                <div key={rankData[1].id} className="hmk_podium_rank hmk_rank2">
                                                    <div className='hmk_podium_profile'>
                                                        <img src={require(`../ham_asset/images/${rankData[1].image}`)} alt="rank2_profile" className='hmk_ranker_profile_no2' />
                                                        <div className="hmk_podium_medal medal_2">🥈</div>
                                                    </div>
                                                    <div className="hmk_podium_base silver">
                                                        <p>{rankData[1].nickname}</p>
                                                        <p>{rankData[1].points.toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                {/* 1등 */}
                                                <div key={rankData[0].id} className="hmk_podium_rank hmk_rank1">
                                                    <div className='hmk_podium_profile hmk_gold'>
                                                        <img src={require(`../ham_asset/images/${rankData[0].image}`)} alt="rank1_profile" className='hmk_ranker_profile_no1' />
                                                        <div className="hmk_podium_medal medal_1">🥇</div>
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
                                                        <div className="hmk_podium_medal medal_3">🥉</div>
                                                    </div>
                                                    <div className="hmk_podium_base bronze">
                                                        <p>{rankData[2].nickname}</p>
                                                        <p>{rankData[2].points.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hmk_rank_body_left_bottom">
                                            {/* 포디엄 하단 효과 꾸미기 */}
                                            <div className="hmk_rank_body_effects">
                                                <img src='' alt='pin-light' className='hmk_rank_body_podium_bottom_dffect' />
                                            </div>
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
            </div>
            {/* 하단 배너 (필요 시 주석 해제하거나 별도 스타일 적용) */}

            <div className="hmk_rank_title_banner">
                <div className="hmk_rank_page_title">
                </div>
            </div>

        </>
    );
};

export default Rank;
