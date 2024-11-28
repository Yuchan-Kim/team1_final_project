// src/ham_pages/ham_mobile/ham_MobileBottomMenu.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMedal,
    faUser,
    faExclamation,
    faCog,
    faHeart,
    faClock,
    faStar,
    faGift,
    faCamera,
} from "@fortawesome/free-solid-svg-icons"

const MobileBottomMenu = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null);

    const handleMouseEnter = (menu) => {
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    const handleTouch = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    // 문서 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleDocumentClick = (e) => {
            if (!e.target.closest('.hmk_mobile_home-bottom-item')) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [activeMenu]);

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
            case 'profile':
                navigate('/m/profile');
                break;
            default:
                break;
        }
    };

    return (
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
                <FontAwesomeIcon icon={faGift} size="lg" className="hmk_mobile_home-icon"/>
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
                <FontAwesomeIcon icon={faCamera} className="hmk_mobile_home-icon"/>
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
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleTouch('profile')}
                onClick={() => handleMenuClick('profile')}
            >
                <FontAwesomeIcon icon={faUser} className="hmk_mobile_home-icon" />
                <div className={`hmk_mobile_home-bottom-text ${activeMenu === 'profile' ? 'visible' : 'hidden'}`}>
                </div>
            </div>
        </div>
    );
};

export default MobileBottomMenu;