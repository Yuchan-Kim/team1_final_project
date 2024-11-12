//import 라이브러리

import React from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

import CloseOutlineIcon from '@rsuite/icons/CloseOutline';


const Step03 = () => {

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


                    <div className="step" id="step3">

                        <StepNav idx={3} />

                        <div id="board">



                            <div id="list">

                                <div id='input-Thumbnail'>
                                    <h2>대표 이미지를 설정 해주세요.</h2>
                                    <div id='upload-Thumbnail'><div></div><img src="./public/img/banner.jpg" alt="upload-Thumbnail" /></div>
                                </div>

                                <div>
                                    <div id='input-title' className='input-title'>
                                        <h2>제목을 지어주세요.</h2>
                                        <h4>챌린지의 목표가 포함된 제목을 지어주세요.</h4>
                                        <h4>참가자가 혼동할 수 있습니다.</h4>
                                        <div>
                                            <input placeholder='윗몸일으키기 마스터' /><CloseOutlineIcon />
                                        </div>
                                    </div>

                                    <div id='input-title'>
                                        <h2>다른 참가자에게 챌린지를 설명해주세요.</h2>
                                        <div>설명(50자 이내)</div>
                                        <textarea placeholder='방에 대해 설명해 주세요.' ></textarea>
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

export default Step03;