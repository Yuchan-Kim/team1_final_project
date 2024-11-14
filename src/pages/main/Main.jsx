// src/pages/main/Main.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@rsuite/icons/Search';
import SendIcon from '@rsuite/icons/Send';
import Modal from 'react-modal';

// import '../../css/reset.css';
import '../../css/jy_main.css';

import Header from '../include/DH_Header';

// Step 컴포넌트들을 올바른 경로로 임포트
import Step01 from '../genebang/Step01';
import Step02 from '../genebang/Step02';
import Step03 from '../genebang/Step03';
import Step04 from '../genebang/Step04';
import Step05 from '../genebang/Step05';
import Step06 from '../genebang/Step06';
import Step07 from '../genebang/Step07';
import Step08 from '../genebang/Step08';
import Step09 from '../genebang/Step09';
import Step10 from '../genebang/Step10';
import Step11 from '../genebang/Step11';

// 접근성 설정
Modal.setAppElement('#root');

const Main = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(1);
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
        navigate('/'); // 원하는 경로로 변경 가능
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

    const [score, setScore] = useState([
        { item: "item1", score: 10, image: "/img/banner.jpg", title: "최근에 챌린지 1" },
        { item: "item2", score: 20, image: "/img/banner.jpg", title: "종료된 챌린지 2" },
        { item: "item3", score: 64, image: "/img/banner.jpg", title: "입니다 챌린지 3" }
    ]);

    return (
        <>
            <Header />

            <div id="jy_wrap" className="jy_wrap">
                <div className="jy_main" id="jy_main">
                    <div id="board">

                        <div id='search'>
                            <div><SearchIcon /><input placeholder='Search' /></div>
                        </div>
                        {/* //search */}

                        <div id='ad-banner'>
                            <img src="/img/banner.jpg" alt="banner" />
                        </div>
                        {/* //ad-banner */}

                        <div id='ad-bang'>
                            {score.map((item, idx) => (
                                <div className='ad-bang-list' key={idx}>

                                    <div className="ad-bang-image">
                                        <img src={item.image} alt={item.title} width="100" height="100" />
                                    </div> {/* 이미지 */}

                                    <div className="ad-bang-title">{item.title}</div> {/* 챌린지 제목 */}

                                    <div className="ad-bang-score">
                                        <svg className="circle_progress" width="60" height="60" viewBox="0 0 60 60">
                                            <circle className="frame" cx="30" cy="30" r="27" strokeWidth="6" />
                                            <circle className="bar" cx="30" cy="30" r="27" strokeWidth="6" />
                                        </svg>
                                        <strong className="value">{item.score}%</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* //ad-bang */}

                        <div id='icon-bar'>
                            <div>
                                <button className='jm-thema-button1'></button>
                                <span>운동</span>
                            </div>
                            <div>
                                <button className='jm-thema-button2'></button>
                                <span>독서</span>
                            </div>
                            <div>
                                <button className='jm-thema-button3'></button>
                                <span>스터디</span>
                            </div>
                            <div>
                                <button className='jm-thema-button4'></button>
                                <span>생활루틴</span>
                            </div>
                            <div>
                                <button className='jm-thema-button5'></button>
                                <span>취미</span>
                            </div>
                        </div> {/* //icon-bar */}

                        <div id="list">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i}>
                                    <Link to="/cmain" className='list_bang'>
                                        <div className='bang_level'>
                                            <div>챌린지 / 일반</div>
                                        </div>

                                        <div className='bang_img'>
                                            <img src="/img/banner.jpg" alt="bang-banner" />
                                        </div>

                                        <div className='jm-main-room-tatle'>대상혁찬양방</div>
                                        <div className='jm-main-room-date'><span>예상시작일</span> 2024-11-11</div>
                                        <div className='jm-main-room-date'><span>기간</span> 4주</div>
                                        <div className='bang_info'>
                                            <div className='bang_info_left'>
                                                <div><span>인원</span> 1/20</div>
                                            </div>
                                            <div className='bang_info_right'>
                                                <div><span>포인트</span> ALL-IN pt</div>
                                            </div>
                                        </div>

                                        <div className='bang_sub'>
                                            <span className="tab01">#운동</span>
                                            <span className="tab01">#달리기</span>
                                            <span className="tab01">#전국</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        {/* //list */}

                        {/* 모달 열기 버튼 복구 */}
                        <div className="btn">
                            <button id="secondary" onClick={openModal}>
                                <span>
                                    <SendIcon size="5em" /><br />
                                    방 생성
                                </span>
                            </button>
                        </div>

                    </div>
                    {/* //board */}
                </div>
                {/* //main */}
            </div>
            {/* //wrap */}

            {/* 모달 구현 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="방 생성 모달"
                className="custom-modal" // 사용자 정의 클래스
                overlayClassName="custom-overlay" // 사용자 정의 오버레이 클래스
            >
                <div className="modal-header">
                    {currentStep !== 10 && (
                        <button onClick={() => setCurrentStep(10)} className="modal-close-button">닫기</button>
                    )}
                </div>
                <div className="modal-content">
                    {renderStep()}
                </div>
            </Modal>
        </>
    )
    };

    export default Main;
