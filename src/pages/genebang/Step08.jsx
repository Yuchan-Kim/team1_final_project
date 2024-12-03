import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { StepNav } from '../include/StepNav';
import Footert from "../include/JM-Footer.jsx";
import '../css/Step09.css';
import '../css/Step08.css';
import '../../css/reset.css';

const Step08 = ({ onNext, onPrevious }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false); //step9 페이지 모달화 상태값

    const { roomNum } = useParams();

    const [selectedBox, setSelectedBox] = useState(null);
    const [aiChallenges, setAiChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 추천 AI 챌린지 생성
    useEffect(() => {
        const fetchDataAndGenerateChallenges = async () => {
            try {
                setLoading(true);
                const aiResponse = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/genebang/generateChallenges/${roomNum}`,
                    {}, // 빈 본문 전송
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const challenges = aiResponse.data.apiData;
                console.log('AI 생성된 챌린지: ', challenges);

                const challengesWithId = challenges.map((challenge, index) => ({
                    ...challenge,
                    id: index, // 고유 ID 추가
                }));

                setAiChallenges(challengesWithId);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('챌린지 생성 중 오류가 발생했습니다.');
                setError('새로고침 해주세요.');
                setLoading(false);
            }
        };

        fetchDataAndGenerateChallenges();
    }, [roomNum]);

    const handleAccept = (boxId) => {
        setSelectedBox((prevBox) => (prevBox === boxId ? null : boxId));
    };

    const isNextEnabled = () => selectedBox !== null;

    const extractEvaluationType = (aiMission) => {
        const match = aiMission.match(/\(([^)]+)\)$/);
        return match ? match[1] : '기타';
    };

    // 선택한 미션 데이터 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedBox === null) {
            alert('챌린지를 선택해주세요.');
            return;
        }

        // 선택된 챌린지 찾기
        const selectedChallenge = aiChallenges.find((ch) => ch.id === selectedBox);
        if (!selectedChallenge) {
            alert('선택한 챌린지를 찾을 수 없습니다.');
            return;
        }

        try {
            // 백엔드로 데이터 전송
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/genebang/saveOpenAiMission/${roomNum}`,
                null, // Request body는 없으므로 null 전달
                {
                    params: {
                        AiMission: selectedChallenge.aiMission, // AI가 생성한 미션 이름
                        Count: selectedChallenge.count,   // 반복 횟수
                        MissionName: selectedChallenge.missionName, // 사용자 정의 또는 미션 이름
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            console.log('저장 응답: ', response);

            // 미션이 성공적으로 저장되면 참가 함수 호출
            await handleConfirmJoin();

            setShowSuccessModal(true); // Step9로 이동하는 대신 성공 모달 표시
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('챌린지 저장 중 오류: ', error.response.data.message);
                alert(`챌린지 저장 중 오류가 발생했습니다: ${error.response.data.message}`);
            } else {
                console.error('챌린지 저장 중 오류: ', error);
                alert('챌린지 저장 중 오류가 발생했습니다.');
            }
        }
    };

    // 모달 핸들러 함수들
    const handleGoToMain = () => {
        navigate('/');
    };

    const handleGoToChallenge = () => {
        navigate(`/cmain/${roomNum}`);
    };


    // 방 참가 함수
    const handleConfirmJoin = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("토큰이 없습니다. 로그인하세요.");
            return; // 토큰이 없으면 요청을 보내지 않음
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/genebang/joinRoom/${roomNum}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.result === "success") {
                alert(response.data.message || "참가가 성공적으로 완료되었습니다.");
            } else {
                console.log(response.data.data);
                // message가 undefined인 경우 대비
                alert(response.data.message || "참가에 실패했습니다.");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('참가 중 오류 발생: ', error.response.data.message);
                alert(`참가 중 오류가 발생했습니다: ${error.response.data.message}`);
            } else {
                console.error('참가 중 오류 발생:', error);
                alert('참가 중 오류가 발생했습니다.');
            }
        }
    };




    if (loading) {
        return (
            <>
                <div id="jm-step8" className="jm-step8-wrap">
                    <div id="jm-step8-container">
                        <div className="jm-step8-step" id="jm-step8-step">
                            <StepNav idx={8} />
                            <div id="jm-step8-board">
                                <div id="jm-step8-list">
                                    <h2>AI 추천 그룹 챌린지</h2>
                                    <p>챌린지를 생성 중입니다. 잠시만 기다려주세요...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footert />
            </>
        );
    }

    if (error) {
        return (
            <>
                <div id="jm-step8" className="jm-step8-wrap">
                    <div id="jm-step8-container">
                        <div className="jm-step8-step" id="jm-step8-step">
                            <StepNav idx={8} />
                            <div id="jm-step8-board">
                                <div id="jm-step8-list">
                                    <h2>AI 추천 그룹 챌린지</h2>
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div id="jm-step8" className="jm-step8-wrap">
                <div id="jm-step8-container">
                    <div className="jm-step8-step" id="jm-step8-step">
                        <StepNav idx={8} />

                        <form onSubmit={handleSubmit} encType="application/json">
                            <div id="jm-step8-board">
                                <div id="jm-step8-list">
                                    <h2>AI 추천 그룹 챌린지</h2>
                                    <h4>사용자가 입력한 미션을 기반으로 그룹 챌린지를 제시합니다.</h4>
                                    <h4>AI는 실수할 수 있습니다.</h4>

                                    <div id="jm-step8-ai-select">
                                        {aiChallenges.map((challenge) => (
                                            <div
                                                key={challenge.id}
                                                id="jm-step8-ai-box"
                                                className={`jm-step8-ai-box ${
                                                    selectedBox === challenge.id
                                                        ? 'jm-step8-selected'
                                                        : selectedBox
                                                        ? 'jm-step8-disabled'
                                                        : ''
                                                }`}
                                                onClick={() => setSelectedBox(selectedBox === challenge.id ? null : challenge.id)} // 선택/취소 토글
                                            >
                                                <div id="jm-step8-ai-title">
                                                    <div>AI 추천 챌린지: {challenge.aiMission}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="jm-step8-btn">
                                    <button id="jm-step8-secondary" onClick={() => navigate(`/genebang/step7/${roomNum}`)}>이전</button>
                                    <button
                                        type="submit"
                                        id="jm-step8-primary"
                                        disabled={!isNextEnabled()}
                                    >
                                        다음
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* 성공 모달 */}
            {showSuccessModal && (
                <div className="jm-step8-step9-modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="jm-step8-step9-modal" onClick={e => e.stopPropagation()}>
                        <div className="jm-step8-step9-modal-content">
                            <div className="jm-step8-step9-modal-icon">✓</div>
                            <h2 className="jm-step8-step9-modal-title">챌린지 생성 완료</h2>
                            <p className="jm-step8-step9-modal-message">새로운 챌린지가 성공적으로 생성되었습니다.</p>
                            <div className="jm-step8-step9-modal-buttons">
                                <button 
                                    className="jm-step8-step9-modal-button secondary" 
                                    onClick={handleGoToMain}
                                >
                                    메인으로 가기
                                </button>
                                <button 
                                    className="jm-step8-step9-modal-button primary" 
                                    onClick={handleGoToChallenge}
                                >
                                    챌린지로 가기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footert />
        </>
    );
};

export default Step08;
