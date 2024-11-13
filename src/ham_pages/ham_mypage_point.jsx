// src/ham_pages/ham_mypage_point.jsx

import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker'; // 날짜 선택기 import
import 'react-datepicker/dist/react-datepicker.css';

// Header, Sidebar, Topbar 컴포넌트 import
import Header from '../pages/include/DH_Header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';

// 공통 리셋 & 포인트 페이지 스타일 
import '../ham_asset/css/ham_mypage_point.css';

// 포인트 내역 데이터 (숫자형으로 변환된 데이터)
const allPointData = [
    { date: '2024-08-30', description: '기프티콘 구매', change: -7500, total: 1, type: '사용' },
    { date: '2024-08-27', description: '출석체크 보상', change: 100, total: 7501, type: '적립' },
    { date: '2024-08-25', description: '챌린지 퀘스트 보상', change: 1000, total: 7401, type: '적립' },
    { date: '2024-08-10', description: '출석체크 보상', change: 100, total: 6401, type: '적립' },
    { date: '2024-08-07', description: '챌린지 퀘스트 보상', change: 1000, total: 6301, type: '적립' },
    { date: '2024-08-05', description: '출석체크 보상', change: 100, total: 5301, type: '적립' },
    { date: '2024-08-02', description: '출석체크 보상', change: 100, total: 5201, type: '적립' },
    { date: '2024-08-01', description: '출석체크 보상', change: 100, total: 5101, type: '적립' },
    { date: '2024-07-30', description: '출석체크 보상', change: 100, total: 5001, type: '적립' },
    { date: '2024-07-30', description: '챌린지 퀘스트 보상', change: 300, total: 4901, type: '적립' },
    { date: '2024-07-27', description: '프로필 구매', change: -5999, total: 4601, type: '사용' },
    { date: '2024-06-27', description: '출석체크 보상', change: 100, total: 10600, type: '적립' },
    { date: '2024-06-25', description: '출석체크 보상', change: 100, total: 10500, type: '적립' },
    { date: '2024-05-17', description: '챌린지 퀘스트 보상', change: 300, total: 10400, type: '적립' },
    { date: '2024-04-30', description: '출석체크 보상', change: 100, total: 10100, type: '적립' },
    { date: '2024-03-30', description: '회원가입 축하 보너스', change: 10000, total: 10000, type: '적립' },
];

const Pointpage = () => {
    // 탭 전환 상태값
    const [activeTab, setActiveTab] = useState('전체'); // 기본 상태로 '전체' 설정

    // 포인트 내역 관련 상태
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 날짜 필터링된 포인트 데이터
    const dateFilteredPoints = useMemo(() => {
        let filtered = allPointData;
        if (startDate && endDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
        return filtered;
    }, [startDate, endDate]);

    // 테이블에 표시될 포인트 데이터 (토글 탭에 따른 필터링)
    const tablePoints = useMemo(() => {
        if (activeTab === '전체') {
            return dateFilteredPoints;
        }
        return dateFilteredPoints.filter(item => item.type === activeTab);
    }, [dateFilteredPoints, activeTab]);

    // 포인트 요약 정보 계산 (토글 탭과 관계없이 날짜 필터링된 데이터 기반)
    const totalPoints = useMemo(() => {
        if (dateFilteredPoints.length === 0) return '0';
        // 날짜 순으로 정렬 (오래된 순)
        const sorted = [...dateFilteredPoints].sort((a, b) => new Date(a.date) - new Date(b.date));
        return sorted[sorted.length - 1].total.toLocaleString();
    }, [dateFilteredPoints]);

    const pointsEarned = useMemo(() => {
        return dateFilteredPoints
            .filter(item => item.type === '적립')
            .reduce((sum, item) => sum + item.change, 0);
    }, [dateFilteredPoints]);

    const pointsSpent = useMemo(() => {
        return dateFilteredPoints
            .filter(item => item.type === '사용')
            .reduce((sum, item) => sum + Math.abs(item.change), 0);
    }, [dateFilteredPoints]);

    // 탭 전환 함수
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // 토글 탭 전환 시 날짜 필터는 유지합니다.
    };

    // 포인트 검색 핸들러
    const handleSearch = () => {
        if (!startDate || !endDate) {
            alert("시작일과 종료일을 모두 선택해주세요.");
            return;
        }
        // 날짜 필터링은 useMemo를 통해 자동으로 반영됩니다.
    };

    // 필터 초기화 핸들러
    const handleResetFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };

    // 로그아웃 핸들러 (예시)
    const handleLogout = () => {
        // 로그아웃 로직 추가
        console.log("로그아웃");
    };

    return (
        <>
            {/* Header 컴포넌트 */}
            <Header onLogout={handleLogout} />

            <div className="wrap ham_wrap">

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
                                    <div className="hmk_point-value">{totalPoints}</div>
                                </div>
                                <div className="hmk_point-box">
                                    <p>Points Earned</p>
                                    <div className="hmk_point-value">{pointsEarned.toLocaleString()}</div>
                                </div>
                                <div className="hmk_point-box">
                                    <p>Points Spent</p>
                                    <div className="hmk_point-value">{pointsSpent.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="hmk_point_filterbar">
                                {/* 포인트 내역 토글 버튼 */}
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
                                {/* 날짜 검색 필터 버튼 */}
                                <div className="hmk_point-filter">
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
                                        {/* 초기화 버튼 */}
                                        <button className="hmk_date-button hmk_reset-button" onClick={handleResetFilters}>
                                            초기화
                                        </button>
                                    </div>
                                    {/* 날짜 검색 인풋 창 */}
                                    <div className="hmk_date-inputs">
                                        <div className="hmk_date">
                                            <label htmlFor="start-date">시작일</label>
                                            <div className="hmk_date-wrapper">
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={date => setStartDate(date)}
                                                    placeholderText="mm/dd/yyyy    📅"
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
                                                    placeholderText="mm/dd/yyyy    📅"
                                                    className="hmk_date-input"
                                                />
                                                <span className="hmk_calendar-icon" onClick={() => { /* 열기 로직 */ }}></span>
                                            </div>
                                        </div>
                                        <button className="hmk_search-button" onClick={handleSearch}>검색</button>
                                    </div>
                                </div>
                            </div>

                            {/* 포인트 내역 테이블 */}
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
                                    {tablePoints.length > 0 ? (
                                        tablePoints.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.date}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    {item.type === '적립' ? (
                                                        <span className="earned">
                                                            {item.change.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="spent">
                                                            - {Math.abs(item.change).toLocaleString()}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{item.total.toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">해당 조건에 맞는 데이터가 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pointpage;
