// src/ham_pages/ham_mypage_point.jsx

import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker'; // 날짜 선택기 import
import InfiniteScroll from 'react-infinite-scroll-component';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // axios import
import { format } from 'date-fns'; // 날짜 포맷팅 함수 import

// Header, Sidebar, Topbar 컴포넌트 import
import Header from '../pages/include/DH_Header';
import Footer from '../pages/include/JM-Footer';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import profileStore from './ham_common/profileStore'; // profileStore 임포트

// 포인트 페이지 스타일 
import '../ham_asset/css/ham_mypage_point.css';

const Pointpage = () => {
    const [pointData, setPointData] = useState([]);
    const [summary, setSummary] = useState({
        pointsEarned: 0,
        pointsSpent: 0,
        totalPoints: 0
    });
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0); // 전체 데이터 수 추가
    const PAGE_SIZE = 10;
    // 탭 전환 상태값
    const [activeTab, setActiveTab] = useState('전체'); // 기본 상태로 '전체' 설정

    // 포인트 내역 관련 상태
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 사용자 프로필 상태 관리
    const [profile, setProfile] = useState({
        userNum: profileStore.getUserNum(),
        token: profileStore.getToken()
    });

    // ProfileStore 구독 설정
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setProfile({
                userNum: updatedProfile.userNum,
                token: updatedProfile.token // 토큰 업데이트
            });
        };
        profileStore.subscribe(handleProfileChange);

        // 초기 프로필 데이터 설정
        handleProfileChange({
            userNum: profileStore.getUserNum(),
            token: profileStore.getToken()
        });

        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // 포인트 데이터를 가져오는 useEffect는 profile.userNum 또는 token이 변경될 때마다 실행
    useEffect(() => {
        if (profile.userNum && profile.token) {
            fetchPointData();
        }
    }, [profile.userNum, profile.token]);

    // 필터링된 데이터 계산
    const filteredData = useMemo(() => {
        if (!Array.isArray(pointData)) {
            console.error('pointData is not an array:', pointData);
            return [];
        }

        let filtered = [...pointData];

        if (startDate && endDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        switch (activeTab) {
            case '적립':
                return filtered.filter(item => item.historyInfo === '+');
            case '사용':
                return filtered.filter(item => item.historyInfo === '-');
            default:
                return filtered;
        }
    }, [pointData, startDate, endDate, activeTab]);

    // 포인트 요약 정보는 백엔드에서 가져온 summary 데이터를 사용
    const totalPoints = summary.totalPoints.toLocaleString();
    const pointsEarned = summary.pointsEarned.toLocaleString();
    const pointsSpent = summary.pointsSpent.toLocaleString();

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
        setPage(0);         // 페이지 초기화
        setPointData([]);   // 기존 데이터 초기화
        fetchPointData(0, false); // 새로운 조건으로 데이터 로드
    };
    // 추가 데이터 로드 함수
    const fetchMoreData = () => {
        if (!loading && hasMore) {
            fetchPointData(page + 1, true);
        }
    };

    const fetchPointData = async (pageNum = 0, isLoadMore = false) => {
        if (loading) return;

        try {
            setLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const { userNum, token } = profile;

            if (!userNum || !token) {
                alert('인증 정보가 없습니다. 다시 로그인해주세요.');
                return;
            }

            const params = {
                page: pageNum,
                size: PAGE_SIZE,
                startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
                endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null
            };

            const [historyResponse, summaryResponse] = await Promise.all([
                axios.get(`${apiUrl}/api/my/${userNum}/pointHistory`, {
                    params,
                    headers: { Authorization: `Bearer ${token}` }
                }),
                !isLoadMore ? axios.get(`${apiUrl}/api/my/${userNum}/pointSummary`, {
                    headers: { Authorization: `Bearer ${token}` }
                }) : Promise.resolve({ data: { result: 'success', apiData: summary } })
            ]);

            if (historyResponse.data.result === 'success') {
                const { content, totalElements, hasMore: serverHasMore } = historyResponse.data.apiData;

                if (Array.isArray(content)) {
                    if (isLoadMore) {
                        setPointData(prev => [...prev, ...content]);
                    } else {
                        setPointData(content);
                    }

                    setTotalElements(totalElements);
                    setHasMore(serverHasMore);
                    setPage(pageNum);
                } else {
                    console.error('Content is not an array:', content);
                    setPointData([]);
                }
            }

            if (!isLoadMore && summaryResponse.data.result === 'success') {
                setSummary(summaryResponse.data.apiData);
            }
        } catch (error) {
            console.error('포인트 데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 필터 초기화 핸들러 추가
    const handleResetFilters = () => {
        setActiveTab('전체');  // 탭을 '전체'로 초기화
        setStartDate(null);    // 시작일 초기화
        setEndDate(null);      // 종료일 초기화
        setPage(0);           // 페이지 초기화
        setPointData([]);      // 데이터 초기화
        setHasMore(true);      // hasMore 초기화
        fetchPointData(0, false); // 데이터 다시 로드
    };

    // 필터 변경 시 데이터 초기화 및 재조회를 위한 useEffect 추가
    useEffect(() => {
        setPointData([]);
        setPage(0);
        setHasMore(true);
        fetchPointData(0, false);
    }, [activeTab, startDate, endDate]);

    return (
        <>
            <Header />
            <div className="wrap ham_wrap">
                <div className="hmk_main-container">
                    <Sidebar />
                    <div className="hmk_main">
                        <Topbar />
                        {/* 포인트 내역 테이블 */}
                        <div className="hmk_point-history">
                            <h2>포인트 내역</h2>
                            <div className="hmk_point-summary">
                                <div className="hmk_point-box">
                                    <p>포인트 총액</p>
                                    <div className="hmk_point-value">{totalPoints}</div>
                                </div>
                                <div className="hmk_point-box">
                                    <p>적립 포인트</p>
                                    <div className="hmk_point-value">{pointsEarned}</div>
                                </div>
                                <div className="hmk_point-box">
                                    <p>사용 포인트</p>
                                    <div className="hmk_point-value">{pointsSpent}</div>
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
                                                    placeholderText="yyyy-MM-dd 📅"
                                                    className="hmk_date-input"
                                                    dateFormat="yyyy-MM-dd"
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
                                                    placeholderText="yyyy-MM-dd 📅"
                                                    className="hmk_date-input"
                                                    dateFormat="yyyy-MM-dd"
                                                />
                                                <span className="hmk_calendar-icon" onClick={() => { /* 열기 로직 */ }}></span>
                                            </div>
                                        </div>
                                        <button className="hmk_search-button" onClick={handleSearch}>검색</button>
                                    </div>
                                </div>
                            </div>

                            {/* 포인트 내역 테이블 */}
                            <InfiniteScroll
                                dataLength={filteredData.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={
                                    <div className="hmk_loading">
                                        <div className="hmk_loading-spinner"></div>
                                        데이터를 불러오는 중...
                                    </div>
                                }
                                endMessage={
                                    <div className="hmk_end-message">
                                        {filteredData.length > 0 ? "모든 내역을 불러왔습니다." : "해당하는 내역이 없습니다."}
                                    </div>
                                }
                                style={{ overflow: 'visible' }}
                            >
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
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item) => (
                                                <tr key={item.historyNum}> {/* historyNum을 키로 사용 */}
                                                    <td>{item.date}</td>
                                                    <td>{item.purposeName}</td>
                                                    <td>
                                                        <span className={item.historyInfo === '+' ? 'earned' : 'spent'}>
                                                            {item.historyInfo === '+' ?
                                                                item.historyPoint.toLocaleString() :
                                                                `- ${Math.abs(item.historyPoint).toLocaleString()}`}
                                                        </span>
                                                    </td>
                                                    <td>{item.total.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : !loading && (
                                            <tr>
                                                <td colSpan="4">해당 조건에 맞는 데이터가 없습니다.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Pointpage;
