// src/ham_pages/ham_mobile/ham_MobileBottomMenu.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MobileSliderMenu from '../ham_mobile/ham_MobileSliderMenu';
import {
    faMedal,
    faBars,
    faExclamation,
    faGift,
    faCamera,
} from "@fortawesome/free-solid-svg-icons"
import profileStore from '../ham_common/profileStore';


const MobileBottomMenu = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [noticeCount, setNoticeCount] = useState(0);
    const [profile, setProfile] = useState({
        userNum: profileStore.getUserNum(),
        token: profileStore.getToken()
    });

    const handleMouseEnter = (menu) => {
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    const handleTouch = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const handleMenuClick = (menu) => {
        switch (menu) {
            case 'challenge':
                navigate('/m/home');
                break;
            case 'inventory':
                navigate('/m/cargo');
                break;
            case 'points':
                navigate('/m/home');
                break;
            case 'rank':
                navigate('/m/rank');
                break;
            case 'setting':
                console.log('Opening slider menu');
                setIsSliderOpen(true);
                break;
            default:
                break;
        }
    };

    const fetchNotificationCount = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const { userNum, token } = profile;

            if (!userNum || !token) {
                console.error('인증 정보가 없습니다.');
                return;
            }

            const summaryResponse = await axios.get(`${apiUrl}/api/my/${userNum}/noticeSummary`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (summaryResponse.data.result === 'success') {
                const newCount = summaryResponse.data.apiData.newNotice;
                setNoticeCount(newCount);
                profileStore.updateNoticeCount(newCount);
                console.log('Fetched notice count:', newCount);
            }
        } catch (error) {
            console.error('알림 요약 정보를 가져오는 데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            setNoticeCount(updatedProfile.noticeCount);
            setProfile({
                userNum: updatedProfile.userNum,
                token: updatedProfile.token
            });
        };

        profileStore.subscribe(handleProfileChange);

        if (profile.userNum && profile.token) {
            fetchNotificationCount();
        }

        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, [profile.userNum, profile.token]);

    return (
        <div style={{ position: 'relative' }}> {/* position 컨텍스트 생성 */}
            <div className="hmk_mobile_home-bottom">
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('challenge')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('challenge')}
                    onClick={() => handleMenuClick('challenge')}
                >
                    <FontAwesomeIcon icon={faExclamation} size="lg" className="hmk_mobile_home-icon" />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'challenge' ? 'visible' : 'hidden'}`}>
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('inventory')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('inventory')}
                    onClick={() => handleMenuClick('inventory')}
                >
                    <FontAwesomeIcon icon={faGift} size="lg" className="hmk_mobile_home-icon" />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'inventory' ? 'visible' : 'hidden'}`}>
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item3"
                    onMouseEnter={() => handleMouseEnter('points')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('points')}
                    onClick={() => handleMenuClick('points')}
                >
                    <FontAwesomeIcon icon={faCamera} className="hmk_mobile_home-icon" />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'points' ? 'visible' : 'hidden'}`}>
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('rank')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('rank')}
                    onClick={() => handleMenuClick('rank')}
                >
                    <FontAwesomeIcon icon={faMedal} className="hmk_mobile_home-icon" />
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'rank' ? 'visible' : 'hidden'}`}>
                    </div>
                </div>
                <div
                    className="hmk_mobile_home-bottom-item"
                    onMouseEnter={() => handleMouseEnter('setting')}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={() => handleTouch('setting')}
                    onClick={() => handleMenuClick('setting')}
                >
                    <div className="hmk_mobile_home-icon-wrapper">
                        <FontAwesomeIcon icon={faBars} className="hmk_mobile_home-icon" />
                        {noticeCount > 0 && (
                            <span className="hmk_mobile_home-badge"></span>
                        )}
                    </div>
                    <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'setting' ? 'visible' : 'hidden'}`}>
                    </div>
                </div>
            </div>

            <MobileSliderMenu
                isOpen={isSliderOpen}
                onClose={() => {
                    setIsSliderOpen(false);
                }}
            />
        </div>
    );
};

export default MobileBottomMenu;