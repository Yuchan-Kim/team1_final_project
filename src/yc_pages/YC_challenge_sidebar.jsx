import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../yc_assets/yc_css/yc_css_challenge_sidebar.css';

const YCChallengeSidebar = () => {
    // 사이드바 메뉴 상태 관리
    const [isMissionOpen, setIsMissionOpen] = useState(false);
    const [isCommunityOpen, setIsCommunityOpen] = useState(false);

    const toggleMission = () => setIsMissionOpen(!isMissionOpen);
    const toggleCommunity = () => setIsCommunityOpen(!isCommunityOpen);

    return (
        <aside className="yc_challenge_sidebar">
            {/* 프로필 섹션 */}
            <div className="yc_challenge_profile-section">
                <div className="yc_challenge_profile-pic-section">
                    <img src="https://via.placeholder.com/100" className="yc_challenge_profile-pic" alt="Profile Pic" />
                </div>
                <div className="yc_challenge_profile-info_logoutBtn">
                    <h3 className="yc_challenge_username">김유찬</h3>
                    <p className="yc_challenge_points">Point 3600</p>
                    <button className="yc_challenge_logout-btn">로그아웃</button>
                </div>
            </div>

            {/* 메뉴 섹션 */}
            <nav className="yc_challenge_menu">
                <ul>
                    <li className="yc_challenge_sidebar_home"><Link to="/cmain">홈</Link></li>
                    <li className="yc_challenge_sidebar_home"><Link to="/board">공지/유의 사항</Link></li>
                    <li className="yc_challenge_sidebar_mission" onClick={toggleMission}>
                        미션
                    </li>
                    {isMissionOpen && (
                        <>
                            <li className="yc_challenge_sidebar_mission-detail">
                                <Link to="/missioninfo">미션 상세</Link>
                            </li>
                            <li className="yc_challenge_sidebar_submission-status">
                                <Link to="/mission">제출 현황</Link>
                            </li>
                        </>
                    )}
                    <li className="yc_challenge_sidebar_community" onClick={toggleCommunity}>
                        커뮤니티
                    </li>
                    {isCommunityOpen && (
                        <>
                            <li className="yc_challenge_sidebar_user-status">
                                <Link to="/stat">유저 현황</Link>
                            </li>
                            <li className="yc_challenge_sidebar_board">
                                <Link to="#">게시판</Link>
                            </li>
                        </>
                    )}
                    <li className="yc_challenge_sidebar_manage"><Link to="#">관리</Link></li>
                </ul>
            </nav>

            {/* 푸터 버튼 섹션 */}
            <div className="yc_challenge_footer-buttons">
                <button className="yc_challenge_report-btn">신고</button>
                <button className="yc_challenge_exit-btn">Exit</button>
            </div>
        </aside>
    );
};

export default YCChallengeSidebar;
