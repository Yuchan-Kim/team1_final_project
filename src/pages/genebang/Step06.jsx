import { useParams } from 'react-router-dom'; // URL에서 roomNum 추출
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트
import Header from '../include/DH_Header';
import Footert from "../include/JM-Footer.jsx";

const Step06 = ({ onNext, onPrevious }) => {
    const { roomNum } = useParams(); // URL에서 roomNum 추출
    const navigate = useNavigate();

    /*---상태 관리-------------------------*/
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [evaluationType, setEvaluationType] = useState(null);

    // 방장 평가와 전체 평가 중 하나만 선택할 수 있도록 하는 함수
    const handleEvaluationClick = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setEvaluationType(evaluation === '방장 평가' ? 1 : 2); // 1: 방장 평가, 2: 전체 평가
    };

    // 요일 선택 / 취소 함수 (중복 선택 가능)
    const handleDayClick = (day) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((selectedDay) => selectedDay !== day) // 선택 해제
                : [...prevSelectedDays, day] // 선택 추가
        );
    };

    /*---버튼 활성화 조건---------------------------*/
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

    // 선택된 요일을 숫자 배열로 변환
    const roomDayNum = selectedDays.map((day) => dayMapping[day]);

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/genebang/step7`,
            {
                roomNum, // 방 번호
                evaluationType, // 평가 유형
                roomDayNum, // 요일 번호 배열
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 헤더 추가
                    'Content-Type': 'application/json', // JSON 형식
                },
            }
        );

        console.log("응답 데이터:", response.data);
        if (response.data.result === 'success') {
            alert("평가 정보가 저장되었습니다.");
            navigate(`/genebang/step7/${roomNum}`); // 다음 스텝으로 이동
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
        <Header/>
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step7">
                    <StepNav idx={6} /> {/* StepNav 포함 */}
                    {/* form 태그 제거 */}
                    <div id="board">
                        <div id="list">
                            <div id="question">
                                <div>
                                    <h2>평가 방법을 선택해주세요.</h2>
                                    <h4>미션 평가 방법을 선택할 수 있습니다.</h4>
                                </div>
                                <div>
                                    <h2>평가 요일을 선택해주세요.</h2>
                                    <h4>선택한 요일에 평가가 진행됩니다.</h4>
                                </div>
                            </div>

                            <div id="question">
                                <div id="category">
                                    <div
                                        onClick={() => handleEvaluationClick('방장 평가')}
                                        className={selectedEvaluation === '방장 평가' ? 'selected' : ''}
                                    >
                                        방장 평가
                                    </div>
                                    <div
                                        onClick={() => handleEvaluationClick('전체 평가')}
                                        className={selectedEvaluation === '전체 평가' ? 'selected' : ''}
                                    >
                                        전체 평가
                                    </div>
                                </div>
                                <div id="category">
                                    {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map((day) => (
                                        <div
                                            key={day}
                                            onClick={() => handleDayClick(day)}
                                            className={selectedDays.includes(day) ? 'selected' : ''}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="btn">
                            <button id="secondary" onClick={onPrevious}>
                                이전
                            </button>
                            <button
                                id="primary"
                                onClick={handleSubmit} // 클릭 이벤트로 변경
                                disabled={!isNextEnabled()}
                                className={!isNextEnabled() ? 'disabled' : ''}
                                aria-disabled={!isNextEnabled()}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footert/>
        </>
    );
};

export default Step06;
