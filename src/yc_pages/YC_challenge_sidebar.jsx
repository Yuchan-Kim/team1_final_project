import React from "react";
import { Link } from 'react-router-dom';
import '../yc_assets/yc_css/yc_css_challenge_sidebar.css';
import { FaHome, FaBullhorn, FaTasks, FaUpload, FaUserFriends, FaClipboard, FaCogs } from 'react-icons/fa';

const YCChallengeSidebar = () => {
    return (
        <aside className="yc_challenge_sidebar">

            {/* 메뉴 섹션 */}
            <nav className="yc_challenge_menu">
                <ul>
                    <li className="yc_challenge_sidebar_home">
                        <Link to="/cmain" aria-label="홈">
                            <FaHome size={24} />
                            <span className="menu-text">홈</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_home">
                        <Link to="/board" aria-label="공지/유의 사항">
                            <FaBullhorn size={24} />
                            <span className="menu-text">공지사항</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_mission-detail">
                        <Link to="/missioninfo" aria-label="미션 상세">
                            <FaTasks size={24} />
                            <span className="menu-text">미션 히스토리 / 체점</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_submission-status">
                        <Link to="/mission" aria-label="제출 현황">
                            <FaUpload size={24} />
                            <span className="menu-text">미션 제출</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_user-status">
                        <Link to="/stat" aria-label="유저 현황">
                            <FaUserFriends size={24} />
                            <span className="menu-text">유저 현황</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_board">
                        <Link to="#" aria-label="게시판">
                            <FaClipboard size={24} />
                            <span className="menu-text">게시판</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_manage">
                        <Link to="#" aria-label="관리">
                            <FaCogs size={24} />
                            <span className="menu-text">관리</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* 푸터 버튼 섹션 */}
            <div className="yc_challenge_footer-buttons">
                <button className="yc_challenge_report-btn" title="신고">
                    신고
                </button>
                <button className="yc_challenge_exit-btn" title="나가기">
                    나가기
                </button>
            </div>
        </aside>
    );
};

export default YCChallengeSidebar;
