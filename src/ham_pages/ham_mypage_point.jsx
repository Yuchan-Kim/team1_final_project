// src/ham_pages/ham_mypage_point.jsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // 날짜 선택기 import
import 'react-datepicker/dist/react-datepicker.css';

// Header, Sidebar, Topbar 컴포넌트 import
import Header from './ham_common/ham_header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';

//공통 리셋 & 포인트 페이지 스타일 
import '../ham_asset/css/ham_mypage_point.css';


const Pointpage = () => {
    // 탭 전환 상태값
    const [activeTab, setActiveTab] = useState('전체'); // 기본 상태로 '전체' 설정

    // 포인트 내역 관련 상태
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 포인트 내역 데이터 (더미 데이터)
    const pointData = {
        전체: [
            { date: '7.30', description: '출석체크 보상', change: '+ 100', total: '1,152' },
            { date: '7.30', description: '챌린지 퀘스트 보상', change: '+ 300', total: '902' },
            { date: '7.27', description: '프로필 구매', change: '- 5,999', total: '10,251' },
            // ... 다른 전체 내역 데이터
        ],
        적립: [
            { date: '7.30', description: '출석체크 보상', change: '+ 100', total: '1,152' },
            { date: '7.30', description: '챌린지 퀘스트 보상', change: '+ 300', total: '902' },
            // ... 다른 적립 내역 데이터
        ],
        사용: [
            { date: '7.27', description: '프로필 구매', change: '- 5,999', total: '10,251' },
            // ... 다른 사용 내역 데이터
        ],
    };

    // 탭 전환 함수
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // 포인트 검색 핸들러 (예시)
    const handleSearch = () => {
        // 선택한 기간에 따른 포인트 내역 필터링 로직 추가
        console.log('검색 기간:', startDate, endDate);
    };

    // 로그아웃 핸들러 (예시)
    const handleLogout = () => {
        // 로그아웃 로직 추가
        console.log("로그아웃");
    };

    return (
        <div className="wrap">
            {/* Header 컴포넌트 */}
            <Header onLogout={handleLogout} />

            {/* 메인 컨테이너 */}
            <div className="hmk_main-container">
                {/* Sidebar 컴포넌트 */}
                <Sidebar />

                {/* 메인 콘텐츠 영역 */}
                <div className="hmk_main">
                    {/* Topbar 컴포넌트 */}
                    <Topbar />

                    {/* 포인트 내역 테이블 */}
                    <div className="hmk_point-history">
                        <h2>포인트 내역</h2>
                        <div className="hmk_point-summary">
                            <div className="hmk_point-box">
                                <p>Total Points</p>
                                <div className="hmk_point-value">1152</div>
                            </div>
                            <div className="hmk_point-box">
                                <p>Points Earned</p>
                                <div className="hmk_point-value">17550</div>
                            </div>
                            <div className="hmk_point-box">
                                <p>Points Spent</p>
                                <div className="hmk_point-value">15998</div>
                            </div>
                        </div>

                        <div className="hmk_point-filter">
                            <p>기간을 선택하세요</p>
                            <div className="hmk_date-options">
                                <button className="hmk_date-button" onClick={() => {
                                    /* 최근 7일 필터링 로직 */
                                    setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
                                    setEndDate(new Date());
                                }}>최근 7일</button>
                                <button className="hmk_date-button" onClick={() => {
                                    /* 최근 30일 필터링 로직 */
                                    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
                                    setEndDate(new Date());
                                }}>최근 30일</button>
                                <button className="hmk_date-button" onClick={() => {
                                    /* 최근 90일 필터링 로직 */
                                    setStartDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
                                    setEndDate(new Date());
                                }}>최근 90일</button>
                            </div>
                            <div className="hmk_date-inputs">
                                <div className="hmk_date">
                                    <label htmlFor="start-date">시작일</label>
                                    <div className="hmk_date-wrapper">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            placeholderText="mm/dd/yyyy          📅"
                                            className="hmk_date-input"
                                        />
                                        <span className="hmk_calendar-icon" onClick={() => { /* 열기 로직 */ }}></span>
                                    </div>
                                </div>
                                <div className="hmk_date">
                                    <label htmlFor="end-date">종료일</label>
                                    <div className="hmk_date-wrapper">
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            placeholderText="mm/dd/yyyy          📅"
                                            className="hmk_date-input"
                                        />
                                        <span className="hmk_calendar-icon" onClick={() => { /* 열기 로직 */ }}></span>
                                    </div>
                                </div>

                                <button className="hmk_search-button" onClick={handleSearch}>검색</button>
                            </div>
                        </div>

                        {/* 포인트 토글 버튼 */}
                        <div className="hmk_toggle-container">
                            <button
                                className={`hmk_toggle-button ${activeTab === '전체' ? 'active' : ''}`}
                                onClick={() => handleTabChange('전체')}
                            >
                                전체
                            </button>
                            <button
                                className={`hmk_toggle-button ${activeTab === '적립' ? 'active' : ''}`}
                                onClick={() => handleTabChange('적립')}
                            >
                                적립
                            </button>
                            <button
                                className={`hmk_toggle-button ${activeTab === '사용' ? 'active' : ''}`}
                                onClick={() => handleTabChange('사용')}
                            >
                                사용
                            </button>
                        </div>
                        {/* 여기에서 activeTab에 따라 다른 테이블 내용 보여주기 */}
                        <table className="hmk_point-table">
                            <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>설명</th>
                                    <th>변동</th>
                                    <th>잔액</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pointData[activeTab].map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.description}</td>
                                        <td>{item.change}</td>
                                        <td>{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pointpage;
