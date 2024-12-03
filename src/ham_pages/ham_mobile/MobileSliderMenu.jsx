import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import profileStore from '../ham_common/profileStore';
import '../../ham_asset/css/ham_MobileSliderMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faStore,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const MobileSliderMenu = ({ isOpen, onClose }) => {

    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        profileImage: profileStore.getProfileImage(),
        nickname: profileStore.getNickname(),
        noticeCount: profileStore.getNoticeCount(),
        historyPoint: 0
    });
    const getUserPoints = async () => {
        try {
            const token = localStorage.getItem('token');
            const authUser = JSON.parse(localStorage.getItem('authUser'));

            if (!token || !authUser) return;

            const response = await axios({
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/api/user/points`,
                params: { userNum: authUser.userNum },
                headers: { "Authorization": `Bearer ${token}` },
                responseType: 'json'
            });

            if (response.data.result === "success") {
                setProfile(prev => ({
                    ...prev,
                    historyPoint: response.data.apiData
                }));
            }
        } catch (error) {
            console.error('Error fetching user points:', error);
        }
    };

    useEffect(() => {
        getUserPoints();  // 컴포넌트 마운트 시 포인트 정보 가져오기
    }, []);

    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setProfile(prev => ({
                ...prev,
                profileImage: updatedProfile.profileImage,
                nickname: updatedProfile.nickname,
                noticeCount: updatedProfile.noticeCount
            }));
        };

        profileStore.subscribe(handleProfileChange);
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setProfile(prev => ({
                ...prev,
                profileImage: updatedProfile.profileImage,
                nickname: updatedProfile.nickname,
                noticeCount: updatedProfile.noticeCount
            }));
        };

        profileStore.subscribe(handleProfileChange);
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        profileStore.setToken(null);
        navigate("/mobile");
        onClose();
    };

    useEffect(() => {
        // 외부 클릭 시 닫기
        const handleClickOutside = (e) => {
            if (isOpen && e.target.closest('.hmk_mobile_slider-menu')) {
                // 슬라이더 내부 클릭은 무시
                return;
            }
            if (isOpen) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* 배경 오버레이 추가 */}
            {isOpen && (
                <div
                    className="hmk_mobile_slider-overlay"
                    onClick={onClose}
                />
            )}
            <div className={`hmk_mobile_slider-menu ${isOpen ? 'open' : ''}`}>
                <div className="hmk_mobile_slider-content">
                    <div className="hmk_mobile_slider-content">
                        {/* 프로필 섹션 */}
                        <div className="hmk_mobile_profile-section">
                            <img
                                src={profile.profileImage}
                                alt="Profile"
                                className="hmk_mobile_profile-image"
                            />
                            <div className="hmk_mobile_point-info">
                                <div className="hmk_mobile_profile-name">
                                    {profile.nickname}
                                </div>
                                <div className="hmk_mobile_point-info2">
                                    <img
                                        src="/images/point.png"
                                        alt="point"
                                        className="hmk_mobile_point-icon"
                                    />
                                    <span className="hmk_mobile_point-value">
                                        {profile.historyPoint} P
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 메뉴 아이템들 */}
                        <div className="hmk_mobile_menu-items">
                            <div key={0} className="hmk_mobile_menu-item" onClick={() => {
                                navigate('/mobile/notice');
                                onClose();
                            }}>
                                <FontAwesomeIcon icon={faBell} />
                                <span>알림</span>
                                {profile.noticeCount > 0 && (
                                    <span className="hmk_mobile_notice-badge">
                                        {profile.noticeCount}
                                    </span>
                                )}
                            </div>
                            <div key={1} className="hmk_mobile_menu-item" onClick={() => {
                                navigate('/mobile/store');
                                onClose();
                            }}>
                                <FontAwesomeIcon icon={faStore} />
                                <span>상점</span>
                            </div>
                        </div>

                        <div className="hmk_mobile_menu-item hmk_mobile_logout" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span>로그아웃</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileSliderMenu;