import { useParams } from 'react-router-dom'; // URL에서 roomNum 추출
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StepNav } from '../include/StepNav'; // StepNav 임포트
import Footert from "../include/JM-Footer.jsx";

import '../../css/reset.css';
import '../css/Step06.css';

const Step06 = ({ onNext, onPrevious }) => {
    const { roomNum } = useParams(); // URL에서 roomNum 추출
    const navigate = useNavigate();

    /*---상태 관리-------------------------*/
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [evaluationType, setEvaluationType] = useState(null);

    const handleEvaluationClick = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setEvaluationType(evaluation === '방장 평가' ? 1 : 2);
    };

    const handleDayClick = (day) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((selectedDay) => selectedDay !== day)
                : [...prevSelectedDays, day]
        );
    };

    const isNextEnabled = () => {
        return selectedEvaluation && selectedDays.length > 0;
    };

    const handleSubmit = async () => {
        if (!isNextEnabled()) {
            alert("평가 방법과 요일을 모두 선택해주세요.");
            return;
        }

        const token = localStorage.getItem('token'); // 인증 토큰 가져오기
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        const dayMapping = {
            "월요일": 1,
            "화요일": 2,
            "수요일": 3,
            "목요일": 4,
            "금요일": 5,
            "토요일": 6,
            "일요일": 7,
        };

        const roomDayNum = selectedDays.map((day) => dayMapping[day]);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/genebang/step7`,
                {
                    roomNum,
                    evaluationType,
                    roomDayNum,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("응답 데이터:", response.data);
            if (response.data.result === 'success') {
                alert("평가 정보가 저장되었습니다.");
                navigate(`/genebang/step7/${roomNum}`);
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error("데이터 전송 중 오류 발생:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
        <div id="jm-step6" className="jm-step6-wrap">
            <div id="jm-step6-container">
                    <StepNav idx={6} />
                    <div id="jm-step6-board">
                            <div id="jm-step6-question">
                                <div>
                                    <h2>평가 방법을 선택해주세요.</h2>
                                    <h4>미션 평가 방법을 선택할 수 있습니다.</h4>
                                    <div id="jm-step6-category">
                                        <div
                                            onClick={() => handleEvaluationClick('방장 평가')}
                                            className={selectedEvaluation === '방장 평가' ? 'jm-step6-selected' : ''}
                                        >
                                            방장 평가
                                        </div>
                                        <div
                                            onClick={() => handleEvaluationClick('전체 평가')}
                                            className={selectedEvaluation === '전체 평가' ? 'jm-step6-selected' : ''}
                                        >
                                            전체 평가
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2>평가 요일을 선택해주세요.</h2>
                                    <h4>선택한 요일에 평가가 진행됩니다.</h4>
                                    <div id="jm-step6-category">
                                        {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map((day) => (
                                            <div
                                                key={day}
                                                onClick={() => handleDayClick(day)}
                                                className={selectedDays.includes(day) ? 'jm-step6-selected' : ''}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="jm-step6-btn">
                            <button id="jm-step6-secondary" onClick={() => navigate(`/genebang/step5/${roomNum}`)}>이전</button>
                            <button
                                id="jm-step6-primary"
                                onClick={handleSubmit}
                                disabled={!isNextEnabled()}
                                className={!isNextEnabled() ? 'jm-step6-disabled' : ''}
                                aria-disabled={!isNextEnabled()}
                            >
                                다음
                            </button>
                        </div>
                    </div>
            </div>
        <Footert/>
        </>
    );
};

export default Step06;
