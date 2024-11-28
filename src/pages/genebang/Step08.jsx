import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav';

const Step08 = ({ onNext, onPrevious }) => {
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

        // 성공 시 다음 단계로 이동
        navigate(`/genebang/step9/${roomNum}`);
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

// 방 참가 함수
const handleConfirmJoin = async () => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/challenge/join/${roomNum}`,
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
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div className="step" id="step8">
                        <StepNav idx={8} />
                        <div id="board">
                            <div id="list">
                                <h2>AI 추천 그룹 챌린지</h2>
                                <p>챌린지를 생성 중입니다. 잠시만 기다려주세요...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div className="step" id="step8">
                        <StepNav idx={8} />
                        <div id="board">
                            <div id="list">
                                <h2>AI 추천 그룹 챌린지</h2>
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step8">
                    <StepNav idx={8} />

                    <form onSubmit={handleSubmit} encType="application/json">
                        <div id="board">
                            <div id="list">
                                <h2>AI 추천 그룹 챌린지</h2>
                                <h4>사용자가 입력한 미션을 기반으로 그룹 챌린지를 제시합니다.</h4>
                                <h4>AI는 실수할 수 있습니다.</h4>

                                <div id="ai-select">
                                    {aiChallenges.map((challenge) => (
                                        <div
                                            key={challenge.id}
                                            id="ai-box"
                                            className={
                                                selectedBox === challenge.id
                                                    ? 'selected'
                                                    : selectedBox
                                                    ? 'disabled'
                                                    : ''
                                            }
                                        >
                                            <div id="ai-title">
                                                <div>
                                                    AI 추천 챌린지: {challenge.aiMission}
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAccept(challenge.id)}
                                                    disabled={
                                                        selectedBox !== null &&
                                                        selectedBox !== challenge.id
                                                    }
                                                >
                                                    {selectedBox === challenge.id
                                                        ? '취소'
                                                        : '수락'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="btn">
                                <button id="secondary" type="button" onClick={onPrevious}>
                                    이전
                                </button>
                                <button
                                    type="submit"
                                    id="primary"
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
    );
};

export default Step08;
