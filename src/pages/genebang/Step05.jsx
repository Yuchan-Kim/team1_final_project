// Step05.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

const Step05 = ({ onNext, onPrevious }) => {
    const [value, onChange] = useState(null); // 초기값을 null로 설정
    const [selectedWeek, setSelectedWeek] = useState(null); // 선택된 주차를 추적할 상태 변수

    /*---라우터 관련-------------------------------*/
    const navigate = useNavigate();

    /*---이벤트 핸들러 -------------------------*/
    const handlePrevious = () => {
        navigate('/genebang/step4'); // "이전" 버튼을 이전 단계로 변경
    };
    const handleNext = () => {
        navigate('/genebang/step6');
    };

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

                {/* <Header /> */}
                {/* //header + //nav */}

                <div id="container">

                    {/* <div id="aside">

                    </div> */}
                    {/* //aside */}

                    <div className="step" id="step5">

                        <StepNav idx={5} />

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
                                        onChange={onChange}
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
                                                className={selectedWeek === week ? 'selected' : ''} // 선택된 항목에 'selected' 클래스 추가
                                            >
                                                {week} 챌린지 진행하기
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button id="secondary" onClick={onPrevious}>이전</button>
                                <button 
                                    id="primary" 
                                    onClick={onNext} 
                                    disabled={!isNextEnabled()}
                                    className={!isNextEnabled() ? 'disabled' : ''}
                                    aria-disabled={!isNextEnabled()}
                                    title={!isNextEnabled() ? '날짜와 주차를 모두 선택해주세요.' : ''}
                                >
                                    다음
                                </button>
                            </div>

                        </div>
                        {/* //board */}

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

export default Step05;
