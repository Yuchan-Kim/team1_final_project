import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step08 = ({ onNext, onPrevious }) => {

    /*---상태 관리-------------------------*/
    const [selectedBox, setSelectedBox] = useState(null);
    const [aiChallenges, setAiChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*---라우터 네비게이션 -------------------------*/
    const navigate = useNavigate();

    /*---이벤트 핸들러 -------------------------*/
    const handleAccept = (boxId) => {
        if (selectedBox === boxId) {
            // 이미 선택된 박스면 선택 해제
            setSelectedBox(null);
        } else {
            // 새로운 박스 선택
            setSelectedBox(boxId);
        }
    };

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        return selectedBox !== null;
    };

    /*---컴포넌트 마운트 시 데이터 가져오기-------------------------*/
    useEffect(() => {
        const fetchDataAndGenerateChallenges = async () => {
            try {
                // 1. 백엔드에서 키워드와 미션 리스트 가져오기
                const keywordResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/genebang/getKeywords`);
                const missionListResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/genebang/getMissions`);

                const keywords = keywordResponse.data.keywords; // 예: ["건강", "운동"]
                const missions = missionListResponse.data.missions; // 예: [{ id: 1, name: "걷기 10,000보"}, ...]

                // 2. 백엔드에 AI 추천 챌린지 생성 요청
                const promptData = {
                    keywords: keywords,
                    missions: missions
                };

                const aiResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/generateChallenges`, promptData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // 필요한 경우 토큰 추가
                    }
                });

                const challenges = aiResponse.data.challenges; // 예: [{ id: 1, difficulty: "하", points: 200000, description: "..." }, ...]

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

    /*---챌린지 제출 핸들러-------------------------*/
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedBox === null) {
            alert('챌린지를 선택해주세요.');
            return;
        }

        const selectedChallenge = aiChallenges.find(ch => ch.id === selectedBox);

        const formData = new FormData();
        formData.append('evaluationType', selectedChallenge.difficulty); // 예시 필드
        formData.append('selectedChallengeId', selectedChallenge.id);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step8`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // 필요한 경우 토큰 추가
                },
            });
            console.log(response);
            // 다음 스텝으로 이동
            navigate('/genebang/step9');
        } catch (error) {
            console.error(error);
            alert('생성 중 오류가 발생했습니다.');
        }
    };

    /*---로딩 또는 에러 상태 처리-------------------------*/
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

    /*---UI 렌더링-------------------------*/
    return (
        <>
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div className="step" id="step8">
                        <StepNav idx={8} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                                    <div id='ai-point'>{challenge.points.toLocaleString()}pt</div>
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
                                {/* //list */}

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
                            {/* //board */}
                        
                        </form>

                    </div>
                    {/* //step */}
                </div>
                {/* //container */}
            </div>
            {/* //wrap */}
        </>
    );
}

export default Step08;
