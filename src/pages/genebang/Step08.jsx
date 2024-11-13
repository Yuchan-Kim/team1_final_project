//import 라이브러리

import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';



const Step08 = () => {

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
        navigate('/genebang/step9');
    };





    return (

        <>

            <div id="jy_step" className="jy_wrap">

                {/* <Header /> */}
                {/* //header + //nav */}


                <div id="container" >


                    <div id="aside">

                    </div>
                    {/* //aside */}


                    <div className="step" id="step8">

                        <StepNav idx={8} />

                        <div id="board">

                            <div id="list">

                                <h2>AI 추천 그룹 챌린지</h2>
                                <h4>사용자가 입력한 미션을 기반으로 그룹 첼린지를 제시합니다.</h4>
                                <h4>AI는 실수할 수 있습니다.</h4>
                                {/* <h4>인간 시대의 끝이 도달했다.</h4> */}

                                <div id='ai-select'>

                                    <div id='ai-box'>
                                        <div id='ai-title'>
                                            <div>AI 추천 챌린지 (난이도: 하)</div>
                                            <div id='ai-point'>200,000pt</div>
                                        </div>
                                        <div>Supporting line text lorem ipsum dolor sit</div>
                                        <div>amet, consectetur</div>
                                        <div><button>수락</button></div>
                                    </div>

                                    <div id='ai-box'>
                                        <div id='ai-title'>
                                            <div>AI 추천 챌린지 (난이도: 중)</div>
                                            <div id='ai-point'>200,000pt</div>
                                        </div>
                                        <div>Supporting line text lorem ipsum dolor sit</div>
                                        <div>amet, consectetur</div>
                                        <div><button>수락</button></div>
                                    </div>

                                    <div id='ai-box'>
                                        <div id='ai-title'>
                                            <div>AI 추천 챌린지 (난이도: 상)</div>
                                            <div id='ai-point'>200,000pt</div>
                                        </div>
                                        <div>Supporting line text lorem ipsum dolor sit</div>
                                        <div>amet, consectetur</div>
                                        <div><button>수락</button></div>
                                    </div>

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

export default Step08;