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
import YCStep11 from '../yc_pages/YC_Step11'; 
// Step11은 우선 무시

import { FaHome, FaBullhorn, FaTasks, FaUpload, FaUserFriends, FaCogs } from 'react-icons/fa';

Modal.setAppElement('#root'); // 접근성 설정

const YCChallengeSidebar = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(2); // Step02부터 시작
    const [previousStep, setPreviousStep] = useState(null); // 이전 스텝 추적

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(2); // 모달 열 때 Step02로 설정
        setPreviousStep(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNext = (path = null) => {
        if (path) {
            // 특정 경로로 네비게이션 (예: Step09의 '/cmain')
            closeModal();
            navigate(path);
        } else {
            // 이전 스텝을 저장
            setPreviousStep(currentStep);
            // 다음 스텝으로 이동
            setCurrentStep((prev) => Math.min(prev + 1, 10)); // 최대 Step10까지
        }
    };

    const handlePrevious = () => {
        if (currentStep === 2) return; // Step02에서는 이전 단계로 가지 않음
        setCurrentStep((prev) => Math.max(prev - 1, 2)); // 최소 Step02로
    };

    // Step10의 취소 버튼을 위한 함수: 이전 스텝으로 돌아가기
    const handleStep10Cancel = () => {
        if (previousStep) {
            setCurrentStep(previousStep);
            setPreviousStep(null);
        } else {
            // 이전 스텝이 없을 경우, 모달 닫기
            closeModal();
        }
    };

    // Step10의 버리기와 저장하기 버튼을 위한 함수: 모달 닫기
    const handleStep10Discard = () => {
        closeModal();
    };

    const handleStep10Save = () => {
        navigate('/ycstep10');
    };

    // 현재 단계에 따라 렌더링할 컴포넌트 결정
    const renderStep = () => {
        switch (currentStep) {
            case 2:
                return <YCStep02 onSave ={handleStep10Save} onPrevious={handleStep10Discard}/>;
            case 3:
                return <YCStep03 onSave ={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 4:
                return <YCStep04 onSave ={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 5:
                return <YCStep05 onSave ={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 6:
                return <YCStep06 onSave ={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 7:
                return <YCStep07 onSave ={handleStep10Save} onPrevious={handleStep10Discard} />;
            
            case 10:
                return (
                    <YCStep10
                        onCancel={handleStep10Cancel}
                        onDiscard={handleStep10Discard}
                        onSave={handleStep10Save}
                    />
                );
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
                    <li className="yc_challenge_sidebar_notice">
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

            {/* 모달 구현 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="관리 및 방 생성 모달"
                className="custom-modal" // 사용자 정의 클래스
                overlayClassName="custom-overlay" // 사용자 정의 오버레이 클래스
            >
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
