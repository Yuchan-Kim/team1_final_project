//import 라이브러리
import { Link } from 'react-router-dom';
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
            <div id="jy_wrap" className="jy_wrap">


                
                {/* //header + //nav */}


                    {/* <div id="aside">

                    </div> */}
                    {/* //aside */}


                    <div className="jy_main" id="jy_main">

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
                                    <div className='jm-Category-select'>
                                        <span>카테고리</span>
                                        <select>
                                            <option value="all">전체</option>
                                            <option value="1">운동</option>
                                            <option value="2">독서</option>
                                            <option value="3">스터디</option>
                                            <option value="4">생활루틴</option>
                                        </select>
                                    </div>
                                    <div className='jm-date-select'>
                                    <span>기간</span>
                                        <select>
                                            <option value="all">전체</option>
                                            <option value="1">1주</option>
                                            <option value="2">2주</option>
                                            <option value="3">3주</option>
                                            <option value="4">4주</option>
                                        </select>
                                    </div>
                                    <div className='jm-region-select'>
                                        <span>지역</span>
                                        <select>
                                            <option value="all">전체</option>
                                            <option value="1">서울</option>
                                            <option value="2">경기</option>
                                            <option value="3">비빔밥</option>
                                            <option value="4">부산</option>
                                        </select>
                                    </div>
                                </div>
                                
                            </div>
                            {/* //search-bar */}


                            <div id="list">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div>
                                <Link to="/cmain" className='list_bang'>
                                    <div className='bang_level'>
                                        <div>챌린지 / 일반</div>
                                    </div>

                                    <div className='bang_img'>
                                        <img src="./img/banner.jpg" alt="bang-banner" />
                                    </div>

                                    <div className='jm-main-room-tatle'>대상혁찬양방</div>
                                    <div className='jm-main-room-date'><span>예상시작일</span> 2024-11-11</div>
                                    <div className='jm-main-room-date'><span>기간</span> 4주</div>
                                    <div className='bang_info'>
                                        <div className='bang_info_left'>
                                            <div><span>인원</span> 1/20</div>
                                        </div>
                                        <div className='bang_info_right'>
                                            <div><span>포인트</span> ALL-IN pt</div>
                                        </div>
                                    </div>

                                    <div className='bang_sub'>
                                        <span className="tab01">#운동</span>
                                        <span className="tab01">#달리기</span>
                                        <span className="tab01">#전국</span>
                                    </div>
                                </Link>
                                </div>
                            ))}



                            </div>
                            {/* //list */}


                            <div className="btn">

                                <button id="seconday"><span><SendIcon size="5em" /><br/>방 생성</span></button>

                            </div>

                    </div>
                    {/* //main  */}

                {/* <Footer /> */}
                {/* //footer */}

            </div>
            {/* //wrap */}

        </>

    );

}

export default Mainlist;