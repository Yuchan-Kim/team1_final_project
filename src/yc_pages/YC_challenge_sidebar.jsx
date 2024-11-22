// src/components/YCChallengeSidebar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

import '../yc_assets/yc_css/yc_css_challenge_sidebar.css';

import YCStep02 from '../yc_pages/YC_Step02';
import YCStep03 from '../yc_pages/YC_Step03';
import YCStep04 from '../yc_pages/YC_Step04';
import YCStep05 from '../yc_pages/YC_Step05';
import YCStep06 from '../yc_pages/YC_Step06';
import YCStep07 from '../yc_pages/YC_Step07';
import YCStep10 from '../yc_pages/YC_Step10';

import { FaHome, FaBullhorn, FaTasks, FaUpload, FaUserFriends, FaCogs } from 'react-icons/fa';

import { YCStepNav } from '../yc_pages/YC_StepNav.jsx';

Modal.setAppElement('#root');

const YCChallengeSidebar = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(2);
    const [previousStep, setPreviousStep] = useState(null);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [exitModalMessage, setExitModalMessage] = useState('');
    const [exitModalType, setExitModalType] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(2);
        setPreviousStep(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const { roomNum } = useParams();

    const [roomStatusNum, setRoomStatusNum] = useState(null);
    const [enteredUserAuth, setEnteredUserAuth] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                // roomStatusNum 가져오기
                const roomInfoResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/header/${roomNum}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (roomInfoResponse.data.result === 'success') {
                    setRoomStatusNum(roomInfoResponse.data.apiData.roomStatusNum);
                } else {
                    console.error('Failed to get room info:', roomInfoResponse.data.message);
                }

                // enteredUserAuth 가져오기
                const userAuthResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (userAuthResponse.data.result === 'success') {
                    setEnteredUserAuth(userAuthResponse.data.apiData);
                } else {
                    console.error('Failed to get user auth:', userAuthResponse.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [roomNum]);

    const handleNext = (path = null) => {
        if (path) {
            closeModal();
            navigate(path);
        } else {
            setPreviousStep(currentStep);
            setCurrentStep((prev) => Math.min(prev + 1, 10));
        }
    };

    const handlePrevious = () => {
        if (currentStep === 2) return;
        setCurrentStep((prev) => Math.max(prev - 1, 2));
    };

    const handleStep10Cancel = () => {
        if (previousStep) {
            setCurrentStep(previousStep);
            setPreviousStep(null);
        } else {
            closeModal();
        }
    };

    const handleStep10Discard = () => {
        closeModal();
    };

    const handleStep10Save = () => {
        navigate('/ycstep10');
    };

    const handleStepChange = (step) => {
        setCurrentStep(step);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 2:
                return <YCStep02 onSave={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 3:
                return <YCStep03 onSave={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 4:
                return <YCStep04 onSave={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 5:
                return <YCStep05 onSave={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 6:
                return <YCStep06 onSave={handleStep10Save} onPrevious={handleStep10Discard} />;
            case 7:
                return <YCStep07 onSave={handleStep10Save} onPrevious={handleStep10Discard} />;
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

    // 특정 링크 클릭 시 이벤트 핸들러
    const handleLinkClick = (e) => {
        if ((roomStatusNum === 1 || roomStatusNum === 2) && enteredUserAuth === 2) {
            e.preventDefault();
        }
    };

    // 관리 메뉴 클릭 시 이벤트 핸들러
    const handleManageClick = (e) => {
        if (!(enteredUserAuth === 1 && (roomStatusNum === 1 || roomStatusNum === 2))) {
            e.preventDefault();
        } else {
            openModal();
        }
    };

    // "나가기" 버튼 클릭 핸들러 추가
    const handleExitClick = () => {
        if (roomStatusNum === 1) {
            // 방이 삭제됨
            setExitModalMessage('방을 나가시겠습니까? 방이 삭제됩니다.');
            setExitModalType('delete');
        } else if (roomStatusNum === 2) {
            // 챌린지를 그만둠
            setExitModalMessage('챌린지를 그만 두시겠습니까?');
            setExitModalType('leave');
        } else if (roomStatusNum === 3) {
            // 챌린지를 그만두면 페널티
            setExitModalMessage('챌린지를 그만 두시겠습니까? 도중에 그만두게 되면 페널티를 얻습니다. (달성률 관한 포인트 적립 불가)');
            setExitModalType('penalty');
        } else {
            // 다른 상태 처리 (필요시)
            return;
        }
        setIsExitModalOpen(true);
    };
    // 모달의 확인 버튼 클릭 핸들러 추가
const handleExitConfirm = async () => {
    const token = localStorage.getItem('token');
    try {
        if (exitModalType === 'delete') {
            // 방 삭제 API 호출
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/challenge/delete-room/${roomNum}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.result === 'success') {
                alert('방이 삭제되었습니다.');
                navigate('/'); // 메인 페이지로 이동
            } else {
                alert('방 삭제에 실패했습니다.');
            }
        } else if (exitModalType === 'leave' || exitModalType === 'penalty') {
            // 방 나가기 API 호출
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/leave-room/${roomNum}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.result === 'success') {
                alert('챌린지를 나갔습니다.');
                navigate('/'); // 메인 페이지로 이동
            } else {
                alert('챌린지 나가기에 실패했습니다.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버와의 통신에 실패했습니다.');
    } finally {
        setIsExitModalOpen(false);
    }
};

// 모달 닫기 핸들러
const closeExitModal = () => {
    setIsExitModalOpen(false);
};

    // 상태 변수 정의
    const isDisabled = (roomStatusNum === 1 || roomStatusNum === 2) && enteredUserAuth === 2;

    return (
        <aside className="yc_challenge_sidebar">
            <nav className="yc_challenge_menu">
                <ul>
                    <li className="yc_challenge_sidebar_home">
                        <Link to={`/cmain/${roomNum}`} aria-label="홈">
                            <FaHome size={24} />
                            <span className="menu-text">홈</span>
                        </Link>
                    </li>
                    <li className="yc_challenge_sidebar_notice">
                        <Link to={`/board/${roomNum}`} aria-label="공지/유의 사항">
                            <FaBullhorn size={24} />
                            <span className="menu-text">공지사항</span>
                        </Link>
                    </li>
                    <li className={`yc_challenge_sidebar_mission-detail ${isDisabled ? 'disabled' : ''}`}>
                        <Link
                            to={`/missioninfo/${roomNum}`}
                            aria-label="미션 상세"
                            onClick={handleLinkClick}
                            className={isDisabled ? 'disabled-link' : ''}
                        >
                            <FaTasks size={24} />
                            <span className="menu-text">미션 히스토리 / 채점</span>
                        </Link>
                    </li>
                    <li className={`yc_challenge_sidebar_submission-status ${isDisabled ? 'disabled' : ''}`}>
                        <Link
                            to={`/mission/${roomNum}`}
                            aria-label="제출 현황"
                            onClick={handleLinkClick}
                            className={isDisabled ? 'disabled-link' : ''}
                        >
                            <FaUpload size={24} />
                            <span className="menu-text">미션 제출</span>
                        </Link>
                    </li>
                    <li className={`yc_challenge_sidebar_user-status ${isDisabled ? 'disabled' : ''}`}>
                        <Link
                            to={`/stat/${roomNum}`}
                            aria-label="유저 현황"
                            onClick={handleLinkClick}
                            className={isDisabled ? 'disabled-link' : ''}
                        >
                            <FaUserFriends size={24} />
                            <span className="menu-text">유저 현황</span>
                        </Link>
                    </li>

                    {/* 관리 메뉴 */}
                    {(enteredUserAuth === 1 && (roomStatusNum === 1 || roomStatusNum === 2)) && (
                        <li className="yc_challenge_sidebar_manage">
                            <Link
                                onClick={handleManageClick}
                                aria-label="관리"
                                className="manage-button"
                            >
                                <FaCogs size={24} />
                                <span className="menu-text">관리</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="관리 및 방 생성 모달"
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <div className="modal-content">
                    <YCStepNav currentStep={currentStep} onStepChange={handleStepChange} />
                    {renderStep()}
                </div>
            </Modal>

            <Modal
                isOpen={isExitModalOpen}
                onRequestClose={closeExitModal}
                contentLabel="나가기 확인 모달"
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <div className="modal-content">
                    <p>{exitModalMessage}</p>
                    <div className="modal-buttons">
                        {exitModalType === 'delete' ? (
                            <>
                                <button onClick={handleExitConfirm}>삭제</button>
                                <button onClick={closeExitModal}>취소</button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleExitConfirm}>확인</button>
                                <button onClick={closeExitModal}>취소</button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>

            <div className="yc_challenge_footer-buttons">
                <button className="yc_challenge_report-btn" title="신고">
                    신고
                </button>
                <button className="yc_challenge_exit-btn" title="나가기" onClick={handleExitClick}>
                    나가기
                </button>
            </div>
        </aside>

        
    );
};

export default YCChallengeSidebar;
