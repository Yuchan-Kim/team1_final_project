//import 라이브러리

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const Step05 = () => {
    const [value, onChange] = useState(new Date());

    const [selectedWeek, setSelectedWeek] = useState(null); // 선택된 주차를 추적할 상태 변수

    // 주간 항목을 클릭했을 때 호출되는 함수
    const handleWeekClick = (week) => {
        setSelectedWeek(week); // 클릭된 주차를 상태에 저장
    };

    /*---라우터 관련-------------------------------*/

    const navigate = useNavigate();

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    /*---일반 변수--------------------------------*/

    /*---일반 메소드 -----------------------------*/

    /*---훅(useEffect)+이벤트(handle)메소드-------*/

    const handleCancel = () => {
        navigate('/genebang/step10');
    };
    const handleNext = () => {
        navigate('/genebang/step6');
    };





    return (

        <>

            <div id="jy_step" className="jy_wrap">

                {/* <Header /> */}
                {/* //header + //nav */}


                <div id="container" >


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
                                    
                                    {/* <div>시작날짜</div>
                                    <div><input placeholder='value' /></div> */}
                                    <div>
                                    <Calendar
                                    formatDay={(locale, date) => moment(date).format("DD")}
                                    onChange={onChange} value={value}
                                    />
                                    </div>
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

                            
                        </div>
                        {/* //board */}


                        <div className="btn">
                                <button id="seconday" onClick={handleCancel}>취소</button>
                                <button id="primary" onClick={handleNext}>다음</button>
                        </div>




                    </div>
                    {/* //step  */}



                </div>
                {/* //container  */}


                {/* <Footer /> */}
                {/* //footer */}

            </div>
            {/* //wrap */}

        </>

    );

}

export default Step05;