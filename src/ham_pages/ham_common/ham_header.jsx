// src/ham_pages/ham_common/ham_header.jsx

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

// src/ham_pages/ham_common/ham_header.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import profileStore from './profileStore'; // profileStore 임포트
import Logo from '../../ham_asset/images/3d_customer-service-area-apng.png';

const Header = ({ onLogout }) => {
    const [profileImage, setProfileImage] = useState(profileStore.getProfileImage());
    const [nickname, setNickname] = useState(profileStore.getNickname());
    const [points, setPoints] = useState("3600"); // 고정 값 또는 다른 방식으로 관리

    useEffect(() => {
        // profileStore에 구독자 추가
        const handleProfileChange = (updatedProfile) => {
            setProfileImage(updatedProfile.profileImage);
            setNickname(updatedProfile.nickname);
        };

        profileStore.subscribe(handleProfileChange);

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    return (
        <header className="hmk_header">
            {/* 로고 이미지 */}
            <img src={Logo} alt="Logo" className="hmk_logo" />
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
                    <li><p>{nickname}</p></li> {/* 사용자 닉네임 */}
                    <li><span>{points}</span></li> {/* 사용자 포인트 */}
                    <li><Link to="#" onClick={onLogout}>로그아웃</Link></li> {/* 로그아웃 링크 */}
                </ul>
            </div>
        </header>
    );
};

export default Header;


