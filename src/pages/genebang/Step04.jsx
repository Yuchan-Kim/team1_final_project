//import 라이브러리

import React from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';



const Step04 = () => {

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


                    <div className="step" id="step4">

                        <StepNav idx={4} />

                        <div id="board">



                            <div id="list">

                                <div>
                                    <h2>세부 설정</h2>
                                    <h4>방에 필요한 세부적인 설정을 할 수 있습니다.</h4>
                                </div>
                                <div id='member-count'>
                                    <div>
                                        <h3>인원 설정</h3>
                                    </div>
                                    <div id='box-double'>
                                        <div id='box1'>
                                            <div>최대 참여 인원</div>
                                            <div>
                                                <input placeholder='20' />
                                            </div>
                                        </div>
                                        <div id='box1'>
                                            <div>최소 참여 인원 설정</div>
                                            <div>
                                                <input placeholder='4' />
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div id='box2'>
                                    <h3>입장 포인트 설정</h3>
                                    <h4>방에 입장하기 위해서는 일정량의 포인트가 필요합니다.</h4>
                                    <input placeholder='value' />
                                </div>
                                <div>
                                    <h3>입장 성실도 설정</h3>
                                    <div id='box1'>
                                        <div>입장 성실도 설정</div>
                                        <div>
                                            <input placeholder='4.5' />
                                        </div>
                                    </div>
                                </div>
                                <div id='box2'>
                                    <h3>지역 설정</h3>
                                    <h4>모임이 필요한 챌린지를 위해 지역을 설정 합니다.</h4>
                                    <div>
                                        <div>지역 설정</div>
                                        <div>
                                            <input placeholder='전국' />
                                        </div>
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

export default Step04;