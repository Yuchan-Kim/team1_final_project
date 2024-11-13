//import 라이브러리

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

import CheckRoundIcon from '@rsuite/icons/CheckRound';



const Step01 = () => {

    /*---라우터 관련-------------------------------*/

    const navigate = useNavigate();

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    //선택된 리스트 관리
    const [selected, setSelected] = useState(null);

    //왼쪽(일반)과 오른쪽(챌린지)의 선택 항목 관리


    /*---일반 변수--------------------------------*/

    /*---일반 메소드 -----------------------------*/

    // 리스트 클릭 이벤트 처리
    const handleClick = (listType) => {
        setSelected(listType);  // 왼쪽(list-left) 또는 오른쪽(list-right) 선택
    };


    /*---훅(useEffect)+이벤트(handle)메소드-------*/

    const handleCancel = () => {
        navigate('/genebang/step10');
    };
    const handleNext = () => {
        navigate('/genebang/step2');
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


                    <div className="step" id="step1">

                        <StepNav idx={1} />

                        <div id="board">

                            <h2>챌린지 종류를 선택해 주세요.</h2>

                            <div id="list">
                                {/* 왼쪽 리스트 */}
                                <div
                                    id="list-left"
                                    className={selected === 'left' ? 'selected' : ''}
                                    onClick={() => handleClick('left')}
                                >
                                    <h3>일반</h3>
                                    <ul>
                                        <li><span><CheckRoundIcon /></span><span>최소 입장 인원 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>지역 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최종 목표 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>AI 그룹 챌린지 추가 가능</span></li>
                                    </ul>
                                </div>

                                {/* 오른쪽 리스트 */}
                                <div
                                    id="list-right"
                                    className={selected === 'right' ? 'selected' : ''}
                                    onClick={() => handleClick('right')}
                                >
                                    <h3>챌린지</h3>
                                    <ul>
                                        <li><span><CheckRoundIcon /></span><span>입장 포인트 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최소 입장 인원 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>지역 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최종 목표 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>AI 그룹 챌린지 추가 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>입장 성실도 설정 가능</span></li>
                                    </ul>
                                </div>

                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button id="seconday" onClick={handleCancel}>취소</button>
                                <button id="primary" onClick={handleNext}>다음</button>
                            </div>

                        </div>
                        {/* //board */}

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

export default Step01;