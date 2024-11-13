//import 라이브러리

import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

// import { StepNav } from '../include/StepNav';



const Step09 = ({ onPrevious, closeModal }) => {

    /*---라우터 관련-------------------------------*/

    const navigate = useNavigate();

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    /*---일반 변수--------------------------------*/

    /*---일반 메소드 -----------------------------*/

    /*---훅(useEffect)+이벤트(handle)메소드-------*/

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


                    <div className="step" id="step9">

                        {/* <StepNav idx="9" /> */}

                        <div id="board">

                            <div id="list">

                                <div>
                                    <h2>챌린지 생성이 완료 되었습니다.</h2>
                                </div>
                                

                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button id="secondary" onClick={handleCancel}>메인으로 가기</button>
                                <button id="primary" onClick={handleNext}>챌린지로 가기</button>
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

export default Step09;