// src/pages/genebang/Step05.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import '../css/reset.css';
import '../css/jy_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx'; // StepNav 임포트

const Step05 = ({ onSave, onPrevious }) => {
    const [value, setValue] = useState(null); // 초기값을 null로 설정
    const [selectedWeek, setSelectedWeek] = useState(null); // 선택된 주차를 추적할 상태 변수

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        return value && selectedWeek;
    };

    /*---날짜 제한 함수-----------------------------*/
    const tileDisabled = ({ date, view }) => {
        // 월별 뷰에서만 날짜 비활성화
        if (view === 'month') {
            const today = moment().startOf('day');
            const minDate = moment().add(2, 'days').startOf('day');
            return moment(date).isBefore(minDate);
        }
        return false;
    };

    /*---선택된 날짜 포맷---------------------------*/
    const formattedDate = value ? moment(value).format('YYYY-MM-DD') : '';

    /*---주차 클릭 핸들러----------------------------*/
    const handleWeekClick = (week) => {
        setSelectedWeek(week);
    };

    return (

        <>

            <div id="jy_step" className="jy_wrap">

                <div id="container">

                    <div className="step" id="step5">

                        <YCStepNav idx={3} /> {/* StepNav 포함 */}

                        <div id="board">

                            <div id="stepList">

                                <div id='list-head'>
                                    <h2>시간 날짜를 선택해주세요.</h2>
                                    <h4>챌린지 시작일은 오늘로부터 최소 이틀뒤부터 설정 합니다</h4>
                                </div>
                                <div id='list-head'>
                                    <h2>챌린지 기간을 설정해 주세요.</h2>
                                    <h4>챌린지를 진행할 기간을 설정합니다</h4>
                                </div>

                            </div>

                            <div id="stepList">

                                <div id='list-left'>
                                    <Calendar
                                        tileDisabled={tileDisabled}
                                        onChange={setValue}
                                        value={value}
                                        formatDay={(locale, date) => moment(date).format("DD")}
                                    />
                                    {formattedDate && (
                                        <div className="selected-date">
                                            선택된 날짜: {formattedDate}
                                        </div>
                                    )}
                                </div>

                                <div id='list-left'>
                                    <div id='week'>
                                        {['1 주간', '2 주간', '3 주간', '4 주간'].map((week, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleWeekClick(week)} // 항목 클릭 시 상태 업데이트
                                                className={selectedWeek === week ? 'selected' : ''}
                                            >
                                                {week} 챌린지 진행하기
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button 
                                    id="primary" 
                                    onClick={() => onSave()}

                                >
                                    저장
                                </button>
                            </div>

                        </div>
                        {/* //board */}

                    </div>
                    {/* //step */}

                </div>
                {/* //container */}

            </div>
            {/* //wrap */}

        </>

    );

}

export default Step05;
