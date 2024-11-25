// src/ham_pages/ham_mypage_notice.jsx

import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker'; // 날짜 선택기 import
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // axios import
import { format } from 'date-fns'; // 날짜 포맷팅 함수 import
import { useNavigate } from 'react-router-dom'; // 방으로 이동하기 위한 navigate 사용

// Header, Sidebar, Topbar 컴포넌트 import
import Header from '../pages/include/DH_Header';
import Footer from '../pages/include/JM-Footer';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import profileStore from './ham_common/profileStore'; // profileStore 임포트

// 알림 페이지 스타일 
import '../ham_asset/css/ham_mypage_notice.css';

const Notice = () => {
    const [noticeData, setNoticeData] = useState([]);
    const [summary, setSummary] = useState({
        readNotice: 0,
        newNotice: 0,
        totalNotice: 0
    });

    const [activeTab, setActiveTab] = useState('새 알림'); // 탭 상태
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [profile, setProfile] = useState({
        userNum: profileStore.getUserNum(),
        token: profileStore.getToken()
    });

    // 모달 관련 상태 추가
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    const navigate = useNavigate(); // 방으로 이동하기 위한 navigate 사용

    // 알림 읽음 처리 함수
    const markNoticeAsRead = async (noticeNum) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await axios.put(
                `${apiUrl}/api/notice/${noticeNum}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${profile.token}` }
                }
            );

            if (response.data.result === 'success') {
                // 알림 목록 갱신
                fetchNoticeData();
            }
        } catch (error) {
            console.error('알림 읽음 처리 실패:', error);
        }
    };

    // ProfileStore 구독
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setProfile({
                userNum: updatedProfile.userNum,
                token: updatedProfile.token
            });
        };
        profileStore.subscribe(handleProfileChange);

        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    useEffect(() => {
        if (profile.userNum && profile.token) {
            fetchNoticeData();
        }
    }, [startDate, endDate, profile.userNum, profile.token]);

    const fetchNoticeData = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const { userNum, token } = profile;

            if (!userNum || !token) {
                alert('인증 정보가 없습니다. 다시 로그인해주세요.');
                return;
            }

            const params = {
                startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
                endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null
            };

            const [noticeResponse, summaryResponse] = await Promise.all([
                axios.get(`${apiUrl}/api/my/${userNum}/notices`, {
                    params,
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${apiUrl}/api/my/${userNum}/noticeSummary`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (noticeResponse.data.result === 'success') {
                setNoticeData(noticeResponse.data.apiData);
            } else {
                console.error('알림 데이터 조회 실패:', noticeResponse.data.message);
                setNoticeData([]);
            }

            if (summaryResponse.data.result === 'success') {
                setSummary(summaryResponse.data.apiData);
            } else {
                setSummary({
                    readNotice: 0,
                    newNotice: 0,
                    totalNotice: 0
                });
            }
        } catch (error) {
            console.error('알림 데이터를 가져오는 데 실패했습니다:', error);
        }
    };

    const filteredNotices = useMemo(() => {
        let filtered = noticeData;
        if (startDate && endDate) {
            filtered = filtered.filter((notice) => {
                const noticeDate = new Date(notice.createDate); // 'createDate'로 수정
                return noticeDate >= startDate && noticeDate <= endDate;
            });
        }

        if (activeTab === '새 알림') {
            return filtered.filter((notice) => !notice.isCheck);
        } else if (activeTab === '읽음') {
            return filtered.filter((notice) => notice.isCheck);
        }

        return filtered;
    }, [noticeData, startDate, endDate, activeTab]);

    // 테이블 행 클릭 핸들러
    const handleRowClick = async (notice) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);

        // 읽지 않은 알림인 경우 읽음 처리
        if (!notice.isCheck) {
            await markNoticeAsRead(notice.noticeNum);
        }
    };

    // 모달 닫기 핸들러
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotice(null);
    };

    // 알림 내용에 따른 모달 컨텐츠 생성
    const getModalContent = (notice) => {
        const baseContent = {
            title: notice.noticeTitle,
            content: notice.noticeMsg,
            showRoomButton: notice.noticeTitle.includes('방') || notice.noticeTitle.includes('챌린지')
        };

        if (notice.noticeTitle.includes('방 생성')) {
            baseContent.additionalContent = '새로운 챌린지의 시작을 축하드립니다!';
        } else if (notice.noticeTitle.includes('방 참가')) {
            baseContent.additionalContent = '새로운 도전을 응원합니다!';
        } else if (notice.noticeTitle.includes('시작')) {
            baseContent.additionalContent = '챌린지가 시작되었습니다. 힘내세요!';
        } else if (notice.noticeTitle.includes('종료')) {
            baseContent.additionalContent = '수고하셨습니다!';
        }

        return baseContent;
    };

    // 모달 컴포넌트
    const NoticeModal = ({ notice, onClose }) => {
        const modalContent = getModalContent(notice);

        return (
            <div className="hmk_notice_modal-overlay">
                <div className="hmk_notice_modal-content">
                    <h2>{modalContent.title}</h2>
                    <hr />
                    <div className="hmk_notice_modal-header">
                        <span>발신자: {notice.senderNickname}</span>
                        <span>날짜: {notice.createDate}</span>
                    </div>
                    <hr />
                    <p>{modalContent.content}</p>
                    {modalContent.additionalContent && (
                        <>
                            <br />
                            <p>{modalContent.additionalContent}</p>
                        </>
                    )}
                    <hr />
                    <div className="hmk_notice_modal-buttons">
                        {modalContent.showRoomButton && (
                            <button
                                onClick={() => navigate(`/cmain/${notice.roomNum}`)}
                                className="hmk_notice_modal-button"
                            >
                                방으로 이동
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="hmk_notice_modal-button"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="wrap ham_wrap">
                <div className="hmk_main-container">
                    <Sidebar />
                    <div className="hmk_main">
                        <Topbar />
                        <div className="hmk_notice_summary">
                            <h2>알림 메시지</h2>
                            <div className="hmk_notice_info">
                                <div className="hmk_notice-box">
                                    <p>전체 알림</p>
                                    <div className="hmk_notice-value">{summary.totalNotice}</div>
                                </div>
                                <div className="hmk_notice-box">
                                    <p>새 알림</p>
                                    <div className="hmk_notice-value">{summary.newNotice}</div>
                                </div>
                                <div className="hmk_notice-box">
                                    <p>읽음</p>
                                    <div className="hmk_notice-value">{summary.readNotice}</div>
                                </div>
                            </div>
                            <div className="hmk_notice_filterbar">
                                <div className="hmk_toggle-container">
                                    <button
                                        className={`hmk_toggle-button ${activeTab === '전체' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('전체')}
                                    >
                                        전체
                                    </button>
                                    <button
                                        className={`hmk_toggle-button ${activeTab === '새 알림' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('새 알림')}
                                    >
                                        새 알림
                                    </button>
                                    <button
                                        className={`hmk_toggle-button ${activeTab === '읽음' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('읽음')}
                                    >
                                        읽음
                                    </button>
                                </div>
                            </div>
                            {/* 알림 리스트 테이블 */}
                            <table className="hmk_notice-table">
                                <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>발신자</th>
                                        <th>날짜</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNotices.length > 0 ? (
                                        filteredNotices.map((notice, index) => (
                                            <tr
                                                key={notice.noticeNum}
                                                onClick={() => handleRowClick(notice)}
                                                className="hmk_notice-row"
                                            >
                                                <td>{index + 1}</td>
                                                <td>{notice.noticeTitle}</td>
                                                <td>{notice.senderNickname || notice.msgSender}</td>
                                                <td>{notice.createDate}</td>
                                                <td>
                                                    {notice.isCheck ? (
                                                        <span className="hmk_notice-status read">읽음</span>
                                                    ) : (
                                                        <span className="hmk_notice-status new">새 알림</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">해당 조건에 맞는 알림이 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/* 모달 팝업 */}
            {isModalOpen && selectedNotice && (
                <NoticeModal
                    notice={selectedNotice}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default Notice;
