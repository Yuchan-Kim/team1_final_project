//import 라이브러리

import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

// import { StepNav } from '../include/StepNav';



const Step10 = () => {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/');
    };
    const handleNext = () => {
        navigate('/cmain');
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

                                <button id="secondary">취소</button>
                                <button id="secondary" onClick={handleCancel}>버리기</button>
                                <button id="primary"  onClick={handleCancel}>저장하기</button>
                            
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