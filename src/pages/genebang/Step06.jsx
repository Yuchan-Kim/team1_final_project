//import 라이브러리

import React from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';



const Step06 = () => {

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


                    <div className="step" id="step6">

                        <StepNav idx={6} />

                        <div id="board">

                            <div id="list">

                                <div id='mission'>
                                    <div className="mission-header">
                                        <div>
                                            <h2>미션을 생성해 주세요.</h2>
                                            <h4>미션은 최대 5개까지 생성할 수 있습니다.</h4>
                                        </div>
                                        <div id='mission-btn'><button>미션 추가</button></div>
                                    </div>
                                    
                                    <div className="input-button-group">
                                        <div id='input-box'>
                                            <input placeholder='AI 추천 미션' />
                                        </div>
                                        {/* <input placeholder='AI 추천 미션' /> */}
                                        <button>이미지 추가</button>
                                    </div>

                                    <div id='mission-img'>
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                    </div>
                                    <div id='mission-textarea'><textarea placeholder='인증 방법을 입력해주세요'></textarea></div>
                                </div>


                                <div id='mission'>
                                    <div id='mission-head'>
                                        <h2>최종 목표를 설정 하시겠습니까?</h2>
                                        <h4>생성된 방에 대한 최종 목표를 설정할 수 있습니다. 그리고 최종 목표는 방장이 평가합니다.</h4>
                                    </div>

                                    <div className='input-button-group'>
                                        <div>
                                            <div id='mission-title '>최종 목표 설정 (100자 이내)</div>
                                            <div id='input-box'><input placeholder='value' /></div>
                                        </div>
                                        <div>
                                            <div id='mission-title'>최종 목표 평가일</div>
                                            <div id='input-box'><input placeholder='value' /></div>
                                        </div>
                                        <div>
                                            <button>이미지 추가</button>
                                        </div>

                                    </div>
                                    
                                    
                                    <div id='mission-img'>
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                        <input placeholder='사진' />
                                    </div>
                                    <div id='mission-textarea'><textarea placeholder='인증 방법을 입력해주세요'></textarea></div>
                                </div>

                                <div id='mission-content'>
                                    <div>
                                        <h2>미션에 대한 유의사항을 적어주세요.</h2>
                                        <h4>미션 인증 방법에 대해 구체적인 추가사항을 적을 수 있습니다.</h4>
                                        <div id='mission-textarea'>
                                            <textarea>이곳에 입력하세요.</textarea>
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

export default Step06;