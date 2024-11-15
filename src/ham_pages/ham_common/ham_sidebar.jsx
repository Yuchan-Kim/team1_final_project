// src/ham_pages/ham_common/ham_sidebar.jsx

/**
 * Sidebar 컴포넌트
 * 사이트의 좌측 사이드바를 구성합니다.
 * - 나의 정보 제목
 * - 사이드바 메뉴 항목들 (나의 챌린지, 친구, 포인트 내역, 보관함)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import ChallengeIcon from '../../ham_asset/images/challenge.png';
import FriendsIcon from '../../ham_asset/images/friends.png';
import PointsIcon from '../../ham_asset/images/points.png';
import InventoryIcon from '../../ham_asset/images/inventory.png';
import '../../ham_asset/css/ham_sidebar.css'; // 사이드바 전용 CSS

const Sidebar = () => {
    return (
        <aside className="hmk_sidebar-container">

            <div className="hmk_sidebar">
                <div className='ham_h1_title'>
                    <h1>나의 정보</h1>
                </div>
                <ul>
                    <li>
                        <img src={ChallengeIcon} alt="Challenge" className="hmk_sidebar-icon" />
                        <Link to="/user/mypage">나의 챌린지</Link>
                    </li>
                    <li>
                        <img src={FriendsIcon} alt="Friends" className="hmk_sidebar-icon" />
                        <Link to="#">친구</Link>
                    </li>
                    <li>
                        <img src={PointsIcon} alt="Points" className="hmk_sidebar-icon" />
                        <Link to="/user/mypoint">포인트 내역</Link>
                    </li>
                    <li>
                        <img src={InventoryIcon} alt="Inventory" className="hmk_sidebar-icon" />
                        <Link to="/user/cargo">보관함</Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
