// src/components/YCChallengeSidebar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

import '../yc_assets/yc_css/yc_css_challenge_sidebar.css';

import { FaHome, FaBullhorn, FaTasks, FaUpload, FaUserFriends, FaCogs } from 'react-icons/fa';

Modal.setAppElement('#root');

const YCChallengeSidebar = () => {
    const navigate = useNavigate();
    const { roomNum } = useParams();

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(2);
    const [previousStep, setPreviousStep] = useState(null);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [exitModalMessage, setExitModalMessage] = useState('');
    const [exitModalType, setExitModalType] = useState('');

    // 방 상태 및 사용자 권한 상태 관리
    const [roomStatusNum, setRoomStatusNum] = useState(null);
    const [enteredUserAuth, setEnteredUserAuth] = useState(null);
    const [enteredUserStatusNum, setEnteredUserStatusNum] = useState(null); // 추가
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const isExitDisabled = !(enteredUserStatusNum === 1 && enteredUserAuth !== null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                // 토큰이 없는 경우 enteredUserAuth와 enteredUserStatusNum을 null로 설정
                setEnteredUserAuth(null);
                setRoomStatusNum(null);
                setEnteredUserStatusNum(null);
                setIsLoading(false);
                return;
            }

            try {
                // roomHeaderInfo 가져오기
                const roomHeaderResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/header/${roomNum}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (roomHeaderResponse.data.result === 'success') {
                    const headerInfo = roomHeaderResponse.data.apiData;
                    setRoomStatusNum(headerInfo.roomStatusNum);
                    setEnteredUserStatusNum(headerInfo.enteredUserStatusNum);
                } else {
                    console.error('Failed to get room header info:', roomHeaderResponse.data.message);
                    setError('방 헤더 정보를 가져오는 데 실패했습니다.');
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
                    setError('사용자 권한을 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                // 인증 관련 오류 처리 (401, 403) 시 별도의 처리 필요
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [roomNum]);

    // 모달 열기 함수
    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(2);
        setPreviousStep(null);
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 다음 단계로 이동하거나 특정 경로로 네비게이션
    const handleNext = (path = null) => {
        if (path) {
            closeModal();
            navigate(path);
        } else {
            setPreviousStep(currentStep);
            setCurrentStep((prev) => Math.min(prev + 1, 10));
        }
    };

    // 이전 단계로 이동
    const handlePrevious = () => {
        if (currentStep === 2) return;
        setCurrentStep((prev) => Math.max(prev - 1, 2));
    };

    // 스텝 10 취소 핸들러
    const handleStep10Cancel = () => {
        if (previousStep) {
            setCurrentStep(previousStep);
            setPreviousStep(null);
        } else {
            closeModal();
        }
    };

    // 스텝 10 폐기 핸들러
    const handleStep10Discard = () => {
        closeModal();
    };

    // 스텝 10 저장 핸들러
    const handleStep10Save = () => {
        navigate('/ycstep10');
    };

    // 스텝 변경 핸들러
    const handleStepChange = (step) => {
        setCurrentStep(step);
    };

    // 특정 링크 클릭 시 이벤트 핸들러
    const handleLinkClick = (e) => {
        if (isDisabled) {
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
        if (enteredUserAuth === 1 && roomStatusNum === 1) {
            // 방 삭제
            setExitModalMessage('방을 나가시겠습니까? 방이 삭제됩니다.');
            setExitModalType('delete');
        } else if (enteredUserAuth === 2 && (roomStatusNum === 2 || roomStatusNum === 3)) {
            // 챌린지를 그만두기
            setExitModalMessage('챌린지를 그만 두시겠습니까?');
            setExitModalType('leave');
        } else if (enteredUserAuth === 1 && (roomStatusNum === 2 || roomStatusNum === 3)) {
            // 방장 권한 위임과 함께 방 나가기
            setExitModalMessage('챌린지를 그만 두시겠습니까? 방장을 다른 사용자에게 위임합니다.');
            setExitModalType('transfer');
        } else {
            // 기타 상태 처리 (필요 시 추가)
            return;
        }
        setIsExitModalOpen(true);
    };

    // 모달의 확인 버튼 클릭 핸들러 추가
    const handleExitConfirm = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/user/loginform');
            return;
        }
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
            } else if (exitModalType === 'transfer') {
                // 방장 권한 위임 및 방 나가기 API 호출
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/leave-room/${roomNum}`, null, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.result === 'success') {
                    alert('챌린지를 나가고 방장이 위임되었습니다.');
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

    const isDisabled = !(enteredUserAuth === 1 || (enteredUserAuth === 2 && (enteredUserStatusNum === 1 || enteredUserStatusNum === 2) && roomStatusNum > 2));

    return (
        <aside className="yc_challenge_sidebar">
            {/* 로딩 상태 표시 */}
            {isLoading ? (
                <div className="loading-spinner">로딩 중...</div>
            ) : (
                <>
                    {/* 에러 메시지 표시 */}
                    {error && <div className="yc_error_message">{error}</div>}

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
                                    title={isDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
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
                                    title={isDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
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
                                    title={isDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
                                >
                                    <FaUserFriends size={24} />
                                    <span className="menu-text">유저 현황</span>
                                </Link>
                            </li>

                            {/* 관리 메뉴: enteredUserAuth === 1인 관리자만 접근 가능 */}
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

                    {/* 관리 모달 */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="관리 및 방 생성 모달"
                        className="custom-modal"
                        overlayClassName="custom-overlay"
                    >
                        {/* 모달 내용 추가 */}
                        <div className="modal-content">
                            <h2>관리 기능</h2>
                            <button onClick={() => handleStepChange(3)}>스텝 변경</button>
                            <button onClick={closeModal}>닫기</button>
                        </div>
                    </Modal>

                    {/* 방 나가기 확인 모달 */}
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
                                        <button onClick={handleExitConfirm} aria-label="방 삭제 확인">삭제</button>
                                        <button onClick={closeExitModal} aria-label="방 삭제 취소">취소</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleExitConfirm} aria-label="방 나가기 확인">확인</button>
                                        <button onClick={closeExitModal} aria-label="방 나가기 취소">취소</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Modal>

                    {/* 푸터 버튼 */}
                    <div className="yc_challenge_footer-buttons">
                        <button className="yc_challenge_report-btn" title="신고" aria-label="신고">
                            신고
                        </button>
                        <div className={isExitDisabled ? 'disabled-link' : ''}>
                            <button 
                                className="yc_challenge_exit-btn" 
                                title="나가기" 
                                onClick={isExitDisabled ? null : handleExitClick} 
                                aria-label="방 나가기"
                                disabled={isExitDisabled}
                            >
                                나가기
                            </button>
                        </div>
                    </div>
                </>
            )}
        </aside>
    );

};

export default YCChallengeSidebar;
