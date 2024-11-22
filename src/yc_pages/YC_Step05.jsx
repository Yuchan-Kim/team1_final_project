// src/pages/genebang/Step05.jsx

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx';


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
        <div className="yc_jy_step">
            <div className="yc_container">
                <div className="yc_step" id="yc_step05">

                    <div id="yc_board">
                        <div id="yc_list">
                            <div id='yc_list_head'>
                                <h2>시간 날짜를 선택해주세요.</h2>
                                <h4>챌린지 시작일은 오늘로부터 최소 이틀뒤부터 설정 합니다</h4>
                            </div>
                            <div id='yc_list_head'>
                                <h2>챌린지 기간을 설정해 주세요.</h2>
                                <h4>챌린지를 진행할 기간을 설정합니다</h4>
                            </div>
                        </div>

                        <div id="yc_list">
                            <div id='yc_list_left'>
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

                            <div id='yc_list_left'>
                                <div id='yc_week'>
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
                        {/* //yc_list */}

                        <div className="yc_btn">
                            <button 
                                id="yc_primary" 
                                onClick={() => onSave()}
                                disabled={!isNextEnabled()}
                                className={!isNextEnabled() ? 'disabled' : ''}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                    {/* //yc_board */}
                </div>
                {/* //yc_step05 */}
            </div>
            {/* //yc_container */}
        </div>
        /* //yc_jy_step */
    );
}

export default Step05;
