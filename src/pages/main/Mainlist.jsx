//import 라이브러리

import {React , useState} from 'react';
import SearchIcon from '@rsuite/icons/Search';
import SortDescIcon from '@rsuite/icons/SortDesc';
import SendIcon from '@rsuite/icons/Send';


import '../../css/reset.css';
import '../../css/jy_main.css';

import Header from '../include/DH_Header';


const Mainlist = () => {

    /*---라우터 관련-------------------------------*/

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    /*---일반 변수--------------------------------*/

    /*---일반 메소드 -----------------------------*/

    /*---훅(useEffect)+이벤트(handle)메소드-------*/

    return (

        <>
            <Header />

            <div id="wrap" className="wrap">

                
                {/* //header + //nav */}


                <div id="container">


                    {/* <div id="aside">

                    </div> */}
                    {/* //aside */}


                    <div className="jy_main" id="jy_main">


                        <div id="board">

                            <div id='search'>
                                <div><SearchIcon/><input placeholder='Search' /></div>
                            </div>


                            <div id='search-bar'>
                                <div id='search-bar1'>
                                    <div><SortDescIcon/></div>
                                    <div><input type="radio" hidden checked id="menu01" name="searchMenu" /><label htmlFor="menu01"><span className="radioBtn"></span>일반</label></div>
                                    <div><input type="radio" hidden id="menu02" name="searchMenu" /><label htmlFor="menu02"><span className="radioBtn"></span>챌린지</label></div>
                                </div>

                                <div id='search-bar2'>
                                    <div>
                                        <div className="inputTT"><label htmlFor="">카테고리</label></div><div className="inputBox"><select name="" id=""></select></div>
                                    </div>
                                    <div>
                                        <div className="inputTT"><label htmlFor="">키워드</label></div><div className="inputBox"><input type="text" /></div>
                                    </div>
                                    <div>
                                        <div className="inputTT"><label htmlFor="">기간</label></div><div className="inputBox"><select name="" id=""></select></div>
                                    </div>
                                    <div>
                                        <div className="inputTT"><label htmlFor="">지역</label></div><div className="inputBox"><select name="" id=""></select></div>
                                    </div>
                                </div>
                                
                            </div>
                            {/* //search-bar */}


                            <div id="list">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div className='list_bang'>
                                    <div className='bang_level'>
                                        <div>챌린지 / 일반</div>
                                    </div>
                                    
                                    <div className='bang_img'>
                                        <img src="./img/banner.jpg" alt="" />
                                    </div>

                                    <div className='bang_info'>

                                        <div className='bang_info_left'>
                                            <div><span>방제목</span> 대상혁찬양방</div>
                                            <div><span>지역</span>월드</div>
                                            <div><span>인원</span> 1/10000</div>
                                        </div>
                                        <div className='bang_info_right'>
                                            <div><span>예상시작일</span> 2024-11-11</div>
                                            <div><span>기간</span> 4주</div>
                                            <div><span>포인트</span> ALL-IN pt</div>
                                        </div>

                                    </div>

                                    <div className='bang_sub'>
                                        <div class="tab01">#운동</div>
                                        <div class="tab02">#달리기</div>
                                    </div>


                                </div>
                            ))}



                            </div>
                            {/* //list */}


                            <div className="btn">

                                <button id="seconday"><span><SendIcon size="5em" /><br/>방 생성</span></button>

                            </div>

                        </div>
                        {/* //board */}

                    </div>
                    {/* //main  */}

                </div>
                {/* //container  */}


                {/* <Footer /> */}
                {/* //footer */}

            </div>
            {/* //wrap */}

        </>

    );

}

export default Mainlist;