// src/pages/genebang/Step07.jsx


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step07 = ({ onNext, onPrevious }) => {

    const navigate = useNavigate();

    const authUserNum = 10;
    // const authUser = JSON.parse(localStorage.getItem('authUser'));

    const [roomNum, setRoomNum] = useState();


    /*---상태 관리-------------------------*/
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [evaluationType, setEvaluationType] = useState(null);

    // 방장 평가와 전체 평가 중 하나만 선택할 수 있도록 하는 함수
    const handleEvaluationClick = (evaluation) => {
        setSelectedEvaluation(evaluation);
        if (evaluation === '방장 평가') {
            setEvaluationType(0);  // 상태 업데이트
        } else if (evaluation === '전체 평가') {
            setEvaluationType(1);  // 상태 업데이트
        }
        console.log(evaluation);
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


    const handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append('roomNum', roomNum);
        formData.append('evaluationType', evaluationType); //
        

        const dayMapping = {
            "월요일": 1,
            "화요일": 2,
            "수요일": 3,
            "목요일": 4,
            "금요일": 5,
            "토요일": 6,
            "일요일": 7
        };
        
        // roomDayNum 배열의 각 요일을 숫자로 변환
        const roomDayNumInt = selectedDays.map(day => dayMapping[day]);

        console.log(roomDayNumInt);

        formData.append('roomDayNum', roomDayNumInt); //방요일 넘버


        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step7`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                // navigate('/genebang/step8');
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
                    <div className="step" id="step7">
                        <StepNav idx={7} /> {/* StepNav 포함 */}
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
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

                                <div className="btn">
                                    <button id="secondary" onClick={onPrevious}>이전</button>
                                    <button 
                                        id="primary" 
                                        onClick={onNext} 
                                        disabled={!isNextEnabled()}
                                        className={!isNextEnabled() ? 'disabled' : ''}
                                        aria-disabled={!isNextEnabled()}
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

export default Step07;
