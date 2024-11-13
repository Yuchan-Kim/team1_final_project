import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchIcon from '@rsuite/icons/Search';
import SortDescIcon from '@rsuite/icons/SortDesc';
import SendIcon from '@rsuite/icons/Send';

import '../../css/reset.css';
import '../../css/jy_main.css';

import Header from '../include/DH_Header';

const Main = () => {
    const navigate = useNavigate();

    const handleStep = () => {
        navigate('/genebang/step1');
    };
    const handleSearch = () => {
        navigate('/mainlist');
    };

    const [score, setScore] = useState([
        { item: "item1", score: 10, image: "/img/banner.jpg", title: "최근에 챌린지 1" },
        { item: "item2", score: 20, image: "/img/banner.jpg", title: "종료된 챌린지 2" },
        { item: "item3", score: 64, image: "/img/banner.jpg", title: "입니다 챌린지 3" }
    ]);






    return (
        <>
            <Header />

            <div id="jy_wrap" className="jy_wrap">

                <div id="container">

                    <div className="jy_main" id="jy_main">
                        <div id="board">

                            <div id='search'>
                                <div onClick={handleSearch}><SearchIcon /><input placeholder='Search' /></div>
                            </div>

                            {/* //search */}

                            <div id='ad-banner'>
                                <img src="./img/banner.jpg" alt="banner" />
                            </div>
                            {/* //ad-banner */}

                            <div id='ad-bang'>
                                {score.map((item, idx) => (
                                    <div className='ad-bang-list' key={idx}>
                                        
                                        <div className="ad-bang-image">
                                            <img src={item.image} alt={item.title} width="100" height="100" style={{ objectFit: 'cover', borderRadius: '8px' }} />
                                        </div> {/* 이미지 */}

                                        <div className="ad-bang-title">{item.title}</div> {/* 챌린지 제목 */}

                                        <div className="ad-bang-score">
                                            <svg className="circle_progress" width="60" height="60" viewBox="0 0 60 60">
                                                <circle className="frame" cx="30" cy="30" r="27" strokeWidth="6" />
                                                <circle className="bar" cx="30" cy="30" r="27" strokeWidth="6" />
                                            </svg>
                                            <strong className="value">{item.score}%</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* //ad-bang */}

                            <div id='icon-bar'>
                                <div><span>운동</span></div>
                                <div><span>독서</span></div>
                                <div><span>스터디</span></div>
                                <div><span>생활루틴</span></div>
                                <div><span>취미</span></div>
                            </div> {/* //icon-bar */}

                            <div id="list">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div className='list_bang'>
                                        <div className='bang_level'>
                                            <div>챌린지 / 일반</div>
                                        </div>

                                        <div className='bang_img'>
                                            <img src="./img/banner.jpg" alt="bang-banner" />
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
                                            <div className="tab01">#운동</div>
                                            <div className="tab02">#달리기</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button id="seconday" onClick={handleStep}><span><SendIcon size="5em" /><br />방 생성</span></button>
                            </div>

                        </div>
                        {/* //board */}

                    </div>
                    {/* //main */}

                </div>
                {/* //container */}

            </div>
            {/* //wrap */}
        </>
    );
}

export default Main;
