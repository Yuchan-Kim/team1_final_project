// Step07.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

const Step07 = () => {

    // 방장 평가와 전체 평가 선택 상태
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    // 요일 선택 상태 (여러 개 선택 가능)
    const [selectedDays, setSelectedDays] = useState([]);

    // 방장 평가와 전체 평가 중 하나만 선택할 수 있도록 하는 함수
    const handleEvaluationClick = (evaluation) => {
        setSelectedEvaluation(evaluation);
    };

    // 요일 선택 / 취소 함수 (중복 선택 가능)
    const handleDayClick = (day) => {
        setSelectedDays((prevSelectedDays) => {
            if (prevSelectedDays.includes(day)) {
                // 이미 선택된 요일이면 제거
                return prevSelectedDays.filter((selectedDay) => selectedDay !== day);
            } else {
                // 선택되지 않은 요일이면 추가
                return [...prevSelectedDays, day];
            }
        });
    };

    /*---라우터 관련-------------------------------*/
    const navigate = useNavigate();

    /*---이벤트 핸들러 -------------------------*/
    const handlePrevious = () => {
        navigate('/genebang/step6'); // "이전" 버튼을 이전 단계로 변경
    };
    const handleNext = () => {
        navigate('/genebang/step8');
    };

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        if (!selectedEvaluation) return false;
        if (selectedDays.length === 0) return false;
        return true;
    };

    return (

        <>

            <div id="jy_step" className="jy_wrap">

                {/* <Header /> */}
                {/* //header + //nav */}

                <div id="container">

                    {/* <div id="aside">

                    </div> */}
                    {/* //aside */}

                    <div className="step" id="step7">

                        <StepNav idx={7} />

                        <div id="board">
                            <div id="list">
                                <div id='question'>
                                    <div>
                                        <h2>평가 방법을 선택해주세요.</h2>
                                        <h4>미션 평가 방법을 선택할 수 있습니다.</h4>
                                    </div>
                                    <div>
                                        <h2>평가 요일을 선택해주세요.</h2>
                                        <h4>선택한 요일에 평가가 진행됩니다.</h4>
                                    </div>
                                </div>

                                <div id='question'>
                                    <div id='category'>
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
                                    <div id='category'>
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
                            {/* //list */}

                            

                        </div>
                        {/* //board */}
                        <div className="btn">
                                <button id="secondary" onClick={handlePrevious}>이전</button>
                                <button 
                                    id="primary" 
                                    onClick={handleNext} 
                                    disabled={!isNextEnabled()}
                                    className={!isNextEnabled() ? 'disabled' : ''}
                                    aria-disabled={!isNextEnabled()}
                                >
                                    다음
                                </button>
                            </div>
                    </div>
                    {/* //step */}
                    
                </div>
                {/* //container */}

                {/* <Footer /> */}
                {/* //footer */}

            </div>
            {/* //wrap */}

        </>

    );

}

export default Step07;
