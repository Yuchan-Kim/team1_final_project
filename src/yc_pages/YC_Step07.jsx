// src/pages/genebang/Step07.jsx

import React, { useState } from 'react';
import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx'; // StepNav 임포트

const Step07 = ({ onSave, onPrevious }) => {

    /*---상태 관리-------------------------*/
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
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

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        if (!selectedEvaluation) return false;
        if (selectedDays.length === 0) return false;
        return true;
    };

    return (
        <>
            <div id="yc_jy_step" className="yc_jy_wrap">
                <div className="yc_container">
                    <div className="yc_step" id="yc_step7">
                        <YCStepNav idx={5} /> {/* StepNav 포함 */}
                        <div id="yc_board">
                            <div id="yc_list">
                                <div id='yc_question'>
                                    <div>
                                        <h2>평가 방법을 선택해주세요.</h2>
                                        <h4>미션 평가 방법을 선택할 수 있습니다.</h4>
                                    </div>
                                    <div>
                                        <h2>평가 요일을 선택해주세요.</h2>
                                        <h4>선택한 요일에 평가가 진행됩니다.</h4>
                                    </div>
                                </div>

                                <div id='yc_question'>
                                    <div id='yc_category'>
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
                                    <div id='yc_category'>
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
                            {/* //yc_list */}

                        </div>
                        {/* //yc_board */}
                        <div className="yc_btn">
                            <button 
                                id="yc_primary" 
                                onClick={() => onSave()}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                    {/* //yc_step7 */}
                </div>
                {/* //yc_container */}
            </div>
            {/* //yc_jy_step */}
        </>
    );

}

export default Step07;
