import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { StepNav } from '../include/StepNav'; // StepNav 임포트
import Footert from "../include/JM-Footer.jsx";

import '../../css/reset.css';

const Step05 = ({ onNext, onPrevious }) => {
    const navigate = useNavigate();
    const { roomNum } = useParams(); // URL에서 roomNum 추출
    const [value, setValue] = useState(null); // 선택된 날짜
    const [selectedWeek, setSelectedWeek] = useState(null); // 선택된 주차
    const [selectedTime, setSelectedTime] = useState(''); // 선택된 시간

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        return value && selectedWeek && selectedTime;
    };

    /*---날짜 제한 함수-----------------------------*/
    const tileDisabled = ({ date, view }) => {
        // 월별 뷰에서만 날짜 비활성화
        if (view === 'month') {
            const minDate = moment().add(2, 'days').startOf('day');
            return moment(date).isBefore(minDate);
        }
        return false;
    };

    /*---주차 클릭 핸들러----------------------------*/
    const handleWeekClick = (index) => {
        setSelectedWeek(index + 1); // 주차를 숫자로 저장
    };

    /*---시간 변경 핸들러----------------------------*/
    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    /*---데이터 전송 핸들러----------------------------*/
    const handleSubmit = async () => {
        if (!isNextEnabled()) {
            alert("날짜, 주차, 시간을 모두 선택해주세요.");
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
    
        // 날짜와 시간을 합쳐서 'YYYY-MM-DD HH:mm:ss' 형식으로 변환
        const roomStartDate = `${moment(value).format('YYYY-MM-DD')} ${selectedTime}:00`;
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/genebang/step5`,
                null, // 데이터 없이 쿼리 파라미터를 통해 전송
                {
                    params: {
                        roomNum, // URL에서 추출한 roomNum 사용
                        roomStartDate, // 시작 날짜와 시간
                        challengePeriod: selectedWeek, // 숫자로 저장됨 (1, 2, 3, 4 중 하나)
                    },
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더 추가
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            console.log("응답 데이터:", response.data);
    
            if (response.data.result === 'success') {
                alert("챌린지 시작 정보가 저장되었습니다.");
                navigate(`/genebang/step6/${roomNum}`); // 다음 스텝으로 이동
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error("데이터 전송 중 오류 발생:", error);
            console.error("요청 URL:", error.config.url);
            console.error("요청 데이터:", error.config.params);
            console.error("응답 상태 코드:", error.response?.status);
            console.error("응답 데이터:", error.response?.data || "응답 본문이 없습니다.");
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };
    

    return (
        <>
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step5">
                    <StepNav idx={5} /> {/* StepNav 포함 */}

                    <div id="board">
                        <div id="stepList">
                            <div id="list-head">
                                <h2>시간 날짜를 선택해주세요.</h2>
                                <h4>챌린지 시작일은 오늘로부터 최소 이틀 뒤부터 설정 합니다</h4>
                            </div>
                            <div id="list-head">
                                <h2>챌린지 기간을 설정해 주세요.</h2>
                                <h4>챌린지를 진행할 기간을 설정합니다</h4>
                            </div>
                        </div>

                        <div id="stepList">
                            <div id="list-left">
                                {/* 날짜 선택 */}
                                <Calendar
                                    tileDisabled={tileDisabled}
                                    onChange={setValue}
                                    value={value}
                                    formatDay={(locale, date) => moment(date).format("DD")}
                                />
                                {value && (
                                    <div className="selected-date">
                                        선택된 날짜: {moment(value).format('YYYY-MM-DD')}
                                    </div>
                                )}
                            </div>

                            <div id="list-left">
                                {/* 주차 선택 */}
                                <div id="week">
                                    {['1 주간', '2 주간', '3 주간', '4 주간'].map((week, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleWeekClick(index)} // index 전달
                                            className={selectedWeek === index + 1 ? 'selected' : ''} // index + 1과 비교
                                        >
                                            {week} 챌린지 진행하기
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div id="list-left">
                                {/* 시간 선택 */}
                                <h3>챌린지 시작 시간을 선택해주세요.</h3>
                                <select
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                >
                                    <option value="">시간 선택</option>
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={`${i}:00`}>
                                            {`${i}:00`}
                                        </option>
                                    ))}
                                </select>
                                {selectedTime && (
                                    <div className="selected-time">
                                        선택된 시간: {selectedTime}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="btn">
                        <button id="secondary" onClick={() => navigate(`/genebang/step4/${roomNum}`)}>이전</button>
                            <button
                                id="primary"
                                onClick={handleSubmit}
                                disabled={!isNextEnabled()}
                                className={!isNextEnabled() ? 'disabled' : ''}
                                aria-disabled={!isNextEnabled()}
                                title={!isNextEnabled() ? '날짜와 주차, 시간을 모두 선택해주세요.' : ''}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footert />
        </>
    );
};

export default Step05;
