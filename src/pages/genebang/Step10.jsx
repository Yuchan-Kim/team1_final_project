//import 라이브러리

import React from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

// import { StepNav } from '../include/StepNav';



const Step10 = () => {

    /*---라우터 관련-------------------------------*/

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    /*---일반 변수--------------------------------*/

    /*---일반 메소드 -----------------------------*/

    /*---훅(useEffect)+이벤트(handle)메소드-------*/

    return (

        <>

            <div id="wrap">

                {/* <Header /> */}
                {/* //header + //nav */}


                <div id="container" >


                    <div id="aside">

                    </div>
                    {/* //aside */}


                    <div className="step" id="step10">

                        {/* <StepNav idx="9" /> */}

                        <div id="board">

                            <div id="list">

                                <div>
                                    <h2>작성한 내용은 임시저장 됩니다</h2>
                                </div>
                                

                            </div>
                            {/* //list */}

                            <div className="btn">

                                <button id="seconday">취소</button>
                                <button id="seconday">버리기</button>
                                <button id="primary">저장하기</button>
                            
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

export default Step10;