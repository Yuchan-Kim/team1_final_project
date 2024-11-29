// ham_M_notice.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileStore from '../ham_common/profileStore';
import MobileBottomMenu from './MobileBottomMenu';
import '../../ham_asset/css/ham_M_notice.css';

const MobileNotice = () => {
    const [noticeData, setNoticeData] = useState([]);
    const [summary, setSummary] = useState({
        readNotice: 0,
        newNotice: 0,
        totalNotice: 0
    });
    const [activeTab, setActiveTab] = useState('새 알림');
    const [profile, setProfile] = useState({
        userNum: profileStore.getUserNum(),
        token: profileStore.getToken()
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const navigate = useNavigate();

    // 필터링된 알림 계산
    const filteredNotices = useMemo(() => {
        let filtered = [...noticeData];

        switch (activeTab) {
            case '새 알림':
                return filtered.filter(notice => !notice.isCheck);
            case '읽음':
                return filtered.filter(notice => notice.isCheck);
            default:
                return filtered;
        }
    }, [noticeData, activeTab]);

    // API 호출 함수
    const fetchNoticeData = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const { userNum, token } = profile;

            if (!userNum || !token) {
                alert('인증 정보가 없습니다. 다시 로그인해주세요.');
                return;
            }

            // 알림 목록 API 호출
            const noticeResponse = await axios.get(`${apiUrl}/api/notice/user/${userNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (noticeResponse.data.result === 'success') {
                setNoticeData(noticeResponse.data.apiData);
            }

            // 알림 요약 API 호출
            const summaryResponse = await axios.get(`${apiUrl}/api/notice/user/${userNum}/summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (summaryResponse.data.result === 'success') {
                setSummary(summaryResponse.data.apiData);
            }
        } catch (error) {
            console.error('알림 데이터를 가져오는 데 실패했습니다:', error);
        }
    };

    // 알림 클릭 핸들러
    const handleNoticeClick = async (notice) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);

        if (!notice.isCheck) {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
                const response = await axios.put(
                    `${apiUrl}/api/notice/${notice.noticeNum}/read`,
                    {},
                    { headers: { Authorization: `Bearer ${profile.token}` } }
                );

                if (response.data.result === 'success') {
                    // 상태 업데이트
                    setNoticeData(prevNotices =>
                        prevNotices.map(n =>
                            n.noticeNum === notice.noticeNum ? { ...n, isCheck: 1 } : n
                        )
                    );

                    // 요약 정보 업데이트
                    const newNoticeCount = Math.max(summary.newNotice - 1, 0);
                    setSummary(prevSummary => ({
                        ...prevSummary,
                        readNotice: prevSummary.readNotice + 1,
                        newNotice: newNoticeCount
                    }));

                    profileStore.updateNoticeCount(newNoticeCount);
                }
            } catch (error) {
                console.error('알림 읽음 처리 실패:', error);
            }
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

    // 데이터 로드
    useEffect(() => {
        if (profile.userNum && profile.token) {
            fetchNoticeData();
        }
    }, [profile.userNum, profile.token]);

    return (
        <div className="hmk_mobile_notice-container">
            {/* 상단 통계 카드 섹션 */}
            <div className="hmk_mobile_notice-summary">
                <div className="hmk_mobile_notice-card">
                    <span className="hmk_mobile_notice-card-label">전체 알림</span>
                    <span className="hmk_mobile_notice-card-value">{summary.totalNotice}</span>
                </div>
                <div className="hmk_mobile_notice-card">
                    <span className="hmk_mobile_notice-card-label">새 알림</span>
                    <span className="hmk_mobile_notice-card-value">{summary.newNotice}</span>
                </div>
                <div className="hmk_mobile_notice-card">
                    <span className="hmk_mobile_notice-card-label">읽음</span>
                    <span className="hmk_mobile_notice-card-value">{summary.readNotice}</span>
                </div>
            </div>

            {/* 필터 탭 섹션 */}
            <div className="hmk_mobile_notice-tabs">
                <button
                    className={`hmk_mobile_notice-tab ${activeTab === '전체' ? 'active' : ''}`}
                    onClick={() => setActiveTab('전체')}
                >
                    전체
                </button>
                <button
                    className={`hmk_mobile_notice-tab ${activeTab === '새 알림' ? 'active' : ''}`}
                    onClick={() => setActiveTab('새 알림')}
                >
                    새 알림
                </button>
                <button
                    className={`hmk_mobile_notice-tab ${activeTab === '읽음' ? 'active' : ''}`}
                    onClick={() => setActiveTab('읽음')}
                >
                    읽음
                </button>
            </div>

            {/* 알림 리스트 섹션 */}
            <div className="hmk_mobile_notice-list">
                {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                        <div
                            key={notice.noticeNum}
                            className="hmk_mobile_notice-item"
                            onClick={() => handleNoticeClick(notice)}
                        >
                            <div className="hmk_mobile_notice-item-header">
                                <span className="hmk_mobile_notice-item-title">
                                    {notice.noticeTitle}
                                </span>
                                <span className={`hmk_mobile_notice-item-status ${notice.isCheck ? 'read' : 'new'}`}>
                                    {notice.isCheck ? '읽음' : '새 알림'}
                                </span>
                            </div>
                            <div className="hmk_mobile_notice-item-sender">
                                {notice.senderNickname || notice.msgSender}
                            </div>
                            <div className="hmk_mobile_notice-item-date">
                                {notice.createDate}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="hmk_mobile_notice-empty">
                        알림이 없습니다.
                    </div>
                )}
            </div>
            <MobileBottomMenu />
        </div>
    );
};

export default MobileNotice;