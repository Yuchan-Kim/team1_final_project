// src/components/YCChallengeSidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import SendIcon from '@rsuite/icons/Send';

import '../yc_assets/yc_css/yc_css_challenge_sidebar.css';

import Step01 from '../pages/genebang/Step01';
import Step02 from '../pages/genebang/Step02';
import Step03 from '../pages/genebang/Step03';
import Step04 from '../pages/genebang/Step04';
import Step05 from '../pages/genebang/Step05';
import Step06 from '../pages/genebang/Step06';
import Step07 from '../pages/genebang/Step07';
import Step08 from '../pages/genebang/Step08';
import Step09 from '../pages/genebang/Step09';
import Step10 from '../pages/genebang/Step10';
import Step11 from '../pages/genebang/Step11';

import { FaHome, FaBullhorn, FaTasks, FaUpload, FaUserFriends, FaCogs } from 'react-icons/fa';

Modal.setAppElement('#root'); // 접근성 설정

const YCChallengeSidebar = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(2); // Step02부터 시작

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(2); // 모달 열 때 Step02로 설정
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 11)); // 최대 11단계
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1)); // 최소 1단계
    };

    // Step10의 취소 버튼을 위한 함수: 이전 화면으로 이동
    const handleStep10Cancel = () => {
        closeModal();
    };

    // Step10의 버리기와 저장하기 버튼을 위한 함수: 모달 닫기
    const handleStep10Discard = () => {
        closeModal();
    };

    const handleStep10Save = () => {
        closeModal();
    };

    // 현재 단계에 따라 렌더링할 컴포넌트 결정
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step01 onNext={handleNext} onCancel={closeModal} />;
            case 2:
                return <Step02 onNext={handleNext} onPrevious={handlePrevious} />;
            case 3:
                return <Step03 onNext={handleNext} onPrevious={handlePrevious} />;
            case 4:
                return <Step04 onNext={handleNext} onPrevious={handlePrevious} />;
            case 5:
                return <Step05 onNext={handleNext} onPrevious={handlePrevious} />;
            case 6:
                return <Step06 onNext={handleNext} onPrevious={handlePrevious} />;
            case 7:
                return <Step07 onNext={handleNext} onPrevious={handlePrevious} />;
            case 8:
                return <Step08 onNext={handleNext} onPrevious={handlePrevious} />;
            case 9:
                return <Step09 onNext={handleNext} onPrevious={handlePrevious} />;
            case 10:
                return (
                    <Step10
                        onCancel={handleStep10Cancel}
                        onDiscard={handleStep10Discard}
                        onSave={handleStep10Save}
                    />
                );
            case 11:
                return <Step11 onPrevious={handlePrevious} closeModal={closeModal} />;
            default:
                return null;
        }
    };

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
                    <li className="yc_challenge_sidebar_manage">
                        {/* "관리" 버튼을 클릭하면 모달 열기 */}
                        <Link onClick={openModal} aria-label="관리" className="manage-button">
                            <FaCogs size={24} />
                            <span className="menu-text">관리</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* 방 생성 버튼 */}
            

            {/* 모달 구현 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="관리 모달"
                className="custom-modal" // 사용자 정의 클래스
                overlayClassName="custom-overlay" // 사용자 정의 오버레이 클래스
            >
                <div className="modal-header">
                    {/* "닫기" 버튼을 Step02부터 활성화 */}
                    {currentStep > 1 && currentStep !== 10 && (
                        <button onClick={() => setCurrentStep(10)} className="modal-close-button">닫기</button>
                    )}
                </div>
                <div className="modal-content">
                    {renderStep()}
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
