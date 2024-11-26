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

    useEffect(() => {
        const fetchDataAndGenerateChallenges = async () => {
            try {
                setLoading(true);
                const aiResponse = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/genebang/generateChallenges/${roomNum}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const challenges = aiResponse.data.apiData; // JsonResult로 받은 data 사용
                setAiChallenges(challenges);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('챌린지 생성 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchDataAndGenerateChallenges();
    }, []);

    const handleAccept = (boxId) => {
        if (selectedBox === boxId) {
            setSelectedBox(null);
        } else {
            setSelectedBox(boxId);
        }
    };

    const isNextEnabled = () => selectedBox !== null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedBox === null) {
            alert('챌린지를 선택해주세요.');
            return;
        }

        const selectedChallenge = aiChallenges.find(ch => ch.id === selectedBox);

        const selectedData = {
            evaluationType: selectedChallenge.difficulty,
            selectedChallengeId: selectedChallenge.id
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/genebang/saveOpenAiMission`,
                selectedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                }
            );

            console.log(response);
            navigate('/genebang/step9');
        } catch (error) {
            console.error(error);
            alert('생성 중 오류가 발생했습니다.');
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

                                <div id='ai-select'>
                                    {aiChallenges.map((challenge) => (
                                        <div
                                            key={challenge.id}
                                            id='ai-box'
                                            className={selectedBox === challenge.id ? 'selected' : selectedBox ? 'disabled' : ''}
                                        >
                                            <div id='ai-title'>
                                                <div>AI 추천 챌린지 (난이도: {challenge.difficulty})</div>
                                                <div id='ai-point'>
                                                    {challenge.points?.toLocaleString() || '포인트 정보 없음'}pt
                                                </div>
                                            </div>
                                            <div>{challenge.description}</div>
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAccept(challenge.id)}
                                                    disabled={selectedBox !== null && selectedBox !== challenge.id}
                                                >
                                                    {selectedBox === challenge.id ? '취소' : '수락'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="btn">
                                <button id="secondary" type="button" onClick={onPrevious}>이전</button>
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
}

export default Step08;
