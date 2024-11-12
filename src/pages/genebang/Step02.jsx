//import 라이브러리

import React from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
// import { IoBook } from "react-icons/io5";
// import { CiDumbbell } from "react-icons/ci";
// import { CiFaceSmile } from "react-icons/ci";
// import { CiForkAndKnife } from "react-icons/ci";
// import { CiBatteryCharging } from "react-icons/ci";


const Step02 = () => {

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


                    <div className="step" id="step2">

                        <StepNav idx={2} />

                        <div id="board">

                            <h2>카테고리를 선택 해주세요.</h2>
                            <h4>방의 카테고리를 설정합니다.</h4>

                            <div id="list">

                                <div>
                                    <div id="category">
                                        <div>운동</div>
                                        <div>독서</div>
                                        <div>스터디</div>
                                        <div>생활루틴</div>
                                        <div>취미</div>
                                    </div>
                                </div>

                                <div id="keyword">
                                    <h3>키워드</h3>
                                    <div>
                                        <input placeholder='윗몸일으키기 ' /><CloseOutlineIcon />
                                    </div>
                                    <h4>챌린지 방만의 키워드를 만들어 보세요.</h4>
                                    <h4>인원을 모집하는데 유용합니다.</h4>
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

export default Step02;