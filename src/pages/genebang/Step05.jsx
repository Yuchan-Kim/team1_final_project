// src/pages/genebang/Step05.jsx


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import TimePicker from 'react-time-picker';


import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step05 = ({ onNext, onPrevious }) => {

    const navigate = useNavigate();

    const authUserNum = 10;
    // const authUser = JSON.parse(localStorage.getItem('authUser'));

    const [roomNum, setRoomNum] = useState();


    const [value, setValue] = useState(new Date());
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

    /*---주차 클릭 핸들러----------------------------*/
    const handleWeekClick = (week) => {
        setSelectedWeek(week);
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append('roomNum', roomNum);
        // formData.append('roomStartDate', value.toISOString()); //시작 날짜
        
        formData.append('roomStartDate', moment(value).format('YYYY-MM-DD HH:mm'));


        const weekNumber = parseInt(selectedWeek.charAt(0));
        formData.append('periodNum', weekNumber); //기간


        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step5`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                navigate('/genebang/step6');
            })
            .catch(error => {
                console.error(error);
                alert('생성 중 오류가 발생했습니다.');
            });

    };



    useEffect( ()=>{

        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/genebang/checkroom/${authUserNum}`,

            responseType: 'json' //수신타입
        }).then(response => {
            console.log(response.data); //수신데이타
            setRoomNum( response.data.apiData );
            console.log(roomNum);

        }).catch(error => {
            console.log(error);
            alert('생성 중인 방이 없습니다')
            navigate('/');
        });

    }, [] );




    return (
        <>
            <div id="jy_step" className="jy_wrap">

                <div id="container">

                    <div className="step" id="step5">

                        <StepNav idx={5} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">

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
                                        {/* <Calendar
                                            tileDisabled={tileDisabled}
                                            onChange={setValue}
                                            value={value}
                                            formatDay={(locale, date) => moment(date).format("DD")}
                                            locale="ko-KR"
                                            weekStartsOn={0}
                                            calendarType = "gregory"
                                        /> */}
                                        <DatePicker 
                                            selected={value}
                                            onChange={(date) => setValue(date)}
                                            showTimeSelect
                                            timeIntervals={15}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            inline
                                            minDate={new Date()} 
                                        />
                                        {value && (
                                            <div className="selected-date">
                                                선택된 날짜: {moment(value).format('YYYY-MM-DD HH:mm')}
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

                                <div className="btn">
                                    <button id="secondary" onClick={onPrevious}>이전</button>
                                    <button 
                                        type="submit"
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

                        </form>

                    </div>

                </div>

            </div>

        </>

    );

}

export default Step05;
