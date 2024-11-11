//import 라이브러리

import {React , useState} from 'react';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const Step05 = () => {
    const [value, onChange] = useState(new Date());


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


                    {/* <div id="aside">

                    </div> */}
                    {/* //aside */}


                    <div className="step" id="step5">

                        <StepNav idx={5} />

                        <div id="board">



                            <div id="stepList">

                                <div id='list-left'>
                                    <h2>시간 날짜를 선택해주세요.</h2>
                                    <h4>챌린지 시작일은 오늘로부터 최소 이틀뒤부터 설정 합니다</h4>
                                    <div>시작날짜</div>
                                    <div>
                                    <Calendar 
                                    formatDay={(locale, date) => moment(date).format("DD")}
                                    onChange={onChange} value={value} 
                                    />
                                    </div>
                                </div>

                                <div id='list-left'>
                                    <h2>챌린지 기간을 설정해 주세요.</h2>
                                    <h4>챌린지를 진행할 기간을 설정합니다</h4>
                                    <div id='week'>
                                        <div>1 주간 챌린지 진행하기</div>
                                        <div>2 주간 챌린지 진행하기</div>
                                        <div>3 주간 챌린지 진행하기</div>
                                        <div>4 주간 챌린지 진행하기</div>
                                    </div>
                                </div>
 
                            </div>
                            {/* //list */}

                            
                        </div>
                        {/* //board */}
                        <div className="btn">
                            <button id="seconday">취소</button>
                            <button id="primary">다음</button>
                        </div>
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

export default Step05;