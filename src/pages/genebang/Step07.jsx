//import 라이브러리

import React from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';



const Step07 = () => {

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


                    <div id="aside">

                    </div>
                    {/* //aside */}


                    <div className="step" id="step7">

                        <StepNav idx={7} />

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
                                        <div>방장 평가</div>
                                        <div>전체 평가</div>
                                    </div>
                                    <div id='category'>
                                        <div>일요일</div>
                                        <div>월요일</div>
                                        <div>화요일</div>
                                        <div>수요일</div>
                                        <div>목요일</div>
                                        <div>금요일</div>
                                        <div>토요일</div>
                                    </div>
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

export default Step07;