import React from 'react';
import { Link } from 'react-router-dom';
import '../../ham_asset/css/ham_profileMenu.css'; // 슬라이드 메뉴 스타일링 CSS

const Hmk_ProfileMenu = ({ isMenuOpen, toggleMenu, handleLogout }) => {
    if (!isMenuOpen) return null;

    return (
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
                onClick={() => {
                    handleLogout();
                    toggleMenu();
                }}
            >
                로그아웃
            </button>
        </div>
    );
};

export default Hmk_ProfileMenu;