import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import profileStore from './profileStore';
import '../../ham_asset/css/ham_sidebar.css';

const ChallengeIcon = '/upload/icons/challenge.png';
const NoticeIcon = '/upload/icons/notice_ico.png';
const PointsIcon = '/upload/icons/points.png';
const InventoryIcon = '/upload/icons/inventory.png';

const Sidebar = () => {
    const [profile, setProfile] = useState({
        userNum: profileStore.getUserNum(),
        token: profileStore.getToken(),
        noticeCount: profileStore.getNoticeCount() // 알림 개수 추가
    });
    // ProfileStore 구독
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setProfile({
                userNum: updatedProfile.userNum,
                token: updatedProfile.token,
                noticeCount: profileStore.getNoticeCount() // 알림 개수 업데이트
            });
        };
        profileStore.subscribe(handleProfileChange);

        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // 프로필 정보가 있을 때 알림 개수 조회
    useEffect(() => {
        if (profile.userNum && profile.token) {
            fetchNoticeCount();
            const interval = setInterval(fetchNoticeCount, 60000);
            return () => clearInterval(interval);
        }
    }, [profile.userNum, profile.token]);

    // 알림 개수 조회
    const fetchNoticeCount = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await axios.get(
                `${apiUrl}/api/notice/user/${profile.userNum}/summary`,
                {
                    headers: { Authorization: `Bearer ${profile.token}` }
                }
            );

            if (response.data.result === 'success') {
                const newCount = response.data.apiData.newNotice || 0;
                profileStore.updateNoticeCount(newCount); // profileStore 업데이트
            }
        } catch (error) {
            console.error('알림 개수 조회 실패:', error);
        }
    };

    return (
        <aside className="hmk_sidebar-container">
            <div className="hmk_sidebar">
                <div className='ham_h1_title'>
                    <h1>나의 정보</h1>
                </div>
                <ul>
                    <li>
                        <img src={ChallengeIcon} alt="Challenge" className="hmk_sidebar-icon" />
                        <Link to="/my/mypage">나의 챌린지</Link>
                    </li>
                    <li>
                        <img src={PointsIcon} alt="Points" className="hmk_sidebar-icon" />
                        <Link to="/my/mypoint">포인트 내역</Link>
                    </li>
                    <li>
                        <img src={InventoryIcon} alt="Inventory" className="hmk_sidebar-icon" />
                        <Link to="/my/cargo">보관함</Link>
                    </li>
                    <li>
                        <div className="hmk_sidebar-notice-container">
                            <img src={NoticeIcon} alt="Notice" className="hmk_sidebar-icon" />
                            <Link to="/my/notice">알림</Link>
                            {profile.noticeCount > 0 && (
                                <span className="hmk_sidebar-notice-badge">{profile.noticeCount}</span>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;