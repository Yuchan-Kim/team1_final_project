// src/components/YCChallengeSidebar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import SendIcon from '@rsuite/icons/Send';

import '../yc_assets/yc_css/yc_css_challenge_sidebar.css';

import YCStep02 from '../yc_pages/YC_Step02';
import YCStep03 from '../yc_pages/YC_Step03';
import YCStep04 from '../yc_pages/YC_Step04';
import YCStep05 from '../yc_pages/YC_Step05';
import YCStep06 from '../yc_pages/YC_Step06';
import YCStep07 from '../yc_pages/YC_Step07';
import YCStep10 from '../yc_pages/YC_Step10';
// Step11은 우선 무시

import { FaHome, FaBullhorn, FaTasks, FaUpload, FaUserFriends, FaCogs } from 'react-icons/fa';

import { YCStepNav } from '../yc_pages/YC_StepNav.jsx';

Modal.setAppElement('#root'); // 접근성 설정

const YCChallengeSidebar = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);


    const openModal = () => {
        setIsModalOpen(true);

    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    

    
    

    

    const handleStep10Save = () => {
        navigate('/ycstep10');
    };

    
    

    return (
        <aside className="yc_challenge_sidebar">
            {/* 메뉴 섹션 */}
            <nav className="yc_challenge_menu">
                <ul>
                    <li className="yc_challenge_sidebar_home">
                        <Link to="/cmain/:roomNum" aria-label="홈">
                            <FaHome size={24} />
                            <span className="menu-text">홈</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_notice">
                        <Link to="/board/:roomNum" aria-label="공지/유의 사항">
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
                        <Link to="/stat/:roomNum" aria-label="유저 현황">
                            <FaUserFriends size={24} />
                            <span className="menu-text">유저 현황</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_manage">
                        {/* "관리" 버튼을 클릭하면 모달 열기 */}
                        <Link onClick={openModal} aria-label="관리" className="manage-button">
                            <FaCogs size={24} />
                            <span className="menu-text">관리</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* 모달 구현 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="관리 및 방 생성 모달"
                className="custom-modal" // 사용자 정의 클래스
                overlayClassName="custom-overlay" // 사용자 정의 오버레이 클래스
            >
                <div className="modal-content">
                    <YCStepNav/>
                </div>
            </Modal>

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
