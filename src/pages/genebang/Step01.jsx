//import 라이브러리

import React from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

import CheckRoundIcon from '@rsuite/icons/CheckRound';



const Step01 = () => {

    /*---라우터 관련-------------------------------*/

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    /*---일반 변수--------------------------------*/

    /*---일반 메소드 -----------------------------*/

    /*---훅(useEffect)+이벤트(handle)메소드-------*/

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

                                <div id="list-left">
                                    <h3>일반</h3>
                                    <ul>
                                        <li><span><CheckRoundIcon /></span><span>최소 입장 인원 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>지역 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최종 목표 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>AI 그룹 챌린지 추가 가능</span></li>
                                    </ul>
                                </div>
                                
                                <div id="list-right">
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

                                <button id="seconday">취소</button>
                                <button id="primary">다음</button>
                            
                            
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