import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../ham_asset/css/ham_profileMenu.css';
import Alert from './ham_alert';  // Alert 컴포넌트 import

const Hmk_ProfileMenu = ({ isMenuOpen, toggleMenu, handleLogout }) => {
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    if (!isMenuOpen) return null;

    // 로그아웃 버튼 클릭 핸들러
    const handleLogoutClick = () => {
        setShowLogoutAlert(true);
    };

    // 로그아웃 확인 핸들러
    const handleLogoutConfirm = () => {
        handleLogout();
        toggleMenu();
        setShowLogoutAlert(false);
    };

    // 알림 닫기 핸들러
    const handleAlertClose = () => {
        setShowLogoutAlert(false);
    };

    return (
        <>
            <div className="hmk_profile-menu">
                <Link 
                    to="/my/mypage" 
                    className="hmk_profile-menu-item" 
                    onClick={toggleMenu}
                >
                    마이페이지로 이동
                </Link>
                <button 
                    className="hmk_profile-menu-item hmk_logout-btn" 
                    onClick={handleLogoutClick}  // onClick 핸들러 변경
                >
                    로그아웃
                </button>
            </div>

            <Alert
                isOpen={showLogoutAlert}
                message="로그아웃 하시겠습니까?"
                onClose={handleAlertClose}
                type="success"
                autoClose={false}
                confirmButton={true}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );
};

export default Hmk_ProfileMenu;