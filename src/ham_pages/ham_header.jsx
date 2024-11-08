// src/components/Header.js

/**
 * Header 컴포넌트
 * 사이트의 상단 헤더를 구성합니다.
 * - 로고 이미지
 * - 주요 메뉴 링크들 (챌린지, 커뮤니티, 힝키, 상점, 고객센터)
 * - 사용자 프로필 이미지, 이름, 포인트, 로그아웃 링크
 * 
 * Props:
 * - profileImage: 사용자 프로필 이미지 URL
 * - username: 사용자 이름
 * - points: 사용자 포인트
 * - onLogout: 로그아웃 버튼 클릭 시 호출되는 함수
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../ham_asset/css/ham_header.css'; // 헤더 전용 CSS

const Header = ({ profileImage, username, points, onLogout }) => {
    return (
        <header className="hmk_header">
            {/* 로고 이미지 */}
            <img src="https://via.placeholder.com/50" alt="Logo" className="hmk_logo" />
            <div className="hmk_menu">
                <ul>
                    <li><Link to="#">챌린지</Link></li>
                    <li><Link to="#">커뮤니티</Link></li>
                    <li><Link to="#">힝키</Link></li>
                    <li><Link to="#">상점</Link></li>
                    <li><Link to="#">고객센터</Link></li>
                </ul>
            </div>
            <div className="hmk_menu2">
                <ul>
                    <li>
                        <Link to="#">
                            {/* 현재 프로필 이미지 또는 기본 프로필 이미지 표시 */}
                            <img src={profileImage} alt="Profile" />
                        </Link>
                    </li>
                    <li><p>{username}</p></li> {/* 사용자 이름 */}
                    <li><span>{points}</span></li> {/* 사용자 포인트 */}
                    <li><Link to="#" onClick={onLogout}>로그아웃</Link></li> {/* 로그아웃 링크 */}
                </ul>
            </div>
        </header>
    );
};

export default Header;
